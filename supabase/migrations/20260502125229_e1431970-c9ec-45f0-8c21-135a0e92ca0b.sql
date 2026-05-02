-- =====================================================================
-- Cohort metrics — data layer for the future <CohortRankCard> component.
--
-- Audit Sprint 2 / Track E. Ranks a firm against its industry cohort on
-- a set of metrics (relationship-revenue posture, content velocity, etc.).
-- The styled UI is intentionally deferred until design tokens land in a
-- parallel session; this migration ships only the persistence layer.
--
-- Schema choice: a base TABLE (not a view) for two reasons:
--   1. The metrics are computed via async pipelines (LLM scoring, scrape
--      cadence calculations). They need to be persisted, not re-derived
--      on every page load.
--   2. A view would need source columns that do not yet exist in
--      magnet_breakdowns. A table lets us seed a few rows now so the
--      fetcher and (eventual) UI have something to render in dev.
--
-- The fetcher in src/lib/cohort.ts reads from this table directly. When a
-- real upstream computation pipeline is built, it should INSERT/UPSERT
-- into this table on enrichment completion (or on a nightly cron).
-- =====================================================================

CREATE TABLE public.cohort_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- The firm being ranked. We use the magnet slug as the firm identity
  -- since every firm in the system has one. (No FK because slugs are also
  -- generated for verticals/seed rows that never enter magnet_submissions.)
  firm_id text NOT NULL,
  -- The cohort the firm is being compared against. Typically an industry
  -- slug from src/content/verticals.ts (e.g. 'law', 'consulting', 'msp').
  cohort_key text NOT NULL,
  -- Metric identifier. Stable string keys so the UI can switch on them.
  -- Initial keys: 'relationship_revenue_posture', 'content_velocity',
  -- 'orbit_density', 'dead_zone_value', 'follow_up_cadence'.
  metric_key text NOT NULL,
  -- Raw numeric value of the metric for this firm.
  metric_value numeric NOT NULL,
  -- The firm's percentile within its cohort, 0-100. 100 = best.
  cohort_percentile numeric NOT NULL CHECK (cohort_percentile >= 0 AND cohort_percentile <= 100),
  -- How many firms are in the cohort the percentile was computed against.
  cohort_size int NOT NULL CHECK (cohort_size >= 0),
  -- When the metric was last computed.
  computed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  -- One row per (firm, cohort, metric). Re-computation should UPSERT.
  CONSTRAINT cohort_metrics_unique UNIQUE (firm_id, cohort_key, metric_key)
);

CREATE INDEX idx_cohort_metrics_firm ON public.cohort_metrics (firm_id);
CREATE INDEX idx_cohort_metrics_cohort ON public.cohort_metrics (cohort_key);
CREATE INDEX idx_cohort_metrics_firm_cohort ON public.cohort_metrics (firm_id, cohort_key);

ALTER TABLE public.cohort_metrics ENABLE ROW LEVEL SECURITY;

-- Service role does writes from edge functions / cron.
CREATE POLICY "Service role full access on cohort_metrics"
  ON public.cohort_metrics FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- Anonymous + authenticated can READ (the data is non-sensitive ranking
-- info that we already plan to render publicly). Writes are blocked.
CREATE POLICY "Public read on cohort_metrics"
  ON public.cohort_metrics FOR SELECT
  TO anon, authenticated
  USING (true);

-- ---------------------------------------------------------------------
-- Seed data — MOCK values so the fetcher and unit test have something
-- realistic to assert against until the real computation pipeline ships.
-- Remove or replace once real cohort scoring is wired up.
-- ---------------------------------------------------------------------
INSERT INTO public.cohort_metrics
  (firm_id, cohort_key, metric_key, metric_value, cohort_percentile, cohort_size)
VALUES
  -- Cravath in the law cohort
  ('cravath', 'law', 'relationship_revenue_posture', 72.5, 88, 124),
  ('cravath', 'law', 'content_velocity',             4.2,  41, 124),
  ('cravath', 'law', 'orbit_density',                6.0,  77, 124),
  ('cravath', 'law', 'dead_zone_value',              3_400_000, 22, 124),
  ('cravath', 'law', 'follow_up_cadence',            12.0, 55, 124),
  -- Slalom in the consulting cohort
  ('slalom',  'consulting', 'relationship_revenue_posture', 81.0, 92, 318),
  ('slalom',  'consulting', 'content_velocity',             8.7,  74, 318),
  ('slalom',  'consulting', 'orbit_density',                7.4,  82, 318),
  ('slalom',  'consulting', 'dead_zone_value',              1_800_000, 64, 318),
  ('slalom',  'consulting', 'follow_up_cadence',            6.5,  88, 318);
