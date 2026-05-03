// SECTION 02 - Five Orbits visualization
// Desktop (md+): concentric SVG diagram with 5 orbit rings + clickable labels.
// Mobile (<md): vertical card list with progress bars (legacy layout).

import { useEffect, useRef, useState } from "react";
import type { ScoreBand } from "@/lib/magnetScoring";
import { MABBLY_GOLD } from "@/lib/mabblyAnchors";
import type { CalendlyContext } from "@/lib/calendly";

const ORBIT_NAMES = [
  "Core Proof",
  "Active",
  "Dead Zone",
  "Warm Adjacency",
  "New Gravity",
];

// Label position angles (degrees, 0 = right, going clockwise from top via -90 offset).
// Spec: 270° top, 342°, 54°, 126°, 198°.
const ORBIT_ANGLES_DEG = [270, 342, 54, 126, 198];

// Band-relative tokens: every color is now driven off `--brand-accent`,
// so the orbit visualization re-skins to the prospect's brand. Intensity
// (opacity / label) still signals high vs mid vs low.
const BAND_TOKENS: Record<
  ScoreBand,
  { fg: string; meter: string; bg: string; border: string; label: string }
> = {
  high: {
    fg: "var(--brand-accent, #2E7D32)",
    meter: "var(--brand-accent, #2E7D32)",
    bg: "color-mix(in srgb, var(--brand-accent, #2E7D32) 12%, transparent)",
    border: "color-mix(in srgb, var(--brand-accent, #2E7D32) 55%, transparent)",
    label: "Strong",
  },
  mid: {
    fg: "var(--brand-accent, #A8923A)",
    meter: "var(--brand-accent, #A8923A)",
    bg: "color-mix(in srgb, var(--brand-accent, #A8923A) 8%, transparent)",
    border: "color-mix(in srgb, var(--brand-accent, #A8923A) 40%, transparent)",
    label: "Mixed",
  },
  low: {
    fg: "var(--brand-accent, #B43C32)",
    meter: "var(--brand-accent, #B43C32)",
    bg: "color-mix(in srgb, var(--brand-accent, #B43C32) 5%, transparent)",
    border: "color-mix(in srgb, var(--brand-accent, #B43C32) 25%, transparent)",
    label: "Gap",
  },
};

interface Props {
  orbits: (string | null)[];
  perOrbit: number[];
  bandPerOrbit: ScoreBand[];
  primary: string;
  calendlyCtx?: CalendlyContext;
  clientLogoUrl?: string | null;
}

export default function FiveOrbitsViz({
  orbits,
  perOrbit,
  bandPerOrbit,
  primary,
  calendlyCtx,
  clientLogoUrl,
}: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [svgHover, setSvgHover] = useState(false);
  const [logoOk, setLogoOk] = useState(true);
  const hoverTimer = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const shownIdx = openIdx ?? hoverIdx;
  const shouldPause = svgHover || shownIdx !== null;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    try {
      if (shouldPause) svg.pauseAnimations();
      else svg.unpauseAnimations();
    } catch {
      /* SMIL pause unsupported; ignore */
    }
  }, [shouldPause]);

  const enterHover = (i: number) => {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setHoverIdx(i);
  };
  const leaveHover = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setHoverIdx(null), 220);
  };

  const fallbackObs =
    "We could not read enough on the site to map this orbit confidently. We'll dig in on the call.";

  // SVG geometry - 500x500 viewBox, center (250, 250).
  const CENTER = 250;
  const RADII = [50, 100, 150, 200, 250];
  // Scale ring radii down slightly so labels sit inside the viewBox bounds.
  const VIEW = 560;
  const VIEW_CENTER = VIEW / 2;

  return (
    <section
      id="v10-section-2"
      data-v10-section="2"
      className="py-10 md:py-12 border-b border-black/10"
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="h-px w-6" style={{ backgroundColor: MABBLY_GOLD }} aria-hidden />
        <p
          className="text-[11px] uppercase tracking-[0.3em] font-semibold"
          style={{ color: MABBLY_GOLD }}
        >
          02 · Your Five Orbits
        </p>
      </div>
      <h2
        className="font-bold leading-tight text-2xl md:text-3xl mb-3"
        style={{ fontFamily: "'Source Serif 4', 'IBM Plex Serif', Georgia, serif" }}
      >
        Where your next client already orbits you.
      </h2>
      <p className="text-sm md:text-base opacity-60 mb-8 max-w-lg leading-relaxed">
        Color reflects what we observed on your site. Tap any orbit to read the
        full observation.
      </p>

      {/* ─── DESKTOP: concentric SVG diagram ──────────────────────────── */}
      <div className="hidden md:block">
        <style>{`
          @keyframes orbit-pulse {
            0%, 100% { opacity: 0.85; stroke-width: 2; }
            50% { opacity: 1; stroke-width: 3.5; }
          }
          .orbit-ring-pulse { animation: orbit-pulse 2.4s ease-in-out infinite; }
        `}</style>

        <div className="flex justify-center" style={{ overflow: "visible" }}>
          <svg
            ref={svgRef}
            viewBox={`-40 -20 ${VIEW + 80} ${VIEW + 40}`}
            width="100%"
            style={{ maxWidth: 1400, height: "auto", overflow: "visible" }}
            role="img"
            aria-label="Five Orbits diagram"
            onMouseEnter={() => setSvgHover(true)}
            onMouseLeave={() => setSvgHover(false)}
          >
            {/* Center: client logo if available, otherwise "YOUR FIRM" text */}
            <defs>
              <clipPath id="orbit-center-clip">
                <circle cx={VIEW_CENTER} cy={VIEW_CENTER} r={42} />
              </clipPath>
            </defs>
            {clientLogoUrl && logoOk ? (
              <image
                href={clientLogoUrl}
                x={VIEW_CENTER - 38}
                y={VIEW_CENTER - 38}
                width={76}
                height={76}
                preserveAspectRatio="xMidYMid meet"
                clipPath="url(#orbit-center-clip)"
                onError={() => setLogoOk(false)}
              />
            ) : (
              <>
                <text
                  x={VIEW_CENTER}
                  y={VIEW_CENTER - 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="2"
                  style={{ fill: "var(--brand-accent, currentColor)", textTransform: "uppercase" }}
                >
                  YOUR
                </text>
                <text
                  x={VIEW_CENTER}
                  y={VIEW_CENTER + 11}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="2"
                  style={{ fill: "var(--brand-accent, currentColor)", textTransform: "uppercase" }}
                >
                  FIRM
                </text>
              </>
            )}

            {/* Orbit rings */}
            {RADII.map((r, i) => {
              const band = bandPerOrbit[i] ?? "low";
              const isStrong = band === "high";
              const opacity = isStrong ? 1 : 0.3;
              const isDeadZone = i === 2;
              return (
                <circle
                  key={`ring-${i}`}
                  cx={VIEW_CENTER}
                  cy={VIEW_CENTER}
                  r={r}
                  fill="none"
                  stroke="var(--brand-accent, currentColor)"
                  strokeWidth={2}
                  opacity={opacity}
                  className={isDeadZone ? "orbit-ring-pulse" : ""}
                  style={
                    isDeadZone
                      ? {
                          filter:
                            "drop-shadow(0 0 6px color-mix(in srgb, var(--brand-accent, #B43C32) 60%, transparent))",
                        }
                      : undefined
                  }
                />
              );
            })}

            {/* Orbit labels */}
            {RADII.map((r, i) => {
              // Convert degrees to radians; SVG y-axis is inverted so use -sin.
              const angleRad = (ORBIT_ANGLES_DEG[i] * Math.PI) / 180;
              const lx = VIEW_CENTER + Math.cos(angleRad) * r;
              const ly = VIEW_CENTER + Math.sin(angleRad) * r;
              const id = String(i + 1).padStart(2, "0");
              const tokens = BAND_TOKENS[bandPerOrbit[i] ?? "low"];
              const score = Math.max(0, Math.min(100, perOrbit[i] ?? 0));
              const isOpen = openIdx === i;
              const isDeadZone = i === 2;

              // Pill dimensions
              const pillW = 132;
              const pillH = 38;
              const pillX = lx - pillW / 2;
              const pillY = ly - pillH / 2;

              // Status colors for the pill cell + text only (rings unchanged).
              const band = bandPerOrbit[i] ?? "low";
              const statusFill =
                band === "high" ? "#E8F5E9" : band === "mid" ? "#FFF8E1" : "#FDECEA";
              const statusStroke =
                band === "high" ? "#2E7D32" : band === "mid" ? "#C9A227" : "#C62828";
              const statusText =
                band === "high" ? "#1B5E20" : band === "mid" ? "#8A6D1A" : "#B71C1C";

              const driftDur = `${53 + i * 13}s`;
              const outerTo = `${i % 2 ? -360 : 360} ${VIEW_CENTER} ${VIEW_CENTER}`;
              const innerTo = `${i % 2 ? 360 : -360} ${lx} ${ly}`;

              return (
                <g key={`label-${i}`}>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${VIEW_CENTER} ${VIEW_CENTER}`}
                    to={outerTo}
                    dur={driftDur}
                    repeatCount="indefinite"
                    additive="sum"
                  />
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from={`0 ${lx} ${ly}`}
                      to={innerTo}
                      dur={driftDur}
                      repeatCount="indefinite"
                      additive="sum"
                    />
                    <g
                      style={{ cursor: "pointer" }}
                      onClick={() => setOpenIdx(isOpen ? null : i)}
                      onMouseEnter={() => enterHover(i)}
                      onMouseLeave={leaveHover}
                      onFocus={() => enterHover(i)}
                      onBlur={leaveHover}
                      role="button"
                      tabIndex={0}
                      aria-label={`${ORBIT_NAMES[i]}, score ${score}, ${tokens.label}`}
                    >
                      <rect
                        x={pillX}
                        y={pillY}
                        width={pillW}
                        height={pillH}
                        rx={pillH / 2}
                        fill={statusFill}
                        stroke={statusStroke}
                        strokeWidth={isOpen || isDeadZone ? 2 : 1}
                        style={{
                          filter:
                            "drop-shadow(0 2px 6px rgba(0,0,0,0.08))",
                        }}
                      />
                      <text
                        x={lx}
                        y={ly - 3}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="700"
                        style={{ fill: statusText }}
                      >
                        {id} · {ORBIT_NAMES[i]}
                      </text>
                      <text
                        x={lx}
                        y={ly + 11}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="600"
                        style={{ fill: statusText, opacity: 0.85 }}
                      >
                        {score} · {tokens.label}
                      </text>
                    </g>
                  </g>
                </g>
              );
            })}

            {/* Callout overlay pass — paints after all pills, overlaps rings + pills + center.
                Wrapper rotation groups stay mounted for every i so SMIL animations stay
                in lock-step with the matching pill in the pass above. Only the
                foreignObject is gated on shownIdx === i. */}
            {RADII.map((r, i) => {
              const angleRad = (ORBIT_ANGLES_DEG[i] * Math.PI) / 180;
              const lx = VIEW_CENTER + Math.cos(angleRad) * r;
              const ly = VIEW_CENTER + Math.sin(angleRad) * r;
              const driftDur = `${53 + i * 13}s`;
              const outerTo = `${i % 2 ? -360 : 360} ${VIEW_CENTER} ${VIEW_CENTER}`;
              const innerTo = `${i % 2 ? 360 : -360} ${lx} ${ly}`;
              const band = bandPerOrbit[i] ?? "low";
              const statusStroke =
                band === "high" ? "#2E7D32" : band === "mid" ? "#C9A227" : "#C62828";

              return (
                <g key={`callout-rot-${i}`}>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${VIEW_CENTER} ${VIEW_CENTER}`}
                    to={outerTo}
                    dur={driftDur}
                    repeatCount="indefinite"
                    additive="sum"
                  />
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from={`0 ${lx} ${ly}`}
                      to={innerTo}
                      dur={driftDur}
                      repeatCount="indefinite"
                      additive="sum"
                    />
                    {shownIdx === i && (() => {
                      const pillW = 132;
                      const pillH = 38;
                      const calloutW = 280;
                      const calloutH = 150;
                      const gap = 16;
                      const fx = lx + pillW / 2 + gap;
                      const fy = ly - pillH / 2 - calloutH - gap;
                      return (
                        <foreignObject
                          x={fx}
                          y={fy}
                          width={calloutW}
                          height={calloutH}
                          style={{ overflow: "visible" }}
                        >
                          <div
                            style={{
                              background: "white",
                              borderLeft: `3px solid ${statusStroke}`,
                              padding: "14px 18px 14px 22px",
                              boxShadow: "0 10px 28px rgba(0,0,0,0.15)",
                              fontFamily:
                                "'Source Serif 4', 'IBM Plex Serif', Georgia, serif",
                              fontSize: "13px",
                              lineHeight: 1.55,
                              color: "#1a1a1a",
                              fontStyle: "italic",
                              position: "relative",
                            }}
                          >
                            <span
                              aria-hidden
                              style={{
                                position: "absolute",
                                top: -6,
                                left: 6,
                                fontSize: 44,
                                lineHeight: 1,
                                color: statusStroke,
                                fontFamily: "Georgia, serif",
                                fontStyle: "normal",
                                opacity: 0.85,
                              }}
                            >
                              &ldquo;
                            </span>
                            <p style={{ margin: 0, paddingLeft: 14 }}>
                              {orbits[i]?.trim() || fallbackObs}
                            </p>
                          </div>
                        </foreignObject>
                      );
                    })()}
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

      </div>

      {/* ─── MOBILE: vertical card list (unchanged layout) ───────────── */}
      <div className="grid gap-3 md:hidden">
        {orbits.map((desc, i) => {
          const id = String(i + 1).padStart(2, "0");
          const tokens = BAND_TOKENS[bandPerOrbit[i] ?? "low"];
          const isOpen = openIdx === i;
          const score = Math.max(0, Math.min(100, perOrbit[i] ?? 0));
          return (
            <button
              key={id}
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group text-left border p-4 transition-all duration-200"
              style={{
                borderColor: tokens.border,
                backgroundColor: tokens.bg,
              }}
            >
              <div className="flex items-stretch gap-3">
                <div
                  className="w-11 h-11 shrink-0 rounded-full border flex items-center justify-center font-semibold text-sm tabular-nums self-center"
                  style={{
                    color: `var(--brand-bg-fg, #EDF5EC)`,
                    borderColor: tokens.border,
                    backgroundColor: `var(--brand-bg, ${tokens.fg})`,
                  }}
                >
                  {id}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                  <p className="text-sm font-semibold leading-tight">
                    {ORBIT_NAMES[i]}
                  </p>

                  <div className="flex items-center gap-3">
                    <div
                      className="h-1.5 flex-1 rounded-full overflow-hidden"
                      style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
                      role="progressbar"
                      aria-valuenow={score}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${ORBIT_NAMES[i]} score ${score} of 100`}
                    >
                      <div
                        className="h-full rounded-full transition-[width] duration-500 ease-out"
                        style={{
                          width: `${score}%`,
                          backgroundColor: tokens.meter,
                        }}
                      />
                    </div>
                    <span
                      className="text-[11px] font-semibold tabular-nums whitespace-nowrap shrink-0"
                      style={{ color: tokens.fg }}
                    >
                      {score} · {tokens.label}
                    </span>
                  </div>
                </div>
              </div>

              {!isOpen && (
                <p
                  className="text-[11px] font-medium mt-3 pl-[3.5rem] flex items-center gap-1"
                  style={{ color: primary }}
                >
                  Read the observation <span aria-hidden>→</span>
                </p>
              )}

              {isOpen && (
                <p className="text-sm opacity-85 mt-4 leading-relaxed pl-[3.5rem]">
                  {desc?.trim() || fallbackObs}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
