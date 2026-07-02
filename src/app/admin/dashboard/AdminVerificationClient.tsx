"use client";

import React, { useState, useTransition } from "react";
import { Check, X, FileText, ExternalLink, User } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { approveTeacher, rejectTeacher } from "./actions";

export interface PendingDocument {
  id: string;
  user_id: string;
  doc_type: string;
  file_path: string;
  status: string;
  created_at: string;
  teacher: {
    id: string;
    full_name: string;
    subjects: string[];
    is_verified: boolean;
  } | null;
}

interface Props {
  pendingDocs: PendingDocument[];
}

export default function AdminVerificationClient({ pendingDocs }: Props) {
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState("");

  const handleApprove = (docId: string, teacherId: string) => {
    startTransition(async () => {
      setActionError("");
      const res = await approveTeacher(docId, teacherId);
      if (res.error) setActionError(res.error);
    });
  };

  const handleReject = (docId: string, teacherId: string) => {
    const reason = prompt("Enter reason for rejection (optional):") || "Documents rejected by admin";
    startTransition(async () => {
      setActionError("");
      const res = await rejectTeacher(docId, teacherId, reason);
      if (res.error) setActionError(res.error);
    });
  };

  if (pendingDocs.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 border-dashed">
        <div className="h-16 w-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-emerald-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">All Caught Up!</h3>
        <p className="text-slate-400 text-sm">No pending verification documents to review.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {actionError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          {actionError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {pendingDocs.map((doc) => {
          const teacher = doc.teacher;
          
          return (
            <Card key={doc.id} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <User className="h-6 w-6 text-slate-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {teacher ? teacher.full_name : "Unknown Teacher"}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1 mb-2">
                    {teacher?.subjects.slice(0,2).map(s => (
                      <span key={s} className="text-[10px] uppercase tracking-wider font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                    {teacher && teacher.subjects.length > 2 && (
                      <span className="text-[10px] uppercase tracking-wider font-semibold bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                        +{teacher.subjects.length - 2}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <FileText className="h-4 w-4" />
                    <span>{doc.doc_type.toUpperCase()} Document</span>
                    <span>•</span>
                    <a 
                      href={doc.file_path} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      View File <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-slate-800/50">
                <Button 
                  variant="outline"
                  onClick={() => teacher && handleReject(doc.id, teacher.id)}
                  disabled={isPending || !teacher}
                  className="flex-1 sm:flex-none border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  Reject
                </Button>
                <Button 
                  onClick={() => teacher && handleApprove(doc.id, teacher.id)}
                  disabled={isPending || !teacher}
                  className="flex-1 sm:flex-none bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 hover:border-emerald-500/50"
                  leftIcon={<Check className="h-4 w-4" />}
                >
                  Approve
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
