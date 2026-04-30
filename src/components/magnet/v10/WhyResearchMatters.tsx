// SECTION 06 — Why this research matters
// Credibility anchor: 30 firms, 500 interviews, Copulsky/Kellogg, verified-only logo strip.

import { MABBLY_GOLD } from "@/lib/mabblyAnchors";

interface Props {
  primary: string;
}

// LOCKED LIST — never mutate, never extend dynamically. Verified cohort firms
// only. Any "fabricated logo" regression that adds Griffith Foods or other
// names traces back to a violation of this contract.
const VERIFIED_CLIENTS = Object.freeze(["Madcraft", "Calliope", "SPR", "AArete"] as const);

export default function WhyResearchMatters({ primary }: Props) {
  return (
    <section
      id="v10-section-6"
      data-v10-section="6"
      className="py-10 md:py-12 border-b border-black/10"
      style={{ backgroundColor: "rgba(28,16,8,0.025)" }}
    >
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
        className="font-bold leading-tight text-2xl md:text-3xl mb-8 max-w-2xl"
        style={{ fontFamily: "'Source Serif 4', 'IBM Plex Serif', Georgia, serif" }}
      >
        30 firms. 500 practitioner interviews. Validated by Copulsky.
      </h2>

      <div className="space-y-5 max-w-xl text-sm md:text-base leading-relaxed opacity-85">
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
      <div className="mt-10 pt-6 border-t border-black/10">
        <p
          className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-4 opacity-60"
          style={{ letterSpacing: "0.25em" }}
        >
          Verified cohort firms
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {VERIFIED_CLIENTS.map((name) => (
            <span
              key={name}
              className="font-display font-bold text-sm"
              style={{ color: "rgba(28,16,8,0.45)", letterSpacing: "-0.01em" }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
