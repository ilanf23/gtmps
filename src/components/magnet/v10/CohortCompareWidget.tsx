// CohortCompareWidget - composes OrbitGapRadar + a compact peer table
// + the firm's percentile bars into one cohesive "where you stand" widget.
// Designed to live as the body of /m/:slug/cohort.
//
// Spec: §9.2.14 of the audit. Reads cohort_metrics shipped in #7.

import { useEffect, useState } from "react";
import { fetchCohortMetrics } from "@/lib/cohort";
import type { CohortMetric } from "@/types/cohort";
import OrbitGapRadar from "./OrbitGapRadar";
import PercentileBar from "./PercentileBar";

interface Props {
  firmId: string;
  cohortKey: string;
  /** Optional firm display name for the eyebrow. */
  firmName?: string;
  /** Brand accent for the buyer polygon + bars. */
  primary?: string;
}

const METRIC_LABELS: Record<string, string> = {
  relationship_revenue_posture: "Relationship",
  content_velocity: "Content velocity",
  orbit_density: "Orbit density",
  dead_zone_value: "Dead Zone value",
  follow_up_cadence: "Follow-up cadence",
};

// Mock peer-median values per metric for the radar. Until the cohort
// pipeline emits a `peer_median` column, hard-code an editorial baseline
// so the widget reads coherently.
const MOCK_PEER_MEDIAN: Record<string, number> = {
  relationship_revenue_posture: 41,
  content_velocity: 33,
  orbit_density: 48,
  dead_zone_value: 36,
  follow_up_cadence: 44,
};

export default function CohortCompareWidget({
  firmId,
  cohortKey,
  firmName,
  primary = "#A8923A",
}: Props) {
  const [metrics, setMetrics] = useState<CohortMetric[] | null>(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setMetrics(null);
    setErrored(false);
    fetchCohortMetrics(firmId, cohortKey)
      .then((rows) => { if (!cancelled) setMetrics(rows); })
      .catch(() => { if (!cancelled) setErrored(true); });
    return () => { cancelled = true; };
  }, [firmId, cohortKey]);

  if (errored || !metrics || metrics.length === 0) return null;

  const radarRows = metrics.map((m) => ({
    label: METRIC_LABELS[m.metric_key] ?? m.metric_key,
    buyer: Math.max(0, Math.min(100, Math.round(m.cohort_percentile))),
    peer: MOCK_PEER_MEDIAN[m.metric_key] ?? 50,
  }));

  const totalCohort = metrics[0]?.cohort_size ?? 0;

  return (
    <section
      data-testid="cohort-compare-widget"
      className="w-full"
      style={{ paddingTop: 24, paddingBottom: 24 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-12 items-start">
        {/* Left - Radar */}
        <div>
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(15, 30, 29, 0.55)",
              margin: "0 0 18px",
              fontWeight: 500,
            }}
          >
            {firmName ? `${firmName} vs cohort` : "You vs cohort"}
            {totalCohort ? ` · n=${totalCohort}` : ""}
          </p>
          <OrbitGapRadar rows={radarRows} primary={primary} />
        </div>

        {/* Right - Per-metric percentile rail */}
        <div className="flex flex-col gap-6">
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(15, 30, 29, 0.55)",
              margin: 0,
              fontWeight: 500,
            }}
          >
            Where you stand
          </p>
          {metrics.map((m) => (
            <PercentileBar
              key={m.id}
              percentile={m.cohort_percentile}
              cohortSize={m.cohort_size}
              label={METRIC_LABELS[m.metric_key] ?? m.metric_key}
              primary={primary}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
