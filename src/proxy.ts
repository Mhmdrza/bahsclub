import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PATH = "/admin";
const LOGIN_PATH = "/admin/login";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to admin routes
  if (!pathname.startsWith(ADMIN_PATH)) {
    return NextResponse.next();
  }

  // Allow the login page itself
  if (pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  // Check for the admin session cookie
  const sessionCookie = request.cookies.get("admin_session");

  if (!sessionCookie?.value) {
    // Redirect to login
    const loginUrl = new URL(LOGIN_PATH, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};