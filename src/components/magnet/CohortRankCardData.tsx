/**
 * CohortRankCardData - UNSTYLED preview of the cohort metrics data layer.
 *
 * This component exists ONLY to prove the data-layer end-to-end during
 * Track E of audit Sprint 2. The visual <CohortRankCard> (with bars,
 * tokens, copy, motion, etc.) is intentionally deferred until design
 * tokens land in the parallel session - building it now would force
 * us to invent ad-hoc colors and font choices that conflict with the
 * design-tokens work in flight.
 *
 * It is NOT wired into any page; it is exported for the future styled
 * component author (and for tests) to consume. No colors, no fonts -
 * only layout primitives (`space-y-1`).
 */

import type { CohortMetric } from "@/types/cohort";

export interface CohortRankCardDataProps {
  /** The list of cohort metrics for one (firm, cohort) pair, as
   *  returned by `fetchCohortMetrics`. */
  metrics: CohortMetric[];
}

export function CohortRankCardData({ metrics }: CohortRankCardDataProps) {
  if (!metrics || metrics.length === 0) {
    return <p>No cohort metrics available.</p>;
  }

  return (
    <ul className="space-y-1" data-testid="cohort-rank-card-data">
      {metrics.map((m) => (
        <li key={m.id}>
          {m.metric_key}: {Math.round(m.cohort_percentile)}th of {m.cohort_size}
        </li>
      ))}
    </ul>
  );
}

export default CohortRankCardData;
