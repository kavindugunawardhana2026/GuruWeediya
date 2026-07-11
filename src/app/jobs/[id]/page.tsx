import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/actions";
import { Building2, MapPin, DollarSign, BookOpen, Clock, Briefcase, FileText } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import ApplyButton from "./ApplyButton";

export const metadata = {
  title: "Job Details | GuruWeediya.lk",
};

export default async function JobDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const jobId = params.id;
  const supabase = await createClient();
  const user = await getCurrentUser();

  // Fetch job details
  const { data: job, error } = await (supabase as any)
    .from("jobs")
    .select(`
      *,
      institute:institutes (
        id,
        institute_name,
        logo_url,
        district,
        branch_location,
        is_verified
      )
    `)
    .eq("id", jobId)
    .single();

  if (error || !job) {
    notFound();
  }

  // Check if current user is a teacher and has already applied
  let hasApplied = false;
  let isTeacher = false;

  if (user && user.role === "teacher") {
    isTeacher = true;
    const { data: teacher } = await (supabase as any)
      .from("teachers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (teacher) {
      const { count } = await (supabase as any)
        .from("job_applications")
        .select("*", { count: "exact", head: true })
        .eq("job_id", jobId)
        .eq("teacher_id", teacher.id);
        
      hasApplied = (count || 0) > 0;
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Back link */}
      <a href="/jobs" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium mb-6 inline-block">
        &larr; Back to Jobs
      </a>

      {/* Header Card */}
      <Card padding="lg" className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge variant={job.status === "open" ? "success" : "default"}>
                {job.status === "open" ? "Actively Hiring" : "Closed"}
              </Badge>
              <Badge variant="info">{job.class_category}</Badge>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
            
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
              <Building2 className="h-4 w-4" />
              <span>{job.institute?.institute_name}</span>
              {job.institute?.is_verified && (
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded ml-1 font-bold">
                  VERIFIED
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-3">
            {job.status === "open" ? (
              isTeacher ? (
                <ApplyButton jobId={job.id} hasApplied={hasApplied} />
              ) : !user ? (
                <a href="/auth/login" className="inline-flex items-center justify-center rounded-lg px-6 py-2.5 font-medium text-white transition-all bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/25">
                  Log in to Apply
                </a>
              ) : (
                <span className="text-sm text-slate-500">Only teachers can apply</span>
              )
            ) : (
              <span className="text-slate-400 font-medium">This position is closed</span>
            )}
          </div>
        </div>

        <hr className="border-slate-800 my-6" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-slate-500 text-xs mb-1 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" /> Subject
            </div>
            <div className="text-white font-medium">{job.subject}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs mb-1 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Medium
            </div>
            <div className="text-white font-medium">{job.medium}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs mb-1 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Location
            </div>
            <div className="text-white font-medium">{job.location || job.district || "Not specified"}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs mb-1 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" /> Budget
            </div>
            <div className="text-white font-medium">{job.budget_range || "Negotiable"}</div>
          </div>
        </div>
      </Card>

      {/* Description */}
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-emerald-400" />
        Job Description
      </h2>
      <Card padding="lg" className="mb-8">
        <div className="prose prose-invert max-w-none text-slate-300">
          {job.description ? (
            job.description.split('\n').map((line: string, i: number) => (
              <p key={i} className="mb-2">{line}</p>
            ))
          ) : (
            <p className="text-slate-500 italic">No detailed description provided.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
