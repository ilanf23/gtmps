// SECTION 06 — Why this research matters
// Credibility anchor: 30 firms, 500 interviews, Copulsky/Kellogg, verified-only logo strip.

import { MABBLY_GOLD, MABBLY_DARK } from "@/lib/mabblyAnchors";
import TopographicBackground from "@/components/discover/TopographicBackground";

interface Props {
  primary: string;
}

// LOCKED LIST — never mutate, never extend dynamically. Verified cohort firms
// only. Any "fabricated logo" regression that adds Griffith Foods or other
// names traces back to a violation of this contract.
const VERIFIED_CLIENTS = Object.freeze(["Madcraft", "Calliope", "SPR", "AArete"] as const);

const STATS = [
  { value: "30", label: "PS Firms" },
  { value: "500", label: "Interviews" },
  { value: "26", label: "Years" },
] as const;

export default function WhyResearchMatters({ primary }: Props) {
  void primary;
  return (
    <section
      id="v10-section-6"
      data-v10-section="6"
      className="py-14 md:py-20 border-y border-white/5 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-6 md:px-10 overflow-hidden"
      style={{ backgroundColor: MABBLY_DARK, color: "#FBF8F4" }}
    >
      {/* Imagery layers (behind content) */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Soft gold spotlight, upper-right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 85% 0%, rgba(184,147,58,0.22), transparent 60%)",
          }}
        />
        {/* Topographic contour map */}
        <TopographicBackground opacity={0.06} />
        {/* Film grain */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
        {/* Bottom fade for depth */}
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
          }}
        />
      </div>

      <div className="max-w-[806px] mx-auto relative">
        <div className="flex items-center gap-2 mb-5">
          <span className="h-px w-6" style={{ backgroundColor: MABBLY_GOLD }} aria-hidden />
          <p
            className="text-[11px] uppercase tracking-[0.3em] font-semibold"
            style={{ color: MABBLY_GOLD }}
          >
            06 · Why this research matters
          </p>
        </div>
        <h2
          className="font-bold leading-tight text-2xl md:text-3xl mb-10 max-w-[806px]"
          style={{
            fontFamily: "'Source Serif 4', 'IBM Plex Serif', Georgia, serif",
            color: "#FBF8F4",
          }}
        >
          30 firms. 500 practitioner interviews. Validated by Copulsky.
        </h2>

        {/* Editorial stat tiles */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mb-10 pb-10 border-b border-white/10">
          {STATS.map((s) => (
            <div key={s.label} className="text-left">
              <div
                className="text-5xl md:text-6xl font-bold leading-none mb-2"
                style={{
                  fontFamily: "'Source Serif 4', 'IBM Plex Serif', Georgia, serif",
                  color: MABBLY_GOLD,
                }}
              >
                {s.value}
              </div>
              <div
                className="text-[10px] md:text-[11px] uppercase font-semibold"
                style={{ letterSpacing: "0.25em", color: "rgba(251,248,244,0.6)" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div
          className="space-y-5 max-w-xl text-sm md:text-base leading-relaxed"
          style={{ color: "rgba(251,248,244,0.78)" }}
        >
          <p>
            30 PS firms in the cohort. Including AArete and SPR. Validated by Jonathan Copulsky, Former CMO Deloitte and Senior Lecturer Northwestern Kellogg. He wrote the foreword.
          </p>
          <p>
            500 practitioner interviews. 26 years of PS firm leadership. Richard Ashbaugh scaled A.T. Kearney from $250M to $1.2B as CMO. The methodology is real. Validated. Documented.
          </p>
          <p>
            Your firm contributing your data sharpens the framework. The book launches Q3 2026.
            You are part of how it gets there.
          </p>
        </div>

        {/* Verified-only logo strip */}
        <div className="mt-10 pt-6 border-t border-white/10">
          <p
            className="text-[10px] uppercase font-semibold mb-4"
            style={{ letterSpacing: "0.25em", color: "rgba(251,248,244,0.5)" }}
          >
            Verified cohort firms
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {VERIFIED_CLIENTS.map((name) => (
              <span
                key={name}
                className="font-display font-bold text-sm"
                style={{ color: "rgba(251,248,244,0.75)", letterSpacing: "-0.01em" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
