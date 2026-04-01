import { useState } from "react";

const RINGS = [
  { label: "Core Proof", detail: "BASF carveout, Kensing #1 result", r: 60, color: "#2D2A26" },
  { label: "Active", detail: "Kensing, Schebler, DeliverHealth", r: 110, color: "#4A6741" },
  { label: "Dead Zone", detail: "400+ dormant contacts", r: 160, color: "#C65D3E", pulse: true },
  { label: "Warm Adjacency", detail: "AMA, DePaul, CEO Roundtable, Junto", r: 210, color: "#C4A747" },
  { label: "New Gravity", detail: "Unknown prospects", r: 260, color: "#A09890", dashed: true },
];

export default function PepperOrbitMap() {
  const [hovered, setHovered] = useState<number | null>(null);
  const cx = 280;
  const cy = 280;

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 560 560" className="w-full max-w-[500px]">
        <style>{`
          @keyframes breathe { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
          .ring-pulse { animation: breathe 3s ease-in-out infinite; }
        `}</style>
        {RINGS.map((ring, i) => (
          <g key={i}>
            <circle
              cx={cx}
              cy={cy}
              r={ring.r}
              fill="none"
              stroke={ring.color}
              strokeWidth={hovered === i ? 3 : 1.5}
              strokeDasharray={ring.dashed ? "6 4" : undefined}
              opacity={0.7}
              className={ring.pulse ? "ring-pulse" : ""}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer", transition: "stroke-width 0.2s" }}
            />
            {hovered === i && (
              <foreignObject
                x={cx + ring.r * 0.5 + 10}
                y={cy - ring.r * 0.3 - 15}
                width={180}
                height={60}
              >
                <div className="bg-[#1A1A2E] text-white text-[11px] px-3 py-2 rounded-lg shadow-xl">
                  <strong>{ring.label}</strong>
                  <br />
                  {ring.detail}
                </div>
              </foreignObject>
            )}
          </g>
        ))}
        <circle cx={cx} cy={cy} r={20} fill="#1A1A2E" />
        <text x={cx} y={cy + 5} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          PG
        </text>
      </svg>
    </div>
  );
}
