// ─────────────────────────────────────────────────────────────────────────────
// Heuristic scoring for the V10 microsite. CALIBRATED v2 (post Apr 2026).
//
// Bands: 0–40 = low (Red), 41–65 = mid (Yellow), 66–100 = high (Strong).
//
// Key change vs v1: length alone is no longer evidence of a relationship system.
// Each of the five orbits has its own qualitative signal gate. If the orbit
// description doesn't mention the system that orbit measures, the score is
// capped at 55 (Yellow). Plus a "no flat strong sweep" guarantee — if every
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
  /** 0–100 average across mapped orbits. */
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
  // Orbit 01 (Core Identity / Positioning) — open: a positioning paragraph is enough.
  // Orbit 02 (Active Proof / Pipeline)
  { idx: 1, pattern: /case stud|client work|results|won|delivered|increased|reduced|saved|%|\$|million|billion/i, cap: 55 },
  // Orbit 03 (Dead Zone / Reactivation) — strict: most firms have no public reactivation system.
  { idx: 2, pattern: /reactiv|dormant|nurture|sequence|cadence|win[\s-]?back|alumni|former client|re[-\s]?engage/i, cap: 55 },
  // Orbit 04 (Cadence / Publishing rhythm)
  { idx: 3, pattern: /weekly|monthly|quarterly|cadence|rhythm|series|publish|podcast|newsletter|cohort/i, cap: 55 },
  // Orbit 05 (Compounding / Community)
  { idx: 4, pattern: /referral|repeat|expansion|alumni|community|cohort|network|advocate/i, cap: 55 },
];

/**
 * Score one orbit description (0–100) from heuristics.
 *  - Empty / placeholder → 20
 *  - Short blurb → ~25–35
 *  - Long substantive paragraph → up to ~50 base
 *  - Each signal keyword adds a small bonus (caps at 100)
 */
export function scoreOrbit(text: string | null | undefined): number {
  if (!text) return 20;
  const trimmed = text.trim();
  if (!trimmed || trimmed === "—" || trimmed.toLowerCase() === "pending") return 20;

  // Lower base than v1: length alone is not proof of system.
  const length = trimmed.length;
  let base = 20;
  if (length > 60) base = 30;
  if (length > 140) base = 40;
  if (length > 240) base = 50;

  const lower = trimmed.toLowerCase();
  const hits = SIGNAL_KEYWORDS.filter((kw) => lower.includes(kw)).length;
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
  const lower = (text ?? "").toLowerCase();
  if (gate.pattern.test(lower)) return baseScore;
  return Math.min(baseScore, gate.cap);
}

export function computeOrbitScores(orbits: (string | null | undefined)[]): OrbitScores {
  const padded5 = [...orbits.slice(0, 5), ...Array(5 - orbits.length).fill(null)].slice(0, 5);
  const raw = padded5.map(scoreOrbit);
  const gated = raw.map((s, i) => applyOrbitGate(i, s, padded5[i]));

  // Variance guarantee: if 4+ orbits land in `high`, demote the weakest to mid.
  const highCount = gated.filter((s) => s >= 66).length;
  let final = gated;
  if (highCount >= 4) {
    const minIdx = gated.reduce((mi, v, i, a) => (v < a[mi] ? i : mi), 0);
    final = gated.map((s, i) => (i === minIdx ? Math.min(s, 55) : s));
  }

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
