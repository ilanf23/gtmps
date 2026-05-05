DROP POLICY IF EXISTS "Anyone can log a view" ON public.magnet_views;
CREATE POLICY "Anyone can log a view"
  ON public.magnet_views
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(btrim(slug)) > 0
    AND char_length(slug) <= 255
    AND (session_id IS NULL OR char_length(session_id) <= 255)
    AND (visitor_fingerprint IS NULL OR char_length(visitor_fingerprint) <= 255)
    AND (utm_source IS NULL OR char_length(utm_source) <= 255)
    AND (utm_medium IS NULL OR char_length(utm_medium) <= 255)
    AND (utm_campaign IS NULL OR char_length(utm_campaign) <= 255)
  );