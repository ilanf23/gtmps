export default function PepperContentEngine() {
  return (
    <div className="space-y-20">
      {/* Header */}
      <section className="max-w-[820px] space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #C65D3E)" }} />
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C65D3E]">
            Before We Ask, We Give
          </span>
        </div>
        <h2
          className="text-[clamp(30px,4.5vw,48px)] font-bold text-[#2D2A26] leading-[1.05] tracking-[-0.02em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Your Content Engine,
          <br />
          Already Running<span style={{ color: "#C65D3E" }}>.</span>
        </h2>
        <p className="text-[#6B6560] text-lg leading-relaxed max-w-[640px]">
          We didn't just analyze your business. We built you two pieces of content you can publish this week. In George's voice. On brand. Ready to go.
        </p>
        <p className="text-[13px] text-[#A09890] leading-relaxed max-w-[560px]">
          George's cadence is 2–3 per year; it should be 2 per month. The gap isn't ideas — it's bandwidth. This is what the system does.
        </p>
      </section>

      {/* LinkedIn Post */}
      <section
        className="rounded-2xl overflow-hidden"
        style={{
          background: "white",
          border: "1px solid rgba(221,213,204,0.5)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.05)",
        }}
      >
        <div
          className="px-4 sm:px-7 py-4 flex flex-wrap items-center gap-2 sm:gap-3"
          style={{
            background: "linear-gradient(135deg, rgba(0,119,181,0.04), rgba(243,237,230,0.6))",
            borderBottom: "1px solid rgba(221,213,204,0.3)",
          }}
        >
          <span
            className="text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded"
            style={{ background: "#0077B5", color: "white" }}
          >
            LinkedIn
          </span>
          <span className="text-[13px] text-[#2D2A26] font-medium">George Couris</span>
          <span className="text-[11px] text-[#4A6741] ml-1">· Ready to publish</span>
          <span className="text-[11px] text-[#A09890] sm:ml-auto font-mono">~150 words</span>
        </div>
        <div className="p-4 sm:p-7">
          <div className="text-[#2D2A26] leading-[1.8] space-y-4 text-[14px] sm:text-[15px]">
            <p>After 22 years running a B2B marketing agency, I've noticed something most manufacturers get wrong about marketing.</p>
            <p>They hire vendors. They buy tools. They stack technologies on top of each other like Lego bricks with no blueprint.</p>
            <p>Then they wonder why the $200K they spent last year didn't move pipeline.</p>
            <p>Here's what we've learned building Revenue Tower, our 6-level marketing operating system: the problem is never one channel, one campaign, or one tool. The problem is that nobody connected Strategy to Showroom to Engagement to Sales Enablement to Retention into one system.</p>
            <p>Manufacturers don't need more marketing. They need a marketing operating system. One that treats revenue generation the way they treat production: as an engineered process with measurable throughput at every stage.</p>
            <p>Your factory floor has a system. Your marketing should too.</p>
            <p
              className="italic"
              style={{ color: "#6B6560" }}
            >
              When was the last time a vendor asked you to think about your business as a system instead of asking you to buy their solution?
            </p>
          </div>
        </div>
      </section>

      {/* Blog Post */}
      <section
        className="rounded-2xl overflow-hidden"
        style={{
          background: "white",
          border: "1px solid rgba(221,213,204,0.5)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.05)",
        }}
      >
        <div
          className="px-4 sm:px-7 py-4 flex flex-wrap items-center gap-2 sm:gap-3"
          style={{
            background: "linear-gradient(135deg, rgba(198,93,62,0.04), rgba(243,237,230,0.6))",
            borderBottom: "1px solid rgba(221,213,204,0.3)",
          }}
        >
          <span
            className="text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded"
            style={{ background: "#C65D3E", color: "white" }}
          >
            Blog
          </span>
          <span className="text-[13px] text-[#2D2A26] font-medium">peppergroup.com</span>
          <span className="text-[11px] text-[#A09890] ml-1">· Draft outline</span>
          <span className="text-[11px] text-[#A09890] sm:ml-auto font-mono">~1,200 words</span>
        </div>
        <div className="p-4 sm:p-7 space-y-6">
          <h3
            className="text-[22px] font-bold text-[#2D2A26] leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Why Your Marketing Stack Isn't a Strategy: The Revenue Tower Approach to B2B Growth
          </h3>
          {[
            { num: "1", title: "The Illusion of Progress", desc: "Tools without architecture = organized noise" },
            { num: "2", title: "Why Manufacturers Are Different", desc: "They think in systems but accept disconnected marketing" },
            { num: "3", title: "The Revenue Tower Framework", desc: "6 levels, each feeds the next" },
            { num: "4", title: "What the Cornerstones Actually Do", desc: "Content, data, talent, tech as plumbing — not shopping list" },
            { num: "5", title: "What Winners Do Differently", desc: "PE carveout went from unknown to #1 in 3 years" },
          ].map((s) => (
            <div key={s.num} className="flex gap-5 items-start">
              <span
                className="text-[28px] font-bold text-[#C65D3E] shrink-0 w-8 leading-none"
                style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 0 15px rgba(198,93,62,0.1)" }}
              >
                {s.num}
              </span>
              <div>
                <h4 className="font-semibold text-[#2D2A26] text-[15px]">{s.title}</h4>
                <p className="text-[13px] text-[#6B6560] mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why This Matters */}
      <section
        className="relative rounded-2xl p-6 sm:p-9 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #C65D3E, #A84D32)",
          boxShadow: "0 20px 60px rgba(198,93,62,0.25)",
        }}
      >
        {/* Inner glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top right, rgba(255,255,255,0.1) 0%, transparent 60%)" }}
        />
        {/* Film grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative">
          <h3
            className="text-[22px] font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Why This Matters
          </h3>
          <p className="leading-[1.8] text-white/90 text-[15px] max-w-[640px]">
            This is what a content engine looks like when it runs. George has 22 years of insight trapped in his head. Two posts per month. 10 minutes editing each. Revenue Tower stops being Pepper Group's best-kept secret.
          </p>
        </div>
      </section>

      {/* Did We Get This Right? */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2
            className="text-[clamp(26px,3.5vw,36px)] font-bold text-[#2D2A26]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Did we get this right?
          </h2>
          <p className="text-[#6B6560] text-lg">This is a mirror, not a proposal.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            "Is 1.5 on the Spectrum accurate?",
            "Is the Dead Zone bigger or smaller than 400? (We think 1,500+)",
            "Is manufacturing the right beachhead?",
            "Does the LinkedIn post sound like George?",
          ].map((q, i) => (
            <div
              key={i}
              className="rounded-xl p-6 flex gap-5 transition-all duration-300"
              style={{
                background: "white",
                border: "1px solid rgba(221,213,204,0.5)",
                borderLeft: "4px solid #C65D3E",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}
            >
              <span
                className="text-[32px] font-bold text-[#C65D3E] shrink-0 leading-none"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  textShadow: "0 0 15px rgba(198,93,62,0.1)",
                }}
              >
                {i + 1}
              </span>
              <p className="text-[14px] text-[#2D2A26] leading-relaxed self-center">{q}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data Request */}
      <section
        className="rounded-xl p-7 space-y-4"
        style={{
          background: "rgba(251,248,244,0.7)",
          border: "1px solid rgba(221,213,204,0.5)",
        }}
      >
        <h4
          className="font-semibold text-[#2D2A26] text-[16px]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Before the MAP Review, we'd love to know:
        </h4>
        <ol className="text-[13px] text-[#6B6560] space-y-2 list-decimal list-inside leading-relaxed">
          <li>What's the average first-year engagement value for a new Pepper Group client?</li>
          <li>How many proposals have "bounced back" after initial no-response?</li>
          <li>How many LinkedIn connections does Tim's profile have?</li>
        </ol>
      </section>

      {/* CTA */}
      <section className="text-center space-y-5 py-4">
        <a
          href="https://calendly.com/adam-fridman/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="relative overflow-hidden font-semibold px-12 py-5 rounded-xl text-lg transition-all duration-300 cursor-pointer inline-block no-underline"
          style={{
            background: "linear-gradient(135deg, #C65D3E, #A84D32)",
            color: "white",
            boxShadow: "0 8px 30px rgba(198,93,62,0.25), 0 2px 8px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(198,93,62,0.35), 0 4px 12px rgba(0,0,0,0.15)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 8px 30px rgba(198,93,62,0.25), 0 2px 8px rgba(0,0,0,0.1)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Schedule 30-Min MAP Review
        </a>
        <p className="text-[13px] text-[#A09890]">No pitch. Just: what's right, what's wrong, what's next.</p>
      </section>

      {/* Footer */}
      <footer className="text-center space-y-3 pt-10 relative">
        <div className="w-16 h-px mx-auto" style={{ background: "linear-gradient(90deg, transparent, #DDD5CC, transparent)" }} />
        <p className="text-[13px] text-[#6B6560] italic mt-6" style={{ fontFamily: "'Playfair Display', serif" }}>
          Prepared within 24 hours of Discovery Session. It gives before it asks.
        </p>
        <p className="text-[11px] text-[#A09890] tracking-wide">
          Adam Fridman · Mabbly · GTM for Professional Services
        </p>
      </footer>
    </div>
  );
}
