-- ============================================================
-- GuruWeediya.lk — Migration 005: Applications & Messages
-- ============================================================

-- ============================================================
-- 1. JOB APPLICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.job_applications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id          UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  teacher_id      UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  cover_message   TEXT,
  status          TEXT NOT NULL DEFAULT 'applied'
                  CHECK (status IN ('applied', 'shortlisted', 'interviewed', 'hired', 'rejected')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (job_id, teacher_id)
);

COMMENT ON TABLE public.job_applications IS 'Teachers proactively applying to open jobs';

-- Auto-update trigger
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view own applications"
  ON public.job_applications FOR SELECT
  USING (teacher_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid()));

CREATE POLICY "Institutes can view applications for their jobs"
  ON public.job_applications FOR SELECT
  USING (job_id IN (
    SELECT id FROM public.jobs WHERE institute_id IN (
      SELECT id FROM public.institutes WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Teachers can apply to jobs"
  ON public.job_applications FOR INSERT
  WITH CHECK (teacher_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid()));

CREATE POLICY "Institutes can update application status"
  ON public.job_applications FOR UPDATE
  USING (job_id IN (
    SELECT id FROM public.jobs WHERE institute_id IN (
      SELECT id FROM public.institutes WHERE user_id = auth.uid()
    )
  ));


-- ============================================================
-- 2. MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  job_id          UUID REFERENCES public.jobs(id) ON DELETE SET NULL, -- optional context
  content         TEXT NOT NULL,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.messages IS 'In-app messaging between users';

-- Auto-update trigger
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages they sent or received"
  ON public.messages FOR SELECT
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update read status of received messages"
  ON public.messages FOR UPDATE
  USING (receiver_id = auth.uid());
