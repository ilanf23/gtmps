import AletheiaSectionReveal from "./AletheiaSectionReveal";

const NAVY = "var(--color-surface-page)";       // dark theme: Deep Forest
const GOLD = "var(--color-accent-primary)";    // dark theme: lifted Olive Gold
const OFFWHITE = "var(--color-text-primary)";   // dark theme: Sage Light

const AletheiaVision = () => {
  return (
    <section
      className="py-20 md:py-28"
      style={{ backgroundColor: NAVY }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
        <AletheiaSectionReveal>
          <div
            className="text-xs tracking-[0.32em] mb-16"
            style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
          >
            FIELD 10 · VISION STATE
          </div>
        </AletheiaSectionReveal>

        <AletheiaSectionReveal delay={80}>
          <blockquote
            className="font-bold leading-[1.15]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5.4vw, 4.4rem)",
              color: OFFWHITE,
            }}
          >
            "$15M to $20M year one. Category ownership by month 24. Divinity driven. Not for sale."
          </blockquote>
        </AletheiaSectionReveal>

        <AletheiaSectionReveal delay={160}>
          <div
            className="mt-16 text-xs tracking-[0.28em] font-semibold"
            style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
          >
            TRAVIS RODERICK · APRIL 20, 2026
          </div>
        </AletheiaSectionReveal>
      </div>
    </section>
  );
};

export default AletheiaVision;
