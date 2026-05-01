// SECTION 02 — Five Orbits visualization
// Desktop (md+): concentric SVG diagram with 5 orbit rings + clickable labels.
// Mobile (<md): vertical card list with progress bars (legacy layout).

import { useRef, useState } from "react";
import type { ScoreBand } from "@/lib/magnetScoring";
import { MABBLY_GOLD } from "@/lib/mabblyAnchors";
import { openCalendlyPopup, type CalendlyContext } from "@/lib/calendly";

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
    fg: "var(--brand-accent, #B8933A)",
    meter: "var(--brand-accent, #B8933A)",
    bg: "color-mix(in srgb, var(--brand-accent, #B8933A) 8%, transparent)",
    border: "color-mix(in srgb, var(--brand-accent, #B8933A) 40%, transparent)",
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
  const [logoOk, setLogoOk] = useState(true);
  const hoverTimer = useRef<number | null>(null);

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

  // SVG geometry — 500x500 viewBox, center (250, 250).
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
            viewBox={`-40 -20 ${VIEW + 80} ${VIEW + 40}`}
            width="100%"
            style={{ maxWidth: 640, height: "auto", overflow: "visible" }}
            role="img"
            aria-label="Five Orbits diagram"
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
          </svg>
        </div>

        {/* Hover preview card (desktop) — only when nothing is click-expanded */}
        {hoverIdx !== null && openIdx === null && (() => {
          const i = hoverIdx;
          const tokens = BAND_TOKENS[bandPerOrbit[i] ?? "low"];
          const band = bandPerOrbit[i] ?? "low";
          const accentBorder =
            band === "high" ? "#2E7D32" : band === "mid" ? "#C9A227" : "#C62828";
          const accentText =
            band === "high" ? "#1B5E20" : band === "mid" ? "#8A6D1A" : "#B71C1C";
          const accentBg =
            band === "high" ? "#F4FBF4" : band === "mid" ? "#FFFBEC" : "#FFF5F4";
          return (
            <div
              className="mt-6 mx-auto max-w-2xl border p-5 animate-fade-in"
              style={{ borderColor: accentBorder, backgroundColor: accentBg }}
              onMouseEnter={() => enterHover(i)}
              onMouseLeave={leaveHover}
            >
              <div className="flex items-center justify-between gap-4 mb-2">
                <p
                  className="text-[11px] uppercase tracking-[0.25em] font-semibold"
                  style={{ color: accentText }}
                >
                  {String(i + 1).padStart(2, "0")} · {ORBIT_NAMES[i]}
                </p>
                <span
                  className="text-[11px] uppercase tracking-[0.18em] font-bold"
                  style={{ color: accentText }}
                >
                  {tokens.label}
                </span>
              </div>
              <p className="text-sm leading-relaxed opacity-90 mb-4">
                {orbits[i]?.trim() || fallbackObs}
              </p>
              {calendlyCtx && (
                <button
                  type="button"
                  onClick={() => openCalendlyPopup(calendlyCtx)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-[12px] uppercase tracking-[0.14em] font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: accentBorder, color: "#fff" }}
                >
                  Learn more <span aria-hidden>→</span>
                </button>
              )}
            </div>
          );
        })()}

        {/* Expanded observation panel (desktop) */}
        {openIdx !== null && (
          <div
            className="mt-6 mx-auto max-w-2xl border p-5 animate-fade-in"
            style={{
              borderColor: BAND_TOKENS[bandPerOrbit[openIdx] ?? "low"].border,
              backgroundColor: BAND_TOKENS[bandPerOrbit[openIdx] ?? "low"].bg,
            }}
          >
            <div className="flex items-center justify-between gap-4 mb-2">
              <p
                className="text-[11px] uppercase tracking-[0.25em] font-semibold"
                style={{ color: BAND_TOKENS[bandPerOrbit[openIdx] ?? "low"].fg }}
              >
                {String(openIdx + 1).padStart(2, "0")} · {ORBIT_NAMES[openIdx]}
              </p>
              <button
                type="button"
                onClick={() => setOpenIdx(null)}
                className="text-xs opacity-60 hover:opacity-100"
                aria-label="Close observation"
              >
                ✕
              </button>
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              {orbits[openIdx]?.trim() || fallbackObs}
            </p>
          </div>
        )}
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
                    color: `var(--brand-bg-fg, #fff)`,
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
