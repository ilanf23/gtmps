import { useEffect, useMemo, useState } from "react";
import { call, opsGet } from "@/lib/opsClient";

interface RefCodeRow {
  code: string;
  label: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  destination_path: string;
  notes: string | null;
  suppress_slack: boolean;
  archived_at: string | null;
  created_at: string;
  clicks: number;
  unique_clicks: number;
  maps_created: number;
  conversion_rate: number;
  last_activity_at: string | null;
}

interface ListResp { rows: RefCodeRow[] }

interface DetailResp {
  submissions: Array<{ slug: string; website_url: string; first_name: string | null; status: string; created_at: string; vertical: string | null }>;
  clicks: Array<{ clicked_at: string; landing_path: string | null; visitor_fingerprint: string | null; referrer_url: string | null }>;
}

interface Props { refreshNonce: number; onUnauth: () => void }

function origin(): string {
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return "https://discover.mabbly.com";
}

function buildUrl(row: RefCodeRow): string {
  try {
    const u = new URL((row.destination_path || "/").startsWith("/") ? origin() + (row.destination_path || "/") : row.destination_path);
    u.searchParams.set("ref", row.code);
    if (row.utm_source) u.searchParams.set("utm_source", row.utm_source);
    if (row.utm_medium) u.searchParams.set("utm_medium", row.utm_medium);
    if (row.utm_campaign) u.searchParams.set("utm_campaign", row.utm_campaign);
    return u.toString();
  } catch {
    return "";
  }
}

function relative(date: string | null): string {
  if (!date) return ",";
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function ReferralsTab({ refreshNonce, onUnauth }: Props) {
  const [data, setData] = useState<ListResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [detailCode, setDetailCode] = useState<string | null>(null);
  const [detail, setDetail] = useState<DetailResp | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Form
  const [form, setForm] = useState({
    code: "", label: "", utm_source: "", utm_medium: "", utm_campaign: "",
    destination_path: "/", notes: "", suppress_slack: false,
  });
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);
    opsGet<ListResp>("/ops-referrals")
      .then((d) => !cancelled && setData(d))
      .catch((e) => {
        if (cancelled) return;
        if (e?.status === 401) onUnauth();
        else setErr(String(e?.message ?? e));
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [refreshNonce, onUnauth, reloadKey]);

  useEffect(() => {
    if (!detailCode) { setDetail(null); return; }
    let cancelled = false;
    opsGet<DetailResp>("/ops-referrals", { code: detailCode })
      .then((d) => !cancelled && setDetail(d))
      .catch((e) => {
        if (cancelled) return;
        if (e?.status === 401) onUnauth();
      });
    return () => { cancelled = true; };
  }, [detailCode, onUnauth, reloadKey]);

  const sortedRows = useMemo(() => {
    if (!data?.rows) return [];
    return [...data.rows].sort((a, b) => {
      if (!!a.archived_at !== !!b.archived_at) return a.archived_at ? 1 : -1;
      return (b.last_activity_at ?? "").localeCompare(a.last_activity_at ?? "");
    });
  }, [data]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveErr(null);
    try {
      const res = await call("/ops-referrals", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (res.status === 401) { onUnauth(); return; }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setSaveErr(j.error || `failed (${res.status})`);
        return;
      }
      setForm({ code: "", label: "", utm_source: "", utm_medium: "", utm_campaign: "", destination_path: "/", notes: "", suppress_slack: false });
      setReloadKey((k) => k + 1);
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (code: string, archived: boolean) => {
    const res = await call("/ops-referrals", { method: "PATCH", body: JSON.stringify({ code, archived }) });
    if (res.ok) setReloadKey((k) => k + 1);
  };

  const copy = async (code: string, url: string) => {
    try { await navigator.clipboard.writeText(url); setCopiedCode(code); setTimeout(() => setCopiedCode(null), 1500); } catch { /* ignore */ }
  };

  return (
    <div className="space-y-4">
      {/* Create form */}
      <section className="rounded-lg border border-[#22332F] bg-[#1A2B2A] p-4">
        <h2 className="text-sm font-medium text-[#EDF5EC] mb-1">Create referral link</h2>
        <p className="text-[11px] text-[#A1A9A0] mb-4">
          Each code gets its own trackable URL. When someone clicks the link
          and creates a new map, that map is attributed to this code. You can
          drill in to see the firms that came from each link.
        </p>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Code (URL slug)" value={form.code} onChange={(v) => setForm({ ...form, code: v.toLowerCase().replace(/[^a-z0-9_-]/g, "") })} placeholder="adam-li-dm" required mono />
          <Input label="Label (your name for it)" value={form.label} onChange={(v) => setForm({ ...form, label: v })} placeholder="Adam LinkedIn DM, May" required />
          <Input label="UTM source" value={form.utm_source} onChange={(v) => setForm({ ...form, utm_source: v })} placeholder="linkedin" mono />
          <Input label="UTM medium" value={form.utm_medium} onChange={(v) => setForm({ ...form, utm_medium: v })} placeholder="dm" mono />
          <Input label="UTM campaign" value={form.utm_campaign} onChange={(v) => setForm({ ...form, utm_campaign: v })} placeholder="may-launch" mono />
          <Input label="Destination path" value={form.destination_path} onChange={(v) => setForm({ ...form, destination_path: v })} placeholder="/" mono />
          <div className="md:col-span-2">
            <Input label="Notes (optional)" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} placeholder="Sent to 50 partners on May 5" />
          </div>
          <label className="md:col-span-2 flex items-center gap-2 text-[12px] text-[#A1A9A0]">
            <input type="checkbox" checked={form.suppress_slack} onChange={(e) => setForm({ ...form, suppress_slack: e.target.checked })} />
            Suppress Slack notification when a map is created via this link
          </label>
          <div className="md:col-span-2 flex items-center gap-3">
            <button type="submit" disabled={saving || !form.code || !form.label} className="inline-flex items-center gap-2 rounded border border-[#FFBA1A] bg-[#352B0E] px-4 h-9 text-[12px] text-[#FFBA1A] hover:bg-[#4A3A12] disabled:opacity-50 transition-colors">
              {saving ? "Creating…" : "Create link"}
            </button>
            {saveErr && <span className="text-[12px] text-[#C02B0A]">{saveErr}</span>}
          </div>
        </form>
      </section>

      {/* Codes table */}
      <section className="rounded-lg border border-[#22332F] bg-[#1A2B2A] p-4">
        <h2 className="text-sm font-medium text-[#EDF5EC] mb-3">Referral links</h2>
        {loading && <div className="text-[#A1A9A0] text-sm">loading…</div>}
        {err && <div className="text-[#C02B0A] text-sm">{err}</div>}
        {!loading && !err && sortedRows.length === 0 && (
          <div className="text-[12px] text-[#A1A9A0]">No referral links yet. Create one above.</div>
        )}
        {!loading && sortedRows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[#A1A9A0] uppercase tracking-wider">
                <tr>
                  <th className="text-left px-2 py-1 font-medium">Code</th>
                  <th className="text-left px-2 py-1 font-medium">Label</th>
                  <th className="text-right px-2 py-1 font-medium">Clicks</th>
                  <th className="text-right px-2 py-1 font-medium">Unique</th>
                  <th className="text-right px-2 py-1 font-medium">Maps</th>
                  <th className="text-right px-2 py-1 font-medium">CR</th>
                  <th className="text-left px-2 py-1 font-medium">Last activity</th>
                  <th className="text-left px-2 py-1 font-medium">Link</th>
                  <th className="text-left px-2 py-1 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#22332F]">
                {sortedRows.map((r) => {
                  const url = buildUrl(r);
                  return (
                    <tr key={r.code} className={r.archived_at ? "opacity-50" : ""}>
                      <td className="px-2 py-1 font-mono text-[#FFBA1A]">{r.code}</td>
                      <td className="px-2 py-1 text-[#EDF5EC]">
                        {r.label}
                        {r.suppress_slack && <span className="ml-1 text-[10px] text-[#A1A9A0]">(no slack)</span>}
                      </td>
                      <td className="px-2 py-1 text-right text-[#EDF5EC]">{r.clicks}</td>
                      <td className="px-2 py-1 text-right text-[#EDF5EC]">{r.unique_clicks}</td>
                      <td className="px-2 py-1 text-right text-[#EDF5EC]">{r.maps_created}</td>
                      <td className="px-2 py-1 text-right text-[#FFBA1A]">{(r.conversion_rate * 100).toFixed(1)}%</td>
                      <td className="px-2 py-1 text-[#A1A9A0]">{relative(r.last_activity_at)}</td>
                      <td className="px-2 py-1">
                        <button type="button" onClick={() => copy(r.code, url)} className="font-mono text-[11px] text-[#A1A9A0] hover:text-[#FFBA1A] truncate max-w-[260px]" title={url}>
                          {copiedCode === r.code ? "Copied!" : url.replace(/^https?:\/\//, "")}
                        </button>
                      </td>
                      <td className="px-2 py-1">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setDetailCode(r.code)} className="text-[11px] text-[#A1A9A0] hover:text-[#EDF5EC]">View</button>
                          <button type="button" onClick={() => handleArchive(r.code, !r.archived_at)} className="text-[11px] text-[#A1A9A0] hover:text-[#EDF5EC]">{r.archived_at ? "Unarchive" : "Archive"}</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Detail drawer (inline) */}
      {detailCode && (
        <section className="rounded-lg border border-[#FFBA1A] bg-[#1A2B2A] p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-[#FFBA1A]">
              {detailCode}: maps & clicks
            </h2>
            <button type="button" onClick={() => setDetailCode(null)} className="text-[11px] text-[#A1A9A0] hover:text-[#EDF5EC]">Close</button>
          </div>
          {!detail && <div className="text-[#A1A9A0] text-sm">loading…</div>}
          {detail && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[11px] uppercase tracking-wider text-[#A1A9A0] mb-2">Maps created ({detail.submissions.length})</h3>
                {detail.submissions.length === 0 && <div className="text-[12px] text-[#A1A9A0]">None yet.</div>}
                <ul className="space-y-1">
                  {detail.submissions.map((s) => (
                    <li key={s.slug} className="text-[12px]">
                      <a href={`/m/${s.slug}`} target="_blank" rel="noreferrer" className="font-mono text-[#FFBA1A] hover:underline">/m/{s.slug}</a>
                      <span className="text-[#A1A9A0]"> · {new URL(s.website_url).hostname.replace(/^www\./, "")} · {s.status} · {relative(s.created_at)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[11px] uppercase tracking-wider text-[#A1A9A0] mb-2">Recent clicks ({detail.clicks.length})</h3>
                <ul className="space-y-1 max-h-[400px] overflow-y-auto">
                  {detail.clicks.slice(0, 100).map((c, i) => (
                    <li key={i} className="text-[11px] text-[#A1A9A0]">
                      {relative(c.clicked_at)} · <span className="font-mono">{c.landing_path ?? "/"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, required, mono }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; mono?: boolean }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-wider text-[#A1A9A0] mb-1">{label}{required && " *"}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`w-full rounded border border-[#22332F] bg-[#0F1E1D] px-3 py-2 text-[13px] text-[#EDF5EC] focus:outline-none focus:border-[#FFBA1A] ${mono ? "font-mono" : ""}`}
      />
    </label>
  );
}
