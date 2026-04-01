import PepperExpandable from "./PepperExpandable";

export default function PepperSignals() {
  return (
    <div className="space-y-20">
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
        {/* 3-column grid for input cards */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-3 md:gap-4">
          {[
            { label: "Signal", text: "Their company wins an award", color: "#C4A747" },
            { label: "Proof", text: "Your Kensing case study matches", color: "#C65D3E" },
            { label: "Context", text: "You worked together in 2019", color: "#4A6741" },
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

        {/* Equals + Result */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-2xl font-light" style={{ color: "#D5CEC5" }}>=</span>
          <div
            className="rounded-xl p-6 w-full max-w-xs relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1A1A2E, #0D0D1A)",
              boxShadow: "0 8px 30px rgba(26,26,46,0.3)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at top, rgba(198,93,62,0.1) 0%, transparent 60%)" }}
            />
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
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#C65D3E]">
              Signal Detected
            </span>
          </div>
          <p className="text-[13px] text-[#2D2A26] mt-1 font-medium">
            Former proposal contact promoted to VP Marketing at PE-backed manufacturer
          </p>
        </div>
        <div className="p-7 space-y-5">
          <blockquote
            className="text-[16px] text-[#3A3530] leading-[1.8] italic"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            "Hey Sarah. We sent your team a proposal back in 2020 when you were at Schebler. I see you're now VP Marketing at Graystone Manufacturing and they just closed their Series B. Congratulations. We helped a PE-backed carveout called Kensing become the #1 manufacturer in its category in 3 years using our Revenue Tower methodology. Thought this might be relevant as you build out the marketing engine. Happy to share the case study if useful."
          </blockquote>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Signal", value: "Job change + funding", color: "#C4A747" },
              { label: "Proof", value: "Kensing case study", color: "#C65D3E" },
              { label: "Context", value: "2020 proposal history", color: "#4A6741" },
            ].map((tag) => (
              <span
                key={tag.label}
                className="text-[11px] px-3 py-1.5 rounded-full"
                style={{
                  background: `${tag.color}08`,
                  border: `1px solid ${tag.color}20`,
                  color: tag.color,
                }}
              >
                <strong>{tag.label}:</strong> {tag.value}
              </span>
            ))}
          </div>
          <p className="text-[13px] italic" style={{ color: "#A09890" }}>
            30 seconds to personalize. Zero pitch. 100% relevant.
          </p>
        </div>
      </section>

      {/* Signal Types */}
      <section className="space-y-5">
        <h3
          className="text-lg font-semibold text-[#2D2A26]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Signal Types We'd Monitor
        </h3>
        <div className="flex flex-wrap gap-2">
          {["Job promotions", "Company changes", "PE acquisitions", "Industry awards", "Funding rounds", "New hires (CMO/VP Mktg)", "Expansion announcements", "LinkedIn engagement"].map((s) => (
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

      {/* Expandable */}
      <PepperExpandable title="The First Week at Pepper Group">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { day: "Monday", text: "Review 10 system-generated drafts. Each paired with a signal and proof point." },
            { day: "Tuesday–Thursday", text: "Send, edit, or skip. Each message takes 30 seconds to personalize." },
            { day: "Friday", text: "Check replies. Weekly report: messages sent, opened, replied. Pipeline activity." },
          ].map((d) => (
            <div
              key={d.day}
              className="rounded-xl p-6"
              style={{
                background: "rgba(251,248,244,0.7)",
                border: "1px solid rgba(221,213,204,0.5)",
              }}
            >
              <h4
                className="font-semibold text-[#C65D3E] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {d.day}
              </h4>
              <p className="text-[13px] text-[#6B6560] leading-relaxed">{d.text}</p>
            </div>
          ))}
        </div>
      </PepperExpandable>
    </div>
  );
}
