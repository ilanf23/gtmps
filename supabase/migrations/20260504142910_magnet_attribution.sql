-- Channel attribution for the Magnet flow.
--
-- Adds two pieces:
--   1. Anon-insert RLS policy on magnet_views so the client can record visits.
--   2. UTM/session/fingerprint columns on magnet_analytics_events so every
--      conversion event carries its first-touch channel context.
--
-- The columns on magnet_views already exist (see the 20260501144727 migration);
-- only the policy is missing.

-- 1. magnet_views: allow anon (and authenticated) to INSERT visit rows.
DROP POLICY IF EXISTS "Anyone can log a view" ON public.magnet_views;
CREATE POLICY "Anyone can log a view"
  ON public.magnet_views
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_magnet_views_utm
  ON public.magnet_views (utm_source, utm_medium, utm_campaign);

-- 2. magnet_analytics_events: stamp every event with first-touch attribution.
ALTER TABLE public.magnet_analytics_events
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS session_id text,
  ADD COLUMN IF NOT EXISTS visitor_fingerprint text;

CREATE INDEX IF NOT EXISTS idx_magnet_analytics_events_utm
  ON public.magnet_analytics_events (utm_source, utm_medium, utm_campaign);

CREATE INDEX IF NOT EXISTS idx_magnet_analytics_events_session
  ON public.magnet_analytics_events (session_id);
