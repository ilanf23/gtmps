// Shared auth helper for the EDITH ops dashboard edge functions.
// Single-password gate. Constant-time compare against OPS_DASHBOARD_PASSWORD.

export const opsCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export const opsJson = (body: unknown, status = 200, extraHeaders: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...opsCorsHeaders, "Content-Type": "application/json", ...extraHeaders },
  });

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Returns null if authorized. Otherwise returns a Response that should be
 * returned immediately by the caller.
 */
export function requireOpsAuth(req: Request): Response | null {
  const expected = Deno.env.get("OPS_DASHBOARD_PASSWORD");
  if (!expected) {
    return opsJson({ error: "ops dashboard not configured" }, 503);
  }
  const header = req.headers.get("Authorization") ?? req.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  const token = match ? match[1] : "";
  if (!token || !constantTimeEqual(token, expected)) {
    return opsJson({ error: "unauthorized" }, 401);
  }
  return null;
}
