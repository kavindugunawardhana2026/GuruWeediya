"use client";

import React, { useActionState } from "react";
import {
  Briefcase,
  BookOpen,
  MapPin,
  Globe,
  GraduationCap,
  DollarSign,
  Plus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card, { CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { SUBJECTS, MEDIUMS, DISTRICTS } from "@/lib/constants";
import { createJob, type ActionResult } from "../actions";

const CLASS_CATEGORIES = ["Primary", "O/L", "A/L", "Other"] as const;

export default function JobCreator({ onJobCreated }: { onJobCreated?: () => void }) {
  const [formState, formAction, isPending] = useActionState(
    async (_prev: ActionResult, formData: FormData): Promise<ActionResult> => {
      const result = await createJob(_prev, formData);
      if (result.success && onJobCreated) {
        onJobCreated();
      }
      return result;
    },
    {} as ActionResult
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success / Error Toast */}
      {(formState.success || formState.error) && (
        <div className={cn(
          "flex items-center gap-3 p-4 rounded-xl border text-sm",
          formState.success
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            : "bg-red-500/10 border-red-500/20 text-red-400"
        )}>
          {formState.success
            ? <CheckCircle2 className="h-5 w-5 shrink-0" />
            : <AlertCircle className="h-5 w-5 shrink-0" />}
          <span>{formState.message || formState.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Plus className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <CardTitle>Post a New Vacancy</CardTitle>
                <CardDescription>Fill out the details to find the perfect teacher.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <div className="space-y-6">
            <Input
              label="Job Title"
              name="title"
              placeholder="e.g. Senior A/L Physics Teacher"
              leftIcon={<Briefcase className="h-4 w-4" />}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Subject */}
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Subject</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <select
                    name="subject"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 pl-10 text-sm text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none appearance-none"
                  >
                    <option value="">Select a Subject...</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Class Category */}
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Class Category</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <select
                    name="class_category"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 pl-10 text-sm text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none appearance-none"
                  >
                    <option value="">Select a Category...</option>
                    {CLASS_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Medium */}
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Medium</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                    <Globe className="h-4 w-4" />
                  </div>
                  <select
                    name="medium"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 pl-10 text-sm text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none appearance-none"
                  >
                    <option value="">Select a Medium...</option>
                    {MEDIUMS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* District */}
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">District</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <select
                    name="district"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 pl-10 text-sm text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none appearance-none"
                  >
                    <option value="">Select a District...</option>
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Target Branch / Location (Optional)"
                name="location"
                placeholder="e.g. Nugegoda Branch"
                leftIcon={<MapPin className="h-4 w-4" />}
              />
              <Input
                label="Budget Range (Optional)"
                name="budget_range"
                placeholder="e.g. LKR 3000 - 5000 / hr"
                leftIcon={<DollarSign className="h-4 w-4" />}
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Description (Optional)</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe the class size, expected qualifications, and schedule..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none resize-none transition-all"
              />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            isLoading={isPending}
            leftIcon={!isPending ? <Plus className="h-4 w-4" /> : undefined}
          >
            Publish Job Listing
          </Button>
        </div>
      </form>
    </div>
  );
}
