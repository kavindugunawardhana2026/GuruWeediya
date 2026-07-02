"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  success?: boolean;
  error?: string;
  message?: string;
}

export async function inviteTeacher(
  teacherId: string,
  jobId: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated." };

  // Verify the institute making the request
  const { data: institute, error: instError } = await (supabase as any)
    .from("institutes")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (instError || !institute) {
    return { error: "Could not find your institute profile." };
  }

  // Insert the pending interview request
  const newInterview = {
    job_id: jobId,
    teacher_id: teacherId,
    institute_id: institute.id,
    status: "pending",
  };

  const { error } = await (supabase as any)
    .from("interviews")
    .insert(newInterview);

  if (error) {
    if (error.code === "23505") { // Unique violation
      return { error: "You have already invited this teacher for this job." };
    }
    return { error: error.message };
  }

  revalidatePath(`/teachers/${teacherId}`);
  revalidatePath("/institute/dashboard");

  return { success: true, message: "Interview invitation sent successfully!" };
}

export async function submitReview(
  teacherId: string,
  rating: number,
  reviewText: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated." };

  // Verify the institute making the request
  const { data: institute, error: instError } = await (supabase as any)
    .from("institutes")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (instError || !institute) {
    return { error: "Could not find your institute profile." };
  }

  const { error } = await (supabase as any).from("reviews").insert({
    teacher_id: teacherId,
    institute_id: institute.id,
    rating,
    review_text: reviewText,
  });

  if (error) {
    if (error.code === "23505") { // Unique violation
      return { error: "You have already reviewed this teacher." };
    }
    return { error: error.message };
  }

  revalidatePath(`/teachers/${teacherId}`);

  return { success: true, message: "Review submitted successfully!" };
}
