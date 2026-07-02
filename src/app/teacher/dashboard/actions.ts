"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TeacherUpdate } from "@/types/database";

export interface ActionResult {
  success?: boolean;
  error?: string;
  message?: string;
}

// ─── Update Teacher Profile ──────────────────────────────────

export async function updateTeacherProfile(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated." };

  const fullName = formData.get("full_name") as string;
  const bio = formData.get("bio") as string;
  const phone = formData.get("phone") as string;
  const hourlyRate = formData.get("hourly_rate") as string;
  const youtubeDemoUrl = formData.get("youtube_demo_url") as string;

  // Array fields come as JSON strings from hidden inputs
  const subjectsRaw = formData.get("subjects") as string;
  const mediumsRaw = formData.get("mediums") as string;
  const districtsRaw = formData.get("districts") as string;
  const availabilityRaw = formData.get("availability") as string;

  const subjects = subjectsRaw ? JSON.parse(subjectsRaw) : [];
  const mediums = mediumsRaw ? JSON.parse(mediumsRaw) : [];
  const districts = districtsRaw ? JSON.parse(districtsRaw) : [];
  const availability = availabilityRaw ? JSON.parse(availabilityRaw) : {};

  const updatePayload: TeacherUpdate = {
    full_name: fullName,
    bio,
    phone,
    hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
    youtube_demo_url: youtubeDemoUrl,
    subjects,
    mediums,
    districts,
    availability,
  };

  const { error } = await (supabase as any)
    .from("teachers")
    .update(updatePayload)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/teacher/dashboard");
  return { success: true, message: "Profile updated successfully!" };
}

// ─── Save Availability Only ──────────────────────────────────

export async function saveAvailability(
  availability: Record<string, string[]>
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated." };

  const availUpdate: TeacherUpdate = { availability };

  const { error } = await (supabase as any)
    .from("teachers")
    .update(availUpdate)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/teacher/dashboard");
  return { success: true, message: "Availability saved successfully!" };
}

// ─── Upload Document ─────────────────────────────────────────

export async function uploadDocument(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated." };

  const file = formData.get("file") as File;
  const docType = formData.get("doc_type") as string; // 'nic' | 'certificate'

  if (!file || file.size === 0) return { error: "No file selected." };

  // Validate file type
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];
  if (!validTypes.includes(file.type)) {
    return { error: "Only JPG, PNG, WebP, or PDF files are accepted." };
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    return { error: "File size must be under 5MB." };
  }

  const ext = file.name.split(".").pop();
  const fileName = `${user.id}/${docType}_${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("teacher-documents")
    .upload(fileName, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  // Store document reference in teacher profile
  await supabase
    .from("teacher_documents")
    .upsert(
      {
        user_id: user.id,
        doc_type: docType,
        file_path: fileName,
        status: "pending_review",
      } as any,
      { onConflict: "user_id,doc_type" }
    );

  revalidatePath("/teacher/dashboard");
  return {
    success: true,
    message: `${docType === "nic" ? "NIC" : "Certificate"} uploaded for review.`,
  };
}
