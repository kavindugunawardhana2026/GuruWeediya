import React from "react";
import Link from "next/link";
import { Teacher } from "@/types/database";
import { MapPin, BookOpen, GraduationCap, CheckCircle2 } from "lucide-react";
import Card, { CardContent, CardFooter, CardHeader } from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

interface TeacherCardProps {
  teacher: Teacher;
}

export default function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <Card hover className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          {teacher.profile_image_url ? (
            <img
              src={teacher.profile_image_url}
              alt={teacher.full_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-700"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xl font-bold text-slate-400">
              {teacher.full_name.charAt(0)}
            </div>
          )}
          {teacher.is_verified && (
            <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-0.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate flex items-center gap-2">
            {teacher.full_name}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2 mt-1">
            {teacher.bio || "Experienced educator dedicated to student success."}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3">
        {/* Subjects */}
        <div className="flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
          <div className="flex flex-wrap gap-1.5">
            {teacher.subjects.slice(0, 3).map((subject) => (
              <Badge key={subject} variant="info">
                {subject}
              </Badge>
            ))}
            {teacher.subjects.length > 3 && (
              <Badge variant="default">+{teacher.subjects.length - 3}</Badge>
            )}
          </div>
        </div>

        {/* Districts */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
          <div className="flex flex-wrap gap-1.5">
            {teacher.districts.slice(0, 3).map((district) => (
              <span key={district} className="text-sm text-slate-300">
                {district}
                {teacher.districts.indexOf(district) !== Math.min(2, teacher.districts.length - 1) && ","}
              </span>
            ))}
            {teacher.districts.length > 3 && (
              <span className="text-sm text-slate-400">
                +{teacher.districts.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Mediums */}
        <div className="flex items-start gap-2">
          <GraduationCap className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
          <div className="text-sm text-slate-300">
            {teacher.mediums.join(", ")}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/teachers/${teacher.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
