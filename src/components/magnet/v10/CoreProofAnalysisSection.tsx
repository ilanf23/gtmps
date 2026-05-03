// SECTIONS 03 + 04 - Your Core / Your Proof rendered side-by-side in one
// full-bleed cream section. Each card stacks its 3 boxes vertically.
// A single shared "Did we get this right?" feedback chip sits centered below
// the pair so the two cards share one unified, centered call-to-feedback.

import { useState } from "react";
import CoreAnalysisSection from "./CoreAnalysisSection";
import ProofAnalysisSection from "./ProofAnalysisSection";
import FeedbackDialog from "./FeedbackDialog";
import "./ResearchCard.css";

interface Props {
  observedCore: string | null;
  observedProof: string | null;
  primary: string;
  slug?: string;
}

export default function CoreProofAnalysisSection({
  observedCore,
  observedProof,
  primary,
  slug,
}: Props) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const openFeedback = () => setFeedbackOpen(true);

  return (
    <section className="rc-pair-section rc-scope">
      <div className="rc-pair-container">
        <div className="rc-pair-grid">
          <CoreAnalysisSection
            observed={observedCore}
            primary={primary}
            slug={slug}
            compact
            hideFeedback
            onFeedbackClick={openFeedback}
          />
          <ProofAnalysisSection
            observed={observedProof}
            primary={primary}
            slug={slug}
            compact
            hideFeedback
            onFeedbackClick={openFeedback}
          />
        </div>

        <div className="rc-feedback-row rc-pair-feedback">
          <button
            type="button"
            className="rc-feedback-chip"
            onClick={openFeedback}
          >
            <span className="rc-pulse" aria-hidden />
            <span>Did we get this right?</span>
          </button>
          <span className="rc-feedback-question">
            Send us your{" "}
            <button
              type="button"
              className="rc-feedback-link"
              onClick={openFeedback}
            >
              feedback
            </button>
            .
          </span>
        </div>
      </div>

      <FeedbackDialog
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        slug={slug}
        context="Sections 3 & 4 · Your Core & Proof"
        primary={primary}
      />
    </section>
  );
}
