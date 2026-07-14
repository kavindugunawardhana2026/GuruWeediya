
"use client";

import React, { useCallback, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SUBJECTS, DISTRICTS, MEDIUMS } from "@/lib/constants";
import { Search, Filter, X } from "lucide-react";
import Input from "./ui/Input";
import Button from "./ui/Button";

export default function JobFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (key: string, value: string) => {
    router.push(pathname + "?" + createQueryString(key, value), { scroll: false });
  };

  const currentSubject = searchParams.get("subject") || "";
  const currentDistrict = searchParams.get("district") || "";
  const currentMedium = searchParams.get("medium") || "";
  const currentSearch = searchParams.get("q") || "";

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters = currentSubject || currentDistrict || currentMedium || currentSearch;

  return (
    <>
      <div className="lg:hidden mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Browse Jobs</h2>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <div
        className={`lg:block ${
          isOpen ? "block" : "hidden"
        } w-full lg:w-64 shrink-0 space-y-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800`}
      >
        <div className="flex items-center justify-between lg:hidden">
          <h3 className="font-semibold text-white">Filters</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 block">
            Search Title
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              type="text"
              placeholder="E.g. Physics Teacher"
              className="pl-9"
              defaultValue={currentSearch}
              onChange={(e) => {
                handleFilterChange("q", e.target.value);
              }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 block">
            Subject
          </label>
          <div className="relative">
            <select
              value={currentSubject}
              onChange={(e) => handleFilterChange("subject", e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none appearance-none"
            >
              <option value="">All Subjects</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 block">
            Medium
          </label>
          <div className="relative">
            <select
              value={currentMedium}
              onChange={(e) => handleFilterChange("medium", e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none appearance-none"
            >
              <option value="">All Mediums</option>
              {MEDIUMS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 block">
            District
          </label>
          <div className="relative">
            <select
              value={currentDistrict}
              onChange={(e) => handleFilterChange("district", e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none appearance-none"
            >
              <option value="">All Districts</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
            Clear All Filters
          </Button>
        )}
      </div>
    </>
  );
}
