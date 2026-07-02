import { redirect } from "next/navigation";
import {
  Building2,
  Users,
  Briefcase,
  CalendarCheck,
  Plus,
  TrendingUp,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/actions";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Institute Dashboard",
};

export default async function InstituteDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== "institute") {
    redirect("/auth/login");
  }

  const institute = user.profile;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">
              {institute?.institute_name || "Institute Dashboard"} 🏫
            </h1>
            {institute?.is_verified ? (
              <Badge variant="success" dot>
                Verified
              </Badge>
            ) : (
              <Badge variant="warning" dot>
                Unverified
              </Badge>
            )}
          </div>
          <p className="text-slate-400 text-sm">
            Manage your job listings and teacher connections
          </p>
        </div>
        <Button
          href="/institute/jobs/new"
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Post a Job
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: Briefcase,
            label: "Active Jobs",
            value: "—",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            icon: Users,
            label: "Applications",
            value: "—",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            icon: CalendarCheck,
            label: "Interviews",
            value: "—",
            color: "text-amber-400",
            bg: "bg-amber-500/10",
          },
          {
            icon: Building2,
            label: "Teachers Hired",
            value: "—",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
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

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Jobs */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Briefcase className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Your Job Listings
                </h3>
                <p className="text-xs text-slate-500">
                  Manage open positions
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" href="/institute/jobs">
              View All
            </Button>
          </div>
          <div className="flex items-center justify-center py-8 text-sm text-slate-600">
            No jobs posted yet. Create your first listing!
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Recent Activity
              </h3>
              <p className="text-xs text-slate-500">
                Latest updates and interactions
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center py-8 text-sm text-slate-600">
            No activity yet. Post a job to start connecting with teachers!
          </div>
        </Card>
      </div>
    </div>
  );
}
