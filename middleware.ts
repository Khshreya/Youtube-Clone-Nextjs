import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("session_id")?.value;
  const pathname = request.nextUrl.pathname;


  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return NextResponse.next();
  }

  const protectedRoutes = [
    "/watch",
    "/subscriptions",
    "/history",
    "/watch-later",
    "/liked",
    "/shorts",
    "/music",
    "/trending",
    "/gaming",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!sessionId && isProtected) {
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
    "/watch/:path*",
    "/subscriptions/:path*",
    "/history/:path*",
    "/watch-later/:path*",
    "/liked/:path*",
    "/shorts/:path*",
    "/music/:path*",
    "/trending/:path*",
    "/gaming/:path*",
  ],
};
