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

// Band-relative tokens: every color is now driven off `--brand-accent`,
// so the orbit visualization re-skins to the prospect's brand. Intensity
// (opacity / label) still signals high vs mid vs low.
const BAND_TOKENS: Record<
  ScoreBand,
  { fg: string; meter: string; bg: string; border: string; label: string }
> = {
  high: {
    fg: "var(--brand-accent, #2E7D32)",
    meter: "var(--brand-accent, #2E7D32)",
    bg: "color-mix(in srgb, var(--brand-accent, #2E7D32) 12%, transparent)",
    border: "color-mix(in srgb, var(--brand-accent, #2E7D32) 55%, transparent)",
    label: "Strong",
  },
  mid: {
    fg: "var(--brand-accent, #B8933A)",
    meter: "var(--brand-accent, #B8933A)",
    bg: "color-mix(in srgb, var(--brand-accent, #B8933A) 8%, transparent)",
    border: "color-mix(in srgb, var(--brand-accent, #B8933A) 40%, transparent)",
    label: "Mixed",
  },
  low: {
    fg: "var(--brand-accent, #B43C32)",
    meter: "var(--brand-accent, #B43C32)",
    bg: "color-mix(in srgb, var(--brand-accent, #B43C32) 5%, transparent)",
    border: "color-mix(in srgb, var(--brand-accent, #B43C32) 25%, transparent)",
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
      className="py-10 md:py-12 border-b border-black/10"
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
                {/* Left: numbered circle (uses --brand-bg as the dark badge color) */}
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full border flex items-center justify-center font-semibold text-sm tabular-nums self-center"
                  style={{
                    color: `var(--brand-bg-fg, #fff)`,
                    borderColor: tokens.border,
                    backgroundColor: `var(--brand-bg, ${tokens.fg})`,
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
