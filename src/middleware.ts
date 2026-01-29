import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for authentication and route protection
 *
 * This runs on Vercel Edge Runtime for fast, globally distributed execution
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for authentication token (session cookie)
  const sessionToken = request.cookies.get("auth_token")?.value;
  const isAuthenticated = !!sessionToken;

  // Define protected routes (require authentication)
  const protectedRoutes = [
    "/dashboard",
    "/budgets",
    "/pots",
    "/transactions",
    "/recurring-bills",
  ];

  // Define public routes (authentication not required)
  const publicRoutes = ["/login", "/signup", "/forgot-password"];

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current path is a public auth page
  const isPublicRoute = publicRoutes.includes(pathname);

  // PROTECTION: Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    // Save the original destination to redirect after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // CONVENIENCE: Redirect authenticated users away from login/signup pages
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ROOT PATH HANDLING: Redirect based on authentication status
  if (pathname === "/") {
    if (isAuthenticated) {
      // Authenticated users go to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      // Unauthenticated users go to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Matcher configuration
 * Excludes API routes, static files, and Next.js internals
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
  ],
};
