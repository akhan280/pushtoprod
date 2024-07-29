import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  // console.log("Requested URL:", url.href);

  // let hostname = req.headers
  //   .get("host")!
  //   .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // TODO: unhardcode this (delete it and uncomment out what's above)
  let hostname = `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  // console.log("Processed Hostname:", hostname);

  if (
    hostname.includes("---") &&
    hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    hostname = `${hostname.split("---")[0]}.${
      process.env.NEXT_PUBLIC_ROOT_DOMAIN
    }`;
    // console.log("Special case hostname for Vercel preview:", hostname);
  }

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;
  // console.log("Path:", path);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: req.cookies }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // console.log("User Data:", user);
  // console.log("Hostname & Root Domain", hostname, process.env.NEXT_PUBLIC_ROOT_DOMAIN);

  if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    if (!user && path !== "/login") {
      // console.log("No user session, redirecting to login");
      return NextResponse.redirect(new URL("/login", req.url));
    } else if (user && path == "/login") {
      // console.log("User already logged in, redirecting to home");
      return NextResponse.redirect(new URL("/", req.url));
    }
    // console.log("Rewriting URL for app domain");
    return NextResponse.rewrite(
      new URL(`/app${path === "/" ? "" : path}`, req.url),
    );
  }

  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    // console.log("Rewriting URL for home");
    return NextResponse.rewrite(
      new URL(`/home${path === "/" ? "" : path}`, req.url),
    );
  }

  // console.log("Rewriting URL for other cases");
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
