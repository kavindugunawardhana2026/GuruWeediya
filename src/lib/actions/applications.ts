"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";

// TEACHER: Apply to a job
export async function applyForJob(jobId: string, coverMessage: string = "") {
  const user = await getCurrentUser();
  if (!user || user.role !== "teacher") {
    return { error: "Only teachers can apply for jobs." };
  }

  const supabase = await createClient();

  // Get teacher ID
  const { data: teacher } = await (supabase as any)
    .from("teachers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!teacher) return { error: "Teacher profile not found." };

  const { error } = await (supabase as any).from("job_applications").insert({
    job_id: jobId,
    teacher_id: teacher.id,
    cover_message: coverMessage,
    status: "applied",
  });

  if (error) {
    if (error.code === "23505") { // unique violation
      return { error: "You have already applied for this job." };
    }
    return { error: error.message };
  }

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/teacher/dashboard");
  return { success: true };
}

// TEACHER: Get my applications
export async function getMyApplications() {
  const user = await getCurrentUser();
  if (!user || user.role !== "teacher") return { error: "Unauthorized" };

  const supabase = await createClient();

  const { data: teacher } = await (supabase as any)
    .from("teachers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!teacher) return { error: "Profile not found" };

  const { data, error } = await (supabase as any)
    .from("job_applications")
    .select(`
      *,
      job:jobs (
        *,
        institute:institutes(institute_name, logo_url)
      )
    `)
    .eq("teacher_id", teacher.id)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { applications: data };
}

// INSTITUTE: Get applications for their jobs
export async function getInstituteApplications() {
  const user = await getCurrentUser();
  if (!user || user.role !== "institute") return { error: "Unauthorized" };

  const supabase = await createClient();

  // The RLS policy allows institutes to see applications for their jobs
  const { data, error } = await (supabase as any)
    .from("job_applications")
    .select(`
      *,
      job:jobs (id, title, status),
      teacher:teachers (id, full_name, profile_image_url, subjects, districts, user_id)
    `)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { applications: data };
}

// INSTITUTE: Update application status
export async function updateApplicationStatus(applicationId: string, status: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "institute") return { error: "Unauthorized" };

  const supabase = await createClient();

  const { error } = await (supabase as any)
    .from("job_applications")
    .update({ status })
    .eq("id", applicationId);

  if (error) return { error: error.message };

  revalidatePath("/institute/dashboard");
  return { success: true };
}
