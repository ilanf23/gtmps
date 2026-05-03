// SECTION 04 — Your Proof (Observed / Hypothesis / Question)

import { useState } from "react";
import ResearchCard from "./ResearchCard";
import FeedbackDialog from "./FeedbackDialog";

interface Props {
  observed: string | null;
  primary: string;
  slug?: string;
  compact?: boolean;
}

export default function ProofAnalysisSection({ observed, primary, slug, compact }: Props) {
  const hasObserved = Boolean(observed && observed.trim());
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const observedText = hasObserved
    ? (observed as string)
    : "We could not surface named proof on your site. That makes your last 3 wins invisible to the next prospect.";

  const hypothesis = hasObserved ? (
    <>
      The proof is real. The library isn't built. A <strong>7-day proof sprint</strong> typically converts dormant pipeline like Madcraft did. <strong>$400K dormant proposal</strong> reactivated in 7 minutes.
    </>
  ) : (
    <>
      A <strong>7-day proof library</strong> (3 wins, 1 page each) is the minimum. Madcraft reactivated a <strong>$400K dormant proposal</strong> in 7 minutes after building theirs.
    </>
  );

  return (
    <>
      <ResearchCard
        number="04"
        metaLabel="Your Proof"
        headline={
          <>
            What proof you already own. And what's <em>missing</em>
          </>
        }
        observed={observedText}
        hypothesis={hypothesis}
        question="Which client result do your prospects cite most often when they decide to work with you?"
        onFeedbackClick={() => setFeedbackOpen(true)}
        compact={compact}
      />
      <FeedbackDialog
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        slug={slug}
        context="Section 4 · Your Proof"
        primary={primary}
      />
    </>
  );
}
