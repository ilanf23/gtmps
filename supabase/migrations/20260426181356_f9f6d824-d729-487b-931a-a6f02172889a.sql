-- Clear out client_logo_url values that are almost certainly social-share
-- photos or banners pulled in by the old extractor's og:image fallback.
-- Affected microsites will re-trigger branding extraction on next visit.
UPDATE public.magnet_breakdowns
SET client_logo_url = NULL
WHERE client_logo_url IS NOT NULL
  AND (
    lower(client_logo_url) ~ '\.(jpe?g)(\?|$)'
    OR lower(client_logo_url) ~ '(og[-_]?image|social|share|cover|hero|banner|featured|opengraph)'
  );