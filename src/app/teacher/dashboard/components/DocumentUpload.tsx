"use client";

import React, { useState, useRef, useActionState } from "react";
import {
  Upload,
  FileText,
  CreditCard,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Shield,
  X,
  FileImage,
  Loader2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card, { CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { uploadDocument, type ActionResult } from "../actions";

interface Props {
  isVerified: boolean;
  verificationStatus: string;
}

// ─── Single Upload Zone ───────────────────────────────────────

function UploadZone({
  docType,
  label,
  description,
  icon: Icon,
  acceptedTypes,
  color,
  uploaded,
  onUploaded,
}: {
  docType: "nic" | "certificate";
  label: string;
  description: string;
  icon: React.ElementType;
  acceptedTypes: string;
  color: "emerald" | "blue";
  uploaded: boolean;
  onUploaded: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const colorMap = {
    emerald: {
      icon: "bg-emerald-500/10 text-emerald-400",
      border: dragOver
        ? "border-emerald-500 bg-emerald-500/5"
        : "border-slate-700 hover:border-emerald-500/50",
      badge: "success" as const,
    },
    blue: {
      icon: "bg-blue-500/10 text-blue-400",
      border: dragOver
        ? "border-blue-500 bg-blue-500/5"
        : "border-slate-700 hover:border-blue-500/50",
      badge: "info" as const,
    },
  };
  const c = colorMap[color];

  const [state, formAction, isPending] = useActionState(
    async (_prev: ActionResult, formData: FormData): Promise<ActionResult> => {
      formData.set("doc_type", docType);
      const result = await uploadDocument(_prev, formData);
      if (result.success) onUploaded();
      return result;
    },
    {} as ActionResult
  );

  const handleFile = (file: File) => {
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <Card className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", c.icon)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">{label}</p>
            {uploaded && <Badge variant="success" dot>Submitted</Badge>}
          </div>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>

      {/* Accepted types */}
      <p className="text-xs text-slate-600">
        Accepted: {acceptedTypes} · Max 5MB
      </p>

      {/* Status/Error */}
      {(state.success || state.error) && (
        <div className={cn(
          "flex items-center gap-2 p-3 rounded-lg text-xs border",
          state.success
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            : "bg-red-500/10 border-red-500/20 text-red-400"
        )}>
          {state.success ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          {state.message || state.error}
        </div>
      )}

      {/* Upload form */}
      <form action={formAction}>
        {/* Drop zone */}
        <div
          className={cn(
            "relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer",
            c.border
          )}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => fileRef.current?.click()}
        >
          {/* Hidden actual input */}
          <input
            ref={fileRef}
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          {selectedFile ? (
            <div className="space-y-2">
              {preview ? (
                <img src={preview} alt="Preview" className="mx-auto h-20 w-20 object-cover rounded-lg border border-slate-700" />
              ) : (
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800">
                  <FileImage className="h-7 w-7 text-slate-400" />
                </div>
              )}
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm text-white font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreview(null); }}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(0)} KB</p>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-8 w-8 text-slate-600 mb-3" />
              <p className="text-sm text-slate-400">
                Drag & drop or <span className="text-emerald-400 font-medium">browse</span>
              </p>
              <p className="text-xs text-slate-600 mt-1">JPG, PNG, WebP, or PDF</p>
            </>
          )}
        </div>

        {/* Submit */}
        {selectedFile && (
          <Button
            type="submit"
            size="sm"
            className="w-full mt-3"
            isLoading={isPending}
            leftIcon={isPending ? undefined : <Upload className="h-4 w-4" />}
            disabled={isPending}
          >
            {isPending ? "Uploading…" : "Upload for Verification"}
          </Button>
        )}
      </form>
    </Card>
  );
}

// ─── Main Document Upload ─────────────────────────────────────

export default function DocumentUpload({ isVerified, verificationStatus }: Props) {
  const [nicUploaded, setNicUploaded] = useState(false);
  const [certUploaded, setCertUploaded] = useState(false);

  return (
    <div className="space-y-6">
      {/* Verification Status Banner */}
      <Card className={cn(
        "border",
        isVerified
          ? "border-emerald-500/30 bg-emerald-500/5"
          : verificationStatus === "pending"
            ? "border-amber-500/30 bg-amber-500/5"
            : "border-slate-700"
      )}>
        <div className="flex items-start gap-4">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl shrink-0",
            isVerified ? "bg-emerald-500/20" : "bg-amber-500/10"
          )}>
            <Shield className={cn("h-6 w-6", isVerified ? "text-emerald-400" : "text-amber-400")} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-white">Verification Status</h3>
              {isVerified ? (
                <Badge variant="success" dot>Verified ✓</Badge>
              ) : verificationStatus === "pending" ? (
                <Badge variant="warning" dot>Under Review</Badge>
              ) : verificationStatus === "rejected" ? (
                <Badge variant="danger" dot>Rejected</Badge>
              ) : (
                <Badge variant="default" dot>Not Submitted</Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isVerified
                ? "Your profile is verified! You appear in institute searches with a verified badge."
                : verificationStatus === "pending"
                  ? "Your documents are under review. This typically takes 1–2 business days. We'll notify you by email."
                  : verificationStatus === "rejected"
                    ? "Your documents were rejected. Please upload clearer copies of your NIC and certificates."
                    : "Submit your NIC and degree/professional certificates to get verified. Verified teachers appear higher in search results."}
            </p>
          </div>
        </div>
      </Card>

      {/* Info Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: CheckCircle2, text: "Verified badge on profile", color: "text-emerald-400" },
          { icon: CheckCircle2, text: "Higher search ranking", color: "text-emerald-400" },
          { icon: CheckCircle2, text: "More interview requests", color: "text-emerald-400" },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-2 text-xs text-slate-400 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
            <item.icon className={cn("h-4 w-4 shrink-0", item.color)} />
            {item.text}
          </div>
        ))}
      </div>

      {/* Upload Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadZone
          docType="nic"
          label="National Identity Card (NIC)"
          description="Front and/or back of your NIC"
          icon={CreditCard}
          acceptedTypes="JPG, PNG, PDF"
          color="emerald"
          uploaded={nicUploaded}
          onUploaded={() => setNicUploaded(true)}
        />
        <UploadZone
          docType="certificate"
          label="Degree / Professional Certificate"
          description="University degree, teaching certificate, or professional qualification"
          icon={GraduationCap}
          acceptedTypes="JPG, PNG, PDF"
          color="blue"
          uploaded={certUploaded}
          onUploaded={() => setCertUploaded(true)}
        />
      </div>

      {/* Privacy Note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-800">
        <Shield className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-500 leading-relaxed">
          Your documents are stored securely and are only visible to GuruWeediya.lk administrators
          for verification purposes. They are never shared with institutes or third parties.
        </p>
      </div>
    </div>
  );
}
