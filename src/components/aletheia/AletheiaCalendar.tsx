import AletheiaSectionReveal from "./AletheiaSectionReveal";

const NAVY = "var(--color-surface-page)";       // dark theme: Deep Forest
const GOLD = "var(--color-accent-primary)";    // dark theme: lifted Olive Gold
const OFFWHITE = "var(--color-text-primary)";   // dark theme: Sage Light
const SLATE = "var(--color-text-tertiary)";    // dark theme: Sage Muted

const cards = [
  {
    range: "DAY 0 TO 14",
    label: "CLARITY",
    body: "Diagnostic complete. Truth session delivered. The founder sees the 445 nodes for the first time.",
  },
  {
    range: "DAY 15 TO 45",
    label: "FOCUS",
    body: "The top 3 failure nodes are under active repair. Operator is embedded. Standard is set.",
  },
  {
    range: "DAY 46 TO 75",
    label: "PRESSURE",
    body: "The system holds under load. Pace increases. Accountability is non negotiable.",
  },
  {
    range: "DAY 76 TO 90",
    label: "STANDARD",
    body: "Coherence verified. Founder has capacity back. Guild of Honor referral triggered.",
  },
];

const AletheiaCalendar = () => {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: NAVY }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <AletheiaSectionReveal>
          <div
            className="text-xs tracking-[0.32em] mb-4"
            style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
          >
            FIELD 06 · 90 DAY CALENDAR
          </div>
          <p
            className="mb-16 text-lg"
            style={{ color: SLATE, fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}
          >
            In the language of the Doctrine.
          </p>
        </AletheiaSectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <AletheiaSectionReveal key={c.label} delay={i * 70}>
              <article
                className="h-full border p-8"
                style={{
                  borderColor: `${GOLD}40`,
                  backgroundColor: "rgba(245,241,232,0.02)",
                }}
              >
                <div
                  className="text-[11px] tracking-[0.3em] mb-5 font-semibold"
                  style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
                >
                  {c.range}
                </div>
                <h3
                  className="font-bold mb-6"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2rem",
                    color: OFFWHITE,
                    letterSpacing: "0.04em",
                    lineHeight: 1.05,
                  }}
                >
                  {c.label}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "1.05rem",
                    color: OFFWHITE,
                    opacity: 0.88,
                  }}
                >
                  {c.body}
                </p>
              </article>
            </AletheiaSectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AletheiaCalendar;
