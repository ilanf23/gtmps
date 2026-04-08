export default function SPRWhatIf() {
  return (
    <div className="space-y-14">
      {/* Header */}
      <section className="max-w-[820px] space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #C65D3E)" }} />
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C65D3E]">What If</span>
        </div>
        <h2
          className="text-[clamp(30px,4.5vw,48px)] font-bold text-[#2D2A26] leading-[1.05] tracking-[-0.02em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          One Example of What Activation Looks Like<span style={{ color: "#C65D3E" }}>.</span>
        </h2>
      </section>

      {/* Email Mockup */}
      <section
        className="rounded-2xl overflow-hidden"
        style={{
          background: "white",
          border: "1px solid rgba(221,213,204,0.5)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.05)",
        }}
      >
        <div
          className="px-4 sm:px-7 py-3 flex items-center gap-3"
          style={{ background: "#F2F2F2", borderBottom: "1px solid rgba(221,213,204,0.5)" }}
        >
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#FEBC2E" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
          </div>
          <span className="text-[11px] text-[#A09890] ml-2">Gmail</span>
        </div>
        <div className="p-4 sm:p-7 space-y-4">
          <div className="text-[11px] text-[#A09890] space-y-1">
            <p><strong className="text-[#6B6560]">To:</strong> [Former CIO contact]</p>
            <p><strong className="text-[#6B6560]">From:</strong> Kyle Gams</p>
            <p><strong className="text-[#6B6560]">Subject:</strong> Saw the move to [New Company]. Quick thought on their modernization challenge.</p>
          </div>
          <div className="space-y-4 text-[14px] sm:text-[15px] text-[#3A3530] leading-[1.8]">
            <p>
              <span className="inline-block text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded mr-2" style={{ background: "rgba(196,167,71,0.15)", color: "#9A7D2E" }}>Signal</span>
              Saw you landed at [New Company]. Congratulations. I noticed they just announced a cloud modernization initiative in Q2.
            </p>
            <p>
              <span className="inline-block text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded mr-2" style={{ background: "rgba(198,93,62,0.12)", color: "#C65D3E" }}>Proof</span>
              We just wrapped a similar build for a Fortune 500 financial services firm. Took their legacy mainframe environment to a modern cloud native architecture in 14 months. The SPR team wrote about the approach here: [link].
            </p>
            <p>
              <span className="inline-block text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded mr-2" style={{ background: "rgba(74,103,65,0.12)", color: "#4A6741" }}>Context</span>
              Given your background in enterprise infrastructure, figured this might be relevant as you are getting settled. Happy to share what we learned if it would be useful.
            </p>
            <p className="text-[14px]" style={{ color: "#2D2A26" }}>Kyle</p>
          </div>
        </div>
      </section>

      {/* Breakdown */}
      <section className="space-y-3">
        {[
          { tag: "Signal", color: "#9A7D2E", bg: "rgba(196,167,71,0.08)", text: "Saw the move, cloud modernization initiative (timing)" },
          { tag: "Proof", color: "#C65D3E", bg: "rgba(198,93,62,0.06)", text: "SPR case study, Fortune 500 legacy to cloud in 14 months (credibility)" },
          { tag: "Context", color: "#4A6741", bg: "rgba(74,103,65,0.06)", text: "Kyle's personal knowledge of their infrastructure background (relationship)" },
        ].map((item) => (
          <div key={item.tag} className="flex items-start gap-3 rounded-lg p-4" style={{ background: item.bg }}>
            <span className="text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded shrink-0" style={{ background: item.bg, color: item.color, border: `1px solid ${item.color}30` }}>
              {item.tag}
            </span>
            <span className="text-[13px] text-[#2D2A26]">= {item.text}</span>
          </div>
        ))}
      </section>

      {/* Today vs 12 Months */}
      <section className="grid md:grid-cols-2 gap-8 items-stretch relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #C65D3E, #C4A747)", boxShadow: "0 4px 20px rgba(198,93,62,0.3)" }}
          >
            <span className="text-white text-lg">&rarr;</span>
          </div>
        </div>

        <div className="rounded-xl p-7 space-y-5" style={{ background: "rgba(243,237,230,0.5)", border: "1px solid rgba(221,213,204,0.5)" }}>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A09890]">Today</span>
          <ul className="text-sm text-[#6B6560] space-y-3">
            <li className="flex justify-between">Senders <strong className="text-[#2D2A26]">1</strong></li>
            <li className="flex justify-between">Contacts <strong className="text-[#2D2A26]">~150</strong></li>
            <li className="flex justify-between">Proof distribution <strong className="text-[#8B3A3A]">Website only</strong></li>
            <li className="flex justify-between">System type <strong className="text-[#8B3A3A]">Person dependent</strong></li>
          </ul>
        </div>
        <div className="rounded-xl p-7 space-y-5 relative overflow-hidden" style={{ background: "white", border: "1px solid rgba(198,93,62,0.15)", boxShadow: "0 8px 30px rgba(198,93,62,0.06)" }}>
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #C65D3E, #C4A747)" }} />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C65D3E]">12 Months</span>
          <ul className="text-sm text-[#6B6560] space-y-3">
            <li className="flex justify-between">Senders <strong className="text-[#4A6741]">10</strong></li>
            <li className="flex justify-between">Contacts <strong className="text-[#4A6741]">5,000+</strong></li>
            <li className="flex justify-between">Proof distribution <strong className="text-[#4A6741]">In every outreach</strong></li>
            <li className="flex justify-between">System type <strong className="text-[#4A6741]">Process dependent</strong></li>
          </ul>
        </div>
      </section>

      {/* Did We Get This Right? */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-[clamp(26px,3.5vw,36px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Did we get this right?
          </h2>
          <p className="text-[#6B6560] text-lg">This is a mirror, not a proposal.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            "Of the 10 BDMs, who are the next 2 to 3 most likely to adopt after Kyle?",
            "What is the actual average engagement size for the contacts in Kyle's Dead Zone?",
            "Which Anderson firms are most likely to pilot first after July 1?",
            "What proof points should be in the shared library first?",
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
              <span className="text-[32px] font-bold text-[#C65D3E] shrink-0 leading-none" style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 0 15px rgba(198,93,62,0.1)" }}>
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
        style={{ background: "rgba(251,248,244,0.7)", border: "1px solid rgba(221,213,204,0.5)" }}
      >
        <h4 className="font-semibold text-[#2D2A26] text-[16px]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Before the MAP Review, we would love to know:
        </h4>
        <ol className="text-[13px] text-[#6B6560] space-y-2 list-decimal list-inside leading-relaxed">
          <li>CRM export of 10,000 working contacts</li>
          <li>BDM to contact ownership mapping</li>
          <li>Last touch date per contact</li>
          <li>Average deal size by ICP segment</li>
        </ol>
      </section>

      {/* CTA */}
      <section className="text-center space-y-5 py-4">
        <a
          href="mailto:adam@mabbly.com"
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
          Schedule 15 Min MAP Review
        </a>
        <p className="text-[13px] text-[#A09890]">adam@mabbly.com</p>

        <footer className="text-center space-y-3 pt-10 relative">
          <div className="w-16 h-px mx-auto" style={{ background: "linear-gradient(90deg, transparent, #DDD5CC, transparent)" }} />
          <p className="text-[13px] text-[#6B6560] italic mt-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Prepared within 24 hours of Discovery Session. It gives before it asks.
          </p>
          <p className="text-[11px] text-[#A09890] tracking-wide">
            discover.mabbly.com/spr
          </p>
        </footer>
      </section>
    </div>
  );
}
