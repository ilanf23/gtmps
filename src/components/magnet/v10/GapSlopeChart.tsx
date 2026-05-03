// GapSlopeChart - small slope chart showing peer-median → cohort-top
// → buyer position for one or more metrics. Pure SVG, no chart lib.
//
// Spec: §3.3 of the audit. Reads as an editorial "where you stand" beat.

interface SlopeRow {
  /** Metric label (left edge). */
  metric: string;
  /** Peer median value, shown on the left axis. */
  peerMedian: number;
  /** Cohort top value, shown on the right axis. */
  cohortTop: number;
  /** Buyer's value. Positioned on the right axis next to cohortTop. */
  buyer: number;
}

interface Props {
  rows: SlopeRow[];
  /** Domain max - values are normalized to this for vertical position. */
  max?: number;
  /** Brand accent for the buyer marker. */
  primary?: string;
}

const PADDING_T = 24;
const PADDING_B = 28;
const PADDING_X = 88;
const ROW_HEIGHT = 28;

export default function GapSlopeChart({
  rows,
  max = 100,
  primary = "#A8923A",
}: Props) {
  const height = PADDING_T + rows.length * ROW_HEIGHT + PADDING_B;
  const width = 560;
  const innerLeft = PADDING_X;
  const innerRight = width - PADDING_X;

  return (
    <figure data-testid="gap-slope-chart" className="w-full" style={{ margin: 0 }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        style={{ display: "block", maxWidth: 720 }}
        role="img"
        aria-label="Slope chart: peer median, cohort top, buyer position per metric"
      >
        {/* Axis labels */}
        <text
          x={innerLeft}
          y={14}
          textAnchor="middle"
          fontFamily="'DM Mono', monospace"
          fontSize="9"
          letterSpacing="2"
          fill="rgba(15, 30, 29, 0.5)"
          style={{ textTransform: "uppercase" }}
        >
          Peer median
        </text>
        <text
          x={innerRight}
          y={14}
          textAnchor="middle"
          fontFamily="'DM Mono', monospace"
          fontSize="9"
          letterSpacing="2"
          fill="rgba(15, 30, 29, 0.5)"
          style={{ textTransform: "uppercase" }}
        >
          Cohort top
        </text>

        {rows.map((r, i) => {
          const yBase = PADDING_T + i * ROW_HEIGHT + ROW_HEIGHT / 2;
          // Normalize y position by value within the row's vertical band.
          const peerPos = yBase - 14 * (r.peerMedian / Math.max(1, max));
          const cohortPos = yBase - 14 * (r.cohortTop / Math.max(1, max));
          const buyerPos = yBase - 14 * (r.buyer / Math.max(1, max));

          return (
            <g key={r.metric}>
              {/* metric label */}
              <text
                x={8}
                y={yBase + 4}
                fontFamily="'Inter Tight', sans-serif"
                fontSize="12"
                fill="#0F1E1D"
                fontWeight={500}
              >
                {r.metric}
              </text>

              {/* slope line: peer → cohort */}
              <line
                x1={innerLeft}
                y1={peerPos}
                x2={innerRight}
                y2={cohortPos}
                stroke="rgba(15, 30, 29, 0.18)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />

              {/* peer dot */}
              <circle cx={innerLeft} cy={peerPos} r={3.5} fill="#225351" />
              <text
                x={innerLeft - 8}
                y={peerPos + 3}
                textAnchor="end"
                fontFamily="'Inter Tight', sans-serif"
                fontSize="11"
                fill="rgba(15, 30, 29, 0.6)"
                fontVariantNumeric="tabular-nums"
              >
                {r.peerMedian}
              </text>

              {/* cohort dot */}
              <circle cx={innerRight} cy={cohortPos} r={3.5} fill="rgba(15, 30, 29, 0.5)" />
              <text
                x={innerRight + 8}
                y={cohortPos + 3}
                textAnchor="start"
                fontFamily="'Inter Tight', sans-serif"
                fontSize="11"
                fill="rgba(15, 30, 29, 0.6)"
                fontVariantNumeric="tabular-nums"
              >
                {r.cohortTop}
              </text>

              {/* buyer marker - emphasized */}
              <circle
                cx={innerRight}
                cy={buyerPos}
                r={5}
                fill={`var(--brand-accent, ${primary})`}
                stroke="#FBF8F4"
                strokeWidth={2}
              />
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(0, ${height - 14})`}>
          <circle cx={innerLeft} cy={0} r={3.5} fill="#225351" />
          <text x={innerLeft + 8} y={3} fontFamily="'DM Mono', monospace" fontSize="9" letterSpacing="2" fill="rgba(15, 30, 29, 0.5)" style={{ textTransform: "uppercase" }}>
            Peer
          </text>
          <circle cx={innerLeft + 64} cy={0} r={3.5} fill="rgba(15, 30, 29, 0.5)" />
          <text x={innerLeft + 72} y={3} fontFamily="'DM Mono', monospace" fontSize="9" letterSpacing="2" fill="rgba(15, 30, 29, 0.5)" style={{ textTransform: "uppercase" }}>
            Cohort top
          </text>
          <circle cx={innerLeft + 154} cy={0} r={4.5} fill={`var(--brand-accent, ${primary})`} stroke="#FBF8F4" strokeWidth={1.5} />
          <text x={innerLeft + 164} y={3} fontFamily="'DM Mono', monospace" fontSize="9" letterSpacing="2" fill="rgba(15, 30, 29, 0.5)" style={{ textTransform: "uppercase" }}>
            You
          </text>
        </g>
      </svg>
    </figure>
  );
}
