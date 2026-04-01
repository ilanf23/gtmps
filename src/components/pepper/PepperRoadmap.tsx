import PepperExpandable from "./PepperExpandable";

export default function PepperRoadmap() {
  return (
    <div className="space-y-20">
      {/* Header */}
      <section className="max-w-[820px] space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #C65D3E)" }} />
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C65D3E]">Roadmap</span>
        </div>
        <h2
          className="text-[clamp(30px,4.5vw,48px)] font-bold text-[#2D2A26] leading-[1.05] tracking-[-0.02em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          From 1.5 to 3.0 on the Spectrum<span style={{ color: "#C65D3E" }}>.</span>
        </h2>
        <p className="text-[#6B6560] text-lg max-w-[600px]">
          A system that generates revenue whether Tim and George are in the room or not.
        </p>
      </section>

      {/* Today vs 12 Months */}
      <section className="grid md:grid-cols-2 gap-8 items-stretch relative">
        {/* Connecting arrow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #C65D3E, #C4A747)",
              boxShadow: "0 4px 20px rgba(198,93,62,0.3)",
            }}
          >
            <span className="text-white text-lg">→</span>
          </div>
        </div>

        <div
          className="rounded-xl p-7 space-y-5"
          style={{
            background: "rgba(243,237,230,0.5)",
            border: "1px solid rgba(221,213,204,0.5)",
          }}
        >
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A09890]">Today</span>
          <ul className="text-sm text-[#6B6560] space-y-3">
            <li className="flex justify-between">Spectrum <strong className="text-[#2D2A26]">1.5</strong></li>
            <li className="flex justify-between">Dormant contacts <strong className="text-[#8B3A3A]">400+</strong></li>
            <li className="flex justify-between">Signal monitoring <strong className="text-[#8B3A3A]">None</strong></li>
            <li className="flex justify-between">Outreach <strong className="text-[#2D2A26]">Manual</strong></li>
          </ul>
        </div>
        <div
          className="rounded-xl p-7 space-y-5 relative overflow-hidden"
          style={{
            background: "white",
            border: "1px solid rgba(198,93,62,0.15)",
            boxShadow: "0 8px 30px rgba(198,93,62,0.06)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #C65D3E, #C4A747)" }} />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C65D3E]">12 Months</span>
          <ul className="text-sm text-[#6B6560] space-y-3">
            <li className="flex justify-between">Spectrum <strong className="text-[#4A6741]">3.0</strong></li>
            <li className="flex justify-between">Dormant <strong className="text-[#4A6741]">120 (280 reactivated)</strong></li>
            <li className="flex justify-between">Signal monitoring <strong className="text-[#4A6741]">Active</strong></li>
            <li className="flex justify-between">Outreach <strong className="text-[#4A6741]">System-driven</strong></li>
          </ul>
        </div>
      </section>

      {/* Quarterly */}
      <section className="space-y-6">
        <h3
          className="text-[clamp(22px,3vw,30px)] font-bold text-[#2D2A26]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Quarterly Roadmap
        </h3>
        <div className="space-y-4">
          {[
            { q: "Q1", text: "50-contact pilot. Manufacturing beachhead. Build the proof.", highlight: true },
            { q: "Q2", text: "Full Dead Zone activation. First reactivated client.", highlight: false },
            { q: "Q3", text: "Revenue Tower + Signal-Activated Growth bundle.", highlight: false },
            { q: "Q4", text: "Channel play live. Flywheel turning.", highlight: false },
          ].map((item) => (
            <div
              key={item.q}
              className="rounded-xl p-6 flex items-start gap-5 transition-all duration-300"
              style={{
                background: item.highlight ? "rgba(198,93,62,0.03)" : "white",
                border: `1px solid ${item.highlight ? "rgba(198,93,62,0.12)" : "rgba(221,213,204,0.5)"}`,
                borderLeft: `4px solid ${item.highlight ? "#C65D3E" : "rgba(198,93,62,0.3)"}`,
                boxShadow: item.highlight ? "0 4px 20px rgba(198,93,62,0.05)" : "0 2px 8px rgba(0,0,0,0.02)",
              }}
            >
              <span
                className="text-[15px] font-bold shrink-0 w-8"
                style={{ color: "#C65D3E", fontFamily: "'Playfair Display', serif" }}
              >
                {item.q}
              </span>
              <p className="text-[14px] text-[#2D2A26] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Expandable */}
      <PepperExpandable title="The Channel Play">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "The Offering", text: "\"We did this for ourselves first.\" Pepper Group becomes the proof case for signal-activated growth." },
            { title: "The Revenue Model", text: "Tech wedge opens the door. Consulting revenue follows. Two revenue streams from one system." },
            { title: "The Competitive Moat", text: "No other Chicago B2B agency has relationship activation technology. First-mover advantage." },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-xl p-6"
              style={{
                background: "rgba(251,248,244,0.7)",
                border: "1px solid rgba(221,213,204,0.5)",
              }}
            >
              <h4
                className="font-semibold text-[#2D2A26] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {c.title}
              </h4>
              <p className="text-[13px] text-[#6B6560] leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </PepperExpandable>
    </div>
  );
}
