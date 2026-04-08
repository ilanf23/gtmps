const QUOTES = [
  {
    text: "There is no GTM framework for professional services. Even among professional services marketers, we were using the same words, but we had different definitions of those words.",
    name: "Rebecca Butman",
    role: "EVP Marketing",
  },
  {
    text: "You can only ask and you can only shove your way into so many things. And I had realized that I had shoved my way into so many aspects of the business that I was like, I cannot touch that hot stove again.",
    name: "Rebecca Butman",
    role: "EVP Marketing",
  },
  {
    text: "New BDMs take two years before someone can actually sell something. If they are just relying on their past book of business and they have a non-compete for the first year, and then it takes them another year to sell anything, we cannot scale quickly.",
    name: "Rebecca Butman",
    role: "EVP Marketing",
  },
  {
    text: "Everything in our CRM, we have about 59,000 contacts. I do not think they are nearly all worth going to. We have about 5,000 that BDMs are actively, over the course of several years, been in contact with.",
    name: "Brian Chorba",
    role: "Marketing Analyst and Salesforce Administrator",
  },
  {
    text: "Our sales team is very seasoned. They come here with a book of business. They sell to that book of business. They occasionally expand their relationships.",
    name: "Rebecca Butman",
    role: "EVP Marketing",
  },
];

const ICP_TABLE = [
  { dimension: "Department", value: "IT" },
  { dimension: "Organization size", value: "Medium to enterprise" },
  { dimension: "Geography", value: "Not specified" },
  { dimension: "Buying trigger", value: "Not specified" },
  { dimension: "Decision maker title", value: "Not specified" },
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

export default function SPRWhoYouAre() {
  return (
    <div className="space-y-12">
      {/* Session Voice */}
      <section id="map-field-2" style={{ scrollMarginTop: "120px" }}>
        <FieldLabel num={2} name="SESSION VOICE" status="complete" />
        <h2 className="text-[28px] md:text-[36px] font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#2D2A26" }}>
          What You Said
        </h2>
        <p className="text-[14px] mb-8" style={{ color: "#6B6560" }}>
          Five verbatim phrases from the discovery session. Not paraphrased. Your exact words.
        </p>
        <div className="space-y-4">
          {QUOTES.map((q, i) => (
            <div
              key={i}
              className="rounded-xl p-6"
              style={{
                background: "rgba(255,255,255,0.8)",
                borderLeft: "4px solid #C8963E",
                border: "1px solid rgba(221,213,204,0.4)",
                borderLeftWidth: "4px",
                borderLeftColor: "#C8963E",
              }}
            >
              <p
                className="text-[15px] md:text-[16px] leading-relaxed mb-3"
                style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#2D2A26" }}
              >
                "{q.text}"
              </p>
              <p className="text-[13px]">
                <strong style={{ color: "#2D2A26" }}>{q.name}</strong>
                <span style={{ color: "#A09890" }}>, {q.role}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The Core */}
      <section id="map-field-1" style={{ scrollMarginTop: "120px" }}>
        <FieldLabel num={1} name="THE CORE" status="incomplete" />
        <h2 className="text-[24px] md:text-[30px] font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "#2D2A26" }}>
          The Core: Purpose and Niche
        </h2>
        <p className="text-[14px] mb-6" style={{ color: "#6B6560" }}>
          The Core is two sentences. The first is your purpose, why your firm exists. The second is your niche, who you serve better than anyone. If both halves cannot be stated from memory in under ten syllables each, The Core is not yet set.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(221,213,204,0.4)" }}>
            <h4 className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-3" style={{ color: "#A09890" }}>
              CURRENT POSITIONING
            </h4>
            <p className="text-[18px] font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "#2D2A26" }}>
              "Delivering Beyond the Build"
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "#6B6560" }}>
              SPR's positioning lives in individual BDM relationships, not in a system. Rebecca described the promise: seasoned technologists, knowledge transfer throughout the process, a flexible engagement model. But she also said: "I am not naive to think that truly what we have is that different."
            </p>
          </div>
          <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(221,213,204,0.4)" }}>
            <h4 className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-3" style={{ color: "#C8963E" }}>
              WHAT WE STILL NEED
            </h4>
            <ul className="space-y-2 text-[13px]" style={{ color: "#2D2A26" }}>
              <li className="flex items-start gap-2">
                <span style={{ color: "#C8963E" }}>•</span> Purpose sentence
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#C8963E" }}>•</span> Niche sentence
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#C8963E" }}>•</span> Validation question
              </li>
            </ul>
          </div>
        </div>
        <p className="text-[13px] mt-4 italic" style={{ color: "#A09890" }}>
          The Core is the first field in the MAP. Until it is set, everything else is built on a foundation that shifts depending on who is in the room.
        </p>
      </section>

      {/* Core Values */}
      <section id="map-field-4" style={{ scrollMarginTop: "120px" }}>
        <FieldLabel num={4} name="CORE VALUES" status="incomplete" />
        <p className="text-[14px]" style={{ color: "#6B6560" }}>
          Not discussed in the discovery session. Core Values feed into The Core, they are not a standalone exercise. To be captured in a follow-up conversation.
        </p>
      </section>

      {/* ICP Lock */}
      <section id="map-field-5" style={{ scrollMarginTop: "120px" }}>
        <FieldLabel num={5} name="ICP LOCK" status="partial" />
        <h2 className="text-[24px] md:text-[30px] font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: "#2D2A26" }}>
          Who You Sell To
        </h2>

        <div className="rounded-xl overflow-hidden mb-6" style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(221,213,204,0.4)" }}>
          <div className="px-6 py-3" style={{ background: "rgba(200,150,62,0.06)", borderBottom: "1px solid rgba(221,213,204,0.3)" }}>
            <h4 className="text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: "#C8963E" }}>
              WHAT WE KNOW
            </h4>
          </div>
          <table className="w-full">
            <tbody>
              {ICP_TABLE.map((row) => (
                <tr key={row.dimension} style={{ borderBottom: "1px solid rgba(221,213,204,0.3)" }}>
                  <td className="px-6 py-3 text-[13px] font-medium" style={{ color: "#6B6560" }}>{row.dimension}</td>
                  <td className="px-6 py-3 text-[13px]" style={{ color: row.value === "Not specified" ? "#A09890" : "#2D2A26", fontStyle: row.value === "Not specified" ? "italic" : "normal" }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(221,213,204,0.4)" }}>
            <h4 className="text-[12px] font-semibold mb-2" style={{ color: "#2D2A26" }}>What is changing</h4>
            <p className="text-[13px] leading-relaxed" style={{ color: "#6B6560" }}>
              AI is expanding the buyer beyond IT. Rebecca noted that conversations are starting with business units, not just technology leaders. The Anderson acquisition adds new verticals and geographies that SPR has not historically served. The ICP needs to reflect both the traditional IT buyer and the emerging AI buyer.
            </p>
          </div>
          <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(221,213,204,0.4)" }}>
            <h4 className="text-[12px] font-semibold mb-2" style={{ color: "#2D2A26" }}>What we still need</h4>
            <p className="text-[13px] leading-relaxed" style={{ color: "#6B6560" }}>
              A locked ICP requires specificity: title, company size range, buying trigger, and geography. Until those are defined, every campaign and signal strategy is broad by default.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
