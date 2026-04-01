import PepperExpandable from "./PepperExpandable";

export default function PepperRoadmap() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="max-w-[800px] space-y-4">
        <span className="text-[12px] font-bold tracking-[0.25em] uppercase text-[#C65D3E]">ROADMAP</span>
        <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-[#2D2A26] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          From 1.5 to 3.0 on the Spectrum
        </h2>
        <p className="text-[#6B6560] text-lg">
          A system that generates revenue whether Tim and George are in the room or not.
        </p>
      </section>

      {/* Today vs 12 Months */}
      <section className="grid md:grid-cols-2 gap-6 items-center">
        <div className="bg-[#F3EDE6] border border-[#DDD5CC] rounded-lg p-6 space-y-3">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#A09890]">Today</span>
          <ul className="text-sm text-[#6B6560] space-y-2">
            <li>Spectrum: <strong className="text-[#2D2A26]">1.5</strong></li>
            <li>Dormant contacts: <strong className="text-[#2D2A26]">400+</strong></li>
            <li>Signal monitoring: <strong className="text-[#8B3A3A]">None</strong></li>
            <li>Outreach: <strong className="text-[#2D2A26]">Manual</strong></li>
          </ul>
        </div>
        <div className="bg-white border-2 border-[#C65D3E] rounded-lg p-6 space-y-3 relative">
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-[#C65D3E] text-2xl hidden md:block">→</div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#C65D3E]">12 Months</span>
          <ul className="text-sm text-[#6B6560] space-y-2">
            <li>Spectrum: <strong className="text-[#4A6741]">3.0</strong></li>
            <li>Dormant: <strong className="text-[#4A6741]">120 (280 reactivated)</strong></li>
            <li>Signal monitoring: <strong className="text-[#4A6741]">Active</strong></li>
            <li>Outreach: <strong className="text-[#4A6741]">System-driven</strong></li>
          </ul>
        </div>
      </section>

      {/* Quarterly */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Quarterly Roadmap
        </h3>
        <div className="space-y-3">
          {[
            { q: "Q1", text: "50-contact pilot. Manufacturing beachhead. Build the proof." },
            { q: "Q2", text: "Full Dead Zone activation. First reactivated client." },
            { q: "Q3", text: "Revenue Tower + Signal-Activated Growth bundle." },
            { q: "Q4", text: "Channel play live. Flywheel turning." },
          ].map((item) => (
            <div key={item.q} className="bg-white border border-[#DDD5CC] rounded-lg p-5 border-l-4 border-l-[#C65D3E]">
              <span className="text-sm font-bold text-[#C65D3E]">{item.q}</span>
              <p className="text-sm text-[#2D2A26] mt-1">{item.text}</p>
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
            <div key={c.title} className="bg-[#FBF8F4] rounded-lg p-5 border border-[#DDD5CC]">
              <h4 className="font-semibold text-[#2D2A26] mb-2">{c.title}</h4>
              <p className="text-sm text-[#6B6560]">{c.text}</p>
            </div>
          ))}
        </div>
      </PepperExpandable>
    </div>
  );
}
