
import React from "react";
import Link from "next/link";
import { JobWithInstitute } from "@/types/database";
import { MapPin, BookOpen, GraduationCap, DollarSign, Briefcase } from "lucide-react";
import Card, { CardContent, CardFooter, CardHeader } from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

interface JobCardProps {
  job: JobWithInstitute;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card hover className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={job.status === "open" ? "success" : "default"}>
              {job.status === "open" ? "Actively Hiring" : "Closed"}
            </Badge>
            <Badge variant="info">{job.class_category}</Badge>
          </div>
          <h3 className="text-lg font-semibold text-white truncate">
            {job.title}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span className="truncate">{job.institute.institute_name}</span>
            {job.institute.is_verified && (
              <span className="text-emerald-500 text-[10px] font-bold uppercase ml-1">Verified</span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3">
        {/* Subject & Medium */}
        <div className="flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="info">{job.subject}</Badge>
            <Badge variant="outline">{job.medium}</Badge>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
          <div className="text-sm text-slate-300">
            {job.district}{job.location ? `, ${job.location}` : ""}
          </div>
        </div>

        {/* Budget */}
        <div className="flex items-start gap-2">
          <DollarSign className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
          <div className="text-sm text-slate-300">
            {job.budget_range || "Competitive Rate"}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/jobs/${job.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
