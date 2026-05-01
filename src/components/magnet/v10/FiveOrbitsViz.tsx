// SECTION 02 — Five Orbits visualization
// Desktop (md+): concentric SVG diagram with 5 orbit rings + clickable labels.
// Mobile (<md): vertical card list with progress bars (legacy layout).

import { useState, useId } from "react";
import type { ScoreBand } from "@/lib/magnetScoring";
import { MABBLY_GOLD } from "@/lib/mabblyAnchors";

const ORBIT_NAMES = [
  "Core Proof",
  "Active",
  "Dead Zone",
  "Warm Adjacency",
  "New Gravity",
];

// Label position angles (degrees, 0 = right, going clockwise from top via -90 offset).
// Staggered so adjacent rings drop their pills on opposite hemispheres of the
// diagram, preventing the small inner rings (1, 2) from crowding each other.
// Order is [ring1, ring2, ring3, ring4, ring5].
const ORBIT_ANGLES_DEG = [270, 18, 162, 306, 90];

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
  logoUrl?: string | null;
  companyName?: string | null;
}

export default function FiveOrbitsViz({
  orbits,
  perOrbit,
  bandPerOrbit,
  primary,
  logoUrl,
  companyName,
}: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [logoBroken, setLogoBroken] = useState(false);
  const clipId = useId().replace(/:/g, "");
  const showLogo = Boolean(logoUrl) && !logoBroken;

  const fallbackObs =
    "We could not read enough on the site to map this orbit confidently. We'll dig in on the call.";

  // SVG geometry — concentric rings with labels sitting OUTSIDE each ring.
  // Center (CENTER, CENTER) is the firm. RADII are ring radii in viewBox units.
  //
  // RING SPACING RULE (no-overlap guarantee):
  //   Each pill sits radially OUTSIDE its ring at distance r + PILL_OUTSET.
  //   We pick a minimum 62-unit gap between adjacent rings (vs pill height 38)
  //   so even worst-case angles cannot cause adjacent pills to collide on the
  //   radial axis. Combined with the staggered angles below, this gives two
  //   independent layers of separation: angular + radial.
  const CENTER = 250;
  const RADII = [50, 112, 178, 244, 310];
  const PILL_W = 132;
  const PILL_H = 38;
  const PILL_OUTSET = PILL_H / 2 + 6; // half pill + 6px breathing room past the ring
  // viewBox sized so a pill at the outermost ring + outset still has padding
  // on every side. Outermost edge = CENTER + max(RADII) + PILL_OUTSET + PILL_W/2 + 12.
  const VIEW = 2 * (CENTER + RADII[RADII.length - 1] + PILL_OUTSET + PILL_W / 2 + 12);
  const VIEW_CENTER = VIEW / 2;

  return (
    <section
      id="v10-section-2"
      data-v10-section="2"
      className="py-2 md:py-2.5 border-b border-black/10"
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

        {/* Break out of the parent's narrow column and center horizontally
            in the viewport. `relative left-1/2 -translate-x-1/2 w-screen`
            spans the full window width while keeping the SVG perfectly centered. */}
        <div className="relative left-1/2 -translate-x-1/2 w-screen flex justify-center">
          <svg
            viewBox={`0 0 ${VIEW} ${VIEW}`}
            width="100%"
            style={{ maxWidth: 2460, height: "auto" }}
            role="img"
            aria-label="Five Orbits diagram"
          >
            {/* Center: client logo (if scraped) or "YOUR FIRM" text fallback */}
            {showLogo ? (
              <g>
                <title>{companyName ? `${companyName} logo` : "Client logo"}</title>
                <defs>
                  <clipPath id={`logo-clip-${clipId}`}>
                    <circle cx={VIEW_CENTER} cy={VIEW_CENTER} r={28} />
                  </clipPath>
                </defs>
                <circle
                  cx={VIEW_CENTER}
                  cy={VIEW_CENTER}
                  r={28}
                  fill="var(--brand-bg-subtle, #FBF8F4)"
                />
                <image
                  href={logoUrl as string}
                  x={VIEW_CENTER - 24}
                  y={VIEW_CENTER - 24}
                  width={48}
                  height={48}
                  preserveAspectRatio="xMidYMid meet"
                  clipPath={`url(#logo-clip-${clipId})`}
                  onError={() => setLogoBroken(true)}
                />
              </g>
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

            {/* Orbit labels — positioned OUTSIDE each ring at staggered angles */}
            {RADII.map((r, i) => {
              // Convert degrees to radians; SVG y-axis is inverted so use -sin.
              const angleRad = (ORBIT_ANGLES_DEG[i] * Math.PI) / 180;
              // Place pill center radially OUTSIDE the ring so the ring line
              // never crosses the pill body.
              const pillR = r + PILL_OUTSET;
              const lx = VIEW_CENTER + Math.cos(angleRad) * pillR;
              const ly = VIEW_CENTER + Math.sin(angleRad) * pillR;
              const id = String(i + 1).padStart(2, "0");
              const tokens = BAND_TOKENS[bandPerOrbit[i] ?? "low"];
              const score = Math.max(0, Math.min(100, perOrbit[i] ?? 0));
              const isOpen = openIdx === i;
              const isDeadZone = i === 2;

              // Pill dimensions (shared geometry constants)
              const pillW = PILL_W;
              const pillH = PILL_H;
              const pillX = lx - pillW / 2;
              const pillY = ly - pillH / 2;

              return (
                <g
                  key={`label-${i}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpenIdx(isOpen ? null : i)}
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
                    fill="var(--brand-bg-subtle, #FBF8F4)"
                    stroke={tokens.border}
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
                    style={{ fill: tokens.fg }}
                  >
                    {id} · {ORBIT_NAMES[i]}
                  </text>
                  <text
                    x={lx}
                    y={ly + 11}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    style={{ fill: tokens.fg, opacity: 0.85 }}
                  >
                    {score} · {tokens.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

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
