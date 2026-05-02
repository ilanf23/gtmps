import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  /** Set true once the section enters the viewport. Triggers the reveal animation. */
  triggered: boolean;
  /** Render fully assembled with no animation (reduced-motion or fallback). */
  staticMode?: boolean;
  className?: string;
}

/**
 * Five concentric gold rings with pill-style labels positioned trigonometrically
 * around each ring at distinct clock angles. Mobile (<768px) renders a vertical
 * orbit list instead of the SVG diagram.
 */

type Orbit = {
  n: string;
  title: string;
  desc: string;
  r: number;
  angle: number;
  emphasis?: boolean;
  detail: string;
  chapter: number;
};

const orbits: Orbit[] = [
  { n: "01", title: "Core Proof",     desc: "Best stories",       r: 50,  angle: 270, chapter: 2,
    detail: "Your existing clients, case studies, named outcomes. The proof base every other orbit references." },
  { n: "02", title: "Active",         desc: "Current pipeline",   r: 100, angle: 342, chapter: 3,
    detail: "Pipeline that is currently engaged. Where most firms over-invest." },
  { n: "03", title: "The Dead Zone",  desc: "Highest ROI layer",  r: 150, angle: 54,  emphasis: true, chapter: 1,
    detail: "Dormant relationships. The framework reactivated $400K at Madcraft in 7 minutes." },
  { n: "04", title: "Warm Adjacency", desc: "Referral network",   r: 200, angle: 126, chapter: 4,
    detail: "Referrals already inside reach. The network of networks." },
  { n: "05", title: "New Gravity",    desc: "ICP matched market", r: 250, angle: 198, chapter: 5,
    detail: "New firms pulled by your authority. The category creation play." },
];

const layers = ["DISCOVER", "PROVE", "DESIGN", "ACTIVATE", "COMPOUND"];
const formulaTokens = ["Signal", "+", "Proof", "+", "Context", "="];

const CENTER = 300;
const GOLD = "#A8923A";
const GOLD_DIM = "rgba(168, 146, 58,0.4)";

const FiveOrbitsDiagram = ({ triggered, staticMode = false, className = "" }: Props) => {
  const isMobile = useIsMobile();
  const playing = triggered || staticMode;
  const [active, setActive] = useState<Orbit | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null); // mobile inline

  // ESC to dismiss modal
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    // lock scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active]);


  // Ring draw timing
  const ringDur = 800;
  const ringStep = 150;
  const labelDelayAfterRing = 200;
  const totalRingsDur = ringDur + (orbits.length - 1) * ringStep; // ~1400ms
  const layersStart = totalRingsDur + 400;
  const layerStep = 70;
  const formulaStart = layersStart + layerStep * layers.length + 200;
  const formulaTokenStep = 80;

  return (
    <div className={`relative w-full ${className}`}>
      <style>{`
        @keyframes orbitDraw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes orbitPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        @keyframes orbitLabelFade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes orbitChipFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .orbit-03-pulse { animation: orbitPulse 1.5s ease-in-out infinite; }
        .orbit-hit {
          cursor: pointer;
          transition: stroke-width 180ms ease, opacity 180ms ease, filter 180ms ease;
        }
        .orbit-hit:hover { stroke-width: 2.6 !important; filter: drop-shadow(0 0 6px rgba(168, 146, 58,0.55)); }
        .orbit-hit-emph:hover { stroke-width: 3 !important; }
        .orbit-label-g { cursor: pointer; }
        .orbit-label-g rect {
          transition: fill 180ms ease, stroke 180ms ease;
        }
        .orbit-label-g:hover rect { fill: rgba(168, 146, 58,0.18); stroke: #A8923A; }
        .orbit-label-g:focus-visible { outline: none; }
        .orbit-label-g:focus-visible rect { stroke: #EDF5EC; stroke-width: 2; }

        @keyframes orbitModalSlide {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes orbitModalFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .orbit-modal-panel { animation: orbitModalFade 200ms ease forwards !important; transform: none !important; }
        }
      `}</style>

      {isMobile ? (
        // ── Mobile: vertical orbit list with tap-to-expand ───────────────
        <ul className="mx-auto w-full max-w-[420px] flex flex-col gap-3 px-2">
          {orbits.map((o) => {
            const isDZ = !!o.emphasis;
            const isOpen = expanded === o.n;
            return (
              <li key={o.n}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : o.n)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: "14px 16px",
                    background: isDZ ? "rgba(168, 146, 58,0.08)" : "rgba(255,253,248,0.02)",
                    borderLeft: `2px solid ${isDZ ? GOLD : "rgba(168, 146, 58,0.25)"}`,
                    borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                    borderRadius: 4,
                    textAlign: "left",
                    cursor: "pointer",
                    minHeight: 48,
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 11,
                      letterSpacing: 1.4,
                      color: GOLD,
                      paddingTop: 2,
                      minWidth: 22,
                    }}
                  >
                    {o.n}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                    <span
                      className="font-display"
                      style={{
                        fontSize: 15,
                        fontWeight: isDZ ? 600 : 500,
                        color: isDZ ? GOLD : "#EDF5EC",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {o.title}
                    </span>
                    <span
                      className="font-display"
                      style={{ fontSize: 12, color: "rgba(245,241,232,0.55)", fontWeight: 300 }}
                    >
                      {o.desc}
                    </span>
                  </div>
                  <span aria-hidden style={{ color: GOLD, fontSize: 14, paddingTop: 2 }}>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: "12px 16px 16px 36px",
                      borderLeft: `2px solid ${isDZ ? GOLD : "rgba(168, 146, 58,0.25)"}`,
                      borderRadius: "0 0 4px 4px",
                      background: "rgba(237, 245, 236,0.03)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 15,
                        lineHeight: 1.55,
                        color: "rgba(237, 245, 236,0.78)",
                        margin: "0 0 12px",
                      }}
                    >
                      {o.detail}
                    </p>
                    <a
                      href={`/manuscript#chapter-${o.chapter}`}
                      style={{
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 12,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: GOLD,
                        textDecoration: "none",
                        borderBottom: `1px solid ${GOLD_DIM}`,
                        paddingBottom: 2,
                      }}
                    >
                      Read Chapter {o.chapter} →
                    </a>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        // ── Desktop: SVG diagram ──────────────────────────────────────────
        <svg
          viewBox="0 0 600 600"
          className="block w-full mx-auto"
          style={{ maxWidth: 600, aspectRatio: "1 / 1" }}
          aria-label="The Relationship Revenue OS — Five Orbits diagram"
        >
          <defs>
            <radialGradient id="orbit-center-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(212,174,72,0.45)" />
              <stop offset="60%"  stopColor="rgba(168, 146, 58,0.08)" />
              <stop offset="100%" stopColor="rgba(168, 146, 58,0)" />
            </radialGradient>
          </defs>

          {/* Center glow + marker */}
          <circle cx={CENTER} cy={CENTER} r={36} fill="url(#orbit-center-glow)" />
          <circle cx={CENTER} cy={CENTER} r={4} fill={GOLD} />

          {/* Rings — draw sequentially on trigger */}
          {orbits.map((o, i) => {
            const circ = 2 * Math.PI * o.r;
            const isDZ = !!o.emphasis;
            const stroke = isDZ ? GOLD : GOLD_DIM;
            const strokeWidth = isDZ ? 2 : 1;

            const ringStyle: React.CSSProperties = staticMode
              ? { opacity: 1 }
              : {
                  strokeDasharray: circ,
                  strokeDashoffset: playing ? undefined : circ,
                  transformOrigin: `${CENTER}px ${CENTER}px`,
                  transform: "rotate(-90deg)",
                  animation: playing
                    ? `orbitDraw ${ringDur}ms ${i * ringStep}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`
                    : undefined,
                };

            return (
              <circle
                key={`ring-${o.n}`}
                cx={CENTER}
                cy={CENTER}
                r={o.r}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                className={`${isDZ && !staticMode ? "orbit-03-pulse " : ""}orbit-hit${isDZ ? " orbit-hit-emph" : ""}`}
                style={{ ...ringStyle, pointerEvents: "stroke" }}
                onClick={() => setActive(o)}
              />
            );
          })}

          {/* Labels — pill background + centered text */}
          {orbits.map((o, i) => {
            const angleRad = ((o.angle - 90) * Math.PI) / 180;
            const x = CENTER + o.r * Math.cos(angleRad);
            const y = CENTER + o.r * Math.sin(angleRad);
            const isDZ = !!o.emphasis;

            const labelText = `${o.n}  ${o.title}`;
            // Approx pill width from text length
            const pillW = Math.max(96, labelText.length * 7.2 + 24);
            const pillH = 26;

            const labelDelay = ringDur + i * ringStep + labelDelayAfterRing;

            const groupStyle: React.CSSProperties = staticMode
              ? { opacity: 1 }
              : {
                  opacity: playing ? undefined : 0,
                  animation: playing
                    ? `orbitLabelFade 380ms ${labelDelay}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`
                    : undefined,
                  transformOrigin: `${x}px ${y}px`,
                };

            return (
              <g
                key={`label-${o.n}`}
                className="orbit-label-g"
                style={groupStyle}
                role="button"
                tabIndex={0}
                onClick={() => setActive(o)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(o); } }}
              >
                <rect
                  x={x - pillW / 2}
                  y={y - pillH / 2}
                  width={pillW}
                  height={pillH}
                  rx={pillH / 2}
                  fill="#0A0807"
                  stroke={isDZ ? GOLD : GOLD_DIM}
                  strokeWidth={isDZ ? 1.5 : 1}
                  className={isDZ && !staticMode ? "orbit-03-pulse" : undefined}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dy="0.35em"
                  fontFamily="'Inter Tight', sans-serif"
                  fontSize={12}
                  fontWeight={isDZ ? 600 : 500}
                  fill={isDZ ? GOLD : "#EDF5EC"}
                  letterSpacing={isDZ ? 0.2 : 0}
                  style={{ whiteSpace: "pre", pointerEvents: "none" }}
                >
                  {labelText}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {/* Layer flow */}
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 mt-16">
        {layers.map((l, i) => (
          <div key={l} className="flex items-center gap-2">
            <span
              className="font-display uppercase rounded-full"
              style={{
                fontSize: 11,
                letterSpacing: "0.22em",
                color: "#EDF5EC",
                padding: "8px 16px",
                border: "1px solid rgba(168, 146, 58,0.45)",
                background: "rgba(255,253,248,0.02)",
                fontWeight: 500,
                opacity: playing ? undefined : 0,
                animation:
                  playing && !staticMode
                    ? `orbitChipFade 360ms ${layersStart + i * layerStep}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`
                    : undefined,
                ...(staticMode ? { opacity: 1 } : {}),
              }}
            >
              {l}
            </span>
            {i < layers.length - 1 && (
              <span
                style={{
                  color: "rgba(212,174,72,0.7)",
                  fontSize: 14,
                  opacity: playing ? undefined : 0,
                  animation:
                    playing && !staticMode
                      ? `orbitChipFade 360ms ${layersStart + i * layerStep + 35}ms ease-out forwards`
                      : undefined,
                  ...(staticMode ? { opacity: 1 } : {}),
                }}
              >
                →
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Formula */}
      <div className="text-center mx-auto mt-14 px-4" style={{ maxWidth: 800 }}>
        <p
          className="font-mono uppercase mb-3"
          style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(212,174,72,0.7)" }}
        >
          The Formula
        </p>
        <p
          className="font-display"
          style={{
            color: "#EDF5EC",
            fontSize: "clamp(22px, 2.4vw, 32px)",
            lineHeight: 1.35,
            fontWeight: 500,
            letterSpacing: "-0.012em",
          }}
        >
          {formulaTokens.map((t, i) => (
            <span
              key={i}
              style={{
                marginRight: 8,
                display: "inline-block",
                opacity: playing ? undefined : 0,
                animation:
                  playing && !staticMode
                    ? `orbitChipFade 320ms ${formulaStart + i * formulaTokenStep}ms ease-out forwards`
                    : undefined,
                ...(staticMode ? { opacity: 1 } : {}),
              }}
            >
              {t}
            </span>
          ))}
          <span
            style={{
              color: GOLD,
              fontStyle: "italic",
              opacity: playing ? undefined : 0,
              animation:
                playing && !staticMode
                  ? `orbitChipFade 360ms ${formulaStart + formulaTokens.length * formulaTokenStep + 80}ms ease-out forwards`
                  : undefined,
              ...(staticMode ? { opacity: 1 } : {}),
            }}
          >
            Response, Not Pitch.
          </span>
        </p>
      </div>

      {/* Desktop modal — slide-in from right */}
      {!isMobile && active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="orbit-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(8,6,4,0.6)',
            animation: 'orbitModalFade 240ms ease forwards',
          }}
          onClick={() => setActive(null)}
        >
          <div
            className="orbit-modal-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              height: '100%',
              width: 480,
              maxWidth: '92vw',
              background: '#EDF5EC',
              borderLeft: '1px solid #A8923A',
              boxShadow: '-20px 0 60px -20px rgba(0,0,0,0.5)',
              padding: '56px 40px 40px',
              overflowY: 'auto',
              animation: 'orbitModalSlide 400ms cubic-bezier(0.22,1,0.36,1) forwards',
              fontFamily: "'Inter Tight', sans-serif",
            }}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 40, height: 40, border: 'none', background: 'transparent',
                fontSize: 22, color: '#6A5038', cursor: 'pointer', lineHeight: 1,
              }}
            >×</button>
            <p style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.32em',
              textTransform: 'uppercase', color: '#A8923A', margin: 0,
            }}>Orbit {active.n}</p>
            <h3 id="orbit-modal-title" style={{
              fontFamily: "var(--font-display)",
              fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 500, color: '#2A1A08',
              lineHeight: 1.1, letterSpacing: '-0.02em', margin: '14px 0 24px',
            }}>{active.title}</h3>
            <p style={{
              fontFamily: "var(--font-display)",
              fontSize: 18, lineHeight: 1.6, color: 'rgba(42,26,8,0.78)', margin: '0 0 36px',
            }}>{active.detail}</p>
            <a
              href={`/manuscript#chapter-${active.chapter}`}
              style={{
                display: 'inline-block', padding: '12px 22px',
                background: '#A8923A', color: '#fff', textDecoration: 'none',
                fontSize: 13, letterSpacing: '0.08em', fontWeight: 500,
                borderRadius: 3,
              }}
            >Read the chapter →</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiveOrbitsDiagram;
