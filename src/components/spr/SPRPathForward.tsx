import PepperAnimatedCounter from "../pepper/PepperAnimatedCounter";

export default function SPRPathForward() {
  return (
    <div className="space-y-14">
      {/* Header */}
      <section className="max-w-[820px] space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #C65D3E)" }} />
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C65D3E]">Path Forward</span>
        </div>
        <h2
          className="text-[clamp(30px,4.5vw,48px)] font-bold text-[#2D2A26] leading-[1.05] tracking-[-0.02em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          From 1 Sender to 10<span style={{ color: "#C65D3E" }}>.</span>
        </h2>
        <p className="text-[#6B6560] text-lg max-w-[640px]">
          Three options. Same system. Different scale.
        </p>
      </section>

      {/* 10 Sender Roster */}
      <section className="space-y-5">
        <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
          The 10 Sender Roster
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { name: "Kyle Gams", status: "active" },
            { name: "Tom Ryan", status: "next" },
            { name: "BDM 3", status: "planned" },
            { name: "BDM 4", status: "planned" },
            { name: "BDM 5", status: "planned" },
            { name: "BDM 6", status: "planned" },
            { name: "BDM 7", status: "planned" },
            { name: "BDM 8", status: "planned" },
            { name: "BDM 9", status: "planned" },
            { name: "BDM 10", status: "planned" },
          ].map((bdm) => (
            <div
              key={bdm.name}
              className="rounded-xl p-4 text-center"
              style={{
                background: bdm.status === "active" ? "rgba(198,93,62,0.05)" : bdm.status === "next" ? "rgba(196,167,71,0.04)" : "rgba(251,248,244,0.7)",
                border: `1px solid ${bdm.status === "active" ? "rgba(198,93,62,0.2)" : bdm.status === "next" ? "rgba(196,167,71,0.15)" : "rgba(221,213,204,0.5)"}`,
              }}
            >
              <div className="font-semibold text-[13px] text-[#2D2A26]">{bdm.name}</div>
              <div className="text-[10px] font-bold tracking-[0.1em] uppercase mt-1" style={{
                color: bdm.status === "active" ? "#C65D3E" : bdm.status === "next" ? "#C4A747" : "#A09890"
              }}>
                {bdm.status}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Options */}
      <section className="space-y-6">
        <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Engagement Options
        </h3>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              tier: "A",
              name: "Pilot",
              price: "$1,199",
              period: "/month",
              features: ["1 sender (Kyle)", "150 contacts", "Signal monitoring", "Weekly sends", "Monthly reporting"],
              highlight: false,
            },
            {
              tier: "B",
              name: "Growth",
              price: "$3,949",
              period: "/month",
              features: ["3 senders", "1,500 contacts", "Shared proof library", "Content engine (2 pieces/mo)", "Bi-weekly strategy calls"],
              highlight: true,
            },
            {
              tier: "C",
              name: "Enterprise",
              price: "$7,500+",
              period: "/month",
              features: ["10 senders", "5,000+ contacts", "Full content engine", "Anderson integration", "Executive QBRs with attribution"],
              highlight: false,
            },
          ].map((opt) => (
            <div
              key={opt.tier}
              className="rounded-xl p-7 relative overflow-hidden transition-all duration-300"
              style={{
                background: opt.highlight ? "white" : "rgba(251,248,244,0.7)",
                border: opt.highlight ? "1px solid rgba(198,93,62,0.2)" : "1px solid rgba(221,213,204,0.5)",
                boxShadow: opt.highlight ? "0 12px 40px rgba(198,93,62,0.08)" : "0 2px 8px rgba(0,0,0,0.02)",
              }}
            >
              {opt.highlight && (
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #C65D3E, #C4A747)" }} />
              )}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded" style={{
                  background: opt.highlight ? "rgba(198,93,62,0.1)" : "rgba(160,152,144,0.1)",
                  color: opt.highlight ? "#C65D3E" : "#A09890"
                }}>
                  Option {opt.tier}
                </span>
                {opt.highlight && (
                  <span className="text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded" style={{ background: "rgba(74,103,65,0.1)", color: "#4A6741" }}>
                    Recommended
                  </span>
                )}
              </div>
              <h4 className="text-[20px] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {opt.name}
              </h4>
              <div className="mt-2 mb-5">
                <span className="text-[28px] font-bold text-[#C65D3E]" style={{ fontFamily: "'Playfair Display', serif" }}>{opt.price}</span>
                <span className="text-[13px] text-[#A09890]">{opt.period}</span>
              </div>
              <ul className="text-[13px] text-[#6B6560] space-y-2">
                {opt.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-[#4A6741] mt-0.5">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="space-y-4">
        <div
          className="overflow-x-auto rounded-xl"
          style={{ border: "1px solid rgba(221,213,204,0.5)", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}
        >
          <table className="w-full text-sm border-collapse min-w-[500px]">
            <thead>
              <tr style={{ background: "#1B2A4A" }}>
                <th className="text-left p-4 font-semibold text-white/70 text-[12px]">Feature</th>
                <th className="text-center p-4 text-white/50 text-[12px]">Pilot</th>
                <th className="text-center p-4 text-[#C65D3E] font-bold text-[12px]">Growth</th>
                <th className="text-center p-4 text-white/50 text-[12px]">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Senders", "1", "3", "10"],
                ["Contacts managed", "150", "1,500", "5,000+"],
                ["Signal monitoring", "✓", "✓", "✓"],
                ["Proof library", "—", "Shared", "Full"],
                ["Content engine", "—", "2/month", "Full"],
                ["Anderson integration", "—", "—", "✓"],
                ["QBR with attribution", "Monthly", "Bi-weekly", "Executive"],
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "white" : "rgba(251,248,244,0.5)", borderTop: "1px solid rgba(221,213,204,0.3)" }}>
                  <td className="p-3 text-[13px] text-[#2D2A26] font-medium">{row[0]}</td>
                  <td className="p-3 text-center text-[13px] text-[#6B6560]">{row[1]}</td>
                  <td className="p-3 text-center text-[13px] font-semibold text-[#C65D3E]" style={{ background: "rgba(198,93,62,0.03)" }}>{row[2]}</td>
                  <td className="p-3 text-center text-[13px] text-[#6B6560]">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      </section>
    </div>
  );
}
