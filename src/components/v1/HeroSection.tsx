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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

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
      style={{ background: "#08070a" }}
    >
      {/* ── Cinematic lighting layers ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "140%",
          height: "120%",
          background:
            "radial-gradient(ellipse 40% 55% at 65% 0%, rgba(184,147,58,0.08) 0%, rgba(184,147,58,0.02) 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none hidden lg:block"
        style={{
          top: "15%",
          right: "10%",
          width: "600px",
          height: "700px",
          background:
            "radial-gradient(ellipse at center, rgba(184,147,58,0.06) 0%, rgba(184,147,58,0.02) 35%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "30%",
          left: "-5%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* ── Two-column grid ── */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-screen px-6 md:px-10 lg:px-[100px] py-20 max-w-[1600px] mx-auto">
        {/* ─── LEFT COLUMN ─── */}
        <div
          className="flex flex-col gap-6 md:gap-8 self-center order-2 lg:order-1"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 1s ease, transform 1s ease",
          }}
        >
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

          <div className="flex items-center gap-2.5">
            <span
              className="inline-block w-2 h-2 rounded-full animate-pulse"
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

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#apply"
              className="inline-flex items-center justify-center h-[52px] min-w-[200px] sm:min-w-[220px] rounded-full text-sm font-semibold no-underline cursor-pointer transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #b8972e 0%, #d4a832 100%)",
                color: "#1e1a10",
                fontFamily: "'Instrument Sans', sans-serif",
                boxShadow: "0 0 30px rgba(184,147,58,0.3), 0 4px 15px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 50px rgba(184,147,58,0.5), 0 4px 20px rgba(0,0,0,0.4)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 30px rgba(184,147,58,0.3), 0 4px 15px rgba(0,0,0,0.3)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Apply for a Research Session
            </a>
            <a
              href="#book"
              className="inline-flex items-center justify-center h-[52px] min-w-[180px] rounded-full text-sm font-medium no-underline cursor-pointer transition-all duration-300"
              style={{
                background: "transparent",
                border: "1.5px solid rgba(255,255,255,0.15)",
                color: "#ffffff",
                fontFamily: "'Instrument Sans', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(184,147,58,0.5)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(184,147,58,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Learn About the Book
            </a>
          </div>

          <div ref={statRef} className="flex flex-wrap sm:flex-nowrap mt-2 gap-y-4">
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
                  borderLeft: i > 0 ? "1px solid rgba(184,147,58,0.12)" : "none",
                }}
              >
                <span
                  className="text-[28px] sm:text-[36px] lg:text-[52px] leading-none font-bold block"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "#b8972e",
                    textShadow: "0 0 40px rgba(184,147,58,0.2)",
                  }}
                >
                  {stat.num}%
                </span>
                <span
                  className="text-[11px] md:text-xs block mt-2"
                  style={{
                    color: "#6b6560",
                    lineHeight: 1.5,
                    maxWidth: 140,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── RIGHT COLUMN - Cinematic Book ─── */}
        <div
          className="flex flex-col items-center justify-center order-1 lg:order-2"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 1.2s ease 0.3s, transform 1.2s ease 0.3s",
          }}
        >
          <div className="relative">
            <div
              className="absolute pointer-events-none"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "180%",
                height: "180%",
                background:
                  "radial-gradient(ellipse at center, rgba(184,147,58,0.1) 0%, rgba(184,147,58,0.04) 30%, transparent 60%)",
                filter: "blur(20px)",
                transition: "opacity 600ms ease",
                opacity: pageHover ? 1 : 0.6,
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                top: "-40%",
                left: "50%",
                transform: "translateX(-50%) rotate(-2deg)",
                width: "2px",
                height: "120%",
                background:
                  "linear-gradient(to bottom, rgba(184,147,58,0.15), transparent 70%)",
                filter: "blur(3px)",
                opacity: pageHover ? 0.8 : 0.3,
                transition: "opacity 600ms ease",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                top: "-40%",
                left: "45%",
                transform: "translateX(-50%) rotate(-8deg)",
                width: "1px",
                height: "100%",
                background:
                  "linear-gradient(to bottom, rgba(184,147,58,0.1), transparent 60%)",
                filter: "blur(2px)",
                opacity: pageHover ? 0.6 : 0.2,
                transition: "opacity 600ms ease",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                top: "-40%",
                left: "55%",
                transform: "translateX(-50%) rotate(5deg)",
                width: "1px",
                height: "100%",
                background:
                  "linear-gradient(to bottom, rgba(184,147,58,0.1), transparent 60%)",
                filter: "blur(2px)",
                opacity: pageHover ? 0.6 : 0.2,
                transition: "opacity 600ms ease",
              }}
            />

            <div
              onMouseEnter={() => setPageHover(true)}
              onMouseLeave={() => setPageHover(false)}
              style={{ perspective: 1200, cursor: "pointer" }}
            >
              <img
                src={bookOpen}
                alt="GTM for Professional Services - The Relationship Revenue OS book"
                className="relative z-10 max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-none lg:w-[300px] rounded-md"
                style={{
                  transform: pageHover
                    ? "rotateY(-6deg) rotateX(4deg) translateY(-8px) scale(1.03)"
                    : "rotateY(-3deg) rotateX(2deg)",
                  transition:
                    "transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 600ms ease",
                  boxShadow: pageHover
                    ? "0 40px 80px -20px rgba(0,0,0,0.7), 0 0 60px rgba(184,147,58,0.15), 0 15px 30px rgba(0,0,0,0.3)"
                    : "0 25px 50px -12px rgba(0,0,0,0.6), 0 0 30px rgba(184,147,58,0.05), 0 8px 20px rgba(0,0,0,0.2)",
                }}
              />
            </div>

            <div
              className="absolute pointer-events-none"
              style={{
                bottom: "-30px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "70%",
                height: "30px",
                background:
                  "radial-gradient(ellipse at center, rgba(184,147,58,0.08) 0%, transparent 70%)",
                filter: "blur(10px)",
              }}
            />
          </div>

          <span
            className="text-[9px] tracking-[0.2em] uppercase mt-10"
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
