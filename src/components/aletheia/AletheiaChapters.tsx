import AletheiaSectionReveal from "./AletheiaSectionReveal";

const NAVY = "var(--color-surface-page)";       // dark theme: Deep Forest
const GOLD = "var(--color-accent-primary)";    // dark theme: lifted Olive Gold
const OFFWHITE = "var(--color-text-primary)";   // dark theme: Sage Light
const SLATE = "var(--color-text-tertiary)";    // dark theme: Sage Muted

const chapters = [
  {
    n: "CH 03",
    title: "The Formula",
    body: "Why the fracture point exists. The math behind every founder led company stalling between $8M and $250M.",
  },
  {
    n: "CH 04",
    title: "Five Truths · Core · Orbits",
    body: "The doctrine layer. Where Aletheia's Mission, Core, and Guild rhythm map into the manuscript canon.",
  },
  {
    n: "CH 05",
    title: "DISCOVER",
    body: "The forty eight hour diagnostic frame. The anti discovery call. The 445 node map as instrument.",
  },
  {
    n: "CH 11",
    title: "MAP Template + Discovery Guide",
    body: "The artifact you are reading. Eleven fields. One spine. The operating system of a category build.",
  },
];

const AletheiaChapters = () => {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: NAVY }}>
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <AletheiaSectionReveal>
          <div
            className="text-xs tracking-[0.32em] mb-4"
            style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
          >
            FIELD 08 · MANUSCRIPT MAP
          </div>
          <p
            className="mb-16 text-lg"
            style={{ color: SLATE, fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}
          >
            Where Aletheia sits inside the GTM for Professional Services manuscript.
          </p>
        </AletheiaSectionReveal>

        <div className="space-y-2">
          {chapters.map((ch, i) => (
            <AletheiaSectionReveal key={ch.n} delay={i * 70}>
              <div
                className="grid grid-cols-1 md:grid-cols-12 gap-2 border-l-2 pl-6 py-4"
                style={{ borderColor: GOLD }}
              >
                <div className="md:col-span-1">
                  <div
                    className="text-[11px] tracking-[0.3em] mb-1"
                    style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    {ch.n}
                  </div>
                </div>
                <div className="md:col-span-11">
                  <h3
                    className="font-bold mb-3"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.55rem",
                      color: OFFWHITE,
                    }}
                  >
                    {ch.title}
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
                    {ch.body}
                  </p>
                </div>
              </div>
            </AletheiaSectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AletheiaChapters;
