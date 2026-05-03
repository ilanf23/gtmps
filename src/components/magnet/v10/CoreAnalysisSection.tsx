// SECTION 03 - Your Core (Observed / Hypothesis / Question)

import { useState } from "react";
import ResearchCard from "./ResearchCard";
import FeedbackDialog from "./FeedbackDialog";

interface Props {
  observed: string | null;
  primary: string;
  slug?: string;
  compact?: boolean;
  hideFeedback?: boolean;
  onFeedbackClick?: () => void;
}

export default function CoreAnalysisSection({ observed, primary, slug, compact, hideFeedback, onFeedbackClick }: Props) {
  const hasObserved = Boolean(observed && observed.trim());
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const observedText = hasObserved
    ? (observed as string)
    : "We could not identify a clear Core on your site. Most visitors will infer your services but not your point of view.";

  const hypothesis = hasObserved ? (
    <>
      If we sharpened the language by <strong>one degree</strong>, naming who you serve and what you refuse, your inbound qualifies itself before the first call.
    </>
  ) : (
    <>
      A <strong>1-paragraph Core statement</strong> (purpose · niche · who you refuse) typically lifts qualified inbound 20 to 40% within a quarter.
    </>
  );

  return (
    <>
      <ResearchCard
        number="03"
        metaLabel="Your Core"
        headline={<>How clearly your purpose lands on the page</>}
        observed={observedText}
        hypothesis={hypothesis}
        question="How do your best clients describe what you do, in their own words, when they refer you?"
        onFeedbackClick={onFeedbackClick ?? (() => setFeedbackOpen(true))}
        compact={compact}
        hideFeedback={hideFeedback}
      />
      {!hideFeedback && (
        <FeedbackDialog
          open={feedbackOpen}
          onOpenChange={setFeedbackOpen}
          slug={slug}
          context="Section 3 · Your Core"
          primary={primary}
        />
      )}
    </>
  );
}
