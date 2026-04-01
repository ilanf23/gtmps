import PepperAnimatedCounter from "./PepperAnimatedCounter";
import PepperSpectrumBar from "./PepperSpectrumBar";
import PepperDotMatrix from "./PepperDotMatrix";
import PepperDeadZoneCalc from "./PepperDeadZoneCalc";
import PepperOrbitMap from "./PepperOrbitMap";
import PepperExpandable from "./PepperExpandable";

export default function PepperOrbits() {
  return (
    <div className="space-y-16">
      {/* Spectrum */}
      <section className="space-y-6">
        <span className="text-[12px] font-bold tracking-[0.25em] uppercase text-[#C65D3E]">THE SPECTRUM</span>
        <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-[#2D2A26] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          You're at 1.5 out of 4
        </h2>
        <p className="text-[#6B6560] text-lg">
          Not because the foundation is weak. Because the activation layer doesn't exist yet.
        </p>
        <PepperSpectrumBar />
      </section>

      {/* Have vs Gap */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#DDD5CC] rounded-lg p-6">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#4A6741] mb-3 block">What You Have</span>
          <ul className="text-sm text-[#6B6560] space-y-2">
            {["BtoB Top Agency", "Revenue Tower (proprietary IP)", "EOS since 2012", "95% client retention", "140+ GDUSA awards", "Booth MBA credential", "32 years of depth", "$200M BASF win"].map((item) => (
              <li key={item} className="flex items-start gap-2"><span className="text-[#4A6741] mt-0.5">✓</span>{item}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-[#DDD5CC] rounded-lg p-6">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#8B3A3A] mb-3 block">The Gap</span>
          <ul className="text-sm text-[#6B6560] space-y-2">
            {["No loaded CRM", "No signal monitoring", "No reactivation content", "No cadence system", "No migration data"].map((item) => (
              <li key={item} className="flex items-start gap-2"><span className="text-[#8B3A3A] mt-0.5">✗</span>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* George's 4 Networks */}
      <section className="space-y-6">
        <h2 className="text-[clamp(24px,3.5vw,36px)] font-bold text-[#2D2A26] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          George's 4 Institutional Relationship Engines
        </h2>
        <h3 className="text-xl font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
          The Real Dead Zone Is Bigger Than 400
        </h3>
        <p className="text-[#6B6560]">
          Each of these networks represents hundreds of relationships George has earned. None are being systematically activated.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { num: 500, role: "Past President", name: "AMA Chicago", insight: "Premier marketing network in Chicago" },
            { num: 300, role: "Advisory Council President", name: "DePaul University", insight: "Academic and alumni connections" },
            { num: 100, role: "Board Member", name: "CEO Roundtable Chicago", insight: "Peer CEO relationships" },
            { num: 200, role: "Team Mentor Since 2012", name: "Junto Institute", insight: "Founder and scaling-company network" },
          ].map((n) => (
            <div key={n.name} className="bg-white border-t-4 border-t-[#C65D3E] border border-[#DDD5CC] rounded-lg p-5">
              <div className="text-[36px] font-bold text-[#C65D3E]" style={{ fontFamily: "'Playfair Display', serif" }}>
                <PepperAnimatedCounter end={n.num} suffix="+" />
              </div>
              <div className="text-[10px] font-bold tracking-wider uppercase text-[#A09890] mt-1">{n.role}</div>
              <div className="font-semibold text-[#2D2A26] mt-2">{n.name}</div>
              <div className="text-sm text-[#6B6560] mt-1">{n.insight}</div>
            </div>
          ))}
        </div>
        <div className="bg-[#FBF8F4] border border-[#DDD5CC] rounded-lg p-4 text-center text-sm text-[#6B6560]">
          <strong className="text-[#2D2A26]">1,100+ estimated relationships</strong> across George's networks alone, before counting Tim's 32 years
        </div>
      </section>

      {/* Dead Zone */}
      <section className="space-y-6">
        <h2 className="text-[clamp(24px,3.5vw,36px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
          <PepperAnimatedCounter end={400} suffix="+" /> relationships sitting in silence
        </h2>
        <p className="text-[#6B6560]">
          And that's the conservative number. With George's networks, the real number is likely 1,500+.
        </p>
        <PepperDotMatrix />
      </section>

      {/* Calculator */}
      <PepperDeadZoneCalc />

      {/* Orbit Map */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>Orbit Map</h3>
        <PepperOrbitMap />
      </section>

      {/* Expandables */}
      <PepperExpandable title="Pepper Group's ICP: Who Lives in Each Orbit">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "Manufacturing Decision Makers", text: "VP Marketing, CMO, and GM roles at mid-market manufacturers ($20M–$500M). Often PE-backed." },
            { title: "PE Operating Partners", text: "Portfolio operators seeking marketing infrastructure for newly acquired B2B companies." },
            { title: "B2B Services Leaders", text: "Managing partners and BD leaders at professional services firms exploring systematic growth." },
          ].map((c) => (
            <div key={c.title} className="bg-[#FBF8F4] rounded-lg p-5 border border-[#DDD5CC]">
              <h4 className="font-semibold text-[#2D2A26] mb-2 text-sm">{c.title}</h4>
              <p className="text-sm text-[#6B6560]">{c.text}</p>
            </div>
          ))}
        </div>
      </PepperExpandable>
    </div>
  );
}
