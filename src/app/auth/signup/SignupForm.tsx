"use client";

import React, { useState, useActionState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Building,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { signup, type AuthResult } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

type Role = "teacher" | "institute" | null;

const STEPS = ["Choose Role", "Your Details", "Credentials"];

export default function SignupForm() {
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formState, formAction, isPending] = useActionState(
    async (_prevState: AuthResult, formData: FormData): Promise<AuthResult> => {
      return await signup(formData);
    },
    {} as AuthResult
  );

  const goNext = () => {
    if (step === 0 && !selectedRole) return;
    setStep((s) => Math.min(s + 1, 2));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-4">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs text-emerald-300 font-medium">
            Free to join
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Create Your Account
        </h1>
        <p className="text-slate-400 text-sm">
          Join Sri Lanka&apos;s premier education platform
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                  i < step
                    ? "bg-emerald-500 text-white"
                    : i === step
                      ? "bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/40"
                      : "bg-slate-800 text-slate-500"
                )}
              >
                {i < step ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:block",
                  i === step ? "text-white" : "text-slate-500"
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px w-8 transition-colors duration-300",
                  i < step ? "bg-emerald-500" : "bg-slate-700"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-8">
        {/* Error Display */}
        {formState.error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {formState.error}
          </div>
        )}

        {/* ─── STEP 0: Choose Role ─────────────────────────── */}
        {step === 0 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400 text-center mb-6">
              How do you want to use GuruWeediya.lk?
            </p>

            {/* Teacher Card */}
            <button
              type="button"
              onClick={() => setSelectedRole("teacher")}
              className={cn(
                "w-full p-5 rounded-xl border-2 text-left transition-all duration-300 group cursor-pointer",
                selectedRole === "teacher"
                  ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                  : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800"
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl transition-colors shrink-0",
                    selectedRole === "teacher"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-700 text-slate-400 group-hover:bg-slate-600"
                  )}
                >
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    I&apos;m a Teacher
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Create your profile, showcase your skills, and connect
                    with institutes looking for qualified tutors.
                  </p>
                </div>
                <div
                  className={cn(
                    "ml-auto mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                    selectedRole === "teacher"
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-slate-600"
                  )}
                >
                  {selectedRole === "teacher" && (
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  )}
                </div>
              </div>
            </button>

            {/* Institute Card */}
            <button
              type="button"
              onClick={() => setSelectedRole("institute")}
              className={cn(
                "w-full p-5 rounded-xl border-2 text-left transition-all duration-300 group cursor-pointer",
                selectedRole === "institute"
                  ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10"
                  : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800"
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl transition-colors shrink-0",
                    selectedRole === "institute"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-700 text-slate-400 group-hover:bg-slate-600"
                  )}
                >
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    I&apos;m an Institute
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Post job listings, discover verified teachers, and
                    schedule interviews to grow your institute.
                  </p>
                </div>
                <div
                  className={cn(
                    "ml-auto mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                    selectedRole === "institute"
                      ? "border-blue-500 bg-blue-500"
                      : "border-slate-600"
                  )}
                >
                  {selectedRole === "institute" && (
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  )}
                </div>
              </div>
            </button>

            <Button
              className="w-full mt-4"
              size="lg"
              onClick={goNext}
              disabled={!selectedRole}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Continue
            </Button>
          </div>
        )}

        {/* ─── STEP 1: Personal Details ────────────────────── */}
        {step === 1 && (
          <div className="space-y-5">
            <p className="text-sm text-slate-400 text-center mb-2">
              {selectedRole === "teacher"
                ? "Tell us about yourself"
                : "Tell us about your institute"}
            </p>

            {selectedRole === "teacher" ? (
              <Input
                label="Full Name"
                name="fullNamePreview"
                placeholder="e.g. Kasun Perera"
                leftIcon={<User className="h-4 w-4" />}
                required
                id="signup-full-name"
              />
            ) : (
              <Input
                label="Institute Name"
                name="instituteNamePreview"
                placeholder="e.g. Colombo International Academy"
                leftIcon={<Building className="h-4 w-4" />}
                required
                id="signup-institute-name"
              />
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={goBack}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  // Move values forward
                  goNext();
                }}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* ─── STEP 2: Credentials (actual form submit) ────── */}
        {step === 2 && (
          <form action={formAction} className="space-y-5">
            <p className="text-sm text-slate-400 text-center mb-2">
              Set up your login credentials
            </p>

            {/* Hidden fields */}
            <input type="hidden" name="role" value={selectedRole || ""} />
            <input
              type="hidden"
              name="fullName"
              value={
                (typeof document !== "undefined" &&
                  (document.querySelector<HTMLInputElement>(
                    "#signup-full-name"
                  )?.value ||
                    "")) ||
                ""
              }
            />
            <input
              type="hidden"
              name="instituteName"
              value={
                (typeof document !== "undefined" &&
                  (document.querySelector<HTMLInputElement>(
                    "#signup-institute-name"
                  )?.value ||
                    "")) ||
                ""
              }
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                leftIcon={<Lock className="h-4 w-4" />}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={goBack}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1"
                isLoading={isPending}
                rightIcon={
                  !isPending ? <ArrowRight className="h-4 w-4" /> : undefined
                }
              >
                Create Account
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Footer link */}
      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
