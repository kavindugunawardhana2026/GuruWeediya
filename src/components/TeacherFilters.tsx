"use client";

import React, { useCallback, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SUBJECTS, DISTRICTS, MEDIUMS } from "@/lib/constants";
import { Search, Filter, X } from "lucide-react";
import Input from "./ui/Input";
import Button from "./ui/Button";

export default function TeacherFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for mobile filter toggle
  const [isOpen, setIsOpen] = useState(false);

  // Helper to create a new query string
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
  const currentVerified = searchParams.get("verified") || "";
  const currentSearch = searchParams.get("q") || "";

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters = currentSubject || currentDistrict || currentMedium || currentVerified || currentSearch;

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Find Tutors</h2>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filter Sidebar */}
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

        {/* Search */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 block">
            Search Names
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              type="text"
              placeholder="E.g. Kamal Perera"
              className="pl-9"
              defaultValue={currentSearch}
              onChange={(e) => {
                // Debouncing could be added here for a real app, but direct for now
                handleFilterChange("q", e.target.value);
              }}
            />
          </div>
        </div>

        {/* Verified Toggle */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={currentVerified === "true"}
              onChange={(e) => handleFilterChange("verified", e.target.checked ? "true" : "")}
            />
            <div className="w-10 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </div>
          <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
            Verified Tutors Only
          </span>
        </label>

        <hr className="border-slate-800" />

        {/* Subject Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 block">
            Subject
          </label>
          <select
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
            value={currentSubject}
            onChange={(e) => handleFilterChange("subject", e.target.value)}
          >
            <option value="">All Subjects</option>
            {SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* District Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 block">
            District
          </label>
          <select
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
            value={currentDistrict}
            onChange={(e) => handleFilterChange("district", e.target.value)}
          >
            <option value="">All Districts</option>
            {DISTRICTS.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        {/* Medium Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 block">
            Medium
          </label>
          <select
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
            value={currentMedium}
            onChange={(e) => handleFilterChange("medium", e.target.value)}
          >
            <option value="">All Mediums</option>
            {MEDIUMS.map((med) => (
              <option key={med} value={med}>
                {med}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            className="w-full text-slate-400 hover:text-white"
            onClick={clearFilters}
          >
            Clear All Filters
          </Button>
        )}
      </div>
    </>
  );
}
