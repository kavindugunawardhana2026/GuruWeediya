"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { JobInsert } from "@/types/database";

export interface ActionResult {
  success?: boolean;
  error?: string;
  message?: string;
}

// ─── Create a New Job ───────────────────────────────────────

export async function createJob(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated." };

  // First, get the institute ID for this user
  const { data: institute, error: instError } = await (supabase as any)
    .from("institutes")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (instError || !institute) {
    return { error: "Could not find your institute profile." };
  }

  const title = formData.get("title") as string;
  const subject = formData.get("subject") as string;
  const medium = formData.get("medium") as string;
  const classCategory = formData.get("class_category") as string;
  const district = formData.get("district") as string;
  const location = formData.get("location") as string;
  const budgetRange = formData.get("budget_range") as string;
  const description = formData.get("description") as string;

  if (!title || !subject || !medium || !classCategory) {
    return { error: "Please fill in all required fields." };
  }

  const newJob: JobInsert = {
    institute_id: institute.id,
    title,
    subject,
    medium,
    class_category: classCategory,
    district: district || null,
    location: location || null,
    budget_range: budgetRange || null,
    description: description || null,
  };

  const { error } = await (supabase as any).from("jobs").insert(newJob);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/institute/dashboard");
  revalidatePath("/jobs"); // Revalidate public jobs board too
  return { success: true, message: "Vacancy posted successfully!" };
}

// ─── Close a Job ────────────────────────────────────────────

export async function closeJob(jobId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated." };

  // Note: RLS policies on 'jobs' table already ensure institutes can only update their own jobs.
  const { error } = await (supabase as any)
    .from("jobs")
    .update({ status: "closed" })
    .eq("id", jobId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/institute/dashboard");
  revalidatePath("/jobs");
  return { success: true, message: "Vacancy closed." };
}

// ─── Update Interview Status ────────────────────────────────

export async function updateInterviewStatus(
  interviewId: string,
  newStatus: "accepted" | "declined" | "pending"
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated." };

  const { error } = await (supabase as any)
    .from("interviews")
    .update({ status: newStatus })
    .eq("id", interviewId);

  if (error) return { error: error.message };

  revalidatePath("/institute/dashboard");
  revalidatePath("/teacher/dashboard");
  return { success: true, message: `Interview marked as ${newStatus}.` };
}
