
"use client";

import React from "react";
import { Search } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import JobCard from "@/components/JobCard";
import JobFilters from "@/components/JobFilters";
import type { JobWithInstitute } from "@/types/database";
import { useRouter } from "next/navigation";

interface Props {
  jobs: JobWithInstitute[];
}

export default function JobsDirectoryClient({ jobs }: Props) {
  const router = useRouter();

  const clearFilters = () => {
    router.push("/jobs", { scroll: false });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <JobFilters />
        </div>

        {/* Main Content Grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between hidden lg:flex">
            <h1 className="text-2xl font-bold text-white">Browse Vacancies</h1>
            <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
              {jobs.length} Jobs Found
            </span>
          </div>
          
          <div className="mb-6 flex items-center justify-between lg:hidden">
             <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
              {jobs.length} Jobs Found
            </span>
          </div>

          {jobs.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-20 text-center animate-fade-in border-dashed">
              <div className="h-16 w-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No vacancies found</h3>
              <p className="text-sm text-slate-400 max-w-sm mb-6">
                Try adjusting your filters to find more available teaching opportunities.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5 animate-fade-in">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
