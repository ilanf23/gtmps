ALTER TABLE public.lead_signups ADD COLUMN message text;

DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.lead_signups;

CREATE POLICY "Anyone can submit a lead"
ON public.lead_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(email) >= 3 AND length(email) <= 320
  AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND source IS NOT NULL
  AND length(source) >= 1 AND length(source) <= 64
  AND (first_name IS NULL OR length(first_name) <= 120)
  AND (last_name IS NULL OR length(last_name) <= 120)
  AND (firm IS NULL OR length(firm) <= 200)
  AND (message IS NULL OR length(message) <= 2000)
);