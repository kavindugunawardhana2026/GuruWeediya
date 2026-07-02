"use client";

import React from "react";
import { Search } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import TeacherCard from "@/components/TeacherCard";
import TeacherFilters from "@/components/TeacherFilters";
import type { Teacher } from "@/types/database";
import { useRouter } from "next/navigation";

interface Props {
  teachers: Teacher[];
}

export default function TeacherDirectoryClient({ teachers }: Props) {
  const router = useRouter();

  const clearFilters = () => {
    router.push("/teachers", { scroll: false });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar (Desktop & Mobile handled inside TeacherFilters) */}
        <div className="w-full lg:w-64 shrink-0">
          <TeacherFilters />
        </div>

        {/* Main Content Grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between hidden lg:flex">
            <h1 className="text-2xl font-bold text-white">Find Teachers</h1>
            <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
              {teachers.length} Results
            </span>
          </div>
          
          <div className="mb-6 flex items-center justify-between lg:hidden">
             <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
              {teachers.length} Results
            </span>
          </div>

          {teachers.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-20 text-center animate-fade-in border-dashed">
              <div className="h-16 w-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No teachers found</h3>
              <p className="text-sm text-slate-400 max-w-sm mb-6">
                Try adjusting your filters to find more available teachers.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5 animate-fade-in">
              {teachers.map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

