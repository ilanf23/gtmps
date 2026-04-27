// SECTION 01 — Personalized Header
// Eyebrow + score-adaptive subheader + manuscript opening pull quote.

import { headerSubheaderFor, type ScoreBand } from "@/lib/magnetScoring";
import { MANUSCRIPT_OPENING } from "@/content/manuscriptQuotes";

interface Props {
  firmName: string;
  buildSecondsAgo: number | null;
  cohortNumber: number;
  cohortLabel: string; // "firm" or "law firm"
  bandOverall: ScoreBand;
  primary: string;
}

export default function PersonalizedHeader({
  firmName,
  buildSecondsAgo,
  cohortNumber,
  cohortLabel,
  bandOverall,
  primary,
}: Props) {
  const ageSentence =
    buildSecondsAgo === null
      ? `You are ${cohortLabel} #${cohortNumber} of 30 in our research cohort.`
      : `Built ${buildSecondsAgo} seconds ago · You are ${cohortLabel} #${cohortNumber} of 30 in our research cohort.`;

  return (
    <section
      id="v10-section-1"
      data-v10-section="1"
      className="pt-14 md:pt-20 pb-16 md:pb-24 border-b border-black/10"
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="h-px w-6" style={{ backgroundColor: primary }} aria-hidden />
        <p
          className="text-[11px] uppercase tracking-[0.3em] font-semibold"
          style={{ color: primary }}
        >
          01 · Your Research Profile
        </p>
      </div>

      <h1
        className="font-bold leading-[1.1] tracking-tight text-3xl md:text-5xl mb-4"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        Your Revenue Map for{" "}
        <span style={{ color: primary }}>{firmName}</span>
      </h1>

      <p className="text-sm md:text-base opacity-60 mb-3">{ageSentence}</p>

      <p className="text-base md:text-lg font-medium leading-snug max-w-xl">
        {headerSubheaderFor(bandOverall)}
      </p>

      <figure
        className="mt-10 pt-6 border-t border-black/10 max-w-xl"
      >
        <blockquote
          className="font-serif italic text-lg md:text-xl leading-snug opacity-85"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          "{MANUSCRIPT_OPENING.text}"
        </blockquote>
        <figcaption className="text-[10px] uppercase tracking-[0.25em] mt-3 opacity-50">
          — {MANUSCRIPT_OPENING.attribution}
        </figcaption>
      </figure>
    </section>
  );
}
