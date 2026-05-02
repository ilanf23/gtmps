-- =====================================================================
-- Seed: additional cohort_metrics rows for the demo / QA microsites.
--
-- The original migration seeded only Cravath + Slalom. After shipping
-- <CohortRankCard> (#13) and <CohortCompareWidget> + the /m/:slug/cohort
-- route (#23), the radar + percentile widgets silent-omit on every other
-- firm because no rows exist. This seed extends coverage so QA + demo
-- traffic actually sees the cohort visualizations render.
--
-- Firms added (chosen because they're already named on the homepage
-- ReceiptsStrip + WarStory + AuthorityStrip — receipts are coherent
-- when you click through to /m/<firm>/cohort):
--   - madcraft        (digital agency, agency cohort)
--   - spr             (technology consulting, consulting cohort)
--   - workiva         (advisory cohort)
--   - aarete          (consulting cohort, the $125M anchor)
--   - marcumllp       (advisory cohort — resolves to CBIZ but seed by
--                      submitted slug since fetcher reads firm_id=slug)
--   - jabian          (consulting cohort — generic exemplar)
--
-- Values are MOCK editorial — chosen so each firm reads as plausibly
-- in-cohort with mild variation. Replace via the real computation
-- pipeline when it ships (see cohort_metrics design notes in the
-- original migration).
--
-- Idempotent: inserts use ON CONFLICT DO NOTHING so re-running this
-- migration after partial application is safe.
-- =====================================================================

INSERT INTO public.cohort_metrics
  (firm_id, cohort_key, metric_key, metric_value, cohort_percentile, cohort_size)
VALUES
  -- Madcraft — agency cohort. The Dead Zone reactivation hero ($400K).
  ('madcraft', 'agency', 'relationship_revenue_posture', 68.0, 79, 96),
  ('madcraft', 'agency', 'content_velocity',             5.4,  62, 96),
  ('madcraft', 'agency', 'orbit_density',                5.8,  71, 96),
  ('madcraft', 'agency', 'dead_zone_value',              412_000, 84, 96),
  ('madcraft', 'agency', 'follow_up_cadence',            7.0,  77, 96),

  -- SPR — Chicago technology consulting. The 150-contact reactivation case.
  ('spr', 'consulting', 'relationship_revenue_posture',  74.0, 83, 318),
  ('spr', 'consulting', 'content_velocity',              6.9,  68, 318),
  ('spr', 'consulting', 'orbit_density',                 6.4,  72, 318),
  ('spr', 'consulting', 'dead_zone_value',               2_200_000, 71, 318),
  ('spr', 'consulting', 'follow_up_cadence',             8.0,  74, 318),

  -- Workiva — advisory cohort, anchor engagement.
  ('workiva', 'advisory', 'relationship_revenue_posture', 78.0, 86, 142),
  ('workiva', 'advisory', 'content_velocity',             7.2,  70, 142),
  ('workiva', 'advisory', 'orbit_density',                7.0,  78, 142),
  ('workiva', 'advisory', 'dead_zone_value',              4_600_000, 81, 142),
  ('workiva', 'advisory', 'follow_up_cadence',            5.5,  82, 142),

  -- AArete — consulting cohort. The $125M-as-CMO anchor on AuthorityStrip.
  ('aarete', 'consulting', 'relationship_revenue_posture', 88.0, 95, 318),
  ('aarete', 'consulting', 'content_velocity',             9.4,  88, 318),
  ('aarete', 'consulting', 'orbit_density',                8.2,  90, 318),
  ('aarete', 'consulting', 'dead_zone_value',              5_100_000, 86, 318),
  ('aarete', 'consulting', 'follow_up_cadence',            5.0,  91, 318),

  -- Marcum LLP — advisory cohort (the test fixture; resolves to CBIZ
  -- in display but firm_id matches submitted slug per fetcher contract).
  ('marcumllp', 'advisory', 'relationship_revenue_posture', 64.0, 72, 142),
  ('marcumllp', 'advisory', 'content_velocity',             4.8,  56, 142),
  ('marcumllp', 'advisory', 'orbit_density',                5.2,  61, 142),
  ('marcumllp', 'advisory', 'dead_zone_value',              1_400_000, 48, 142),
  ('marcumllp', 'advisory', 'follow_up_cadence',            10.0, 51, 142),

  -- Jabian — consulting cohort, generic exemplar firm.
  ('jabian', 'consulting', 'relationship_revenue_posture', 62.0, 69, 318),
  ('jabian', 'consulting', 'content_velocity',             5.0,  54, 318),
  ('jabian', 'consulting', 'orbit_density',                5.5,  63, 318),
  ('jabian', 'consulting', 'dead_zone_value',              1_900_000, 66, 318),
  ('jabian', 'consulting', 'follow_up_cadence',            8.5,  70, 318)
ON CONFLICT (firm_id, cohort_key, metric_key) DO NOTHING;
