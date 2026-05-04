// First-touch channel attribution for the Magnet flow (/m/:slug and sub-routes).
//
// Reads ?utm_source / ?utm_medium / ?utm_campaign on landing, persists the
// first non-empty set per slug to localStorage, and exposes the captured
// context to anyone who needs it (view inserts, event tracking).
//
// Storage keys:
//   localStorage.mabbly:magnet:firstTouch:<slug>  - per-slug first touch
//   localStorage.mabbly:magnet:fp                  - per-browser visitor uuid
//   sessionStorage.mabbly:magnet:session           - per-tab session uuid
//
// All reads/writes are wrapped in try/catch; private mode never breaks the UI.

const FIRST_TOUCH_PREFIX = "mabbly:magnet:firstTouch:";
const FP_KEY = "mabbly:magnet:fp";
const SESSION_KEY = "mabbly:magnet:session";

export interface AttributionContext {
  slug: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer_url: string | null;
  session_id: string;
  visitor_fingerprint: string;
  captured_at: string;
}

interface StoredFirstTouch {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer_url: string | null;
  captured_at: string;
}

let current: AttributionContext | null = null;

export function getCurrentAttribution(): AttributionContext | null {
  return current;
}

function safeLocalGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode - ignore */
  }
}

function safeSessionGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSessionSet(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function uuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback for older browsers / jsdom: timestamp + random.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateVisitorFingerprint(): string {
  const existing = safeLocalGet(FP_KEY);
  if (existing) return existing;
  const fp = uuid();
  safeLocalSet(FP_KEY, fp);
  return fp;
}

export function getOrCreateSessionId(): string {
  const existing = safeSessionGet(SESSION_KEY);
  if (existing) return existing;
  const id = uuid();
  safeSessionSet(SESSION_KEY, id);
  return id;
}

function readStoredFirstTouch(slug: string): StoredFirstTouch | null {
  const raw = safeLocalGet(FIRST_TOUCH_PREFIX + slug);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return {
      utm_source: typeof parsed.utm_source === "string" ? parsed.utm_source : null,
      utm_medium: typeof parsed.utm_medium === "string" ? parsed.utm_medium : null,
      utm_campaign:
        typeof parsed.utm_campaign === "string" ? parsed.utm_campaign : null,
      referrer_url:
        typeof parsed.referrer_url === "string" ? parsed.referrer_url : null,
      captured_at:
        typeof parsed.captured_at === "string"
          ? parsed.captured_at
          : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function writeStoredFirstTouch(slug: string, value: StoredFirstTouch): void {
  safeLocalSet(FIRST_TOUCH_PREFIX + slug, JSON.stringify(value));
}

function trim(v: string | null | undefined): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

/**
 * Read URL UTMs and document.referrer, write first-touch to localStorage if
 * absent, populate the module singleton, and return the resolved context.
 *
 * Idempotent: safe to call on every mount. First call wins for any given slug.
 */
export function captureAttribution(slug: string): AttributionContext {
  const url =
    typeof window !== "undefined" && window.location
      ? new URL(window.location.href)
      : null;

  const urlUtmSource = trim(url?.searchParams.get("utm_source"));
  const urlUtmMedium = trim(url?.searchParams.get("utm_medium"));
  const urlUtmCampaign = trim(url?.searchParams.get("utm_campaign"));
  const referrerUrl =
    typeof document !== "undefined" ? trim(document.referrer) : null;

  let stored = readStoredFirstTouch(slug);

  // First-touch: if nothing stored AND we have at least one UTM in the URL,
  // persist it. document.referrer alone is not enough to mint a first-touch
  // record - we want explicit channel intent.
  if (!stored && (urlUtmSource || urlUtmMedium || urlUtmCampaign)) {
    stored = {
      utm_source: urlUtmSource,
      utm_medium: urlUtmMedium,
      utm_campaign: urlUtmCampaign,
      referrer_url: referrerUrl,
      captured_at: new Date().toISOString(),
    };
    writeStoredFirstTouch(slug, stored);
  }

  const ctx: AttributionContext = {
    slug,
    utm_source: stored?.utm_source ?? null,
    utm_medium: stored?.utm_medium ?? null,
    utm_campaign: stored?.utm_campaign ?? null,
    referrer_url: stored?.referrer_url ?? referrerUrl,
    session_id: getOrCreateSessionId(),
    visitor_fingerprint: getOrCreateVisitorFingerprint(),
    captured_at: stored?.captured_at ?? new Date().toISOString(),
  };

  current = ctx;
  return ctx;
}

/** Test-only: reset the module singleton. */
export function __resetAttributionForTests(): void {
  current = null;
}
