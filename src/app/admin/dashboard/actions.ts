"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/actions";

export interface ActionResult {
  success?: boolean;
  error?: string;
  message?: string;
}

export async function approveTeacher(documentId: string, teacherId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return { error: "Unauthorized" };

  const supabase = await createClient();

  // Update document status
  const { error: docError } = await (supabase as any)
    .from("teacher_documents")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("id", documentId);

  if (docError) return { error: docError.message };

  // Update teacher status
  const { error: teacherError } = await (supabase as any)
    .from("teachers")
    .update({ is_verified: true, verification_status: "approved" })
    .eq("id", teacherId);

  if (teacherError) return { error: teacherError.message };

  revalidatePath("/admin/dashboard");
  revalidatePath("/teachers");
  revalidatePath(`/teachers/${teacherId}`);

  return { success: true, message: "Teacher approved successfully." };
}

export async function rejectTeacher(documentId: string, teacherId: string, reason: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return { error: "Unauthorized" };

  const supabase = await createClient();

  // Update document status
  const { error: docError } = await (supabase as any)
    .from("teacher_documents")
    .update({ status: "rejected", notes: reason, reviewed_at: new Date().toISOString() })
    .eq("id", documentId);

  if (docError) return { error: docError.message };

  // Update teacher status
  const { error: teacherError } = await (supabase as any)
    .from("teachers")
    .update({ is_verified: false, verification_status: "rejected" })
    .eq("id", teacherId);

  if (teacherError) return { error: teacherError.message };

  revalidatePath("/admin/dashboard");
  revalidatePath("/teachers");
  revalidatePath(`/teachers/${teacherId}`);

  return { success: true, message: "Teacher rejected." };
}
