// ============================================================
// GuruWeediya.lk — Proxy (replaces middleware in Next.js 16)
// ============================================================
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes that require authentication
const protectedRoutes = ["/teacher", "/institute", "/admin"];
// Routes only accessible when NOT logged in
const authRoutes = ["/auth/login", "/auth/signup"];

export async function proxy(request: NextRequest) {
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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ─── Protect dashboard routes ─────────────────────────────
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ─── Redirect logged-in users away from auth pages ────────
  if (authRoutes.some((route) => pathname.startsWith(route)) && user) {
    // Fetch user role to redirect to correct dashboard
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    // @ts-ignore - Supabase type inference issue
    const role = (userData as any)?.role || "teacher";
    const dashboardUrl = new URL(`/${role}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // ─── Role-based route access control ──────────────────────
  if (user && isProtectedRoute) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    // @ts-ignore - Supabase type inference issue
    const role = (userData as any)?.role || "teacher";

    // Prevent teachers from accessing institute routes and vice versa
    if (pathname.startsWith("/teacher") && role !== "teacher" && role !== "admin") {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
    if (pathname.startsWith("/institute") && role !== "institute" && role !== "admin") {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
