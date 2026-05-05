
-- 1. Add override column for firm name corrections
ALTER TABLE public.magnet_breakdowns
  ADD COLUMN IF NOT EXISTS client_company_name_override text;

-- 2. Create corrections log table
CREATE TABLE IF NOT EXISTS public.magnet_name_corrections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  previous_name text,
  corrected_name text NOT NULL,
  visitor_fingerprint text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.magnet_name_corrections ENABLE ROW LEVEL SECURITY;

-- Service-role full access (ops can read/export)
CREATE POLICY "Service role full access on name_corrections"
  ON public.magnet_name_corrections
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 3. RPC: SECURITY DEFINER update of firm name override + log entry
CREATE OR REPLACE FUNCTION public.correct_magnet_firm_name(
  _slug text,
  _corrected_name text,
  _visitor_fingerprint text DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _trimmed text;
  _previous text;
BEGIN
  _trimmed := btrim(coalesce(_corrected_name, ''));

  IF length(_trimmed) < 1 OR length(_trimmed) > 120 THEN
    RAISE EXCEPTION 'Invalid firm name length';
  END IF;

  -- Reject control chars / newlines
  IF _trimmed ~ '[[:cntrl:]]' THEN
    RAISE EXCEPTION 'Invalid characters in firm name';
  END IF;

  SELECT coalesce(client_company_name_override, client_company_name)
    INTO _previous
    FROM public.magnet_breakdowns
    WHERE slug = _slug
    LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Slug not found';
  END IF;

  UPDATE public.magnet_breakdowns
     SET client_company_name_override = _trimmed
   WHERE slug = _slug;

  INSERT INTO public.magnet_name_corrections (slug, previous_name, corrected_name, visitor_fingerprint)
  VALUES (_slug, _previous, _trimmed, _visitor_fingerprint);

  RETURN _trimmed;
END;
$$;

REVOKE ALL ON FUNCTION public.correct_magnet_firm_name(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.correct_magnet_firm_name(text, text, text) TO anon, authenticated;

-- 4. Update read RPC to expose override (drop and recreate due to return-type change)
DROP FUNCTION IF EXISTS public.get_magnet_breakdown_by_slug(text);

CREATE OR REPLACE FUNCTION public.get_magnet_breakdown_by_slug(_slug text)
 RETURNS TABLE(welcome_message text, dead_zone_value bigint, dead_zone_reasoning text, gtm_profile_observed text, gtm_profile_assessment text, orbit_01 text, orbit_02 text, orbit_03 text, orbit_04 text, orbit_05 text, recommended_layer text, action_1 text, action_2 text, action_3 text, chapter_callouts jsonb, enrichment_error text, client_logo_url text, client_brand_color text, client_company_name text, client_accent_color text, client_background_color text, client_text_color text, client_font_family text, client_brand_profile jsonb, crm_estimate integer, deal_size_estimate integer, deeper_findings jsonb)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT
    b.welcome_message, b.dead_zone_value, b.dead_zone_reasoning,
    b.gtm_profile_observed, b.gtm_profile_assessment,
    b.orbit_01, b.orbit_02, b.orbit_03, b.orbit_04, b.orbit_05,
    b.recommended_layer, b.action_1, b.action_2, b.action_3,
    b.chapter_callouts, b.enrichment_error,
    b.client_logo_url, b.client_brand_color,
    coalesce(b.client_company_name_override, b.client_company_name) AS client_company_name,
    b.client_accent_color, b.client_background_color, b.client_text_color,
    b.client_font_family, b.client_brand_profile,
    b.crm_estimate, b.deal_size_estimate,
    b.deeper_findings
  FROM public.magnet_breakdowns b
  WHERE b.slug = _slug
  LIMIT 1
$function$;
