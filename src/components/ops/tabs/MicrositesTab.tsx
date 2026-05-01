import { useEffect, useState } from "react";
import { opsGet } from "@/lib/opsClient";

interface MicrositeRow {
  slug: string;
  firm_name: string | null;
  first_name: string | null;
  role: string | null;
  website_url: string | null;
  vertical: string | null;
  status: string;
  created_at: string;
  view_count: number;
  last_viewed_at: string | null;
  share_count: number;
  email_count: number;
  booking_at: string | null;
  enrichment_error: string | null;
}

interface DetailData {
  submission: Record<string, unknown> | null;
  breakdown: Record<string, unknown> | null;
  views: Array<Record<string, unknown>>;
  shares: Array<Record<string, unknown>>;
  emails: Array<Record<string, unknown>>;
  booking: Record<string, unknown> | null;
}

interface MicrositesTabProps {
  refreshNonce: number;
  onUnauth: () => void;
}

const PROJECT_REF = (import.meta.env.VITE_SUPABASE_PROJECT_ID as string | undefined) ?? "";

function relTime(iso: string | null): string {
  if (!iso) return "never";
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (d < 60) return `${d}s ago`;
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

export function MicrositesTab({ refreshNonce, onUnauth }: MicrositesTabProps) {
  const [rows, setRows] = useState<MicrositeRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [detail, setDetail] = useState<DetailData | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);
    opsGet<{ rows: MicrositeRow[]; total: number }>("/ops-microsites", { q, page: String(page) })
      .then((d) => {
        if (cancelled) return;
        setRows(d.rows);
        setTotal(d.total);
      })
      .catch((e) => {
        if (cancelled) return;
        if (e?.status === 401) onUnauth();
        else setErr(String(e?.message ?? e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [q, page, refreshNonce, onUnauth]);

  function toggleRow(slug: string) {
    if (expanded === slug) {
      setExpanded(null);
      setDetail(null);
      return;
    }
    setExpanded(slug);
    setDetail(null);
    setDetailLoading(true);
    opsGet<DetailData>("/ops-microsite-detail", { slug })
      .then(setDetail)
      .catch((e) => {
        if (e?.status === 401) onUnauth();
      })
      .finally(() => setDetailLoading(false));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          value={q}
          onChange={(e) => {
            setPage(0);
            setQ(e.target.value);
          }}
          placeholder="search slug, firm, or website"
          className="flex-1 max-w-md rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
        />
        <span className="text-xs text-zinc-500">{total.toLocaleString()} total</span>
      </div>

      {err && <div className="text-sm text-red-400">{err}</div>}

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-3 py-2 font-medium">Slug</th>
              <th className="text-left px-3 py-2 font-medium">Firm</th>
              <th className="text-left px-3 py-2 font-medium">Created</th>
              <th className="text-left px-3 py-2 font-medium">Status</th>
              <th className="text-right px-3 py-2 font-medium">Views</th>
              <th className="text-left px-3 py-2 font-medium">Last view</th>
              <th className="text-right px-3 py-2 font-medium">Shares</th>
              <th className="text-right px-3 py-2 font-medium">Emails</th>
              <th className="text-left px-3 py-2 font-medium">Booking</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading && rows.length === 0 ? (
              <tr><td colSpan={9} className="px-3 py-6 text-center text-zinc-500">loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={9} className="px-3 py-6 text-center text-zinc-500">no microsites</td></tr>
            ) : (
              rows.map((r) => (
                <RowGroup key={r.slug} row={r} expanded={expanded === r.slug} onToggle={() => toggleRow(r.slug)} detail={expanded === r.slug ? detail : null} detailLoading={expanded === r.slug && detailLoading} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="rounded border border-zinc-800 px-3 py-1 hover:bg-zinc-900 disabled:opacity-40"
        >
          ← Prev
        </button>
        <span>page {page + 1}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={(page + 1) * 50 >= total}
          className="rounded border border-zinc-800 px-3 py-1 hover:bg-zinc-900 disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function RowGroup({
  row,
  expanded,
  onToggle,
  detail,
  detailLoading,
}: {
  row: MicrositeRow;
  expanded: boolean;
  onToggle: () => void;
  detail: DetailData | null;
  detailLoading: boolean;
}) {
  return (
    <>
      <tr className="hover:bg-zinc-900/60 cursor-pointer" onClick={onToggle}>
        <td className="px-3 py-2 font-mono text-xs text-zinc-300">
          <a href={`/m/${row.slug}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-zinc-100 underline-offset-2 hover:underline">
            {row.slug}
          </a>
        </td>
        <td className="px-3 py-2 text-zinc-300">{row.firm_name ?? "—"}</td>
        <td className="px-3 py-2 text-zinc-500 text-xs">{relTime(row.created_at)}</td>
        <td className="px-3 py-2">
          <StatusPill status={row.status} hasError={!!row.enrichment_error} />
        </td>
        <td className="px-3 py-2 text-right text-zinc-300">{row.view_count}</td>
        <td className="px-3 py-2 text-zinc-500 text-xs">{relTime(row.last_viewed_at)}</td>
        <td className="px-3 py-2 text-right text-zinc-300">{row.share_count}</td>
        <td className="px-3 py-2 text-right text-zinc-300">{row.email_count}</td>
        <td className="px-3 py-2 text-zinc-500 text-xs">{row.booking_at ? new Date(row.booking_at).toLocaleString() : "—"}</td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={9} className="bg-zinc-950 px-4 py-4 border-t border-zinc-800">
            {detailLoading ? (
              <div className="text-xs text-zinc-500">loading detail…</div>
            ) : detail ? (
              <DetailPanel slug={row.slug} detail={detail} />
            ) : (
              <div className="text-xs text-zinc-500">no detail</div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

function StatusPill({ status, hasError }: { status: string; hasError: boolean }) {
  const colors: Record<string, string> = {
    complete: "bg-green-950 text-green-400 border-green-900",
    pending: "bg-amber-950 text-amber-400 border-amber-900",
    error: "bg-red-950 text-red-400 border-red-900",
  };
  const cls = hasError ? colors.error : (colors[status] ?? "bg-zinc-900 text-zinc-400 border-zinc-800");
  return <span className={`inline-block text-xs px-2 py-0.5 rounded border ${cls}`}>{hasError ? "error" : status}</span>;
}

function DetailPanel({ slug, detail }: { slug: string; detail: DetailData }) {
  const supabaseLink = PROJECT_REF
    ? `https://supabase.com/dashboard/project/${PROJECT_REF}/editor`
    : null;
  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h3 className="text-zinc-400 mb-2 uppercase tracking-wider">Recent views ({detail.views.length})</h3>
          {detail.views.length === 0 ? (
            <div className="text-zinc-600">no views recorded yet (pixel ships in Phase 2)</div>
          ) : (
            <ul className="space-y-1 font-mono">
              {detail.views.slice(0, 10).map((v, i) => (
                <li key={i} className="text-zinc-400">
                  {String(v.viewed_at).slice(0, 19)} · {String(v.referrer_url ?? "direct").slice(0, 40)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-zinc-400 mb-2 uppercase tracking-wider">Recent shares ({detail.shares.length})</h3>
          {detail.shares.length === 0 ? (
            <div className="text-zinc-600">no shares yet</div>
          ) : (
            <ul className="space-y-1 font-mono">
              {detail.shares.slice(0, 10).map((s, i) => (
                <li key={i} className="text-zinc-400">
                  {String(s.created_at).slice(0, 19)} · {String(s.channel ?? "?")}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <details className="rounded border border-zinc-800 bg-zinc-900/50 p-3">
        <summary className="cursor-pointer text-zinc-300 select-none">Full breakdown_data</summary>
        <pre className="mt-2 overflow-auto text-zinc-400 whitespace-pre-wrap break-words max-h-96">
{JSON.stringify(detail.breakdown, null, 2)}
        </pre>
      </details>
      <details className="rounded border border-zinc-800 bg-zinc-900/50 p-3">
        <summary className="cursor-pointer text-zinc-300 select-none">Full submission</summary>
        <pre className="mt-2 overflow-auto text-zinc-400 whitespace-pre-wrap break-words max-h-96">
{JSON.stringify(detail.submission, null, 2)}
        </pre>
      </details>
      {supabaseLink && (
        <a href={supabaseLink} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-300 underline">
          Open backend tables for raw inspection ({slug})
        </a>
      )}
    </div>
  );
}
