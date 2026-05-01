-- magnet_views: per-visit analytics
CREATE TABLE public.magnet_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL,
  viewed_at timestamptz NOT NULL DEFAULT now(),
  visitor_fingerprint text,
  referrer_url text,
  referrer_slug text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  session_id text,
  dwell_seconds int,
  max_scroll_percent int,
  last_section_seen text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_magnet_views_slug_viewed_at ON public.magnet_views (slug, viewed_at DESC);
CREATE INDEX idx_magnet_views_session ON public.magnet_views (session_id);
CREATE INDEX idx_magnet_views_referrer_slug ON public.magnet_views (referrer_slug);
ALTER TABLE public.magnet_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on magnet_views"
  ON public.magnet_views FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- magnet_shares: outbound share-link attribution
CREATE TABLE public.magnet_shares (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_slug text NOT NULL,
  sharer_email text,
  recipient_email text,
  share_method text NOT NULL,
  share_token text NOT NULL UNIQUE,
  shared_at timestamptz NOT NULL DEFAULT now(),
  visited_at timestamptz,
  visited_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_magnet_shares_source_slug ON public.magnet_shares (source_slug);
CREATE INDEX idx_magnet_shares_recipient ON public.magnet_shares (recipient_email);
ALTER TABLE public.magnet_shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on magnet_shares"
  ON public.magnet_shares FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- magnet_emails: unified email-capture log
CREATE TABLE public.magnet_emails (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  source_event text NOT NULL,
  source_slug text,
  captured_at timestamptz NOT NULL DEFAULT now(),
  consented_marketing boolean NOT NULL DEFAULT false,
  email_domain text GENERATED ALWAYS AS (split_part(email, '@', 2)) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT magnet_emails_unique_capture UNIQUE NULLS NOT DISTINCT (email, source_event, source_slug)
);
CREATE INDEX idx_magnet_emails_email ON public.magnet_emails (email);
CREATE INDEX idx_magnet_emails_captured_at ON public.magnet_emails (captured_at DESC);
CREATE INDEX idx_magnet_emails_source_event ON public.magnet_emails (source_event);
CREATE INDEX idx_magnet_emails_domain ON public.magnet_emails (email_domain);
ALTER TABLE public.magnet_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on magnet_emails"
  ON public.magnet_emails FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);