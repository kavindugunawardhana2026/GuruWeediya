-- ============================================================
-- GuruWeediya.lk — Initial Database Schema
-- B2B Platform: Tuition Teachers ↔ Educational Institutes
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USERS — Core authentication & role table
-- ============================================================
CREATE TABLE public.users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('teacher', 'institute', 'admin')),
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.users IS 'Core user accounts — linked to Supabase Auth';
COMMENT ON COLUMN public.users.role IS 'One of: teacher, institute, admin';

-- ============================================================
-- 2. TEACHERS — Extended teacher profile
-- ============================================================
CREATE TABLE public.teachers (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  full_name             TEXT NOT NULL,
  bio                   TEXT,
  subjects              TEXT[] NOT NULL DEFAULT '{}',
  mediums               TEXT[] NOT NULL DEFAULT '{}',       -- e.g. {'Sinhala','English','Tamil'}
  districts             TEXT[] NOT NULL DEFAULT '{}',       -- e.g. {'Colombo','Kandy'}
  hourly_rate           NUMERIC(10, 2),
  youtube_demo_url      TEXT,
  profile_image_url     TEXT,
  phone                 TEXT,
  is_verified           BOOLEAN NOT NULL DEFAULT FALSE,
  verification_status   TEXT NOT NULL DEFAULT 'pending'
                        CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.teachers IS 'Teacher profiles with subjects, mediums, districts';
COMMENT ON COLUMN public.teachers.mediums IS 'Teaching mediums: Sinhala, English, Tamil';
COMMENT ON COLUMN public.teachers.districts IS 'Districts where the teacher is available';

-- Index for common search patterns
CREATE INDEX idx_teachers_subjects    ON public.teachers USING GIN (subjects);
CREATE INDEX idx_teachers_mediums     ON public.teachers USING GIN (mediums);
CREATE INDEX idx_teachers_districts   ON public.teachers USING GIN (districts);
CREATE INDEX idx_teachers_verified    ON public.teachers (is_verified) WHERE is_verified = TRUE;

-- ============================================================
-- 3. INSTITUTES — Educational institute profiles
-- ============================================================
CREATE TABLE public.institutes (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  institute_name    TEXT NOT NULL,
  branch_location   TEXT,
  district          TEXT,
  contact_number    TEXT,
  website           TEXT,
  logo_url          TEXT,
  description       TEXT,
  is_verified       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.institutes IS 'Institute profiles with location and contact details';

CREATE INDEX idx_institutes_district ON public.institutes (district);

-- ============================================================
-- 4. JOBS — Posted by institutes, discovered by teachers
-- ============================================================
CREATE TABLE public.jobs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institute_id    UUID NOT NULL REFERENCES public.institutes(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  subject         TEXT NOT NULL,
  medium          TEXT NOT NULL,
  description     TEXT,
  location        TEXT,
  district        TEXT,
  budget_range    TEXT,                          -- e.g. 'LKR 3000 – 5000 / hr'
  status          TEXT NOT NULL DEFAULT 'open'
                  CHECK (status IN ('open', 'closed')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.jobs IS 'Job listings posted by institutes';

CREATE INDEX idx_jobs_status     ON public.jobs (status);
CREATE INDEX idx_jobs_subject    ON public.jobs (subject);
CREATE INDEX idx_jobs_district   ON public.jobs (district);
CREATE INDEX idx_jobs_institute  ON public.jobs (institute_id);

-- ============================================================
-- 5. INTERVIEWS — Scheduled between institute & teacher
-- ============================================================
CREATE TABLE public.interviews (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id          UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  teacher_id      UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  institute_id    UUID NOT NULL REFERENCES public.institutes(id) ON DELETE CASCADE,
  scheduled_date  DATE,
  time_slot       TEXT,                          -- e.g. '10:00 AM – 11:00 AM'
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'accepted', 'declined')),
  meeting_link    TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.interviews IS 'Interview scheduling between teachers and institutes';

CREATE INDEX idx_interviews_job        ON public.interviews (job_id);
CREATE INDEX idx_interviews_teacher    ON public.interviews (teacher_id);
CREATE INDEX idx_interviews_institute  ON public.interviews (institute_id);
CREATE INDEX idx_interviews_status     ON public.interviews (status);

-- Prevent duplicate interview scheduling
CREATE UNIQUE INDEX idx_interviews_unique_booking
  ON public.interviews (job_id, teacher_id)
  WHERE status != 'declined';

-- ============================================================
-- 6. AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.institutes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.interviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 7. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- USERS: Users can read all profiles, update only their own
CREATE POLICY "Users can view all users"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (id = auth.uid());

-- TEACHERS: Public read, owner write
CREATE POLICY "Anyone can view teachers"
  ON public.teachers FOR SELECT
  USING (true);

CREATE POLICY "Teachers can insert own profile"
  ON public.teachers FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Teachers can update own profile"
  ON public.teachers FOR UPDATE
  USING (user_id = auth.uid());

-- INSTITUTES: Public read, owner write
CREATE POLICY "Anyone can view institutes"
  ON public.institutes FOR SELECT
  USING (true);

CREATE POLICY "Institutes can insert own profile"
  ON public.institutes FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Institutes can update own profile"
  ON public.institutes FOR UPDATE
  USING (user_id = auth.uid());

-- JOBS: Public read, owning institute write
CREATE POLICY "Anyone can view open jobs"
  ON public.jobs FOR SELECT
  USING (true);

CREATE POLICY "Institutes can insert jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (
    institute_id IN (
      SELECT id FROM public.institutes WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Institutes can update own jobs"
  ON public.jobs FOR UPDATE
  USING (
    institute_id IN (
      SELECT id FROM public.institutes WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Institutes can delete own jobs"
  ON public.jobs FOR DELETE
  USING (
    institute_id IN (
      SELECT id FROM public.institutes WHERE user_id = auth.uid()
    )
  );

-- INTERVIEWS: Involved parties can read, institute can create
CREATE POLICY "Participants can view interviews"
  ON public.interviews FOR SELECT
  USING (
    teacher_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid())
    OR
    institute_id IN (SELECT id FROM public.institutes WHERE user_id = auth.uid())
  );

CREATE POLICY "Institutes can create interviews"
  ON public.interviews FOR INSERT
  WITH CHECK (
    institute_id IN (
      SELECT id FROM public.institutes WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can update interviews"
  ON public.interviews FOR UPDATE
  USING (
    teacher_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid())
    OR
    institute_id IN (SELECT id FROM public.institutes WHERE user_id = auth.uid())
  );
