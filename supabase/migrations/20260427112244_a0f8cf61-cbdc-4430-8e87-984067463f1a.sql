ALTER TABLE public.magnet_submissions
  ADD COLUMN IF NOT EXISTS vertical text NOT NULL DEFAULT 'general';

ALTER TABLE public.magnet_map_emails
  ADD COLUMN IF NOT EXISTS vertical text;

CREATE INDEX IF NOT EXISTS idx_magnet_submissions_vertical
  ON public.magnet_submissions (vertical);

DROP FUNCTION IF EXISTS public.get_magnet_submission_by_slug(text);

CREATE OR REPLACE FUNCTION public.get_magnet_submission_by_slug(_slug text)
 RETURNS TABLE(status text, first_name text, vertical text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT s.status, s.first_name, s.vertical
  FROM public.magnet_submissions s
  WHERE s.slug = _slug
  LIMIT 1
$function$;