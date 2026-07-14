
"use client";

import React, { useTransition } from "react";
import {
  CalendarCheck,
  Video,
  CheckCircle2,
  XCircle,
  Clock,
  User,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import type { InterviewWithDetails } from "@/types/database";
import { respondToInterview } from "@/lib/actions/interviews";

interface Props {
  interviews: InterviewWithDetails[];
}

export default function TeacherInterviews({ interviews }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleResponse = (id: string, status: "accepted" | "declined") => {
    startTransition(async () => {
      await respondToInterview(id, status);
    });
  };

  if (interviews.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <CalendarCheck className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Interviews Scheduled</h3>
        <p className="text-sm text-slate-400 max-w-sm">
          When institutes are interested in your profile, they will schedule interviews here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {interviews.map((interview) => (
        <Card key={interview.id} hover className="overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 shrink-0">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {interview.institute?.institute_name || "Unknown Institute"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Interview for: <span className="font-medium text-slate-300">{interview.job?.title}</span>
                  </p>
                </div>
                <div className="ml-auto">
                  {interview.status === "accepted" ? (
                    <Badge variant="success" dot>Confirmed</Badge>
                  ) : interview.status === "declined" ? (
                    <Badge variant="danger" dot>Declined</Badge>
                  ) : (
                    <Badge variant="warning" dot>Pending</Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span className="font-medium">
                    {interview.scheduled_date ? formatDate(interview.scheduled_date) : "Date TBD"}
                  </span>
                </div>
                <div className="h-4 w-px bg-slate-700" />
                <div>{interview.time_slot || "Time TBD"}</div>
              </div>
            </div>

            <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
              {interview.meeting_link ? (
                <a
                  href={interview.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors mb-4 md:mb-0"
                >
                  <Video className="h-4 w-4" />
                  Join Meeting
                </a>
              ) : (
                <div className="text-xs text-slate-500 mb-4 md:mb-0">No meeting link provided</div>
              )}

              {interview.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResponse(interview.id, "declined")}
                    disabled={isPending}
                    className="!px-3"
                    title="Decline"
                  >
                    <XCircle className="h-4 w-4 text-red-400" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleResponse(interview.id, "accepted")}
                    disabled={isPending}
                    className="!px-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 hover:border-emerald-500/50"
                    title="Accept"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
