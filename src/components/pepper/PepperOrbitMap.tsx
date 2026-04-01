import { useState } from "react";

const RINGS = [
  { label: "Core Proof", detail: "BASF carveout, Kensing #1 result", r: 55, color: "#2D2A26" },
  { label: "Active", detail: "Kensing, Schebler, DeliverHealth", r: 100, color: "#4A6741" },
  { label: "Dead Zone", detail: "400+ dormant contacts", r: 150, color: "#C65D3E", pulse: true },
  { label: "Warm Adjacency", detail: "AMA, DePaul, CEO Roundtable, Junto", r: 200, color: "#C4A747" },
  { label: "New Gravity", detail: "Unknown prospects", r: 250, color: "#A09890", dashed: true },
];

export default function PepperOrbitMap() {
  const [hovered, setHovered] = useState<number | null>(null);
  const cx = 280;
  const cy = 280;

  return (
    <div
      className="flex justify-center rounded-2xl p-8"
      style={{
        background: "linear-gradient(135deg, #1A1A2E, #0D0D1A)",
        boxShadow: "0 20px 60px rgba(26,26,46,0.3)",
      }}
    >
      <svg viewBox="0 0 560 560" className="w-full max-w-[480px]">
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

        {/* Background glow */}
        <circle cx={cx} cy={cy} r={260} fill="url(#orbit-glow)" />

        <style>{`
          @keyframes breathe {
            0%, 100% { opacity: 0.5; stroke-width: 1.5; }
            50% { opacity: 1; stroke-width: 2.5; }
          }
          .ring-pulse { animation: breathe 3s ease-in-out infinite; }
        `}</style>

        {/* Ring labels at top */}
        {RINGS.map((ring, i) => (
          <g key={`label-${i}`}>
            <text
              x={cx}
              y={cy - ring.r - 6}
              textAnchor="middle"
              fill={ring.color}
              fontSize="9"
              fontFamily="Inter, sans-serif"
              fontWeight="600"
              letterSpacing="0.08em"
              opacity={hovered === i ? 1 : 0.5}
              style={{ transition: "opacity 0.3s", textTransform: "uppercase" }}
            >
              {ring.label}
            </text>
          </g>
        ))}

        {RINGS.map((ring, i) => (
          <g key={i}>
            <circle
              cx={cx}
              cy={cy}
              r={ring.r}
              fill="none"
              stroke={ring.color}
              strokeWidth={hovered === i ? 2.5 : 1}
              strokeDasharray={ring.dashed ? "6 4" : undefined}
              opacity={hovered === i ? 0.9 : 0.3}
              className={ring.pulse ? "ring-pulse" : ""}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer", transition: "stroke-width 0.3s, opacity 0.3s" }}
              filter={ring.pulse && hovered === i ? "url(#glow)" : undefined}
            />
            {hovered === i && (
              <foreignObject
                x={cx + ring.r * 0.45 + 10}
                y={cy - 20}
                width={200}
                height={64}
              >
                <div
                  className="px-4 py-3 rounded-xl text-[11px] leading-snug"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.85)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                  }}
                >
                  <strong style={{ color: ring.color }}>{ring.label}</strong>
                  <br />
                  {ring.detail}
                </div>
              </foreignObject>
            )}
          </g>
        ))}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={22} fill="#C65D3E" opacity={0.15} />
        <circle cx={cx} cy={cy} r={16} fill="#1A1A2E" stroke="#C65D3E" strokeWidth={1.5} />
        <text x={cx} y={cy + 4} textAnchor="middle" fill="#C65D3E" fontSize="11" fontWeight="bold" fontFamily="Inter, sans-serif">
          PG
        </text>
      </svg>
    </div>
  );
}
