import AletheiaSectionReveal from "./AletheiaSectionReveal";

const NAVY = "var(--color-surface-page)";       // dark theme: Deep Forest
const GOLD = "var(--color-accent-primary)";    // dark theme: lifted Olive Gold
const OFFWHITE = "var(--color-text-primary)";   // dark theme: Sage Light
const SLATE = "var(--color-text-tertiary)";    // dark theme: Sage Muted

const items = [
  {
    label: "DIAGNOSTIC",
    title: "The 445 Node Map",
    body: "Every failure mode every founder led company hits between $8M and $250M. Run as a clinical instrument, not a survey.",
  },
  {
    label: "PROOF",
    title: "Core Diagnosis Report",
    body: "Forty eight hours after the call. Bound. Read aloud. The founder hears the company speak.",
  },
  {
    label: "RECEIPT",
    title: "S6E1 · Barry",
    body: "Public proof. The first engagement on the record. Doctrine in motion, not theory.",
  },
  {
    label: "STANDARD",
    title: "The Aletheia Doctrine",
    body: "Nine words on the wall. The line every operator inside Aletheia answers to.",
  },
];

const AletheiaEverythingBuilt = () => {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: NAVY }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <AletheiaSectionReveal>
          <div
            className="text-xs tracking-[0.32em] mb-4"
            style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
          >
            FIELD 07 · EVERYTHING ALREADY BUILT
          </div>
          <p
            className="mb-16 text-lg"
            style={{ color: SLATE, fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}
          >
            Four artifacts. All shipped. All in the room.
          </p>
        </AletheiaSectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((it, i) => (
            <AletheiaSectionReveal key={it.title} delay={i * 70}>
              <article
                className="h-full border p-10"
                style={{ borderColor: `${GOLD}55`, backgroundColor: "rgba(245,241,232,0.02)" }}
              >
                <div
                  className="text-[11px] tracking-[0.3em] mb-4"
                  style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
                >
                  {it.label}
                </div>
                <h3
                  className="font-bold mb-5"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.7rem",
                    color: OFFWHITE,
                  }}
                >
                  {it.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "1.05rem",
                    color: OFFWHITE,
                    opacity: 0.85,
                  }}
                >
                  {it.body}
                </p>
              </article>
            </AletheiaSectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AletheiaEverythingBuilt;
