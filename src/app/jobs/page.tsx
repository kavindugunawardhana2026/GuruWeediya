import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Jobs",
  description:
    "Discover teaching opportunities posted by educational institutes across Sri Lanka.",
};

export default function JobsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-4">Browse Jobs</h1>
      <p className="text-slate-400">
        Explore open teaching positions from institutes. Coming soon…
      </p>
    </div>
  );
}
