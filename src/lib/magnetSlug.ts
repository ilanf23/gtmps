import { customAlphabet } from 'nanoid';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const SUFFIX_LEN = 3;

const suffixNano = customAlphabet(ALPHABET, SUFFIX_LEN);

/**
 * Convert a website URL into a clean, human-friendly slug:
 *   https://aarete.com               → 'aarete'
 *   www.foo-bar.co.uk/path?x=1       → 'foo-bar'
 *   acme.io                          → 'acme'
 *
 * Strips protocol, `www.`, paths, queries, hashes; keeps only the leftmost
 * label of the host minus `www`. Lowercased, `[a-z0-9-]` only, hyphen-collapsed.
 *
 * If extraction yields nothing usable, falls back to `firm-<3char>`.
 */
export function generateMagnetSlug(input: string): string {
  const cleaned = (input ?? '').trim();
  if (!cleaned) return fallbackSlug();

  // Normalize: prepend protocol so URL() can parse bare domains.
  const withProto = /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;

  let host = '';
  try {
    host = new URL(withProto).hostname;
  } catch {
    // Fallback parse: strip protocol + path manually.
    host = cleaned
      .replace(/^https?:\/\//i, '')
      .replace(/[/?#].*$/, '');
  }

  host = host.toLowerCase().replace(/^www\./, '');
  // Take leftmost label (root domain). For `foo-bar.co.uk` → `foo-bar`.
  const root = host.split('.')[0] ?? '';
  const sanitized = root
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!sanitized) return fallbackSlug();
  return sanitized;
}

/** Generate a short collision suffix (`-x7k`). */
export function magnetSlugSuffix(): string {
  try {
    return suffixNano();
  } catch {
    return Math.random().toString(36).slice(2, 2 + SUFFIX_LEN);
  }
}

function fallbackSlug(): string {
  return `firm-${magnetSlugSuffix()}`;
}

/**
 * Convert a slug or domain root into a human-display firm name.
 *   'aarete'         → 'AArete' (special-cased capitals not handled — caller can override)
 *   'calliope'       → 'Calliope'
 *   'foo-bar'        → 'Foo Bar'
 *   'firm-x7k'       → 'Firm'
 * Returns null when the slug looks like a generated fallback with no signal.
 */
export function displayNameFromSlug(slug: string | null | undefined): string | null {
  const raw = (slug ?? '').trim().toLowerCase();
  if (!raw) return null;
  // Strip a trailing 3-char collision suffix like '-x7k' so 'aarete-x7k' → 'aarete'.
  const stripped = raw.replace(/-[a-z0-9]{3}$/i, '');
  // 'firm-x7k' → 'firm' → not useful.
  if (stripped === 'firm' || stripped === '') return null;
  return stripped
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Normalize a firm name for equivalence checks: strip whitespace, punctuation,
 * common legal/marketing suffixes, and lowercase. Used to decide whether the
 * slug-derived "submitted name" and the enrichment-derived "canonical name"
 * are meaningfully different.
 *
 * Examples:
 *   'Marcum LLP'        → 'marcum'
 *   'CBIZ, Inc.'        → 'cbiz'
 *   'Foo & Bar Group'   → 'foobar'
 *   'foo-bar'           → 'foobar'
 */
export function normalizeFirmName(input: string | null | undefined): string {
  const raw = (input ?? '').toString().trim().toLowerCase();
  if (!raw) return '';
  // Drop common corporate suffixes — these often appear on the canonical
  // name from enrichment but never on a slug.
  const suffixStripped = raw
    .replace(
      /\b(llp|llc|inc|incorporated|ltd|limited|plc|pllc|pc|pa|corp|corporation|company|co|group|partners|partnership|holdings|consulting|advisors|advisory|associates|the)\b/g,
      ' ',
    )
    .replace(/&/g, ' and ');
  // Strip every non-alphanumeric char (handles spaces, hyphens, commas, dots).
  return suffixStripped.replace(/[^a-z0-9]/g, '');
}

/**
 * True when the submitted (slug-derived) firm name and the canonical firm
 * name from enrichment refer to substantially different firms.
 *
 * Returns false (i.e. "no disambiguation needed") when:
 *   - either name is empty
 *   - normalized strings are equal
 *   - one normalized string is a prefix/substring of the other (e.g. slug
 *     'aarete' vs canonical 'AArete Consulting' → still the same firm)
 *
 * Returns true when the names diverge meaningfully — this is the signal
 * for the disambiguation banner (e.g. user submitted "marcum" but
 * enrichment resolved to "CBIZ" because Marcum was acquired).
 */
export function isCanonicalNameMismatch(
  submittedName: string | null | undefined,
  canonicalName: string | null | undefined,
): boolean {
  const a = normalizeFirmName(submittedName);
  const b = normalizeFirmName(canonicalName);
  if (!a || !b) return false;
  if (a === b) return false;
  // Treat as same firm when one is contained in the other.
  if (a.includes(b) || b.includes(a)) return false;
  return true;
}

