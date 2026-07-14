
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/actions";

export interface ActionResult {
  success?: boolean;
  error?: string;
  message?: string;
}

// ─── Schedule an Interview ──────────────────────────────────

export async function scheduleInterview(
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user || user.role !== "institute") {
    return { error: "Unauthorized: Only institutes can schedule interviews." };
  }

  const jobId = formData.get("jobId") as string;
  const teacherId = formData.get("teacherId") as string;
  const scheduledDate = formData.get("scheduledDate") as string;
  const timeSlot = formData.get("timeSlot") as string;
  const meetingLink = formData.get("meetingLink") as string;
  const notes = formData.get("notes") as string;

  if (!jobId || !teacherId || !scheduledDate || !timeSlot) {
    return { error: "Missing required fields: Job, Teacher, Date, or Time." };
  }

  // Get institute ID
  const { data: institute } = await (supabase as any)
    .from("institutes")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!institute) return { error: "Institute profile not found." };

  const { error } = await (supabase as any).from("interviews").insert({
    job_id: jobId,
    teacher_id: teacherId,
    institute_id: institute.id,
    scheduled_date: scheduledDate,
    time_slot: timeSlot,
    meeting_link: meetingLink || null,
    notes: notes || null,
    status: "pending",
  });

  if (error) return { error: error.message };

  revalidatePath("/institute/dashboard");
  revalidatePath("/teacher/dashboard");
  return { success: true, message: "Interview scheduled successfully!" };
}

// ─── Get Scheduled Interviews (for Teachers) ────────────────

export async function getTeacherInterviews() {
  const user = await getCurrentUser();
  if (!user || user.role !== "teacher") return { error: "Unauthorized" };

  const supabase = await createClient();

  const { data: teacher } = await (supabase as any)
    .from("teachers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!teacher) return { error: "Teacher profile not found." };

  const { data, error } = await (supabase as any)
    .from("interviews")
    .select(`
      *,
      job:jobs (*),
      institute:institutes (*)
    `)
    .eq("teacher_id", teacher.id)
    .order("scheduled_date", { ascending: true });

  if (error) return { error: error.message };
  return { interviews: data };
}

// ─── Update Interview Status (by Teacher) ───────────────────

export async function respondToInterview(
  interviewId: string,
  status: "accepted" | "declined"
): Promise<ActionResult> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user || user.role !== "teacher") {
    return { error: "Unauthorized: Only teachers can respond to interviews." };
  }

  const { error } = await (supabase as any)
    .from("interviews")
    .update({ status })
    .eq("id", interviewId);

  if (error) return { error: error.message };

  revalidatePath("/teacher/dashboard");
  revalidatePath("/institute/dashboard");
  return { success: true, message: `Interview ${status} successfully.` };
}
