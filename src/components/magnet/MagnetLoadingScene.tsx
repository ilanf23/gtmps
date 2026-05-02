import { useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Props {
  firstName?: string | null;
  stepIndex: number;
  stepVisible: boolean;
  steps: readonly string[];
}

const STAGE = 640;
const CENTER = STAGE / 2;
const RING_RADII = [80, 130, 185, 240, 295];
const STEP_DURATION_MS = 14_000;

// Hand-placed nodes on the orbit rings — labels chosen to read as the
// "five orbits" of relationship revenue.
const ORBIT_NODES = [
  { ring: 0, angleDeg: -55, label: "Clients" },
  { ring: 1, angleDeg: 35, label: "Partners" },
  { ring: 2, angleDeg: 145, label: "Press" },
  { ring: 3, angleDeg: -115, label: "Talent" },
  { ring: 4, angleDeg: 80, label: "Capital" },
];

// Five calibration bars on the right edge — different fill widths so they
// read as a real calibration panel, not a progress bar.
const CALIBRATION_BARS = [0.62, 0.84, 0.46, 0.71, 0.55];

// Deterministic pseudo-random — same paper texture every render.
function seeded(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

interface Dot {
  x: number;
  y: number;
  r: number;
  delay: number;
  breatheDelay: number;
}

function buildDots(count: number): Dot[] {
  const dots: Dot[] = [];
  for (let i = 0; i < count; i++) {
    const angle = seeded(i * 3 + 1) * Math.PI * 2;
    const radius = 70 + seeded(i * 3 + 2) * 230;
    dots.push({
      x: CENTER + Math.cos(angle) * radius,
      y: CENTER + Math.sin(angle) * radius,
      r: 0.8 + seeded(i * 3 + 3) * 1.2,
      delay: (i % 9) * 0.4,
      breatheDelay: seeded(i * 5) * 4,
    });
  }
  return dots;
}

function polar(ring: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  const r = RING_RADII[ring];
  return { x: CENTER + Math.cos(a) * r, y: CENTER + Math.sin(a) * r };
}

export default function MagnetLoadingScene({
  firstName,
  stepIndex,
  stepVisible,
  steps,
}: Props) {
  const reduced = useReducedMotion();
  const dots = useMemo(() => buildDots(25), []);
  const stepNumeral = String(stepIndex + 1).padStart(2, "0");

  // Each layer mounts when its step starts and stays mounted afterwards —
  // the map "builds up" rather than flickering between scenes.
  const showDocScan = stepIndex >= 0;
  const showOrbits = stepIndex >= 1;
  const showDeadZone = stepIndex >= 2;
  const showCalibration = stepIndex >= 3;
  const showManuscript = stepIndex >= 4;

  // Document outline geometry — a tall, narrow rectangle that suggests a
  // webpage being scanned.
  const DOC = { x: CENTER - 110, y: CENTER - 165, w: 220, h: 330 };

  // Dead-zone wedge between rings 2 and 3, centered roughly NE.
  const wedgePath = (() => {
    const inner = RING_RADII[2];
    const outer = RING_RADII[3];
    const a1 = (-25 * Math.PI) / 180;
    const a2 = (15 * Math.PI) / 180;
    const p1 = { x: CENTER + Math.cos(a1) * inner, y: CENTER + Math.sin(a1) * inner };
    const p2 = { x: CENTER + Math.cos(a2) * inner, y: CENTER + Math.sin(a2) * inner };
    const p3 = { x: CENTER + Math.cos(a2) * outer, y: CENTER + Math.sin(a2) * outer };
    const p4 = { x: CENTER + Math.cos(a1) * outer, y: CENTER + Math.sin(a1) * outer };
    return `M ${p1.x} ${p1.y}
            A ${inner} ${inner} 0 0 1 ${p2.x} ${p2.y}
            L ${p3.x} ${p3.y}
            A ${outer} ${outer} 0 0 0 ${p4.x} ${p4.y}
            Z`;
  })();

  // Manuscript line geometry (Step 5).
  const MANU = { x: CENTER - 130, y: CENTER + 250, w: 260 };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-16 relative overflow-hidden">
      <style>{`
        @keyframes magnet-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes magnet-fade-up {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes magnet-dot-in {
          from { opacity: 0; }
          to { opacity: 0.45; }
        }
        @keyframes magnet-dot-breathe {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.55; }
        }
        @keyframes magnet-doc-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes magnet-scan-sweep {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(330px); opacity: 0; }
        }
        @keyframes magnet-doc-fade {
          0%, 70% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes magnet-ring-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes magnet-node-in {
          from { opacity: 0; transform: scale(0.3); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes magnet-wedge-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes magnet-bar-fill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes magnet-compass-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes magnet-numeral-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes magnet-type {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes magnet-caret {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes magnet-bar-grow {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

      {/* Stage */}
      <div
        aria-hidden
        className="relative"
        style={{
          width: "min(92vw, 640px)",
          height: "min(92vw, 640px)",
          maxHeight: "60vh",
        }}
      >
        <svg
          viewBox={`0 0 ${STAGE} ${STAGE}`}
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <clipPath id="doc-clip">
              <rect x={DOC.x} y={DOC.y} width={DOC.w} height={DOC.h} rx={4} />
            </clipPath>
          </defs>

          {/* Layer 0 — quiet paper texture */}
          <g>
            {dots.map((d, i) => {
              const animation = reduced
                ? "none"
                : `magnet-dot-in 1.2s ease-out ${d.delay}s forwards,
                   magnet-dot-breathe 6s ease-in-out ${4 + d.breatheDelay}s infinite`;
              return (
                <circle
                  key={i}
                  cx={d.x}
                  cy={d.y}
                  r={d.r}
                  fill="var(--ms-accent, #A8923A)"
                  opacity={reduced ? 0.4 : 0}
                  style={{ animation }}
                />
              );
            })}
          </g>

          {/* === STEP 01 — Document scan ============================ */}
          {showDocScan && (
            <g
              style={{
                animation: reduced
                  ? "none"
                  : stepIndex >= 1
                    ? "magnet-doc-fade 2s ease-out forwards"
                    : "magnet-fade-in 0.6s ease-out forwards",
              }}
            >
              {/* Document outline */}
              <rect
                x={DOC.x}
                y={DOC.y}
                width={DOC.w}
                height={DOC.h}
                rx={4}
                fill="none"
                stroke="var(--ms-text, #0F1E1D)"
                strokeOpacity={0.18}
                strokeWidth={1}
                strokeDasharray={2 * (DOC.w + DOC.h)}
                strokeDashoffset={reduced ? 0 : 2 * (DOC.w + DOC.h)}
                style={{
                  animation: reduced
                    ? "none"
                    : "magnet-doc-draw 1.6s ease-out 0.2s forwards",
                }}
              />
              {/* Faux text lines inside the document */}
              {Array.from({ length: 11 }).map((_, i) => {
                const isShort = i % 3 === 2;
                const w = isShort ? DOC.w * 0.55 : DOC.w * 0.82;
                return (
                  <rect
                    key={i}
                    x={DOC.x + 16}
                    y={DOC.y + 28 + i * 26}
                    width={w}
                    height={3}
                    rx={1}
                    fill="var(--ms-text, #0F1E1D)"
                    opacity={0}
                    style={{
                      animation: reduced
                        ? "none"
                        : `magnet-fade-in 0.5s ease-out ${1.2 + i * 0.08}s forwards`,
                      opacity: reduced ? 0.12 : undefined,
                      fillOpacity: 0.12,
                    }}
                  />
                );
              })}
              {/* Scanning rule sweeping top to bottom */}
              {!reduced && (
                <g clipPath="url(#doc-clip)">
                  <g
                    style={{
                      animation: "magnet-scan-sweep 3.5s ease-in-out 1s infinite",
                    }}
                  >
                    <line
                      x1={DOC.x}
                      x2={DOC.x + DOC.w}
                      y1={DOC.y}
                      y2={DOC.y}
                      stroke="var(--ms-accent, #A8923A)"
                      strokeWidth={1}
                      strokeOpacity={0.9}
                    />
                    <rect
                      x={DOC.x}
                      y={DOC.y - 24}
                      width={DOC.w}
                      height={24}
                      fill="url(#scanFade)"
                      opacity={0.4}
                    />
                  </g>
                </g>
              )}
              <defs>
                <linearGradient id="scanFade" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="var(--ms-accent, #A8923A)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--ms-accent, #A8923A)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </g>
          )}

          {/* === STEP 02 — Orbit rings + nodes ====================== */}
          {showOrbits && (
            <g>
              {RING_RADII.map((r, i) => {
                const circumference = 2 * Math.PI * r;
                const drawDuration = 1.1;
                const drawDelay = i * 0.6;
                return (
                  <circle
                    key={i}
                    cx={CENTER}
                    cy={CENTER}
                    r={r}
                    fill="none"
                    stroke="var(--ms-text, #0F1E1D)"
                    strokeOpacity={0.12}
                    strokeWidth={1}
                    strokeDasharray={circumference}
                    strokeDashoffset={reduced ? 0 : circumference}
                    style={{
                      animation: reduced
                        ? "none"
                        : `magnet-ring-draw ${drawDuration}s cubic-bezier(0.4, 0, 0.2, 1) ${drawDelay}s forwards`,
                    }}
                  />
                );
              })}
              {ORBIT_NODES.map((n, i) => {
                const p = polar(n.ring, n.angleDeg);
                const delay = n.ring * 0.6 + 0.6;
                // Place label outside the node, away from center.
                const a = (n.angleDeg * Math.PI) / 180;
                const lx = p.x + Math.cos(a) * 14;
                const ly = p.y + Math.sin(a) * 14;
                const anchor =
                  Math.cos(a) > 0.3 ? "start" : Math.cos(a) < -0.3 ? "end" : "middle";
                return (
                  <g
                    key={i}
                    style={{
                      opacity: reduced ? 1 : 0,
                      animation: reduced
                        ? "none"
                        : `magnet-node-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s forwards`,
                      transformOrigin: `${p.x}px ${p.y}px`,
                      transformBox: "fill-box",
                    }}
                  >
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={3}
                      fill="var(--ms-accent, #A8923A)"
                    />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={6}
                      fill="none"
                      stroke="var(--ms-accent, #A8923A)"
                      strokeOpacity={0.4}
                      strokeWidth={1}
                    />
                    <text
                      x={lx}
                      y={ly + 3}
                      textAnchor={anchor}
                      fontFamily="var(--font-sans)"
                      fontSize={9}
                      fontWeight={500}
                      letterSpacing={1.2}
                      fill="var(--ms-text, #0F1E1D)"
                      fillOpacity={0.55}
                      style={{ textTransform: "uppercase" }}
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* === STEP 03 — Dead Zone wedge ========================== */}
          {showDeadZone && (
            <g
              style={{
                opacity: reduced ? 1 : 0,
                animation: reduced
                  ? "none"
                  : "magnet-wedge-in 1.2s ease-out forwards",
              }}
            >
              <path
                d={wedgePath}
                fill="var(--ms-accent, #A8923A)"
                fillOpacity={0.12}
                stroke="var(--ms-accent, #A8923A)"
                strokeOpacity={0.5}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <text
                x={CENTER + RING_RADII[2] + 28}
                y={CENTER - 8}
                fontFamily="'Cormorant Garamond', serif"
                fontStyle="italic"
                fontSize={13}
                fill="var(--ms-accent, #A8923A)"
                fillOpacity={0.85}
              >
                Dead Zone
              </text>
            </g>
          )}

          {/* === STEP 04 — Calibration bars (right edge) ============ */}
          {showCalibration && (
            <g>
              {CALIBRATION_BARS.map((fill, i) => {
                const y = CENTER - 60 + i * 28;
                const x = STAGE - 90;
                const trackW = 70;
                const fillW = trackW * fill;
                return (
                  <g
                    key={i}
                    style={{
                      opacity: reduced ? 1 : 0,
                      animation: reduced
                        ? "none"
                        : `magnet-fade-up 0.5s ease-out ${i * 0.12}s forwards`,
                    }}
                  >
                    <text
                      x={x - 6}
                      y={y + 4}
                      textAnchor="end"
                      fontFamily="'Cormorant Garamond', serif"
                      fontStyle="italic"
                      fontSize={10}
                      fill="var(--ms-text, #0F1E1D)"
                      fillOpacity={0.5}
                    >
                      L{i + 1}
                    </text>
                    <rect
                      x={x}
                      y={y}
                      width={trackW}
                      height={2}
                      rx={1}
                      fill="var(--ms-text, #0F1E1D)"
                      fillOpacity={0.1}
                    />
                    <rect
                      x={x}
                      y={y}
                      width={fillW}
                      height={2}
                      rx={1}
                      fill="var(--ms-accent, #A8923A)"
                      style={{
                        transformOrigin: `${x}px ${y}px`,
                        animation: reduced
                          ? "none"
                          : `magnet-bar-fill 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${0.3 + i * 0.12}s both`,
                      }}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* === STEP 05 — Manuscript line typing =================== */}
          {showManuscript && !reduced && (
            <foreignObject x={MANU.x} y={MANU.y - 14} width={MANU.w} height={28}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: 16,
                  color: "var(--ms-text, #0F1E1D)",
                  opacity: 0.75,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    animation: "magnet-type 2.4s steps(28, end) forwards",
                  }}
                >
                  Drafting your map…
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: 1,
                    height: 14,
                    background: "var(--ms-accent, #A8923A)",
                    animation: "magnet-caret 0.9s steps(1) infinite",
                  }}
                />
              </div>
            </foreignObject>
          )}

          {/* Layer top — compass rose at center (always visible) */}
          <g>
            <circle
              cx={CENTER}
              cy={CENTER}
              r={36}
              fill="var(--ms-bg, #EDF5EC)"
              stroke="var(--ms-accent, #A8923A)"
              strokeOpacity={0.7}
              strokeWidth={1}
            />
            {/* N/E/S/W ticks */}
            {[0, 90, 180, 270].map((deg) => {
              const a = (deg * Math.PI) / 180;
              const x1 = CENTER + Math.cos(a) * 36;
              const y1 = CENTER + Math.sin(a) * 36;
              const x2 = CENTER + Math.cos(a) * 42;
              const y2 = CENTER + Math.sin(a) * 42;
              return (
                <line
                  key={deg}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="var(--ms-accent, #A8923A)"
                  strokeOpacity={0.6}
                  strokeWidth={1}
                />
              );
            })}
            {/* Slow-rotating 4-point compass star */}
            <g
              style={{
                transformOrigin: `${CENTER}px ${CENTER}px`,
                animation: reduced
                  ? "none"
                  : "magnet-compass-rotate 60s linear infinite",
              }}
            >
              <path
                d={`M ${CENTER} ${CENTER - 28}
                    L ${CENTER + 5} ${CENTER}
                    L ${CENTER} ${CENTER + 28}
                    L ${CENTER - 5} ${CENTER}
                    Z`}
                fill="none"
                stroke="var(--ms-accent, #A8923A)"
                strokeOpacity={0.35}
                strokeWidth={0.75}
              />
              <path
                d={`M ${CENTER - 28} ${CENTER}
                    L ${CENTER} ${CENTER + 5}
                    L ${CENTER + 28} ${CENTER}
                    L ${CENTER} ${CENTER - 5}
                    Z`}
                fill="none"
                stroke="var(--ms-accent, #A8923A)"
                strokeOpacity={0.35}
                strokeWidth={0.75}
              />
            </g>
            <text
              key={stepIndex}
              x={CENTER}
              y={CENTER + 7}
              textAnchor="middle"
              fill="var(--ms-accent, #A8923A)"
              fontFamily="'Cormorant Garamond', serif"
              fontStyle="italic"
              fontSize={22}
              style={{
                animation: reduced ? "none" : "magnet-numeral-in 0.6s ease-out forwards",
              }}
            >
              {stepNumeral}
            </text>
          </g>
        </svg>
      </div>

      {/* Layer 5 — editorial text block */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center -mt-4 sm:-mt-8">
        <p className="text-[#A8923A] text-[11px] uppercase tracking-[0.32em] font-semibold mb-4">
          Building Your Map
        </p>

        <h1
          className="text-[#0F1E1D] mb-7"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(26px, 4.5vw, 36px)",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          {firstName
            ? `Hey ${firstName}. We're mapping your revenue universe.`
            : "Mapping your revenue universe."}
        </h1>

        <div className="w-full max-w-sm" aria-live="polite">
          <p
            key={stepIndex}
            className="text-[#0F1E1D]/70 text-xs sm:text-sm uppercase tracking-[0.22em] min-h-[1.25rem] transition-opacity duration-500"
            style={{ opacity: stepVisible ? 1 : 0 }}
          >
            {steps[stepIndex]}
          </p>

          <div className="mt-4 w-full h-px bg-[#0F1E1D]/10 overflow-hidden">
            <div
              key={stepIndex}
              className="h-full bg-[#A8923A]"
              style={{
                width: reduced ? "100%" : "0%",
                animation: reduced
                  ? "none"
                  : `magnet-bar-grow ${STEP_DURATION_MS}ms linear forwards`,
                boxShadow: "0 0 12px rgba(168, 146, 58,0.6)",
              }}
            />
          </div>
        </div>

        <p className="mt-10 text-[10px] uppercase tracking-[0.32em] text-[#0F1E1D]/40">
          This usually takes 60 to 90 seconds
        </p>
      </div>
    </div>
  );
}
