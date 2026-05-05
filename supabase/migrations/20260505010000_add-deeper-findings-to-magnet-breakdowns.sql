-- Add deeper_findings JSONB column to hold per-firm content for the
-- DeeperFindings 10A/10B/10C cards (Signal Analysis / Cadence Read /
-- Research Flag). Shape:
--   { "10A": { "observed": text, "hypothesis": text, "question": text },
--     "10B": { ... },
--     "10C": { ... } }
-- Null falls back to hardcoded copy in DeeperFindings.tsx for older breakdowns.

ALTER TABLE public.magnet_breakdowns
  ADD COLUMN IF NOT EXISTS deeper_findings jsonb;

-- Update the breakdown reader RPC to expose the new column.
DROP FUNCTION IF EXISTS public.get_magnet_breakdown_by_slug(text);

CREATE OR REPLACE FUNCTION public.get_magnet_breakdown_by_slug(_slug text)
 RETURNS TABLE(welcome_message text, dead_zone_value bigint, dead_zone_reasoning text, gtm_profile_observed text, gtm_profile_assessment text, orbit_01 text, orbit_02 text, orbit_03 text, orbit_04 text, orbit_05 text, recommended_layer text, action_1 text, action_2 text, action_3 text, chapter_callouts jsonb, enrichment_error text, client_logo_url text, client_brand_color text, client_company_name text, client_accent_color text, client_background_color text, client_text_color text, client_font_family text, client_brand_profile jsonb, crm_estimate integer, deal_size_estimate integer, deeper_findings jsonb)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    b.client_company_name,
    b.client_accent_color,
    b.client_background_color,
    b.client_text_color,
    b.client_font_family,
    b.client_brand_profile,
    b.crm_estimate,
    b.deal_size_estimate,
    b.deeper_findings
  FROM public.magnet_breakdowns b
  WHERE b.slug = _slug
  LIMIT 1
$function$;

GRANT EXECUTE ON FUNCTION public.get_magnet_breakdown_by_slug(text) TO anon, authenticated;
