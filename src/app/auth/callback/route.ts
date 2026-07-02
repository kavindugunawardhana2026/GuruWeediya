// ============================================================
// GuruWeediya.lk — Supabase Auth Callback Route Handler
// Handles OAuth and email confirmation callbacks
// ============================================================
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Fetch user role for redirect
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        // @ts-ignore - Supabase type inference issue with single()
        const role = (userData as any)?.role || "teacher";
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}/${role}/dashboard`);
        } else if (forwardedHost) {
          return NextResponse.redirect(
            `https://${forwardedHost}/${role}/dashboard`
          );
        } else {
          return NextResponse.redirect(`${origin}/${role}/dashboard`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error — redirect to login with error
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
}
