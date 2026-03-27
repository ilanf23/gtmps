import { useState, useEffect, useRef, useCallback } from "react";
import bookCover from "@/assets/book-cover.png";

/* ── Stat counter hook ── */
function useCountUp(
  target: number,
  duration: number,
  decimal: boolean,
  delay: number,
  trigger: boolean
) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!trigger || started.current) return;
    started.current = true;

    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timeout);
  }, [trigger, target, duration, delay]);

  return decimal ? value.toFixed(1) : Math.round(value).toString();
}

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!bookRef.current) return;
    const rect = bookRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLightPos({ x, y });
  }, []);

  const counterRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;
    el.style.animation = "counterPulse 700ms ease-in-out";
    const handler = () => { el.style.animation = ""; };
    el.addEventListener("animationend", handler);
    return () => el.removeEventListener("animationend", handler);
  }, []);

  const statRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  useEffect(() => {
    const el = statRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stat1 = useCountUp(96, 1400, false, 0, statsVisible);
  const stat2 = useCountUp(70, 1400, false, 120, statsVisible);
  const stat3 = useCountUp(1.3, 1400, true, 240, statsVisible);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#0D1117" }}
      onMouseMove={handleMouseMove}
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

      {/* Two-column grid */}
      <div
        className="relative mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center px-5 py-8 md:px-10 md:py-12 lg:px-20 lg:py-16 lg:min-h-screen"
        style={{ maxWidth: 1400 }}
      >
        {/* Left column */}
        <div className="relative z-10">
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
              fontSize: "clamp(32px, 5.5vw, 76px)",
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
              style={{ width: 8, height: 8, animation: "dotFade 2.4s ease-in-out infinite" }}
            />
            <span
              ref={counterRef}
              className="font-mono uppercase tracking-[0.14em] text-gold"
              style={{ fontSize: 11, willChange: "transform" }}
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
                padding: "14px 28px",
              }}
              className="font-sans font-semibold text-center rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(184,147,58,0.3)] sm:!py-[17px] sm:!px-[44px]"
            >
              Apply for a Research Session
            </a>
            <a
              href="#book"
              className="font-sans font-medium text-center rounded-full transition-all duration-300 hover:bg-white/10 hover:border-white/30 sm:!py-[17px] sm:!px-[44px]"
              style={{
                fontSize: 15,
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.6)",
                padding: "14px 28px",
              }}
            >
              Learn About the Book
            </a>
          </div>

          {/* Stat strip */}
          <div ref={statRef} className="flex gap-0 mt-14">
            {[
              { num: stat1, label: "of PS firm CRM contacts are dormant" },
              { num: stat2, label: "of revenue from existing relationships" },
              { num: stat3, label: "average reply rate, generic outreach" },
            ].map((stat, i) => (
              <div
                key={i}
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
                  {stat.num}%
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

        {/* Right column — book */}
        <div className="flex items-center justify-center">
          <BookMockup bookRef={bookRef} lightPos={lightPos} />
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

/* ── Book Mockup ── */
const BookMockup = ({
  bookRef,
  lightPos,
}: {
  bookRef: React.RefObject<HTMLDivElement>;
  lightPos: { x: number; y: number };
}) => {
  const [pageHover, setPageHover] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      ref={bookRef}
      className="relative flex flex-col items-center"
      style={{ width: "100%", maxWidth: 540, margin: "0 auto" }}
    >
      {/* Book object */}
      <div
        style={{
          position: "relative",
          width: "100%",
          transform: "rotate(-1deg)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 12px 24px rgba(0,0,0,0.3)",
          opacity: mounted ? 1 : 0,
          transition: "opacity 900ms cubic-bezier(0.22, 1, 0.36, 1)",
          perspective: 1200,
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          {/* Cover page (left) */}
          <div
            style={{
              width: "50%",
              background: "#F5EDD8",
              minHeight: 420,
              maxHeight: 480,
              borderRadius: "2px 0 0 2px",
              boxShadow: "inset -12px 0 24px rgba(0,0,0,0.12)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <img
              src={bookCover}
              alt="GTM for Professional Services"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                borderRadius: "2px 0 0 2px",
              }}
            />
            {/* Ambient light overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: "2px 0 0 2px",
                mixBlendMode: "overlay",
                opacity: 0.18,
                background: `radial-gradient(circle at ${lightPos.x}% ${lightPos.y}%, rgba(255,210,120,0.6) 0%, transparent 55%)`,
              }}
            />
          </div>

          {/* Spine */}
          <div
            style={{
              width: 10,
              flexShrink: 0,
              alignSelf: "stretch",
              background: "#1A0A00",
            }}
          />

          {/* Chapter page (right) */}
          <div
            style={{
              width: "50%",
              position: "relative",
              minHeight: 420,
              maxHeight: 480,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Revealed interior page (behind turning page) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "#ede5d5",
                borderRadius: "0 2px 2px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 28,
              }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 16,
                  lineHeight: 1.5,
                  color: "rgba(184,147,58,0.5)",
                  textAlign: "center",
                  maxWidth: "90%",
                }}
              >
                "The market you need to win is already in your CRM."
              </p>
            </div>

            {/* Main chapter page (turns on hover) */}
            <div
              onMouseEnter={() => setPageHover(true)}
              onMouseLeave={() => setPageHover(false)}
              style={{
                position: "relative",
                zIndex: 1,
                height: "100%",
                width: "100%",
                background: "#FDFAF4",
                padding: "32px 28px",
                borderRadius: "0 2px 2px 0",
                boxShadow: "inset 12px 0 20px rgba(0,0,0,0.06)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transformOrigin: "left center",
                transform: pageHover ? "rotateY(-20deg)" : "rotateY(0deg)",
                transition: "transform 400ms ease-in-out",
                backfaceVisibility: "hidden",
              }}
            >
              {/* Chapter eyebrow */}
              <div
                className="flex items-center gap-3"
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#9a8a6a",
                  marginBottom: 14,
                }}
              >
                Chapter One
                <span className="flex-1 block" style={{ height: 0.5, background: "#c8b88a" }} />
              </div>

              {/* Subtitle */}
              <div
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 10,
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
                  fontSize: 17,
                  fontWeight: 700,
                  lineHeight: 1.15,
                  color: "#1e1a10",
                  margin: "0 0 12px",
                }}
              >
                The Wrong Map
              </h3>

              {/* Body */}
              <div
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: 10.5,
                  lineHeight: 1.75,
                  color: "#3a3020",
                  textAlign: "justify",
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
                  padding: "10px 0 8px",
                  marginTop: 10,
                }}
              >
                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 11.5,
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
                  textAlign: "center",
                  fontFamily: "'EB Garamond', serif",
                  fontSize: 9,
                  color: "#b0a080",
                  letterSpacing: "0.1em",
                  marginTop: 6,
                }}
              >
                12
              </div>
            </div>
          </div>
        </div>

        {/* Bottom edge strip */}
        <div
          style={{
            position: "absolute",
            bottom: -6,
            left: 0,
            right: 0,
            height: 6,
            background: "#1A0A00",
            borderRadius: "0 0 4px 4px",
          }}
        />
      </div>

      {/* Edition label */}
      <span
        className="font-mono mt-5"
        style={{
          fontSize: 10,
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
