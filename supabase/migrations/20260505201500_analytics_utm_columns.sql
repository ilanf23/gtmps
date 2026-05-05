-- Re-apply UTM/session/fingerprint columns on magnet_analytics_events.
-- The earlier 20260504142910 migration apparently did not run on this DB,
-- which causes ops-channels to crash with "column ... does not exist".

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
