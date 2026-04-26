ALTER TABLE public.magnet_breakdowns
  ADD COLUMN IF NOT EXISTS client_logo_url text,
  ADD COLUMN IF NOT EXISTS client_brand_color text,
  ADD COLUMN IF NOT EXISTS client_company_name text;

DROP FUNCTION IF EXISTS public.get_magnet_breakdown_by_slug(text);

CREATE FUNCTION public.get_magnet_breakdown_by_slug(_slug text)
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
  enrichment_error text,
  client_logo_url text,
  client_brand_color text,
  client_company_name text
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
    b.enrichment_error,
    b.client_logo_url,
    b.client_brand_color,
    b.client_company_name
  FROM public.magnet_breakdowns b
  WHERE b.slug = _slug
  LIMIT 1
$$;

GRANT EXECUTE ON FUNCTION public.get_magnet_breakdown_by_slug(text) TO anon, authenticated;