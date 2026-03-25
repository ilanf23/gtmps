import bookCover from "@/assets/book-cover.png";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen"
      style={{
        background: `radial-gradient(ellipse at 82% 28%, rgba(184,147,58,0.07) 0%, transparent 62%), #0D1117`,
      }}
    >
      <div className="flex flex-col md:flex-row items-center px-6 pt-[100px] pb-[60px] md:px-20 md:pt-[120px] md:pb-20 gap-10 md:gap-[60px]">
        {/* Book visual on mobile first */}
        <div className="block md:hidden w-full">
          <BookDisplay />
        </div>

        {/* Left column */}
        <div className="w-full md:w-[58%] scroll-reveal">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-px bg-gold" />
            <span
              className="font-mono uppercase tracking-[0.2em] text-gold"
              style={{ fontSize: 9 }}
            >
              Book Research · Professional Services Only · Limited to 50 Sessions
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-serif font-light text-white mt-5"
            style={{
              fontSize: "clamp(40px, 5vw, 66px)",
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
            }}
          >
            We Are Writing the First GTM
            <br />
            Book for Professional Services.
            <br />
            <span className="italic text-gold">
              We Want to Research Your Firm.
            </span>
          </h1>

          {/* Subhead */}
          <p
            className="font-sans mt-[22px]"
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.58)",
              lineHeight: 1.78,
              maxWidth: 500,
            }}
          >
            Adam Fridman and Richard Ashbaugh are conducting 50 Discovery
            Sessions with managing partners as the foundation for GTM for
            Professional Services. The session is free. The research shapes
            the book. The insight is yours to keep.
          </p>

          {/* Urgency strip */}
          <div className="flex items-center gap-2 mt-[18px]">
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
              style={{ fontSize: 10 }}
            >
              46 of 50 research sessions remaining. Sessions close when the book enters final draft.
            </span>
          </div>

          {/* Exclusivity note */}
          <p
            className="font-sans italic mt-[10px]"
            style={{ fontSize: 13, color: "rgba(255,255,255,0.38)" }}
          >
            We review every application. Not all firms will be selected for the research phase.
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-3 mt-[30px]">
            <a
              href="#apply"
              className="font-mono uppercase tracking-[0.2em] text-center transition-colors duration-150 hover:bg-[#C9A845]"
              style={{
                fontSize: 10,
                background: "#B8933A",
                color: "#0D1117",
                padding: "16px 38px",
              }}
            >
              APPLY FOR A RESEARCH SESSION
            </a>
            <a
              href="#book"
              className="font-mono uppercase tracking-[0.2em] text-center transition-all duration-150 hover:border-white hover:text-white"
              style={{
                fontSize: 10,
                border: "1px solid rgba(255,255,255,0.22)",
                color: "rgba(255,255,255,0.55)",
                padding: "16px 38px",
              }}
            >
              LEARN ABOUT THE BOOK
            </a>
          </div>

          {/* Stat strip */}
          <div className="flex gap-3 mt-9 overflow-x-auto flex-nowrap">
            {[
              { num: "96%", label: "of PS firm CRM contacts are dormant right now" },
              { num: "70%", label: "of PS revenue comes from existing relationships" },
              { num: "1.3%", label: "average reply rate from generic outreach sequences" },
            ].map((stat) => (
              <div
                key={stat.num}
                className="flex-shrink-0"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  padding: "12px 18px",
                }}
              >
                <span className="font-serif font-semibold text-gold block" style={{ fontSize: 26 }}>
                  {stat.num}
                </span>
                <span
                  className="font-mono block"
                  style={{
                    fontSize: 8,
                    color: "rgba(255,255,255,0.38)",
                    lineHeight: 1.5,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column - desktop */}
        <div className="hidden md:block w-[42%]">
          <BookDisplay />
        </div>
      </div>
    </section>
  );
};

const BookDisplay = () => (
  <div className="relative mx-auto" style={{ maxWidth: 320, height: 300 }}>
    {/* Front cover */}
      <img
        src={bookCover}
        alt="GTM for Professional Services"
        className="absolute left-0 top-0"
        style={{
          width: 160,
          aspectRatio: "2/3",
          transform: "rotate(-4deg)",
          boxShadow: "0 28px 56px rgba(0,0,0,0.55)",
          zIndex: 2,
          objectFit: "cover",
        }}
      />

    {/* Spine */}
    <div
      className="absolute flex items-center justify-center"
      style={{
        width: 24,
        height: 240,
        background: "#B8933A",
        left: "50%",
        top: 10,
        transform: "translateX(-50%)",
        zIndex: 1,
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
        alt="GTM for Professional Services - Back"
        className="absolute right-0 top-4"
        style={{
          width: 160,
          aspectRatio: "2/3",
          transform: "rotate(4deg)",
          boxShadow: "0 28px 56px rgba(0,0,0,0.4)",
          zIndex: 0,
          objectFit: "cover",
        }}
      />

    {/* Below books label */}
    <div
      className="absolute bottom-0 left-0 right-0 text-center font-mono"
      style={{ fontSize: 8, color: "rgba(184,147,58,0.6)" }}
    >
      Q4 2026 · Mabbly Press · First Edition
    </div>
  </div>
);

export default HeroSection;
