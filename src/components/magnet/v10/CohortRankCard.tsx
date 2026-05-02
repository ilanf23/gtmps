// CohortRankCard — styled cohort percentile card.
//
// Sits between PersonalizedHeader (01) and FiveOrbitsViz (02) in
// MagnetBreakdown. Reads from the `cohort_metrics` table via
// fetchCohortMetrics (data layer shipped in #7). Silently renders
// nothing when no rows match — most firms won't have cohort data
// seeded yet, and we don't want a "no data" placeholder breaking
// the editorial flow.

import { useEffect, useState } from "react";
import { fetchCohortMetrics } from "@/lib/cohort";
import type { CohortMetric } from "@/types/cohort";
import { MABBLY_GOLD } from "@/lib/mabblyAnchors";

interface Props {
  firmId: string;
  cohortKey: string;
  primary: string;
}

const METRIC_LABELS: Record<string, string> = {
  relationship_revenue_posture: "Relationship Revenue posture",
  content_velocity: "Content velocity",
  orbit_density: "Orbit density",
  dead_zone_value: "Dead Zone value",
  follow_up_cadence: "Follow-up cadence",
};

function ordSuffix(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return "th";
  switch (n % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

// percentile is 0–100 with 100 = best. Convert to ordinal rank in cohort.
export function rankFromPercentile(percentile: number, size: number): number {
  if (size <= 0) return 1;
  const clamped = Math.max(0, Math.min(100, percentile));
  return Math.max(1, Math.min(size, Math.ceil(((100 - clamped) / 100) * size) || 1));
}

export default function CohortRankCard({ firmId, cohortKey, primary }: Props) {
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

  const sorted = [...metrics].sort(
    (a, b) => b.cohort_percentile - a.cohort_percentile,
  );
  const top = sorted[0];
  const display = sorted.slice(0, 3);
  const rank = rankFromPercentile(top.cohort_percentile, top.cohort_size);
  const total = top.cohort_size;
  const topMetricLabel = METRIC_LABELS[top.metric_key] ?? top.metric_key;
  const topPercentile = Math.max(0, Math.min(100, Math.round(top.cohort_percentile)));
  const topPercentileBucket = Math.max(1, 100 - topPercentile);

  return (
    <section
      data-testid="cohort-rank-card"
      data-cohort-key={cohortKey}
      className="py-8 md:py-10 border-b border-black/10"
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="h-px w-6" style={{ backgroundColor: MABBLY_GOLD }} aria-hidden />
        <p
          className="text-[11px] uppercase tracking-[0.3em] font-semibold"
          style={{ color: MABBLY_GOLD }}
        >
          How you rank
        </p>
      </div>

      <h2
        className="font-bold leading-tight text-2xl md:text-3xl mb-3 max-w-[806px]"
        style={{ fontFamily: "'Source Serif 4', 'IBM Plex Serif', Georgia, serif" }}
      >
        You rank {rank}
        <sup className="text-[0.55em] font-normal align-super pl-0.5">
          {ordSuffix(rank)}
        </sup>{" "}
        of {total} firms in your cohort.
      </h2>
      <p className="text-sm md:text-base opacity-60 mb-6 max-w-lg leading-relaxed">
        Top {topPercentileBucket}% on <em>{topMetricLabel}</em>. Strongest signals below.
      </p>

      <ul className="space-y-3 max-w-xl">
        {display.map((m) => {
          const label = METRIC_LABELS[m.metric_key] ?? m.metric_key;
          const pct = Math.max(0, Math.min(100, Math.round(m.cohort_percentile)));
          return (
            <li key={m.id}>
              <div className="flex items-baseline justify-between gap-3 mb-1.5">
                <span className="text-sm font-medium">{label}</span>
                <span
                  className="text-[11px] tabular-nums tracking-wide opacity-80"
                  style={{ color: `var(--brand-accent, ${primary})` }}
                >
                  {pct}
                  <span className="opacity-60">{ordSuffix(pct)}</span> · top {Math.max(1, 100 - pct)}%
                </span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${label} percentile ${pct}`}
                style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
              >
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-out"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: `var(--brand-accent, ${primary})`,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
