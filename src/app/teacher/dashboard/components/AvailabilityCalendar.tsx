"use client";

import React, { useState, useTransition } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Save,
  Info,
  Clock,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card, { CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { DAYS_OF_WEEK, TIME_SLOTS } from "@/lib/constants";
import { saveAvailability, type ActionResult } from "../actions";

// Availability shape: { "Monday": ["8:00 AM – 10:00 AM", "4:00 PM – 6:00 PM"], ... }
type Availability = Record<string, string[]>;

interface Props {
  initialAvailability: Availability;
  onSaved: (av: Availability) => void;
}

// Short day labels for mobile
const SHORT_DAYS: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

// Short slot labels
const SHORT_SLOTS: Record<string, string> = {
  "6:00 AM – 8:00 AM": "6–8 AM",
  "8:00 AM – 10:00 AM": "8–10 AM",
  "10:00 AM – 12:00 PM": "10 AM–12",
  "12:00 PM – 2:00 PM": "12–2 PM",
  "2:00 PM – 4:00 PM": "2–4 PM",
  "4:00 PM – 6:00 PM": "4–6 PM",
  "6:00 PM – 8:00 PM": "6–8 PM",
  "8:00 PM – 10:00 PM": "8–10 PM",
};

export default function AvailabilityCalendar({ initialAvailability, onSaved }: Props) {
  const [availability, setAvailability] = useState<Availability>(initialAvailability || {});
  const [saveResult, setSaveResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const isSelected = (day: string, slot: string) =>
    availability[day]?.includes(slot) ?? false;

  const toggle = (day: string, slot: string) => {
    setAvailability((prev) => {
      const existing = prev[day] || [];
      const hasSlot = existing.includes(slot);
      return {
        ...prev,
        [day]: hasSlot ? existing.filter((s) => s !== slot) : [...existing, slot],
      };
    });
  };

  const toggleDay = (day: string) => {
    setAvailability((prev) => {
      const existing = prev[day] || [];
      const allSelected = existing.length === TIME_SLOTS.length;
      return {
        ...prev,
        [day]: allSelected ? [] : [...TIME_SLOTS],
      };
    });
  };

  const toggleSlot = (slot: string) => {
    setAvailability((prev) => {
      const updated = { ...prev };
      DAYS_OF_WEEK.forEach((day) => {
        const existing = updated[day] || [];
        const hasSlot = existing.includes(slot);
        updated[day] = hasSlot ? existing.filter((s) => s !== slot) : [...existing, slot];
      });
      return updated;
    });
  };

  const totalSlots = Object.values(availability).reduce(
    (acc, slots) => acc + slots.length,
    0
  );

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveAvailability(availability);
      setSaveResult(result);
      if (result.success) onSaved(availability);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
              <CalendarCheck className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Interview Availability</h3>
              <p className="text-xs text-slate-500">
                Select the days and time slots you&apos;re available for interviews
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {totalSlots > 0 && (
              <Badge variant="success" dot>
                {totalSlots} slot{totalSlots !== 1 ? "s" : ""} set
              </Badge>
            )}
            <Button
              size="sm"
              onClick={handleSave}
              isLoading={isPending}
              leftIcon={!isPending ? <Save className="h-4 w-4" /> : undefined}
            >
              Save Availability
            </Button>
          </div>
        </div>

        {/* Save feedback */}
        {saveResult && (
          <div className={cn(
            "mt-4 flex items-center gap-2 p-3 rounded-lg text-xs border",
            saveResult.success
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          )}>
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {saveResult.message || saveResult.error}
          </div>
        )}
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded bg-emerald-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded bg-slate-800 border border-slate-700" />
          <span>Not available</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <Info className="h-3.5 w-3.5" />
          <span>Click headers to select entire row/column</span>
        </div>
      </div>

      {/* Grid Calendar */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[580px]">
            <thead>
              <tr className="border-b border-slate-800">
                {/* Top-left: time icon */}
                <th className="p-3 text-left min-w-[110px]">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Time / Day</span>
                  </div>
                </th>
                {/* Day column headers */}
                {DAYS_OF_WEEK.map((day) => {
                  const daySlots = availability[day] || [];
                  const allSelected = daySlots.length === TIME_SLOTS.length;
                  const someSelected = daySlots.length > 0 && !allSelected;

                  return (
                    <th key={day} className="p-2 text-center">
                      <button
                        onClick={() => toggleDay(day)}
                        className={cn(
                          "flex flex-col items-center gap-1 mx-auto rounded-xl px-2 py-2 min-w-[44px] transition-all duration-200 cursor-pointer",
                          allSelected
                            ? "bg-emerald-500/20 text-emerald-400"
                            : someSelected
                              ? "bg-amber-500/10 text-amber-400"
                              : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                        title={`Toggle all ${day} slots`}
                      >
                        <span className="text-[11px] font-semibold hidden md:block">{day.slice(0, 3)}</span>
                        <span className="text-[10px] font-semibold md:hidden">{SHORT_DAYS[day]}</span>
                        {someSelected && (
                          <span className="text-[9px]">{daySlots.length}/{TIME_SLOTS.length}</span>
                        )}
                        {allSelected && (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, si) => {
                const allDaysHaveSlot = DAYS_OF_WEEK.every((d) =>
                  availability[d]?.includes(slot)
                );
                return (
                  <tr
                    key={slot}
                    className={cn(
                      "border-b border-slate-800/50 transition-colors",
                      si % 2 === 0 ? "bg-slate-950/30" : ""
                    )}
                  >
                    {/* Time row label — click to select entire row */}
                    <td className="p-2">
                      <button
                        onClick={() => toggleSlot(slot)}
                        className={cn(
                          "text-left text-xs rounded-lg px-2 py-2 transition-all duration-200 cursor-pointer w-full",
                          allDaysHaveSlot
                            ? "bg-emerald-500/10 text-emerald-400 font-medium"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                        title="Toggle this time slot for all days"
                      >
                        <span className="hidden sm:block whitespace-nowrap">{slot}</span>
                        <span className="sm:hidden whitespace-nowrap">{SHORT_SLOTS[slot]}</span>
                      </button>
                    </td>

                    {/* Day cells */}
                    {DAYS_OF_WEEK.map((day) => {
                      const selected = isSelected(day, slot);
                      return (
                        <td key={day} className="p-1.5 text-center">
                          <button
                            onClick={() => toggle(day, slot)}
                            className={cn(
                              "h-9 w-9 rounded-xl transition-all duration-150 cursor-pointer mx-auto flex items-center justify-center",
                              selected
                                ? "bg-emerald-500 shadow-md shadow-emerald-500/30 hover:bg-emerald-600"
                                : "bg-slate-800/60 hover:bg-slate-700 border border-slate-700/50 hover:border-emerald-500/30"
                            )}
                            title={`${selected ? "Remove" : "Add"} ${day} ${slot}`}
                          >
                            {selected && <CheckCircle2 className="h-4 w-4 text-white" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Availability Summary */}
      {totalSlots > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">Your Availability Summary</h3>
          <div className="space-y-3">
            {DAYS_OF_WEEK.filter((d) => (availability[d] || []).length > 0).map((day) => (
              <div key={day} className="flex items-start gap-3">
                <span className="text-xs font-medium text-slate-400 w-24 pt-1 shrink-0">{day}</span>
                <div className="flex flex-wrap gap-1.5">
                  {(availability[day] || []).map((slot) => (
                    <span
                      key={slot}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20"
                    >
                      {SHORT_SLOTS[slot] || slot}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
