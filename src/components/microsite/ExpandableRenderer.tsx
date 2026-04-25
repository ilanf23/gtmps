import type { ExpandableSection } from "@/types/microsite";
import Expandable from "./Expandable";

interface Props {
  sections: ExpandableSection[];
}

export default function ExpandableRenderer({ sections }: Props) {
  return (
    <div className="space-y-4">
      {sections.map((section, i) => (
        <Expandable key={i} title={section.title}>
          <ExpandableBody content={section.content} />
        </Expandable>
      ))}
    </div>
  );
}

function ExpandableBody({ content }: { content: ExpandableSection["content"] }) {
  switch (content.type) {
    case "card-grid":
      return (
        <div className="grid md:grid-cols-2 gap-4">
          {content.cards.map((card, i) => (
            <div
              key={i}
              className="rounded-xl p-6 transition-all duration-200"
              style={{ background: "rgba(251,248,244,0.7)", border: "1px solid rgba(221,213,204,0.5)" }}
            >
              <h4 className="font-semibold text-[#2D2A26] mb-2 text-[15px]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {card.title}
              </h4>
              <p className="text-[13px] text-[#6B6560] leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      );

    case "mapping":
      return (
        <div className="space-y-3">
          {content.items.map((m, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 rounded-xl p-4 sm:p-5"
              style={{ background: "white", border: "1px solid rgba(221,213,204,0.5)" }}
            >
              <span className="text-sm font-medium text-[#6B6560] sm:w-48 shrink-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                {m.left}
              </span>
              <span className="text-lg hidden sm:block" style={{ color: "#C65D3E", textShadow: "0 0 12px rgba(198,93,62,0.15)" }}>→</span>
              <span className="text-sm font-bold text-[#C65D3E] sm:w-36 shrink-0 tracking-wide">{m.right}</span>
              <span className="text-[13px] text-[#6B6560]">{m.text}</span>
            </div>
          ))}
          {content.summary && (
            <p className="font-semibold text-[#2D2A26] mt-6 text-[15px]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {content.summary}
            </p>
          )}
        </div>
      );

    case "text":
      return <p className="text-[13px] text-[#6B6560] leading-relaxed">{content.text}</p>;

    case "tag-list":
      return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {content.items.map((s) => (
            <div
              key={s}
              className="rounded-xl p-5 text-sm font-medium text-[#2D2A26]"
              style={{ background: "rgba(251,248,244,0.7)", border: "1px solid rgba(221,213,204,0.5)" }}
            >
              {s}
            </div>
          ))}
        </div>
      );

    case "strengths-gaps":
      return (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl p-6" style={{ background: "rgba(74,103,65,0.03)", border: "1px solid rgba(74,103,65,0.1)" }}>
            <h4 className="font-semibold text-[#4A6741] mb-3 text-[15px]">{content.strengths.title}</h4>
            <ul className="text-[13px] text-[#6B6560] space-y-2">
              {content.strengths.items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A6741]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl p-6" style={{ background: "rgba(139,58,58,0.03)", border: "1px solid rgba(139,58,58,0.1)" }}>
            <h4 className="font-semibold text-[#8B3A3A] mb-3 text-[15px]">{content.gaps.title}</h4>
            <ul className="text-[13px] text-[#6B6560] space-y-2">
              {content.gaps.items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A3A]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
  }
}
