import PepperAnimatedCounter from "../pepper/PepperAnimatedCounter";
import PepperExpandable from "../pepper/PepperExpandable";

export default function SPROverview() {
  return (
    <div className="space-y-14">
      {/* HERO */}
      <section className="relative text-center max-w-[860px] mx-auto space-y-10 pt-4">
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-60px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "120%",
            height: "400px",
            background: "radial-gradient(ellipse 60% 80% at 50% 20%, rgba(198,93,62,0.05) 0%, transparent 60%)",
          }}
        />

        <div className="flex items-center justify-center gap-3">
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #C65D3E)" }} />
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase" style={{ color: "#C65D3E" }}>
            Market Activation Profile
          </span>
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, #C65D3E, transparent)" }} />
        </div>

        <h1
          className="relative text-[clamp(36px,5.5vw,64px)] leading-[1.0] font-bold text-[#2D2A26] tracking-[-0.02em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          53 Years of Trust
          <br />
          No System Compounding It<span style={{ color: "#C65D3E" }}>.</span>
        </h1>

        <div
          className="relative max-w-[720px] mx-auto"
          style={{
            background: "linear-gradient(135deg, rgba(251,248,244,0.8), rgba(243,237,230,0.6))",
            borderRadius: "16px",
            padding: "28px 28px 28px 32px",
            border: "1px solid rgba(198,93,62,0.08)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          <span
            className="absolute -top-3 left-8 text-[56px] leading-none font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: "rgba(198,93,62,0.15)" }}
          >
            &ldquo;
          </span>
          <div className="flex gap-4">
            <div
              className="w-1 shrink-0 rounded-full"
              style={{ background: "linear-gradient(180deg, #C65D3E, #C4A747)", minHeight: "100%" }}
            />
            <div className="min-w-0">
              <blockquote
                className="text-left text-[15px] sm:text-[17px] italic leading-[1.7] text-[#4A4540]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                There is no GTM framework for professional services. Even among professional services marketers, we were using the same words, but we had different definitions of those words.
              </blockquote>
              <footer className="mt-4 text-left text-[12px] text-[#A09890] tracking-wide">
                <span className="font-semibold text-[#6B6560]">Rebecca Butman</span>, EVP Marketing, SPR
              </footer>
            </div>
          </div>
        </div>
      </section>

      {/* KEY NUMBERS */}
      <section
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1A1A2E 0%, #0D0D1A 100%)",
          boxShadow: "0 20px 60px rgba(26,26,46,0.3), 0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0, left: "50%", transform: "translateX(-50%)",
            width: "80%", height: "100%",
            background: "radial-gradient(ellipse at top, rgba(198,93,62,0.08) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-0 p-8 md:p-10">
          {[
            { end: 59000, suffix: "", label: "Contacts in the CRM", accent: true, prefix: "" },
            { end: 10000, suffix: "", label: "Dormant relationships", accent: true, prefix: "8K\u2013" },
            { end: 10, suffix: "", label: "BDMs running independent processes", accent: false },
            { end: 2, suffix: " yrs", label: "Dormancy definition (most firms: 90 days)", danger: true },
          ].map((s, i) => (
            <div key={i} className="text-center px-4 py-4">
              <div
                className="text-[clamp(32px,5vw,52px)] font-bold leading-none"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: (s as any).danger ? "#E85D4A" : s.accent ? "#C65D3E" : "rgba(255,255,255,0.9)",
                  textShadow: s.accent ? "0 0 30px rgba(198,93,62,0.2)" : "none",
                }}
              >
                {i === 1 ? (
                  <span>8K&ndash;<PepperAnimatedCounter end={10} suffix="K" /></span>
                ) : (
                  <PepperAnimatedCounter end={s.end} suffix={s.suffix} />
                )}
              </div>
              <div className="text-[12px] mt-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT YOU SAID vs WHAT WE HEARD */}
      <section className="space-y-8">
        <div className="space-y-3">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C65D3E]">Discovery Insights</span>
          <h2
            className="text-[clamp(26px,3.5vw,40px)] font-bold text-[#2D2A26] leading-tight tracking-[-0.01em]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            What You Said vs. What We Heard
          </h2>
        </div>
        <div className="space-y-4">
          {[
            {
              quote: `"There is no GTM framework for professional services."`,
              speaker: "Rebecca",
              label: "The Wrong Map",
              insight: "You are not missing tactics. You are missing the map itself. The RROS system exists because every PS firm is building from scratch, borrowing fragments from SaaS and B2C playbooks.",
            },
            {
              quote: `"You can only shove your way into so many things."`,
              speaker: "",
              label: "The Marketing/Revenue Wall",
              insight: "When the map says marketing generates leads and sales closes them, you build a wall. When the map says relationships are the growth engine, the wall comes down.",
            },
            {
              quote: `"59,000 contacts... about 10,000 we've actually worked."`,
              speaker: "",
              label: "The Dead Zone",
              insight: "8,000 to 10,000 dormant relationships sitting in a CRM nobody is systematically touching. That is not a pipeline problem. That is compounded trust with no activation system.",
            },
            {
              quote: `"New BDMs take two years to ramp."`,
              speaker: "",
              label: "Single Threading",
              insight: "Every client relationship runs through one person. When that person leaves, the relationship evaporates. The system is person dependent, not process dependent.",
            },
          ].map((row, i) => (
            <div
              key={i}
              className="grid md:grid-cols-2 gap-6 rounded-xl p-7 transition-all duration-300 group cursor-default"
              style={{
                background: "white",
                border: "1px solid rgba(221,213,204,0.5)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.06), 0 0 0 1px rgba(198,93,62,0.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <p className="italic text-[#5A5550] text-[15px] leading-[1.7]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {row.quote}
                {row.speaker && <span className="text-[12px] text-[#A09890] not-italic"> &mdash; {row.speaker}</span>}
              </p>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-px bg-[#C65D3E]" />
                  <span className="text-[11px] font-bold text-[#C65D3E] uppercase tracking-[0.15em]">{row.label}</span>
                </div>
                <p className="text-[#2D2A26] text-sm leading-relaxed">{row.insight}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPANY PROFILE */}
      <div className="space-y-4">
        <PepperExpandable title="What We Know About SPR">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "The Firm", text: "Founded 1973. 53 years. 435 employees. 6 continents. Chicago HQ. \"Delivering Beyond the Build\" positioning. Technology modernization and AI powered enterprise systems." },
              { title: "The Acquisition", text: "Anderson Consulting acquisition closing July 1, 2026. 10 firms in the first wave. SPR becomes part of a multi-firm technology consulting portfolio." },
              { title: "The Leadership", text: "Doug (President), Tom Ryan (EVP Sales), Rebecca Butman (EVP Marketing). 10 BDMs running independent sales processes across enterprise accounts." },
              { title: "The Opportunity", text: "59,000 CRM contacts. 8,000 to 10,000 dormant relationships. Deep enterprise trust built over 53 years. Zero systems activating it." },
            ].map((card, i) => (
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
        </PepperExpandable>
      </div>

      {/* RROS PROGRESS */}
      <section className="space-y-5">
        <h3 className="text-lg font-semibold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
          RROS Progress
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {["DISCOVER", "PROVE", "DESIGN", "ACTIVATE", "COMPOUND"].map((stage, i) => (
            <div key={stage}>
              <div
                className="h-2.5 rounded-full"
                style={{
                  background: i === 0 ? "linear-gradient(90deg, #C65D3E, #C4A747)" : "rgba(228,222,214,0.5)",
                  boxShadow: i === 0 ? "0 0 10px rgba(198,93,62,0.2)" : "none",
                }}
              />
              <div className="text-[10px] mt-2 text-center tracking-[0.08em]" style={{ color: "#A09890" }}>
                {stage}
                {i === 0 && <span className="block text-[#C65D3E] font-semibold mt-0.5">In Progress</span>}
                {i === 1 && <span className="block text-[#A09890]">Next</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
