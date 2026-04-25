import type { SiteData } from "@/types/microsite";
import AnimatedCounter from "./AnimatedCounter";
import SpectrumBar from "./SpectrumBar";
import DotMatrix from "./DotMatrix";
import DeadZoneCalc from "./DeadZoneCalc";
import OrbitMap from "./OrbitMap";
import Expandable from "./Expandable";

interface Props {
  data: SiteData["orbits"];
}

export default function OrbitsTab({ data }: Props) {
  return (
    <div className="space-y-20">
      {/* Spectrum */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #C65D3E)" }} />
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C65D3E]">The Spectrum</span>
        </div>
        <h2 className="text-[clamp(30px,4.5vw,48px)] font-bold text-[#2D2A26] leading-[1.05] tracking-[-0.02em]" style={{ fontFamily: "'Playfair Display', serif" }}>
          {data.spectrum.headline}<span style={{ color: "#C65D3E" }}>.</span>
        </h2>
        <p className="text-[#6B6560] text-lg max-w-[600px]">{data.spectrum.description}</p>
        <SpectrumBar score={data.spectrum.score} maxScore={data.spectrum.maxScore} labels={data.spectrum.labels} />
      </section>

      {/* Have vs Gap */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl p-7" style={{ background: "rgba(74,103,65,0.03)", border: "1px solid rgba(74,103,65,0.12)", boxShadow: "0 4px 20px rgba(74,103,65,0.04)" }}>
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#4A6741]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4A6741]">What You Have</span>
          </div>
          <ul className="text-[13px] text-[#6B6560] space-y-3">
            {data.haveItems.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-4 h-4 rounded-full bg-[#4A6741]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#4A6741] text-[10px]">✓</span>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl p-7" style={{ background: "rgba(139,58,58,0.02)", border: "1px solid rgba(139,58,58,0.1)", boxShadow: "0 4px 20px rgba(139,58,58,0.03)" }}>
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#8B3A3A]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B3A3A]">The Gap</span>
          </div>
          <ul className="text-[13px] text-[#6B6560] space-y-3">
            {data.gapItems.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-4 h-4 rounded-full bg-[#8B3A3A]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#8B3A3A] text-[10px]">✗</span>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Relationship Engines */}
      <section className="space-y-8">
        <div className="space-y-3">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C65D3E]">Relationship Capital</span>
          <h2 className="text-[clamp(26px,3.5vw,40px)] font-bold text-[#2D2A26] leading-[1.1] tracking-[-0.01em]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {data.relationshipEngines.title}
          </h2>
          <p className="text-[#6B6560] text-lg max-w-[640px]">{data.relationshipEngines.description}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.relationshipEngines.engines.map((n) => (
            <div
              key={n.name}
              className="rounded-xl p-6 relative overflow-hidden transition-all duration-300"
              style={{ background: "white", border: "1px solid rgba(221,213,204,0.5)", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 12px 36px rgba(198,93,62,0.08)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #C65D3E, #C4A747)" }} />
              <div className="text-[38px] font-bold text-[#C65D3E] leading-none" style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 0 20px rgba(198,93,62,0.1)" }}>
                <AnimatedCounter end={n.num} suffix="+" />
              </div>
              <div className="text-[9px] font-bold tracking-[0.18em] uppercase text-[#A09890] mt-3">{n.role}</div>
              <div className="font-semibold text-[#2D2A26] mt-2 text-[15px]" style={{ fontFamily: "'Playfair Display', serif" }}>{n.name}</div>
              <div className="text-[12px] text-[#6B6560] mt-1">{n.insight}</div>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-5 text-center" style={{ background: "linear-gradient(135deg, rgba(198,93,62,0.04), rgba(196,167,71,0.04))", border: "1px solid rgba(198,93,62,0.1)" }}>
          <span className="text-sm text-[#6B6560]">
            <strong className="text-[#2D2A26]">{data.relationshipEngines.summary}</strong>
          </span>
        </div>
      </section>

      {/* Dead Zone */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-[clamp(26px,3.5vw,40px)] font-bold text-[#2D2A26] tracking-[-0.01em]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {data.deadZone.countLabel} relationships sitting in silence<span style={{ color: "#C65D3E" }}>.</span>
          </h2>
          <p className="text-[#6B6560] text-lg">{data.deadZone.description}</p>
        </div>
        <DotMatrix activePercent={data.deadZone.dotMatrix.activePercent} tooltips={data.deadZone.dotMatrix.tooltips} />
      </section>

      {/* Calculator */}
      <DeadZoneCalc
        defaultContacts={data.calculator.defaultContacts}
        defaultValue={data.calculator.defaultValue}
        defaultRate={data.calculator.defaultRate}
      />

      {/* Orbit Map */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C65D3E]">Visualization</span>
          <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>Orbit Map</h3>
        </div>
        <OrbitMap rings={data.orbitMap.rings} centerLabel={data.orbitMap.centerLabel} />
      </section>

      {/* ICP */}
      {data.icp.length > 0 && (
        <Expandable title={`${data.relationshipEngines.subtitle}'s ICP: Who Lives in Each Orbit`}>
          <div className="grid md:grid-cols-3 gap-4">
            {data.icp.map((c) => (
              <div key={c.title} className="rounded-xl p-6" style={{ background: "rgba(251,248,244,0.7)", border: "1px solid rgba(221,213,204,0.5)" }}>
                <h4 className="font-semibold text-[#2D2A26] mb-2 text-[14px]" style={{ fontFamily: "'Playfair Display', serif" }}>{c.title}</h4>
                <p className="text-[13px] text-[#6B6560] leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </Expandable>
      )}
    </div>
  );
}
