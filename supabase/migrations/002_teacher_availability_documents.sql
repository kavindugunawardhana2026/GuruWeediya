-- ============================================================
-- GuruWeediya.lk — Migration 002: Teacher Availability & Documents
-- ============================================================

-- Add availability (JSONB) to teachers table
ALTER TABLE public.teachers
  ADD COLUMN IF NOT EXISTS availability JSONB NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.teachers.availability IS
  'Weekly availability: {"Monday": ["8:00 AM – 10:00 AM"], ...}';

-- ============================================================
-- Teacher Documents — for NIC and certificate uploads
-- ============================================================
CREATE TABLE IF NOT EXISTS public.teacher_documents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  doc_type    TEXT NOT NULL CHECK (doc_type IN ('nic', 'certificate')),
  file_path   TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending_review'
              CHECK (status IN ('pending_review', 'approved', 'rejected')),
  notes       TEXT,                       -- admin rejection note
  reviewed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, doc_type)              -- one per doc_type per teacher
);

COMMENT ON TABLE public.teacher_documents IS
  'Teacher identity and qualification documents for admin verification';

-- Auto-update trigger
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.teacher_documents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS
ALTER TABLE public.teacher_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view own documents"
  ON public.teacher_documents FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Teachers can insert own documents"
  ON public.teacher_documents FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Teachers can update own documents"
  ON public.teacher_documents FOR UPDATE
  USING (user_id = auth.uid());

-- Admins can view all (via service-role key in admin panel)
-- (no policy needed for service_role — it bypasses RLS)

-- ============================================================
-- Supabase Storage — teacher-documents bucket policy
-- Run this in the Supabase Dashboard > Storage > teacher-documents
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public)
--   VALUES ('teacher-documents', 'teacher-documents', false)
--   ON CONFLICT DO NOTHING;
--
-- CREATE POLICY "Teachers can upload own documents"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'teacher-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
--
-- CREATE POLICY "Teachers can read own documents"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'teacher-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
