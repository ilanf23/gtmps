export default function SPRRoadmap() {
  return (
    <div className="space-y-14">
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
          From 1 Sender to 10<span style={{ color: "#C65D3E" }}>.</span>
        </h2>
        <p className="text-[#6B6560] text-lg max-w-[600px]">
          A system that compounds trust into revenue whether any single person is in the room or not.
        </p>
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
            <li className="flex justify-between">Shared signals <strong className="text-[#8B3A3A]">None</strong></li>
            <li className="flex justify-between">Proof distribution <strong className="text-[#8B3A3A]">Website only</strong></li>
            <li className="flex justify-between">Dormancy definition <strong className="text-[#8B3A3A]">2 years</strong></li>
            <li className="flex justify-between">System type <strong className="text-[#8B3A3A]">Person dependent</strong></li>
          </ul>
        </div>
        <div className="rounded-xl p-7 space-y-5 relative overflow-hidden" style={{ background: "white", border: "1px solid rgba(198,93,62,0.15)", boxShadow: "0 8px 30px rgba(198,93,62,0.06)" }}>
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #C65D3E, #C4A747)" }} />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C65D3E]">12 Months</span>
          <ul className="text-sm text-[#6B6560] space-y-3">
            <li className="flex justify-between">Senders <strong className="text-[#4A6741]">10</strong></li>
            <li className="flex justify-between">Contacts <strong className="text-[#4A6741]">5,000+</strong></li>
            <li className="flex justify-between">Shared signals <strong className="text-[#4A6741]">Unified signal matrix</strong></li>
            <li className="flex justify-between">Proof distribution <strong className="text-[#4A6741]">In every outreach</strong></li>
            <li className="flex justify-between">Dormancy definition <strong className="text-[#4A6741]">90 day activation cycles</strong></li>
            <li className="flex justify-between">System type <strong className="text-[#4A6741]">Process dependent</strong></li>
          </ul>
        </div>
      </section>

      {/* Quarterly */}
      <section className="space-y-6">
        <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Quarterly Roadmap
        </h3>
        <div className="space-y-4">
          {[
            {
              q: "Q2 2026",
              stage: "PROVE",
              items: ["Expand Kyle to 500 contacts", "Add Tom Ryan as 2nd sender", "Scale Kristen's review workflow", "First Anderson briefing"],
              highlight: true,
            },
            {
              q: "Q3 2026",
              stage: "DESIGN",
              items: ["5 BDMs active", "Shared proof library (20+ case studies)", "Content engine: 2 pieces/month", "Anderson integration planning"],
              highlight: false,
            },
            {
              q: "Q4 2026",
              stage: "ACTIVATE",
              items: ["All 10 BDMs live", "2,500+ contacts managed", "QBRs with attribution", "Anderson pilot: 2 firms"],
              highlight: false,
            },
            {
              q: "Q1 2027",
              stage: "COMPOUND",
              items: ["Cross BDM signal sharing", "Anderson full rollout", "Thought leadership gap closed", "Dead Zone under 2,000"],
              highlight: false,
            },
          ].map((item) => (
            <div
              key={item.q}
              className="rounded-xl p-6 transition-all duration-300"
              style={{
                background: item.highlight ? "rgba(198,93,62,0.03)" : "white",
                border: `1px solid ${item.highlight ? "rgba(198,93,62,0.12)" : "rgba(221,213,204,0.5)"}`,
                borderLeft: `4px solid ${item.highlight ? "#C65D3E" : "rgba(198,93,62,0.3)"}`,
                boxShadow: item.highlight ? "0 4px 20px rgba(198,93,62,0.05)" : "0 2px 8px rgba(0,0,0,0.02)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[15px] font-bold text-[#C65D3E]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {item.q}
                </span>
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded" style={{ background: "rgba(198,93,62,0.08)", color: "#C65D3E" }}>
                  {item.stage}
                </span>
                {item.highlight && (
                  <span className="text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded" style={{ background: "rgba(74,103,65,0.1)", color: "#4A6741" }}>
                    Current
                  </span>
                )}
              </div>
              <ul className="text-[14px] text-[#2D2A26] space-y-1.5">
                {item.items.map((it) => (
                  <li key={it} className="flex items-start gap-2">
                    <span className="text-[#C65D3E] mt-1">&#8226;</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
