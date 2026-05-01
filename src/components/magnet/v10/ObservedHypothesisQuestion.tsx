// Shared 3-panel block used by Sections 3 (Core), 4 (Proof), and 10 (Deeper Findings).
// Renders Observed / Hypothesis / Question columns (equal-width on desktop,
// stacked on mobile). If `question` is empty, falls back gracefully to a
// 2-column layout. A small italic feedback note sits below when `feedbackHref`
// is provided, reinforcing the research-collaboration framing.
//
// LONG-CONTENT BEHAVIOR: any column whose body text would render past
// ~10 lines is clamped on mount and a "Show more" / "Show less" toggle is
// rendered. Detection is layout-driven (compares scrollHeight against a
// 10-line cap measured from the actual rendered line-height), so it stays
// accurate across font-size, viewport, and theme changes.

import { useEffect, useRef, useState } from "react";

const MAGENTA = "#C2185B";
const LINE_CLAMP = 10;

interface Props {
  observed: string;
  hypothesis: string;
  question?: string;
  primary: string;
  feedbackHref?: string;
}

interface ClampableProps {
  text: string;
  italic?: boolean;
  /** Color used for the toggle button text. */
  toggleColor: string;
  /** Extra className passed to the <p> (e.g. for `pl-2`). */
  className?: string;
}

function ClampableParagraph({
  text,
  italic,
  toggleColor,
  className = "",
}: ClampableProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Measure whether the natural content exceeds the 10-line cap.
  // Re-runs on text change and on resize so column widths shifting
  // (mobile <-> desktop) are handled correctly.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const styles = window.getComputedStyle(el);
      const lineHeight = parseFloat(styles.lineHeight);
      if (!Number.isFinite(lineHeight) || lineHeight <= 0) {
        setOverflowing(false);
        return;
      }
      // Force unclamped measurement, then restore.
      const prevClamp = el.style.webkitLineClamp;
      const prevDisplay = el.style.display;
      const prevOverflow = el.style.overflow;
      el.style.webkitLineClamp = "unset";
      el.style.display = "block";
      el.style.overflow = "visible";
      const naturalHeight = el.scrollHeight;
      el.style.webkitLineClamp = prevClamp;
      el.style.display = prevDisplay;
      el.style.overflow = prevOverflow;

      const cap = lineHeight * LINE_CLAMP;
      // Small tolerance to avoid flicker when content is exactly at the limit.
      setOverflowing(naturalHeight > cap + 2);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [text]);

  const clamped = overflowing && !expanded;

  return (
    <>
      <p
        ref={ref}
        className={`text-base leading-relaxed ${italic ? "italic" : ""} ${className}`}
        style={
          clamped
            ? {
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: LINE_CLAMP,
                overflow: "hidden",
              }
            : undefined
        }
      >
        {text}
      </p>
      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={`mt-3 text-[12px] md:text-[13px] uppercase tracking-[0.12em] font-medium underline underline-offset-4 hover:opacity-80 transition-opacity ${className}`}
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
  feedbackHref,
}: Props) {
  const hasQuestion = Boolean(question && question.trim());
  const gridCols = hasQuestion ? "md:grid-cols-3" : "md:grid-cols-2";

  return (
    <div>
      <div className={`grid grid-cols-1 ${gridCols} gap-px bg-black/10 border border-black/10`}>
        <div className="bg-[#FBF8F4] p-5">
          <p
            className="text-[12px] md:text-[13px] uppercase tracking-[0.12em] font-medium mb-2"
            style={{ color: primary }}
          >
            Observed
          </p>
          <div className="opacity-85">
            <ClampableParagraph text={observed} toggleColor={primary} />
          </div>
        </div>
        <div className="bg-[#FBF8F4] p-5 relative">
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
          <ClampableParagraph
            text={hypothesis}
            toggleColor={primary}
            className="pl-2"
          />
        </div>
        {hasQuestion && (
          <div className="bg-[#FBF8F4] p-5 relative">
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
            <ClampableParagraph
              text={question!}
              italic
              toggleColor={MAGENTA}
              className="pl-2"
            />
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
