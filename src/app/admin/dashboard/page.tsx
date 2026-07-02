import { redirect } from "next/navigation";
import { Shield, Users, Building2, Briefcase, AlertTriangle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import AdminVerificationClient from "./AdminVerificationClient";

export const metadata = {
  title: "Admin Dashboard | GuruWeediya.lk",
};

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  const supabase = await createClient();

  // Fetch stats (using raw count queries)
  const [{ count: teachersCount }, { count: institutesCount }, { count: jobsCount }, { count: pendingCount }] = await Promise.all([
    (supabase as any).from("teachers").select("*", { count: "exact", head: true }),
    (supabase as any).from("institutes").select("*", { count: "exact", head: true }),
    (supabase as any).from("jobs").select("*", { count: "exact", head: true }),
    (supabase as any).from("teacher_documents").select("*", { count: "exact", head: true }).eq("status", "pending_review")
  ]);

  // Fetch pending documents for the queue, join with teachers (which references users.id)
  const { data: rawDocs, error } = await (supabase as any)
    .from("teacher_documents")
    .select("id, user_id, doc_type, file_path, status, created_at")
    .eq("status", "pending_review")
    .order("created_at", { ascending: true });

  // Because teacher_documents references users(id) and teachers references users(id),
  // we do a manual lookup for teachers to avoid complex postgREST syntax in this mock setup.
  let pendingDocs = [];
  if (rawDocs && rawDocs.length > 0) {
    const userIds = rawDocs.map((d: any) => d.user_id);
    const { data: teachers } = await (supabase as any)
      .from("teachers")
      .select("id, user_id, full_name, subjects, is_verified")
      .in("user_id", userIds);

    pendingDocs = rawDocs.map((doc: any) => {
      const teacher = teachers?.find((t: any) => t.user_id === doc.user_id) || null;
      return { ...doc, teacher };
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
            <Shield className="h-5 w-5 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <p className="text-slate-400 text-sm">
          Platform management and oversight
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: Users,
            label: "Total Teachers",
            value: teachersCount || 0,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            icon: Building2,
            label: "Total Institutes",
            value: institutesCount || 0,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            icon: Briefcase,
            label: "Total Jobs",
            value: jobsCount || 0,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
          },
          {
            icon: AlertTriangle,
            label: "Pending Verifications",
            value: pendingCount || 0,
            color: "text-red-400",
            bg: "bg-red-500/10",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className="text-lg font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-1">Verification Queue</h2>
          <p className="text-sm text-slate-400">Review teacher documents and approve their professional status.</p>
        </div>
        <AdminVerificationClient pendingDocs={pendingDocs} />
      </div>
    </div>
  );
}
