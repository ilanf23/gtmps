// SECTION 09 — Your highest leverage move (post-CTA deep-dive).

import { MANUSCRIPT_FORMULA } from "@/content/manuscriptQuotes";
import type { FindingProfile } from "@/lib/magnetScoring";
import { MABBLY_GOLD } from "@/lib/mabblyAnchors";

interface Props {
  profile: FindingProfile;
  customerName: string;
  recommendedAction: string | null;
  primary: string;
}

const HEADLINES: Record<FindingProfile, string> = {
  strongCoreWeakProof:
    "Build a 1-page proof library this week. The pipeline you already have closes faster.",
  weakCoreStrongProof:
    "Tighten your Core in one paragraph. Your Proof deserves a clearer doorway.",
  weakDeadZone:
    "Reactivate your Dead Zone with a 7-minute signal. Same play Madcraft ran.",
  allWeak:
    "Run the 90-day RROS sequence. Discover → Prove → Design → Activate → Compound.",
  allStrong:
    "Compound. Lock in the cadence so this runs on its own through 2026.",
  balanced:
    "Pick the layer with the most leverage and run it for 30 days. The rest follows.",
};

export default function HighestLeverageMove({
  profile,
  customerName,
  recommendedAction,
  primary,
}: Props) {
  return (
    <section
      id="v10-section-9"
      data-v10-section="9"
      className="py-10 md:py-12 border-b border-black/10"
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="h-px w-6" style={{ backgroundColor: MABBLY_GOLD }} aria-hidden />
        <p
          className="text-[11px] uppercase tracking-[0.3em] font-semibold"
          style={{ color: MABBLY_GOLD }}
        >
          09 · Your highest leverage move
        </p>
      </div>

      <h2
        className="font-bold leading-tight text-2xl md:text-3xl mb-5 max-w-2xl"
        style={{ fontFamily: "'Source Serif 4', 'IBM Plex Serif', Georgia, serif" }}
      >
        {HEADLINES[profile]}
      </h2>

      <div className="space-y-3 max-w-xl text-sm md:text-base leading-relaxed opacity-85">
        {recommendedAction && <p>{recommendedAction}</p>}
        <p>
          For {customerName}, the leverage is in matching one tightly-defined signal to one
          piece of proof. Expect first responses inside 7 days, qualified pipeline inside 30,
          and a measurable lift inside 90.
        </p>
      </div>

      <figure
        className="mt-8 pt-6 max-w-xl"
        style={{ borderTop: `1px solid ${MABBLY_GOLD}33` }}
      >
        <blockquote
          className="font-serif italic text-lg leading-snug opacity-85"
          style={{ fontFamily: "'Source Serif 4', 'IBM Plex Serif', Georgia, serif" }}
        >
          "{MANUSCRIPT_FORMULA.text}"
        </blockquote>
        <figcaption className="text-[10px] uppercase tracking-[0.25em] mt-3 opacity-50">
          {MANUSCRIPT_FORMULA.attribution}
        </figcaption>
      </figure>
    </section>
  );
}
