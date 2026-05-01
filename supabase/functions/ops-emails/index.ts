// Email list with filters. Unions magnet_emails + legacy magnet_map_emails so day-1 has data.
import { createClient } from "npm:@supabase/supabase-js@2";
import { opsCorsHeaders, opsJson, requireOpsAuth } from "../_shared/ops-auth.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

interface Row {
  email: string;
  source_event: string;
  source_slug: string | null;
  captured_at: string;
  consented_marketing: boolean;
  email_domain: string | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: opsCorsHeaders });
  const authFail = requireOpsAuth(req);
  if (authFail) return authFail;

  try {
    const url = new URL(req.url);
    const sourceFilter = url.searchParams.getAll("source"); // multi
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const domain = (url.searchParams.get("domain") ?? "").trim().toLowerCase();
    const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
    const page = Math.max(0, parseInt(url.searchParams.get("page") ?? "0", 10));
    const pageSize = Math.min(500, Math.max(10, parseInt(url.searchParams.get("pageSize") ?? "100", 10)));

    // Pull both sources, union in memory. Volume is expected to be small for v1.
    const [primary, legacy] = await Promise.all([
      supabase.from("magnet_emails").select("*").order("captured_at", { ascending: false }).limit(5000),
      supabase.from("magnet_map_emails").select("email, slug, vertical, created_at").order("created_at", { ascending: false }).limit(5000),
    ]);

    const rows: Row[] = [];
    for (const r of primary.data ?? []) {
      rows.push({
        email: r.email,
        source_event: r.source_event,
        source_slug: r.source_slug,
        captured_at: r.captured_at,
        consented_marketing: !!r.consented_marketing,
        email_domain: r.email_domain ?? r.email?.split("@")[1] ?? null,
      });
    }
    for (const r of legacy.data ?? []) {
      rows.push({
        email: r.email,
        source_event: "save_map_legacy",
        source_slug: r.slug,
        captured_at: r.created_at,
        consented_marketing: false,
        email_domain: r.email?.split("@")[1] ?? null,
      });
    }

    let filtered = rows;
    if (sourceFilter.length) filtered = filtered.filter((r) => sourceFilter.includes(r.source_event));
    if (from) filtered = filtered.filter((r) => r.captured_at >= from);
    if (to) filtered = filtered.filter((r) => r.captured_at <= to);
    if (domain) filtered = filtered.filter((r) => (r.email_domain ?? "").toLowerCase().includes(domain));
    if (q) filtered = filtered.filter((r) => r.email.toLowerCase().includes(q));

    filtered.sort((a, b) => (a.captured_at < b.captured_at ? 1 : -1));

    const uniqueEmails = new Set(filtered.map((r) => r.email)).size;
    const consented = filtered.filter((r) => r.consented_marketing).length;

    const total = filtered.length;
    const slice = filtered.slice(page * pageSize, page * pageSize + pageSize);

    return opsJson({
      rows: slice,
      total,
      unique_emails: uniqueEmails,
      consented,
      page,
      pageSize,
    });
  } catch (e) {
    console.error("ops-emails error", e);
    return opsJson({ error: "internal error" }, 500);
  }
});
