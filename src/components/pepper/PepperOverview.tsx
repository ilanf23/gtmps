import PepperAnimatedCounter from "./PepperAnimatedCounter";
import PepperExpandable from "./PepperExpandable";

export default function PepperOverview() {
  return (
    <div className="space-y-20">
      {/* ── HERO ── */}
      <section className="relative text-center max-w-[860px] mx-auto space-y-10 pt-4">
        {/* Atmospheric glow behind hero */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-60px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "120%",
            height: "400px",
            background:
              "radial-gradient(ellipse 60% 80% at 50% 20%, rgba(198,93,62,0.05) 0%, transparent 60%)",
          }}
        />

        {/* Kicker */}
        <div className="flex items-center justify-center gap-3">
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #C65D3E)" }} />
          <span
            className="text-[11px] font-semibold tracking-[0.28em] uppercase"
            style={{ color: "#C65D3E", fontFamily: "'Inter', sans-serif" }}
          >
            Market Activation Profile
          </span>
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, #C65D3E, transparent)" }} />
        </div>

        {/* Headline */}
        <h1
          className="relative text-[clamp(36px,5.5vw,64px)] leading-[1.0] font-bold text-[#2D2A26] tracking-[-0.02em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Your Network Got
          <br />
          Promoted Without You
          <span style={{ color: "#C65D3E" }}>.</span>
        </h1>

        {/* Pull quote — cinematic treatment */}
        <div
          className="relative max-w-[720px] mx-auto"
          style={{
            background: "linear-gradient(135deg, rgba(251,248,244,0.8), rgba(243,237,230,0.6))",
            borderRadius: "16px",
            padding: "32px 36px",
            border: "1px solid rgba(198,93,62,0.08)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          {/* Decorative quote mark */}
          <span
            className="absolute -top-3 left-8 text-[56px] leading-none font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: "rgba(198,93,62,0.15)" }}
          >
            "
          </span>
          <div className="flex gap-5">
            <div
              className="w-1 shrink-0 rounded-full self-stretch"
              style={{ background: "linear-gradient(180deg, #C65D3E, #C4A747)" }}
            />
            <div>
              <blockquote
                className="text-left text-[17px] italic leading-[1.7] text-[#4A4540]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                I happened to spend this weekend a few hours going through some of our dormant relationships.
                This is so weird that we're even talking today about this.
              </blockquote>
              <footer className="mt-4 text-left text-[12px] text-[#A09890] tracking-wide">
                <span className="font-semibold text-[#6B6560]">Tim Padgett</span>
                , Founder · 8 minutes into Discovery Session
              </footer>
            </div>
          </div>
        </div>
      </section>

      {/* ── KEY NUMBERS ── */}
      <section
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1A1A2E 0%, #0D0D1A 100%)",
          boxShadow: "0 20px 60px rgba(26,26,46,0.3), 0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {/* Inner glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: "100%",
            background: "radial-gradient(ellipse at top, rgba(198,93,62,0.08) 0%, transparent 60%)",
          }}
        />
        {/* Film grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-0 p-8 md:p-10">
          {[
            { end: 80, suffix: "%", label: "revenue from existing network", accent: true },
            { end: 400, suffix: "+", label: "dormant relationships", accent: true },
            { end: 32, suffix: "", label: "years of relationships", accent: false },
            { end: 0, suffix: "", label: "systems activating them", danger: true },
          ].map((s, i) => (
            <div
              key={i}
              className="text-center px-4 py-4"
              style={{
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <div
                className="text-[clamp(36px,5vw,56px)] font-bold leading-none"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: s.danger ? "#E85D4A" : s.accent ? "#C65D3E" : "rgba(255,255,255,0.9)",
                  textShadow: s.accent ? "0 0 30px rgba(198,93,62,0.2)" : "none",
                }}
              >
                <PepperAnimatedCounter end={s.end} suffix={s.suffix} />
              </div>
              <div
                className="text-[12px] mt-3 leading-relaxed"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GEORGE QUOTE ── */}
      <div
        className="relative max-w-[720px]"
        style={{
          padding: "28px 32px",
          borderRadius: "12px",
          background: "rgba(196,167,71,0.03)",
          border: "1px solid rgba(196,167,71,0.1)",
        }}
      >
        <div className="flex gap-5">
          <div
            className="w-1 shrink-0 rounded-full self-stretch"
            style={{ background: "linear-gradient(180deg, #C4A747, rgba(196,167,71,0.3))" }}
          />
          <div>
            <blockquote
              className="text-[17px] italic leading-[1.7] text-[#4A4540]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Everybody has all of these past contacts and connections, people that know you, yet all the
              focus is on let's go get new people.
            </blockquote>
            <footer className="mt-4 text-[12px] text-[#A09890] tracking-wide">
              <span className="font-semibold text-[#6B6560]">George Couris</span>
              , Partner/CEO
            </footer>
          </div>
        </div>
      </div>

      {/* ── WHAT YOU SAID vs WHAT WE HEARD ── */}
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
              quote: `"I'm finding those on LinkedIn. They were marketing coordinators when we knew them. They've now climbed the ladder."`,
              label: "Dead Zone Signal",
              insight: "Job change detection. The system catches this automatically and drafts a message before you open LinkedIn.",
            },
            {
              quote: `"This is our 32nd year. We've made many, many, many contacts. A lot of those past contacts would not be viable today."`,
              label: "Orbit Decay",
              insight: "Contacts don't die. They move orbits. The coordinator who isn't viable became the VP who is. The system tracks that migration.",
            },
            {
              quote: `"Everybody has all of these past contacts, people that know you, yet all the focus is on let's go get new people."`,
              label: "The Core Paradox",
              insight: "80% of PS revenue comes from relationships, but 0% of the tech stack is designed to activate them. George named the exact problem RROS solves.",
            },
            {
              quote: `"This is exactly what we've been talking about, but we don't have the technology mindset to do some of these things."`,
              label: "Spectrum Gap",
              insight: "The strategy exists (Revenue Tower). The discipline exists (EOS since 2012). What's missing is the activation layer between knowing people and generating revenue from those relationships.",
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
              <p
                className="italic text-[#5A5550] text-[15px] leading-[1.7]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {row.quote}
              </p>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-px bg-[#C65D3E]" />
                  <span className="text-[11px] font-bold text-[#C65D3E] uppercase tracking-[0.15em]">
                    {row.label}
                  </span>
                </div>
                <p className="text-[#2D2A26] text-sm leading-relaxed">{row.insight}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPANDABLES ── */}
      <div className="space-y-4">
        <PepperExpandable title="What We Know About Pepper Group">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "The Firm", text: "Founded 1994. 25 professionals. Palatine, IL. BtoB Top Agency 6 years. Best and Brightest since 2013. 95% client retention. 10-year avg employee tenure. ~$7.4M revenue." },
              { title: "The IP: Revenue Tower", text: "6 levels: Strategy → Showroom → Initial Engagement → Ongoing Engagement → Sales Enablement → Customer Retention. Plus 4 cornerstones: Robust Content, Data Visibility, Talent Marketing, Marketing Tech Stack." },
              { title: "The Leadership", text: "Tim Padgett (Founder, printing background). George Couris (CEO, Booth MBA, joined 2002, Michelin corporate discipline). Jessie Atchison (VP Strategy, ex-Ball Horticultural). Aaron Boruch (MarTech, ex-Zebra Technologies)." },
              { title: "The Clients", text: "Kensing (PE carveout, became #1). Schebler. DeliverHealth. TIGRIS. Robertshaw. Yaskawa. Trace Genomics. FirstService Residential. Recent: $200M BASF division carveout via PE." },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-xl p-6 transition-all duration-200"
                style={{
                  background: "rgba(251,248,244,0.7)",
                  border: "1px solid rgba(221,213,204,0.5)",
                }}
              >
                <h4
                  className="font-semibold text-[#2D2A26] mb-2 text-[15px]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {card.title}
                </h4>
                <p className="text-[13px] text-[#6B6560] leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </PepperExpandable>

        <PepperExpandable title="Revenue Tower Mapped to RROS">
          <div className="space-y-3">
            {[
              { left: "Strategy", right: "DISCOVER", text: "Understanding the market before entering it." },
              { left: "Showroom + Engagement", right: "PROVE", text: "Demonstrating capability before asking for business." },
              { left: "Ongoing Engagement", right: "DESIGN + ACTIVATE", text: "Systematic relationship nurture replaces manual follow-up." },
              { left: "Customer Retention", right: "COMPOUND", text: "Existing clients become the growth engine." },
            ].map((m, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 rounded-xl p-4 sm:p-5"
                style={{
                  background: "white",
                  border: "1px solid rgba(221,213,204,0.5)",
                }}
              >
                <span
                  className="text-sm font-medium text-[#6B6560] sm:w-48 shrink-0"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {m.left}
                </span>
                <span
                  className="text-lg hidden sm:block"
                  style={{
                    color: "#C65D3E",
                    textShadow: "0 0 12px rgba(198,93,62,0.15)",
                  }}
                >
                  →
                </span>
                <span className="text-sm font-bold text-[#C65D3E] sm:w-36 shrink-0 tracking-wide">{m.right}</span>
                <span className="text-[13px] text-[#6B6560]">{m.text}</span>
              </div>
            ))}
            <p
              className="font-semibold text-[#2D2A26] mt-6 text-[15px]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Revenue Tower serves clients. RROS generates them. Together they're a full operating system.
            </p>
          </div>
        </PepperExpandable>
      </div>

      {/* ── RROS PROGRESS ── */}
      <section className="space-y-5">
        <h3
          className="text-lg font-semibold text-[#2D2A26]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          RROS Progress
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {["DISCOVER", "PROVE", "DESIGN", "ACTIVATE", "COMPOUND"].map((stage, i) => (
            <div key={stage}>
              <div
                className="h-2.5 rounded-full"
                style={{
                  background:
                    i === 0
                      ? "linear-gradient(90deg, #C65D3E, #C4A747)"
                      : "rgba(228,222,214,0.5)",
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
