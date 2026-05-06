const NAVY = "#0B1A2E";
const GOLD = "#C8963E";
const OFFWHITE = "#F5F1E8";
const SLATE = "#7A8AA0";

const AletheiaHero = () => {
  return (
    <section
      className="relative min-h-screen flex items-center"
      style={{ backgroundColor: NAVY, color: OFFWHITE }}
    >
      {/* Top-left amber gold accent line */}
      <div
        className="absolute top-24 left-6 md:left-12"
        style={{ width: 64, height: 2, backgroundColor: GOLD }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 w-full">
        <div
          className="text-xs tracking-[0.32em] mb-12"
          style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
        >
          MARKET ACTIVATION PROFILE · APRIL 2026
        </div>

        <h1
          className="font-bold leading-[1.08] mb-12"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)",
            color: OFFWHITE,
          }}
        >
          <span className="block">"We're not trying to compete in any existing category.</span>
          <span className="block">We're defining a transition that we know</span>
          <span className="block">every company hits."</span>
        </h1>

        <div
          className="text-xs tracking-[0.28em] mb-6"
          style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
        >
          TRAVIS RODERICK · FOUNDER, ALETHEIA · APRIL 20, 2026
        </div>

        <p
          className="max-w-2xl mb-10 text-lg md:text-xl leading-relaxed"
          style={{ color: SLATE, fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}
        >
          Forty eight hours after the call. Your doctrine, your diagnosis, your category build. All
          in one place.
        </p>

        <a
          href="https://calendly.com/richard-mabbly"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-7 py-4 text-sm tracking-[0.18em] font-semibold transition-transform"
          style={{
            backgroundColor: GOLD,
            color: NAVY,
            fontFamily: "'Inter Tight', sans-serif",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)")}
        >
          BOOK A WORKING SESSION WITH ADAM
        </a>
      </div>
    </section>
  );
};

export default AletheiaHero;
