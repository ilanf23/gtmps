import AletheiaSectionReveal from "./AletheiaSectionReveal";

const NAVY = "#0B1A2E";
const GOLD = "#C8963E";
const OFFWHITE = "#F5F1E8";
const SLATE = "#7A8AA0";

const verbs = [
  {
    n: "01",
    verb: "SURFACE",
    body: "Forty eight hour diagnostic. The 445 node map run against the live company. Everything broken comes up.",
  },
  {
    n: "02",
    verb: "CONFRONT",
    body: "One hour truth session with the founder. No deck. No slides. The diagnosis read out loud.",
  },
  {
    n: "03",
    verb: "ARCHITECT",
    body: "The repair plan written as an operating system, not a roadmap. Every node assigned an owner and a date.",
  },
  {
    n: "04",
    verb: "INSTALL",
    body: "The operator embeds. The repair runs through the company at the cadence the founder can sustain.",
  },
  {
    n: "05",
    verb: "COHERE",
    body: "Alignment is a meeting. Coherence is a property of the system. We do not leave until the system carries the weight.",
  },
  {
    n: "06",
    verb: "COMPOUND",
    body: "The founder retains the operator on a Guild rhythm. The repair holds. The company stops hiding from the person who built it.",
  },
];

const AletheiaProvenProcess = () => {
  return (
    <section className="py-32 md:py-48" style={{ backgroundColor: NAVY }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <AletheiaSectionReveal>
          <div
            className="text-xs tracking-[0.32em] mb-16"
            style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
          >
            FIELD 05 · PROVEN PROCESS
          </div>
        </AletheiaSectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {verbs.map((v, i) => (
            <AletheiaSectionReveal key={v.n} delay={i * 60}>
              <div
                className="h-full border p-8"
                style={{ borderColor: `${GOLD}55`, backgroundColor: "rgba(245,241,232,0.02)" }}
              >
                <div
                  className="text-[11px] tracking-[0.3em] mb-3"
                  style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
                >
                  {v.n}
                </div>
                <h3
                  className="font-bold mb-5"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.85rem",
                    color: OFFWHITE,
                    letterSpacing: "0.05em",
                  }}
                >
                  {v.verb}
                </h3>
                <p
                  className="leading-relaxed text-[0.98rem]"
                  style={{ color: OFFWHITE, opacity: 0.85, fontFamily: "'EB Garamond', serif" }}
                >
                  {v.body}
                </p>
              </div>
            </AletheiaSectionReveal>
          ))}
        </div>

        <AletheiaSectionReveal delay={120}>
          <div
            className="border p-10 md:p-14"
            style={{ borderColor: GOLD, backgroundColor: `${GOLD}10` }}
          >
            <div
              className="text-[11px] tracking-[0.3em] mb-4"
              style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
            >
              GUILD PULSE · PARALLEL MOTION
            </div>
            <p
              className="leading-snug mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.5rem",
                color: OFFWHITE,
              }}
            >
              While Surface runs, the Guild runs. Joe Pung owns the rhythm. Every member touched
              every ninety days. Every quiet member surfaced before the silence becomes attrition.
            </p>
            <p
              className="text-sm"
              style={{ color: SLATE, fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}
            >
              Owner: Joe Pung. Cadence: ninety day pulse. Trigger: silence over forty five days.
            </p>
          </div>
        </AletheiaSectionReveal>
      </div>
    </section>
  );
};

export default AletheiaProvenProcess;
