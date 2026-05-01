// SECTION 04 — Your Proof (Observed / Hypothesis / Question)

import OHQ from "./ObservedHypothesisQuestion";
import { MABBLY_GOLD } from "@/lib/mabblyAnchors";

interface Props {
  observed: string | null;
  primary: string;
  slug?: string;
}

export default function ProofAnalysisSection({ observed, primary, slug }: Props) {
  const hasObserved = Boolean(observed && observed.trim());
  return (
    <section
      id="v10-section-4"
      data-v10-section="4"
      className="py-10 md:py-12 border-b border-black/10 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-6 md:px-10"
      style={{ backgroundColor: "#F7F1E6" }}
    >
      <div className="max-w-[806px] mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <span className="h-px w-6" style={{ backgroundColor: MABBLY_GOLD }} aria-hidden />
        <p
          className="text-[11px] uppercase tracking-[0.3em] font-semibold"
          style={{ color: MABBLY_GOLD }}
        >
          04 · Your Proof
        </p>
      </div>
      <h2
        className="font-bold leading-tight text-2xl md:text-3xl mb-6"
        style={{ fontFamily: "'Source Serif 4', 'IBM Plex Serif', Georgia, serif" }}
      >
        What proof you already own. And what's missing.
      </h2>

      <OHQ
        observed={
          hasObserved
            ? (observed as string)
            : "We could not surface named proof on your site. That makes your last 3 wins invisible to the next prospect."
        }
        hypothesis={
          hasObserved
            ? "The proof is real. The library isn't built. A 7-day proof sprint typically converts dormant pipeline like Madcraft did. $400K dormant proposal reactivated in 7 minutes."
            : "A 7-day proof library (3 wins, 1 page each) is the minimum. Madcraft reactivated a $400K dormant proposal in 7 minutes after building theirs."
        }
        question="Which client result do your prospects cite most often when they decide to work with you?"
        primary={primary}
        feedbackHref={slug ? `/m/${slug}/feedback` : undefined}
      />
      </div>
    </section>
  );
}
