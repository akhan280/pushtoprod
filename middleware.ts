import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/utils/supabase-middleware";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. /checkout
     * 6. All root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|public/|^[\\w-]+\\.\\w+$).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  let hostname = `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`

  // let hostname = 'localhost:3000';

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

  return await updateSession(req, hostname, path);
}
