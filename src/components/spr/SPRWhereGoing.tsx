function FieldLabel({ num, name, status }: { num: number; name: string; status: "complete" | "partial" | "incomplete" }) {
  const s = status === "complete"
    ? { background: "#C8963E", color: "#fff", border: "1px solid #C8963E" }
    : status === "partial"
    ? { background: "transparent", color: "#C8963E", border: "1px solid #C8963E" }
    : { background: "transparent", color: "#A09890", border: "1px solid #DDD5CC" };
  const label = status === "complete" ? "Complete" : status === "partial" ? "Partial" : "Incomplete";
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: "#A09890" }}>
        MAP FIELD {num}: {name}
      </span>
      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={s}>
        {label}
      </span>
    </div>
  );
}

const DATA_REQUESTS = [
  "Average engagement size (dollar value) for SPR's top 20 clients",
  "Total number of unique clients served in the last 24 months",
  "Breakdown of revenue by service line (staff aug vs. managed services vs. consulting)",
  "List of BDMs and their approximate book of business size",
  "Anderson's top 10 client accounts and whether any overlap with SPR",
];

export default function SPRWhereGoing() {
  return (
    <div className="space-y-12">
      {/* Corporate Objectives */}
      <section>
        <FieldLabel num={3} name="CORPORATE OBJECTIVES" status="partial" />
        <h2 className="text-[28px] md:text-[36px] font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: "#2D2A26" }}>
          What SPR Is Trying to Achieve
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(221,213,204,0.4)" }}>
            <h4 className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-3" style={{ color: "#C8963E" }}>
              OBJECTIVE 1: SPR P&L
            </h4>
            <p className="text-[14px] leading-relaxed" style={{ color: "#2D2A26" }}>
              Grow SPR's revenue independently. Rebecca described clear P&L ownership: SPR needs to demonstrate growth on its own metrics, not just as part of the Anderson portfolio. This means activating dormant relationships, shortening BDM ramp time, and building a system that generates pipeline without relying solely on personal networks.
            </p>
          </div>
          <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(221,213,204,0.4)" }}>
            <h4 className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-3" style={{ color: "#C8963E" }}>
              OBJECTIVE 2: ANDERSON INTEGRATION
            </h4>
            <p className="text-[14px] leading-relaxed" style={{ color: "#2D2A26" }}>
              Integrate with Anderson's broader go-to-market. Doug and Tom are looking at the combined entity. Anderson's 10 firms need a unified market approach. SPR could be the proving ground: if a market activation system works here, it scales across the portfolio.
            </p>
          </div>
        </div>

        <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(221,213,204,0.4)" }}>
          <h4 className="text-[12px] font-semibold mb-3" style={{ color: "#2D2A26" }}>What we still need</h4>
          <ul className="space-y-2 text-[13px]" style={{ color: "#6B6560" }}>
            <li className="flex items-start gap-2"><span style={{ color: "#C8963E" }}>•</span> Specific revenue targets for the next 12 months</li>
            <li className="flex items-start gap-2"><span style={{ color: "#C8963E" }}>•</span> How Anderson measures success for its portfolio companies</li>
            <li className="flex items-start gap-2"><span style={{ color: "#C8963E" }}>•</span> Whether SPR's growth target is independent or consolidated with Anderson</li>
          </ul>
        </div>
      </section>

      {/* Vision State */}
      <section>
        <FieldLabel num={11} name="VISION STATE" status="incomplete" />
        <h2 className="text-[24px] md:text-[30px] font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#2D2A26" }}>
          Where SPR Wants to Be in Three Years
        </h2>
        <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(221,213,204,0.4)" }}>
          <p className="text-[14px] leading-relaxed mb-4" style={{ color: "#6B6560" }}>
            Not discussed in the discovery session. The Vision State is the clearest version of where SPR wants to be in three years, stated in one paragraph. It is not a mission statement. It is a specific, measurable description of the firm's position in the market.
          </p>
          <p className="text-[13px] font-medium mb-3" style={{ color: "#2D2A26" }}>Three questions to answer:</p>
          <ul className="space-y-2 text-[13px]" style={{ color: "#6B6560" }}>
            <li className="flex items-start gap-2"><span style={{ color: "#C8963E" }}>1.</span> What does SPR look like in three years if everything goes right?</li>
            <li className="flex items-start gap-2"><span style={{ color: "#C8963E" }}>2.</span> What is the relationship between SPR and Anderson in that future state?</li>
            <li className="flex items-start gap-2"><span style={{ color: "#C8963E" }}>3.</span> What would need to be true about SPR's go-to-market for that vision to be real?</li>
          </ul>
        </div>
      </section>

      {/* Closing */}
      <section>
        <div className="rounded-2xl overflow-hidden" style={{ background: "#1B2A4A" }}>
          <div className="p-8 md:p-10">
            <h2 className="text-[24px] md:text-[30px] font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#fff" }}>
              Did We Get This Right?
            </h2>
            <p className="text-[14px] leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
              This MAP was built from a single 58-minute conversation. Five fields are partially captured. Five are incomplete. These questions would help us finish it.
            </p>

            <ol className="space-y-3 mb-8">
              {[
                "Is the Dead Zone estimate of 8,000 to 10,000 dormant contacts accurate, or is the real number higher?",
                "What is SPR's average engagement size? This is the single most important missing input.",
                "Does the ICP need to change to reflect the Anderson acquisition, or is IT leadership still the primary buyer?",
                "Is the executive movement signal the right starting point, or is there a more common trigger SPR sees?",
              ].map((q, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px]" style={{ color: "rgba(255,255,255,0.85)" }}>
                  <span className="font-bold" style={{ color: "#C8963E" }}>{i + 1}.</span> {q}
                </li>
              ))}
            </ol>

            <div className="rounded-xl p-6 mb-8" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h4 className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: "#C8963E" }}>
                DATA REQUESTS
              </h4>
              <ul className="space-y-2">
                {DATA_REQUESTS.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <span style={{ color: "#C8963E" }}>•</span> {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center">
              <a
                href="mailto:adam@mabbly.com?subject=SPR MAP Review"
                className="inline-flex items-center px-8 py-3.5 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-300 hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #C8963E, #C65D3E)",
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(200,150,62,0.3)",
                }}
              >
                Schedule 15 Min MAP Review
              </a>
            </div>
          </div>
          <div className="px-8 py-4 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[12px] italic" style={{ color: "rgba(255,255,255,0.35)" }}>
              Prepared within 24 hours of the discovery session on April 6, 2026.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
