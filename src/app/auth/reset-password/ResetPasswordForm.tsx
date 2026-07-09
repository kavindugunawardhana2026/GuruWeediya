"use client";

import React, { useState, useActionState } from "react";
import { Lock, Eye, EyeOff, Save, KeyRound } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { updatePassword, type AuthResult } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [formState, formAction, isPending] = useActionState(
    async (_prevState: AuthResult, formData: FormData): Promise<AuthResult> => {
      const res = await updatePassword(formData);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
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
        <h1 className="text-3xl font-bold text-white mb-2">Create New Password</h1>
        <p className="text-slate-400 text-sm">
          Please enter your new password below
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-8">
        {success ? (
          <div className="text-center">
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <h3 className="text-emerald-400 font-semibold mb-2">Password Updated!</h3>
              <p className="text-slate-300 text-sm">
                Your password has been successfully reset. Redirecting to login...
              </p>
            </div>
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
              <div className="relative">
                <Input
                  label="New Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  leftIcon={<Lock className="h-4 w-4" />}
                  required
                  minLength={8}
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

              <div className="relative">
                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat new password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  required
                  minLength={8}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isPending}
                leftIcon={!isPending ? <Save className="h-4 w-4" /> : undefined}
              >
                Save New Password
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
