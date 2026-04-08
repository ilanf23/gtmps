import SPRDeadZoneCalc from "./SPRDeadZoneCalc";

export default function SPROrbits() {
  return (
    <div className="space-y-14">
      {/* Header */}
      <section className="max-w-[820px] space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #C65D3E)" }} />
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C65D3E]">The Math</span>
        </div>
        <h2
          className="text-[clamp(30px,4.5vw,48px)] font-bold text-[#2D2A26] leading-[1.05] tracking-[-0.02em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          The Revenue Already in Your CRM<span style={{ color: "#C65D3E" }}>.</span>
        </h2>
        <p className="text-[#6B6560] text-lg max-w-[640px] leading-relaxed">
          Adjust the sliders to match your actual numbers. The defaults are estimates from our conversation.
        </p>
      </section>

      {/* Dead Zone Calculator */}
      <SPRDeadZoneCalc />

      {/* Dormant value paragraph */}
      <section
        className="rounded-xl p-7"
        style={{ background: "rgba(251,248,244,0.7)", border: "1px solid rgba(221,213,204,0.5)" }}
      >
        <p className="text-[15px] text-[#2D2A26] leading-[1.8]">
          Every one of these contacts trusted SPR at some point. They are not strangers. They are relationships that went quiet because nobody had a system to maintain them. Existing clients convert at 60% to 70%, spend 31% more per engagement, and cost 7x less to reactivate than a new client costs to acquire.
        </p>
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
              "10 BDMs with deep enterprise relationships",
              "53 years of trust",
              "Strong case study library",
              "Kristen reviewing content quality",
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
              "Proof exists but does not travel into sales conversations",
              "When the main contact leaves, the account goes dormant",
              "No anchor lead generation activities",
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
    </div>
  );
}
