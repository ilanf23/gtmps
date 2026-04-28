import AletheiaSectionReveal from "./AletheiaSectionReveal";

const NAVY = "#0B1A2E";
const GOLD = "#C8963E";
const OFFWHITE = "#F5F1E8";
const SLATE = "#7A8AA0";

const stats = [
  {
    n: "445",
    label: "FAILURE NODES",
    body: "The map every Aletheia engagement runs against. No founder has seen all of them. Every founder is hit by some.",
  },
  {
    n: "48 HOURS",
    label: "TO DIAGNOSIS",
    body: "Most firms take six weeks. Aletheia takes two days and reads the result aloud to the founder.",
  },
  {
    n: "9 WORDS",
    label: "THE STANDARD",
    body: "It gets fixed. Or we're not done. The line every operator inside Aletheia answers to.",
  },
];

const AletheiaDeadZone = () => {
  return (
    <section className="py-32 md:py-48" style={{ backgroundColor: NAVY }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <AletheiaSectionReveal>
          <div
            className="text-xs tracking-[0.32em] mb-4"
            style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
          >
            FIELD 11 · DEAD ZONE
          </div>
          <p
            className="mb-16 text-lg max-w-2xl"
            style={{ color: SLATE, fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}
          >
            What every founder loses by waiting another quarter.
          </p>
        </AletheiaSectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <AletheiaSectionReveal key={s.label} delay={i * 80}>
              <div
                className="border p-10 h-full"
                style={{ borderColor: `${GOLD}55`, backgroundColor: "rgba(245,241,232,0.02)" }}
              >
                <div
                  className="font-bold mb-4"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "3rem",
                    color: GOLD,
                    lineHeight: 1.05,
                  }}
                >
                  {s.n}
                </div>
                <div
                  className="text-[11px] tracking-[0.3em] mb-5"
                  style={{ color: OFFWHITE, opacity: 0.7, fontFamily: "'Inter Tight', sans-serif" }}
                >
                  {s.label}
                </div>
                <p
                  className="leading-relaxed"
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "1.05rem",
                    color: OFFWHITE,
                    opacity: 0.88,
                  }}
                >
                  {s.body}
                </p>
              </div>
            </AletheiaSectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AletheiaDeadZone;
