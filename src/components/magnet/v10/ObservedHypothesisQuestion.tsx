// Shared 3-panel block used by Sections 3 (Core), 4 (Proof), and 10 (Deeper Findings).

interface Props {
  observed: string;
  hypothesis: string;
  question: string;
  primary: string;
}

export default function ObservedHypothesisQuestion({
  observed,
  hypothesis,
  question,
  primary,
}: Props) {
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-px bg-black/10 border border-black/10">
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
      </div>
      <p className="text-sm italic opacity-65 mt-4 leading-relaxed">{question}</p>
    </div>
  );
}
