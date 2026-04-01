import { useState } from "react";

const RINGS = [
  { label: "Core Proof", detail: "BASF carveout, Kensing #1 result", r: 55, color: "#2D2A26" },
  { label: "Active", detail: "Kensing, Schebler, DeliverHealth", r: 100, color: "#4A6741" },
  { label: "Dead Zone", detail: "400+ dormant contacts", r: 150, color: "#C65D3E", pulse: true },
  { label: "Warm Adjacency", detail: "AMA, DePaul, CEO Roundtable, Junto", r: 200, color: "#C4A747" },
  { label: "New Gravity", detail: "Unknown prospects", r: 250, color: "#A09890", dashed: true },
];

export default function PepperOrbitMap() {
  const [active, setActive] = useState<number | null>(null);
  const cx = 280;
  const cy = 280;

  return (
    <div
      className="flex flex-col lg:flex-row items-center gap-8 rounded-2xl p-8"
      style={{
        background: "linear-gradient(135deg, #1A1A2E, #0D0D1A)",
        boxShadow: "0 20px 60px rgba(26,26,46,0.3)",
      }}
    >
      {/* SVG Map */}
      <svg viewBox="0 0 560 560" className="w-full max-w-[420px] shrink-0">
        <defs>
          <radialGradient id="orbit-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(198,93,62,0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={cx} cy={cy} r={260} fill="url(#orbit-glow)" />

        <style>{`
          @keyframes breathe {
            0%, 100% { opacity: 0.5; stroke-width: 1.5; }
            50% { opacity: 1; stroke-width: 2.5; }
          }
          .ring-pulse { animation: breathe 3s ease-in-out infinite; }
        `}</style>

        {/* Ring labels */}
        {RINGS.map((ring, i) => (
          <text
            key={`label-${i}`}
            x={cx}
            y={cy - ring.r - 8}
            textAnchor="middle"
            fill={ring.color}
            fontSize="11"
            fontFamily="Inter, sans-serif"
            fontWeight="600"
            letterSpacing="0.08em"
            opacity={active === i ? 1 : 0.75}
            style={{
              transition: "opacity 0.3s",
              textTransform: "uppercase" as const,
              filter: `drop-shadow(0 0 4px ${ring.color}66)`,
            }}
          >
            {ring.label}
          </text>
        ))}

        {/* Rings + invisible wide hover zones */}
        {RINGS.map((ring, i) => (
          <g key={i}>
            {/* Visible ring */}
            <circle
              cx={cx}
              cy={cy}
              r={ring.r}
              fill="none"
              stroke={ring.color}
              strokeWidth={active === i ? 2.5 : 1}
              strokeDasharray={ring.dashed ? "6 4" : undefined}
              opacity={active === i ? 0.9 : 0.3}
              className={ring.pulse ? "ring-pulse" : ""}
              style={{ transition: "stroke-width 0.3s, opacity 0.3s" }}
              filter={ring.pulse && active === i ? "url(#glow)" : undefined}
            />
            {/* Invisible wide hit area */}
            <circle
              cx={cx}
              cy={cy}
              r={ring.r}
              fill="none"
              stroke="transparent"
              strokeWidth={24}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(active === i ? null : i)}
            />
          </g>
        ))}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={22} fill="#C65D3E" opacity={0.15} />
        <circle cx={cx} cy={cy} r={16} fill="#1A1A2E" stroke="#C65D3E" strokeWidth={1.5} />
        <text x={cx} y={cy + 4} textAnchor="middle" fill="#C65D3E" fontSize="11" fontWeight="bold" fontFamily="Inter, sans-serif">
          PG
        </text>
      </svg>

      {/* Persistent legend */}
      <div className="flex flex-col gap-2 w-full lg:w-auto">
        {RINGS.map((ring, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg px-4 py-3 transition-all duration-300 cursor-pointer"
            style={{
              background: active === i ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${active === i ? ring.color + "44" : "rgba(255,255,255,0.05)"}`,
              transform: active === i ? "translateX(4px)" : "none",
            }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onClick={() => setActive(active === i ? null : i)}
          >
            <span
              className="w-3 h-3 rounded-full shrink-0 mt-0.5"
              style={{
                background: ring.color,
                opacity: active === i ? 1 : 0.5,
                boxShadow: active === i ? `0 0 8px ${ring.color}66` : "none",
                transition: "opacity 0.3s, box-shadow 0.3s",
              }}
            />
            <div>
              <div
                className="text-[12px] font-semibold tracking-wide uppercase"
                style={{
                  color: active === i ? ring.color : "rgba(255,255,255,0.6)",
                  transition: "color 0.3s",
                }}
              >
                {ring.label}
              </div>
              <div
                className="text-[11px] mt-0.5"
                style={{
                  color: active === i ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)",
                  transition: "color 0.3s",
                }}
              >
                {ring.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
