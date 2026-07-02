"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  User,
  FileText,
  CalendarCheck,
  Eye,
  Briefcase,
  Star,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { cn, getInitials } from "@/lib/utils";
import ProfileEditor from "./components/ProfileEditor";
import DocumentUpload from "./components/DocumentUpload";
import AvailabilityCalendar from "./components/AvailabilityCalendar";

interface TeacherProfile {
  full_name: string;
  bio: string;
  phone: string;
  hourly_rate: string;
  youtube_demo_url: string;
  subjects: string[];
  mediums: string[];
  districts: string[];
  availability: Record<string, string[]>;
  profile_image_url: string | null;
  is_verified: boolean;
  verification_status: string;
}

interface Props {
  teacherId: string;
  initialProfile: TeacherProfile;
  userEmail: string;
}

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Edit Profile", icon: User },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "availability", label: "Availability", icon: CalendarCheck },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function TeacherDashboardClient({
  teacherId,
  initialProfile,
  userEmail,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [profile, setProfile] = useState<TeacherProfile>(initialProfile);

  // Profile completeness
  const completionItems = [
    { label: "Full name", done: !!profile.full_name },
    { label: "Bio", done: !!profile.bio },
    { label: "Phone", done: !!profile.phone },
    { label: "Subjects", done: profile.subjects.length > 0 },
    { label: "Mediums", done: profile.mediums.length > 0 },
    { label: "Districts", done: profile.districts.length > 0 },
    { label: "Hourly rate", done: !!profile.hourly_rate },
    { label: "YouTube demo", done: !!profile.youtube_demo_url },
  ];
  const completedCount = completionItems.filter((i) => i.done).length;
  const completionPct = Math.round((completedCount / completionItems.length) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* ─── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        {/* Avatar */}
        <div className="relative shrink-0">
          {profile.profile_image_url ? (
            <img
              src={profile.profile_image_url}
              alt={profile.full_name}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-emerald-500/30"
            />
          ) : (
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-emerald-500/20">
              {getInitials(profile.full_name || userEmail)}
            </div>
          )}
          {/* Completion ring indicator */}
          <div
            className={cn(
              "absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-slate-950",
              completionPct === 100
                ? "bg-emerald-500 text-white"
                : "bg-slate-700 text-slate-300"
            )}
          >
            {completionPct === 100 ? "✓" : `${completionPct}%`}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white truncate">
              {profile.full_name || "Your Dashboard"}
            </h1>
            {profile.is_verified ? (
              <Badge variant="success" dot>Verified</Badge>
            ) : (
              <Badge variant="warning" dot>
                {profile.verification_status === "pending"
                  ? "Pending Verification"
                  : "Unverified"}
              </Badge>
            )}
          </div>
          <p className="text-slate-400 text-sm">{userEmail}</p>
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
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
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
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Eye, label: "Profile Views", value: "—", color: "text-blue-400", bg: "bg-blue-500/10" },
              { icon: Briefcase, label: "Jobs Matched", value: "—", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { icon: CalendarCheck, label: "Interviews", value: "—", color: "text-amber-400", bg: "bg-amber-500/10" },
              { icon: Star, label: "Rating", value: "—", color: "text-purple-400", bg: "bg-purple-500/10" },
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
            {/* Profile Completeness */}
            <Card>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <User className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">Profile Completeness</h3>
                  <p className="text-xs text-slate-500">
                    {completedCount} of {completionItems.length} sections done
                  </p>
                </div>
                <span className={cn(
                  "text-xl font-bold",
                  completionPct === 100 ? "text-emerald-400" : completionPct >= 50 ? "text-amber-400" : "text-red-400"
                )}>
                  {completionPct}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-slate-800 mb-4">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>

              <div className="space-y-2.5">
                {completionItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 text-sm">
                    <div className={cn(
                      "h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                      item.done ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-600"
                    )}>
                      {item.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="text-xs">·</span>}
                    </div>
                    <span className={item.done ? "text-slate-500 line-through" : "text-slate-300"}>
                      {item.label}
                    </span>
                    {!item.done && (
                      <button
                        onClick={() => setActiveTab("profile")}
                        className="ml-auto text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                      >
                        Add →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Info + Activity */}
            <div className="space-y-4">
              {/* Profile snapshot */}
              {profile.subjects.length > 0 && (
                <Card>
                  <h3 className="text-sm font-semibold text-white mb-3">Your Subjects</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.subjects.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
                    <p className="text-xs text-slate-500">Your latest interactions</p>
                  </div>
                </div>
                <div className="flex items-center justify-center py-6 text-sm text-slate-600">
                  No activity yet. Complete your profile to get started!
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE EDITOR TAB */}
      {activeTab === "profile" && (
        <div className="animate-fade-in">
          <ProfileEditor
            initialProfile={profile}
            onSaved={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
          />
        </div>
      )}

      {/* DOCUMENTS TAB */}
      {activeTab === "documents" && (
        <div className="animate-fade-in">
          <DocumentUpload
            isVerified={profile.is_verified}
            verificationStatus={profile.verification_status}
          />
        </div>
      )}

      {/* AVAILABILITY TAB */}
      {activeTab === "availability" && (
        <div className="animate-fade-in">
          <AvailabilityCalendar
            initialAvailability={profile.availability}
            onSaved={(av) => setProfile((prev) => ({ ...prev, availability: av }))}
          />
        </div>
      )}
    </div>
  );
}
