import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Teachers",
  description:
    "Browse verified tuition teachers across all subjects, mediums, and districts in Sri Lanka.",
};

export default function TeachersPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-4">Find Teachers</h1>
      <p className="text-slate-400">
        Browse and search verified teachers. Coming soon…
      </p>
    </div>
  );
}
