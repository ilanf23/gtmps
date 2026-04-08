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
          background: "#1B2A4A",
          boxShadow: "0 20px 60px rgba(27,42,74,0.3), 0 1px 3px rgba(0,0,0,0.1)",
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
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-0 p-8 md:p-10">
          {[
            { end: 59000, label: "Contacts in the CRM", note: "From Brian" },
            { end: 10000, label: "Dormant relationships", note: "From Brian and Rebecca", prefix: "8K\u201310K" },
            { end: 10, label: "BDMs running independent processes", note: "From Rebecca" },
            { end: 2, label: "Internal dormancy (most firms: 90 days)", note: "From Rebecca", suffix: " yrs", danger: true },
          ].map((s, i) => (
            <div key={i} className="text-center px-4 py-4">
              <div
                className="text-[clamp(36px,5vw,56px)] font-bold leading-none"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: (s as any).danger ? "#E85D4A" : "#C65D3E",
                  textShadow: "0 0 30px rgba(198,93,62,0.2)",
                }}
              >
                {(s as any).prefix ? (
                  <span>{(s as any).prefix}</span>
                ) : (
                  <PepperAnimatedCounter end={s.end} suffix={s.suffix || ""} />
                )}
              </div>
              <div className="text-[12px] mt-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                {s.label}
              </div>
              <div className="text-[10px] mt-1 italic" style={{ color: "rgba(255,255,255,0.3)" }}>
                {s.note}
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
              insight: "You are not missing tactics. You are missing the map itself. Every PS firm borrows fragments from SaaS and B2C playbooks because no framework was built for how professional services actually grow: through the relationships you already have.",
            },
            {
              quote: `"You can only shove your way into so many things."`,
              speaker: "Rebecca",
              label: "The Marketing Wall",
              insight: "When the system assumes marketing generates leads and sales closes them, marketing gets locked out of the conversations that matter. Rebecca described fighting to stay involved in sales conversations, then surrendering. The wall is structural, not personal.",
            },
            {
              quote: `"59,000 contacts... about 10,000 we have actually worked."`,
              speaker: "Brian",
              label: "The Dead Zone",
              insight: "8,000 to 10,000 dormant relationships sitting in a CRM nobody is systematically touching. That is not a pipeline problem. That is compounded trust with no activation system.",
            },
            {
              quote: `"New BDMs take two years to ramp."`,
              speaker: "Rebecca",
              label: "Single Threading",
              insight: "Every client relationship runs through one person. When that person leaves, the relationship evaporates. When a new BDM joins, they start from zero because the trust was never captured in a system.",
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
              <div className="flex gap-4">
                <div
                  className="w-1 shrink-0 rounded-full"
                  style={{ background: "linear-gradient(180deg, #C4A747, #C4A747)" }}
                />
                <div>
                  <p className="italic text-[#5A5550] text-[15px] leading-[1.7]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {row.quote}
                  </p>
                  <span className="text-[12px] text-[#A09890] not-italic mt-1 block">{row.speaker}</span>
                </div>
              </div>
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
              { title: "The Firm", text: "Founded 1973. Chicago HQ. \"Delivering Beyond the Build\" positioning. Technology modernization, AI, and enterprise systems. Senior delivery team, flexible engagement model. Delivery people are the real sellers; BDMs open doors." },
              { title: "The Acquisition", text: "Anderson Consulting acquisition closing July 1, 2026. 10 firms in the first wave. SPR retains its own P&L for five years. Anderson does not yet have marketing infrastructure, which means SPR can influence how the parent builds its GTM." },
              { title: "The Leadership", text: "Doug (President), Tom Ryan (EVP Sales), Rebecca Butman (EVP Marketing). The \"three amigos\" operate in lockstep. Strategic decisions can go from idea to execution in a single leadership meeting." },
              { title: "The Identity Tension", text: "SPR does both strategic project work and staffing engagements. Rebecca called this SPR's \"number one identity crisis for the last decade.\" The GTM process differs for each, which makes standardization difficult but not impossible." },
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
    </div>
  );
}
