/**
 * Cohort metric types — mirror of the `public.cohort_metrics` table
 * defined in the matching Supabase migration. See:
 *   supabase/migrations/2026050212522 9_*.sql
 *
 * Used by `src/lib/cohort.ts` (the fetcher) and the future
 * `<CohortRankCard>` UI component. The styled UI is deferred until
 * design tokens land in the parallel design-tokens session; this file
 * is part of the data-layer-only Track E sprint.
 */

/**
 * Stable identifiers for the metrics we rank firms on. New metrics can
 * be added here as the scoring pipeline grows. The string values are
 * the same `metric_key` values stored in the table.
 */
export type CohortMetricKey =
  | "relationship_revenue_posture"
  | "content_velocity"
  | "orbit_density"
  | "dead_zone_value"
  | "follow_up_cadence";

/**
 * One row from `public.cohort_metrics`. Numeric columns are returned by
 * supabase-js as `number`. `cohort_percentile` is 0–100 (100 = best).
 */
export interface CohortMetric {
  /** Surrogate primary key. */
  id: string;
  /** Firm identifier (currently the magnet slug). */
  firm_id: string;
  /** The cohort being compared against (typically an industry slug). */
  cohort_key: string;
  /** Stable metric identifier. */
  metric_key: CohortMetricKey | string;
  /** Raw numeric value of the metric for this firm. */
  metric_value: number;
  /** 0–100. The firm's percentile within the cohort. 100 = best. */
  cohort_percentile: number;
  /** How many firms make up the cohort the percentile is computed against. */
  cohort_size: number;
  /** When the metric was last computed. ISO timestamp string. */
  computed_at: string;
  /** Row creation timestamp. ISO timestamp string. */
  created_at: string;
}
