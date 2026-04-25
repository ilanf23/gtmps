interface Props {
  /** Set true once the section enters the viewport. Triggers the reveal animation. */
  triggered: boolean;
  /** Render fully assembled with no animation (reduced-motion or fallback). */
  staticMode?: boolean;
  className?: string;
}

/**
 * Five concentric gold rings + labeled callouts at distinct clock positions.
 * Single-fire reveal: rings cascade in (~900ms), Dead Zone glow fades up,
 * leader lines draw, labels rise, layer chips fill, formula reveals.
 */

const orbits = [
  { n: "01", title: "Core Proof",      desc: "Best stories",        r: 60,  angle: -90 },
  { n: "02", title: "Active",          desc: "Current pipeline",    r: 120, angle: -18 },
  { n: "03", title: "The Dead Zone",   desc: "Highest-ROI layer",   r: 188, angle:  54, emphasis: true },
  { n: "04", title: "Warm Adjacency",  desc: "Referral network",    r: 252, angle: 126 },
  { n: "05", title: "New Gravity",     desc: "ICP-matched market",  r: 312, angle: 198 },
];

const layers = ["DISCOVER", "PROVE", "DESIGN", "ACTIVATE", "COMPOUND"];
const formulaTokens = ["Signal", "+", "Proof", "+", "Context", "="];

const toRad = (deg: number) => (deg * Math.PI) / 180;

const FiveOrbitsDiagram = ({ triggered, staticMode = false, className = "" }: Props) => {
  // Animation runs once when triggered or when staticMode forces final state.
  const playing = triggered || staticMode;

  // Time map — needs to match the keyframes in index.css
  const ringDur = 900;
  const ringStaggerStep = 80;       // 0, 80, 160, 240, 320 ms
  const glowStart = ringStaggerStep * 4 + ringDur - 200; // ~1020ms
  const leadersStart = ringStaggerStep * 4 + ringDur + 80; // ~1300ms
  const leaderStep = 80;
  const labelDelayAfterLeader = 200;
  const layersStart = leadersStart + leaderStep * 5 + labelDelayAfterLeader + 240; // ~2020ms
  const layerStep = 70;
  const formulaStart = layersStart + layerStep * layers.length + 200; // ~2520ms
  const formulaTokenStep = 80;

  return (
    <div className={`relative w-full ${playing ? "orbits-triggered" : ""} ${className}`}>
      <svg
        viewBox="-380 -380 760 760"
        className="block w-full max-w-[720px] mx-auto"
        style={{ aspectRatio: "1 / 1" }}
        aria-label="The Relationship Revenue OS — Five Orbits diagram"
      >
        <defs>
          <radialGradient id="orbit-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(212,174,72,0.55)" />
            <stop offset="55%"  stopColor="rgba(184,147,58,0.10)" />
            <stop offset="100%" stopColor="rgba(184,147,58,0)" />
          </radialGradient>
          <filter id="dz-outer-glow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="4.5" />
          </filter>
        </defs>

        {/* Center glow disc */}
        <circle r="44" fill="url(#orbit-center-glow)" />

        {/* Center marker — represents the firm */}
        <circle
          className="orbit-center"
          r="4"
          fill="#D4AE48"
          style={{
            transformOrigin: "center",
            transformBox: "fill-box",
            opacity: playing ? 1 : 0,
            animation: playing && !staticMode ? `centerPulseOnce 700ms ${glowStart}ms ease-out 1` : undefined,
          }}
        />

        {/* Rings */}
        {orbits.map((o, i) => {
          const circ = 2 * Math.PI * o.r;
          const isDZ = !!o.emphasis;
          const stroke = isDZ ? "#D4AE48" : "rgba(184,147,58,0.55)";
          const strokeWidth = isDZ ? 2.5 : 1;
          const ringOpacity = staticMode
            ? (isDZ ? 1 : (i === 0 ? 0.55 : i === 1 ? 0.5 : i === 3 ? 0.4 : 0.3))
            : undefined;

          return (
            <g key={o.n}>
              {/* Dead Zone glow halo, only behind ring 03 */}
              {isDZ && (
                <circle
                  className="orbit-glow"
                  r={o.r}
                  fill="none"
                  stroke="rgba(212,174,72,0.45)"
                  strokeWidth={6}
                  filter="url(#dz-outer-glow)"
                  style={{
                    opacity: 0,
                    animation:
                      playing && !staticMode
                        ? `orbitGlow 600ms ${glowStart}ms ease-out forwards`
                        : staticMode
                        ? undefined
                        : undefined,
                    ...(staticMode ? { opacity: 1 } : {}),
                  }}
                />
              )}

              {/* The ring itself */}
              <circle
                className="orbit-ring"
                r={o.r}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                style={
                  staticMode
                    ? { opacity: ringOpacity }
                    : {
                        ["--circ" as never]: circ,
                        strokeDasharray: circ,
                        strokeDashoffset: playing ? undefined : circ,
                        opacity: isDZ ? 1 : (i === 0 ? 0.55 : i === 1 ? 0.5 : i === 3 ? 0.4 : 0.3),
                        transformOrigin: "center",
                        transform: "rotate(-90deg)",
                        transformBox: "fill-box",
                        animation: playing
                          ? `orbitDraw ${ringDur}ms ${i * ringStaggerStep}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`
                          : undefined,
                      }
                }
              />
            </g>
          );
        })}

        {/* Leader lines + labels */}
        {orbits.map((o, i) => {
          const rad = toRad(o.angle);
          const onRingX = Math.cos(rad) * o.r;
          const onRingY = Math.sin(rad) * o.r;
          const labelOffset = 36;
          const labelX = Math.cos(rad) * (o.r + labelOffset);
          const labelY = Math.sin(rad) * (o.r + labelOffset);

          // Leader length for stroke-dash
          const leaderLen = labelOffset;

          // Anchor flips by horizontal position so labels sit outboard
          const anchor: "start" | "middle" | "end" =
            Math.abs(Math.cos(rad)) < 0.2
              ? "middle"
              : Math.cos(rad) > 0
              ? "start"
              : "end";

          const isDZ = !!o.emphasis;
          const startDelay = leadersStart + i * leaderStep;
          const labelStartDelay = startDelay + labelDelayAfterLeader;

          return (
            <g key={`label-${o.n}`}>
              {/* Leader line from ring perimeter outward */}
              <line
                className="orbit-leader"
                x1={onRingX}
                y1={onRingY}
                x2={labelX - Math.cos(rad) * 6}
                y2={labelY - Math.sin(rad) * 6}
                stroke="rgba(184,147,58,0.55)"
                strokeWidth={1}
                style={
                  staticMode
                    ? undefined
                    : {
                        ["--leader-len" as never]: leaderLen,
                        strokeDasharray: leaderLen,
                        strokeDashoffset: playing ? undefined : leaderLen,
                        animation: playing
                          ? `leaderDraw 380ms ${startDelay}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`
                          : undefined,
                      }
                }
              />

              {/* Label group */}
              <g
                className="orbit-label"
                transform={`translate(${labelX}, ${labelY})`}
                style={
                  staticMode
                    ? undefined
                    : {
                        opacity: playing ? undefined : 0,
                        animation: playing
                          ? `labelRise 480ms ${labelStartDelay}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`
                          : undefined,
                      }
                }
              >
                <text
                  textAnchor={anchor}
                  fontFamily="'DM Mono', monospace"
                  fontSize={11}
                  letterSpacing={1.5}
                  fill="#D4AE48"
                  y={-14}
                >
                  {o.n}
                </text>
                <text
                  textAnchor={anchor}
                  fontFamily="'Inter Tight', sans-serif"
                  fontSize={isDZ ? 17 : 14}
                  fontWeight={isDZ ? 600 : 500}
                  fill="#F5F1E8"
                  letterSpacing={-0.2}
                  y={4}
                >
                  {o.title}
                </text>
                <text
                  textAnchor={anchor}
                  fontFamily="'Inter Tight', sans-serif"
                  fontSize={11}
                  fill="rgba(245,241,232,0.55)"
                  fontWeight={300}
                  y={20}
                >
                  {o.desc}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Layer flow */}
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 mt-16">
        {layers.map((l, i) => (
          <div key={l} className="flex items-center gap-2">
            <span
              className="orbit-chip font-display uppercase rounded-full"
              style={{
                fontSize: 11,
                letterSpacing: "0.22em",
                color: "#F5F1E8",
                padding: "8px 16px",
                border: "1px solid rgba(184,147,58,0.45)",
                background: "rgba(255,253,248,0.02)",
                fontWeight: 500,
                opacity: playing ? undefined : 0,
                animation:
                  playing && !staticMode
                    ? `chipFade 360ms ${layersStart + i * layerStep}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`
                    : undefined,
                ...(staticMode ? { opacity: 1 } : {}),
              }}
            >
              {l}
            </span>
            {i < layers.length - 1 && (
              <span
                className="orbit-chip"
                style={{
                  color: "rgba(212,174,72,0.7)",
                  fontSize: 14,
                  opacity: playing ? undefined : 0,
                  animation:
                    playing && !staticMode
                      ? `chipFade 360ms ${layersStart + i * layerStep + 35}ms ease-out forwards`
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
      <div className="orbit-formula text-center mx-auto mt-14 px-4" style={{ maxWidth: 800 }}>
        <p
          className="font-mono uppercase mb-3"
          style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(212,174,72,0.7)" }}
        >
          The Formula
        </p>
        <p
          className="font-display"
          style={{
            color: "#F5F1E8",
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
                    ? `chipFade 320ms ${formulaStart + i * formulaTokenStep}ms ease-out forwards`
                    : undefined,
                ...(staticMode ? { opacity: 1 } : {}),
              }}
            >
              {t}
            </span>
          ))}
          <span
            style={{
              color: "#D4AE48",
              fontStyle: "italic",
              opacity: playing ? undefined : 0,
              animation:
                playing && !staticMode
                  ? `chipFade 360ms ${formulaStart + formulaTokens.length * formulaTokenStep + 80}ms ease-out forwards`
                  : undefined,
              ...(staticMode ? { opacity: 1 } : {}),
            }}
          >
            Response, Not Pitch.
          </span>
        </p>
      </div>
    </div>
  );
};

export default FiveOrbitsDiagram;
