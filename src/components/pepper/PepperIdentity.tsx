import PepperExpandable from "./PepperExpandable";
import { Check, X, Minus } from "lucide-react";

export default function PepperIdentity() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="max-w-[800px] space-y-4">
        <span className="text-[12px] font-bold tracking-[0.25em] uppercase text-[#C65D3E]">
          IDENTITY + POSITIONING
        </span>
        <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-[#2D2A26] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          Who Pepper Group Is (and Who It Could Be)
        </h2>
        <p className="text-[#6B6560] text-lg leading-relaxed">
          32 years of proof. A proprietary framework. But the positioning doesn't match the evidence.
        </p>
      </section>

      {/* EOS Core Focus */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#DDD5CC] rounded-lg p-6">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#A09890]">Current Positioning</span>
          <h3 className="text-xl font-bold text-[#2D2A26] mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            "Top B2B Marketing Agency"
          </h3>
          <p className="text-sm text-[#6B6560] mt-2">Broad. Accurate. But shared by 10+ agencies in Chicago.</p>
        </div>
        <div className="bg-white border-t-4 border-[#C65D3E] border-x border-b border-x-[#DDD5CC] border-b-[#DDD5CC] rounded-lg p-6">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#C65D3E]">Where the Proof Points</span>
          <h3 className="text-xl font-bold text-[#2D2A26] mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            "The B2B Marketing OS for Manufacturers and PE Portcos"
          </h3>
          <p className="text-sm text-[#6B6560] mt-2">
            Kensing became #1. Enviroserve PE-acquired. Schebler: 3 manufacturing companies. Recent $200M BASF carveout.
          </p>
        </div>
      </section>

      {/* EOS Test */}
      <section className="bg-[#FBF8F4] border border-[#DDD5CC] rounded-lg p-6">
        <h3 className="font-semibold text-[#2D2A26] mb-2">EOS Core Focus Test</h3>
        <p className="text-sm text-[#6B6560] leading-relaxed">
          Core Focus = Niche + Passion. "B2B marketing" is too wide. "Revenue systems for manufacturers scaling through PE" is magnetic. 16 years of EOS discipline. The structure is already there.
        </p>
      </section>

      {/* Competitor Table */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Competitive Landscape
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#F3EDE6]">
                <th className="text-left p-3 font-semibold text-[#2D2A26]">Capability</th>
                <th className="text-center p-3 font-semibold text-[#C65D3E]">Pepper Group</th>
                <th className="text-center p-3 font-semibold text-[#6B6560]">Trefoil</th>
                <th className="text-center p-3 font-semibold text-[#6B6560]">Walker Sands</th>
                <th className="text-center p-3 font-semibold text-[#6B6560]">VisualFizz</th>
                <th className="text-center p-3 font-semibold text-[#6B6560]">c|change</th>
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
                <tr key={i} className={`border-b border-[#DDD5CC] ${i % 2 === 0 ? "bg-white" : "bg-[#FBF8F4]"}`}>
                  <td className="p-3 font-medium text-[#2D2A26]">{row[0] as string}</td>
                  {[1, 2, 3, 4, 5].map((col) => {
                    const cell = row[col];
                    const isPepper = col === 1;
                    const bgClass = isPepper ? "bg-[#C65D3E]/5" : "";
                    if (Array.isArray(cell)) {
                      const type = cell[0];
                      return (
                        <td key={col} className={`p-3 text-center ${bgClass}`}>
                          <div className="flex flex-col items-center gap-1">
                            {type === "check" ? (
                              <Check className="w-4 h-4 text-[#4A6741]" />
                            ) : (
                              <Minus className="w-4 h-4 text-[#C4A747]" />
                            )}
                            <span className="text-[11px] text-[#6B6560]">{cell[1]}</span>
                          </div>
                        </td>
                      );
                    }
                    return (
                      <td key={col} className={`p-3 text-center ${bgClass}`}>
                        {cell === "check" ? <Check className="w-4 h-4 text-[#4A6741] mx-auto" /> :
                         cell === "tilde" ? <Minus className="w-4 h-4 text-[#C4A747] mx-auto" /> :
                         <X className="w-4 h-4 text-[#A09890] mx-auto" />}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm italic text-[#A09890]">
          Revenue Tower is differentiated IP. But nobody outside your client base knows it exists.
        </p>
      </section>

      {/* Expandables */}
      <div className="space-y-4">
        <PepperExpandable title="Full Service Footprint">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {["Strategy & Consulting", "Creative & Brand", "Digital Marketing", "Content Production", "Promotional & Events"].map((s) => (
              <div key={s} className="bg-[#FBF8F4] rounded-lg p-4 border border-[#DDD5CC] text-sm font-medium text-[#2D2A26]">
                {s}
              </div>
            ))}
          </div>
        </PepperExpandable>

        <PepperExpandable title="George's Digital Presence Analysis">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#FBF8F4] rounded-lg p-5 border border-[#DDD5CC]">
              <h4 className="font-semibold text-[#4A6741] mb-2">Strengths</h4>
              <ul className="text-sm text-[#6B6560] space-y-1">
                <li>• Authority Magazine feature</li>
                <li>• CityBiz profile</li>
                <li>• Booth MBA credential</li>
              </ul>
            </div>
            <div className="bg-[#FBF8F4] rounded-lg p-5 border border-[#DDD5CC]">
              <h4 className="font-semibold text-[#8B3A3A] mb-2">Gaps</h4>
              <ul className="text-sm text-[#6B6560] space-y-1">
                <li>• No Forbes or major publication bylines</li>
                <li>• Sparse LinkedIn cadence (2–3/year vs. 2/month target)</li>
                <li>• Buried insights — not accessible to prospects</li>
              </ul>
            </div>
          </div>
        </PepperExpandable>
      </div>
    </div>
  );
}
