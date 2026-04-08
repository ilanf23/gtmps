import SPRDeadZoneCalc from "./SPRDeadZoneCalc";

const STATS = [
  { stat: "Total CRM contacts", value: "59,000", source: "Brian" },
  { stat: "Contacts BDMs have worked", value: "~5,000", source: "Brian" },
  { stat: "Active in marketing automation", value: "~4,000 to 5,000", source: "Brian" },
  { stat: "Dormant relationships", value: "8,000 to 10,000", source: "Brian and Rebecca" },
  { stat: "SPR's dormancy definition", value: "2 years", source: "Rebecca" },
  { stat: "Most firms' dormancy definition", value: "90 days", source: "Industry standard" },
];

const STRENGTHS = [
  "Seasoned consultants who transfer knowledge, not just deliver code",
  "Flexible engagement models (staff aug through managed services)",
  "53 years of continuity and reputation",
  "Strong individual BDM relationships",
  "Anderson acquisition adds scale and new capabilities",
];

const GAPS = [
  "No system to maintain relationships at scale",
  "BDM-dependent growth model cannot scale quickly",
  "Two-year ramp time for new BDMs",
  "CRM is a record system, not an activation system",
  "No consistent signal detection or outreach cadence",
];

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

export default function SPRSittingOn() {
  return (
    <div className="space-y-12">
      {/* Dead Zone Estimate */}
      <section id="map-field-8" style={{ scrollMarginTop: "120px" }}>
        <FieldLabel num={8} name="DEAD ZONE ESTIMATE" status="partial" />
        <h2 className="text-[28px] md:text-[36px] font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: "#2D2A26" }}>
          The Revenue Already in Your CRM
        </h2>

        {/* Stats table */}
        <div className="rounded-xl overflow-hidden mb-8" style={{ background: "#1B2A4A" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(200,150,62,0.2)" }}>
                <th className="text-left px-6 py-3 text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: "#C8963E" }}>Stat</th>
                <th className="text-left px-6 py-3 text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: "#C8963E" }}>Value</th>
                <th className="text-left px-6 py-3 text-[10px] font-semibold tracking-[0.12em] uppercase hidden sm:table-cell" style={{ color: "#C8963E" }}>Source</th>
              </tr>
            </thead>
            <tbody>
              {STATS.map((row) => (
                <tr key={row.stat} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td className="px-6 py-3 text-[13px]" style={{ color: "rgba(255,255,255,0.7)" }}>{row.stat}</td>
                  <td className="px-6 py-3 text-[13px] font-semibold" style={{ color: "#fff" }}>{row.value}</td>
                  <td className="px-6 py-3 text-[12px] italic hidden sm:table-cell" style={{ color: "rgba(255,255,255,0.4)" }}>{row.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SPRDeadZoneCalc />

        <p className="text-[14px] leading-relaxed mt-6" style={{ color: "#6B6560" }}>
          Every one of these contacts chose to engage with SPR at some point. They are not strangers. They are relationships that went quiet because nobody had a system to maintain them. Existing clients convert at 60% to 70%, spend 31% more per engagement, and cost seven times less to reactivate than a new client costs to acquire.
        </p>
        <p className="text-[12px] mt-3 italic" style={{ color: "#A09890" }}>
          Dead Zone Value is partial because we do not yet know SPR's average engagement size. With that number, this field is complete.
        </p>
      </section>

      {/* Strengths and Gaps */}
      <section>
        <h2 className="text-[24px] md:text-[30px] font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: "#2D2A26" }}>
          What We Heard: Strengths and Gaps
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl p-6" style={{ background: "rgba(74,103,65,0.06)", border: "1px solid rgba(74,103,65,0.15)" }}>
            <h4 className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: "#4A6741" }}>
              STRENGTHS
            </h4>
            <ul className="space-y-3">
              {STRENGTHS.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: "#2D2A26" }}>
                  <span style={{ color: "#4A6741" }}>•</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl p-6" style={{ background: "rgba(198,93,62,0.04)", border: "1px solid rgba(198,93,62,0.12)" }}>
            <h4 className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: "#C65D3E" }}>
              GAPS
            </h4>
            <ul className="space-y-3">
              {GAPS.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: "#2D2A26" }}>
                  <span style={{ color: "#C65D3E" }}>•</span> {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Spectrum Position */}
      <section id="map-field-7" style={{ scrollMarginTop: "120px" }}>
        <FieldLabel num={7} name="SPECTRUM POSITION" status="partial" />
        <h2 className="text-[24px] md:text-[30px] font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#2D2A26" }}>
          Where SPR Sits Today
        </h2>
        <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(221,213,204,0.4)" }}>
          <p className="text-[14px] leading-relaxed" style={{ color: "#6B6560" }}>
            SPR operates primarily through relationship-driven selling. Growth depends on individual BDMs and their personal networks. There is marketing infrastructure in place (Pardot, Salesforce, a content calendar) but it functions more as support than as an independent growth engine. The firm sits closer to the relationship end of the spectrum than the system end. The Anderson acquisition could shift this, but only if the integration includes a deliberate go-to-market operating system, not just combined headcount.
          </p>
        </div>
      </section>

      {/* Orbit Priority */}
      <section id="map-field-9" style={{ scrollMarginTop: "120px" }}>
        <FieldLabel num={9} name="ORBIT PRIORITY" status="complete" />
        <h2 className="text-[24px] md:text-[30px] font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#2D2A26" }}>
          Where to Focus First
        </h2>
        <div className="rounded-xl p-6" style={{ background: "rgba(200,150,62,0.05)", border: "1px solid rgba(200,150,62,0.15)" }}>
          <p className="text-[14px] leading-relaxed" style={{ color: "#2D2A26" }}>
            The 8,000 to 10,000 dormant relationships in SPR's CRM are the highest-leverage opportunity. These are not cold prospects. They are people who chose to work with SPR and then went quiet. Reactivating even a small percentage of this group would generate more revenue, faster, and at lower cost than any net-new acquisition campaign. This is where the system should start.
          </p>
        </div>
      </section>
    </div>
  );
}
