CREATE TABLE public.lead_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  first_name text,
  last_name text,
  email text NOT NULL,
  firm text,
  source text NOT NULL,
  variant text,
  page_path text,
  referrer_url text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  visitor_fingerprint text,
  session_id text,
  user_agent text
);

CREATE INDEX idx_lead_signups_created_at ON public.lead_signups (created_at DESC);
CREATE INDEX idx_lead_signups_source ON public.lead_signups (source);
CREATE INDEX idx_lead_signups_email ON public.lead_signups (lower(email));

ALTER TABLE public.lead_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
ON public.lead_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(email) BETWEEN 3 AND 320
  AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND source IS NOT NULL
  AND length(source) BETWEEN 1 AND 64
  AND (first_name IS NULL OR length(first_name) <= 120)
  AND (last_name IS NULL OR length(last_name) <= 120)
  AND (firm IS NULL OR length(firm) <= 200)
);

CREATE POLICY "Service role full access on lead_signups"
ON public.lead_signups
FOR ALL
TO service_role
USING (true) WITH CHECK (true);