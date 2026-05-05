-- =====================================================================
-- Remove the workiva cohort_metrics rows seeded in
-- 20260502153943_seed-cohort-metrics-additional-firms.sql.
--
-- Workiva is not an approved client name. The earlier seed inserted
-- five mock metric rows (one per metric_key) for firm_id='workiva' so
-- that /m/workiva/cohort would render. Deleting those rows so the
-- cohort widgets silent-omit on that slug instead.
--
-- Idempotent: DELETE on a missing row is a no-op.
-- =====================================================================

DELETE FROM public.cohort_metrics
WHERE firm_id = 'workiva'
  AND cohort_key = 'advisory';
