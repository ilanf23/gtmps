-- Referral tracking: custom Ops-minted links + first-touch attribution on
-- new map submissions.

create table if not exists public.magnet_referral_codes (
  code text primary key,
  label text not null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  destination_path text not null default '/',
  notes text,
  suppress_slack boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.magnet_referral_codes enable row level security;

create policy "Service role full access on magnet_referral_codes"
  on public.magnet_referral_codes
  for all
  to service_role
  using (true)
  with check (true);

create table if not exists public.magnet_ref_clicks (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  clicked_at timestamptz not null default now(),
  visitor_fingerprint text,
  landing_path text,
  user_agent text,
  referrer_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_magnet_ref_clicks_code on public.magnet_ref_clicks (code);
create index if not exists idx_magnet_ref_clicks_clicked_at on public.magnet_ref_clicks (clicked_at desc);

alter table public.magnet_ref_clicks enable row level security;

create policy "Service role full access on magnet_ref_clicks"
  on public.magnet_ref_clicks
  for all
  to service_role
  using (true)
  with check (true);

create policy "Anyone can log a ref click"
  on public.magnet_ref_clicks
  for insert
  to anon, authenticated
  with check (true);

alter table public.magnet_submissions
  add column if not exists ref_code text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists referrer_url text;

create index if not exists idx_magnet_submissions_ref_code on public.magnet_submissions (ref_code);
create index if not exists idx_magnet_submissions_utm on public.magnet_submissions (utm_source, utm_medium, utm_campaign);
