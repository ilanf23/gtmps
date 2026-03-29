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
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#0e0d0b" }}
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Two-column grid */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center min-h-screen px-6 md:px-10 lg:px-[120px] py-20 max-w-[1600px] mx-auto">
        {/* ─── LEFT COLUMN ─── */}
        <div className="flex flex-col gap-6 md:gap-8 self-center order-2 lg:order-1">
          {/* Kicker */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-px" style={{ background: "#b8972e" }} />
            <span
              className="text-[10px] tracking-[0.22em] uppercase"
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                color: "#b8972e",
              }}
            >
              Book Research · Limited to 50 Sessions
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-[40px] sm:text-[56px] lg:text-[76px] leading-[0.95] font-[800] m-0"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              color: "#ffffff",
              letterSpacing: "-0.02em",
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
          <div className="flex items-center gap-2.5">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: "#b8972e" }}
            />
            <span
              className="text-[10px] tracking-[0.18em] uppercase"
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                color: "#6b6560",
              }}
            >
              46 of 50 sessions remaining
            </span>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#apply"
              className="inline-flex items-center justify-center h-[52px] min-w-[200px] sm:min-w-[220px] rounded-full text-sm font-semibold no-underline cursor-pointer transition-colors duration-200"
              style={{
                background: "#b8972e",
                color: "#1e1a10",
                fontFamily: "'Instrument Sans', sans-serif",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#d4a832")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#b8972e")}
            >
              Apply for a Research Session
            </a>
            <a
              href="#book"
              className="inline-flex items-center justify-center h-[52px] min-w-[180px] rounded-full text-sm font-medium no-underline cursor-pointer transition-colors duration-200"
              style={{
                background: "transparent",
                border: "1.5px solid rgba(255,255,255,0.25)",
                color: "#ffffff",
                fontFamily: "'Instrument Sans', sans-serif",
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
          <div ref={statRef} className="flex mt-2">
            {[
              { num: stat1, label: "of PS firm CRM contacts are dormant" },
              { num: stat2, label: "of revenue from existing relationships" },
              { num: stat3, label: "average reply rate, generic outreach" },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex-1"
                style={{
                  paddingLeft: i > 0 ? 16 : 0,
                  paddingRight: i < 2 ? 16 : 0,
                  borderLeft: i > 0 ? "1px solid #2a2720" : "none",
                }}
              >
                <span
                  className="text-[28px] sm:text-[36px] lg:text-[52px] leading-none font-bold block"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "#b8972e",
                  }}
                >
                  {stat.num}%
                </span>
                <span
                  className="text-[11px] md:text-xs block mt-2"
                  style={{
                    color: "#6b6560",
                    lineHeight: 1.5,
                    maxWidth: 120,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div className="flex flex-col items-center justify-center order-1 lg:order-2">
          <div
            onMouseEnter={() => setPageHover(true)}
            onMouseLeave={() => setPageHover(false)}
            style={{ perspective: 1200, cursor: "pointer" }}
          >
            <img
              src={bookOpen}
              alt="GTM for Professional Services — The Relationship Revenue OS book"
              className="max-w-[210px] sm:max-w-[270px] md:max-w-[315px] lg:max-w-none lg:w-[390px] rounded-md"
              style={{
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
            className="text-[9px] tracking-[0.2em] uppercase mt-8"
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              color: "#4a4540",
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
