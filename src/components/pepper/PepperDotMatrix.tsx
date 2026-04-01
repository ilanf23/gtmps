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
    <div className="space-y-4">
      <div className="grid grid-cols-10 gap-2 max-w-[320px]">
        {Array.from({ length: 80 }).map((_, i) => {
          const isActive = i < 16;
          return (
            <div key={i} className="relative">
              <div
                onMouseEnter={() => !isActive && setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-[#C65D3E]"
                    : "bg-[#D5CEC5] hover:bg-[#A09890]"
                }`}
              />
              {hovered === i && (
                <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1A1A2E] text-white text-[11px] px-3 py-2 rounded-lg w-52 shadow-xl pointer-events-none">
                  {TOOLTIPS[(i - 16) % TOOLTIPS.length]}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-6 text-[12px] text-[#6B6560]">
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#C65D3E]" /> Active (20%)</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#D5CEC5]" /> Dormant (80%)</span>
      </div>
    </div>
  );
}
