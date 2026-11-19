import { NextResponse, type NextRequest } from "next/server";
import { verifyEdgeSessionToken, SESSION_COOKIE_NAME } from "@/shared/auth/edge-session";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Read native session cookie
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = sessionToken ? await verifyEdgeSessionToken(sessionToken) : null;

  // Protect vendor studio routes
  if (
    pathname.startsWith("/vendor/dashboard") ||
    pathname.startsWith("/vendor/products") ||
    pathname.startsWith("/vendor/orders") ||
    pathname.startsWith("/vendor/payouts")
  ) {
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (session.role !== "VENDOR" && session.role !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = "/vendor/onboarding";
      return NextResponse.redirect(url);
    }
  }

  // Protect admin routes: strictly require ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (session.role !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
