-- 1. Share token on submissions
ALTER TABLE public.magnet_submissions
  ADD COLUMN IF NOT EXISTS share_token text UNIQUE DEFAULT gen_random_uuid()::text;

UPDATE public.magnet_submissions
  SET share_token = gen_random_uuid()::text
  WHERE share_token IS NULL;

-- 2. Share events table
CREATE TABLE IF NOT EXISTS public.magnet_share_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  share_token text,
  channel text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.magnet_share_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can log a share" ON public.magnet_share_events;
CREATE POLICY "Anyone can log a share"
  ON public.magnet_share_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_magnet_share_events_slug
  ON public.magnet_share_events (slug);

-- 3. Analytics events table
CREATE TABLE IF NOT EXISTS public.magnet_analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  event_name text NOT NULL,
  props jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.magnet_analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can log analytics" ON public.magnet_analytics_events;
CREATE POLICY "Anyone can log analytics"
  ON public.magnet_analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_magnet_analytics_events_slug
  ON public.magnet_analytics_events (slug);

CREATE INDEX IF NOT EXISTS idx_magnet_analytics_events_event_name
  ON public.magnet_analytics_events (event_name);

-- 4. Drop and recreate RPC with new return type
DROP FUNCTION IF EXISTS public.get_magnet_submission_by_slug(text);

CREATE FUNCTION public.get_magnet_submission_by_slug(_slug text)
RETURNS TABLE(status text, first_name text, vertical text, share_token text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT s.status, s.first_name, s.vertical, s.share_token
  FROM public.magnet_submissions s
  WHERE s.slug = _slug
  LIMIT 1
$function$;