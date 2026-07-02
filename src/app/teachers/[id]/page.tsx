import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/actions";
import TeacherProfileClient from "./TeacherProfileClient";
import type { Teacher, Job } from "@/types/database";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: teacher } = await (supabase as any)
    .from("teachers")
    .select("full_name, bio")
    .eq("id", resolvedParams.id)
    .single();

  if (!teacher) return { title: "Teacher Not Found" };

  return {
    title: `${teacher.full_name} | GuruWeediya.lk`,
    description: teacher.bio || `View ${teacher.full_name}'s teaching portfolio.`,
  };
}

export default async function TeacherProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const user = await getCurrentUser();

  // Fetch teacher details
  const { data: teacher, error } = await (supabase as any)
    .from("teachers")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !teacher) {
    notFound();
  }

  let instituteJobs: Job[] = [];

  // If the logged-in user is an institute, fetch their OPEN jobs
  // so they can invite this teacher to apply/interview.
  if (user && user.role === "institute") {
    const { data: institute } = await (supabase as any)
      .from("institutes")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (institute) {
      const { data: jobs } = await (supabase as any)
        .from("jobs")
        .select("*")
        .eq("institute_id", institute.id)
        .eq("status", "open");
      
      if (jobs) {
        instituteJobs = jobs;
      }
    }
  }

  // Fetch reviews for this teacher
  const { data: reviews } = await (supabase as any)
    .from("reviews")
    .select("*, institute:institutes(institute_name)")
    .eq("teacher_id", resolvedParams.id)
    .order("created_at", { ascending: false });

  return (
    <TeacherProfileClient 
      teacher={teacher as Teacher} 
      instituteJobs={instituteJobs} 
      reviews={reviews || []}
      isInstitute={user?.role === "institute"}
    />
  );
}
