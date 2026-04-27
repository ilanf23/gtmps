// SECTION 02 — Five Orbits visualization
// Color-coded by score band (red/yellow/green). Click an orbit to expand inline insight.

import { useState } from "react";
import type { ScoreBand } from "@/lib/magnetScoring";
import { MABBLY_GOLD } from "@/lib/mabblyAnchors";

const ORBIT_NAMES = [
  "Core Proof",
  "Active",
  "Dead Zone",
  "Warm Adjacency",
  "New Gravity",
];

const BAND_TOKENS: Record<ScoreBand, { fg: string; bg: string; border: string; label: string }> = {
  high:  { fg: "#1B5E20", bg: "rgba(76,175,80,0.10)", border: "rgba(76,175,80,0.45)", label: "Strong" },
  mid:   { fg: "#7A5B00", bg: "rgba(184,147,58,0.10)", border: "rgba(184,147,58,0.45)", label: "Mixed" },
  low:   { fg: "#7A1F1F", bg: "rgba(180,60,50,0.10)", border: "rgba(180,60,50,0.45)", label: "Gap" },
};

interface Props {
  orbits: (string | null)[];
  perOrbit: number[];
  bandPerOrbit: ScoreBand[];
  primary: string;
}

export default function FiveOrbitsViz({ orbits, perOrbit, bandPerOrbit, primary }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section
      id="v10-section-2"
      data-v10-section="2"
      className="py-16 md:py-24 border-b border-black/10"
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="h-px w-6" style={{ backgroundColor: MABBLY_GOLD }} aria-hidden />
        <p
          className="text-[11px] uppercase tracking-[0.3em] font-semibold"
          style={{ color: MABBLY_GOLD }}
        >
          02 · Your Five Orbits
        </p>
      </div>
      <h2
        className="font-bold leading-tight text-2xl md:text-3xl mb-3"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        Where your next client already orbits you.
      </h2>
      <p className="text-sm md:text-base opacity-60 mb-8 max-w-lg leading-relaxed">
        Color reflects what we observed on your site. Tap any orbit to see the read.
      </p>

      <div className="grid gap-2">
        {orbits.map((desc, i) => {
          const id = String(i + 1).padStart(2, "0");
          const tokens = BAND_TOKENS[bandPerOrbit[i] ?? "low"];
          const isOpen = openIdx === i;
          const score = perOrbit[i] ?? 0;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="text-left bg-[#FBF8F4] border p-5 hover:opacity-95 transition-all"
              style={{
                borderColor: tokens.border,
                backgroundColor: tokens.bg,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 shrink-0 rounded-full border flex items-center justify-center text-xs font-semibold"
                  style={{
                    color: tokens.fg,
                    borderColor: tokens.border,
                    backgroundColor: "rgba(255,255,255,0.6)",
                  }}
                >
                  {id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-semibold">
                      <span style={{ color: primary }}>⊙{id} </span>
                      {ORBIT_NAMES[i]}
                    </p>
                    <span
                      className="text-[10px] uppercase tracking-wider shrink-0 font-semibold"
                      style={{ color: tokens.fg }}
                    >
                      {tokens.label} · {score}
                    </span>
                  </div>
                  {/* Score bar */}
                  <div className="mt-2 h-1 w-full bg-black/10 overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{ width: `${score}%`, backgroundColor: tokens.fg }}
                    />
                  </div>
                  {isOpen && (
                    <p className="text-sm opacity-80 mt-3 leading-relaxed">
                      {desc?.trim() || "We could not read enough on the site to map this orbit confidently. We'll dig in on the call."}
                    </p>
                  )}
                  {!isOpen && (
                    <p className="text-xs opacity-55 mt-1.5">Tap to read the observation</p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
