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

// Deterministic pseudo-random — produces the same constellation every render.
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
  pulseDelay: number;
}

function buildDots(count: number): Dot[] {
  const dots: Dot[] = [];
  for (let i = 0; i < count; i++) {
    // Place dots on a band between rings 1 and 5 so they sit inside the orbits.
    const angle = seeded(i * 3 + 1) * Math.PI * 2;
    const radius = 70 + seeded(i * 3 + 2) * 230;
    dots.push({
      x: CENTER + Math.cos(angle) * radius,
      y: CENTER + Math.sin(angle) * radius,
      r: 1.2 + seeded(i * 3 + 3) * 1.8,
      delay: (i % 13) * 0.45, // 3 staggered waves across ~6s
      breatheDelay: seeded(i * 5) * 4,
      // Match arc sweep cadence (8s) so dots flare as the radar passes.
      pulseDelay: (angle / (Math.PI * 2)) * 8,
    });
  }
  return dots;
}

export default function MagnetLoadingScene({
  firstName,
  stepIndex,
  stepVisible,
  steps,
}: Props) {
  const reduced = useReducedMotion();
  const dots = useMemo(() => buildDots(40), []);
  const stepNumeral = String(stepIndex + 1).padStart(2, "0");

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-16 relative overflow-hidden">
      <style>{`
        @keyframes magnet-dot-in {
          from { opacity: 0; transform: scale(0.4); }
          to { opacity: 0.55; transform: scale(1); }
        }
        @keyframes magnet-dot-breathe {
          0%, 100% { opacity: 0.30; }
          50% { opacity: 0.75; }
        }
        @keyframes magnet-dot-flare {
          0%, 92%, 100% { opacity: 0.55; transform: scale(1); }
          95% { opacity: 1; transform: scale(1.6); }
        }
        @keyframes magnet-ring-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes magnet-ring-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes magnet-arc-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes magnet-seal-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes magnet-bar-grow {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes magnet-numeral-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .magnet-ring {
          transform-origin: ${CENTER}px ${CENTER}px;
          transform-box: fill-box;
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
          {/* Layer 1 — constellation */}
          <g>
            {dots.map((d, i) => {
              const baseOpacity = reduced ? 0.5 : 0;
              const animation = reduced
                ? "none"
                : `magnet-dot-in 0.9s ease-out ${d.delay}s forwards,
                   magnet-dot-breathe 4s ease-in-out ${6 + d.breatheDelay}s infinite,
                   magnet-dot-flare 8s ease-in-out ${d.pulseDelay}s infinite`;
              return (
                <circle
                  key={i}
                  cx={d.x}
                  cy={d.y}
                  r={d.r}
                  fill="#B8933A"
                  opacity={baseOpacity}
                  style={{
                    animation,
                    transformOrigin: `${d.x}px ${d.y}px`,
                    transformBox: "fill-box",
                  }}
                />
              );
            })}
          </g>

          {/* Layer 2 — five orbit rings */}
          {RING_RADII.map((r, i) => {
            const circumference = 2 * Math.PI * r;
            const drawDuration = 3;
            const drawDelay = i * 1.2;
            const spinDurations = [60, 90, 120, 150, 180];
            const animation = reduced
              ? "none"
              : `magnet-ring-draw ${drawDuration}s cubic-bezier(0.4, 0, 0.2, 1) ${drawDelay}s forwards,
                 magnet-ring-spin ${spinDurations[i]}s linear ${drawDelay + drawDuration}s infinite`;
            return (
              <circle
                key={i}
                cx={CENTER}
                cy={CENTER}
                r={r}
                fill="none"
                stroke="#1C1008"
                strokeOpacity={0.10}
                strokeWidth={1}
                strokeDasharray={circumference}
                strokeDashoffset={reduced ? 0 : circumference}
                className="magnet-ring"
                style={{ animation }}
              />
            );
          })}

          {/* Layer 3 — tracing radar arc */}
          {!reduced && (
            <g
              style={{
                transformOrigin: `${CENTER}px ${CENTER}px`,
                animation: "magnet-arc-spin 8s linear infinite",
              }}
            >
              <path
                d={`M ${CENTER + 240} ${CENTER}
                    A 240 240 0 0 1 ${CENTER + 240 * Math.cos(-Math.PI / 3)} ${CENTER + 240 * Math.sin(-Math.PI / 3)}`}
                fill="none"
                stroke="#B8933A"
                strokeWidth={1.5}
                strokeOpacity={0.6}
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Layer 4 — center seal */}
          <g
            style={{
              transformOrigin: `${CENTER}px ${CENTER}px`,
              animation: reduced ? "none" : "magnet-seal-pulse 3s ease-in-out infinite",
            }}
          >
            <circle
              cx={CENTER}
              cy={CENTER}
              r={36}
              fill="#FBF8F4"
              stroke="#B8933A"
              strokeWidth={1}
              strokeOpacity={0.7}
            />
            <text
              key={stepIndex}
              x={CENTER}
              y={CENTER + 7}
              textAnchor="middle"
              fill="#B8933A"
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
        <p className="text-[#B8933A] text-[11px] uppercase tracking-[0.32em] font-semibold mb-4">
          Building Your Map
        </p>

        <h1
          className="text-[#1C1008] mb-7"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(26px, 4.5vw, 36px)",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          {firstName
            ? `Hey ${firstName} — we're mapping your revenue universe.`
            : "Mapping your revenue universe."}
        </h1>

        <div className="w-full max-w-sm" aria-live="polite">
          <p
            key={stepIndex}
            className="text-[#1C1008]/70 text-xs sm:text-sm uppercase tracking-[0.22em] min-h-[1.25rem] transition-opacity duration-500"
            style={{ opacity: stepVisible ? 1 : 0 }}
          >
            {steps[stepIndex]}
          </p>

          <div className="mt-4 w-full h-px bg-[#1C1008]/10 overflow-hidden">
            <div
              key={stepIndex}
              className="h-full bg-[#B8933A]"
              style={{
                width: reduced ? "100%" : "0%",
                animation: reduced
                  ? "none"
                  : `magnet-bar-grow ${STEP_DURATION_MS}ms linear forwards`,
                boxShadow: "0 0 12px rgba(184,147,58,0.6)",
              }}
            />
          </div>
        </div>

        <p className="mt-10 text-[10px] uppercase tracking-[0.32em] text-[#1C1008]/40">
          This usually takes 60–90 seconds
        </p>
      </div>
    </div>
  );
}
