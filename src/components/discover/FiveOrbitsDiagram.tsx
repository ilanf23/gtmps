import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  /** Set true once the section enters the viewport. Triggers the reveal animation. */
  triggered: boolean;
  /** Render fully assembled with no animation (reduced-motion or fallback). */
  staticMode?: boolean;
  className?: string;
}

/**
 * Horizontal pipeline: SIGNAL → CAPTURE → CADENCE → RESPONSE.
 * Editorial / geometric / light. Replaces the old five-orbit diagram.
 */

type Stage = {
  key: string;
  n: string;
  label: string;
  subtitle: string;
  output: string;
  Icon: (props: { active: boolean }) => JSX.Element;
};

const INK = "#0F1E1D";
const INK_60 = "rgba(15,30,29,0.66)";
const INK_50 = "rgba(15,30,29,0.5)";
const INK_18 = "rgba(15,30,29,0.18)";
const INK_10 = "rgba(15,30,29,0.10)";
const CREAM = "#FBF8F4";
const MINT_BORDER = "#D5DEC2";
const MINT_FILL = "#EDF5EC";
const GOLD = "#A8923A";
const GOLD_LIGHT = "#C4AC4A";
const RUST = "#BF461A";

/* ── Geometric stage icons ── */
const SignalIcon = ({ active }: { active: boolean }) => {
  const c = active ? RUST : INK;
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke={c} strokeWidth={1.4} strokeLinecap="round">
      {/* antenna mast */}
      <line x1="20" y1="14" x2="20" y2="32" />
      <circle cx="20" cy="12" r="2.2" fill={c} stroke="none" />
      {/* signal arcs */}
      <path d="M11 18 Q 20 8 29 18" />
      <path d="M14 21 Q 20 13 26 21" opacity="0.7" />
    </svg>
  );
};

const CaptureIcon = ({ active }: { active: boolean }) => {
  const c = active ? RUST : INK;
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke={c} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      {/* tray / inbox */}
      <path d="M8 22 L8 30 L32 30 L32 22" />
      <path d="M8 22 L13 12 L27 12 L32 22 Z" />
      <path d="M8 22 L15 22 L17 25 L23 25 L25 22 L32 22" />
    </svg>
  );
};

const CadenceIcon = ({ active }: { active: boolean }) => {
  const c = active ? RUST : INK;
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke={c} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      {/* metronome */}
      <path d="M14 32 L26 32 L24 12 L16 12 Z" />
      <line x1="20" y1="30" x2="13" y2="14" />
      <circle cx="13" cy="14" r="1.6" fill={c} stroke="none" />
    </svg>
  );
};

const ResponseIcon = ({ active }: { active: boolean }) => {
  const c = active ? RUST : INK;
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke={c} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      {/* paper plane */}
      <path d="M8 20 L32 10 L24 32 L20 22 Z" />
      <line x1="20" y1="22" x2="32" y2="10" />
    </svg>
  );
};

const stages: Stage[] = [
  { key: "signal",   n: "01", label: "Signal",   subtitle: "A trigger from a relationship you already own.",      output: "Trigger detected",     Icon: SignalIcon },
  { key: "capture",  n: "02", label: "Capture",  subtitle: "Logged in context, not lost in inbox.",                output: "Logged with context",  Icon: CaptureIcon },
  { key: "cadence",  n: "03", label: "Cadence",  subtitle: "A response sequence the firm runs, not the partner.",  output: "Scheduled outreach",   Icon: CadenceIcon },
  { key: "response", n: "04", label: "Response", subtitle: "A real conversation, never a pitch.",                  output: "Conversation opened",  Icon: ResponseIcon },
];

const FiveOrbitsDiagram = ({ triggered, staticMode = false, className = "" }: Props) => {
  const isMobile = useIsMobile();
  const playing = triggered || staticMode;
  const [hovered, setHovered] = useState<string | null>(null);

  const animate = playing && !staticMode;

  return (
    <div className={`relative w-full ${className}`}>
      <style>{`
        @keyframes pipeNodeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pipeConnectorIn {
          from { stroke-dashoffset: 100; opacity: 0; }
          to   { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes pipeDiamondTravel {
          0%   { offset-distance: 0%; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes pipeDotPulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50%      { transform: scale(1.25); opacity: 1; }
        }
        @keyframes pipeFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .pipe-node {
          background: ${CREAM};
          border: 1px solid ${MINT_BORDER};
          border-radius: 6px;
          padding: 22px 20px 20px;
          transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1), border-color 280ms ease, box-shadow 280ms ease;
          position: relative;
        }
        .pipe-node:hover,
        .pipe-node[data-active="true"] {
          transform: translateY(-3px);
          border-color: ${GOLD};
          box-shadow: 0 12px 32px -18px rgba(15,30,29,0.22);
        }
        .pipe-node-icon-frame {
          width: 56px; height: 56px;
          border: 1px solid ${INK_18};
          border-radius: 4px;
          display: inline-flex; align-items: center; justify-content: center;
          background: ${MINT_FILL};
          transition: border-color 280ms ease, background 280ms ease;
        }
        .pipe-node:hover .pipe-node-icon-frame,
        .pipe-node[data-active="true"] .pipe-node-icon-frame {
          border-color: ${RUST};
        }

        .pipe-card {
          background: ${CREAM};
          border: 1px solid ${MINT_BORDER};
          border-radius: 4px;
          padding: 16px 18px 18px;
          transition: border-color 280ms ease;
        }
        .pipe-card[data-active="true"] {
          border-color: ${GOLD};
        }
        .pipe-mvbar {
          width: 28px; height: 1px; background: ${INK_18};
          margin-top: 10px;
          transition: background 280ms ease;
        }
        .pipe-card[data-active="true"] .pipe-mvbar { background: ${RUST}; }
      `}</style>

      {/* Caption strip */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 32,
          opacity: animate ? 0 : 1,
          animation: animate ? "pipeFadeIn 480ms 80ms ease-out forwards" : undefined,
        }}
      >
        <span
          className="font-mono"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: GOLD,
            fontWeight: 500,
          }}
        >
          From Signal to Response
          <span style={{ color: RUST }}>.</span>
          <span style={{ marginLeft: 10, color: INK_50 }}>Not Pitch.</span>
        </span>
      </div>

      {isMobile ? (
        // Mobile: vertical stack
        <div className="flex flex-col" style={{ gap: 0 }}>
          {stages.map((s, i) => {
            const Icon = s.Icon;
            const active = hovered === s.key;
            const delay = 120 + i * 110;
            return (
              <div key={s.key}>
                <div
                  className="pipe-node"
                  data-active={active || undefined}
                  onMouseEnter={() => setHovered(s.key)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    opacity: animate ? 0 : 1,
                    animation: animate ? `pipeNodeIn 520ms ${delay}ms cubic-bezier(0.16, 1, 0.3, 1) forwards` : undefined,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div className="pipe-node-icon-frame">
                      <Icon active={active} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 10,
                          letterSpacing: "0.28em",
                          textTransform: "uppercase",
                          color: INK_50,
                          margin: 0,
                          marginBottom: 6,
                        }}
                      >
                        {s.n} · Stage
                      </p>
                      <h4
                        style={{
                          fontFamily: "'Inter Tight', sans-serif",
                          fontSize: 22,
                          fontWeight: 500,
                          letterSpacing: "-0.02em",
                          color: INK,
                          margin: 0,
                          textTransform: "uppercase",
                        }}
                      >
                        {s.label}
                        <span style={{ color: RUST }}>.</span>
                      </h4>
                    </div>
                  </div>
                  <p
                    style={{
                      marginTop: 14,
                      marginBottom: 0,
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 14,
                      lineHeight: 1.5,
                      color: INK_60,
                    }}
                  >
                    {s.subtitle}
                  </p>
                  <div
                    className="pipe-card"
                    data-active={active || undefined}
                    style={{ marginTop: 14, padding: "10px 14px" }}
                  >
                    <p
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        letterSpacing: "0.24em",
                        textTransform: "uppercase",
                        color: INK_50,
                        margin: 0,
                        marginBottom: 4,
                      }}
                    >
                      Output
                    </p>
                    <p
                      style={{
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 14,
                        color: INK,
                        margin: 0,
                        fontWeight: 500,
                      }}
                    >
                      {s.output}
                    </p>
                  </div>
                </div>
                {i < stages.length - 1 && (
                  <div
                    aria-hidden
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 32,
                    }}
                  >
                    <div style={{ width: 1, height: 28, background: INK_18 }} />
                    <span style={{ position: "absolute", marginTop: 26, color: RUST, fontSize: 14, transform: "rotate(90deg)" }}>›</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // Desktop: horizontal SVG pipeline + below cards grid
        <>
          <div style={{ position: "relative", width: "100%" }}>
            <svg
              viewBox="0 0 1100 200"
              width="100%"
              preserveAspectRatio="xMidYMid meet"
              style={{ display: "block", overflow: "visible" }}
              aria-hidden
            >
              <defs>
                <marker id="pipe-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                  <path d="M0 0 L10 5 L0 10 Z" fill={RUST} />
                </marker>
              </defs>

              {/* Three connectors between four nodes. Node centers at x = 137.5, 412.5, 687.5, 962.5 */}
              {[0, 1, 2].map((i) => {
                const x1 = 137.5 + i * 275 + 95; // node center + half node width (~95) for right edge
                const x2 = 137.5 + (i + 1) * 275 - 95;
                const y = 100;
                const delay = 320 + i * 110;
                return (
                  <g key={`connector-${i}`}>
                    <line
                      x1={x1}
                      y1={y}
                      x2={x2}
                      y2={y}
                      stroke={INK_18}
                      strokeWidth={1}
                      strokeDasharray={animate ? 100 : undefined}
                      style={{
                        animation: animate ? `pipeConnectorIn 520ms ${delay}ms ease-out forwards` : undefined,
                        opacity: animate ? 0 : 1,
                      }}
                    />
                    {/* arrowhead */}
                    <line
                      x1={x2 - 8}
                      y1={y}
                      x2={x2}
                      y2={y}
                      stroke={RUST}
                      strokeWidth={1.2}
                      markerEnd="url(#pipe-arrow)"
                      style={{
                        animation: animate ? `pipeFadeIn 320ms ${delay + 380}ms ease-out forwards` : undefined,
                        opacity: animate ? 0 : 1,
                      }}
                    />
                    {/* traveling diamond */}
                    {!staticMode && (
                      <rect
                        x={-3}
                        y={-3}
                        width={6}
                        height={6}
                        fill={RUST}
                        transform="rotate(45)"
                        style={{
                          offsetPath: `path('M ${x1} ${y} L ${x2 - 8} ${y}')`,
                          animation: `pipeDiamondTravel 2400ms ${delay + 600}ms cubic-bezier(0.45, 0, 0.55, 1) infinite`,
                          opacity: 0,
                        } as React.CSSProperties}
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Nodes overlaid with absolute positioning anchored to the same viewBox math. Use a container at 100% width and 4 equal columns. */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 0,
                pointerEvents: "none",
              }}
            >
              {stages.map((s, i) => {
                const Icon = s.Icon;
                const active = hovered === s.key;
                const delay = 200 + i * 110;
                return (
                  <div
                    key={s.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "auto",
                    }}
                  >
                    <div
                      className="pipe-node"
                      data-active={active || undefined}
                      onMouseEnter={() => setHovered(s.key)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        width: "min(190px, 86%)",
                        opacity: animate ? 0 : 1,
                        animation: animate ? `pipeNodeIn 520ms ${delay}ms cubic-bezier(0.16, 1, 0.3, 1) forwards` : undefined,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <div className="pipe-node-icon-frame" style={{ width: 44, height: 44 }}>
                          <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon active={active} />
                          </div>
                        </div>
                        <span
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 10,
                            letterSpacing: "0.28em",
                            color: INK_50,
                            textTransform: "uppercase",
                          }}
                        >
                          {s.n}
                        </span>
                      </div>
                      <h4
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 12,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          color: INK,
                          margin: 0,
                          fontWeight: 600,
                        }}
                      >
                        {s.label}
                        <span style={{ color: RUST }}>.</span>
                      </h4>
                      <p
                        style={{
                          marginTop: 8,
                          marginBottom: 0,
                          fontFamily: "'Inter Tight', sans-serif",
                          fontSize: 13,
                          lineHeight: 1.45,
                          color: INK_60,
                        }}
                      >
                        {s.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Output cards */}
          <div
            style={{
              marginTop: 36,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 14,
            }}
          >
            {stages.map((s, i) => {
              const active = hovered === s.key;
              const delay = 520 + i * 80;
              return (
                <div
                  key={`out-${s.key}`}
                  className="pipe-card"
                  data-active={active || undefined}
                  onMouseEnter={() => setHovered(s.key)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    opacity: animate ? 0 : 1,
                    animation: animate ? `pipeFadeIn 460ms ${delay}ms ease-out forwards` : undefined,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: INK_50,
                      margin: 0,
                      marginBottom: 6,
                    }}
                  >
                    {s.label} produces
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 15,
                      color: INK,
                      margin: 0,
                      fontWeight: 500,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {s.output}
                    <span style={{ color: RUST }}>.</span>
                  </p>
                  <div className="pipe-mvbar" />
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Footer thesis line */}
      <div
        style={{
          marginTop: 40,
          textAlign: "center",
          opacity: animate ? 0 : 1,
          animation: animate ? "pipeFadeIn 520ms 1100ms ease-out forwards" : undefined,
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(18px, 2vw, 22px)",
            color: INK_60,
            margin: 0,
            letterSpacing: "-0.005em",
          }}
        >
          Every relationship is a signal you can act on
          <span style={{ color: RUST, fontStyle: "normal" }}>.</span>
        </p>
        <div
          aria-hidden
          style={{
            width: 36,
            height: 1,
            background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
            margin: "14px auto 0",
          }}
        />
      </div>
    </div>
  );
};

export default FiveOrbitsDiagram;
