// Editorial research-card used by Sections 03 (Your Core) and 04 (Your Proof).
// 3 columns: OBSERVED / HYPOTHESIS / QUESTION. Brand-aligned tokens, corner ticks,
// dashed dividers with intersection markers, eyebrow on edge, Show More on column 1,
// feedback footer chip with continuous care-orange pulse. No magenta.

import { ReactNode, useEffect, useRef, useState } from "react";
import "./ResearchCard.css";

interface Props {
  number: "03" | "04";
  metaLabel: string;
  headline: ReactNode;
  observed: string;
  hypothesis: ReactNode;
  question: string;
  onFeedbackClick?: () => void;
  compact?: boolean;
}

export default function ResearchCard({
  number,
  metaLabel,
  headline,
  observed,
  hypothesis,
  question,
  onFeedbackClick,
  compact = false,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);

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
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={`v10-section-${number === "03" ? "3" : "4"}`}
      data-v10-section={number === "03" ? "3" : "4"}
      className={`rc-section rc-scope${compact ? " rc-compact" : ""}`}
    >
      <div className="rc-container">
        <header className="rc-section-head">
          <div className="rc-meta-row">
            <span className="rc-rule" aria-hidden />
            <span className="rc-meta-tag">
              <span className="rc-num">{number}</span>
              <span className="rc-pip">·</span>
              {metaLabel}
            </span>
            <span className="rc-rule" aria-hidden />
          </div>
          <h2 className="rc-headline rc-reveal rc-d1">
            {headline}
            <span className="rc-period">.</span>
          </h2>
        </header>

        <div className="rc-card-wrap rc-reveal rc-d2">
          <span className="rc-tick-tr" aria-hidden />
          <span className="rc-tick-bl" aria-hidden />
          <span className="rc-eyebrow">
            <span className="rc-eyebrow-num">Card {number}</span>
            <span className="rc-pip">·</span>
            <span>Research Findings</span>
          </span>

          <div className="rc-card">
            <div className="rc-cols">
              <span className="rc-div-mark rc-tl" aria-hidden />
              <span className="rc-div-mark rc-tr" aria-hidden />
              <span className="rc-div-mark rc-bl" aria-hidden />
              <span className="rc-div-mark rc-br" aria-hidden />

              {/* OBSERVED */}
              <div className="rc-col rc-col-1 rc-reveal rc-d3">
                <div className="rc-col-num-row">
                  <span className="rc-col-num">01</span>
                  <span className="rc-col-label">Observed</span>
                </div>
                <div className="rc-col-content">
                  <div className={`rc-clip ${expanded ? "rc-expanded" : ""}`}>
                    <p>{observed}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className={`rc-show-more ${expanded ? "rc-expanded" : ""}`}
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                >
                  {expanded ? "Show less " : "Show more "}
                  <span className="rc-arrow" aria-hidden>→</span>
                </button>
              </div>

              {/* HYPOTHESIS */}
              <div className="rc-col rc-col-2 rc-reveal rc-d4">
                <div className="rc-col-num-row">
                  <span className="rc-col-num">02</span>
                  <span className="rc-col-label">Hypothesis</span>
                </div>
                <div className="rc-col-content">
                  <p>{hypothesis}</p>
                </div>
              </div>

              {/* QUESTION */}
              <div className="rc-col rc-col-3 rc-reveal rc-d5">
                <div className="rc-col-num-row">
                  <span className="rc-col-num">03</span>
                  <span className="rc-col-label">Question</span>
                </div>
                <div className="rc-col-content">
                  <p>{question}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rc-feedback-row rc-reveal rc-d6">
            <button
              type="button"
              className="rc-feedback-chip"
              onClick={onFeedbackClick}
            >
              <span className="rc-pulse" aria-hidden />
              <span>Did we get this right?</span>
            </button>
            <span className="rc-feedback-question">
              Send us your{" "}
              <button
                type="button"
                className="rc-feedback-link"
                onClick={onFeedbackClick}
              >
                feedback
              </button>
              .
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
