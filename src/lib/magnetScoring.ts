// ─────────────────────────────────────────────────────────────────────────────
// Heuristic scoring for the V10 microsite.
//
// We don't yet generate numeric per-orbit scores in the enrichment edge function,
// so V10's "high/mid/low" UX (orbit colors, score-adaptive headlines, CTA variant
// selection) is derived client-side from the existing breakdown text.
//
// Swap this for LLM-generated scores in `enrich-magnet/index.ts` later by
// returning the same shape from the RPC and dropping the `compute*` helpers.
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

/**
 * Score one orbit description (0–100) from heuristics on the existing text.
 *  - Empty / placeholder → 20 (low but not zero, reflects "we couldn't read this")
 *  - Long substantive description → up to 70 base
 *  - Each signal keyword adds confidence (caps at 100)
 */
export function scoreOrbit(text: string | null | undefined): number {
  if (!text) return 20;
  const trimmed = text.trim();
  if (!trimmed || trimmed === "—" || trimmed.toLowerCase() === "pending") return 20;

  // Base score from length: short blurb ~35, full paragraph ~70
  const length = trimmed.length;
  let base = 30;
  if (length > 60) base = 45;
  if (length > 140) base = 58;
  if (length > 240) base = 68;

  // Signal keywords — each unique hit nudges the score up
  const lower = trimmed.toLowerCase();
  const hits = SIGNAL_KEYWORDS.filter((kw) => lower.includes(kw)).length;
  const signalBonus = Math.min(25, hits * 4);

  return Math.max(0, Math.min(100, base + signalBonus));
}

export function bandFor(score: number): ScoreBand {
  if (score >= 60) return "high";
  if (score >= 40) return "mid";
  return "low";
}

export function computeOrbitScores(orbits: (string | null | undefined)[]): OrbitScores {
  const perOrbit = orbits.slice(0, 5).map(scoreOrbit);
  const padded = [...perOrbit, ...Array(5 - perOrbit.length).fill(20)].slice(0, 5);
  const overall = Math.round(
    padded.reduce((s, n) => s + n, 0) / padded.length
  );
  return {
    perOrbit: padded,
    overall,
    bandPerOrbit: padded.map(bandFor),
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
