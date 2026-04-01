import PepperExpandable from "./PepperExpandable";
import { Check, X, Minus } from "lucide-react";

export default function PepperIdentity() {
  return (
    <div className="space-y-20">
      {/* Header */}
      <section className="max-w-[820px] space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #C65D3E)" }} />
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C65D3E]">
            Identity + Positioning
          </span>
        </div>
        <h2
          className="text-[clamp(30px,4.5vw,48px)] font-bold text-[#2D2A26] leading-[1.05] tracking-[-0.02em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Who Pepper Group Is
          <br />
          <span style={{ color: "#6B6560" }}>(and Who It Could Be)</span>
        </h2>
        <p className="text-[#6B6560] text-lg leading-relaxed max-w-[640px]">
          32 years of proof. A proprietary framework. But the positioning doesn't match the evidence.
        </p>
      </section>

      {/* EOS Core Focus */}
      <section className="grid md:grid-cols-2 gap-6">
        <div
          className="rounded-xl p-7 transition-all duration-300"
          style={{
            background: "rgba(243,237,230,0.5)",
            border: "1px solid rgba(221,213,204,0.5)",
          }}
        >
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A09890]">Current Positioning</span>
          <h3
            className="text-[22px] font-bold text-[#2D2A26] mt-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            "Top B2B Marketing Agency"
          </h3>
          <p className="text-sm text-[#6B6560] mt-3 leading-relaxed">Broad. Accurate. But shared by 10+ agencies in Chicago.</p>
        </div>
        <div
          className="rounded-xl p-7 relative overflow-hidden transition-all duration-300"
          style={{
            background: "white",
            border: "1px solid rgba(198,93,62,0.15)",
            boxShadow: "0 8px 30px rgba(198,93,62,0.06)",
          }}
        >
          {/* Top accent gradient */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: "linear-gradient(90deg, #C65D3E, #C4A747)" }}
          />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C65D3E]">Where the Proof Points</span>
          <h3
            className="text-[22px] font-bold text-[#2D2A26] mt-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            "The B2B Marketing OS for Manufacturers and PE Portcos"
          </h3>
          <p className="text-sm text-[#6B6560] mt-3 leading-relaxed">
            Kensing became #1. Enviroserve PE-acquired. Schebler: 3 manufacturing companies. Recent $200M BASF carveout.
          </p>
        </div>
      </section>

      {/* EOS Test */}
      <section
        className="rounded-xl p-7"
        style={{
          background: "linear-gradient(135deg, rgba(251,248,244,0.8), rgba(243,237,230,0.5))",
          border: "1px solid rgba(221,213,204,0.4)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >
        <h3
          className="font-semibold text-[#2D2A26] mb-3 text-[17px]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          EOS Core Focus Test
        </h3>
        <p className="text-sm text-[#6B6560] leading-[1.8]">
          Core Focus = Niche + Passion. "B2B marketing" is too wide. "Revenue systems for manufacturers scaling through PE" is magnetic. 16 years of EOS discipline. The structure is already there.
        </p>
      </section>

      {/* Competitor Table */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C65D3E]">Landscape</span>
          <h3
            className="text-[clamp(22px,3vw,32px)] font-bold text-[#2D2A26]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Competitive Landscape
          </h3>
        </div>
        <div
          className="overflow-x-auto rounded-xl"
          style={{
            border: "1px solid rgba(221,213,204,0.5)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          }}
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr
                style={{
                  background: "linear-gradient(135deg, #1A1A2E, #0D0D1A)",
                }}
              >
                <th className="text-left p-4 font-semibold text-white/70 text-[12px] tracking-wide">Capability</th>
                <th className="text-center p-4 font-bold text-[#C65D3E] text-[12px] tracking-wide">Pepper Group</th>
                <th className="text-center p-4 font-semibold text-white/40 text-[12px]">Trefoil</th>
                <th className="text-center p-4 font-semibold text-white/40 text-[12px]">Walker Sands</th>
                <th className="text-center p-4 font-semibold text-white/40 text-[12px]">VisualFizz</th>
                <th className="text-center p-4 font-semibold text-white/40 text-[12px]">c|change</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Proprietary IP", ["check", "Revenue Tower"], "x", "x", "x", "x"],
                ["PE Portfolio Proof", ["check", "Kensing, BASF"], "tilde", "x", "x", "x"],
                ["Manufacturing Depth", ["check", "Schebler, Robertshaw"], "tilde", "x", "x", "x"],
                ["Thought Leadership Engine", "tilde", "x", ["check", "Strong"], "tilde", "x"],
                ["Relationship Activation Tech", ["tilde", "With Mabbly"], "x", "x", "x", "x"],
                ["EOS Discipline", ["check", "16 years"], "x", "x", "x", "x"],
              ].map((row, i) => (
                <tr
                  key={i}
                  className="transition-colors duration-200"
                  style={{
                    background: i % 2 === 0 ? "white" : "rgba(251,248,244,0.5)",
                    borderBottom: "1px solid rgba(221,213,204,0.3)",
                  }}
                >
                  <td className="p-4 font-medium text-[#2D2A26] text-[13px]">{row[0] as string}</td>
                  {[1, 2, 3, 4, 5].map((col) => {
                    const cell = row[col];
                    const isPepper = col === 1;
                    return (
                      <td
                        key={col}
                        className="p-4 text-center"
                        style={{
                          background: isPepper ? "rgba(198,93,62,0.04)" : "transparent",
                        }}
                      >
                        {Array.isArray(cell) ? (
                          <div className="flex flex-col items-center gap-1">
                            {cell[0] === "check" ? (
                              <div className="w-5 h-5 rounded-full bg-[#4A6741]/10 flex items-center justify-center">
                                <Check className="w-3 h-3 text-[#4A6741]" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-[#C4A747]/10 flex items-center justify-center">
                                <Minus className="w-3 h-3 text-[#C4A747]" />
                              </div>
                            )}
                            <span className="text-[10px] text-[#6B6560]">{cell[1]}</span>
                          </div>
                        ) : cell === "check" ? (
                          <div className="w-5 h-5 rounded-full bg-[#4A6741]/10 flex items-center justify-center mx-auto">
                            <Check className="w-3 h-3 text-[#4A6741]" />
                          </div>
                        ) : cell === "tilde" ? (
                          <div className="w-5 h-5 rounded-full bg-[#C4A747]/10 flex items-center justify-center mx-auto">
                            <Minus className="w-3 h-3 text-[#C4A747]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#A09890]/5 flex items-center justify-center mx-auto">
                            <X className="w-3 h-3 text-[#D5CEC5]" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[13px] italic text-[#A09890] max-w-[600px]">
          Revenue Tower is differentiated IP. But nobody outside your client base knows it exists.
        </p>
      </section>

      {/* Expandables */}
      <div className="space-y-4">
        <PepperExpandable title="Full Service Footprint">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {["Strategy & Consulting", "Creative & Brand", "Digital Marketing", "Content Production", "Promotional & Events"].map((s) => (
              <div
                key={s}
                className="rounded-xl p-5 text-sm font-medium text-[#2D2A26]"
                style={{
                  background: "rgba(251,248,244,0.7)",
                  border: "1px solid rgba(221,213,204,0.5)",
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </PepperExpandable>

        <PepperExpandable title="George's Digital Presence Analysis">
          <div className="grid md:grid-cols-2 gap-4">
            <div
              className="rounded-xl p-6"
              style={{
                background: "rgba(74,103,65,0.03)",
                border: "1px solid rgba(74,103,65,0.1)",
              }}
            >
              <h4 className="font-semibold text-[#4A6741] mb-3 text-[15px]">Strengths</h4>
              <ul className="text-[13px] text-[#6B6560] space-y-2">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#4A6741]" /> Authority Magazine feature</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#4A6741]" /> CityBiz profile</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#4A6741]" /> Booth MBA credential</li>
              </ul>
            </div>
            <div
              className="rounded-xl p-6"
              style={{
                background: "rgba(139,58,58,0.03)",
                border: "1px solid rgba(139,58,58,0.1)",
              }}
            >
              <h4 className="font-semibold text-[#8B3A3A] mb-3 text-[15px]">Gaps</h4>
              <ul className="text-[13px] text-[#6B6560] space-y-2">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#8B3A3A]" /> No Forbes or major publication bylines</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#8B3A3A]" /> Sparse LinkedIn cadence (2–3/year vs. 2/month target)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#8B3A3A]" /> Buried insights — not accessible to prospects</li>
              </ul>
            </div>
          </div>
        </PepperExpandable>
      </div>
    </div>
  );
}
