import AletheiaSectionReveal from "./AletheiaSectionReveal";

const NAVY = "#0B1A2E";
const GOLD = "#C8963E";
const OFFWHITE = "#F5F1E8";

const AletheiaVision = () => {
  return (
    <section
      className="py-32 md:py-56"
      style={{ backgroundColor: NAVY }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <AletheiaSectionReveal>
          <div
            className="text-xs tracking-[0.32em] mb-16"
            style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
          >
            FIELD 10 · VISION
          </div>
        </AletheiaSectionReveal>

        <AletheiaSectionReveal delay={80}>
          <blockquote
            className="font-bold leading-[1.15]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.85rem, 4.2vw, 3.4rem)",
              color: OFFWHITE,
            }}
          >
            "In five years Aletheia is the name founders use when the company they built starts
            hiding from them. Not a consultancy. Not a fractional. A standard."
          </blockquote>
        </AletheiaSectionReveal>

        <AletheiaSectionReveal delay={160}>
          <div
            className="mt-12 text-xs tracking-[0.28em]"
            style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
          >
            TRAVIS RODERICK · FOUNDER, ALETHEIA
          </div>
        </AletheiaSectionReveal>
      </div>
    </section>
  );
};

export default AletheiaVision;
