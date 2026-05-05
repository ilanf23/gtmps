// First-touch referral attribution for the homepage / vertical landings.
//
// Reads ?ref= and ?utm_* on landing, persists the FIRST set seen per visitor
// to localStorage, fires a fire-and-forget click log to the `log-ref-click`
// edge function, and exposes the captured attribution to magnetSubmit.
//
// First-touch wins: subsequent landings with a different ?ref= are ignored
// until the visitor actually creates a map (after which we clear).

const KEY = "mabbly:ref:firstTouch";
const FP_KEY = "mabbly:magnet:fp"; // shared with magnetAttribution

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID as string | undefined;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const FUNCTIONS_BASE = SUPABASE_URL
  ? `${SUPABASE_URL}/functions/v1`
  : `https://${PROJECT_ID}.supabase.co/functions/v1`;

export interface RefAttribution {
  ref_code: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer_url: string | null;
  captured_at: string;
}

function safeGet(): RefAttribution | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (!p || typeof p !== "object") return null;
    return {
      ref_code: typeof p.ref_code === "string" ? p.ref_code : null,
      utm_source: typeof p.utm_source === "string" ? p.utm_source : null,
      utm_medium: typeof p.utm_medium === "string" ? p.utm_medium : null,
      utm_campaign: typeof p.utm_campaign === "string" ? p.utm_campaign : null,
      referrer_url: typeof p.referrer_url === "string" ? p.referrer_url : null,
      captured_at: typeof p.captured_at === "string" ? p.captured_at : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function safeSet(v: RefAttribution): void {
  try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* ignore */ }
}

function getFingerprint(): string | null {
  try { return localStorage.getItem(FP_KEY); } catch { return null; }
}

function trim(v: string | null | undefined): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

export function getRefAttribution(): RefAttribution | null {
  return safeGet();
}

/**
 * Read the URL on landing. If a ?ref= or ?utm_* is present and we have not
 * yet stored a first-touch, persist it. Then fire-and-forget log the click.
 * Idempotent: safe to call from a top-level effect on every page.
 */
export function captureRefFromUrl(): RefAttribution | null {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  const ref = trim(url.searchParams.get("ref"));
  const utmS = trim(url.searchParams.get("utm_source"));
  const utmM = trim(url.searchParams.get("utm_medium"));
  const utmC = trim(url.searchParams.get("utm_campaign"));

  let stored = safeGet();
  if (!stored && (ref || utmS || utmM || utmC)) {
    stored = {
      ref_code: ref,
      utm_source: utmS,
      utm_medium: utmM,
      utm_campaign: utmC,
      referrer_url: typeof document !== "undefined" ? trim(document.referrer) : null,
      captured_at: new Date().toISOString(),
    };
    safeSet(stored);
  }

  // Always log a click if the URL itself carried a ref (even if first-touch
  // belongs to an earlier code), so partner click counts stay accurate.
  if (ref) {
    void fetch(`${FUNCTIONS_BASE}/log-ref-click`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: ANON_KEY },
      body: JSON.stringify({
        code: ref,
        visitor_fingerprint: getFingerprint(),
        landing_path: window.location.pathname + window.location.search,
        referrer_url: typeof document !== "undefined" ? document.referrer || null : null,
      }),
    }).catch(() => { /* swallow */ });
  }

  return stored;
}

export function clearRefAttribution(): void {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
