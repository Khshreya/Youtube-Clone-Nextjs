import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("session_id")?.value;
  const pathname = request.nextUrl.pathname;

  const authPages =
    pathname === "/login" || pathname === "/register";

  //  ALL PROTECTED ROUTES
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

  //  Not logged in → block protected pages
  if (!sessionId && isProtected) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  //  Logged in → block login/register
  if (sessionId && authPages) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
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
