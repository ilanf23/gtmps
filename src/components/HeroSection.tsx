import bookCover from "@/assets/book-cover.png";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#0D1117" }}
    >
      {/* Background layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, transparent 40%, rgba(184,147,58,0.04) 50%, rgba(184,147,58,0.08) 60%, rgba(184,147,58,0.03) 70%, transparent 80%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 900, height: 900, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184,147,58,0.10) 0%, rgba(184,147,58,0.04) 30%, transparent 65%)",
          right: "-15%", top: "-5%",
          animation: "glowPulse 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184,147,58,0.06) 0%, transparent 70%)",
          right: "15%", top: "50%", transform: "translateY(-50%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      <div className="relative flex flex-col lg:flex-row items-center px-6 pt-[100px] pb-[60px] lg:px-20 lg:pt-[120px] lg:pb-20 gap-10 lg:gap-8 max-w-[1400px] mx-auto min-h-screen overflow-hidden">
        {/* Book spread on mobile first */}
        <div className="block lg:hidden w-full">
          <BookSpread />
        </div>

        {/* Left column — text only */}
        <div className="w-full lg:w-[45%] relative z-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div className="h-px bg-gold" style={{ width: 40 }} />
            <span className="font-mono uppercase tracking-[0.2em] text-gold" style={{ fontSize: 10 }}>
              Book Research · Limited to 50 Sessions
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display font-black text-white mt-7"
            style={{
              fontSize: "clamp(44px, 5.5vw, 76px)",
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

          {/* Urgency strip */}
          <div className="flex items-center gap-2.5 mt-8">
            <span
              className="inline-block rounded-full bg-gold"
              style={{ width: 8, height: 8, animation: "dotPulse 2s infinite" }}
            />
            <span className="font-mono uppercase tracking-[0.14em] text-gold" style={{ fontSize: 11 }}>
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

          {/* Stat strip */}
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
                  style={{ fontSize: 11, color: "rgba(255,255,255,0.30)", lineHeight: 1.45, maxWidth: 140 }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — book spread (desktop) */}
        <div className="hidden lg:flex w-[55%] items-center justify-center relative">
          <BookSpread large />
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
          style={{ fontSize: 9, color: "rgba(184,147,58,0.7)", letterSpacing: "0.2em", marginBottom: 14 }}
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

/* ── Book Spread: cover + chapter page side by side ── */
const BookSpread = ({ large }: { large?: boolean }) => {
  const h = large ? 380 : 280;
  const glowSize = large ? 500 : 350;

  return (
    <div className="relative flex flex-col items-center">
      {/* Ambient glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: glowSize, height: glowSize,
          background: "radial-gradient(circle, rgba(184,147,58,0.12) 0%, rgba(184,147,58,0.03) 40%, transparent 70%)",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        }}
      />

      {/* The spread — both sides share the same fixed height */}
      <div
        className="relative flex flex-row items-stretch"
        style={{ height: h, gap: 3 }}
      >
        {/* Book cover */}
        <img
          src={bookCover}
          alt="GTM for Professional Services"
          style={{
            height: "100%",
            width: "auto",
            objectFit: "cover",
            borderRadius: "6px 2px 2px 6px",
            boxShadow: large
              ? "-6px 6px 24px rgba(0,0,0,0.4), 0 30px 60px rgba(0,0,0,0.25)"
              : "-4px 4px 16px rgba(0,0,0,0.35)",
          }}
        />

        {/* Chapter page — same height as cover */}
        <div
          style={{
            height: "100%",
            width: h * 0.62,
            background: "#f5f0e8",
            padding: large ? "28px 24px 20px" : "20px 16px 14px",
            borderRadius: "2px 6px 6px 2px",
            boxShadow: large
              ? "6px 6px 24px rgba(0,0,0,0.4), 0 30px 60px rgba(0,0,0,0.25)"
              : "4px 4px 16px rgba(0,0,0,0.35)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column" as const,
          }}
        >
          {/* Chapter eyebrow */}
          <div
            className="flex items-center gap-3"
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: large ? 9 : 7.5,
              letterSpacing: "0.22em",
              textTransform: "uppercase" as const,
              color: "#9a8a6a",
              marginBottom: large ? 14 : 10,
            }}
          >
            Chapter One
            <span className="flex-1 block" style={{ height: 0.5, background: "#c8b88a" }} />
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: large ? 10 : 8,
              fontStyle: "italic",
              color: "#7a6a4a",
              letterSpacing: "0.04em",
              marginBottom: 3,
            }}
          >
            The founding problem
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: large ? 17 : 13,
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#1e1a10",
              margin: large ? "0 0 12px" : "0 0 8px",
            }}
          >
            The Wrong Map
          </h3>

          {/* Body */}
          <div
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: large ? 10.5 : 8.5,
              lineHeight: 1.75,
              color: "#3a3020",
              textAlign: "justify" as const,
              flex: 1,
              overflow: "hidden",
            }}
          >
            <p style={{ margin: "0 0 6px" }}>
              Every GTM framework built in the last forty years shares a single founding assumption. It was never stated explicitly because it never had to be.
            </p>
            <p style={{ margin: 0 }}>
              The assumption is this: your buyer does not know you yet. Your job is to find them, interrupt them, and earn their attention from zero.
            </p>
          </div>

          {/* Pull quote */}
          <blockquote
            style={{
              borderTop: "1.5px solid #1e1a10",
              borderBottom: "1.5px solid #1e1a10",
              padding: large ? "10px 0 8px" : "6px 0 4px",
              marginTop: large ? 10 : 6,
            }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: large ? 11.5 : 9,
                fontStyle: "italic",
                lineHeight: 1.4,
                color: "#1e1a10",
                margin: 0,
              }}
            >
              "You were not bad at GTM. You were using the wrong map."
            </p>
          </blockquote>

          {/* Page number */}
          <div
            style={{
              textAlign: "center" as const,
              fontFamily: "'EB Garamond', serif",
              fontSize: large ? 9 : 7,
              color: "#b0a080",
              letterSpacing: "0.1em",
              marginTop: 6,
            }}
          >
            12
          </div>
        </div>
      </div>

      {/* Edition label */}
      <span
        className="font-mono mt-5"
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
