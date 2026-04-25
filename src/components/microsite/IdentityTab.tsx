import type { SiteData, CellValue } from "@/types/microsite";
import { Check, X, Minus } from "lucide-react";
import ExpandableRenderer from "./ExpandableRenderer";

interface Props {
  data: SiteData["identity"];
}

export default function IdentityTab({ data }: Props) {
  return (
    <div className="space-y-20">
      {/* Header */}
      <section className="max-w-[820px] space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #C65D3E)" }} />
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C65D3E]">Identity + Positioning</span>
        </div>
        <h2 className="text-[clamp(30px,4.5vw,48px)] font-bold text-[#2D2A26] leading-[1.05] tracking-[-0.02em]" style={{ fontFamily: "'Playfair Display', serif" }}>
          {data.headline}
          {data.headlineFaded && <><br /><span style={{ color: "#6B6560" }}>{data.headlineFaded}</span></>}
        </h2>
        <p className="text-[#6B6560] text-lg leading-relaxed max-w-[640px]">{data.description}</p>
      </section>

      {/* Current vs Proposed Positioning */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl p-7 transition-all duration-300" style={{ background: "rgba(243,237,230,0.5)", border: "1px solid rgba(221,213,204,0.5)" }}>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A09890]">Current Positioning</span>
          <h3 className="text-[22px] font-bold text-[#2D2A26] mt-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            "{data.currentPositioning.title}"
          </h3>
          <p className="text-sm text-[#6B6560] mt-3 leading-relaxed">{data.currentPositioning.description}</p>
        </div>
        <div className="rounded-xl p-7 relative overflow-hidden transition-all duration-300" style={{ background: "white", border: "1px solid rgba(198,93,62,0.15)", boxShadow: "0 8px 30px rgba(198,93,62,0.06)" }}>
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #C65D3E, #C4A747)" }} />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C65D3E]">Where the Proof Points</span>
          <h3 className="text-[22px] font-bold text-[#2D2A26] mt-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            "{data.proposedPositioning.title}"
          </h3>
          <p className="text-sm text-[#6B6560] mt-3 leading-relaxed">{data.proposedPositioning.description}</p>
        </div>
      </section>

      {/* EOS Test */}
      {data.eosTest && (
        <section className="rounded-xl p-7" style={{ background: "linear-gradient(135deg, rgba(251,248,244,0.8), rgba(243,237,230,0.5))", border: "1px solid rgba(221,213,204,0.4)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)" }}>
          <h3 className="font-semibold text-[#2D2A26] mb-3 text-[17px]" style={{ fontFamily: "'Playfair Display', serif" }}>{data.eosTest.title}</h3>
          <p className="text-sm text-[#6B6560] leading-[1.8]">{data.eosTest.text}</p>
        </section>
      )}

      {/* Competitor Table */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C65D3E]">Landscape</span>
          <h3 className="text-[clamp(22px,3vw,32px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>Competitive Landscape</h3>
        </div>
        <div className="overflow-x-auto rounded-xl relative" style={{ border: "1px solid rgba(221,213,204,0.5)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", WebkitOverflowScrolling: "touch" }}>
          <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none md:hidden" style={{ background: "linear-gradient(90deg, transparent, rgba(251,248,244,0.9))" }} />
          <table className="w-full text-sm border-collapse min-w-[600px]">
            <thead>
              <tr style={{ background: "linear-gradient(135deg, #1A1A2E, #0D0D1A)" }}>
                {data.competitors.columns.map((col, i) => (
                  <th
                    key={i}
                    className={`p-4 text-[12px] tracking-wide ${i === 0 ? "text-left font-semibold text-white/70" : i === data.competitors.highlightColumn ? "text-center font-bold text-[#C65D3E]" : "text-center font-semibold text-white/40"}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.competitors.rows.map((row, i) => (
                <tr key={i} className="transition-colors duration-200" style={{ background: i % 2 === 0 ? "white" : "rgba(251,248,244,0.5)", borderBottom: "1px solid rgba(221,213,204,0.3)" }}>
                  <td className="p-4 font-medium text-[#2D2A26] text-[13px]">{row.capability}</td>
                  {row.values.map((cell, j) => {
                    const isHighlight = j + 1 === data.competitors.highlightColumn;
                    return (
                      <td key={j} className="p-4 text-center" style={{ background: isHighlight ? "rgba(198,93,62,0.04)" : "transparent" }}>
                        <CellIcon cell={cell} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.competitorFootnote && (
          <p className="text-[13px] italic text-[#A09890] max-w-[600px]">{data.competitorFootnote}</p>
        )}
      </section>

      {/* Expandables */}
      {data.expandables.length > 0 && <ExpandableRenderer sections={data.expandables} />}
    </div>
  );
}

function CellIcon({ cell }: { cell: CellValue }) {
  const isObj = typeof cell === "object";
  const status = isObj ? cell.status : cell;
  const note = isObj ? cell.note : undefined;

  const icon =
    status === "check" ? (
      <div className="w-5 h-5 rounded-full bg-[#4A6741]/10 flex items-center justify-center mx-auto">
        <Check className="w-3 h-3 text-[#4A6741]" />
      </div>
    ) : status === "partial" ? (
      <div className="w-5 h-5 rounded-full bg-[#C4A747]/10 flex items-center justify-center mx-auto">
        <Minus className="w-3 h-3 text-[#C4A747]" />
      </div>
    ) : (
      <div className="w-5 h-5 rounded-full bg-[#A09890]/5 flex items-center justify-center mx-auto">
        <X className="w-3 h-3 text-[#D5CEC5]" />
      </div>
    );

  if (note) {
    return (
      <div className="flex flex-col items-center gap-1">
        {icon}
        <span className="text-[10px] text-[#6B6560]">{note}</span>
      </div>
    );
  }
  return icon;
}
