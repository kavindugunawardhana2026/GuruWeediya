"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

// ─── Types ───────────────────────────────────────────────────

export interface AuthResult {
  error?: string;
  success?: boolean;
}

// ─── SIGNUP ──────────────────────────────────────────────────

export async function signup(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as UserRole;
  const fullName = formData.get("fullName") as string;

  // Validate inputs
  if (!email || !password || !role) {
    return { error: "Email, password, and role are required." };
  }

  if (!["teacher", "institute"].includes(role)) {
    return { error: "Invalid role selected." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        full_name: fullName,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "Failed to create account. Please try again." };
  }

  // Create user record in our users table
  const { error: userError } = await supabase.from("users").insert({
    id: authData.user.id,
    email,
    role,
  } as any);

  if (userError) {
    return { error: userError.message };
  }

  // Create role-specific profile
  if (role === "teacher") {
    const { error: profileError } = await supabase.from("teachers").insert({
      user_id: authData.user.id,
      full_name: fullName || email.split("@")[0],
      subjects: [],
      mediums: [],
      districts: [],
    } as any);

    if (profileError) {
      return { error: profileError.message };
    }
  } else if (role === "institute") {
    const instituteName = formData.get("instituteName") as string;
    const { error: profileError } = await supabase.from("institutes").insert({
      user_id: authData.user.id,
      institute_name: instituteName || "My Institute",
    } as any);

    if (profileError) {
      return { error: profileError.message };
    }
  }

  // Redirect to the appropriate dashboard
  redirect(`/${role}/dashboard`);
}

// ─── LOGIN ───────────────────────────────────────────────────

export async function login(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirect") as string | null;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    return { error: authError.message };
  }

  // Fetch user role for redirect
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication failed." };
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  // @ts-ignore
  const role = (userData as any)?.role || "teacher";

  // Redirect to the intended page or role-based dashboard
  redirect(redirectTo || `/${role}/dashboard`);
}

// ─── LOGOUT ──────────────────────────────────────────────────

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

// ─── GET CURRENT USER WITH PROFILE ───────────────────────────

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!userData) return null;

  // Fetch role-specific profile
  let profile = null;

  // @ts-ignore
  if ((userData as any).role === "teacher") {
    const { data } = await supabase
      .from("teachers")
      .select("*")
      .eq("user_id", user.id)
      .single();
    profile = data;
  // @ts-ignore
  } else if ((userData as any).role === "institute") {
    const { data } = await supabase
      .from("institutes")
      .select("*")
      .eq("user_id", user.id)
      .single();
    profile = data;
  }

  return {
    ...(userData as any),
    profile,
  };
}

// ─── PASSWORD RESET ──────────────────────────────────────────

export async function resetPasswordForEmail(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required." };
  }

  // The redirectTo URL must be configured in your Supabase project settings
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updatePassword(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { error: "Both password fields are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
