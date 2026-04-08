import PepperExpandable from "../pepper/PepperExpandable";

export default function SPRSignals() {
  return (
    <div className="space-y-14">
      {/* Header */}
      <section className="max-w-[820px] space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #C65D3E)" }} />
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C65D3E]">Live Signals</span>
        </div>
        <h2
          className="text-[clamp(30px,4.5vw,48px)] font-bold text-[#2D2A26] leading-[1.05] tracking-[-0.02em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Signal + Proof + Context
          <br />
          <span style={{ color: "#C65D3E" }}>= Response, Not Pitch.</span>
        </h2>
      </section>

      {/* Formula */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-3 md:gap-4">
          {[
            { label: "Signal", text: "Saw the move to [New Company]. Cloud modernization initiative in Q2.", color: "#C4A747" },
            { label: "Proof", text: "SPR case study: Fortune 500 legacy mainframe to cloud native in 14 months.", color: "#C65D3E" },
            { label: "Context", text: "Kyle's personal knowledge of their enterprise infrastructure background.", color: "#4A6741" },
          ].map((card, i) => (
            <>
              <div
                key={card.label}
                className="rounded-xl p-6 relative overflow-hidden transition-all duration-300"
                style={{
                  background: "white",
                  border: "1px solid rgba(221,213,204,0.5)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: card.color }} />
                <div className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: card.color }}>{card.label}</div>
                <p className="text-[14px] text-[#2D2A26] leading-relaxed">{card.text}</p>
              </div>
              {i < 2 && (
                <span className="hidden md:flex items-center justify-center text-2xl font-light" style={{ color: "#D5CEC5" }}>+</span>
              )}
              {i < 2 && (
                <span className="flex md:hidden items-center justify-center text-xl font-light py-1" style={{ color: "#D5CEC5" }}>+</span>
              )}
            </>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <span className="text-2xl font-light" style={{ color: "#D5CEC5" }}>=</span>
          <div
            className="rounded-xl p-6 w-full max-w-xs relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1A1A2E, #0D0D1A)", boxShadow: "0 8px 30px rgba(26,26,46,0.3)" }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(198,93,62,0.1) 0%, transparent 60%)" }} />
            <div className="relative">
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C65D3E] mb-3">Result</div>
              <p className="text-[14px] text-white font-semibold">Response, Not Pitch</p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Email */}
      <section
        className="rounded-2xl overflow-hidden"
        style={{
          background: "white",
          border: "1px solid rgba(221,213,204,0.5)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.05)",
        }}
      >
        <div
          className="px-7 py-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(198,93,62,0.06), rgba(243,237,230,0.8))",
            borderBottom: "1px solid rgba(221,213,204,0.3)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C65D3E] animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#C65D3E]">Signal Detected</span>
          </div>
          <p className="text-[13px] text-[#2D2A26] mt-1 font-medium">Former CIO contact moved to new company with cloud modernization initiative</p>
        </div>
        <div className="p-4 sm:p-7 space-y-4">
          <div className="text-[11px] text-[#A09890] space-y-1">
            <p><strong className="text-[#6B6560]">To:</strong> [Former CIO contact]</p>
            <p><strong className="text-[#6B6560]">From:</strong> Kyle Gams</p>
            <p><strong className="text-[#6B6560]">Subject:</strong> Saw the move to [New Company]. Quick thought on their modernization challenge.</p>
          </div>
          <div className="space-y-4 text-[14px] sm:text-[15px] text-[#3A3530] leading-[1.8]">
            <p>
              <span className="inline-block text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded mr-2" style={{ background: "rgba(196,167,71,0.1)", color: "#C4A747" }}>Signal</span>
              Saw you landed at [New Company]. Congratulations. I noticed they just announced a cloud modernization initiative in Q2.
            </p>
            <p>
              <span className="inline-block text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded mr-2" style={{ background: "rgba(198,93,62,0.1)", color: "#C65D3E" }}>Proof</span>
              We just wrapped a similar build for a Fortune 500 financial services firm. Took their legacy mainframe environment to a modern cloud native architecture in 14 months. The SPR team wrote about the approach here: [link].
            </p>
            <p>
              <span className="inline-block text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded mr-2" style={{ background: "rgba(74,103,65,0.1)", color: "#4A6741" }}>Context</span>
              Given your background in enterprise infrastructure, figured this might be relevant as you are getting settled. Happy to share what we learned if it would be useful.
            </p>
            <p className="text-[14px]" style={{ color: "#2D2A26" }}>Kyle</p>
          </div>
        </div>
      </section>

      {/* What Makes This Work */}
      <section className="space-y-5">
        <h3 className="text-lg font-semibold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
          What Makes This Work
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Signal", value: "timing" },
            { label: "Proof", value: "their own case study" },
            { label: "Context", value: "Kyle's personal knowledge" },
            { label: "Review", value: "three humans touched this" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-5"
              style={{ background: "rgba(251,248,244,0.7)", border: "1px solid rgba(221,213,204,0.5)" }}
            >
              <div className="text-[11px] font-bold text-[#C65D3E] uppercase tracking-wide mb-1">{item.label}</div>
              <p className="text-[13px] text-[#2D2A26]">= {item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Signal Types */}
      <section className="space-y-5">
        <h3 className="text-lg font-semibold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Signal Types We Monitor
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Job changes", "Promotions", "Company funding", "Earnings calls",
            "Tech stack changes", "Leadership moves", "M&A activity", "Conference speaking",
            "Award wins", "Regulatory shifts", "Board appointments", "Office relocations",
          ].map((s) => (
            <span
              key={s}
              className="text-[13px] px-5 py-2.5 rounded-full transition-all duration-200 cursor-default"
              style={{
                background: "white",
                border: "1px solid rgba(221,213,204,0.5)",
                color: "#2D2A26",
                boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(198,93,62,0.3)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(198,93,62,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(221,213,204,0.5)";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.02)";
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* First Week */}
      <PepperExpandable title="The First Week at SPR">
        <div className="grid md:grid-cols-5 gap-3">
          {[
            { day: "Day 1", text: "Signal scan across 150 contacts. Identify top 10 opportunities." },
            { day: "Day 2", text: "Draft messages with signal + proof + context for top opportunities." },
            { day: "Day 3", text: "Kristen reviews content quality. Brian validates contact data." },
            { day: "Day 4", text: "Kyle applies relationship knowledge. Final approval on each message." },
            { day: "Day 5", text: "Send approved messages. Track opens, replies. Weekly report." },
          ].map((d) => (
            <div
              key={d.day}
              className="rounded-xl p-5"
              style={{ background: "rgba(251,248,244,0.7)", border: "1px solid rgba(221,213,204,0.5)" }}
            >
              <h4 className="font-semibold text-[#C65D3E] mb-2 text-[13px]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {d.day}
              </h4>
              <p className="text-[12px] text-[#6B6560] leading-relaxed">{d.text}</p>
            </div>
          ))}
        </div>
      </PepperExpandable>
    </div>
  );
}
