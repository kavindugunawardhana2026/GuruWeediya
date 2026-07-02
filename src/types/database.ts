// ============================================================
// GuruWeediya.lk — Database Type Definitions
// Auto-generated from Supabase schema
// ============================================================

export type UserRole = "teacher" | "institute" | "admin";
export type VerificationStatus = "pending" | "approved" | "rejected";
export type JobStatus = "open" | "closed";
export type InterviewStatus = "pending" | "accepted" | "declined";

// ─── Row Types ───────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  user_id: string;
  full_name: string;
  bio: string | null;
  subjects: string[];
  mediums: string[];
  districts: string[];
  hourly_rate: number | null;
  youtube_demo_url: string | null;
  profile_image_url: string | null;
  phone: string | null;
  availability: Record<string, string[]>;
  is_verified: boolean;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface Institute {
  id: string;
  user_id: string;
  institute_name: string;
  branch_location: string | null;
  district: string | null;
  contact_number: string | null;
  website: string | null;
  logo_url: string | null;
  description: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  institute_id: string;
  title: string;
  subject: string;
  medium: string;
  class_category: string;
  description: string | null;
  location: string | null;
  district: string | null;
  budget_range: string | null;
  status: JobStatus;
  created_at: string;
  updated_at: string;
}

export interface Interview {
  id: string;
  job_id: string;
  teacher_id: string;
  institute_id: string;
  scheduled_date: string | null;
  time_slot: string | null;
  status: InterviewStatus;
  meeting_link: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type DocumentStatus = "pending_review" | "approved" | "rejected";

export interface TeacherDocument {
  id: string;
  user_id: string;
  doc_type: "nic" | "certificate";
  file_path: string;
  status: DocumentStatus;
  notes: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  teacher_id: string;
  institute_id: string;
  rating: number;
  review_text: string;
  created_at: string;
  updated_at: string;
}

// ─── Insert Types (omit auto-generated fields) ──────────────

export type UserInsert = Omit<User, "id" | "created_at" | "updated_at">;
export type TeacherInsert = Omit<Teacher, "id" | "created_at" | "updated_at" | "is_verified" | "verification_status">;
export type InstituteInsert = Omit<Institute, "id" | "created_at" | "updated_at" | "is_verified">;
export type JobInsert = Omit<Job, "id" | "created_at" | "updated_at" | "status">;
export type InterviewInsert = Omit<Interview, "id" | "created_at" | "updated_at" | "status">;
export type ReviewInsert = Omit<Review, "id" | "created_at" | "updated_at">;

// ─── Update Types (all fields optional) ──────────────────────

export type UserUpdate = Partial<Omit<User, "id" | "created_at">>;
export type TeacherUpdate = Partial<Omit<Teacher, "id" | "user_id" | "created_at">>;
export type InstituteUpdate = Partial<Omit<Institute, "id" | "user_id" | "created_at">>;
export type JobUpdate = Partial<Omit<Job, "id" | "institute_id" | "created_at">>;
export type InterviewUpdate = Partial<Omit<Interview, "id" | "created_at">>;
export type TeacherDocumentInsert = Omit<TeacherDocument, "id" | "created_at" | "updated_at" | "reviewed_at">;
export type ReviewUpdate = Partial<Omit<Review, "id" | "created_at">>;

// ─── Join Types (for queries with relations) ─────────────────

export interface TeacherWithUser extends Teacher {
  user: User;
}

export interface InstituteWithUser extends Institute {
  user: User;
}

export interface JobWithInstitute extends Job {
  institute: Institute;
}

export interface InterviewWithDetails extends Interview {
  job: Job;
  teacher: Teacher;
  institute: Institute;
}

export interface ReviewWithInstitute extends Review {
  institute: Institute;
}

// ─── Supabase Database Type Map ──────────────────────────────

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      teachers: {
        Row: Teacher;
        Insert: TeacherInsert;
        Update: TeacherUpdate;
      };
      institutes: {
        Row: Institute;
        Insert: InstituteInsert;
        Update: InstituteUpdate;
      };
      jobs: {
        Row: Job;
        Insert: JobInsert;
        Update: JobUpdate;
      };
      interviews: {
        Row: Interview;
        Insert: InterviewInsert;
        Update: InterviewUpdate;
      };
      teacher_documents: {
        Row: TeacherDocument;
        Insert: TeacherDocumentInsert;
        Update: Partial<TeacherDocumentInsert>;
      };
      reviews: {
        Row: Review;
        Insert: ReviewInsert;
        Update: ReviewUpdate;
      };
    };
  };
}
