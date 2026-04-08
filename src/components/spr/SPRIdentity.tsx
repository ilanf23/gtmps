import PepperExpandable from "../pepper/PepperExpandable";
import { Check, X, Minus } from "lucide-react";

export default function SPRIdentity() {
  return (
    <div className="space-y-14">
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
          Who SPR Is
          <br />
          <span style={{ color: "#6B6560" }}>(and Who It Could Be)</span>
        </h2>
        <p className="text-[#6B6560] text-lg leading-relaxed max-w-[640px]">
          53 years of enterprise trust. A deep bench of relationships. But the positioning lives in individual BDMs, not in a system.
        </p>
      </section>

      {/* Current vs RROS */}
      <section className="grid md:grid-cols-2 gap-6">
        <div
          className="rounded-xl p-7 transition-all duration-300"
          style={{ background: "rgba(243,237,230,0.5)", border: "1px solid rgba(221,213,204,0.5)" }}
        >
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A09890]">Current Positioning</span>
          <h3 className="text-[22px] font-bold text-[#2D2A26] mt-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            "Delivering Beyond the Build"
          </h3>
          <p className="text-sm text-[#6B6560] mt-3 leading-relaxed">
            SPR's positioning lives in individual BDM relationships, not in a system.
          </p>
        </div>
        <div
          className="rounded-xl p-7 relative overflow-hidden transition-all duration-300"
          style={{
            background: "white",
            border: "1px solid rgba(198,93,62,0.15)",
            boxShadow: "0 8px 30px rgba(198,93,62,0.06)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #C65D3E, #C4A747)" }} />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C65D3E]">With RROS</span>
          <h3 className="text-[22px] font-bold text-[#2D2A26] mt-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            The firm that turns 53 years of enterprise trust into a compounding growth engine.
          </h3>
          <p className="text-sm text-[#6B6560] mt-3 leading-relaxed">
            SPR does not need a new story. SPR needs a system that makes the existing story travel beyond the person who tells it.
          </p>
        </div>
      </section>

      {/* Core Diagnostic */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C65D3E]">Core Diagnostic</span>
          <h3 className="text-[clamp(22px,3vw,32px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Purpose + Niche
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-xl p-6" style={{ background: "rgba(196,167,71,0.03)", border: "1px solid rgba(196,167,71,0.12)" }}>
            <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#C4A747] mb-3">Purpose</div>
            <p className="text-[14px] text-[#2D2A26] leading-relaxed">
              SPR exists to modernize enterprise technology. 53 years of trust in solving complex infrastructure challenges for enterprises.
            </p>
            <div className="mt-3 inline-block text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded" style={{ background: "rgba(74,103,65,0.1)", color: "#4A6741" }}>
              Clear
            </div>
          </div>
          <div className="rounded-xl p-6" style={{ background: "rgba(198,93,62,0.03)", border: "1px solid rgba(198,93,62,0.12)" }}>
            <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#C65D3E] mb-3">Niche</div>
            <p className="text-[14px] text-[#2D2A26] leading-relaxed">
              Not yet locked. SPR serves multiple ICPs across enterprise IT. The niche will sharpen as signal data reveals where trust converts fastest.
            </p>
            <div className="mt-3 inline-block text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded" style={{ background: "rgba(198,93,62,0.1)", color: "#C65D3E" }}>
              Not Yet Locked
            </div>
          </div>
        </div>
      </section>

      {/* ICP Lock */}
      <section className="space-y-5">
        <div className="space-y-2">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C65D3E]">ICP Lock</span>
          <h3 className="text-[clamp(22px,3vw,32px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ideal Client Profile
          </h3>
        </div>
        <div className="rounded-xl p-7" style={{ background: "white", border: "1px solid rgba(221,213,204,0.5)", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#A09890] mb-2">Vertical</div>
              <p className="text-[14px] text-[#2D2A26] font-medium">IT in mid-to-enterprise</p>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#A09890] mb-2">Buyer</div>
              <p className="text-[14px] text-[#2D2A26] font-medium">CIO / CTO / VP Engineering</p>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#A09890] mb-2">Trigger</div>
              <p className="text-[14px] text-[#2D2A26] font-medium">Modernization initiatives, leadership changes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Beachhead Segment */}
      <section className="space-y-5">
        <div className="space-y-2">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C65D3E]">Beachhead Segment</span>
          <h3 className="text-[clamp(22px,3vw,32px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
            First Market to Own
          </h3>
        </div>
        <div
          className="rounded-xl p-6"
          style={{ background: "rgba(196,167,71,0.03)", border: "1px solid rgba(196,167,71,0.12)", borderLeft: "4px solid #C4A747" }}
        >
          <p className="text-[14px] text-[#6B6560] leading-relaxed">
            <strong className="text-[#2D2A26]">TBD — to be determined during PROVE phase.</strong> Signal data from the pilot will reveal which ICP segment converts fastest. Kyle's 150-contact cohort will provide the first evidence.
          </p>
        </div>
      </section>

      {/* Competitor Table */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C65D3E]">Landscape</span>
          <h3 className="text-[clamp(22px,3vw,32px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Competitive Landscape
          </h3>
        </div>
        <div
          className="overflow-x-auto rounded-xl relative"
          style={{
            border: "1px solid rgba(221,213,204,0.5)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none md:hidden" style={{ background: "linear-gradient(90deg, transparent, rgba(251,248,244,0.9))" }} />
          <table className="w-full text-sm border-collapse min-w-[700px]">
            <thead>
              <tr style={{ background: "linear-gradient(135deg, #1A1A2E, #0D0D1A)" }}>
                <th className="text-left p-4 font-semibold text-white/70 text-[12px] tracking-wide">Capability</th>
                <th className="text-center p-4 font-bold text-[#C65D3E] text-[12px] tracking-wide">SPR</th>
                <th className="text-center p-4 font-semibold text-white/40 text-[12px]">Slalom</th>
                <th className="text-center p-4 font-semibold text-white/40 text-[12px]">West Monroe</th>
                <th className="text-center p-4 font-semibold text-white/40 text-[12px]">Perficient</th>
                <th className="text-center p-4 font-semibold text-white/40 text-[12px]">Rightpoint</th>
                <th className="text-center p-4 font-semibold text-white/40 text-[12px]">Sogeti</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Enterprise Depth (53yr)", 5, 3, 3, 3, 3, 3],
                ["AI/Modernization Proof", 5, 5, 3, 5, 3, 3],
                ["Relationship Density", 5, 3, 3, 3, 3, 3],
                ["Thought Leadership Engine", 3, 5, 3, 3, 3, 3],
                ["Signal Activated Outreach", 3, 3, 3, 3, 3, 3],
                ["Anderson Scale", 5, 5, 3, 5, 3, 5],
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
                  {[1, 2, 3, 4, 5, 6].map((col) => {
                    const stars = row[col] as number;
                    const isSPR = col === 1;
                    return (
                      <td
                        key={col}
                        className="p-4 text-center"
                        style={{ background: isSPR ? "rgba(198,93,62,0.04)" : "transparent" }}
                      >
                        <div className="flex items-center justify-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, si) => (
                            <span
                              key={si}
                              className="text-[12px]"
                              style={{ color: si < stars ? (isSPR ? "#C65D3E" : "#C4A747") : "#E4DED6" }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[13px] italic text-[#A09890] max-w-[600px]">
          SPR wins 4 of 6 axes. Loses on Thought Leadership (solvable) and Signal Activated Outreach (what we are building together).
        </p>
      </section>

      {/* Digital Presence */}
      <PepperExpandable title="Digital Presence Analysis">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl p-6" style={{ background: "rgba(74,103,65,0.03)", border: "1px solid rgba(74,103,65,0.1)" }}>
            <h4 className="font-semibold text-[#4A6741] mb-3 text-[15px]">Strengths</h4>
            <ul className="text-[13px] text-[#6B6560] space-y-2">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#4A6741]" /> Strong website presence</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#4A6741]" /> Deep case study library</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#4A6741]" /> 53 years of enterprise credibility</li>
            </ul>
          </div>
          <div className="rounded-xl p-6" style={{ background: "rgba(139,58,58,0.03)", border: "1px solid rgba(139,58,58,0.1)" }}>
            <h4 className="font-semibold text-[#8B3A3A] mb-3 text-[15px]">Gaps</h4>
            <ul className="text-[13px] text-[#6B6560] space-y-2">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#8B3A3A]" /> LinkedIn activity varies by BDM</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#8B3A3A]" /> Content cadence sporadic</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#8B3A3A]" /> Proof exists but does not travel into sales conversations</li>
            </ul>
          </div>
        </div>
      </PepperExpandable>
    </div>
  );
}
