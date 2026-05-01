// CSV export of the same email set, applying the same filters as ops-emails.
import { createClient } from "npm:@supabase/supabase-js@2";
import { opsCorsHeaders, opsJson, requireOpsAuth } from "../_shared/ops-auth.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: opsCorsHeaders });
  const authFail = requireOpsAuth(req);
  if (authFail) return authFail;

  try {
    const url = new URL(req.url);
    const sourceFilter = url.searchParams.getAll("source");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const domain = (url.searchParams.get("domain") ?? "").trim().toLowerCase();
    const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();

    const [primary, legacy] = await Promise.all([
      supabase.from("magnet_emails").select("*").order("captured_at", { ascending: false }).limit(50000),
      supabase.from("magnet_map_emails").select("email, slug, created_at").order("created_at", { ascending: false }).limit(50000),
    ]);

    type Row = {
      email: string;
      source_event: string;
      source_slug: string | null;
      captured_at: string;
      consented_marketing: boolean;
      email_domain: string | null;
    };
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

    const header = "email,source_event,source_slug,captured_at,consented_marketing,email_domain\n";
    const body = filtered
      .map((r) =>
        [r.email, r.source_event, r.source_slug, r.captured_at, r.consented_marketing, r.email_domain]
          .map(csvEscape)
          .join(","),
      )
      .join("\n");

    const today = new Date().toISOString().slice(0, 10);
    return new Response(header + body, {
      status: 200,
      headers: {
        ...opsCorsHeaders,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="emails-export-${today}.csv"`,
      },
    });
  } catch (e) {
    console.error("ops-emails-export error", e);
    return opsJson({ error: "internal error" }, 500);
  }
});
