DROP POLICY IF EXISTS "Anyone can log a view" ON public.magnet_views;
CREATE POLICY "Anyone can log a view"
  ON public.magnet_views
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

ALTER TABLE public.magnet_submissions
  ADD COLUMN IF NOT EXISTS ref_code text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS referrer_url text;

CREATE INDEX IF NOT EXISTS idx_magnet_submissions_ref_code
  ON public.magnet_submissions (ref_code);

CREATE INDEX IF NOT EXISTS idx_magnet_submissions_utm
  ON public.magnet_submissions (utm_source, utm_medium, utm_campaign);

ALTER TABLE public.magnet_analytics_events
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS session_id text,
  ADD COLUMN IF NOT EXISTS visitor_fingerprint text;

CREATE INDEX IF NOT EXISTS idx_magnet_views_utm
  ON public.magnet_views (utm_source, utm_medium, utm_campaign);

CREATE INDEX IF NOT EXISTS idx_magnet_analytics_events_utm
  ON public.magnet_analytics_events (utm_source, utm_medium, utm_campaign);

CREATE INDEX IF NOT EXISTS idx_magnet_analytics_events_session
  ON public.magnet_analytics_events (session_id);