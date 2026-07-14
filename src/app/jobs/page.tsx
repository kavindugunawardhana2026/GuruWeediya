
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import JobsDirectoryClient from "./JobsDirectoryClient";
import type { JobWithInstitute } from "@/types/database";

export const metadata: Metadata = {
  title: "Browse Jobs | GuruWeediya.lk",
  description:
    "Discover teaching opportunities posted by educational institutes across Sri Lanka.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function JobsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  
  const subject = typeof resolvedParams.subject === "string" ? resolvedParams.subject : null;
  const medium = typeof resolvedParams.medium === "string" ? resolvedParams.medium : null;
  const district = typeof resolvedParams.district === "string" ? resolvedParams.district : null;
  const searchTitle = typeof resolvedParams.q === "string" ? resolvedParams.q : null;

  const supabase = await createClient();

  // Start query with join to get institute details
  let query = (supabase as any)
    .from("jobs")
    .select(`
      *,
      institute:institutes (*)
    `)
    .eq("status", "open");

  if (subject) {
    query = query.eq("subject", subject);
  }
  if (medium) {
    query = query.eq("medium", medium);
  }
  if (district) {
    query = query.eq("district", district);
  }
  if (searchTitle) {
    query = query.ilike("title", `%${searchTitle}%`);
  }

  // Order by newest first
  query = query.order("created_at", { ascending: false });

  const { data: jobs, error } = await query;

  if (error) {
    console.error("Error fetching jobs:", error);
  }

  return <JobsDirectoryClient jobs={(jobs as JobWithInstitute[]) || []} />;
}
