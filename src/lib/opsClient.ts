// Tiny fetch wrapper for ops-* edge functions. Pulls password from sessionStorage
// and injects it as Authorization: Bearer <password>. The password never leaves
// sessionStorage (cleared on tab close or Sign Out).

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID as string | undefined;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const FUNCTIONS_BASE = SUPABASE_URL
  ? `${SUPABASE_URL}/functions/v1`
  : `https://${PROJECT_ID}.supabase.co/functions/v1`;

const STORAGE_KEY = "opsAuth";

export const opsAuth = {
  get: () => {
    try {
      return sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  },
  set: (pw: string) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, pw);
    } catch {
      /* ignore */
    }
  },
  clear: () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  },
};

export class OpsApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function call(path: string, init: RequestInit = {}): Promise<Response> {
  const pw = opsAuth.get();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  headers.set("apikey", ANON_KEY);
  if (pw) headers.set("Authorization", `Bearer ${pw}`);
  const res = await fetch(`${FUNCTIONS_BASE}${path}`, { ...init, headers });
  return res;
}

export async function opsLogin(password: string): Promise<{ ok: true } | { ok: false; status: number }> {
  const res = await fetch(`${FUNCTIONS_BASE}/ops-auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: ANON_KEY },
    body: JSON.stringify({ password }),
  });
  if (res.ok) {
    opsAuth.set(password);
    return { ok: true };
  }
  return { ok: false, status: res.status };
}

export async function opsGet<T>(path: string, params?: Record<string, string | string[] | undefined>): Promise<T> {
  const url = new URL(`${FUNCTIONS_BASE}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null || v === "") continue;
      if (Array.isArray(v)) {
        for (const item of v) url.searchParams.append(k, item);
      } else {
        url.searchParams.set(k, v);
      }
    }
  }
  const pw = opsAuth.get();
  const headers: Record<string, string> = { apikey: ANON_KEY };
  if (pw) headers["Authorization"] = `Bearer ${pw}`;
  const res = await fetch(url.toString(), { headers });
  if (res.status === 401) {
    opsAuth.clear();
    throw new OpsApiError("unauthorized", 401);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new OpsApiError(text || `request failed: ${res.status}`, res.status);
  }
  return (await res.json()) as T;
}

export function opsExportUrl(path: string, params?: Record<string, string | string[] | undefined>): string {
  // Returns a URL the browser can navigate to for CSV download.
  // Auth is via the password header, so we open via fetch -> blob below.
  const url = new URL(`${FUNCTIONS_BASE}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null || v === "") continue;
      if (Array.isArray(v)) for (const item of v) url.searchParams.append(k, item);
      else url.searchParams.set(k, v);
    }
  }
  return url.toString();
}

export async function opsDownloadCsv(path: string, params: Record<string, string | string[] | undefined>, filename: string): Promise<void> {
  const pw = opsAuth.get();
  const headers: Record<string, string> = { apikey: ANON_KEY };
  if (pw) headers["Authorization"] = `Bearer ${pw}`;
  const res = await fetch(opsExportUrl(path, params), { headers });
  if (!res.ok) throw new OpsApiError("export failed", res.status);
  const blob = await res.blob();
  const objUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objUrl);
}

export { call };
