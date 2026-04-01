import PepperAnimatedCounter from "./PepperAnimatedCounter";
import PepperExpandable from "./PepperExpandable";

export default function PepperOverview() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center max-w-[800px] mx-auto space-y-8">
        <span className="text-[12px] font-bold tracking-[0.25em] uppercase text-[#C65D3E]">
          MARKET ACTIVATION PROFILE
        </span>
        <h1
          className="text-[clamp(32px,5vw,56px)] leading-[1.05] font-bold text-[#2D2A26]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Your Network Got Promoted Without You
        </h1>
        <blockquote className="text-left border-l-4 border-[#C65D3E] pl-6 py-2 italic text-[#6B6560] text-lg leading-relaxed max-w-[680px] mx-auto" style={{ fontFamily: "'Playfair Display', serif" }}>
          "I happened to spend this weekend a few hours going through some of our dormant relationships. This is so weird that we're even talking today about this."
          <footer className="mt-3 text-[13px] not-italic text-[#A09890]">
            — Tim Padgett, Founder · 8 minutes into Discovery Session
          </footer>
        </blockquote>
      </section>

      {/* Key Numbers */}
      <section className="bg-white border border-[#DDD5CC] rounded-xl p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-[#DDD5CC]">
          {[
            { end: 80, suffix: "%", label: "revenue from existing network", color: "#C65D3E" },
            { end: 400, suffix: "+", label: "dormant relationships", color: "#C65D3E" },
            { end: 32, suffix: "", label: "years of relationships", color: "#2D2A26" },
            { end: 0, suffix: "", label: "systems activating them", color: "#8B3A3A" },
          ].map((s, i) => (
            <div key={i} className="text-center px-4">
              <div className="text-[clamp(32px,4vw,48px)] font-bold" style={{ color: s.color, fontFamily: "'Playfair Display', serif" }}>
                <PepperAnimatedCounter end={s.end} suffix={s.suffix} />
              </div>
              <div className="text-[13px] text-[#6B6560] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* George Quote */}
      <blockquote className="border-l-4 border-[#C4A747] pl-6 py-2 italic text-[#6B6560] text-lg leading-relaxed max-w-[680px]" style={{ fontFamily: "'Playfair Display', serif" }}>
        "Everybody has all of these past contacts and connections, people that know you, yet all the focus is on let's go get new people."
        <footer className="mt-3 text-[13px] not-italic text-[#A09890]">
          — George Couris, Partner/CEO
        </footer>
      </blockquote>

      {/* What You Said vs What We Heard */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
          What You Said vs. What We Heard
        </h2>
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
              className="grid md:grid-cols-2 gap-4 bg-white border border-[#DDD5CC] rounded-lg p-6 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow"
            >
              <p className="italic text-[#6B6560]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {row.quote}
              </p>
              <div>
                <span className="text-[13px] font-bold text-[#C65D3E] uppercase tracking-wider">
                  {row.label}
                </span>
                <p className="text-[#2D2A26] text-sm mt-1 leading-relaxed">{row.insight}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Expandable Depth Layers */}
      <div className="space-y-4">
        <PepperExpandable title="What We Know About Pepper Group">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "The Firm", text: "Founded 1994. 25 professionals. Palatine, IL. BtoB Top Agency 6 years. Best and Brightest since 2013. 95% client retention. 10-year avg employee tenure. ~$7.4M revenue." },
              { title: "The IP: Revenue Tower", text: "6 levels: Strategy → Showroom → Initial Engagement → Ongoing Engagement → Sales Enablement → Customer Retention. Plus 4 cornerstones: Robust Content, Data Visibility, Talent Marketing, Marketing Tech Stack." },
              { title: "The Leadership", text: "Tim Padgett (Founder, printing background). George Couris (CEO, Booth MBA, joined 2002, Michelin corporate discipline). Jessie Atchison (VP Strategy, ex-Ball Horticultural). Aaron Boruch (MarTech, ex-Zebra Technologies)." },
              { title: "The Clients", text: "Kensing (PE carveout, became #1). Schebler. DeliverHealth. TIGRIS. Robertshaw. Yaskawa. Trace Genomics. FirstService Residential. Recent: $200M BASF division carveout via PE." },
            ].map((card, i) => (
              <div key={i} className="bg-[#FBF8F4] rounded-lg p-5 border border-[#DDD5CC]">
                <h4 className="font-semibold text-[#2D2A26] mb-2">{card.title}</h4>
                <p className="text-sm text-[#6B6560] leading-relaxed">{card.text}</p>
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
              <div key={i} className="flex items-center gap-4 bg-white border border-[#DDD5CC] rounded-lg p-4">
                <span className="text-sm font-medium text-[#6B6560] w-48 shrink-0">{m.left}</span>
                <span className="text-[#C65D3E] font-bold text-sm">→</span>
                <span className="text-sm font-bold text-[#C65D3E] w-32 shrink-0">{m.right}</span>
                <span className="text-sm text-[#6B6560]">{m.text}</span>
              </div>
            ))}
            <p className="font-semibold text-[#2D2A26] mt-4">
              Revenue Tower serves clients. RROS generates them. Together they're a full operating system.
            </p>
          </div>
        </PepperExpandable>
      </div>

      {/* RROS Progress Bar */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-[#2D2A26]">RROS Progress</h3>
        <div className="flex items-center gap-2">
          {["DISCOVER", "PROVE", "DESIGN", "ACTIVATE", "COMPOUND"].map((stage, i) => (
            <div key={stage} className="flex-1">
              <div
                className={`h-3 rounded-full ${i === 0 ? "bg-[#C65D3E]" : "bg-[#E8E2DA]"}`}
              />
              <div className="text-[10px] mt-1 text-center text-[#6B6560]">
                {stage}
                {i === 0 && <span className="block text-[#C65D3E] font-medium">In Progress</span>}
                {i === 1 && <span className="block text-[#A09890]">Next</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
