-- Helper: read a magnet_submissions row by slug from the browser.
-- Returns just the fields the loading screen needs.
CREATE OR REPLACE FUNCTION public.get_magnet_submission_by_slug(_slug text)
RETURNS TABLE (
  status text,
  first_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.status, s.first_name
  FROM public.magnet_submissions s
  WHERE s.slug = _slug
  LIMIT 1
$$;

-- Helper: read a magnet_breakdowns row by slug from the browser.
-- Returns every field the breakdown page renders.
CREATE OR REPLACE FUNCTION public.get_magnet_breakdown_by_slug(_slug text)
RETURNS TABLE (
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
  recommended_layer text,
  action_1 text,
  action_2 text,
  action_3 text,
  chapter_callouts jsonb,
  enrichment_error text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    b.welcome_message,
    b.dead_zone_value,
    b.dead_zone_reasoning,
    b.gtm_profile_observed,
    b.gtm_profile_assessment,
    b.orbit_01,
    b.orbit_02,
    b.orbit_03,
    b.orbit_04,
    b.orbit_05,
    b.recommended_layer,
    b.action_1,
    b.action_2,
    b.action_3,
    b.chapter_callouts,
    b.enrichment_error
  FROM public.magnet_breakdowns b
  WHERE b.slug = _slug
  LIMIT 1
$$;

-- Grant execute to anon + authenticated so the browser can call them.
GRANT EXECUTE ON FUNCTION public.get_magnet_submission_by_slug(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_magnet_breakdown_by_slug(text) TO anon, authenticated;