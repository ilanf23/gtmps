import { useEffect, useState } from "react";
import { opsGet, opsDownloadCsv } from "@/lib/opsClient";

interface EmailRow {
  email: string;
  source_event: string;
  source_slug: string | null;
  captured_at: string;
  consented_marketing: boolean;
  email_domain: string | null;
}

interface EmailsData {
  rows: EmailRow[];
  total: number;
  unique_emails: number;
  consented: number;
  page: number;
  pageSize: number;
}

const SOURCE_OPTIONS = [
  "assess_form",
  "save_map",
  "save_map_legacy",
  "share_self",
  "share_recipient",
  "exit_intent",
  "booking",
  "manual",
];

interface EmailsTabProps {
  refreshNonce: number;
  onUnauth: () => void;
}

export function EmailsTab({ refreshNonce, onUnauth }: EmailsTabProps) {
  const [data, setData] = useState<EmailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [domain, setDomain] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [exporting, setExporting] = useState(false);

  const filterParams = {
    q: q || undefined,
    domain: domain || undefined,
    from: from || undefined,
    to: to || undefined,
    source: sources.length ? sources : undefined,
    page: String(page),
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);
    opsGet<EmailsData>("/ops-emails", filterParams)
      .then((d) => !cancelled && setData(d))
      .catch((e) => {
        if (cancelled) return;
        if (e?.status === 401) onUnauth();
        else setErr(String(e?.message ?? e));
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, domain, from, to, sources.join(","), page, refreshNonce]);

  function toggleSource(s: string) {
    setPage(0);
    setSources((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }

  async function handleExport() {
    setExporting(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      await opsDownloadCsv(
        "/ops-emails-export",
        { ...filterParams, page: undefined },
        `emails-export-${today}.csv`,
      );
    } catch (e) {
      setErr(String((e as Error)?.message ?? e));
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
        <div className="flex flex-wrap gap-2 text-xs">
          {SOURCE_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => toggleSource(s)}
              className={`px-2 py-1 rounded border transition-colors ${
                sources.includes(s)
                  ? "border-zinc-600 bg-zinc-800 text-zinc-100"
                  : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <input value={q} onChange={(e) => { setPage(0); setQ(e.target.value); }} placeholder="search email" className="rounded bg-zinc-900 border border-zinc-800 px-2 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600" />
          <input value={domain} onChange={(e) => { setPage(0); setDomain(e.target.value); }} placeholder="domain (acme.com)" className="rounded bg-zinc-900 border border-zinc-800 px-2 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600" />
          <input type="date" value={from} onChange={(e) => { setPage(0); setFrom(e.target.value); }} className="rounded bg-zinc-900 border border-zinc-800 px-2 py-1.5 text-xs text-zinc-100" />
          <input type="date" value={to} onChange={(e) => { setPage(0); setTo(e.target.value); }} className="rounded bg-zinc-900 border border-zinc-800 px-2 py-1.5 text-xs text-zinc-100" />
        </div>
      </div>

      {data && (
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            {data.unique_emails.toLocaleString()} unique emails across {data.total.toLocaleString()} capture events. {data.consented} opted into marketing.
          </span>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="rounded border border-zinc-700 bg-zinc-900 text-zinc-200 px-3 py-1.5 hover:bg-zinc-800 disabled:opacity-40"
          >
            {exporting ? "exporting…" : "Download CSV"}
          </button>
        </div>
      )}

      {err && <div className="text-sm text-red-400">{err}</div>}

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-3 py-2 font-medium">Email</th>
              <th className="text-left px-3 py-2 font-medium">Source</th>
              <th className="text-left px-3 py-2 font-medium">Slug</th>
              <th className="text-left px-3 py-2 font-medium">Captured</th>
              <th className="text-left px-3 py-2 font-medium">Domain</th>
              <th className="text-left px-3 py-2 font-medium">Marketing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading ? (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-zinc-500">loading…</td></tr>
            ) : !data || data.rows.length === 0 ? (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-zinc-500">no emails captured</td></tr>
            ) : (
              data.rows.map((r, i) => (
                <tr key={i} className="hover:bg-zinc-900/60">
                  <td className="px-3 py-2 text-zinc-200">{r.email}</td>
                  <td className="px-3 py-2 text-zinc-400 text-xs font-mono">{r.source_event}</td>
                  <td className="px-3 py-2 text-zinc-500 text-xs font-mono">{r.source_slug ?? "—"}</td>
                  <td className="px-3 py-2 text-zinc-500 text-xs">{new Date(r.captured_at).toLocaleString()}</td>
                  <td className="px-3 py-2 text-zinc-400 text-xs">{r.email_domain ?? "—"}</td>
                  <td className="px-3 py-2 text-xs">{r.consented_marketing ? "yes" : "no"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500">
        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="rounded border border-zinc-800 px-3 py-1 hover:bg-zinc-900 disabled:opacity-40">← Prev</button>
        <span>page {page + 1}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={!data || (page + 1) * (data.pageSize ?? 100) >= data.total} className="rounded border border-zinc-800 px-3 py-1 hover:bg-zinc-900 disabled:opacity-40">Next →</button>
      </div>
    </div>
  );
}
