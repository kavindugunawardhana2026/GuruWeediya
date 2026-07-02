-- ============================================================
-- GuruWeediya.lk — Migration 004: Reviews & Ratings
-- ============================================================

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  institute_id UUID NOT NULL REFERENCES public.institutes(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(teacher_id, institute_id) -- One review per institute per teacher
);

COMMENT ON TABLE public.reviews IS 'Reviews left by institutes for teachers after an interview or hiring process.';

-- Auto-update trigger
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

-- Only institutes can insert a review. In a more complex app, we might check if they had an interview.
CREATE POLICY "Institutes can insert reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (
    institute_id IN (
      SELECT id FROM public.institutes WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Institutes can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (
    institute_id IN (
      SELECT id FROM public.institutes WHERE user_id = auth.uid()
    )
  );
