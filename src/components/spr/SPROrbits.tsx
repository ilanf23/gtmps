import PepperAnimatedCounter from "../pepper/PepperAnimatedCounter";
import PepperExpandable from "../pepper/PepperExpandable";
import SPRSpectrumBar from "./SPRSpectrumBar";
import SPRDeadZoneCalc from "./SPRDeadZoneCalc";
import SPROrbitMap from "./SPROrbitMap";

export default function SPROrbits() {
  return (
    <div className="space-y-14">
      {/* Spectrum */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #C65D3E)" }} />
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C65D3E]">The Spectrum</span>
        </div>
        <h2
          className="text-[clamp(30px,4.5vw,48px)] font-bold text-[#2D2A26] leading-[1.05] tracking-[-0.02em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          You're at 1.5&ndash;2.0 out of 4<span style={{ color: "#C65D3E" }}>.</span>
        </h2>
        <p className="text-[#6B6560] text-lg max-w-[600px]">
          You have the raw materials. You do not have the system.
        </p>
        <SPRSpectrumBar />
      </section>

      {/* Have vs Gap */}
      <section className="grid md:grid-cols-2 gap-6">
        <div
          className="rounded-xl p-7"
          style={{ background: "rgba(74,103,65,0.03)", border: "1px solid rgba(74,103,65,0.12)", boxShadow: "0 4px 20px rgba(74,103,65,0.04)" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#4A6741]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4A6741]">What You Have</span>
          </div>
          <ul className="text-[13px] text-[#6B6560] space-y-3">
            {[
              "59,000 CRM contacts",
              "10 BDMs with deep relationships",
              "53 years of enterprise trust",
              "Strong case study library",
              "Kristin reviewing content quality",
              "Anderson acquisition bringing scale",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-4 h-4 rounded-full bg-[#4A6741]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#4A6741] text-[10px]">&#10003;</span>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="rounded-xl p-7"
          style={{ background: "rgba(139,58,58,0.02)", border: "1px solid rgba(139,58,58,0.1)", boxShadow: "0 4px 20px rgba(139,58,58,0.03)" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#8B3A3A]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B3A3A]">The Gap</span>
          </div>
          <ul className="text-[13px] text-[#6B6560] space-y-3">
            {[
              "No system to identify which contacts matter today",
              "Each BDM running their own process",
              "Trust locked in individual heads",
              "Proof does not travel into sales",
              "One person cannot scale across 10 senders",
              "Zero marketing infrastructure at parent level",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-4 h-4 rounded-full bg-[#8B3A3A]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#8B3A3A] text-[10px]">&#10007;</span>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Network Assets */}
      <section className="space-y-8">
        <div className="space-y-3">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C65D3E]">Relationship Capital</span>
          <h2
            className="text-[clamp(26px,3.5vw,40px)] font-bold text-[#2D2A26] leading-[1.1] tracking-[-0.01em]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Network Assets
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { num: 150, label: "Kyle Gams network", sub: "Pilot cohort" },
            { num: 5000, label: "9 additional BDMs", sub: "Combined estimate" },
            { num: 5000, label: "Marketing database", sub: "Email subscribers" },
            { num: 49000, label: "Legacy CRM untouched", sub: "Dormant asset" },
          ].map((n) => (
            <div
              key={n.label}
              className="rounded-xl p-6 relative overflow-hidden transition-all duration-300"
              style={{
                background: "white",
                border: "1px solid rgba(221,213,204,0.5)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 12px 36px rgba(198,93,62,0.08)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #C65D3E, #C4A747)" }} />
              <div
                className="text-[36px] font-bold text-[#C65D3E] leading-none"
                style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 0 20px rgba(198,93,62,0.1)" }}
              >
                ~<PepperAnimatedCounter end={n.num} />
              </div>
              <div className="font-semibold text-[#2D2A26] mt-2 text-[14px]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {n.label}
              </div>
              <div className="text-[11px] text-[#A09890] mt-1">{n.sub}</div>
            </div>
          ))}
        </div>
        <div
          className="rounded-xl p-5 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(198,93,62,0.04), rgba(196,167,71,0.04))",
            border: "1px solid rgba(198,93,62,0.1)",
          }}
        >
          <span className="text-sm text-[#6B6560]">
            Currently activating: <strong className="text-[#8B3A3A]">~150 of 59,000 total CRM (0.25%)</strong>
            <span className="mx-2">|</span>
            <strong className="text-[#8B3A3A]">~150 of ~10,000 dormant (1.5%)</strong>
            <span className="mx-2">|</span>
            <strong className="text-[#2D2A26]">You are activating less than 2% of your dormant relationships.</strong>
          </span>
        </div>
      </section>

      {/* Dead Zone Calculator */}
      <SPRDeadZoneCalc />

      {/* Orbit Map */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C65D3E]">Visualization</span>
          <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Orbit Map
          </h3>
        </div>
        <SPROrbitMap />
      </section>
    </div>
  );
}
