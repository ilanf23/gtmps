import AletheiaSectionReveal from "./AletheiaSectionReveal";

const NAVY = "#0B1A2E";
const GOLD = "#C8963E";
const OFFWHITE = "#F5F1E8";
const SLATE = "#7A8AA0";

const cards = [
  { role: "THE CORE", phrase: "Execution architecture.", speaker: "TRAVIS" },
  {
    role: "THE NICHE",
    phrase: "The fracture point every company hits between $8M and $250M.",
    speaker: "TRAVIS",
  },
  {
    role: "THE PROBLEM",
    phrase:
      "Bain gives you a deck. Accenture gives you a system. Neither gives you the operator sitting next to you when it breaks at 2am.",
    speaker: "TRAVIS",
  },
  {
    role: "THE PIVOT",
    phrase: "Coherence. Not alignment. Coherence.",
    speaker: "NICK MCGUIRE · COHERENCE™",
  },
  {
    role: "THE CATEGORY SHIFT",
    phrase:
      "We are not consultants. We are not fractional. We are the operator you hire when the company you built starts hiding from you.",
    speaker: "TRAVIS",
  },
  { role: "THE WHY", phrase: "Divinity driven. Not for sale.", speaker: "TRAVIS" },
];

const AletheiaLanguageLock = () => {
  return (
    <section className="py-32 md:py-48" style={{ backgroundColor: NAVY }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <AletheiaSectionReveal>
          <div
            className="text-xs tracking-[0.32em] mb-4"
            style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
          >
            FIELD 02 · LANGUAGE LOCK
          </div>
          <p
            className="mb-16 text-lg"
            style={{ color: SLATE, fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}
          >
            Six phrases from the call. Attributed, verbatim.
          </p>
        </AletheiaSectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <AletheiaSectionReveal key={c.role} delay={i * 60}>
              <article
                className="h-full border p-8 flex flex-col justify-between transition-transform"
                style={{ borderColor: `${GOLD}55`, backgroundColor: "rgba(245,241,232,0.02)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.transform = "translateY(-4px)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")
                }
              >
                <div
                  className="text-[11px] tracking-[0.3em] mb-6"
                  style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
                >
                  {c.role}
                </div>
                <p
                  className="leading-snug mb-8"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.35rem",
                    color: OFFWHITE,
                  }}
                >
                  "{c.phrase}"
                </p>
                <div
                  className="text-[10px] tracking-[0.28em]"
                  style={{ color: SLATE, fontFamily: "'Inter Tight', sans-serif" }}
                >
                  {c.speaker}
                </div>
              </article>
            </AletheiaSectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AletheiaLanguageLock;
