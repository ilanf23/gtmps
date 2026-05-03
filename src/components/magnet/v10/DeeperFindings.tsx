// SECTION 10 - Deeper Findings.
// Three stacked editorial research cards (Signal Analysis / Cadence Read /
// Research Flag) using the same research-card discipline as Sections 03/04.

import { ReactNode, useEffect, useRef, useState } from "react";
import FeedbackDialog from "./FeedbackDialog";
import "./DeeperFindings.css";

interface Props {
  customerName: string;
  primary: string;
  slug?: string;
  signalObserved?: string | null;
  cadenceObserved?: string | null;
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
  signalObserved,
  cadenceObserved,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [feedbackContext, setFeedbackContext] = useState<string | null>(null);

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

  const signalText =
    signalObserved?.trim() ||
    `${customerName}'s site reads as a service catalog more than a signal source. Visitors learn what you do, not when to engage you.`;

  const cadenceText =
    cadenceObserved?.trim() ||
    "Your public cadence (Insights, social, alumni touches) suggests episodic outreach rather than a scheduled rhythm.";

  const cards: CardSpec[] = [
    {
      index: "10A",
      topic: "Signal Analysis",
      observed: (
        <>
          {signalText.includes("service catalog") ? (
            <>
              {signalText.split("service catalog")[0]}
              <strong>service catalog</strong>
              {signalText.split("service catalog")[1]}
            </>
          ) : (
            signalText
          )}
        </>
      ),
      hypothesis: (
        <>
          If we surface <strong>1 to 2 trigger signals</strong> (org change, capability shift, named project), inbound qualifies before the first call.
        </>
      ),
      question: "Which signal would your team find most useful first?",
    },
    {
      index: "10B",
      topic: "Cadence Read",
      observed: (
        <>
          {cadenceText.includes("episodic outreach") ? (
            <>
              {cadenceText.split("episodic outreach")[0]}
              <strong>episodic outreach</strong>
              {cadenceText.split("episodic outreach")[1]}
            </>
          ) : (
            cadenceText
          )}
        </>
      ),
      hypothesis: (
        <>
          A <strong>4-week relationship rhythm</strong> tied to your top 100 contacts typically reactivates <strong>3 to 5 dormant deals</strong> per quarter.
        </>
      ),
      question: "What does your current touch cadence look like?",
    },
    {
      index: "10C",
      topic: "Research Flag",
      observed: (
        <>
          {customerName} has at least one trait that does not fit the median PS firm in the cohort. We'd like to <strong>confirm it on the call</strong> before adding it to the manuscript.
        </>
      ),
      hypothesis: (
        <>
          Outliers often become the <strong>most useful chapters</strong>. Your input here directly shapes how this case is written.
        </>
      ),
      question: "What's the one thing about your firm you wish more people understood?",
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

              <div className="df-feedback-row">
                <button
                  type="button"
                  className="df-feedback-chip"
                  onClick={() => setFeedbackContext(`Section 10 · ${card.topic}`)}
                >
                  <span className="df-pulse" aria-hidden />
                  <span>Did we get this right?</span>
                </button>
                <span className="df-feedback-question">
                  Send us your{" "}
                  <button
                    type="button"
                    className="df-feedback-link"
                    onClick={() => setFeedbackContext(`Section 10 · ${card.topic}`)}
                  >
                    feedback
                  </button>
                  .
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <FeedbackDialog
        open={feedbackContext !== null}
        onOpenChange={(open) => {
          if (!open) setFeedbackContext(null);
        }}
        slug={slug}
        context={feedbackContext ?? undefined}
        primary={primary}
      />
    </section>
  );
}
