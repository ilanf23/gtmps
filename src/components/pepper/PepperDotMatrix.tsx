import { useState } from "react";

const TOOLTIPS = [
  "Former Schebler contact, now VP Ops at PE-backed manufacturer",
  "2019 proposal contact, promoted to CMO at industrial distributor",
  "AMA Chicago member, launched own B2B consultancy",
  "Junto cohort founder, scaling to $50M and needs marketing OS",
  "DeliverHealth contact, moved to healthcare PE operating partner role",
  "Ex-Kensing contact, now at competing manufacturer seeking agency",
  "Former conference speaker connection, now leads marketing at $100M firm",
  "Chicago CEO Roundtable peer, recently acquired a new portco",
];

export default function PepperDotMatrix() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-10 gap-2.5 max-w-[360px]">
        {Array.from({ length: 80 }).map((_, i) => {
          const isActive = i < 16;
          return (
            <div key={i} className="relative">
              <div
                onMouseEnter={() => !isActive && setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="w-7 h-7 rounded-full cursor-pointer transition-all duration-300"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, #C65D3E, #D4714F)"
                    : hovered === i
                    ? "#A09890"
                    : "rgba(213,206,197,0.6)",
                  boxShadow: isActive
                    ? "0 2px 8px rgba(198,93,62,0.3), inset 0 1px 2px rgba(255,255,255,0.2)"
                    : hovered === i
                    ? "0 2px 8px rgba(0,0,0,0.1)"
                    : "none",
                  transform: hovered === i ? "scale(1.15)" : "scale(1)",
                }}
              />
              {hovered === i && (
                <div
                  className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-3 rounded-xl w-56 pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, #1A1A2E, #0D0D1A)",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "11px",
                    lineHeight: "1.5",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                  }}
                >
                  {TOOLTIPS[(i - 16) % TOOLTIPS.length]}
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                    style={{ background: "#1A1A2E" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-8 text-[12px] text-[#6B6560]">
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full" style={{ background: "linear-gradient(135deg, #C65D3E, #D4714F)" }} />
          Active (20%)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full" style={{ background: "rgba(213,206,197,0.6)" }} />
          Dormant (80%)
        </span>
      </div>
    </div>
  );
}
