-- ============================================================
-- GuruWeediya.lk — Migration 003: Job Class Category
-- ============================================================

-- Add class_category to jobs table
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS class_category TEXT NOT NULL DEFAULT 'Other'
  CHECK (class_category IN ('Primary', 'O/L', 'A/L', 'Other'));

COMMENT ON COLUMN public.jobs.class_category IS 'The educational level or category for the job (e.g., Primary, O/L, A/L, Other)';
