"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  CalendarCheck,
  Plus,
  Users,
  Building2,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { cn, getInitials } from "@/lib/utils";
import type { Job, InterviewWithDetails } from "@/types/database";

import JobCreator from "./components/JobCreator";
import ActiveVacancies from "./components/ActiveVacancies";
import InterviewTracker from "./components/InterviewTracker";

interface InstituteProfile {
  institute_name: string;
  is_verified: boolean;
  logo_url: string | null;
}

interface Props {
  institute: InstituteProfile;
  userEmail: string;
  jobs: (Job & { interview_count?: number })[];
  interviews: InterviewWithDetails[];
  initialApplications: any[];
}

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "post_job", label: "Post a Job", icon: Plus },
  { id: "vacancies", label: "Active Vacancies", icon: Briefcase },
  { id: "applications", label: "Applications", icon: Users },
  { id: "interviews", label: "Interviews", icon: CalendarCheck },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function InstituteDashboardClient({
  institute,
  userEmail,
  jobs,
  interviews,
  initialApplications,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const openJobs = jobs.filter((j) => j.status === "open").length;
  const totalApplications = initialApplications.length;
  const upcomingInterviews = interviews.filter((i) => i.status === "accepted" || i.status === "pending").length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* ─── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="shrink-0">
            {institute.logo_url ? (
              <img
                src={institute.logo_url}
                alt={institute.institute_name}
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-blue-500/30"
              />
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20">
                {getInitials(institute.institute_name || userEmail)}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">
                {institute.institute_name}
              </h1>
              {institute.is_verified ? (
                <Badge variant="success" dot>Verified</Badge>
              ) : (
                <Badge variant="warning" dot>Unverified</Badge>
              )}
            </div>
            <p className="text-slate-400 text-sm">
              Manage your job listings and teacher connections
            </p>
          </div>
        </div>
      </div>

      {/* ─── Tab Navigation ──────────────────────────────── */}
      <div className="flex gap-1 p-1 rounded-xl bg-slate-900/50 border border-slate-800 mb-8 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer flex-1 justify-center",
              activeTab === tab.id
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── Tab Content ─────────────────────────────────── */}

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Briefcase, label: "Active Jobs", value: openJobs, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { icon: Users, label: "Applications", value: totalApplications, color: "text-blue-400", bg: "bg-blue-500/10" },
              { icon: CalendarCheck, label: "Interviews", value: upcomingInterviews, color: "text-amber-400", bg: "bg-amber-500/10" },
              { icon: Building2, label: "Teachers Hired", value: "—", color: "text-purple-400", bg: "bg-purple-500/10" },
            ].map((stat) => (
              <Card key={stat.label}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} shrink-0`}>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                    <Briefcase className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Recent Vacancies</h3>
                    <p className="text-xs text-slate-500">Your latest job postings</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("vacancies")}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  View All
                </button>
              </div>
              {jobs.length > 0 ? (
                <div className="space-y-3">
                  {jobs.slice(0, 3).map(job => (
                    <div key={job.id} className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <div>
                        <p className="text-sm font-medium text-white">{job.title}</p>
                        <p className="text-xs text-slate-400">{job.subject} · {job.class_category}</p>
                      </div>
                      {job.status === "open" ? (
                        <span className="h-2 w-2 rounded-full bg-emerald-400" title="Open" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-slate-600" title="Closed" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-slate-500">
                  No jobs posted yet.
                  <button onClick={() => setActiveTab("post_job")} className="block mt-2 text-blue-400 hover:underline mx-auto">
                    Post your first vacancy
                  </button>
                </div>
              )}
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                    <CalendarCheck className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Upcoming Interviews</h3>
                    <p className="text-xs text-slate-500">Scheduled sessions</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("interviews")}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  View All
                </button>
              </div>
              {interviews.length > 0 ? (
                <div className="space-y-3">
                  {interviews.slice(0, 3).map(int => (
                    <div key={int.id} className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <div>
                        <p className="text-sm font-medium text-white">{int.teacher?.full_name}</p>
                        <p className="text-xs text-slate-400">{int.scheduled_date} · {int.time_slot}</p>
                      </div>
                      <Badge variant={int.status === "accepted" ? "success" : "warning"} dot>{int.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-slate-500">
                  No upcoming interviews.
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* POST JOB TAB */}
      {activeTab === "post_job" && (
        <JobCreator onJobCreated={() => setActiveTab("vacancies")} />
      )}

      {/* VACANCIES TAB */}
      {activeTab === "vacancies" && (
        <ActiveVacancies jobs={jobs} />
      )}

      {/* INTERVIEWS TAB */}
      {activeTab === "interviews" && (
        <InterviewTracker interviews={interviews} />
      )}

      {/* APPLICATIONS TAB */}
      {activeTab === "applications" && (
        <div className="animate-fade-in space-y-4">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Incoming Applications</h2>
            <p className="text-sm text-slate-400">Review teachers who have applied to your open jobs.</p>
          </div>

          {initialApplications.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No applications yet</h3>
                <p className="text-slate-400 text-sm">When teachers apply to your jobs, they will appear here.</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {initialApplications.map((app) => (
                <Card key={app.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                      {app.teacher.profile_image_url ? (
                        <img src={app.teacher.profile_image_url} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <span className="font-bold text-slate-400">{getInitials(app.teacher.full_name)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{app.teacher.full_name}</h3>
                      <p className="text-sm text-emerald-400 font-medium">Applied for: {app.job.title}</p>
                      {app.cover_message && (
                        <div className="mt-3 p-3 bg-slate-900 rounded-lg text-sm text-slate-300 border border-slate-800">
                          "{app.cover_message}"
                        </div>
                      )}
                      <p className="text-xs text-slate-500 mt-2">Applied on {new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2 shrink-0">
                    <Badge variant={
                      app.status === 'hired' ? 'success' :
                      app.status === 'shortlisted' ? 'info' :
                      app.status === 'rejected' ? 'error' :
                      app.status === 'interviewed' ? 'warning' : 'default'
                    }>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                    <div className="flex gap-2 mt-2">
                      <a href={`/messages?user=${app.teacher.user_id}`} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-medium transition-colors">
                        Message
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
