ALTER TABLE public.magnet_analytics_events
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS session_id TEXT,
  ADD COLUMN IF NOT EXISTS visitor_fingerprint TEXT;

CREATE INDEX IF NOT EXISTS idx_magnet_analytics_events_utm_source ON public.magnet_analytics_events(utm_source);
CREATE INDEX IF NOT EXISTS idx_magnet_analytics_events_session_id ON public.magnet_analytics_events(session_id);