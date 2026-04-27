// SECTION 02 — Five Orbits visualization
// Each card: numbered circle · orbit name · proportional score meter · arrow affordance.
// Hover peeks the first sentence; tap/click expands the full observation.

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

// Color tokens by band — Red (low), Yellow (mid), Green (high).
const BAND_TOKENS: Record<
  ScoreBand,
  { fg: string; meter: string; bg: string; border: string; label: string }
> = {
  high: {
    fg: "#1B5E20",
    meter: "#2E7D32",
    bg: "rgba(76,175,80,0.08)",
    border: "rgba(76,175,80,0.45)",
    label: "Strong",
  },
  mid: {
    fg: "#7A5B00",
    meter: "#B8933A",
    bg: "rgba(184,147,58,0.08)",
    border: "rgba(184,147,58,0.45)",
    label: "Mixed",
  },
  low: {
    fg: "#7A1F1F",
    meter: "#B43C32",
    bg: "rgba(180,60,50,0.08)",
    border: "rgba(180,60,50,0.45)",
    label: "Gap",
  },
};

interface Props {
  orbits: (string | null)[];
  perOrbit: number[];
  bandPerOrbit: ScoreBand[];
  primary: string;
}

/** First-sentence "peek" used for the hover state. */
function firstSentence(text: string | null | undefined): string {
  if (!text) return "";
  const trimmed = text.trim();
  const m = trimmed.match(/^(.+?[.!?])(?:\s|$)/);
  return (m?.[1] ?? trimmed).slice(0, 160);
}

export default function FiveOrbitsViz({
  orbits,
  perOrbit,
  bandPerOrbit,
  primary,
}: Props) {
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
        Color reflects what we observed on your site. Tap any orbit to read the
        full observation.
      </p>

      <div className="grid gap-3">
        {orbits.map((desc, i) => {
          const id = String(i + 1).padStart(2, "0");
          const tokens = BAND_TOKENS[bandPerOrbit[i] ?? "low"];
          const isOpen = openIdx === i;
          const score = Math.max(0, Math.min(100, perOrbit[i] ?? 0));
          const peek = firstSentence(desc);
          const fallbackObs =
            "We could not read enough on the site to map this orbit confidently. We'll dig in on the call.";
          return (
            <button
              key={id}
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group text-left bg-[#FBF8F4] border p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)]"
              style={{
                borderColor: tokens.border,
                backgroundColor: tokens.bg,
              }}
            >
              <div className="flex items-stretch gap-3 sm:gap-4">
                {/* Left: numbered circle */}
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full border flex items-center justify-center font-semibold text-sm tabular-nums self-center"
                  style={{
                    color: tokens.fg,
                    borderColor: tokens.border,
                    backgroundColor: "rgba(255,255,255,0.7)",
                  }}
                >
                  {id}
                </div>

                {/* Center: name + score meter */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                  <p className="text-sm sm:text-base font-semibold leading-tight">
                    {ORBIT_NAMES[i]}
                  </p>

                  {/* Proportional score meter */}
                  <div className="flex items-center gap-3">
                    <div
                      className="h-1.5 flex-1 rounded-full overflow-hidden"
                      style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
                      role="progressbar"
                      aria-valuenow={score}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${ORBIT_NAMES[i]} score ${score} of 100`}
                    >
                      <div
                        className="h-full rounded-full transition-[width] duration-500 ease-out"
                        style={{
                          width: `${score}%`,
                          backgroundColor: tokens.meter,
                        }}
                      />
                    </div>
                    <span
                      className="text-[11px] font-semibold tabular-nums whitespace-nowrap shrink-0"
                      style={{ color: tokens.fg }}
                    >
                      {score} · {tokens.label}
                    </span>
                  </div>
                </div>

                {/* Right: affordance arrow */}
                <div className="shrink-0 self-center hidden sm:flex items-center">
                  <span
                    aria-hidden
                    className="text-base transition-transform duration-200 group-hover:translate-x-0.5"
                    style={{ color: tokens.fg, opacity: 0.7 }}
                  >
                    {isOpen ? "↓" : "→"}
                  </span>
                </div>
              </div>

              {/* Hover peek (desktop only, hidden when open) */}
              {!isOpen && peek && (
                <p
                  className="hidden md:block text-xs opacity-0 group-hover:opacity-70 transition-opacity duration-200 mt-3 leading-snug pl-[3.75rem]"
                  style={{ color: tokens.fg }}
                >
                  {peek}
                </p>
              )}

              {/* Read-the-observation CTA (mobile + desktop closed state) */}
              {!isOpen && (
                <p
                  className="text-[11px] sm:text-xs font-medium mt-3 pl-[3.75rem] flex items-center gap-1 md:group-hover:hidden"
                  style={{ color: primary }}
                >
                  Read the observation <span aria-hidden>→</span>
                </p>
              )}

              {/* Expanded observation */}
              {isOpen && (
                <p className="text-sm opacity-85 mt-4 leading-relaxed pl-[3.75rem]">
                  {desc?.trim() || fallbackObs}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
