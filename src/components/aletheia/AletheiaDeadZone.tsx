import AletheiaSectionReveal from "./AletheiaSectionReveal";

const NAVY = "#0B1A2E";
const GOLD = "#C8963E";
const OFFWHITE = "#F5F1E8";
const SLATE = "#7A8AA0";

const cards = [
  {
    label: "CORE DIAGNOSIS STATUS",
    title: "GREEN ACROSS EVERY ORBIT · EXCEPT ONE",
    body: "Per Joe Pung, April 21 2026",
  },
  {
    label: "THE NAMED GAP",
    title: "90 DAY DECAY WINDOW · ORBIT 02 ACTIVE",
    body: "The single failure mode. Now owned by Guild Pulse.",
  },
  {
    label: "ORBIT 03 DEAD ZONE",
    title: "UNKNOWN PENDING GUILD AUDIT",
    body: "Recommended first action: full Guild of Honor audit, map every member to orbit, surface dormant 90+ day contacts for targeted reactivate.",
  },
];

const AletheiaDeadZone = () => {
  return (
    <section className="py-32 md:py-48" style={{ backgroundColor: NAVY }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <AletheiaSectionReveal>
          <div
            className="text-xs tracking-[0.32em] mb-16"
            style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
          >
            FIELD 11 · DEAD ZONE ESTIMATE
          </div>
        </AletheiaSectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <AletheiaSectionReveal key={c.label} delay={i * 80}>
              <article
                className="border p-10 h-full"
                style={{
                  borderColor: `${GOLD}40`,
                  backgroundColor: "rgba(245,241,232,0.02)",
                }}
              >
                <div
                  className="text-[11px] tracking-[0.3em] mb-6 font-semibold"
                  style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
                >
                  {c.label}
                </div>
                <h3
                  className="font-bold mb-8"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.85rem",
                    color: OFFWHITE,
                    letterSpacing: "0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  {c.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "1.05rem",
                    color: OFFWHITE,
                    opacity: 0.7,
                  }}
                >
                  {c.body}
                </p>
              </article>
            </AletheiaSectionReveal>
          ))}
        </div>

        <AletheiaSectionReveal delay={280}>
          <p
            className="mt-12 text-[11px] tracking-[0.28em]"
            style={{ color: SLATE, fontFamily: "'Inter Tight', sans-serif" }}
          >
            DIAGNOSIS BUILT ON JOE PUNG'S ALETHEIA CORE DIAGNOSIS FRAMEWORK, APRIL 20 2026.
          </p>
        </AletheiaSectionReveal>
      </div>
    </section>
  );
};

export default AletheiaDeadZone;
