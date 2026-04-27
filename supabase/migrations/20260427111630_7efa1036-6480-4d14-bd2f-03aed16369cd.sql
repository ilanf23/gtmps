-- Create magnet_map_emails table for the optional "Email me this map" capture
-- on the post-CTA result page. Anyone visiting a map can request a copy of it
-- by email; this table is the capture record. Actual email sending is wired
-- separately (or via downstream automation).

CREATE TABLE public.magnet_map_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_magnet_map_emails_slug ON public.magnet_map_emails (slug);

ALTER TABLE public.magnet_map_emails ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can request a copy of a map.
CREATE POLICY "Anyone can request map by email"
  ON public.magnet_map_emails
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No client SELECT/UPDATE/DELETE. Service role bypasses RLS for any backend reads.