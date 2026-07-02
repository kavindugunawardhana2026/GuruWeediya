"use client";

import React, { useState, useActionState } from "react";
import {
  User,
  Phone,
  DollarSign,
  Video,
  Plus,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  MapPin,
  Globe,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card, { CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { SUBJECTS, MEDIUMS, DISTRICTS } from "@/lib/constants";
import { updateTeacherProfile, type ActionResult } from "../actions";

interface ProfileData {
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
  initialProfile: ProfileData;
  onSaved: (updated: Partial<ProfileData>) => void;
}

// ─── Tag Selector ─────────────────────────────────────────────

function TagSelector({
  label,
  description,
  icon: Icon,
  options,
  selected,
  onChange,
  color = "emerald",
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  options: readonly string[];
  selected: string[];
  onChange: (vals: string[]) => void;
  color?: "emerald" | "blue" | "purple";
}) {
  const colorMap = {
    emerald: {
      selected: "bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/20",
      unselected: "bg-slate-800 text-slate-400 border-slate-700 hover:border-emerald-500/50 hover:text-white",
      icon: "text-emerald-400 bg-emerald-500/10",
    },
    blue: {
      selected: "bg-blue-500 text-white border-blue-500 shadow-blue-500/20",
      unselected: "bg-slate-800 text-slate-400 border-slate-700 hover:border-blue-500/50 hover:text-white",
      icon: "text-blue-400 bg-blue-500/10",
    },
    purple: {
      selected: "bg-purple-500 text-white border-purple-500 shadow-purple-500/20",
      unselected: "bg-slate-800 text-slate-400 border-slate-700 hover:border-purple-500/50 hover:text-white",
      icon: "text-purple-400 bg-purple-500/10",
    },
  };
  const c = colorMap[color];

  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", c.icon)}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        {selected.length > 0 && (
          <span className="ml-auto text-xs text-slate-500">{selected.length} selected</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 cursor-pointer shadow-sm",
              selected.includes(opt) ? cn(c.selected, "shadow-md") : c.unselected
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Custom Tag Input ─────────────────────────────────────────

function CustomTagInput({
  label,
  tags,
  onChange,
  placeholder,
}: {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) {
      onChange([...tags, val]);
      setInput("");
    }
  };

  return (
    <div>
      <p className="text-sm font-medium text-slate-300 mb-2">{label}</p>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
        />
        <Button type="button" size="sm" variant="secondary" onClick={addTag}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
              {tag}
              <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))} className="hover:text-white transition-colors cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Profile Editor ──────────────────────────────────────

export default function ProfileEditor({ initialProfile, onSaved }: Props) {
  const [subjects, setSubjects] = useState<string[]>(initialProfile.subjects);
  const [mediums, setMediums] = useState<string[]>(initialProfile.mediums);
  const [districts, setDistricts] = useState<string[]>(initialProfile.districts);
  const [customSubjects, setCustomSubjects] = useState<string[]>([]);

  const allSubjects = [...subjects.filter((s) => !(SUBJECTS as readonly string[]).includes(s))];
  if (allSubjects.length !== customSubjects.length) {
    // sync on first render
  }

  const [formState, formAction, isPending] = useActionState(
    async (_prev: ActionResult, formData: FormData): Promise<ActionResult> => {
      // Inject array values as JSON strings
      formData.set("subjects", JSON.stringify([...subjects, ...customSubjects.filter((s) => !subjects.includes(s))]));
      formData.set("mediums", JSON.stringify(mediums));
      formData.set("districts", JSON.stringify(districts));
      formData.set("availability", JSON.stringify({})); // handled by Availability tab

      const result = await updateTeacherProfile(_prev, formData);
      if (result.success) {
        onSaved({
          full_name: formData.get("full_name") as string,
          bio: formData.get("bio") as string,
          phone: formData.get("phone") as string,
          hourly_rate: formData.get("hourly_rate") as string,
          youtube_demo_url: formData.get("youtube_demo_url") as string,
          subjects: [...subjects, ...customSubjects],
          mediums,
          districts,
        });
      }
      return result;
    },
    {} as ActionResult
  );

  return (
    <div className="space-y-6">
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
        {/* ── Section 1: Basic Info ───────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <User className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your public profile details</CardDescription>
              </div>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Full Name"
              name="full_name"
              defaultValue={initialProfile.full_name}
              placeholder="e.g. Kasun Perera"
              leftIcon={<User className="h-4 w-4" />}
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              defaultValue={initialProfile.phone}
              placeholder="e.g. 071 234 5678"
              leftIcon={<Phone className="h-4 w-4" />}
            />
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Bio
            </label>
            <textarea
              name="bio"
              defaultValue={initialProfile.bio}
              rows={4}
              placeholder="Describe your teaching experience, qualifications, and what makes you unique..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none resize-none transition-all"
            />
          </div>
        </Card>

        {/* ── Section 2: Teaching Details ────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <BookOpen className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <CardTitle>Teaching Details</CardTitle>
                <CardDescription>Subjects, mediums, and rate</CardDescription>
              </div>
            </div>
          </CardHeader>

          <div className="space-y-6">
            {/* Subjects */}
            <TagSelector
              label="Subjects You Teach"
              description="Select all that apply"
              icon={BookOpen}
              options={SUBJECTS}
              selected={subjects}
              onChange={setSubjects}
              color="emerald"
            />

            {/* Custom subject input */}
            <CustomTagInput
              label="Other subjects (not listed above)"
              tags={customSubjects}
              onChange={setCustomSubjects}
              placeholder="Type a subject and press Enter..."
            />

            {/* Mediums */}
            <TagSelector
              label="Teaching Mediums"
              description="Languages you teach in"
              icon={Globe}
              options={MEDIUMS}
              selected={mediums}
              onChange={setMediums}
              color="blue"
            />

            {/* Hourly Rate */}
            <Input
              label="Hourly Rate (LKR)"
              name="hourly_rate"
              type="number"
              defaultValue={initialProfile.hourly_rate}
              placeholder="e.g. 2500"
              leftIcon={<DollarSign className="h-4 w-4" />}
              helperText="Per-hour rate in Sri Lankan Rupees"
              min="0"
            />
          </div>
        </Card>

        {/* ── Section 3: Location ─────────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                <MapPin className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <CardTitle>Preferred Districts</CardTitle>
                <CardDescription>Where you're available to teach</CardDescription>
              </div>
            </div>
          </CardHeader>

          <TagSelector
            label="Districts"
            description="Select all districts you can commute to"
            icon={MapPin}
            options={DISTRICTS}
            selected={districts}
            onChange={setDistricts}
            color="purple"
          />
        </Card>

        {/* ── Section 4: Demo Video ───────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                <Video className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <CardTitle>Demo Lesson Video</CardTitle>
                <CardDescription>Link a YouTube video to showcase your teaching style</CardDescription>
              </div>
            </div>
          </CardHeader>

          <Input
            label="YouTube Video URL"
            name="youtube_demo_url"
            type="url"
            defaultValue={initialProfile.youtube_demo_url}
            placeholder="https://www.youtube.com/watch?v=..."
            leftIcon={<Video className="h-4 w-4" />}
            helperText="Institutes will see this video on your profile"
          />

          {/* Preview */}
          {initialProfile.youtube_demo_url && (
            <div className="mt-4 rounded-xl overflow-hidden border border-slate-700 aspect-video">
              <iframe
                src={initialProfile.youtube_demo_url.replace("watch?v=", "embed/")}
                className="w-full h-full"
                allowFullScreen
                title="Demo lesson preview"
              />
            </div>
          )}
        </Card>

        {/* ── Save Button ─────────────────────────────── */}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            isLoading={isPending}
            leftIcon={!isPending ? <Save className="h-4 w-4" /> : undefined}
          >
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
