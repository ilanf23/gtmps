// ─────────────────────────────────────────────────────────────────────────────
// Section 8 CTA copy variants (V10 microsite).
//
// Variant chosen by `pickVariant()` from vertical context + score + deal-size
// heuristics. All copy lives here so it can be tuned without editing components.
// ─────────────────────────────────────────────────────────────────────────────

import type { ScoreBand } from "@/lib/magnetScoring";
import { getFeatureFlagPayload } from "@/lib/posthog";

export type CtaVariantId = "A" | "B" | "C" | "D";

export interface CtaVariant {
  id: CtaVariantId;
  /** Short label for analytics. */
  label: string;
  /** Lead paragraph(s). */
  paragraphs: string[];
  /** Optional bullet list ("What we'll discuss:"). */
  bullets?: string[];
  /** Closing line, often "Free call. No pitch." */
  closer: string;
}

// VARIANT A - Skeptics / small firm
const A: CtaVariant = {
  id: "A",
  label: "skeptic",
  paragraphs: [
    "You contributed 90 seconds to this research. Let's spend 30 minutes together.",
    "Free. No pitch. No obligation. If you don't see immediate value in 5 minutes, we'll stop.",
  ],
  closer: "Free call. No pitch.",
};

// VARIANT B - Institutional (law / accounting / large)
const B: CtaVariant = {
  id: "B",
  label: "institutional",
  paragraphs: [
    "Deloitte's framework. Your firm's data.",
    "30-minute conversation to explore how your research directly shapes the manuscript launching Q3 2026.",
  ],
  closer: "Free. No pitch.",
};

// VARIANT C - Operational (agency / msp / a&e)
const C: CtaVariant = {
  id: "C",
  label: "operational",
  paragraphs: [
    "You identified your highest-leverage move in 90 seconds. Let's validate it against 200 practitioner interviews and your peers.",
  ],
  bullets: [
    "Your personalized revenue map",
    "Firmwide applications of your findings",
    "Your role in the manuscript feedback loop",
    "Your 90-day action plan",
  ],
  closer: "Free call. No pitch.",
};

// VARIANT D - ROI-focused / time-pressed
const D: CtaVariant = {
  id: "D",
  label: "roi",
  paragraphs: [
    "$400K proposals. $200K to $800K dormant revenue per firm. Your analysis just mapped yours.",
    "Let's spend 30 minutes turning that into your 90-day action plan.",
  ],
  bullets: [
    "Your specific reactivation targets",
    "Timeline to revenue (week 1 / month 1 / quarter 1)",
    "How to involve your partner / team",
    "Your next move",
  ],
  closer: "Free call. No pitch.",
};

export const CTA_VARIANTS: Record<CtaVariantId, CtaVariant> = { A, B, C, D };

export interface PickVariantInput {
  vertical: string; // resolved vertical slug
  bandOverall: ScoreBand;
  /** Estimated annual deal size (USD). 0 if unknown. */
  dealSizeEstimate?: number | null;
}

/**
 * Pick a CTA variant. Vertical wins; falls back to score/revenue heuristics.
 *
 * Rules (per spec):
 *  - law / accounting          → B
 *  - agency / ae               → C
 *  - msp / recruiting / advisory / consulting → C, or D when dealSize > 30k
 *  - generic + low score       → A
 *  - generic + dealSize > 30k  → D
 *  - default                   → C
 */
function pickVariantStatic(input: PickVariantInput): CtaVariantId {
  const { vertical, bandOverall, dealSizeEstimate } = input;
  const v = vertical.toLowerCase();

  if (v === "law" || v === "accounting") return "B";
  if (v === "agency" || v === "ae") return "C";
  if (
    v === "msp" ||
    v === "recruiting" ||
    v === "advisory" ||
    v === "consulting"
  ) {
    return (dealSizeEstimate ?? 0) > 30_000 ? "D" : "C";
  }

  // generic / unknown
  if (bandOverall === "low") return "A";
  if ((dealSizeEstimate ?? 0) > 30_000) return "D";
  return "C";
}

function isCtaVariantId(v: unknown): v is CtaVariantId {
  return v === "A" || v === "B" || v === "C" || v === "D";
}

/**
 * Pick a CTA variant. Prefers a PostHog `cta-variant` feature-flag payload
 * (string `"A"|"B"|"C"|"D"` or `{ variant: "A".."D" }`) when available, so we
 * can A/B test copy without redeploying. Falls back to the static heuristic
 * below when PostHog hasn't loaded or no payload is configured.
 */
export function pickVariant(input: PickVariantInput): CtaVariantId {
  const payload = getFeatureFlagPayload("cta-variant");
  if (isCtaVariantId(payload)) return payload;
  if (
    payload &&
    typeof payload === "object" &&
    isCtaVariantId((payload as { variant?: unknown }).variant)
  ) {
    return (payload as { variant: CtaVariantId }).variant;
  }
  return pickVariantStatic(input);
}
