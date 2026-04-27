// SECTION 10 — Deeper Findings (Signal · Cadence · Research Flag).
// Compact OHQ blocks; collapsible on mobile, all open on desktop.

import { useState } from "react";
import OHQ from "./ObservedHypothesisQuestion";

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
        "If we surface 1–2 trigger signals (org change, capability shift, named project), inbound qualifies before the first call.",
      question: "Which signal would your team find most useful first?",
    },
    {
      eyebrow: "Cadence Read",
      observed:
        cadenceObserved?.trim() ||
        "Your public cadence (insights, social, alumni touches) suggests episodic outreach rather than a scheduled rhythm.",
      hypothesis:
        "A 4-week relationship rhythm tied to your top 100 contacts typically reactivates 3–5 dormant deals per quarter.",
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
      className="py-16 md:py-24 border-b border-black/10"
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="h-px w-6" style={{ backgroundColor: primary }} aria-hidden />
        <p
          className="text-[11px] uppercase tracking-[0.3em] font-semibold"
          style={{ color: primary }}
        >
          10 · Deeper findings
        </p>
      </div>
      <h2
        className="font-bold leading-tight text-2xl md:text-3xl mb-6"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        Three more reads we'd like your feedback on.
      </h2>

      <div className="space-y-3 md:space-y-6">
        {blocks.map((b, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={b.eyebrow} className="border border-black/10 bg-[#FBF8F4]">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left md:cursor-default"
              >
                <span
                  className="text-[11px] uppercase tracking-[0.25em] font-semibold"
                  style={{ color: primary }}
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
    </section>
  );
}
