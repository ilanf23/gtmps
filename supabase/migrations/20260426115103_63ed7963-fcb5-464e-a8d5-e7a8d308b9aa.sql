-- ============================================================
-- MARKETING MAGNET SCHEMA
-- ============================================================

-- Table 1: magnet_submissions
CREATE TABLE IF NOT EXISTS public.magnet_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  slug text NOT NULL UNIQUE,
  first_name text NOT NULL,
  role text NOT NULL,
  website_url text NOT NULL,
  linkedin_url text NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','processing','complete','error'))
);

CREATE UNIQUE INDEX IF NOT EXISTS magnet_submissions_slug_idx
  ON public.magnet_submissions(slug);
CREATE INDEX IF NOT EXISTS magnet_submissions_email_idx
  ON public.magnet_submissions(email);

-- Table 2: magnet_breakdowns
CREATE TABLE IF NOT EXISTS public.magnet_breakdowns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  slug text NOT NULL UNIQUE
    REFERENCES public.magnet_submissions(slug) ON DELETE CASCADE,
  welcome_message text,
  dead_zone_value bigint,
  dead_zone_reasoning text,
  gtm_profile_observed text,
  gtm_profile_assessment text,
  orbit_01 text,
  orbit_02 text,
  orbit_03 text,
  orbit_04 text,
  orbit_05 text,
  recommended_layer text
    CHECK (recommended_layer IN ('DISCOVER','PROVE','DESIGN','ACTIVATE','COMPOUND')),
  action_1 text,
  action_2 text,
  action_3 text,
  chapter_callouts jsonb NOT NULL DEFAULT '[]'::jsonb,
  raw_website_content text,
  raw_linkedin_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  enrichment_error text
);

CREATE INDEX IF NOT EXISTS magnet_breakdowns_slug_idx
  ON public.magnet_breakdowns(slug);

-- Table 3: magnet_chat_sessions
CREATE TABLE IF NOT EXISTS public.magnet_chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  slug text NOT NULL
    REFERENCES public.magnet_submissions(slug) ON DELETE CASCADE,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS magnet_chat_sessions_slug_idx
  ON public.magnet_chat_sessions(slug);

-- Table 4: magnet_call_bookings
CREATE TABLE IF NOT EXISTS public.magnet_call_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  slug text NOT NULL
    REFERENCES public.magnet_submissions(slug) ON DELETE CASCADE,
  calendly_event_id text,
  scheduled_at timestamptz
);

CREATE INDEX IF NOT EXISTS magnet_call_bookings_slug_idx
  ON public.magnet_call_bookings(slug);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.magnet_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magnet_breakdowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magnet_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magnet_call_bookings ENABLE ROW LEVEL SECURITY;

-- magnet_submissions policies
DROP POLICY IF EXISTS "Anyone can submit assessment" ON public.magnet_submissions;
CREATE POLICY "Anyone can submit assessment"
  ON public.magnet_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "View own submission by slug" ON public.magnet_submissions;
CREATE POLICY "View own submission by slug"
  ON public.magnet_submissions
  FOR SELECT
  TO anon, authenticated
  USING (slug = current_setting('app.current_slug', true));

-- magnet_breakdowns policies
DROP POLICY IF EXISTS "Service role can insert breakdowns" ON public.magnet_breakdowns;
CREATE POLICY "Service role can insert breakdowns"
  ON public.magnet_breakdowns
  FOR INSERT
  TO service_role
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can update breakdowns" ON public.magnet_breakdowns;
CREATE POLICY "Service role can update breakdowns"
  ON public.magnet_breakdowns
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "View own breakdown by slug" ON public.magnet_breakdowns;
CREATE POLICY "View own breakdown by slug"
  ON public.magnet_breakdowns
  FOR SELECT
  TO anon, authenticated
  USING (slug = current_setting('app.current_slug', true));

-- magnet_chat_sessions policies
DROP POLICY IF EXISTS "Insert chat session by slug" ON public.magnet_chat_sessions;
CREATE POLICY "Insert chat session by slug"
  ON public.magnet_chat_sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (slug = current_setting('app.current_slug', true));

DROP POLICY IF EXISTS "Update chat session by slug" ON public.magnet_chat_sessions;
CREATE POLICY "Update chat session by slug"
  ON public.magnet_chat_sessions
  FOR UPDATE
  TO anon, authenticated
  USING (slug = current_setting('app.current_slug', true))
  WITH CHECK (slug = current_setting('app.current_slug', true));

DROP POLICY IF EXISTS "View chat session by slug" ON public.magnet_chat_sessions;
CREATE POLICY "View chat session by slug"
  ON public.magnet_chat_sessions
  FOR SELECT
  TO anon, authenticated
  USING (slug = current_setting('app.current_slug', true));

-- magnet_call_bookings policies
DROP POLICY IF EXISTS "Insert call booking by slug" ON public.magnet_call_bookings;
CREATE POLICY "Insert call booking by slug"
  ON public.magnet_call_bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (slug = current_setting('app.current_slug', true));

DROP POLICY IF EXISTS "View call booking by slug" ON public.magnet_call_bookings;
CREATE POLICY "View call booking by slug"
  ON public.magnet_call_bookings
  FOR SELECT
  TO anon, authenticated
  USING (slug = current_setting('app.current_slug', true));