import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import TeacherDirectoryClient from "./TeacherDirectoryClient";
import type { Teacher } from "@/types/database";

export const metadata: Metadata = {
  title: "Find Teachers | GuruWeediya.lk",
  description:
    "Browse verified tuition teachers across all subjects, mediums, and districts in Sri Lanka.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TeachersPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  
  const subject = typeof resolvedParams.subject === "string" ? resolvedParams.subject : null;
  const medium = typeof resolvedParams.medium === "string" ? resolvedParams.medium : null;
  const district = typeof resolvedParams.district === "string" ? resolvedParams.district : null;
  const verifiedOnly = resolvedParams.verified === "true";
  const searchName = typeof resolvedParams.q === "string" ? resolvedParams.q : null;

  const supabase = await createClient();

  // Start query
  let query = (supabase as any).from("teachers").select("*");

  // Since subjects, mediums, and districts are TEXT arrays, we use the contains operator.
  // In Supabase JS, .contains('column', ['Value']) matches if the array contains 'Value'.
  if (subject) {
    query = query.contains("subjects", [subject]);
  }
  if (medium) {
    query = query.contains("mediums", [medium]);
  }
  if (district) {
    query = query.contains("districts", [district]);
  }
  if (verifiedOnly) {
    query = query.eq("is_verified", true);
  }
  if (searchName) {
    query = query.ilike("full_name", `%${searchName}%`);
  }


  // Order by verification status (verified first), then latest created
  query = query.order("is_verified", { ascending: false }).order("created_at", { ascending: false });

  const { data: teachers, error } = await query;

  if (error) {
    throw new Error(error.message || JSON.stringify(error));
  }

  return <TeacherDirectoryClient teachers={(teachers as Teacher[]) || []} />;
}
