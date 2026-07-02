import { redirect } from "next/navigation";
import { Shield, Users, Building2, Briefcase, AlertTriangle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/actions";
import Card from "@/components/ui/Card";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/auth/login");
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
            value: "—",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            icon: Building2,
            label: "Total Institutes",
            value: "—",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            icon: Briefcase,
            label: "Total Jobs",
            value: "—",
            color: "text-amber-400",
            bg: "bg-amber-500/10",
          },
          {
            icon: AlertTriangle,
            label: "Pending Verifications",
            value: "—",
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

      <Card>
        <div className="flex items-center justify-center py-12 text-sm text-slate-600">
          Admin management features coming soon…
        </div>
      </Card>
    </div>
  );
}
