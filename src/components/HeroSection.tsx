import { useState, useEffect, useRef } from "react";

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
          {/* Book with 3D transform */}
          <div style={{ perspective: 1200, position: "relative" }}>
            {/* Ambient shadow beneath the book */}
            <div
              style={{
                position: "absolute",
                bottom: -30,
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                height: 60,
                background: "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)",
                filter: "blur(20px)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                transform: "rotateY(-6deg) rotateX(3deg)",
                transformStyle: "preserve-3d",
                position: "relative",
              }}
            >
              {/* Page stack layers beneath (3 layers) */}
              {[3, 2, 1].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: i * 2,
                    left: i * 1,
                    width: 280 * 2 + 18,
                    height: 392,
                    background: i === 1 ? "#ece6d6" : i === 2 ? "#e8e2d2" : "#e4dece",
                    borderRadius: 2,
                    boxShadow: `0 ${i * 2}px ${i * 4}px rgba(0,0,0,0.1)`,
                    transform: `translateZ(${-i * 3}px)`,
                  }}
                />
              ))}

              {/* Main book spread */}
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  boxShadow:
                    "0 40px 80px rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* ── Left page (cover) ── */}
                <div
                  style={{
                    width: 280,
                    height: 392,
                    background: "linear-gradient(135deg, #ebe5d4 0%, #f0ead8 50%, #e8e2d0 100%)",
                    borderRadius: "3px 0 0 3px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    boxShadow: "inset -8px 0 16px rgba(0,0,0,0.12), inset 0 0 0 3px #ddd6c4",
                    overflow: "hidden",
                  }}
                >
                  {/* Subtle linen texture on cover */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0.04,
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23000000' fill-opacity='1'/%3E%3C/svg%3E\")",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Cover board edge (hard cover effect) */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 4,
                      border: "1px solid rgba(180,160,120,0.2)",
                      borderRadius: 1,
                      pointerEvents: "none",
                    }}
                  />

                  {/* Periodic table tile with concentric circles */}
                  <div style={{ position: "relative", marginBottom: 28 }}>
                    <svg
                      width="240"
                      height="240"
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
                        width: 100,
                        height: 100,
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
                      <span style={{ position: "absolute", top: 6, left: 8, fontSize: 11, color: "#ffffff", fontFamily: "'Instrument Sans', sans-serif" }}>50</span>
                      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 700, fontSize: 52, color: "#ffffff", lineHeight: 1, marginTop: 4, textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>Gt</span>
                      <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ffffff", fontFamily: "'Instrument Sans', sans-serif", marginTop: 2 }}>growth</span>
                    </div>
                  </div>

                  <span style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1e1a10", textAlign: "center", textShadow: "0 0.5px 0 rgba(255,255,255,0.5)" }}>
                    GTM for Professional Services
                  </span>
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 13, fontStyle: "italic", color: "#9a7a28", marginTop: 24, textAlign: "center" }}>
                    The Relationship Revenue OS
                  </span>
                  <div style={{ width: "60%", height: 0.5, background: "#c8b88a40", marginTop: 24 }} />
                  <span style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6b6060", marginTop: 12, textAlign: "center", fontFamily: "'Libre Baskerville', Georgia, serif" }}>
                    Adam Fridman · Richard Ashbaugh
                  </span>
                </div>

                {/* ── Spine (3D depth) ── */}
                <div
                  style={{
                    width: 18,
                    height: 392,
                    background: "linear-gradient(90deg, #2a2018 0%, #3a3020 30%, #352a1c 70%, #2a2018 100%)",
                    flexShrink: 0,
                    position: "relative",
                    boxShadow: "inset 0 0 8px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* Spine ridges */}
                  {[60, 120, 272, 332].map((top) => (
                    <div
                      key={top}
                      style={{
                        position: "absolute",
                        top,
                        left: 2,
                        right: 2,
                        height: 1,
                        background: "rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </div>

                {/* ── Right page (interior) ── */}
                <div
                  style={{
                    width: 280,
                    height: 392,
                    background: "#f5f0e2",
                    borderRadius: "0 3px 3px 0",
                    padding: "32px 28px",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "inset 8px 0 16px rgba(0,0,0,0.08)",
                    transformOrigin: "left center",
                    transform: pageHover ? "rotateY(-18deg)" : "rotateY(0deg)",
                    transition: "transform 400ms ease-in-out",
                    backfaceVisibility: "hidden",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setPageHover(true)}
                  onMouseLeave={() => setPageHover(false)}
                >
                  {/* Fore-edge (visible page edges on right side) */}
                  <div
                    style={{
                      position: "absolute",
                      top: 4,
                      right: -6,
                      width: 6,
                      height: 384,
                      borderRadius: "0 2px 2px 0",
                      background: "repeating-linear-gradient(180deg, #e8e0d0 0px, #e8e0d0 1px, #ddd6c6 1px, #ddd6c6 2px)",
                      boxShadow: "1px 0 3px rgba(0,0,0,0.15)",
                      transform: "translateZ(-1px)",
                    }}
                  />

                  {/* Chapter eyebrow */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "#9a8a6a", whiteSpace: "nowrap" }}>
                      Chapter One
                    </span>
                    <span style={{ flex: 1, height: 0.5, background: "#c8b88a", display: "block" }} />
                  </div>

                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 12, fontStyle: "italic", color: "#9a8a6a", marginBottom: 4 }}>
                    The founding problem
                  </span>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: "#1e1a10", lineHeight: 1.15, margin: "0 0 16px" }}>
                    The Wrong Map
                  </h3>

                  <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 11, lineHeight: 1.8, color: "#3a3020", textAlign: "justify", flex: 1 }}>
                    <p style={{ margin: "0 0 8px" }}>
                      Every GTM framework built in the last forty years shares one founding
                      assumption. It was never stated because it never had to be.
                    </p>
                    <p style={{ margin: 0 }}>
                      The assumption: your buyer has never heard of you. Your job is to find
                      them from zero.
                    </p>
                  </div>

                  <div style={{ borderTop: "1px solid #1e1a10", borderBottom: "1px solid #1e1a10", padding: "14px 0", marginTop: 16 }}>
                    <span style={{ fontSize: 7.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9a8a6a", display: "block", marginBottom: 6 }}>
                      The definition that changes everything
                    </span>
                    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 13, fontStyle: "italic", color: "#1e1a10", lineHeight: 1.5, margin: 0 }}>
                      "You were not bad at GTM. You were using the wrong map."
                    </p>
                  </div>

                  <div style={{ textAlign: "center", fontFamily: "'EB Garamond', serif", fontSize: 10, color: "#b0a080", letterSpacing: "0.1em", marginTop: 8 }}>
                    12
                  </div>
                </div>
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
              marginTop: 24,
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
