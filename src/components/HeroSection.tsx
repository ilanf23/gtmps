import bookCover from "@/assets/book-cover.png";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "#0D1117",
      }}
    >
      {/* Layered depth background */}
      {/* Diagonal gold gradient sweep */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, transparent 40%, rgba(184,147,58,0.04) 50%, rgba(184,147,58,0.08) 60%, rgba(184,147,58,0.03) 70%, transparent 80%)",
        }}
      />
      {/* Large ambient glow behind the book area */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(184,147,58,0.10) 0%, rgba(184,147,58,0.04) 30%, transparent 65%)",
          right: "-15%",
          top: "-5%",
          animation: "glowPulse 6s ease-in-out infinite",
        }}
      />
      {/* Secondary subtle depth layer */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(184,147,58,0.06) 0%, transparent 70%)",
          right: "15%",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      <div className="relative flex flex-col lg:flex-row items-center px-6 pt-[100px] pb-[60px] lg:px-20 lg:pt-[120px] lg:pb-20 gap-10 lg:gap-8 max-w-[1400px] mx-auto min-h-screen">
        {/* Book visual on mobile first */}
        <div className="block lg:hidden w-full">
          <BookDisplay />
        </div>

        {/* Left column — text */}
        <div className="w-full lg:w-[52%] relative z-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div
              className="h-px bg-gold"
              style={{ width: 40 }}
            />
            <span
              className="font-mono uppercase tracking-[0.2em] text-gold"
              style={{ fontSize: 10 }}
            >
              Book Research · Limited to 50 Sessions
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display font-black text-white mt-7"
            style={{
              fontSize: "clamp(48px, 6vw, 84px)",
              lineHeight: 0.95,
              letterSpacing: "-0.035em",
            }}
          >
            The First GTM
            <br />
            Book for
            <br />
            <span className="relative inline-block">
              Professional
              {/* Gold underline accent */}
              <span
                className="absolute left-0 bottom-[0.04em] h-[3px] rounded-full"
                style={{
                  width: "100%",
                  background: "linear-gradient(90deg, rgba(184,147,58,0.7), rgba(184,147,58,0.2))",
                }}
              />
            </span>
            <br />
            Services.
          </h1>

          {/* Subhead */}
          <p
            className="font-sans mt-7"
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.50)",
              lineHeight: 1.75,
              maxWidth: 460,
            }}
          >
            GTM has one universally accepted definition: a plan for bringing a product to a market that does not know you yet. That definition has never applied to professional services firms. This book fixes that. Adam Fridman and Richard Ashbaugh are conducting 50 Discovery Sessions with managing partners as the research foundation. The session is free. The insight is yours to keep.
          </p>

          {/* Urgency strip */}
          <div className="flex items-center gap-2.5 mt-6">
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
              className="font-sans font-semibold text-center rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(184,147,58,0.3)]"
              style={{
                fontSize: 15,
                background: "linear-gradient(135deg, #C9A44A, #B8933A, #A07E2E)",
                color: "#0D1117",
                padding: "17px 44px",
              }}
            >
              Apply for a Research Session
            </a>
            <a
              href="#book"
              className="font-sans font-medium text-center rounded-full transition-all duration-300 hover:bg-white/10 hover:border-white/30"
              style={{
                fontSize: 15,
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.6)",
                padding: "17px 44px",
              }}
            >
              Learn About the Book
            </a>
          </div>

          {/* Stat strip with dividers */}
          <div className="flex gap-0 mt-14">
            {[
              { num: "96%", label: "of PS firm CRM contacts are dormant" },
              { num: "70%", label: "of revenue from existing relationships" },
              { num: "1.3%", label: "average reply rate, generic outreach" },
            ].map((stat, i) => (
              <div
                key={stat.num}
                className="flex-1"
                style={{
                  paddingLeft: i > 0 ? 24 : 0,
                  paddingRight: i < 2 ? 24 : 0,
                  borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}
              >
                <span
                  className="font-display font-black text-gold block"
                  style={{ fontSize: "clamp(28px, 3vw, 42px)", lineHeight: 1 }}
                >
                  {stat.num}
                </span>
                <span
                  className="font-sans block mt-2"
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.30)",
                    lineHeight: 1.45,
                    maxWidth: 140,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — massive book display (desktop) */}
        <div className="hidden lg:flex w-[48%] items-center justify-center relative">
          <BookDisplay large />
        </div>
      </div>

      {/* Definition callout block */}
      <div
        className="relative z-10 text-center mx-6 md:mx-auto"
        style={{
          background: "rgba(184,147,58,0.06)",
          borderTop: "2px solid rgba(184,147,58,0.3)",
          borderBottom: "2px solid rgba(184,147,58,0.3)",
          padding: "36px 48px",
          maxWidth: 800,
          marginBottom: 0,
        }}
      >
        <span
          className="font-mono uppercase block"
          style={{
            fontSize: 9,
            color: "rgba(184,147,58,0.7)",
            letterSpacing: "0.2em",
            marginBottom: 14,
          }}
        >
          THE DEFINITION THAT CHANGES EVERYTHING
        </span>
        <p
          className="font-serif italic"
          style={{
            fontSize: "clamp(20px, 2.5vw, 28px)",
            color: "rgba(255,255,255,0.80)",
            lineHeight: 1.35,
          }}
        >
          "GTM for professional services is not a plan for entering a new market. It is a system for activating the one you already own."
        </p>
      </div>
    </section>
  );
};

const BookDisplay = ({ large }: { large?: boolean }) => {
  const bookWidth = large ? 300 : 220;
  const glowSize = large ? 520 : 360;
  const reflectionHeight = large ? 80 : 50;

  return (
    <div className="relative mx-auto flex flex-col items-center">
      {/* Multi-layer gold glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: glowSize,
          height: glowSize,
          background:
            "radial-gradient(circle, rgba(184,147,58,0.16) 0%, rgba(184,147,58,0.06) 40%, rgba(184,147,58,0) 70%)",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -55%)",
          animation: "glowPulse 4s ease-in-out infinite",
        }}
      />
      {/* Outer softer glow ring */}
      {large && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: glowSize * 1.4,
            height: glowSize * 1.4,
            background:
              "radial-gradient(circle, rgba(184,147,58,0.04) 0%, transparent 60%)",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -55%)",
          }}
        />
      )}

      {/* Flanking gold rules */}
      <div
        className="absolute top-[42%] left-0 right-0 flex items-center justify-center pointer-events-none"
      >
        <div
          style={{
            width: large ? 80 : 50,
            height: 1,
            background:
              "linear-gradient(to right, transparent, rgba(184,147,58,0.35))",
          }}
        />
        <div style={{ width: bookWidth + 40 }} />
        <div
          style={{
            width: large ? 80 : 50,
            height: 1,
            background:
              "linear-gradient(to left, transparent, rgba(184,147,58,0.35))",
          }}
        />
      </div>

      {/* Hero book with 3D perspective */}
      <div style={{ perspective: 1400 }}>
        <img
          src={bookCover}
          alt="GTM for Professional Services"
          className="book-hero-reveal"
          style={{
            width: bookWidth,
            maxWidth: large ? "40vw" : "55vw",
            aspectRatio: "2/3",
            objectFit: "cover",
            borderRadius: large ? 8 : 6,
            transform: "rotateY(-8deg)",
            boxShadow: large
              ? "0 12px 32px rgba(0,0,0,0.35), 0 60px 100px rgba(0,0,0,0.30), -10px 0 30px rgba(0,0,0,0.18), 0 0 80px rgba(184,147,58,0.06)"
              : "0 8px 24px rgba(0,0,0,0.3), 0 40px 80px rgba(0,0,0,0.25), -6px 0 20px rgba(0,0,0,0.15)",
          }}
        />
      </div>

      {/* Reflection */}
      <div
        className="pointer-events-none overflow-hidden mx-auto"
        style={{
          width: bookWidth,
          maxWidth: large ? "40vw" : "55vw",
          height: reflectionHeight,
          marginTop: -2,
        }}
      >
        <img
          src={bookCover}
          alt=""
          aria-hidden="true"
          style={{
            width: "100%",
            aspectRatio: "2/3",
            objectFit: "cover",
            borderRadius: large ? 8 : 6,
            transform: "scaleY(-1) rotateY(-8deg)",
            opacity: 0.12,
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 75%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 75%)",
          }}
        />
      </div>

      {/* Edition label */}
      <span
        className="font-mono mt-4"
        style={{
          fontSize: large ? 10 : 9,
          color: "rgba(184,147,58,0.45)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        Q4 2026 · Mabbly Press · First Edition
      </span>
    </div>
  );
};

export default HeroSection;
