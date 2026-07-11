import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/actions";
import TeacherDashboardClient from "./TeacherDashboardClient";
import { getMyApplications } from "@/lib/actions/applications";

export const metadata = {
  title: "Teacher Dashboard | GuruWeediya.lk",
  description: "Manage your teacher profile, documents and availability.",
};

export default async function TeacherDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== "teacher") {
    redirect("/auth/login");
  }

  const teacher = user.profile as any;
  const { applications } = await getMyApplications();

  return (
    <TeacherDashboardClient
      teacherId={teacher?.id || ""}
      initialProfile={{
        full_name: teacher?.full_name || "",
        bio: teacher?.bio || "",
        phone: teacher?.phone || "",
        hourly_rate: teacher?.hourly_rate?.toString() || "",
        youtube_demo_url: teacher?.youtube_demo_url || "",
        subjects: teacher?.subjects || [],
        mediums: teacher?.mediums || [],
        districts: teacher?.districts || [],
        availability: teacher?.availability || {},
        profile_image_url: teacher?.profile_image_url || null,
        is_verified: teacher?.is_verified || false,
        verification_status: teacher?.verification_status || "pending",
      }}
      userEmail={user.email || ""}
      initialApplications={applications || []}
    />
  );
}
