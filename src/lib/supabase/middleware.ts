import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );

          // @supabase/ssr 0.12 added this second argument, and it must be
          // applied. It carries Cache-Control: private, no-store and friends,
          // because a response that sets an auth cookie must never be cached
          // by a CDN or reverse proxy -- if one is, a session token belonging
          // to one user can be served to another.
          //
          // Dropping a parameter is not a type error, so nothing would have
          // caught this: the code compiled clean while silently discarding
          // them. Every route here builds as static and is CDN-served.
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  // Routes where authenticated users should NOT be redirected to dashboard
  const authFlowRoutes = ["/reset-password"];
  const isAuthFlowRoute = authFlowRoutes.includes(request.nextUrl.pathname);

  // Handle root path - redirect based on auth status
  if (request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = user ? "/dashboard" : "/login";
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users to login
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages (except auth flow routes like reset-password)
  if (user && isPublicRoute && !isAuthFlowRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
