import AletheiaSectionReveal from "./AletheiaSectionReveal";

const NAVY = "#0B1A2E";
const GOLD = "#C8963E";
const OFFWHITE = "#F5F1E8";
const SLATE = "#7A8AA0";

const cards = [
  {
    said: "The market has no language for what we do.",
    heard:
      "You are pre category. That is not a weakness. That is the opening. Every category defining firm started here.",
  },
  {
    said: "445 failure nodes mapped across the operating system.",
    heard:
      "You have the diagnostic rigor of a clinical trial. This is your moat. Most firms sell opinions. You sell a map.",
  },
  {
    said: "48 hour diagnostic. One hour truth session. VASI framework.",
    heard:
      "You built the anti discovery call. Most firms take 6 weeks to tell you what is broken. You take 48 hours and charge for it.",
  },
  {
    said: "The Guild of Honor brings every client in.",
    heard:
      "Your entire GTM is reputation as channel. That is Orbit 01 at scale. The question is what happens when Guild members go quiet for 90 days.",
  },
];

const AletheiaSaidHeard = () => {
  return (
    <section className="py-32 md:py-48" style={{ backgroundColor: NAVY }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <AletheiaSectionReveal>
          <div
            className="text-xs tracking-[0.32em] mb-4"
            style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
          >
            FIELD 03 · WHAT THEY SAID / WHAT WE HEARD
          </div>
          <p
            className="mb-16 text-lg"
            style={{ color: SLATE, fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}
          >
            Four moments from the call. Translated.
          </p>
        </AletheiaSectionReveal>

        <div className="space-y-8">
          {cards.map((c, i) => (
            <AletheiaSectionReveal key={i} delay={i * 80}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Said */}
                <div
                  className="p-8 md:p-10 border"
                  style={{
                    backgroundColor: NAVY,
                    borderColor: `${GOLD}55`,
                  }}
                >
                  <div
                    className="text-[11px] tracking-[0.3em] mb-5"
                    style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    WHAT THEY SAID
                  </div>
                  <p
                    className="leading-snug"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.3rem",
                      color: OFFWHITE,
                    }}
                  >
                    "{c.said}"
                  </p>
                </div>
                {/* Heard */}
                <div
                  className="p-8 md:p-10 border md:border-l-0"
                  style={{
                    backgroundColor: `${GOLD}1F`,
                    borderColor: `${GOLD}55`,
                  }}
                >
                  <div
                    className="text-[11px] tracking-[0.3em] mb-5"
                    style={{ color: NAVY, fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    WHAT WE HEARD
                  </div>
                  <p
                    className="leading-snug"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.2rem",
                      color: NAVY,
                    }}
                  >
                    {c.heard}
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

export default AletheiaSaidHeard;
