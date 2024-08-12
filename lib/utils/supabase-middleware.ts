import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import prisma from "@/lib/prisma";

export async function updateSession(request: NextRequest, hostname: string, path: string) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const { data: { user } } = await supabase.auth.getUser();

  console.log("[MIDDLEWARE] User Data:", user?.role);

  // Handle requests for the app subdomain
  if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {

    // Case 1: If the user is authenticated but unpaid, redirect to checkout
    if (user && path !== "/checkout") {
      const { data, error } = await supabase
        .from("User")
        .select("paid")
        .eq("id", user.id)
        .single();
      
      console.log('[MIDDLEWARE] User paid status', data?.paid, user.id, user.email, error);

      if (error || !data?.paid) {
        console.log(request.url, hostname);
        return NextResponse.redirect(new URL("/checkout", request.url));
      }
    }

    const pathname = path.split('?')[0];

    // Case 2: If the user is authenticated, paid, but hasn't done onboarding
    console.log('[MIDDLEWARE] Current Pathname', pathname)
    if (user && pathname !== "/onboarding" && pathname !== "/checkout") {
      const { data, error } = await supabase
        .from("User")
        .select("email")
        .eq("id", user.id)
        .single();
      
      console.log('[MIDDLEWARE] User email status', data?.email);

      if (!data?.email) {
        console.log(request.url, hostname);
        return NextResponse.redirect(new URL("/onboarding?redirect=true", request.url));
      }
    }
    
    // If no user session, redirect to login
    if (!user && path !== "/login") {
      console.log("No user session, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    } 
    // If user is already logged in, redirect to home
    else if (user && path == "/login") {
      console.log("User already logged in, redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Rewrite URL for app domain
    console.log(`Redirecting to: ${new URL(`/app${path === "/" ? "" : path}`, request.url).href}`);
    return NextResponse.rewrite(
      new URL(`/app${path === "/" ? "" : path}`, request.url)
    );
  }

  // Handle requests for the main domain or localhost
  if (hostname === "localhost:3000" || hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {

    // If user is authenticated, rewrite to app path
    if (user) {
      console.log('Authenticated user with root domain');
      return NextResponse.rewrite(
        new URL(`/app${path === "/" ? "" : path}`, request.url)
      );
    }

    // Rewrite URL for home path
    console.log("Rewriting URL for home");
    return NextResponse.rewrite(
      new URL(`/home${path === "/" ? "" : path}`, request.url)
    );
  }

  // Default rewrite for other cases
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, request.url));

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
