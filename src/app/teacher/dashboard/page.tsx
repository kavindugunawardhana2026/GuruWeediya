
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/actions";
import { getTeacherInterviews } from "@/lib/actions/interviews";
import TeacherInterviews from "./components/TeacherInterviews";

export default async function TeacherDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return <div>Please log in.</div>;

  const { interviews, error } = await getTeacherInterviews();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-white">Teacher Dashboard</h1>
        <p className="text-slate-400">Manage your profile and upcoming interviews.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">My Interviews</h2>
            <TeacherInterviews interviews={(interviews as any) || []} />
          </section>
        </div>
        
        <div className="space-y-8">
          {/* Profile summary or other components can go here */}
        </div>
      </div>
    </div>
  );
}
