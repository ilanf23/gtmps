// OrbitGapRadar - pentagonal radar comparing buyer scores vs cohort
// medians across the 5 RROS metrics. Pure SVG; no chart library
// dependency.
//
// Spec: §3.1 of the audit (the flagship "vs cohort" radar). Reads
// the cohort_metrics shape shipped in #7. Brand-accent buyer polygon
// with high-contrast stroke; muted ink polygon for peer median.

interface RadarRow {
  /** Metric label rendered around the polygon. */
  label: string;
  /** Buyer's value, 0-100. */
  buyer: number;
  /** Peer median, 0-100. */
  peer: number;
}

interface Props {
  rows: RadarRow[];
  /** Brand accent for the buyer polygon. */
  primary?: string;
  /** Side length of the SVG viewbox. Defaults 360. */
  size?: number;
}

const DEFAULT_ROWS: RadarRow[] = [
  { label: "Relationship", buyer: 72, peer: 41 },
  { label: "Content velocity", buyer: 38, peer: 33 },
  { label: "Orbit density", buyer: 64, peer: 48 },
  { label: "Dead Zone value", buyer: 81, peer: 36 },
  { label: "Follow-up cadence", buyer: 52, peer: 44 },
];

function pointAt(cx: number, cy: number, radius: number, angle: number) {
  const x = cx + radius * Math.cos(angle);
  const y = cy + radius * Math.sin(angle);
  return { x, y };
}

export default function OrbitGapRadar({
  rows = DEFAULT_ROWS,
  primary = "#A8923A",
  size = 360,
}: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.36;
  const labelRadius = maxRadius + 28;
  const n = rows.length;

  // Angle per axis. Top = -90° offset.
  const axisAngle = (i: number) => (-Math.PI / 2) + (i / n) * Math.PI * 2;

  const polygonPoints = (key: "buyer" | "peer") =>
    rows
      .map((r, i) => {
        const { x, y } = pointAt(cx, cy, maxRadius * (r[key] / 100), axisAngle(i));
        return `${x},${y}`;
      })
      .join(" ");

  // Concentric quartile rings (25/50/75/100).
  const rings = [0.25, 0.5, 0.75, 1].map((t, i) => ({
    r: maxRadius * t,
    opacity: 0.04 + i * 0.02,
  }));

  return (
    <figure data-testid="orbit-gap-radar" className="w-full" style={{ margin: 0 }}>
      <svg
        viewBox={`0 0 ${size + 80} ${size + 40}`}
        width="100%"
        style={{ display: "block", maxWidth: 640, height: "auto" }}
        role="img"
        aria-label="Radar chart comparing the buyer's metric scores to the peer cohort median"
      >
        <g transform={`translate(40, 20)`}>
          {/* Concentric rings */}
          {rings.map((ring, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={ring.r}
              fill={`rgba(15, 30, 29, ${ring.opacity})`}
              stroke="rgba(15, 30, 29, 0.10)"
              strokeWidth={0.6}
            />
          ))}

          {/* Axis spokes */}
          {rows.map((_, i) => {
            const { x, y } = pointAt(cx, cy, maxRadius, axisAngle(i));
            return (
              <line
                key={`spoke-${i}`}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="rgba(15, 30, 29, 0.14)"
                strokeWidth={0.7}
              />
            );
          })}

          {/* Peer polygon */}
          <polygon
            points={polygonPoints("peer")}
            fill="rgba(34, 83, 81, 0.18)"
            stroke="#225351"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />

          {/* Buyer polygon */}
          <polygon
            points={polygonPoints("buyer")}
            fill={`color-mix(in srgb, var(--brand-accent, ${primary}) 22%, transparent)`}
            stroke={`var(--brand-accent, ${primary})`}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />

          {/* Buyer dots at vertices */}
          {rows.map((r, i) => {
            const { x, y } = pointAt(cx, cy, maxRadius * (r.buyer / 100), axisAngle(i));
            return (
              <circle
                key={`buyer-dot-${i}`}
                cx={x}
                cy={y}
                r={4}
                fill={`var(--brand-accent, ${primary})`}
                stroke="#FBF8F4"
                strokeWidth={1.5}
              />
            );
          })}

          {/* Axis labels */}
          {rows.map((r, i) => {
            const { x, y } = pointAt(cx, cy, labelRadius, axisAngle(i));
            // Tweak text-anchor based on angle quadrant for readability.
            const angle = axisAngle(i);
            const cosA = Math.cos(angle);
            const anchor: "start" | "middle" | "end" =
              Math.abs(cosA) < 0.2 ? "middle" : cosA > 0 ? "start" : "end";
            return (
              <g key={`label-${i}`}>
                <text
                  x={x}
                  y={y}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fontFamily="'Inter Tight', sans-serif"
                  fontSize="11"
                  fill="#0F1E1D"
                  fontWeight={500}
                  style={{ letterSpacing: "-0.005em" }}
                >
                  {r.label}
                </text>
                <text
                  x={x}
                  y={y + 14}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fontFamily="'DM Mono', monospace"
                  fontSize="10"
                  fill={`var(--brand-accent, ${primary})`}
                  fontWeight={600}
                  fontVariantNumeric="tabular-nums"
                  style={{ letterSpacing: "0.04em" }}
                >
                  {r.buyer} <tspan fill="rgba(15, 30, 29, 0.4)">· {r.peer}</tspan>
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Legend */}
      <div
        className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4 justify-center"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(15, 30, 29, 0.6)",
        }}
      >
        <span className="inline-flex items-center gap-2">
          <span aria-hidden style={{ width: 12, height: 2, background: `var(--brand-accent, ${primary})` }} />
          Your firm
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden style={{ width: 12, height: 2, background: "#225351" }} />
          Peer median
        </span>
      </div>
    </figure>
  );
}
