// Shared 3-panel block used by Sections 3 (Core), 4 (Proof), and 10 (Deeper Findings).
// Renders Observed / Hypothesis / Question columns (equal-width on desktop,
// stacked on mobile). If `question` is empty, falls back gracefully to a
// 2-column layout. A small italic feedback note sits below when `feedbackHref`
// is provided, reinforcing the research-collaboration framing.

const MAGENTA = "#C2185B";

interface Props {
  observed: string;
  hypothesis: string;
  question?: string;
  primary: string;
  feedbackHref?: string;
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
      <div className={`grid ${gridCols} gap-px bg-black/10 border border-black/10`}>
        <div className="bg-[#FBF8F4] p-5">
          <p
            className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-2"
            style={{ color: primary }}
          >
            Observed
          </p>
          <p className="text-sm opacity-85 leading-relaxed">{observed}</p>
        </div>
        <div className="bg-[#FBF8F4] p-5 relative">
          <span
            className="absolute left-0 top-0 bottom-0 w-[2px]"
            style={{ backgroundColor: primary }}
            aria-hidden
          />
          <p
            className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-2 pl-2"
            style={{ color: primary }}
          >
            Hypothesis
          </p>
          <p className="text-sm leading-relaxed pl-2">{hypothesis}</p>
        </div>
        {hasQuestion && (
          <div className="bg-[#FBF8F4] p-5 relative">
            <span
              className="absolute left-0 top-0 bottom-0 w-[2px]"
              style={{ backgroundColor: MAGENTA }}
              aria-hidden
            />
            <p
              className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-2 pl-2"
              style={{ color: MAGENTA }}
            >
              Question
            </p>
            <p className="text-sm italic leading-relaxed pl-2">{question}</p>
          </div>
        )}
      </div>
      {feedbackHref && (
        <p className="text-xs italic opacity-65 mt-4 leading-relaxed">
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
