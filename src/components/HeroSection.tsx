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
          {/* 3D Open Book */}
          <div
            style={{ perspective: 1400, position: "relative", width: 510, height: 360 }}
            onMouseEnter={() => setPageHover(true)}
            onMouseLeave={() => setPageHover(false)}
          >
            {/* Ground shadow */}
            <div
              style={{
                position: "absolute",
                bottom: -35,
                left: "50%",
                transform: "translateX(-50%)",
                width: "115%",
                height: 70,
                background: "radial-gradient(ellipse 80% 45% at center, rgba(0,0,0,0.45) 0%, transparent 70%)",
                filter: "blur(22px)",
                pointerEvents: "none",
              }}
            />

            {/* Book wrapper with open-book angle */}
            <div
              style={{
                transformStyle: "preserve-3d",
                transform: pageHover
                  ? "rotateY(-12deg) rotateX(8deg) rotateZ(-1deg) translateY(-4px)"
                  : "rotateY(-8deg) rotateX(6deg) rotateZ(-1deg)",
                transition: "transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                position: "relative",
                width: 510,
                height: 360,
                cursor: "pointer",
              }}
            >
              {/* ── LEFT PAGE (COVER) ── */}
              <div
                style={{
                  position: "absolute",
                  width: 250,
                  height: 360,
                  left: 0,
                  top: 0,
                  background: "linear-gradient(145deg, #ede7d6 0%, #f2ecda 30%, #e8e2d0 70%, #ddd7c5 100%)",
                  borderRadius: "5px 0 0 5px",
                  transform: "translateZ(0px)",
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.1) inset, 0 -1px 0 rgba(0,0,0,0.05) inset, -4px 0 12px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {/* Cloth/linen texture */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.035,
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 5h1v1H1V5zm2-2h1v1H3V3zm2-2h1v1H5V1zM0 2h1v1H0V2zm2 2h1v1H2V4zm2-2h1v1H4V2z' fill='%23000' fill-opacity='1'/%3E%3C/svg%3E\")",
                    pointerEvents: "none",
                  }}
                />

                {/* Cover board edge / overhang frame */}
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    bottom: 3,
                    left: 3,
                    right: 0,
                    border: "1px solid rgba(180,160,120,0.18)",
                    borderRight: "none",
                    borderRadius: "2px 0 0 2px",
                    pointerEvents: "none",
                    boxShadow: "inset 0 0 8px rgba(180,160,120,0.06)",
                  }}
                />

                {/* Directional light overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, rgba(0,0,0,0.04) 100%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Gutter shadow on right edge near binding */}
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    width: 20,
                    height: "100%",
                    background: "linear-gradient(270deg, rgba(0,0,0,0.08) 0%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Periodic table tile with concentric circles */}
                <div style={{ position: "relative", marginBottom: 20 }}>
                  <svg
                    width="200"
                    height="200"
                    viewBox="0 0 240 240"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <circle cx="120" cy="120" r="68" fill="none" stroke="#c8a84020" strokeWidth="0.5" />
                    <circle cx="120" cy="120" r="90" fill="none" stroke="#c8a84020" strokeWidth="0.5" />
                    <circle cx="120" cy="120" r="112" fill="none" stroke="#c8a84020" strokeWidth="0.5" />
                  </svg>
                  <div
                    style={{
                      width: 85,
                      height: 85,
                      background: "linear-gradient(145deg, #a88830, #8a6a20)",
                      borderRadius: 6,
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
                    }}
                  >
                    <span style={{ position: "absolute", top: 5, left: 7, fontSize: 10, color: "#ffffff", fontFamily: "'Instrument Sans', sans-serif" }}>50</span>
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 700, fontSize: 44, color: "#ffffff", lineHeight: 1, marginTop: 4, textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>Gt</span>
                    <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ffffff", fontFamily: "'Instrument Sans', sans-serif", marginTop: 2 }}>growth</span>
                  </div>
                </div>

                <span style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1e1a10", textAlign: "center", textShadow: "0 0.5px 0 rgba(255,255,255,0.5)" }}>
                  GTM for Professional Services
                </span>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 12, fontStyle: "italic", color: "#9a7a28", marginTop: 20, textAlign: "center" }}>
                  The Relationship Revenue OS
                </span>
                <div style={{ width: "55%", height: 0.5, background: "#c8b88a40", marginTop: 20 }} />
                <span style={{ fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6b6060", marginTop: 10, textAlign: "center", fontFamily: "'Libre Baskerville', Georgia, serif" }}>
                  Adam Fridman · Richard Ashbaugh
                </span>

                {/* Outer edge specular highlight */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 2,
                    height: "100%",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* ── CENTER BINDING / SPINE CREASE ── */}
              <div
                style={{
                  position: "absolute",
                  left: 250,
                  top: 0,
                  width: 10,
                  height: 360,
                  background: "linear-gradient(90deg, #c8bca0 0%, #a89878 20%, #8a7a5a 50%, #a89878 80%, #c8bca0 100%)",
                  zIndex: 10,
                  boxShadow: "inset 0 0 6px rgba(0,0,0,0.3), 0 0 4px rgba(0,0,0,0.15)",
                }}
              >
                {/* Stitching marks along the binding */}
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: 30 + i * 40,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 2,
                      height: 8,
                      background: "rgba(60,50,30,0.25)",
                      borderRadius: 1,
                    }}
                  />
                ))}
              </div>

              {/* ── RIGHT PAGE (CHAPTER ONE) ── */}
              <div
                style={{
                  position: "absolute",
                  width: 250,
                  height: 360,
                  left: 260,
                  top: 0,
                  background: "#f5f0e2",
                  borderRadius: "0 5px 5px 0",
                  transform: "translateZ(0px)",
                  padding: "28px 22px",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.1) inset, 0 -1px 0 rgba(0,0,0,0.05) inset, 4px 0 12px rgba(0,0,0,0.1)",
                }}
              >
                {/* Paper texture */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.03,
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 5h1v1H1V5zm2-2h1v1H3V3zm2-2h1v1H5V1zM0 2h1v1H0V2zm2 2h1v1H2V4zm2-2h1v1H4V2z' fill='%23000' fill-opacity='1'/%3E%3C/svg%3E\")",
                    pointerEvents: "none",
                  }}
                />

                {/* Gutter shadow on left edge near binding */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 20,
                    height: "100%",
                    background: "linear-gradient(90deg, rgba(0,0,0,0.08) 0%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Chapter header */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 14 }}>
                  <span
                    style={{
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      fontSize: 8,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "#8a7a5a",
                    }}
                  >
                    Chapter One
                  </span>
                  <div style={{ width: 32, height: 1, background: "#b8972e", margin: "8px 0" }} />
                  <span
                    style={{
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      fontSize: 9,
                      fontStyle: "italic",
                      color: "#6b6060",
                    }}
                  >
                    The founding problem
                  </span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    fontSize: 19,
                    color: "#1e1a10",
                    textAlign: "center",
                    margin: "0 0 14px 0",
                    lineHeight: 1.2,
                  }}
                >
                  The Wrong Map
                </h3>

                {/* Body text */}
                <p
                  style={{
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: 11,
                    lineHeight: 1.65,
                    color: "#3a3530",
                    textAlign: "justify",
                    margin: "0 0 8px 0",
                  }}
                >
                  Most professional services firms were built on reputation, referrals, and relationships that
                  formed organically over decades of practice.
                </p>
                <p
                  style={{
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: 11,
                    lineHeight: 1.65,
                    color: "#3a3530",
                    textAlign: "justify",
                    margin: "0 0 14px 0",
                  }}
                >
                  When growth slowed, these firms reached for the same playbook that works for SaaS and
                  consumer brands. They bought ads, hired SDRs, and invested in marketing automation.
                </p>

                {/* Pullquote */}
                <div
                  style={{
                    borderTop: "1px solid #c8b88a60",
                    borderBottom: "1px solid #c8b88a60",
                    padding: "10px 6px",
                    margin: "0 0 14px 0",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontStyle: "italic",
                      fontSize: 11,
                      lineHeight: 1.6,
                      color: "#9a7a28",
                      textAlign: "center",
                      margin: 0,
                    }}
                  >
                    "You were not bad at GTM. You were using the wrong map."
                  </p>
                </div>

                {/* Page number */}
                <span
                  style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: 9,
                    color: "#8a7a5a",
                    textAlign: "center",
                    marginTop: "auto",
                  }}
                >
                  12
                </span>
              </div>
            </div>
          </div>

          {/* Edition label */}
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
