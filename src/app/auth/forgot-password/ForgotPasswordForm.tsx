"use client";

import React, { useState, useActionState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send, KeyRound } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { resetPasswordForEmail, type AuthResult } from "@/lib/auth/actions";

export default function ForgotPasswordForm() {
  const [success, setSuccess] = useState(false);
  const [formState, formAction, isPending] = useActionState(
    async (_prevState: AuthResult, formData: FormData): Promise<AuthResult> => {
      const res = await resetPasswordForEmail(formData);
      if (res.success) {
        setSuccess(true);
      }
      return res;
    },
    {} as AuthResult
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
          <KeyRound className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-slate-400 text-sm">
          Enter your email to receive a password reset link
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-8">
        {success ? (
          <div className="text-center">
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <h3 className="text-emerald-400 font-semibold mb-2">Check your email</h3>
              <p className="text-slate-300 text-sm">
                We've sent a password reset link to your email address. Please check your inbox and spam folder.
              </p>
            </div>
            <Button
              variant="secondary"
              className="w-full"
              href="/auth/login"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Login
            </Button>
          </div>
        ) : (
          <>
            {/* Error display */}
            {formState.error && (
              <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {formState.error}
              </div>
            )}

            <form action={formAction} className="space-y-5">
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
                required
                autoComplete="email"
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isPending}
                rightIcon={!isPending ? <Send className="h-4 w-4" /> : undefined}
              >
                Send Reset Link
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
