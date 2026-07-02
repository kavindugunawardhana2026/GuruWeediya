import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Log In",
  description: "Sign in to your GuruWeediya.lk account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <Suspense fallback={<div className="animate-pulse h-96 bg-slate-900/50 rounded-2xl border border-slate-800" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
