// SECTION 10 - Deeper Findings.
// Three stacked editorial research cards (Signal Analysis / Cadence Read /
// Research Flag) using the same research-card discipline as Sections 03/04.

import { ReactNode, useEffect, useRef } from "react";
import "./DeeperFindings.css";

interface CardContent {
  observed?: string | null;
  hypothesis?: string | null;
  question?: string | null;
}

interface DeeperFindingsContent {
  "10A"?: CardContent | null;
  "10B"?: CardContent | null;
  "10C"?: CardContent | null;
}

interface Props {
  customerName: string;
  primary: string;
  slug?: string;
  deeperFindings?: DeeperFindingsContent | null;
}

interface CardSpec {
  index: "10A" | "10B" | "10C";
  topic: string;
  observed: ReactNode;
  hypothesis: ReactNode;
  question: string;
}

export default function DeeperFindings({
  customerName,
  primary,
  slug,
  deeperFindings,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Per-card LLM content (already dash-stripped by MagnetBreakdown's sanitizeLLM).
  const card10A = deeperFindings?.["10A"] ?? null;
  const card10B = deeperFindings?.["10B"] ?? null;
  const card10C = deeperFindings?.["10C"] ?? null;

  // 10A fallbacks. Hardcoded copy keeps substring bolding ("service catalog");
  // LLM copy renders flat, since arbitrary substrings would not match.
  const observed10A: ReactNode = card10A?.observed
    ? card10A.observed
    : (
        <>
          {`${customerName}'s site reads as a `}
          <strong>service catalog</strong>
          {` more than a signal source. Visitors learn what you do, not when to engage you.`}
        </>
      );
  const hypothesis10A: ReactNode = card10A?.hypothesis ?? (
    <>
      If we surface <strong>1 to 2 trigger signals</strong> (org change, capability shift, named project), inbound qualifies before the first call.
    </>
  );
  const question10A: string =
    card10A?.question?.trim() ||
    "Which signal would your team find most useful first?";

  // 10B fallbacks.
  const observed10B: ReactNode = card10B?.observed
    ? card10B.observed
    : (
        <>
          Your public cadence (Insights, social, alumni touches) suggests <strong>episodic outreach</strong> rather than a scheduled rhythm.
        </>
      );
  const hypothesis10B: ReactNode = card10B?.hypothesis ?? (
    <>
      A <strong>4-week relationship rhythm</strong> tied to your top 100 contacts typically reactivates <strong>3 to 5 dormant deals</strong> per quarter.
    </>
  );
  const question10B: string =
    card10B?.question?.trim() ||
    "What does your current touch cadence look like?";

  // 10C fallbacks.
  const observed10C: ReactNode = card10C?.observed
    ? card10C.observed
    : (
        <>
          {customerName} has at least one trait that does not fit the median PS firm in the cohort. We'd like to <strong>confirm it on the call</strong> before adding it to the manuscript.
        </>
      );
  const hypothesis10C: ReactNode = card10C?.hypothesis ?? (
    <>
      Outliers often become the <strong>most useful chapters</strong>. Your input here directly shapes how this case is written.
    </>
  );
  const question10C: string =
    card10C?.question?.trim() ||
    "What's the one thing about your firm you wish more people understood?";

  const cards: CardSpec[] = [
    {
      index: "10A",
      topic: "Signal Analysis",
      observed: observed10A,
      hypothesis: hypothesis10A,
      question: question10A,
    },
    {
      index: "10B",
      topic: "Cadence Read",
      observed: observed10B,
      hypothesis: hypothesis10B,
      question: question10B,
    },
    {
      index: "10C",
      topic: "Research Flag",
      observed: observed10C,
      hypothesis: hypothesis10C,
      question: question10C,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="v10-section-10"
      data-v10-section="10"
      className="df-section df-scope"
    >
      <div className="df-container">
        <header className="df-section-head">
          <div className="df-meta-row">
            <span className="df-rule" aria-hidden />
            <span className="df-meta-tag">
              <span className="df-num">10</span>
              <span className="df-pip">·</span>Deeper Findings
            </span>
            <span className="df-rule" aria-hidden />
          </div>
          <h2 className="df-headline">
            <span className="df-word-mask"><span className="df-word-inner">Three&nbsp;</span></span>
            <span className="df-word-mask"><span className="df-word-inner">more&nbsp;</span></span>
            <span className="df-word-mask"><span className="df-word-inner">reads&nbsp;</span></span>
            <span className="df-word-mask"><span className="df-word-inner">we'd&nbsp;</span></span>
            <span className="df-word-mask"><span className="df-word-inner">like&nbsp;</span></span>
            <span className="df-word-mask"><span className="df-word-inner">your&nbsp;</span></span>
            <span className="df-word-mask"><span className="df-word-inner">feedback<span className="df-period">.</span></span></span>
          </h2>
          <p className="df-section-sub df-reveal df-d2">
            Three editorial reads pulled from the cohort. Tell us what lands &mdash; and what doesn't.
          </p>
        </header>

        <div className="df-stack">
          {cards.map((card, i) => (
            <article
              key={card.index}
              className={`df-card-wrap df-reveal df-d${i + 3}`}
            >
              <span className="df-tick-tr" aria-hidden />
              <span className="df-tick-bl" aria-hidden />
              <span className="df-eyebrow">
                <span className="df-eyebrow-num">Card {card.index}</span>
                <span className="df-pip">·</span>
                <span className="df-eyebrow-topic">{card.topic}</span>
              </span>

              <div className="df-card">
                <div className="df-cols">
                  <span className="df-div-mark df-tl" aria-hidden />
                  <span className="df-div-mark df-tr" aria-hidden />
                  <span className="df-div-mark df-bl" aria-hidden />
                  <span className="df-div-mark df-br" aria-hidden />

                  <div className="df-col df-col-1">
                    <div className="df-col-num-row">
                      <span className="df-col-num">01</span>
                      <span className="df-col-label">Observed</span>
                    </div>
                    <div className="df-col-content"><p>{card.observed}</p></div>
                  </div>

                  <div className="df-col df-col-2">
                    <div className="df-col-num-row">
                      <span className="df-col-num">02</span>
                      <span className="df-col-label">Hypothesis</span>
                    </div>
                    <div className="df-col-content"><p>{card.hypothesis}</p></div>
                  </div>

                  <div className="df-col df-col-3">
                    <div className="df-col-num-row">
                      <span className="df-col-num">03</span>
                      <span className="df-col-label">Question</span>
                    </div>
                    <div className="df-col-content"><p>{card.question}</p></div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
