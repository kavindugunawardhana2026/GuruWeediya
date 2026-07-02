"use client";

import React, { useState, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  LogIn,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { login, type AuthResult } from "@/lib/auth/actions";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const authError = searchParams.get("error");
  const [showPassword, setShowPassword] = useState(false);

  const [formState, formAction, isPending] = useActionState(
    async (_prevState: AuthResult, formData: FormData): Promise<AuthResult> => {
      return await login(formData);
    },
    {} as AuthResult
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
          <GraduationCap className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-slate-400 text-sm">
          Sign in to your GuruWeediya.lk account
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-8">
        {/* Error display */}
        {(formState.error || authError) && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {formState.error ||
              (authError === "auth_callback_failed"
                ? "Authentication failed. Please try again."
                : authError)}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          {/* Pass redirect URL */}
          {redirectTo && (
            <input type="hidden" name="redirect" value={redirectTo} />
          )}

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
              placeholder="Enter your password"
              leftIcon={<Lock className="h-4 w-4" />}
              required
              autoComplete="current-password"
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

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-xs text-slate-500 hover:text-emerald-400 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isPending}
            leftIcon={!isPending ? <LogIn className="h-4 w-4" /> : undefined}
          >
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-xs text-slate-600 uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Quick sign up prompt */}
        <Button
          variant="secondary"
          className="w-full"
          href="/auth/signup"
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Create a New Account
        </Button>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-slate-600 mt-6">
        By signing in, you agree to our{" "}
        <Link
          href="/terms"
          className="text-slate-400 hover:text-emerald-400 transition-colors"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="text-slate-400 hover:text-emerald-400 transition-colors"
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
