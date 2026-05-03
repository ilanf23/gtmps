// PercentileBar - single horizontal bar with quartile bands and the
// buyer-firm marker. Reusable building block for cohort comparisons.
//
// Spec: §3.x of the audit (the gap-slope/percentile family). The visual
// register matches CohortRankCard so the two components live cleanly
// side by side: light track, brand-accent marker, ink labels.

interface Props {
  /** Buyer's percentile, 0-100 (100 = best). */
  percentile: number;
  /** Optional label shown above the bar (e.g. metric name). */
  label?: string;
  /** Optional cohort size shown beside the percentile. */
  cohortSize?: number;
  /** Brand accent for the marker + percentile readout. */
  primary?: string;
  /** Show the Q1/Q2/Q3/Q4 quartile band shading. Defaults true. */
  showBands?: boolean;
}

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

export default function PercentileBar({
  percentile,
  label,
  cohortSize,
  primary = "#A8923A",
  showBands = true,
}: Props) {
  const pct = Math.max(0, Math.min(100, Math.round(percentile)));
  const bands = [
    { from: 0,  to: 25, opacity: 0.04 },
    { from: 25, to: 50, opacity: 0.07 },
    { from: 50, to: 75, opacity: 0.10 },
    { from: 75, to: 100, opacity: 0.14 },
  ];

  return (
    <div data-testid="percentile-bar" className="w-full">
      {(label || cohortSize) && (
        <div className="flex items-baseline justify-between gap-3 mb-2">
          {label && (
            <span
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 14,
                color: "#0F1E1D",
                fontWeight: 500,
              }}
            >
              {label}
            </span>
          )}
          <span
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 12,
              color: `var(--brand-accent, ${primary})`,
              fontVariantNumeric: "tabular-nums",
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            {pct}
            <span style={{ opacity: 0.7 }}>{ordSuffix(pct)}</span>
            {cohortSize ? <span style={{ opacity: 0.6 }}> · of {cohortSize}</span> : null}
          </span>
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ? `${label} percentile ${pct}` : `Percentile ${pct}`}
        className="relative w-full"
        style={{
          height: 10,
          background: "rgba(15, 30, 29, 0.04)",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        {showBands &&
          bands.map((b) => (
            <span
              key={b.from}
              aria-hidden
              style={{
                position: "absolute",
                left: `${b.from}%`,
                width: `${b.to - b.from}%`,
                top: 0,
                bottom: 0,
                background: `rgba(15, 30, 29, ${b.opacity})`,
              }}
            />
          ))}

        {/* Buyer marker - vertical tick + accent dot */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: `calc(${pct}% - 1px)`,
            top: 0,
            bottom: 0,
            width: 2,
            background: `var(--brand-accent, ${primary})`,
          }}
        />
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: `calc(${pct}% - 6px)`,
            top: -3,
            width: 14,
            height: 14,
            borderRadius: 999,
            background: `var(--brand-accent, ${primary})`,
            boxShadow: "0 1px 4px rgba(15, 30, 29, 0.18)",
          }}
        />
      </div>

      {/* Quartile labels */}
      {showBands && (
        <div
          className="flex justify-between mt-1.5"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(15, 30, 29, 0.4)",
          }}
        >
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      )}
    </div>
  );
}
