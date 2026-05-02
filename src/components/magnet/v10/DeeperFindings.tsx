// SECTION 10 — Deeper Findings (Signal · Cadence · Research Flag).
// Compact OHQ blocks; collapsible on mobile, all open on desktop.

import { useState } from "react";
import OHQ from "./ObservedHypothesisQuestion";
import { MABBLY_GOLD } from "@/lib/mabblyAnchors";

interface Props {
  customerName: string;
  primary: string;
  signalObserved?: string | null;
  cadenceObserved?: string | null;
}

export default function DeeperFindings({
  customerName,
  primary,
  signalObserved,
  cadenceObserved,
}: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const blocks = [
    {
      eyebrow: "Signal Analysis",
      observed:
        signalObserved?.trim() ||
        `${customerName}'s site reads as a service catalog more than a signal source. Visitors learn what you do, not when to engage you.`,
      hypothesis:
        "If we surface 1 to 2 trigger signals (org change, capability shift, named project), inbound qualifies before the first call.",
      question: "Which signal would your team find most useful first?",
    },
    {
      eyebrow: "Cadence Read",
      observed:
        cadenceObserved?.trim() ||
        "Your public cadence (insights, social, alumni touches) suggests episodic outreach rather than a scheduled rhythm.",
      hypothesis:
        "A 4-week relationship rhythm tied to your top 100 contacts typically reactivates 3 to 5 dormant deals per quarter.",
      question: "What does your current touch cadence look like?",
    },
    {
      eyebrow: "Research Flag",
      observed: `${customerName} has at least one trait that does not fit the median PS firm in the cohort. We'd like to confirm it on the call before adding it to the manuscript.`,
      hypothesis:
        "Outliers often become the most useful chapters. Your input here directly shapes how this case is written.",
      question: "What's the one thing about your firm you wish more people understood?",
    },
  ];

  return (
    <section
      id="v10-section-10"
      data-v10-section="10"
      className="py-14 md:py-20 border-y border-black/10 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-6 md:px-10"
      style={{ backgroundColor: "#F7F1E6" }}
    >
      <div className="max-w-[806px] mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <span className="h-px w-6" style={{ backgroundColor: MABBLY_GOLD }} aria-hidden />
        <p
          className="text-[11px] uppercase tracking-[0.3em] font-semibold"
          style={{ color: MABBLY_GOLD }}
        >
          10 · Deeper findings
        </p>
      </div>
      <h2
        className="font-bold leading-tight text-2xl md:text-3xl mb-6"
        style={{ fontFamily: "'Source Serif 4', 'IBM Plex Serif', Georgia, serif" }}
      >
        Three more reads we'd like your feedback on.
      </h2>

      <div className="space-y-3 md:space-y-6">
        {blocks.map((b, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={b.eyebrow} className="border border-black/10 bg-[#EDF5EC] text-[#0F1E1D]">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left md:cursor-default"
              >
                <span
                  className="text-[11px] uppercase tracking-[0.25em] font-semibold"
                  style={{ color: MABBLY_GOLD }}
                >
                  {b.eyebrow}
                </span>
                <span className="md:hidden text-xs opacity-50" aria-hidden>
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              <div className={(isOpen ? "block" : "hidden md:block") + " p-4 md:p-5 pt-0"}>
                <OHQ
                  observed={b.observed}
                  hypothesis={b.hypothesis}
                  question={b.question}
                  primary={primary}
                />
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
