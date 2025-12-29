import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("session_id")?.value;
  const pathname = request.nextUrl.pathname;

  //  Always allow auth pages
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return NextResponse.next();
  }

  // Explicitly allow SOFT pages (no redirect ever)
  const softRoutes = [
    "/settings",
    "/history",
    "/watch-later",
    "/liked",
    "/subscriptions",
    "/upload",
    "/channel",
  ];

  if (softRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  //  ONLY truly private routes
  const hardProtectedRoutes = [
    "/channel",
    "/upload/details",
  ];

  if (
    !sessionId &&
    hardProtectedRoutes.some((route) =>
      pathname.startsWith(route)
    )
  ) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login/:path*",
    "/register/:path*",
    "/subscriptions/:path*",
    "/upload/:path*",
    "/upload/details/:path*",
    "/settings/:path*",
    "/history/:path*",
    "/watch-later/:path*",
    "/liked/:path*",
    "/channel/:path*",
  ],
};
