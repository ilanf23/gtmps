import { normalizeFirmName } from "./magnetSlug";

// ─────────────────────────────────────────────────────────────────────────────
// Heuristic scoring for the V10 microsite. CALIBRATED v2 (post Apr 2026).
//
// Bands: 0 to 40 = low (Red), 41 to 65 = mid (Yellow), 66 to 100 = high (Strong).
//
// Key change vs v1: length alone is no longer evidence of a relationship system.
// Each of the five orbits has its own qualitative signal gate. If the orbit
// description doesn't mention the system that orbit measures, the score is
// capped at 55 (Yellow). Plus a "no flat strong sweep" guarantee - if every
// orbit lands in `high`, the lowest is demoted to mid so the tool never reads
// as fake validation.
//
// Real-world calibration target (from manuscript Ch.1): a firm like AArete
// with 160 dormant proposals must surface Yellow on Dead Zone (Orbit 03)
// unless their public site shows an explicit reactivation cadence.
// ─────────────────────────────────────────────────────────────────────────────

export type ScoreBand = "low" | "mid" | "high";

export interface OrbitScores {
  /** 5-element array, indexed 0..4 → ⊙01..⊙05 */
  perOrbit: number[];
  /** 0 to 100 average across mapped orbits. */
  overall: number;
  bandPerOrbit: ScoreBand[];
  bandOverall: ScoreBand;
}

const SIGNAL_KEYWORDS = [
  "client", "case study", "case-study", "proven", "delivered", "increased",
  "reduced", "saved", "results", "proof", "testimonial", "award", "%",
  "$", "million", "growth", "won", "selected", "ranked",
];

// Per-orbit signal gates. If NONE of the regex patterns fire for an orbit's
// text, the score is capped at 55 (mid/Yellow). These represent the minimum
// public evidence we'd expect from a firm that genuinely runs that orbit.
const ORBIT_GATES: Array<{ idx: number; pattern: RegExp; cap: number }> = [
  // Orbit 01 (Core Identity / Positioning) - open: a positioning paragraph is enough.
  // Orbit 02 (Active Proof / Pipeline)
  { idx: 1, pattern: /case stud|client work|results|won|delivered|increased|reduced|saved|%|\$|million|billion/i, cap: 55 },
  // Orbit 03 (Dead Zone / Reactivation) - strict: most firms have no public reactivation system.
  { idx: 2, pattern: /reactiv|dormant|nurture|sequence|cadence|win[\s-]?back|alumni|former client|re[-\s]?engage/i, cap: 55 },
  // Orbit 04 (Cadence / Publishing rhythm)
  { idx: 3, pattern: /weekly|monthly|quarterly|cadence|rhythm|series|publish|podcast|newsletter|cohort/i, cap: 55 },
  // Orbit 05 (Compounding / Community)
  { idx: 4, pattern: /referral|repeat|expansion|alumni|community|cohort|network|advocate/i, cap: 55 },
];

// LLM-emitted status tags get baked into score baselines so the band visibly
// tracks what the AI observed, not just text length. Range is per-orbit so
// "[strong]" on Core Proof reads differently than "[strong]" on Dead Zone.
type StatusTag = "strong" | "gap" | "dormant" | "untapped" | null;
const STATUS_BASELINE: Record<Exclude<StatusTag, null>, number> = {
  strong: 78,
  untapped: 55,
  dormant: 38,
  gap: 28,
};

function extractStatusTag(text: string | null | undefined): StatusTag {
  if (!text) return null;
  const m = text.trim().match(/^\[(strong|gap|dormant|untapped)\]/i);
  return m ? (m[1].toLowerCase() as StatusTag) : null;
}

/**
 * Score one orbit description (0 to 100):
 *  - If the LLM emitted a status tag, anchor the score to the tag baseline
 *    and let signal keywords nudge it ±10.
 *  - Otherwise, fall back to the heuristic length+keyword score (low base).
 *  - Empty / placeholder → 20.
 */
export function scoreOrbit(text: string | null | undefined): number {
  if (!text) return 20;
  const trimmed = text.trim();
  if (!trimmed || trimmed === "-" || trimmed.toLowerCase() === "pending") return 20;

  const tag = extractStatusTag(trimmed);
  const lower = trimmed.toLowerCase();
  const hits = SIGNAL_KEYWORDS.filter((kw) => lower.includes(kw)).length;

  if (tag) {
    const baseline = STATUS_BASELINE[tag];
    const nudge = Math.min(10, Math.max(-6, hits * 2 - 4));
    return Math.max(0, Math.min(100, baseline + nudge));
  }

  // No tag - heuristic fallback.
  const length = trimmed.length;
  let base = 20;
  if (length > 60) base = 30;
  if (length > 140) base = 40;
  if (length > 240) base = 50;
  const signalBonus = Math.min(25, hits * 4);
  return Math.max(0, Math.min(100, base + signalBonus));
}

export function bandFor(score: number): ScoreBand {
  if (score >= 66) return "high";
  if (score >= 41) return "mid";
  return "low";
}

/** Apply orbit-specific signal gates; returns a possibly-capped score. */
function applyOrbitGate(idx: number, baseScore: number, text: string | null | undefined): number {
  const gate = ORBIT_GATES.find((g) => g.idx === idx);
  if (!gate) return baseScore;
  // If the LLM marked this orbit "strong", trust it and skip the cap.
  if (extractStatusTag(text) === "strong") return baseScore;
  const lower = (text ?? "").toLowerCase();
  if (gate.pattern.test(lower)) return baseScore;
  return Math.min(baseScore, gate.cap);
}

/**
 * Force visible variance across the 5 orbits when the model returns a near-flat
 * profile (e.g. 44/44/44/44/48). Real PS firms always have spread; collapsing
 * to a single band reads as fake. We perturb scores deterministically (based on
 * orbit index) so the same inputs always produce the same output.
 */
function ensureVariance(scores: number[]): number[] {
  if (scores.length < 2) return scores;
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  if (max - min >= 15) return scores;
  // Deterministic per-index nudges anchored on Dead Zone being the typical
  // weakest orbit and Core Proof / Active being the typical strongest.
  const NUDGES = [+8, +4, -10, -4, -2]; // sums to -4 → minor downward drift
  const adjusted = scores.map((s, i) =>
    Math.max(8, Math.min(95, s + (NUDGES[i] ?? 0))),
  );
  return adjusted;
}

// ─── Mabbly demo boost ───────────────────────────────────────────────────────
// When a submission resolves to Mabbly itself (slug or extracted company
// name), we render a curated "what a fully-instrumented RROS firm looks
// like" profile instead of letting the live scoring drag down the demo.
// The shape is intentionally not flat-strong: Dead Zone (Orbit 03) sits
// at the bottom of the high band and Cadence is the cleanest, so the
// page reads as a credible top-tier firm rather than a 100/100 marketing
// gimmick. This is the only firm with a hardcoded boost.
const MABBLY_DEMO: OrbitScores = (() => {
  const perOrbit = [92, 88, 74, 90, 85];
  const overall = Math.round(perOrbit.reduce((s, n) => s + n, 0) / perOrbit.length);
  return {
    perOrbit,
    overall,
    bandPerOrbit: perOrbit.map(bandFor),
    bandOverall: bandFor(overall),
  };
})();

function isMabblyContext(
  slug: string | null | undefined,
  companyName: string | null | undefined,
): boolean {
  if (normalizeFirmName(slug ?? "") === "mabbly") return true;
  if (normalizeFirmName(companyName ?? "") === "mabbly") return true;
  return false;
}

/**
 * Apply the Mabbly demo override to a score result. Pure pass-through
 * for any non-Mabbly firm — this is the only branding override in the
 * scoring layer.
 */
export function applyDemoBoost(
  scores: OrbitScores,
  slug: string | null | undefined,
  companyName: string | null | undefined,
): OrbitScores {
  if (isMabblyContext(slug, companyName)) return MABBLY_DEMO;
  return scores;
}

export function computeOrbitScores(orbits: (string | null | undefined)[]): OrbitScores {
  const padded5 = [...orbits.slice(0, 5), ...Array(5 - orbits.length).fill(null)].slice(0, 5);
  const raw = padded5.map(scoreOrbit);
  const gated = raw.map((s, i) => applyOrbitGate(i, s, padded5[i]));

  // No flat-strong sweep: if 4+ orbits land in `high`, demote the weakest to mid.
  const highCount = gated.filter((s) => s >= 66).length;
  let final = gated;
  if (highCount >= 4) {
    const minIdx = gated.reduce((mi, v, i, a) => (v < a[mi] ? i : mi), 0);
    final = gated.map((s, i) => (i === minIdx ? Math.min(s, 55) : s));
  }

  // Variance guarantee: spread > 15 points across the 5 orbits.
  final = ensureVariance(final);

  const overall = Math.round(final.reduce((s, n) => s + n, 0) / final.length);
  return {
    perOrbit: final,
    overall,
    bandPerOrbit: final.map(bandFor),
    bandOverall: bandFor(overall),
  };
}

// ─── Section 1 subheader ─────────────────────────────────────────────────────
export function headerSubheaderFor(band: ScoreBand): string {
  if (band === "high") return "You're ahead. Here's where to gain more ground.";
  if (band === "mid") return "Clear opportunities identified. Let's build your plan.";
  return "Every firm has gaps. Yours are fixable in 90 days.";
}

// ─── Section 8 score-adaptive headline ───────────────────────────────────────
export type FindingProfile =
  | "strongCoreWeakProof"
  | "weakCoreStrongProof"
  | "weakDeadZone"
  | "allWeak"
  | "allStrong"
  | "balanced";

export function profileFromScores(scores: OrbitScores): FindingProfile {
  const [coreProof, _active, deadZone] = scores.perOrbit;
  const allHigh = scores.bandPerOrbit.every((b) => b === "high");
  const allLow = scores.bandPerOrbit.every((b) => b === "low");

  if (allHigh) return "allStrong";
  if (allLow) return "allWeak";
  if (deadZone < 40) return "weakDeadZone";
  if (coreProof >= 60 && (scores.perOrbit[1] ?? 0) < 40) return "strongCoreWeakProof";
  if (coreProof < 40 && (scores.perOrbit[1] ?? 0) >= 60) return "weakCoreStrongProof";
  return "balanced";
}

export function ctaHeadlineFor(profile: FindingProfile): string {
  switch (profile) {
    case "strongCoreWeakProof":
      return "Build your Proof system in 30 days.";
    case "weakCoreStrongProof":
      return "Sharpen your Core. Your Proof deserves it.";
    case "weakDeadZone":
      return "Activate your Dead Zone like Madcraft did.";
    case "allWeak":
      return "Build your full RROS in 90 days.";
    case "allStrong":
      return "Compound what you already have.";
    default:
      return "Turn this map into a 90-day action plan.";
  }
}
