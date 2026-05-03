/**
 * Cohort metric fetcher - data layer for the future <CohortRankCard>.
 *
 * Reads from `public.cohort_metrics` (see the matching migration in
 * supabase/migrations/). Returns a list of metric rows for one
 * (firm, cohort) pair. The styled UI consumer is intentionally
 * deferred to coordinate with the parallel design-tokens session;
 * this file is part of Track E (data layer only) of the audit sprint.
 *
 * Contract:
 *   - Returns an empty array when the firm has no rows in this cohort
 *     (rather than throwing). Callers can render an empty/skeleton state.
 *   - Re-throws Supabase errors so callers can decide how to surface them.
 *   - Does NOT enforce ordering. Callers should sort by `metric_key` or
 *     `cohort_percentile` as the UI requires.
 *
 * Note on typing: the auto-generated `Database` type in
 * `src/integrations/supabase/types.ts` does not yet know about the
 * `cohort_metrics` table because it is regenerated separately. We cast
 * through `unknown` at the query boundary and trust the shape we just
 * wrote in the migration. Once the `Database` type is regenerated this
 * cast can be removed.
 */

import { supabase } from "@/integrations/supabase/client";
import type { CohortMetric } from "@/types/cohort";

export const COHORT_METRICS_TABLE = "cohort_metrics";

/**
 * Fetch all cohort metrics for a single (firm, cohort) pair.
 *
 * @param firmId    The firm identifier (currently the magnet slug).
 * @param cohortKey The cohort to compare the firm against (typically an
 *                  industry slug from `src/content/verticals.ts`).
 * @returns An array of {@link CohortMetric} rows. Empty array if no rows
 *          match. Throws if Supabase returns an error.
 */
export async function fetchCohortMetrics(
  firmId: string,
  cohortKey: string,
): Promise<CohortMetric[]> {
  // The cohort_metrics table is not in the auto-generated Database type
  // yet. Cast the client to `any` at the call site only.
  const { data, error } = await (supabase as unknown as {
    from: (t: string) => {
      select: (cols: string) => {
        eq: (
          col: string,
          val: string,
        ) => {
          eq: (
            col: string,
            val: string,
          ) => Promise<{ data: CohortMetric[] | null; error: unknown }>;
        };
      };
    };
  })
    .from(COHORT_METRICS_TABLE)
    .select("*")
    .eq("firm_id", firmId)
    .eq("cohort_key", cohortKey);

  if (error) {
    throw error;
  }
  return data ?? [];
}
