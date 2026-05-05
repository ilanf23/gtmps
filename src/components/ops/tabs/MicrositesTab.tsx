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
const PAGE_SIZE = 50;

function relTime(iso: string | null): string {
  if (!iso) return ",";
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (d < 60) return `${d}s ago`;
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

function initials(row: MicrositeRow): string {
  const source = row.firm_name ?? row.first_name ?? row.slug;
  const parts = source.split(/\s+|-|_/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

function avatarColor(seed: string): string {
  const palette = ["#225351", "#BF461A", "#A79014", "#803402", "#5A8A4E"];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
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

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A9A0] text-[12px]">⌕</span>
          <input
            value={q}
            onChange={(e) => {
              setPage(0);
              setQ(e.target.value);
            }}
            placeholder="Find by slug, firm, or website…"
            className="w-full rounded-lg bg-[#1A2B2A] border border-[#22332F] pl-9 pr-3 h-9 text-[13px] text-[#EDF5EC] placeholder:text-[#6E7A72] focus:outline-none focus:border-[#FFBA1A] transition-colors"
          />
        </div>
        <span className="text-[11px] text-[#A1A9A0]">
          {total.toLocaleString()} total
        </span>
        <div className="flex-1" />
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-[#BF461A] hover:bg-[#A23A14] px-4 h-9 text-[11px] font-black tracking-[0.14em] uppercase text-[#EDF5EC] transition-colors disabled:opacity-50"
          onClick={() => window.open("/assess", "_blank", "noreferrer")}
        >
          <span aria-hidden>+</span>
          Generate new
        </button>
      </div>

      {err && (
        <div className="rounded-md border border-[#C02B0A] bg-[#2A1414] px-3 py-2 text-[12px] text-[#EDF5EC]">
          {err}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-[#22332F] bg-[#1A2B2A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-[#152523] sticky top-0">
              <tr className="border-b border-[#22332F]">
                <Th>Recipient</Th>
                <Th>Firm</Th>
                <Th>Status</Th>
                <Th>Created</Th>
                <Th align="right">Views</Th>
                <Th>Last view</Th>
                <Th align="right">Shares</Th>
                <Th align="right">Emails</Th>
                <Th>Booked</Th>
              </tr>
            </thead>
            <tbody>
              {loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-[#A1A9A0] text-[12px]">
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-[#A1A9A0] text-[12px]">
                    No microsites match.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <RowGroup
                    key={r.slug}
                    row={r}
                    expanded={expanded === r.slug}
                    onToggle={() => toggleRow(r.slug)}
                    detail={expanded === r.slug ? detail : null}
                    detailLoading={expanded === r.slug && detailLoading}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-[11px] text-[#A1A9A0]">
        <span>
          Showing {rows.length} of {total.toLocaleString()}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous page"
            className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[#22332F] bg-[#1A2B2A] text-[#EDF5EC] hover:bg-[#22332F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ‹
          </button>
          <span className="font-mono text-[#EDF5EC]">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={(page + 1) * PAGE_SIZE >= total}
            aria-label="Next page"
            className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[#22332F] bg-[#1A2B2A] text-[#EDF5EC] hover:bg-[#22332F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-3 text-[10px] font-black tracking-[0.14em] uppercase text-[#A1A9A0] ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
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
  const av = avatarColor(row.slug);
  const recipient = row.first_name ?? ",";
  return (
    <>
      <tr
        className={`border-b border-[#22332F] cursor-pointer transition-colors ${
          expanded ? "bg-[#22332F]/40" : "hover:bg-[#22332F]/30"
        }`}
        onClick={onToggle}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-black shrink-0"
              style={{ background: av, color: "#EDF5EC" }}
            >
              {initials(row)}
            </span>
            <div className="min-w-0">
              <div className="text-[13px] text-[#EDF5EC] truncate">{recipient}</div>
              <a
                href={`/m/${row.slug}`}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] font-mono text-[#6E7A72] hover:text-[#FFBA1A] truncate"
              >
                /m/{row.slug}
              </a>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-[#EDF5EC]">{row.firm_name ?? ","}</td>
        <td className="px-4 py-3">
          <StatusPill status={row.status} hasError={!!row.enrichment_error} />
        </td>
        <td className="px-4 py-3 text-[11px] font-mono text-[#A1A9A0]">{relTime(row.created_at)}</td>
        <td className="px-4 py-3 text-right font-mono text-[13px] text-[#EDF5EC]">{row.view_count}</td>
        <td className="px-4 py-3 text-[11px] font-mono text-[#A1A9A0]">{relTime(row.last_viewed_at)}</td>
        <td className="px-4 py-3 text-right font-mono text-[13px] text-[#FFBA1A]">{row.share_count}</td>
        <td className="px-4 py-3 text-right font-mono text-[13px] text-[#EDF5EC]">{row.email_count}</td>
        <td className="px-4 py-3 text-[12px]">
          {row.booking_at ? (
            <span className="inline-flex items-center gap-1 text-[#5A8A4E]">
              <span aria-hidden>✓</span>
              {new Date(row.booking_at).toLocaleDateString()}
            </span>
          ) : (
            <span className="text-[#6E7A72]">,</span>
          )}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={9} className="bg-[#0F1E1D] px-6 py-5 border-b border-[#22332F]">
            {detailLoading ? (
              <div className="text-[12px] text-[#A1A9A0]">Loading detail…</div>
            ) : detail ? (
              <DetailPanel slug={row.slug} detail={detail} />
            ) : (
              <div className="text-[12px] text-[#A1A9A0]">No detail.</div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

function StatusPill({ status, hasError }: { status: string; hasError: boolean }) {
  const map: Record<string, { dot: string; border: string; bg: string; label: string }> = {
    complete: { dot: "#5A8A4E", border: "#5A8A4E", bg: "#1F3A28", label: "Complete" },
    pending: { dot: "#A79014", border: "#A79014", bg: "#352B0E", label: "Pending" },
    error: { dot: "#C02B0A", border: "#C02B0A", bg: "#2A1414", label: "Error" },
  };
  const key = hasError ? "error" : status;
  const m = map[key] ?? { dot: "#6E7A72", border: "#22332F", bg: "#22332F", label: status || "," };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[10px] font-black tracking-[0.1em] uppercase text-[#EDF5EC]"
      style={{ borderColor: m.border, background: m.bg }}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: m.dot }} />
      {m.label}
    </span>
  );
}

function DetailPanel({ slug, detail }: { slug: string; detail: DetailData }) {
  const supabaseLink = PROJECT_REF
    ? `https://supabase.com/dashboard/project/${PROJECT_REF}/editor`
    : null;
  return (
    <div className="space-y-4 text-[12px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-[#22332F] bg-[#1A2B2A] p-4">
          <h3 className="text-[10px] font-black tracking-[0.14em] uppercase text-[#A1A9A0] mb-3">
            Recent views ({detail.views.length})
          </h3>
          {detail.views.length === 0 ? (
            <div className="text-[#6E7A72]">No views recorded yet.</div>
          ) : (
            <ul className="space-y-1.5 font-mono">
              {detail.views.slice(0, 10).map((v, i) => (
                <li key={i} className="text-[#EDF5EC] text-[11px]">
                  <span className="text-[#A1A9A0]">{String(v.viewed_at).slice(0, 19)}</span>
                  <span className="text-[#6E7A72]"> · </span>
                  {String(v.referrer_url ?? "direct").slice(0, 40)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-lg border border-[#22332F] bg-[#1A2B2A] p-4">
          <h3 className="text-[10px] font-black tracking-[0.14em] uppercase text-[#A1A9A0] mb-3">
            Recent shares ({detail.shares.length})
          </h3>
          {detail.shares.length === 0 ? (
            <div className="text-[#6E7A72]">No shares yet.</div>
          ) : (
            <ul className="space-y-1.5 font-mono">
              {detail.shares.slice(0, 10).map((s, i) => (
                <li key={i} className="text-[#EDF5EC] text-[11px]">
                  <span className="text-[#A1A9A0]">{String(s.created_at).slice(0, 19)}</span>
                  <span className="text-[#6E7A72]"> · </span>
                  {String(s.channel ?? "?")}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <details className="rounded-lg border border-[#22332F] bg-[#1A2B2A] p-4">
        <summary className="cursor-pointer text-[#EDF5EC] select-none text-[11px] font-black tracking-[0.14em] uppercase">
          Full breakdown_data
        </summary>
        <pre className="mt-3 overflow-auto text-[#A1A9A0] whitespace-pre-wrap break-words max-h-96 text-[11px] font-mono">
{JSON.stringify(detail.breakdown, null, 2)}
        </pre>
      </details>
      <details className="rounded-lg border border-[#22332F] bg-[#1A2B2A] p-4">
        <summary className="cursor-pointer text-[#EDF5EC] select-none text-[11px] font-black tracking-[0.14em] uppercase">
          Full submission
        </summary>
        <pre className="mt-3 overflow-auto text-[#A1A9A0] whitespace-pre-wrap break-words max-h-96 text-[11px] font-mono">
{JSON.stringify(detail.submission, null, 2)}
        </pre>
      </details>
      {supabaseLink && (
        <a
          href={supabaseLink}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-[11px] text-[#A1A9A0] hover:text-[#FFBA1A] underline-offset-2 hover:underline"
        >
          Open backend tables for raw inspection ({slug}) →
        </a>
      )}
    </div>
  );
}
