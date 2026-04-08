import PepperAnimatedCounter from "../pepper/PepperAnimatedCounter";

export default function SPRPilotLookback() {
  return (
    <div className="space-y-14">
      {/* Hero */}
      <section
        className="relative rounded-2xl overflow-hidden p-8 sm:p-12 text-center"
        style={{
          background: "linear-gradient(135deg, #1B2A4A 0%, #0D1A2E 100%)",
          boxShadow: "0 20px 60px rgba(27,42,74,0.3)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top, rgba(198,93,62,0.1) 0%, transparent 60%)" }}
        />
        <div className="relative space-y-4">
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase" style={{ color: "#C4A747" }}>
            Pilot Lookback
          </span>
          <div
            className="text-[clamp(48px,8vw,80px)] font-bold leading-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#C65D3E",
              textShadow: "0 0 40px rgba(198,93,62,0.3)",
            }}
          >
            ~<PepperAnimatedCounter end={7} />%
          </div>
          <p className="text-white/60 text-lg max-w-[500px] mx-auto">
            Reply rate on signal activated outreach. Industry average for cold outreach: 1 to 2%.
          </p>
        </div>
      </section>

      {/* Stat Cards */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { num: 43, label: "Emails sent", sub: "Kyle's pilot cohort" },
          { num: 3, label: "Replies received", sub: "~7% response rate" },
          { num: 1, label: "Enterprise conversation", sub: "Firm 10x SPR's size" },
          { num: 150, label: "Contacts in pilot", sub: "From Kyle's network" },
        ].map((s) => (
          <div
            key={s.label}
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
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <PepperAnimatedCounter end={s.num} />
            </div>
            <div className="font-semibold text-[#2D2A26] mt-2 text-[14px]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {s.label}
            </div>
            <div className="text-[11px] text-[#A09890] mt-1">{s.sub}</div>
          </div>
        ))}
      </section>

      {/* Team Workflow */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C65D3E]">The Process</span>
          <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Team Workflow
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Brian", role: "Contact data validation", step: "1" },
            { name: "Kristen", role: "Content quality review", step: "2" },
            { name: "Kyle", role: "Relationship knowledge + final approval", step: "3" },
            { name: "Rebecca", role: "Strategic oversight", step: "4" },
          ].map((p) => (
            <div
              key={p.name}
              className="rounded-xl p-5 text-center"
              style={{ background: "rgba(251,248,244,0.7)", border: "1px solid rgba(221,213,204,0.5)" }}
            >
              <div className="text-[24px] font-bold text-[#C65D3E] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                {p.step}
              </div>
              <div className="font-semibold text-[#2D2A26] text-[14px]">{p.name}</div>
              <div className="text-[12px] text-[#6B6560] mt-1">{p.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Kristen Quote */}
      <section
        className="rounded-xl p-7"
        style={{
          background: "linear-gradient(135deg, rgba(251,248,244,0.8), rgba(243,237,230,0.6))",
          border: "1px solid rgba(198,93,62,0.08)",
        }}
      >
        <div className="flex gap-4">
          <div
            className="w-1 shrink-0 rounded-full"
            style={{ background: "linear-gradient(180deg, #C4A747, #C4A747)" }}
          />
          <div>
            <blockquote
              className="text-[15px] sm:text-[17px] italic leading-[1.7] text-[#4A4540]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              The emails did not feel like marketing. They felt like something Kyle would actually send. That is why people responded.
            </blockquote>
            <footer className="mt-3 text-[12px] text-[#A09890] tracking-wide">
              <span className="font-semibold text-[#6B6560]">Kristen Rosa</span>, Content Review
            </footer>
          </div>
        </div>
      </section>

      {/* Two Phase Approach */}
      <section className="space-y-6">
        <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Two Phase Approach
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div
            className="rounded-xl p-6"
            style={{ background: "rgba(198,93,62,0.03)", border: "1px solid rgba(198,93,62,0.12)", borderLeft: "4px solid #C65D3E" }}
          >
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C65D3E]">Phase 1: Prove</span>
            <p className="text-[14px] text-[#2D2A26] leading-relaxed mt-3">
              Kyle's 150 contact pilot. Signal activated outreach with team review workflow. Validate the process before scaling.
            </p>
          </div>
          <div
            className="rounded-xl p-6"
            style={{ background: "rgba(74,103,65,0.03)", border: "1px solid rgba(74,103,65,0.12)", borderLeft: "4px solid #4A6741" }}
          >
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4A6741]">Phase 2: Scale</span>
            <p className="text-[14px] text-[#2D2A26] leading-relaxed mt-3">
              Expand to additional BDMs. Build shared proof library. Integrate with Anderson portfolio. Move from person dependent to process dependent.
            </p>
          </div>
        </div>
      </section>

      {/* Accenture Callout */}
      <section
        className="rounded-xl p-7"
        style={{ background: "rgba(27,42,74,0.03)", border: "1px solid rgba(27,42,74,0.1)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#C65D3E]" />
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#C65D3E]">Notable Signal</span>
        </div>
        <p className="text-[15px] text-[#2D2A26] leading-relaxed">
          One of the three replies came from a contact who had moved to a firm 10x SPR's size. A single signal activated email reopened a conversation that would have cost thousands in traditional business development to initiate.
        </p>
      </section>
    </div>
  );
}
