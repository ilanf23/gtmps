import PepperExpandable from "./PepperExpandable";

export default function PepperSignals() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="max-w-[800px] space-y-4">
        <span className="text-[12px] font-bold tracking-[0.25em] uppercase text-[#C65D3E]">LIVE SIGNALS</span>
        <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-[#2D2A26] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          Signal + Proof + Context = Response, Not Pitch
        </h2>
      </section>

      {/* Formula */}
      <section className="flex flex-wrap items-stretch gap-3 justify-center">
        {[
          { label: "Signal", text: "Their company wins an award", border: "#C4A747" },
          { label: "Proof", text: "Your Kensing case study matches", border: "#C65D3E" },
          { label: "Context", text: "You worked together in 2019", border: "#4A6741" },
        ].map((card, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="bg-white border border-[#DDD5CC] rounded-lg p-5 w-52" style={{ borderTopWidth: 4, borderTopColor: card.border }}>
              <div className="text-[11px] font-bold tracking-wider uppercase text-[#A09890] mb-2">{card.label}</div>
              <p className="text-sm text-[#2D2A26]">{card.text}</p>
            </div>
            {i < 2 && <span className="text-2xl text-[#A09890] font-light">+</span>}
          </div>
        ))}
        <div className="flex items-center gap-3">
          <span className="text-2xl text-[#A09890] font-light">=</span>
          <div className="bg-[#1A1A2E] rounded-lg p-5 w-52">
            <div className="text-[11px] font-bold tracking-wider uppercase text-[#C65D3E] mb-2">Result</div>
            <p className="text-sm text-white font-semibold">Response, Not Pitch</p>
          </div>
        </div>
      </section>

      {/* Example Email */}
      <section className="bg-white border border-[#DDD5CC] rounded-xl overflow-hidden">
        <div className="border-t-4 border-[#C65D3E] px-6 py-4 bg-[#FBF8F4]">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#C65D3E]">
            SIGNAL DETECTED: Former proposal contact promoted to VP Marketing at PE-backed manufacturer
          </span>
        </div>
        <div className="p-6 space-y-4">
          <blockquote className="text-[#2D2A26] leading-relaxed italic" style={{ fontFamily: "'Playfair Display', serif" }}>
            "Hey Sarah. We sent your team a proposal back in 2020 when you were at Schebler. I see you're now VP Marketing at Graystone Manufacturing and they just closed their Series B. Congratulations. We helped a PE-backed carveout called Kensing become the #1 manufacturer in its category in 3 years using our Revenue Tower methodology. Thought this might be relevant as you build out the marketing engine. Happy to share the case study if useful."
          </blockquote>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Signal", value: "Job change + funding" },
              { label: "Proof", value: "Kensing case study" },
              { label: "Context", value: "2020 proposal history" },
            ].map((tag) => (
              <span key={tag.label} className="text-[11px] bg-[#F3EDE6] text-[#6B6560] px-3 py-1 rounded-full">
                <strong>{tag.label}:</strong> {tag.value}
              </span>
            ))}
          </div>
          <p className="text-sm text-[#A09890] italic">30 seconds to personalize. Zero pitch. 100% relevant.</p>
        </div>
      </section>

      {/* Signal Types */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-[#2D2A26]">Signal Types We'd Monitor</h3>
        <div className="flex flex-wrap gap-2">
          {["Job promotions", "Company changes", "PE acquisitions", "Industry awards", "Funding rounds", "New hires (CMO/VP Mktg)", "Expansion announcements", "LinkedIn engagement"].map((s) => (
            <span key={s} className="text-sm bg-[#FBF8F4] border border-[#DDD5CC] text-[#2D2A26] px-4 py-2 rounded-full">{s}</span>
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
            <div key={d.day} className="bg-[#FBF8F4] rounded-lg p-5 border border-[#DDD5CC]">
              <h4 className="font-semibold text-[#C65D3E] mb-2">{d.day}</h4>
              <p className="text-sm text-[#6B6560]">{d.text}</p>
            </div>
          ))}
        </div>
      </PepperExpandable>
    </div>
  );
}
