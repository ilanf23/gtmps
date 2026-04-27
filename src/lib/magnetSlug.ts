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

