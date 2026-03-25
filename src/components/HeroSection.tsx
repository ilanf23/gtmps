import bookCover from "@/assets/book-cover.png";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 70% 20%, rgba(184,147,58,0.06) 0%, transparent 60%), #0D1117`,
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184,147,58,0.08) 0%, transparent 70%)",
          right: "-10%",
          top: "10%",
          animation: "glowPulse 6s ease-in-out infinite",
        }}
      />

      <div className="relative flex flex-col lg:flex-row items-center px-6 pt-[100px] pb-[60px] lg:px-20 lg:pt-[140px] lg:pb-24 gap-12 lg:gap-16 max-w-[1280px] mx-auto">
        {/* Book visual on mobile first */}
        <div className="block lg:hidden w-full">
          <BookDisplay />
        </div>

        {/* Left column */}
        <div className="w-full lg:w-[55%] scroll-reveal">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-gold" />
            <span
              className="font-mono uppercase tracking-[0.2em] text-gold"
              style={{ fontSize: 10 }}
            >
              Book Research · Limited to 50 Sessions
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display font-black text-white mt-6"
            style={{
              fontSize: "clamp(44px, 5.5vw, 76px)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
            }}
          >
            The First GTM Book
            <br />
            for Professional
            <br />
            Services.
          </h1>

          {/* Subhead */}
          <p
            className="font-sans mt-6"
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              maxWidth: 480,
            }}
          >
            GTM has one universally accepted definition: a plan for bringing a product to a market that does not know you yet. That definition has never applied to professional services firms. This book fixes that. Adam Fridman and Richard Ashbaugh are conducting 50 Discovery Sessions with managing partners as the research foundation. The session is free. The insight is yours to keep.
          </p>

          {/* Urgency strip */}
          <div className="flex items-center gap-2.5 mt-5">
            <span
              className="inline-block rounded-full bg-gold"
              style={{
                width: 8,
                height: 8,
                animation: "dotPulse 2s infinite",
              }}
            />
            <span
              className="font-mono uppercase tracking-[0.14em] text-gold"
              style={{ fontSize: 11 }}
            >
              46 of 50 sessions remaining
            </span>
          </div>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <a
              href="#apply"
              className="font-sans font-semibold text-center rounded-full transition-all duration-200 hover:scale-[1.02]"
              style={{
                fontSize: 15,
                background: "#B8933A",
                color: "#0D1117",
                padding: "16px 40px",
              }}
            >
              Apply for a Research Session
            </a>
            <a
              href="#book"
              className="font-sans font-medium text-center rounded-full transition-all duration-200 hover:bg-white/10"
              style={{
                fontSize: 15,
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.7)",
                padding: "16px 40px",
              }}
            >
              Learn About the Book
            </a>
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12">
            {[
              { num: "96%", label: "of PS firm CRM contacts are dormant" },
              { num: "70%", label: "of revenue from existing relationships" },
              { num: "1.3%", label: "average reply rate, generic outreach" },
            ].map((stat) => (
              <div key={stat.num}>
                <span className="font-display font-black text-gold block text-2xl sm:text-4xl">
                  {stat.num}
                </span>
                <span
                  className="font-sans block"
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.35)",
                    lineHeight: 1.4,
                    maxWidth: 140,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Definition callout block */}
          <div
            className="mt-12 scroll-reveal text-center"
            style={{
              background: "rgba(184,147,58,0.08)",
              borderTop: "3px solid #B8933A",
              borderBottom: "3px solid #B8933A",
              padding: "32px 48px",
              maxWidth: 800,
              margin: "48px auto 0",
            }}
          >
            <span
              className="font-mono uppercase block"
              style={{ fontSize: 9, color: "#B8933A", letterSpacing: "0.2em", marginBottom: 12 }}
            >
              THE DEFINITION THAT CHANGES EVERYTHING
            </span>
            <p
              className="font-serif italic"
              style={{ fontSize: "clamp(20px, 2.5vw, 26px)", color: "#0D1117", lineHeight: 1.3 }}
            >
              "GTM for professional services is not a plan for entering a new market. It is a system for activating the one you already own."
            </p>
          </div>
        </div>

        {/* Right column - desktop */}
        <div className="hidden lg:block w-[45%]">
          <BookDisplay />
        </div>
      </div>
    </section>
  );
};

const BookDisplay = () => (
  <div
    className="relative mx-auto"
    style={{ maxWidth: 380, height: 360, animation: "bookFloat 6s ease-in-out infinite" }}
  >
    {/* Glow behind book */}
    <div
      className="absolute"
      style={{
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(184,147,58,0.15) 0%, transparent 70%)",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />

    {/* Front cover */}
    <img
      src={bookCover}
      alt="GTM for Professional Services"
      className="absolute left-4 top-0"
      style={{
        width: 180,
        aspectRatio: "2/3",
        transform: "rotate(-4deg)",
        boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
        zIndex: 2,
        objectFit: "cover",
        borderRadius: 4,
      }}
    />

    {/* Spine */}
    <div
      className="absolute flex items-center justify-center"
      style={{
        width: 24,
        height: 270,
        background: "#B8933A",
        left: "50%",
        top: 10,
        transform: "translateX(-50%)",
        zIndex: 1,
        borderRadius: 2,
      }}
    >
      <span
        className="font-mono text-ink"
        style={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          fontSize: 7,
          letterSpacing: "0.1em",
        }}
      >
        GTM FOR PROFESSIONAL SERVICES · FRIDMAN · ASHBAUGH
      </span>
    </div>

    {/* Back cover */}
    <img
      src={bookCover}
      alt="GTM for Professional Services"
      className="absolute right-4 top-6"
      style={{
        width: 180,
        aspectRatio: "2/3",
        transform: "rotate(4deg)",
        boxShadow: "0 32px 64px rgba(0,0,0,0.45)",
        zIndex: 0,
        objectFit: "cover",
        borderRadius: 4,
      }}
    />

    {/* Below books label */}
    <div
      className="absolute bottom-0 left-0 right-0 text-center font-mono"
      style={{ fontSize: 9, color: "rgba(184,147,58,0.5)" }}
    >
      Q4 2026 · Mabbly Press · First Edition
    </div>
  </div>
);

export default HeroSection;
