export default function PepperContentEngine() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="max-w-[800px] space-y-4">
        <span className="text-[12px] font-bold tracking-[0.25em] uppercase text-[#C65D3E]">
          BEFORE WE ASK, WE GIVE
        </span>
        <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-[#2D2A26] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          Your Content Engine, Already Running
        </h2>
        <p className="text-[#6B6560] text-lg leading-relaxed">
          We didn't just analyze your business. We built you two pieces of content you can publish this week. In George's voice. On brand. Ready to go.
        </p>
        <p className="text-sm text-[#A09890]">
          George's cadence is 2–3 per year; it should be 2 per month. The gap isn't ideas — it's bandwidth. This is what the system does.
        </p>
      </section>

      {/* LinkedIn Post */}
      <section className="bg-white border border-[#DDD5CC] rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-[#FBF8F4] flex items-center gap-3 border-b border-[#DDD5CC]">
          <span className="text-[11px] font-bold tracking-wider uppercase bg-[#0077B5] text-white px-2 py-0.5 rounded">LinkedIn</span>
          <span className="text-sm text-[#2D2A26] font-medium">George Couris · Ready to publish</span>
          <span className="text-[11px] text-[#A09890] ml-auto">~150 words</span>
        </div>
        <div className="p-6">
          <div className="text-[#2D2A26] leading-relaxed space-y-4 text-[15px]">
            <p>After 22 years running a B2B marketing agency, I've noticed something most manufacturers get wrong about marketing.</p>
            <p>They hire vendors. They buy tools. They stack technologies on top of each other like Lego bricks with no blueprint.</p>
            <p>Then they wonder why the $200K they spent last year didn't move pipeline.</p>
            <p>Here's what we've learned building Revenue Tower, our 6-level marketing operating system: the problem is never one channel, one campaign, or one tool. The problem is that nobody connected Strategy to Showroom to Engagement to Sales Enablement to Retention into one system.</p>
            <p>Manufacturers don't need more marketing. They need a marketing operating system. One that treats revenue generation the way they treat production: as an engineered process with measurable throughput at every stage.</p>
            <p>Your factory floor has a system. Your marketing should too.</p>
            <p className="italic text-[#6B6560]">When was the last time a vendor asked you to think about your business as a system instead of asking you to buy their solution?</p>
          </div>
        </div>
      </section>

      {/* Blog Post */}
      <section className="bg-white border border-[#DDD5CC] rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-[#FBF8F4] flex items-center gap-3 border-b border-[#DDD5CC]">
          <span className="text-[11px] font-bold tracking-wider uppercase bg-[#C65D3E] text-white px-2 py-0.5 rounded">Blog</span>
          <span className="text-sm text-[#2D2A26] font-medium">peppergroup.com · Draft outline</span>
          <span className="text-[11px] text-[#A09890] ml-auto">~1,200 words when written</span>
        </div>
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Why Your Marketing Stack Isn't a Strategy: The Revenue Tower Approach to B2B Growth
          </h3>
          {[
            { num: "1", title: "The Illusion of Progress", desc: "Tools without architecture = organized noise" },
            { num: "2", title: "Why Manufacturers Are Different", desc: "They think in systems but accept disconnected marketing" },
            { num: "3", title: "The Revenue Tower Framework", desc: "6 levels, each feeds the next" },
            { num: "4", title: "What the Cornerstones Actually Do", desc: "Content, data, talent, tech as plumbing — not shopping list" },
            { num: "5", title: "What Winners Do Differently", desc: "PE carveout went from unknown to #1 in 3 years" },
          ].map((s) => (
            <div key={s.num} className="flex gap-4 items-start">
              <span className="text-2xl font-bold text-[#C65D3E] shrink-0 w-8" style={{ fontFamily: "'Playfair Display', serif" }}>{s.num}</span>
              <div>
                <h4 className="font-semibold text-[#2D2A26]">{s.title}</h4>
                <p className="text-sm text-[#6B6560]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why This Matters */}
      <section className="bg-[#C65D3E] rounded-xl p-8 text-white">
        <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Why This Matters</h3>
        <p className="leading-relaxed opacity-90">
          This is what a content engine looks like when it runs. George has 22 years of insight trapped in his head. Two posts per month. 10 minutes editing each. Revenue Tower stops being Pepper Group's best-kept secret.
        </p>
      </section>

      {/* Did We Get This Right? */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Did we get this right?
        </h2>
        <p className="text-[#6B6560]">This is a mirror, not a proposal.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            "Is 1.5 on the Spectrum accurate?",
            "Is the Dead Zone bigger or smaller than 400? (We think 1,500+)",
            "Is manufacturing the right beachhead?",
            "Does the LinkedIn post sound like George?",
          ].map((q, i) => (
            <div key={i} className="bg-white border border-[#DDD5CC] border-l-4 border-l-[#C65D3E] rounded-lg p-5 flex gap-4">
              <span className="text-3xl font-bold text-[#C65D3E] shrink-0" style={{ fontFamily: "'Playfair Display', serif" }}>{i + 1}</span>
              <p className="text-sm text-[#2D2A26] leading-relaxed">{q}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data Request */}
      <section className="bg-[#FBF8F4] border border-[#DDD5CC] rounded-lg p-6 space-y-3">
        <h4 className="font-semibold text-[#2D2A26]">Before the MAP Review, we'd love to know:</h4>
        <ol className="text-sm text-[#6B6560] space-y-2 list-decimal list-inside">
          <li>What's the average first-year engagement value for a new Pepper Group client?</li>
          <li>How many proposals have "bounced back" after initial no-response?</li>
          <li>How many LinkedIn connections does Tim's profile have?</li>
        </ol>
      </section>

      {/* CTA */}
      <section className="text-center space-y-4">
        <button className="bg-[#C65D3E] hover:bg-[#B04E32] text-white font-semibold px-10 py-4 rounded-lg text-lg transition-colors shadow-[0_4px_20px_rgba(198,93,62,0.3)]">
          Schedule 15-Min MAP Review
        </button>
        <p className="text-sm text-[#A09890]">No pitch. Just: what's right, what's wrong, what's next.</p>
      </section>

      {/* Footer */}
      <footer className="text-center space-y-2 pt-8 border-t border-[#DDD5CC]">
        <p className="text-sm text-[#6B6560] italic">
          Prepared within 24 hours of Discovery Session. It gives before it asks.
        </p>
        <p className="text-[12px] text-[#A09890]">
          Adam Fridman | Mabbly | GTM for Professional Services
        </p>
      </footer>
    </div>
  );
}
