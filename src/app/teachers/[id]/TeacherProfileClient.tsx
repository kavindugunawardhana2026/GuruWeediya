"use client";

import React, { useState, useTransition } from "react";
import {
  User,
  CheckCircle2,
  MapPin,
  BookOpen,
  Globe,
  Video,
  DollarSign,
  CalendarCheck,
  Briefcase,
  X,
  AlertCircle,
  FileText,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import type { Teacher, Job } from "@/types/database";
import { DAYS_OF_WEEK, TIME_SLOTS } from "@/lib/constants";
import { inviteTeacher } from "../actions";
import MOUGeneratorModal from "@/components/MOUGeneratorModal";
import ReviewSection from "@/components/ReviewSection";
import type { ReviewWithInstitute } from "@/types/database";

interface Props {
  teacher: Teacher;
  instituteJobs: Job[];
  reviews: ReviewWithInstitute[];
  isInstitute: boolean;
}

export default function TeacherProfileClient({
  teacher,
  instituteJobs,
  reviews,
  isInstitute,
}: Props) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isMOUModalOpen, setIsMOUModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [inviteResult, setInviteResult] = useState<{ success?: boolean; error?: string; message?: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const availability = (teacher.availability as Record<string, string[]>) || {};

  // Extract YouTube Video ID
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };

  const videoId = teacher.youtube_demo_url ? getYouTubeId(teacher.youtube_demo_url) : null;

  const handleInvite = () => {
    if (!selectedJobId) return;

    startTransition(async () => {
      setInviteResult(null);
      const result = await inviteTeacher(teacher.id, selectedJobId);
      setInviteResult(result);
      if (result.success) {
        setTimeout(() => {
          setIsInviteModalOpen(false);
          setInviteResult(null);
        }, 2000);
      }
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 animate-fade-in relative">
      
      {/* ─── Profile Header ────────────────────────────────────── */}
      <div className="relative rounded-3xl bg-slate-900/50 border border-slate-800 overflow-hidden mb-8">
        {/* Cover Graphic */}
        <div className="h-32 w-full bg-gradient-to-r from-emerald-900/40 via-teal-900/40 to-slate-900" />
        
        <div className="px-6 pb-6 sm:px-10 sm:pb-8 relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row gap-6 sm:items-end">
          {/* Avatar */}
          <div className="shrink-0 h-32 w-32 sm:h-40 sm:w-40 rounded-2xl overflow-hidden bg-slate-800 border-4 border-slate-950 shadow-2xl flex items-center justify-center relative">
            {teacher.profile_image_url ? (
              <img src={teacher.profile_image_url} alt={teacher.full_name} className="w-full h-full object-cover" />
            ) : (
              <User className="h-16 w-16 text-slate-500" />
            )}
            
            {/* Verified Badge Overlay */}
            {teacher.is_verified && (
              <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-lg border border-emerald-500/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
            )}
          </div>

          <div className="flex-1 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{teacher.full_name}</h1>
                {teacher.is_verified ? (
                  <span className="text-emerald-400 font-medium text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified Professional
                  </span>
                ) : (
                  <span className="text-slate-500 font-medium text-sm">
                    Verification Pending
                  </span>
                )}
              </div>
              
              {isInstitute && (
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setIsMOUModalOpen(true)}
                    leftIcon={<FileText className="h-4 w-4" />}
                    variant="outline"
                  >
                    Generate MOU
                  </Button>
                  <Button 
                    onClick={() => setIsInviteModalOpen(true)}
                    leftIcon={<CalendarCheck className="h-4 w-4" />}
                    className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 hover:border-emerald-500/50"
                  >
                    Invite to Interview
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ─── Left Column (Bio & Details) ───────────────────────── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About / Bio */}
          {teacher.bio && (
            <section>
              <h2 className="text-lg font-bold text-white mb-4">About</h2>
              <div className="text-slate-300 leading-relaxed text-sm bg-slate-900/30 border border-slate-800/50 p-6 rounded-2xl">
                {teacher.bio}
              </div>
            </section>
          )}

          {/* Demo Video */}
          {videoId && (
            <section>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Video className="h-5 w-5 text-red-500" />
                Demo Lesson
              </h2>
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video shadow-xl relative group">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0"
                />
              </div>
            </section>
          )}

          {/* Sample Materials Preview */}
          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              Sample Materials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card hover padding="sm" className="flex items-start gap-4">
                <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0 border border-blue-500/20">
                  <FileText className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Advanced Mechanics Notes</h4>
                  <p className="text-xs text-slate-400 mb-2">PDF • 2.4 MB</p>
                  <Button variant="ghost" size="sm" className="h-7 text-xs px-2 text-emerald-400 hover:text-emerald-300">
                    Preview
                  </Button>
                </div>
              </Card>
              <Card hover padding="sm" className="flex items-start gap-4">
                <div className="h-10 w-10 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0 border border-amber-500/20">
                  <FileText className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Organic Chemistry Basics</h4>
                  <p className="text-xs text-slate-400 mb-2">PDF • 1.8 MB</p>
                  <Button variant="ghost" size="sm" className="h-7 text-xs px-2 text-emerald-400 hover:text-emerald-300">
                    Preview
                  </Button>
                </div>
              </Card>
            </div>
          </section>
          
          {/* Availability Read-Only Calendar */}
          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-amber-400" />
              Typical Availability
            </h2>
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/50">
                      <th className="p-3 text-left text-xs text-slate-500 font-medium">Time</th>
                      {DAYS_OF_WEEK.map((day) => (
                        <th key={day} className="p-2 text-center text-xs text-slate-400 font-medium">
                          {day.slice(0, 3)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TIME_SLOTS.map((slot, i) => (
                      <tr key={slot} className={i % 2 === 0 ? "bg-slate-950/30" : ""}>
                        <td className="p-3 text-xs text-slate-500 border-t border-slate-800/30 whitespace-nowrap">
                          {slot}
                        </td>
                        {DAYS_OF_WEEK.map((day) => {
                          const isAvailable = availability[day]?.includes(slot);
                          return (
                            <td key={day} className="p-2 text-center border-t border-slate-800/30">
                              {isAvailable ? (
                                <div className="h-6 w-full rounded-md bg-emerald-500/20 border border-emerald-500/30 shadow-inner" />
                              ) : (
                                <div className="h-6 w-full rounded-md bg-slate-800/20" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

        </div>

        {/* ─── Right Column (Stats & Tags) ───────────────────────── */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider text-slate-400">Teaching Profile</h3>
            
            <div className="space-y-6">
              {/* Hourly Rate */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 shrink-0">
                  <DollarSign className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Expected Rate</p>
                  <p className="text-sm font-semibold text-white">
                    {teacher.hourly_rate ? `LKR ${teacher.hourly_rate} / hr` : "Negotiable"}
                  </p>
                </div>
              </div>

              {/* Subjects */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 shrink-0">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-2">Subjects</p>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.subjects && teacher.subjects.length > 0 ? (
                      teacher.subjects.map(s => (
                        <Badge key={s} variant="info">{s}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400">Not specified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Mediums */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 shrink-0">
                  <Globe className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-2">Teaching Medium</p>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.mediums && teacher.mediums.length > 0 ? (
                      teacher.mediums.map(m => (
                        <Badge key={m} variant="default">{m}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400">Not specified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Districts */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 shrink-0">
                  <MapPin className="h-5 w-5 text-rose-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-2">Preferred Locations</p>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.districts && teacher.districts.length > 0 ? (
                      teacher.districts.map(d => (
                        <span key={d} className="px-2 py-1 text-xs rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          {d}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400">Not specified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ─── Reviews & Ratings ───────────────────────────────── */}
      <div className="mt-12">
        <ReviewSection 
          teacherId={teacher.id} 
          reviews={reviews} 
          isInstitute={isInstitute} 
        />
      </div>

      {/* ─── Invite to Interview Modal ───────────────────────── */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-400" />
                Invite {teacher.full_name.split(' ')[0]}
              </h3>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-400">
                Select one of your active job listings to invite this teacher for an interview.
              </p>

              {inviteResult && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 border ${
                  inviteResult.success 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}>
                  {inviteResult.success ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                  {inviteResult.message || inviteResult.error}
                </div>
              )}

              {instituteJobs.length === 0 ? (
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 text-center">
                  <p className="text-sm text-slate-500 mb-3">You don't have any open job listings.</p>
                  <Button size="sm" href="/institute/dashboard" className="w-full justify-center">
                    Go to Dashboard to Post a Job
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">Select Job</label>
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    disabled={isPending || inviteResult?.success}
                  >
                    <option value="">-- Select a Vacancy --</option>
                    {instituteJobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} ({job.class_category} - {job.subject})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50">
              <Button 
                variant="ghost" 
                onClick={() => setIsInviteModalOpen(false)}
                disabled={isPending || inviteResult?.success}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleInvite} 
                disabled={!selectedJobId || isPending || inviteResult?.success}
                isLoading={isPending}
              >
                Send Invitation
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* ─── MOU Generator Modal ───────────────────────────── */}
      <MOUGeneratorModal 
        isOpen={isMOUModalOpen} 
        onClose={() => setIsMOUModalOpen(false)} 
        teacherName={teacher.full_name} 
      />
    </div>
  );
}
