// RevenueLeakWaterfall - Recharts ComposedChart with custom waterfall
// shapes. Editorial visualization of "where the dollars leak" across
// the GTM funnel for a firm.
//
// Spec: §3.8 of the audit. Stages: Pipeline → Stalled → Reactivated
// → Closed. Each stage has a dollar value; the waterfall shows the
// leak (negative bar) and recovery (positive bar) per stage.

import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Stage {
  /** Stage label on the x-axis. */
  name: string;
  /** Inflow value (positive = adds to running total, negative = leak). */
  delta: number;
  /** Whether this is a "leak" stage. Drives color. */
  type: "inflow" | "leak" | "recovery" | "total";
}

interface Props {
  stages?: Stage[];
  /** Brand accent for the inflow / running-total bars. */
  primary?: string;
  /** USD prefix? Default true; flip to false for unitless. */
  isUsd?: boolean;
}

const DEFAULT_STAGES: Stage[] = [
  { name: "Pipeline",    delta: 1_000_000, type: "inflow" },
  { name: "Stalled",     delta:  -350_000, type: "leak" },
  { name: "Dormant",     delta:  -220_000, type: "leak" },
  { name: "Reactivated", delta:   180_000, type: "recovery" },
  { name: "Closed",      delta:   610_000, type: "total" },
];

const COLOR_LEAK = "#BF461A";
const COLOR_RECOVERY = "#A8923A";
const COLOR_INFLOW = "#225351";
const COLOR_TOTAL = "#0F1E1D";

function colorFor(type: Stage["type"], primary: string): string {
  switch (type) {
    case "leak": return COLOR_LEAK;
    case "recovery": return COLOR_RECOVERY;
    case "inflow": return COLOR_INFLOW;
    case "total": return COLOR_TOTAL;
    default: return primary;
  }
}

function formatUsd(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

export default function RevenueLeakWaterfall({
  stages = DEFAULT_STAGES,
  primary = "#A8923A",
  isUsd = true,
}: Props) {
  // Compute cumulative + bar segments for waterfall.
  // Each row gets {start, end, value, label, color}.
  let running = 0;
  const data = stages.map((s) => {
    const start = s.type === "inflow" || s.type === "total" ? 0 : running;
    const end = s.type === "total" ? running : running + s.delta;
    if (s.type !== "total") running = end;
    const base = Math.min(start, end);
    const span = Math.abs(end - start);
    return {
      name: s.name,
      base,
      span,
      delta: s.delta,
      type: s.type,
      color: colorFor(s.type, primary),
      runningTotal: end,
    };
  });

  const fmt = isUsd ? formatUsd : (n: number) => `${Math.round(n)}`;

  return (
    <figure data-testid="revenue-leak-waterfall" className="w-full" style={{ margin: 0 }}>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{ top: 16, right: 16, left: 8, bottom: 8 }}
          >
            <XAxis
              dataKey="name"
              tick={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 12,
                fill: "rgba(15, 30, 29, 0.6)",
              }}
              axisLine={{ stroke: "rgba(15, 30, 29, 0.18)" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={fmt}
              tick={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 11,
                fill: "rgba(15, 30, 29, 0.5)",
              }}
              axisLine={false}
              tickLine={false}
              width={64}
            />
            <Tooltip
              cursor={{ fill: "rgba(15, 30, 29, 0.04)" }}
              contentStyle={{
                background: "#FBF8F4",
                border: "1px solid #D5DEC2",
                borderRadius: 4,
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 12,
              }}
              formatter={(_v: unknown, _k: unknown, ctx: { payload?: typeof data[number] }) => {
                const p = ctx.payload;
                if (!p) return ["", ""];
                return [`${fmt(p.delta)} (running ${fmt(p.runningTotal)})`, p.name];
              }}
            />
            {/* Invisible base for stacking effect */}
            <Bar dataKey="base" stackId="w" fill="transparent" />
            {/* The visible delta bar */}
            <Bar dataKey="span" stackId="w" radius={[2, 2, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div
        className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(15, 30, 29, 0.55)",
        }}
      >
        <span className="inline-flex items-center gap-2">
          <span aria-hidden style={{ width: 10, height: 10, borderRadius: 2, background: COLOR_INFLOW }} />
          Inflow
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden style={{ width: 10, height: 10, borderRadius: 2, background: COLOR_LEAK }} />
          Leak
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden style={{ width: 10, height: 10, borderRadius: 2, background: COLOR_RECOVERY }} />
          Recovered
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden style={{ width: 10, height: 10, borderRadius: 2, background: COLOR_TOTAL }} />
          Closed
        </span>
      </div>
    </figure>
  );
}
