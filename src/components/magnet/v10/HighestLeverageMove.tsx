// SECTION 09 - The Formula. Signal + Proof + Context = Response.
// Universal Mabbly IP from Chapter 3 of the manuscript. Not personalized
// per client by design (the formula is universal); upstream sections carry
// the client name. Visuals are spec-locked, see HighestLeverageMove.css.

import type { FindingProfile } from "@/lib/magnetScoring";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import "./HighestLeverageMove.css";

interface Props {
  profile?: FindingProfile;
  customerName?: string;
  recommendedAction?: string | null;
  primary?: string;
}

export default function HighestLeverageMove(_props: Props) {
  return (
    <section
      id="v10-section-9"
      data-v10-section="9"
      className="hlm-09"
      aria-labelledby="hlm-09-headline"
    >
      <div className="hlm-inner">
        <p className="hlm-eyebrow">
          <span className="hlm-eyebrow-rule" aria-hidden />
          <span className="hlm-eyebrow-text">09 · Your Highest Leverage Move</span>
        </p>

        <h2 id="hlm-09-headline" className="hlm-headline">
          Reactivate Your{' '}
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className="hlm-term"
                tabIndex={0}
                aria-label="Dead Zone, dormant relationships where trust still exists but no system reactivates them"
              >
                Dead Zone
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={12} className="rr-tooltip">
              <span className="rr-tooltip-eyebrow">Dead Zone</span>
              <span className="rr-tooltip-body">
                Dormant relationships where trust still exists but no system reactivates them — past clients, lapsed prospects, stalled proposals. Typically the highest-ROI orbit.
              </span>
            </TooltipContent>
          </Tooltip>
          {' '}in <span className="accent">7 Minutes</span>.
        </h2>

        <p className="hlm-lede">
          Pull three recent project completions. Match each to a single piece of proof.{" "}
          <strong>
            Madcraft ran this exact play and pulled $400K from a 10 month dormant proposal.
          </strong>
        </p>

        <div className="hlm-formula" role="group" aria-label="The Formula: Signal plus Proof plus Context equals Response">
          <div className="operand operand--signal">
            <div className="operand-meta">
              <span className="operand-num">01</span>
              <svg
                className="operand-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                aria-hidden
              >
                <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
                <path d="M8 12 a 4 4 0 0 1 8 0" />
                <path d="M5 12 a 7 7 0 0 1 14 0" />
              </svg>
            </div>
            <span className="operand-label">Signal</span>
            <span className="operand-rule" aria-hidden />
            <p className="operand-desc">A trigger event at their firm</p>
          </div>

          <span className="operator operator--plus operator--1" aria-hidden>+</span>

          <div className="operand operand--proof">
            <div className="operand-meta">
              <span className="operand-num">02</span>
              <svg
                className="operand-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12.5 L11 15.5 L16.5 9.5" />
              </svg>
            </div>
            <span className="operand-label">Proof</span>
            <span className="operand-rule" aria-hidden />
            <p className="operand-desc">Your case study, mapped to it</p>
          </div>

          <span className="operator operator--plus operator--2" aria-hidden>+</span>

          <div className="operand operand--context">
            <div className="operand-meta">
              <span className="operand-num">03</span>
              <svg
                className="operand-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7 V 12 L 15.5 14.5" />
              </svg>
            </div>
            <span className="operand-label">Context</span>
            <span className="operand-rule" aria-hidden />
            <p className="operand-desc">Why now, why this firm</p>
          </div>

          <span className="operator operator--equals operator--3" aria-hidden>=</span>

          <div className="operand operand--response">
            <div className="operand-meta">
              <span className="operand-num">04</span>
              <svg
                className="operand-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M21 15 a 2 2 0 0 1 -2 2 H 7 L 3 21 V 5 a 2 2 0 0 1 2 -2 H 19 a 2 2 0 0 1 2 2 Z" />
              </svg>
            </div>
            <span className="operand-label">Response</span>
            <span className="operand-rule" aria-hidden />
            <p className="operand-desc">Reply, not unsubscribe</p>
          </div>
        </div>

        <div className="hlm-timeline">
          <div className="hlm-timeline-item">
            <span className="hlm-timeline-num">7</span>
            <span className="hlm-timeline-unit">Days</span>
            <span className="hlm-timeline-label">First responses</span>
          </div>
          <span className="hlm-timeline-divider" aria-hidden />
          <div className="hlm-timeline-item">
            <span className="hlm-timeline-num">30</span>
            <span className="hlm-timeline-unit">Days</span>
            <span className="hlm-timeline-label">Qualified pipeline</span>
          </div>
          <span className="hlm-timeline-divider" aria-hidden />
          <div className="hlm-timeline-item">
            <span className="hlm-timeline-num">90</span>
            <span className="hlm-timeline-unit">Days</span>
            <span className="hlm-timeline-label">Measurable lift</span>
          </div>
        </div>

      </div>
    </section>
  );
}
