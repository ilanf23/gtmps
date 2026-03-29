import { useState, useEffect, useRef } from "react";
import bookOpen from "@/assets/book-open.png";

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
  const statRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [pageHover, setPageHover] = useState(false);

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
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#0e0d0b",
        overflow: "hidden",
      }}
    >
      {/* Noise texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.03,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Two-column grid */}
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
          minHeight: "100vh",
          padding: "80px 120px",
          maxWidth: 1600,
          margin: "0 auto",
        }}
      >
        {/* ─── LEFT COLUMN ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32, alignSelf: "center" }}>
          {/* Kicker */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 28, height: 1, background: "#b8972e" }} />
            <span
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#b8972e",
              }}
            >
              Book Research · Limited to 50 Sessions
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: 76,
              lineHeight: 0.95,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            The First GTM
            <br />
            Book for
            <br />
            Professional
            <br />
            Services<span style={{ color: "#b8972e" }}>.</span>
          </h1>

          {/* Sessions badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#b8972e",
              }}
            />
            <span
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#6b6560",
              }}
            >
              46 of 50 sessions remaining
            </span>
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 16 }}>
            <a
              href="#apply"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 52,
                minWidth: 220,
                borderRadius: 9999,
                background: "#b8972e",
                color: "#1e1a10",
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                transition: "background 200ms",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#d4a832")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#b8972e")}
            >
              Apply for a Research Session
            </a>
            <a
              href="#book"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 52,
                minWidth: 180,
                borderRadius: 9999,
                background: "transparent",
                border: "1.5px solid rgba(255,255,255,0.25)",
                color: "#ffffff",
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                transition: "border-color 200ms",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)")
              }
            >
              Learn About the Book
            </a>
          </div>

          {/* Stats */}
          <div ref={statRef} style={{ display: "flex", gap: 0, marginTop: 8 }}>
            {[
              { num: stat1, label: "of PS firm CRM contacts are dormant" },
              { num: stat2, label: "of revenue from existing relationships" },
              { num: stat3, label: "average reply rate, generic outreach" },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  paddingLeft: i > 0 ? 24 : 0,
                  paddingRight: i < 2 ? 24 : 0,
                  borderLeft: i > 0 ? "1px solid #2a2720" : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    fontSize: 52,
                    lineHeight: 1,
                    color: "#b8972e",
                    display: "block",
                  }}
                >
                  {stat.num}%
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#6b6560",
                    lineHeight: 1.5,
                    maxWidth: 120,
                    display: "block",
                    marginTop: 8,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onMouseEnter={() => setPageHover(true)}
            onMouseLeave={() => setPageHover(false)}
            style={{
              perspective: 1200,
              cursor: "pointer",
            }}
          >
            <img
              src={bookOpen}
              alt="GTM for Professional Services — The Relationship Revenue OS book"
              style={{
                maxWidth: "100%",
                width: 520,
                borderRadius: 6,
                transform: pageHover
                  ? "rotateY(-6deg) rotateX(4deg) translateY(-4px)"
                  : "rotateY(-3deg) rotateX(2deg)",
                transition: "transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                boxShadow: pageHover
                  ? "0 30px 60px -15px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.2)"
                  : "0 20px 40px -10px rgba(0,0,0,0.4), 0 6px 16px rgba(0,0,0,0.15)",
              }}
            />
          </div>

          <span
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#4a4540",
              marginTop: 32,
            }}
          >
            Q4 2026 · Mabbly Press · First Edition
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
