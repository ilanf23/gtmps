import AletheiaSectionReveal from "./AletheiaSectionReveal";

const NAVY = "#0B1A2E";
const GOLD = "#C8963E";
const OFFWHITE = "#F5F1E8";
const SLATE = "#7A8AA0";

const AletheiaICPLock = () => {
  return (
    <section className="py-32 md:py-48" style={{ backgroundColor: NAVY }}>
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <AletheiaSectionReveal>
          <div
            className="text-xs tracking-[0.32em] mb-10"
            style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
          >
            FIELD 04 · ICP LOCK
          </div>

          <div className="mb-14">
            <span
              className="inline-block px-5 py-2 text-[11px] tracking-[0.28em] font-semibold"
              style={{
                backgroundColor: GOLD,
                color: NAVY,
                fontFamily: "'Inter Tight', sans-serif",
              }}
            >
              ICP RIGIDITY: TIER 3 · FOUNDER LED WARM OUTBOUND
            </span>
          </div>
        </AletheiaSectionReveal>

        <div className="space-y-10">
          <AletheiaSectionReveal delay={80}>
            <div
              className="border-l-2 pl-8"
              style={{ borderColor: GOLD }}
            >
              <h3
                className="mb-4 font-bold"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.6rem",
                  color: OFFWHITE,
                }}
              >
                Rule.
              </h3>
              <p
                className="leading-relaxed"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.2rem",
                  color: OFFWHITE,
                }}
              >
                CEOs, founders, and owners of companies $8M to $250M in revenue, sweet spot $15M,
                industry agnostic, at the fracture point.
              </p>
            </div>
          </AletheiaSectionReveal>

          <AletheiaSectionReveal delay={160}>
            <div className="border-l-2 pl-8" style={{ borderColor: GOLD }}>
              <h3
                className="mb-4 font-bold"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.6rem",
                  color: OFFWHITE,
                }}
              >
                Application.
              </h3>
              <p
                className="leading-relaxed"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.2rem",
                  color: OFFWHITE,
                }}
              >
                The person who built the company is still running the company. They feel the
                ceiling. They have tried Bain. They have tried fractionals. They have read
                Traction. None of it touched the layer where the company actually breaks.
              </p>
            </div>
          </AletheiaSectionReveal>

          <AletheiaSectionReveal delay={240}>
            <div className="border-l-2 pl-8" style={{ borderColor: GOLD }}>
              <h3
                className="mb-4 font-bold"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.6rem",
                  color: OFFWHITE,
                }}
              >
                Thesis.
              </h3>
              <p
                className="leading-relaxed"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.2rem",
                  color: OFFWHITE,
                }}
              >
                The fracture point is not a market problem. It is an operating system problem. The
                founder built the system. Only the founder, working with an operator, can repair
                it without breaking what made it work in the first place.
              </p>
            </div>
          </AletheiaSectionReveal>
        </div>

        <AletheiaSectionReveal delay={320}>
          <p
            className="mt-16 text-sm max-w-2xl"
            style={{ color: SLATE, fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}
          >
            Tier 3 means every engagement starts founder to founder. No SDR layer. No discovery
            funnel. The Guild brings the room.
          </p>
        </AletheiaSectionReveal>
      </div>
    </section>
  );
};

export default AletheiaICPLock;
