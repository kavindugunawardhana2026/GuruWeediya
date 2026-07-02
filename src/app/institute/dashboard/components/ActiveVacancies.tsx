"use client";

import React, { useTransition } from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  AlertCircle,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatLKR, formatDate } from "@/lib/utils";
import type { Job } from "@/types/database";
import { closeJob } from "../actions";

interface Props {
  jobs: (Job & { interview_count?: number })[];
}

export default function ActiveVacancies({ jobs }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClose = (jobId: string) => {
    startTransition(async () => {
      await closeJob(jobId);
    });
  };

  if (jobs.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <Briefcase className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Active Vacancies</h3>
        <p className="text-sm text-slate-400 max-w-sm mb-6">
          You haven't posted any job listings yet. Create a vacancy to start receiving applications from teachers.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {jobs.map((job) => (
        <Card key={job.id} hover className="overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-white">{job.title}</h3>
                {job.status === "open" ? (
                  <Badge variant="success" dot>Open</Badge>
                ) : (
                  <Badge variant="default">Closed</Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-300">
                  {job.subject}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-300">
                  {job.class_category}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-300">
                  {job.medium} Medium
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  {job.location || job.district || "Not specified"}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-500" />
                  Posted {formatDate(job.created_at)}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white leading-none">
                    {job.interview_count || 0}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Interviews</p>
                </div>
              </div>

              {job.status === "open" && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleClose(job.id)}
                  disabled={isPending}
                >
                  Close Job
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
