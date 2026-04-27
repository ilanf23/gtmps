// SECTION 03 — Your Core (Observed / Hypothesis / Question)

import OHQ from "./ObservedHypothesisQuestion";
import { MABBLY_GOLD } from "@/lib/mabblyAnchors";

interface Props {
  observed: string | null;
  primary: string;
}

export default function CoreAnalysisSection({ observed, primary }: Props) {
  const hasObserved = Boolean(observed && observed.trim());
  return (
    <section
      id="v10-section-3"
      data-v10-section="3"
      className="py-16 md:py-24 border-b border-black/10"
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="h-px w-6" style={{ backgroundColor: MABBLY_GOLD }} aria-hidden />
        <p
          className="text-[11px] uppercase tracking-[0.3em] font-semibold"
          style={{ color: MABBLY_GOLD }}
        >
          03 · Your Core
        </p>
      </div>
      <h2
        className="font-bold leading-tight text-2xl md:text-3xl mb-6"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        How clearly your purpose lands on the page.
      </h2>

      <OHQ
        observed={
          hasObserved
            ? (observed as string)
            : "We could not identify a clear Core on your site. Most visitors will infer your services but not your point of view."
        }
        hypothesis={
          hasObserved
            ? "If we sharpened the language by one degree — naming who you serve and what you refuse — your inbound qualifies itself before the first call."
            : "A 1-paragraph Core statement (purpose · niche · who you refuse) typically lifts qualified inbound 20–40% within a quarter."
        }
        question="We'd love your feedback. Did we get this right?"
        primary={primary}
      />
    </section>
  );
}
