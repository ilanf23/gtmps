// Shared 3-panel block used by Sections 3 (Core), 4 (Proof), and 10 (Deeper Findings).
// Renders Observed / Hypothesis / Question columns (equal-width on desktop,
// stacked on mobile). Columns whose text exceeds ~10 lines auto-collapse with
// a "Show more" toggle so the boxes don't dominate the page.

import { useEffect, useRef, useState } from "react";

const MAGENTA = "#C2185B";
const LINE_LIMIT = 10;

interface Props {
  observed: string;
  hypothesis: string;
  question?: string;
  primary: string;
  /** When provided, renders the "We would love your feedback" line as a button
   *  that opens an in-page dialog instead of navigating to /feedback. */
  onFeedbackClick?: () => void;
}

interface CollapsibleProps {
  text: string;
  className?: string;
  toggleColor: string;
}

function CollapsibleText({ text, className = "", toggleColor }: CollapsibleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const style = window.getComputedStyle(el);
      const lh = parseFloat(style.lineHeight);
      if (!lh || Number.isNaN(lh)) return;
      const maxH = lh * LINE_LIMIT + 1;
      setOverflowing(el.scrollHeight > maxH);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  const clampStyle: React.CSSProperties =
    overflowing && !expanded
      ? {
          display: "-webkit-box",
          WebkitLineClamp: LINE_LIMIT,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }
      : {};

  return (
    <>
      <div ref={ref} className={className} style={clampStyle}>
        {text}
      </div>
      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-[12px] uppercase tracking-[0.12em] font-semibold hover:opacity-80"
          style={{ color: toggleColor }}
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </>
  );
}

export default function ObservedHypothesisQuestion({
  observed,
  hypothesis,
  question,
  primary,
  onFeedbackClick,
}: Props) {
  const hasQuestion = Boolean(question && question.trim());
  const gridCols = hasQuestion ? "md:grid-cols-3" : "md:grid-cols-2";

  return (
    <div>
      <div className={`grid grid-cols-1 ${gridCols} gap-px bg-black/10 border border-black/10`}>
        <div className="bg-[#FBF8F4] text-[#1C1008] p-5">
          <p
            className="text-[12px] md:text-[13px] uppercase tracking-[0.12em] font-medium mb-2"
            style={{ color: primary }}
          >
            Observed
          </p>
          <CollapsibleText
            text={observed}
            className="text-base leading-relaxed opacity-85"
            toggleColor={primary}
          />
        </div>
        <div className="bg-[#FBF8F4] text-[#1C1008] p-5 relative">
          <span
            className="absolute left-0 top-0 bottom-0 w-[2px]"
            style={{ backgroundColor: primary }}
            aria-hidden
          />
          <p
            className="text-[12px] md:text-[13px] uppercase tracking-[0.12em] font-medium mb-2 pl-2"
            style={{ color: primary }}
          >
            Hypothesis
          </p>
          <div className="pl-2">
            <CollapsibleText
              text={hypothesis}
              className="text-base leading-relaxed"
              toggleColor={primary}
            />
          </div>
        </div>
        {hasQuestion && (
          <div className="bg-[#FBF8F4] text-[#1C1008] p-5 relative">
            <span
              className="absolute left-0 top-0 bottom-0 w-[2px]"
              style={{ backgroundColor: MAGENTA }}
              aria-hidden
            />
            <p
              className="text-[12px] md:text-[13px] uppercase tracking-[0.12em] font-medium mb-2 pl-2"
              style={{ color: MAGENTA }}
            >
              Question
            </p>
            <div className="pl-2">
              <CollapsibleText
                text={question!}
                className="text-base italic leading-relaxed"
                toggleColor={MAGENTA}
              />
            </div>
          </div>
        )}
      </div>
      {feedbackHref && (
        <p className="text-sm md:text-[14px] italic opacity-65 mt-4 leading-relaxed">
          We would love your{" "}
          <a
            href={feedbackHref}
            className="underline underline-offset-2 hover:opacity-100"
          >
            feedback
          </a>
          . Did we get this right?
        </p>
      )}
    </div>
  );
}
