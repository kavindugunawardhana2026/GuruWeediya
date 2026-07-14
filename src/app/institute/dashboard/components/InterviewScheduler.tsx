
"use client";

import React, { useState } from "react";
import { Calendar, Clock, Video, FileText, Send } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { scheduleInterview } from "@/lib/actions/interviews";

export default function InterviewScheduler({ 
  jobId, 
  teacherId, 
  teacherName, 
  onSuccess 
}: { 
  jobId: string; 
  teacherId: string; 
  teacherName: string; 
  onSuccess?: () => void 
}) {
  const [status, setStatus] = useState<{ success?: boolean; error?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setStatus(null);
    
    const result = await scheduleInterview(formData);
    
    if (result.error) {
      setStatus({ error: result.error });
    } else {
      setStatus({ success: true });
      if (onSuccess) onSuccess();
    }
    setIsSubmitting(false);
  }

  return (
    <Card padding="lg" className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <Calendar className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Schedule Interview</h3>
          <p className="text-sm text-slate-400">Booking for {teacherName}</p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-5">
        <input type="hidden" name="jobId" value={jobId} />
        <input type="hidden" name="teacherId" value={teacherId} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Date"
            name="scheduledDate"
            type="date"
            required
            leftIcon={<Calendar className="h-4 w-4" />}
          />
          <Input
            label="Time Slot"
            name="timeSlot"
            placeholder="e.g. 10:00 AM - 11:00 AM"
            required
            leftIcon={<Clock className="h-4 w-4" />}
          />
        </div>

        <Input
          label="Meeting Link (Zoom/Google Meet)"
          name="meetingLink"
          placeholder="https://meet.google.com/..."
          leftIcon={<Video className="h-4 w-4" />}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Internal Notes</label>
          <textarea
            name="notes"
            rows={3}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            placeholder="Mention specific things to discuss during the interview..."
          />
        </div>

        {status?.error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {status.error}
          </div>
        )}

        {status?.success && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            Interview scheduled successfully!
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full flex items-center justify-center gap-2" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Scheduling..." : (
            <>
              <Send className="h-4 w-4" />
              Send Invitation
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
