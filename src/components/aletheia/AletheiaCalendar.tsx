import AletheiaSectionReveal from "./AletheiaSectionReveal";

const NAVY = "#0B1A2E";
const GOLD = "#C8963E";
const OFFWHITE = "#F5F1E8";
const SLATE = "#7A8AA0";

const blocks = [
  {
    label: "CLARITY",
    quarter: "Q2 2026",
    body: "Doctrine locked. Language frozen. Guild rhythm published. Every member knows the ask.",
  },
  {
    label: "FOCUS",
    quarter: "Q3 2026",
    body: "Three engagements running concurrently. Each surface read aloud to the founder inside seventy two hours.",
  },
  {
    label: "PRESSURE",
    quarter: "Q4 2026",
    body: "First Compound retainer renewed. Guild Pulse reports a closed loop. No silent members.",
  },
  {
    label: "STANDARD",
    quarter: "Q1 2027",
    body: "Aletheia is the name founders use when the company they built starts hiding from them. Category defined.",
  },
];

const AletheiaCalendar = () => {
  return (
    <section className="py-32 md:py-48" style={{ backgroundColor: NAVY }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <AletheiaSectionReveal>
          <div
            className="text-xs tracking-[0.32em] mb-16"
            style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
          >
            FIELD 06 · CALENDAR
          </div>
        </AletheiaSectionReveal>

        <div className="space-y-px">
          {blocks.map((b, i) => (
            <AletheiaSectionReveal key={b.label} delay={i * 70}>
              <div
                className="grid grid-cols-1 md:grid-cols-12 gap-6 p-8 md:p-10 border"
                style={{ borderColor: `${GOLD}40`, backgroundColor: "rgba(245,241,232,0.02)" }}
              >
                <div className="md:col-span-3">
                  <div
                    className="text-[11px] tracking-[0.3em] mb-2"
                    style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    {b.quarter}
                  </div>
                  <div
                    className="font-bold"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.7rem",
                      color: OFFWHITE,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {b.label}
                  </div>
                </div>
                <div className="md:col-span-9">
                  <p
                    className="leading-relaxed"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.2rem",
                      color: OFFWHITE,
                      opacity: 0.92,
                    }}
                  >
                    {b.body}
                  </p>
                </div>
              </div>
            </AletheiaSectionReveal>
          ))}
        </div>

        <AletheiaSectionReveal delay={300}>
          <p
            className="mt-12 text-sm"
            style={{ color: SLATE, fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}
          >
            Four quarters. One arc. Doctrine to standard.
          </p>
        </AletheiaSectionReveal>
      </div>
    </section>
  );
};

export default AletheiaCalendar;
