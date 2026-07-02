import { createClient } from "@/lib/supabase/server";
import NavbarClient from "./NavbarClient";
import type { UserRole } from "@/types/database";

// ─── Server wrapper: fetches auth state ──────────────────────

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: UserRole | null = null;
  let displayName: string | null = null;
  let avatarUrl: string | null = null;

  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("role, avatar_url")
      .eq("id", user.id)
      .single();

    // @ts-ignore
    role = ((userData as any)?.role as UserRole) || null;
    // @ts-ignore
    avatarUrl = (userData as any)?.avatar_url || null;

    // Get display name from role-specific table
    if (role === "teacher") {
      const { data } = await supabase
        .from("teachers")
        .select("full_name")
        .eq("user_id", user.id)
        .single();
      // @ts-ignore
      displayName = (data as any)?.full_name || user.email?.split("@")[0] || null;
    } else if (role === "institute") {
      const { data } = await supabase
        .from("institutes")
        .select("institute_name")
        .eq("user_id", user.id)
        .single();
      // @ts-ignore
      displayName = (data as any)?.institute_name || user.email?.split("@")[0] || null;
    } else {
      displayName = "Admin";
    }
  }

  return (
    <NavbarClient
      isLoggedIn={!!user}
      role={role}
      displayName={displayName}
      avatarUrl={avatarUrl}
      email={user?.email || null}
    />
  );
}
