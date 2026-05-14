// Paginated leads list from public.lead_signups, with filters + CSV export.
import { createClient } from "npm:@supabase/supabase-js@2";
import { opsCorsHeaders, opsJson, requireOpsAuth } from "../_shared/ops-auth.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: opsCorsHeaders });
  const authFail = requireOpsAuth(req);
  if (authFail) return authFail;

  try {
    const url = new URL(req.url);
    const isExport = url.searchParams.get("export") === "csv";
    const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
    const sourceFilter = url.searchParams.getAll("source");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const page = Math.max(0, parseInt(url.searchParams.get("page") ?? "0", 10));
    const pageSize = Math.min(500, Math.max(10, parseInt(url.searchParams.get("pageSize") ?? "100", 10)));

    let query = supabase.from("lead_signups").select("*", { count: "exact" }).order("created_at", { ascending: false });
    if (sourceFilter.length) query = query.in("source", sourceFilter);
    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);
    if (q) query = query.or(`email.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%,firm.ilike.%${q}%`);

    if (!isExport) {
      query = query.range(page * pageSize, page * pageSize + pageSize - 1);
    } else {
      query = query.limit(10000);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    if (isExport) {
      const csv = toCsv((data ?? []) as Record<string, unknown>[]);
      return new Response(csv, {
        status: 200,
        headers: {
          ...opsCorsHeaders,
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="leads-export-${new Date().toISOString().slice(0,10)}.csv"`,
        },
      });
    }

    // Aggregate quick stats across the whole filtered set (for header line).
    const allRows = data ?? [];
    const uniqueEmails = new Set(allRows.map((r) => String(r.email).toLowerCase())).size;
    const sourceCounts: Record<string, number> = {};
    for (const r of allRows) {
      const s = String(r.source ?? "unknown");
      sourceCounts[s] = (sourceCounts[s] ?? 0) + 1;
    }

    return opsJson({
      rows: allRows,
      total: count ?? 0,
      unique_emails_page: uniqueEmails,
      source_counts_page: sourceCounts,
      page,
      pageSize,
    });
  } catch (e) {
    console.error("ops-leads error", e);
    return opsJson({ error: "internal error" }, 500);
  }
});