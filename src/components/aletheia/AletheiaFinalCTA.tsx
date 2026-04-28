import AletheiaSectionReveal from "./AletheiaSectionReveal";

const NAVY = "#0B1A2E";
const GOLD = "#C8963E";
const OFFWHITE = "#F5F1E8";
const SLATE = "#7A8AA0";

const AletheiaFinalCTA = () => {
  return (
    <section
      className="min-h-screen flex flex-col justify-center"
      style={{ backgroundColor: NAVY }}
    >
      <div className="flex-1 flex items-center">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-32 w-full text-center">
          <AletheiaSectionReveal>
            <div
              className="text-xs tracking-[0.32em] mb-10"
              style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
            >
              ONE STEP
            </div>
            <h2
              className="font-bold leading-[1.1] mb-12"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4.6vw, 3.6rem)",
                color: OFFWHITE,
              }}
            >
              Book the working session.
              <br />
              Walk out with the next move.
            </h2>
            <p
              className="max-w-2xl mx-auto mb-12 text-lg"
              style={{
                color: SLATE,
                fontFamily: "'EB Garamond', serif",
                fontStyle: "italic",
              }}
            >
              Thirty minutes with Adam. We read this MAP back together. You leave with the priority
              that moves the next quarter.
            </p>
          </AletheiaSectionReveal>

          <AletheiaSectionReveal delay={120}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://calendly.com/adam-fridman/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 text-sm tracking-[0.18em] font-semibold transition-transform"
                style={{
                  backgroundColor: GOLD,
                  color: NAVY,
                  fontFamily: "'Inter Tight', sans-serif",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)")
                }
              >
                BOOK A WORKING SESSION WITH ADAM
              </a>
              <a
                href="mailto:adam@mabbly.com?subject=Re: Aletheia MAP"
                className="inline-block px-8 py-4 text-sm tracking-[0.18em] font-semibold border transition-colors"
                style={{
                  color: GOLD,
                  borderColor: GOLD,
                  fontFamily: "'Inter Tight', sans-serif",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = GOLD;
                  (e.currentTarget as HTMLAnchorElement).style.color = NAVY;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = GOLD;
                }}
              >
                EMAIL ADAM DIRECTLY
              </a>
            </div>
          </AletheiaSectionReveal>
        </div>
      </div>

      <footer
        className="border-t py-10 px-6 md:px-12"
        style={{ borderColor: `${GOLD}33` }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4 text-[11px] tracking-[0.28em]">
          <div style={{ color: OFFWHITE, opacity: 0.7, fontFamily: "'Inter Tight', sans-serif" }}>
            ALETHEIA · MAP · APRIL 2026
          </div>
          <div style={{ color: SLATE, fontFamily: "'Inter Tight', sans-serif" }}>
            PREPARED BY MABBLY · ADAM FRIDMAN, RICHARD ASHBAUGH
          </div>
        </div>
      </footer>
    </section>
  );
};

export default AletheiaFinalCTA;
