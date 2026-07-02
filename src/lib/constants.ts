// ============================================================
// GuruWeediya.lk — Application Constants
// ============================================================

export const SITE_NAME = "GuruWeediya.lk";
export const SITE_DESCRIPTION =
  "Sri Lanka's premier B2B platform connecting tuition teachers with educational institutes.";
export const SITE_URL = "https://guruweediya.lk";

// ─── Sri Lankan Districts ────────────────────────────────────
export const DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Mullaitivu",
  "Vavuniya",
  "Trincomalee",
  "Batticaloa",
  "Ampara",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
] as const;

// ─── Teaching Mediums ────────────────────────────────────────
export const MEDIUMS = ["Sinhala", "English", "Tamil"] as const;

// ─── Common Subjects ─────────────────────────────────────────
export const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "Sinhala",
  "Tamil",
  "Physics",
  "Chemistry",
  "Biology",
  "Combined Mathematics",
  "ICT",
  "Commerce",
  "Accounting",
  "Business Studies",
  "Economics",
  "History",
  "Geography",
  "Political Science",
  "Buddhist Civilization",
  "Art",
  "Music",
  "Dancing",
  "Drama",
  "Logic",
  "General English",
  "General Knowledge",
] as const;

// ─── User Roles ──────────────────────────────────────────────
export const ROLES = {
  TEACHER: "teacher",
  INSTITUTE: "institute",
  ADMIN: "admin",
} as const;

// ─── Job Statuses ────────────────────────────────────────────
export const JOB_STATUS = {
  OPEN: "open",
  CLOSED: "closed",
} as const;

// ─── Interview Statuses ──────────────────────────────────────
export const INTERVIEW_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  DECLINED: "declined",
} as const;

// ─── Verification Statuses ───────────────────────────────────
export const VERIFICATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

// ─── Days of the Week ────────────────────────────────────────
export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

// ─── Interview Time Slots ────────────────────────────────────
export const TIME_SLOTS = [
  "6:00 AM – 8:00 AM",
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
  "6:00 PM – 8:00 PM",
  "8:00 PM – 10:00 PM",
] as const;
export type TimeSlot = (typeof TIME_SLOTS)[number];

