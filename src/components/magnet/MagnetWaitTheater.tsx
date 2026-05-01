import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useVerticalFlow } from '@/hooks/useVerticalFlow';

// ─────────────────────────────────────────────────────────────────────────────
// Four-stage cinematic wait theater.
//
// Stage cadence (from spec):
//   1 — 0–22s   Reading your homepage
//   2 — 22–45s  Mapping your services
//   3 — 45–70s  Mapping your dormant relationships
//   4 — 70–90s  Building your RROS map
//
// Status tickers within each stage rotate every ~6s so the user always sees
// fresh language. The top progress bar tracks elapsed time but caps at 88%
// until the parent reports `enrichmentReady`, then fills to 100%.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  firstName?: string | null;
  websiteUrl?: string | null;
  companyName?: string | null;
  /** Becomes true the moment the breakdown row is ready in the DB. */
  enrichmentReady?: boolean;
  /** Optional vertical override; otherwise read from ?vertical=<slug>. */
  vertical?: string | null;
}

type Stage = {
  index: 0 | 1 | 2 | 3;
  startSec: number;
  endSec: number;
  title: string;
  ticks: string[];
};

const STAGES: Stage[] = [
  {
    index: 0,
    startSec: 0,
    endSec: 22,
    title: 'Reading your homepage',
    ticks: [
      'Reading your homepage…',
      'Reading your value prop…',
      'Reading your services…',
      'Reading your proof…',
    ],
  },
  {
    index: 1,
    startSec: 22,
    endSec: 45,
    title: 'Mapping your services',
    ticks: [
      'Identifying your ICP…',
      'Mapping your offer surface…',
      'Detecting your service areas…',
      'Comparing against industry baseline…',
    ],
  },
  {
    index: 2,
    startSec: 45,
    endSec: 70,
    title: 'Mapping your dormant relationships',
    ticks: [
      'Estimating your CRM dormancy…',
      'Inferring your reactivation cadence…',
      'Detecting engagement signals…',
      'Mapping your Five Orbits…',
    ],
  },
  {
    index: 3,
    startSec: 70,
    endSec: 90,
    title: 'Building your RROS map',
    ticks: [
      'Generating your RROS map…',
      'Scoring your orbits…',
      'Drafting your highest leverage move…',
      'Almost ready…',
    ],
  },
];

const TARGET_SECONDS = 90;

const formatTimer = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

// Try to extract a clean domain string from a possibly-malformed URL.
const cleanDomain = (raw?: string | null): string | null => {
  if (!raw) return null;
  try {
    const u = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
};

export default function MagnetWaitTheater({
  firstName,
  websiteUrl,
  companyName,
  enrichmentReady = false,
  vertical,
}: Props) {
  const reduced = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);
  const { flow } = useVerticalFlow(vertical);

  // ── Tick the elapsed counter every 250ms ────────────────────────────────
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      setElapsed((performance.now() - start) / 1000);
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  // ── Derive current stage from elapsed time ──────────────────────────────
  const currentStageIdx = useMemo(() => {
    if (elapsed >= 70) return 3;
    if (elapsed >= 45) return 2;
    if (elapsed >= 22) return 1;
    return 0;
  }, [elapsed]);

  // Apply per-vertical title + tick overrides on top of the base STAGES timing.
  const currentStage: Stage = useMemo(() => {
    const base = STAGES[currentStageIdx];
    return {
      ...base,
      title: flow.waitStageTitles[currentStageIdx] ?? base.title,
      ticks: flow.waitStageTicks[currentStageIdx] ?? base.ticks,
    };
  }, [currentStageIdx, flow]);

  // ── Status ticker: rotate every ~5s within the current stage ──────────
  const tickIdx = Math.min(
    currentStage.ticks.length - 1,
    Math.floor((elapsed - currentStage.startSec) / 5)
  );
  const currentTick = currentStage.ticks[Math.max(0, tickIdx)];

  // ── Top progress: elapsed-driven, but capped until enrichment ready ────
  const rawProgress = Math.min(100, (elapsed / TARGET_SECONDS) * 100);
  const progress = enrichmentReady ? 100 : Math.min(88, rawProgress);

  const domain = cleanDomain(websiteUrl);
  const headerName = companyName || domain || 'your firm';

  return (
    <div className="flex-1 flex flex-col items-stretch px-4 py-6 sm:py-10 bg-[#FBF8F4] text-[#1C1008]">
      {/* ─── Persistent header ─────────────────────────────────────────── */}
      <header className="max-w-2xl w-full mx-auto px-2 sm:px-4">
        <p className="text-[10px] uppercase tracking-[0.28em] font-semibold text-[#B8933A]">
          Building your map
        </p>
        <h1 className="mt-2 text-xl sm:text-2xl font-serif leading-tight">
          {firstName ? `${firstName}. Building your RROS map for ` : 'Building your RROS map for '}
          <span className="font-semibold not-italic">{headerName}</span>
        </h1>

        <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-[#1C1008]/55">
          <span aria-live="polite">
            {formatTimer(elapsed)} / {formatTimer(TARGET_SECONDS)}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-1.5 h-1 w-full bg-black/10 overflow-hidden">
          <div
            className="h-full bg-[#B8933A] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stage chips */}
        <ol className="mt-4 grid grid-cols-4 gap-1">
          {STAGES.map((s) => {
            const done = currentStageIdx > s.index || enrichmentReady;
            const active = currentStageIdx === s.index && !enrichmentReady;
            return (
              <li
                key={s.index}
                className={
                  active
                    ? 'h-1.5 bg-[#B8933A]'
                    : done
                      ? 'h-1.5 bg-[#B8933A]/50'
                      : 'h-1.5 bg-black/10'
                }
                aria-label={`Stage ${s.index + 1}: ${s.title}${active ? ' (in progress)' : done ? ' (complete)' : ''}`}
              />
            );
          })}
        </ol>
      </header>

      {/* ─── Stage stage (visual) ──────────────────────────────────────── */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-2 sm:px-4 mt-8 sm:mt-12">
        {reduced ? (
          <ReducedMotionStage stage={currentStage} tick={currentTick} />
        ) : (
          <>
            {currentStageIdx === 0 && (
              <Stage1Homepage domain={domain} tick={currentTick} title={currentStage.title} />
            )}
            {currentStageIdx === 1 && <Stage2Services tick={currentTick} title={currentStage.title} />}
            {currentStageIdx === 2 && <Stage3Orbits tick={currentTick} title={currentStage.title} />}
            {currentStageIdx === 3 && <Stage4Score tick={currentTick} elapsed={elapsed} title={currentStage.title} />}
          </>
        )}
      </main>

      {/* ─── Trust callout — appears mid-Stage 3 ───────────────────────── */}
      {!reduced && currentStageIdx === 2 && elapsed >= 55 && (
        <aside className="max-w-2xl w-full mx-auto px-2 sm:px-4 mt-8 animate-in fade-in duration-500">
          <div className="border border-[#B8933A]/30 bg-[#B8933A]/5 p-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#B8933A]">
              While you wait
            </p>
            <p className="mt-1.5 text-xs sm:text-sm text-[#1C1008]/80 leading-relaxed">
              60+ PS firms · $500M+ aggregate revenue · 4.8/5 avg insights rating
            </p>
          </div>
        </aside>
      )}

      <p className="mt-10 text-[10px] uppercase tracking-[0.28em] text-[#1C1008]/40 text-center">
        This usually takes 60 to 90 seconds
      </p>
    </div>
  );
}

// ─── Reduced motion fallback ────────────────────────────────────────────────
function ReducedMotionStage({ stage, tick }: { stage: Stage; tick: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-xs uppercase tracking-[0.28em] font-semibold text-[#B8933A] mb-3">
        Stage {stage.index + 1} of 4
      </p>
      <h2 className="text-2xl font-serif italic text-[#1C1008] mb-6">
        {stage.title}
      </h2>
      <p className="text-sm text-[#1C1008]/65" aria-live="polite">
        {tick}
      </p>
    </div>
  );
}

// ─── Stage 1: Domain card slides in ─────────────────────────────────────────
function Stage1Homepage({
  domain,
  tick,
  title,
}: {
  domain: string | null;
  tick: string;
  title: string;
}) {
  const favicon = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    : null;

  return (
    <div className="text-center">
      <p className="text-[10px] uppercase tracking-[0.28em] font-semibold text-[#B8933A]">
        Stage 1 of 4
      </p>
      <h2 className="mt-2 text-xl sm:text-2xl font-serif italic text-[#1C1008]">
        {title}
      </h2>

      <div className="mt-8 mx-auto max-w-md border border-black/10 bg-white p-5 text-left animate-in fade-in slide-in-from-bottom-3 duration-700">
        <div className="flex items-center gap-3">
          {favicon ? (
            <img
              src={favicon}
              alt=""
              width={32}
              height={32}
              className="w-8 h-8 rounded-sm bg-black/5 object-contain"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
            />
          ) : (
            <div className="w-8 h-8 rounded-sm bg-[#B8933A]/15" />
          )}
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-[#1C1008]/40">
              Source
            </p>
            <p className="text-sm font-semibold truncate">{domain ?? 'your-firm.com'}</p>
          </div>
        </div>

        {/* Faux scanned content lines */}
        <div className="mt-4 space-y-2">
          {[0.92, 0.78, 0.85, 0.62, 0.7].map((w, i) => (
            <div
              key={i}
              className="h-2 rounded-sm bg-black/10"
              style={{
                width: `${w * 100}%`,
                animation: `wt-line-fade 1.6s ease-out ${i * 0.18}s forwards`,
                opacity: 0.2,
              }}
            />
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs sm:text-sm text-[#1C1008]/65 min-h-[1.25rem]" aria-live="polite">
        {tick}
      </p>

      <style>{`
        @keyframes wt-line-fade {
          from { opacity: 0.2; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Stage 2: Service cards fade in ────────────────────────────────────────
function Stage2Services({ tick, title }: { tick: string; title: string }) {
  const services = ['Strategy', 'Branding', 'Delivery', 'Growth'];
  return (
    <div className="text-center">
      <p className="text-[10px] uppercase tracking-[0.28em] font-semibold text-[#B8933A]">
        Stage 2 of 4
      </p>
      <h2 className="mt-2 text-xl sm:text-2xl font-serif italic text-[#1C1008]">
        {title}
      </h2>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl mx-auto">
        {services.map((s, i) => (
          <div
            key={s}
            className="border border-black/10 bg-white p-4 text-left opacity-0"
            style={{
              animation: `wt-fade-up 0.55s ease-out ${i * 0.55}s forwards`,
            }}
          >
            <p className="text-[9px] uppercase tracking-widest text-[#B8933A]">
              Service {String(i + 1).padStart(2, '0')}
            </p>
            <p className="text-sm font-semibold mt-1.5">{s}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs sm:text-sm text-[#1C1008]/65 min-h-[1.25rem]" aria-live="polite">
        {tick}
      </p>

      <style>{`
        @keyframes wt-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Stage 3: Orbit visualization draws ring-by-ring ───────────────────────
function Stage3Orbits({ tick, title }: { tick: string; title: string }) {
  const SIZE = 320;
  const C = SIZE / 2;
  const rings = [44, 78, 112, 146, 180];

  return (
    <div className="text-center">
      <p className="text-[10px] uppercase tracking-[0.28em] font-semibold text-[#B8933A]">
        Stage 3 of 4
      </p>
      <h2 className="mt-2 text-xl sm:text-2xl font-serif italic text-[#1C1008]">
        {title}
      </h2>

      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="mx-auto mt-6"
        aria-hidden
      >
        <circle cx={C} cy={C} r={6} fill="#B8933A" />
        {rings.map((r, i) => {
          const circ = 2 * Math.PI * r;
          return (
            <circle
              key={i}
              cx={C}
              cy={C}
              r={r}
              fill="none"
              stroke="#1C1008"
              strokeOpacity={0.2}
              strokeWidth={1}
              strokeDasharray={circ}
              strokeDashoffset={circ}
              style={{
                animation: `wt-ring-draw 1.4s cubic-bezier(0.4,0,0.2,1) ${i * 0.5 + 0.2}s forwards`,
              }}
            />
          );
        })}
      </svg>

      <p className="mt-2 text-xs sm:text-sm text-[#1C1008]/65 min-h-[1.25rem]" aria-live="polite">
        {tick}
      </p>

      <style>{`
        @keyframes wt-ring-draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Stage 4: Score number counts up ───────────────────────────────────────
function Stage4Score({ tick, elapsed, title }: { tick: string; elapsed: number; title: string }) {
  // Smoothly tween a teaser score from 0 → 73 between 70s and 88s.
  const t = Math.max(0, Math.min(1, (elapsed - 70) / 18));
  const eased = 1 - Math.pow(1 - t, 3);
  const score = Math.round(eased * 73);

  return (
    <div className="text-center">
      <p className="text-[10px] uppercase tracking-[0.28em] font-semibold text-[#B8933A]">
        Stage 4 of 4
      </p>
      <h2 className="mt-2 text-xl sm:text-2xl font-serif italic text-[#1C1008]">
        {title}
      </h2>

      <div className="mt-10 mx-auto inline-block">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#1C1008]/50">
          Relationship Revenue Score
        </p>
        <p className="mt-2 font-serif text-[88px] leading-none text-[#B8933A] tabular-nums">
          {score}
          <span className="text-[#1C1008]/30 text-[36px]"> / 100</span>
        </p>
      </div>

      <p className="mt-8 text-xs sm:text-sm text-[#1C1008]/65 min-h-[1.25rem]" aria-live="polite">
        {tick}
      </p>
    </div>
  );
}
