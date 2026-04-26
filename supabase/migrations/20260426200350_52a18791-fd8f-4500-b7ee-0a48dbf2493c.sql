ALTER TABLE public.magnet_submissions ADD COLUMN IF NOT EXISTS crm_size text;
ALTER TABLE public.magnet_submissions ADD COLUMN IF NOT EXISTS deal_size text;
ALTER TABLE public.magnet_submissions ADD COLUMN IF NOT EXISTS bd_challenge text;
ALTER TABLE public.magnet_submissions ADD COLUMN IF NOT EXISTS case_studies_url text;
ALTER TABLE public.magnet_submissions ADD COLUMN IF NOT EXISTS team_page_url text;