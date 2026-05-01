// POST { password } -> { ok: true } or 401
import { opsCorsHeaders, opsJson } from "../_shared/ops-auth.ts";

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: opsCorsHeaders });
  if (req.method !== "POST") return opsJson({ error: "method not allowed" }, 405);

  const expected = Deno.env.get("OPS_DASHBOARD_PASSWORD");
  if (!expected) return opsJson({ error: "ops dashboard not configured" }, 503);

  let body: { password?: unknown };
  try {
    body = await req.json();
  } catch {
    return opsJson({ error: "invalid json" }, 400);
  }
  const password = typeof body.password === "string" ? body.password : "";
  if (!password || !constantTimeEqual(password, expected)) {
    return opsJson({ error: "unauthorized" }, 401);
  }
  return opsJson({ ok: true });
});
