import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";
import InstituteDashboardClient from "./InstituteDashboardClient";
import { getInstituteApplications } from "@/lib/actions/applications";

export const metadata = {
  title: "Institute Dashboard | GuruWeediya.lk",
  description: "Manage your institute profile, vacancies, and interviews.",
};

export default async function InstituteDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== "institute") {
    redirect("/auth/login");
  }

  const supabase = await createClient();

  // Fetch institute profile
  const { data: institute, error: instError } = await (supabase as any)
    .from("institutes")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (instError || !institute) {
    // Failsafe: if role is institute but profile is missing, redirect to signup
    redirect("/auth/signup");
  }

  // Fetch jobs for this institute and their interview counts
  const { data: jobsData } = await (supabase as any)
    .from("jobs")
    .select(`
      *,
      interviews ( count )
    `)
    .eq("institute_id", institute.id)
    .order("created_at", { ascending: false });

  // Map the Supabase response correctly
  const jobs = (jobsData || []).map((job: any) => ({
    ...job,
    interview_count: job.interviews?.[0]?.count || 0,
  }));

  // Fetch upcoming interviews for this institute
  const { data: interviewsData } = await (supabase as any)
    .from("interviews")
    .select(`
      *,
      job:jobs (*),
      teacher:teachers (*)
    `)
    .eq("institute_id", institute.id)
    .order("created_at", { ascending: false });

  // Fetch applications
  const { applications } = await getInstituteApplications();

  return (
    <InstituteDashboardClient
      institute={{
        institute_name: institute.institute_name,
        is_verified: institute.is_verified,
        logo_url: institute.logo_url,
      }}
      userEmail={user.email || ""}
      jobs={jobs as any}
      interviews={interviewsData as any}
      initialApplications={applications || []}
    />
  );
}
