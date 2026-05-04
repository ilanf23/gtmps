/**
 * Firm display-name resolution - single source of truth.
 *
 * The audit surfaced a P0 bug on /m/cravath: the hero rendered
 * "Your Revenue Map for ___" with no firm name. Root cause: the existing
 * fallback chain used `??` which only catches null/undefined, not empty
 * strings or whitespace. When enrichment writes `client_company_name = ""`
 * (the trimming side-effect of one of the upstream LLM passes), the
 * nullish-coalesce passes through and the hero renders blank.
 *
 * This utility is the canonical resolver. Use it anywhere a guaranteed-
 * non-empty firm name is needed.
 */

import { displayNameFromSlug, normalizeFirmName } from "./magnetSlug";

export interface DisplayNameInput {
  /** The extracted company name from enrichment. May be null, undefined,
      empty, or whitespace-only - all treated as missing. */
  companyName?: string | null;
  /** The route slug. Used to derive a name when companyName is missing. */
  slug?: string | null;
  /** Optional final fallback when both companyName and slug fail to yield
      anything. Defaults to "Your firm" - sentence case, never empty. */
  fallback?: string;
}

// Mabbly is the operator of the Magnet flow, never a customer of it. Any
// resolved name that normalizes to "mabbly" (e.g. extraction picked up
// "Mabbly LLC" from a partner page, or the slug is literally "mabbly") is
// treated as missing so the hero falls through to the customer-shaped
// fallback instead of branding the page as Mabbly.
function isSelfName(name: string): boolean {
  return normalizeFirmName(name) === "mabbly";
}

/**
 * Always returns a non-empty, trimmed, sentence-case-ish firm name.
 *
 * Resolution order:
 *   1. companyName, if set and non-empty after trim (and not the self-name)
 *   2. displayNameFromSlug(slug), if it yields a real name (rejects "firm")
 *   3. fallback (default "Your firm")
 */
export function getDisplayName(input: DisplayNameInput): string {
  const trimmed = (input.companyName ?? "").trim();
  if (trimmed.length > 0 && !isSelfName(trimmed)) return trimmed;

  const fromSlug = displayNameFromSlug(input.slug);
  if (fromSlug && fromSlug.trim().length > 0 && !isSelfName(fromSlug)) return fromSlug;

  return input.fallback ?? "Your firm";
}

/**
 * True when the resolved name is the generic fallback (no real signal).
 * Useful for components that want to hide branded surfaces (logos, custom
 * accents) when the firm couldn't be identified.
 */
export function isGenericFallback(input: DisplayNameInput): boolean {
  const trimmed = (input.companyName ?? "").trim();
  if (trimmed.length > 0 && !isSelfName(trimmed)) return false;
  const fromSlug = displayNameFromSlug(input.slug);
  if (fromSlug && fromSlug.trim().length > 0 && !isSelfName(fromSlug)) return false;
  return true;
}
