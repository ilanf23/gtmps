import AletheiaSectionReveal from "./AletheiaSectionReveal";

const NAVY = "#0B1A2E";
const GOLD = "#C8963E";
const OFFWHITE = "#F5F1E8";
const SLATE = "#7A8AA0";

const AletheiaCore = () => {
  return (
    <section
      className="py-16 md:py-24"
      style={{ backgroundColor: NAVY, color: OFFWHITE }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <AletheiaSectionReveal>
          <div
            className="text-xs tracking-[0.32em] mb-16"
            style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
          >
            FIELD 01 · THE CORE
          </div>

          <p
            className="text-center font-bold leading-[1.18] mb-24"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.75rem, 3.6vw, 2.85rem)",
              color: OFFWHITE,
            }}
          >
            Aletheia is the operator led execution firm that turns founder clarity into
            organizational coherence at the fracture point every company hits between $8M and
            $250M.
          </p>
        </AletheiaSectionReveal>

        <AletheiaSectionReveal delay={120}>
          <div
            className="border p-10 md:p-14 mb-10"
            style={{ borderColor: GOLD, backgroundColor: NAVY }}
          >
            <div
              className="text-xs tracking-[0.32em] mb-6"
              style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
            >
              MISSION
            </div>
            <p
              className="leading-snug"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)",
                color: OFFWHITE,
              }}
            >
              "Aletheia exists to return the founder to the truth their company was built on.
              <br />
              Then to protect it."
            </p>
          </div>
        </AletheiaSectionReveal>

        <AletheiaSectionReveal delay={200}>
          <div
            className="border p-8 md:p-10"
            style={{ borderColor: GOLD, backgroundColor: NAVY }}
          >
            <div
              className="text-xs tracking-[0.32em] mb-4"
              style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
            >
              THE ALETHEIA DOCTRINE
            </div>
            <p
              className="font-bold tracking-wide"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.4rem, 2.4vw, 1.95rem)",
                color: OFFWHITE,
                letterSpacing: "0.04em",
              }}
            >
              IT GETS FIXED. OR WE'RE NOT DONE.
            </p>
            <p
              className="mt-4 text-sm"
              style={{ color: SLATE, fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}
            >
              Nine words. The standard below the mission.
            </p>
          </div>
        </AletheiaSectionReveal>
      </div>
    </section>
  );
};

export default AletheiaCore;
