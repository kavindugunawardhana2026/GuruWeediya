"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { applyForJob } from "@/lib/actions/applications";
import { Send, CheckCircle2 } from "lucide-react";

export default function ApplyButton({ jobId, hasApplied }: { jobId: string; hasApplied: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (hasApplied) {
    return (
      <Button disabled variant="outline" className="!border-emerald-500/30 !text-emerald-400">
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Applied
      </Button>
    );
  }

  const handleApply = async () => {
    setLoading(true);
    setError("");

    const res = await applyForJob(jobId, message);
    if (res?.error) {
      setError(res.error);
    } else {
      setIsOpen(false);
    }
    setLoading(false);
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="!from-emerald-500 !to-teal-500 !shadow-emerald-500/25 hover:!shadow-emerald-500/40"
      >
        <Send className="h-4 w-4 mr-2" />
        Apply Now
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-2">Apply for Position</h3>
            <p className="text-sm text-slate-400 mb-6">
              Send a brief message to the institute to introduce yourself.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Cover Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I am interested in this position..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none transition-colors"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleApply} disabled={loading} className="!from-emerald-500 !to-teal-500">
                {loading ? "Sending..." : "Submit Application"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
