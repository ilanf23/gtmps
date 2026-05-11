import { useEffect, useMemo, useState } from "react";
import { call, opsGet } from "@/lib/opsClient";
import { Copy, Check, ExternalLink, Archive, ArchiveRestore, BellOff, MousePointerClick, Users, Sparkles, ChevronDown, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [showAdvanced, setShowAdvanced] = useState(false);

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
        <h2 className="text-sm font-medium text-[#EDF5EC] mb-3">Create referral link</h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 items-end">
            <Input label="Code" hint="Short URL slug appended as ?ref=… on every link. Lowercase letters, numbers, hyphens. This is what shows up in attribution." value={form.code} onChange={(v) => setForm({ ...form, code: v.toLowerCase().replace(/[^a-z0-9_-]/g, "") })} placeholder="adam-li-dm" required mono />
            <Input label="Label" hint="Human-readable name only you see. Helps you remember which link is which when reviewing performance." value={form.label} onChange={(v) => setForm({ ...form, label: v })} placeholder="Adam LinkedIn DM, May" required />
            <button type="submit" disabled={saving || !form.code || !form.label} className="inline-flex items-center justify-center gap-2 rounded border border-[#FFBA1A] bg-[#352B0E] px-4 h-9 text-[12px] text-[#FFBA1A] hover:bg-[#4A3A12] disabled:opacity-50 transition-colors whitespace-nowrap">
              {saving ? "Creating…" : "Create link"}
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="inline-flex items-center gap-1 text-[11px] text-[#A1A9A0] hover:text-[#EDF5EC] transition-colors"
            >
              <ChevronDown size={12} className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
              {showAdvanced ? "Hide" : "Show"} advanced options
            </button>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[#22332F]">
              <Input label="UTM source" hint="Where the link was shared. Picked up by analytics tools like PostHog and GA. Examples: linkedin, twitter, newsletter." value={form.utm_source} onChange={(v) => setForm({ ...form, utm_source: v })} placeholder="linkedin" mono />
              <Input label="UTM medium" hint="The channel type. Examples: dm, email, social, cpc, organic." value={form.utm_medium} onChange={(v) => setForm({ ...form, utm_medium: v })} placeholder="dm" mono />
              <Input label="UTM campaign" hint="The campaign or push this link belongs to. Examples: may-launch, q2-newsletter, partner-blast." value={form.utm_campaign} onChange={(v) => setForm({ ...form, utm_campaign: v })} placeholder="may-launch" mono />
              <Input label="Destination path" hint="Page on the site the link should land on. Defaults to the homepage. Use a path like /book or /pepper-group." value={form.destination_path} onChange={(v) => setForm({ ...form, destination_path: v })} placeholder="/" mono />
              <div className="md:col-span-2">
                <Input label="Notes" hint="Private context for your team. Not shown to visitors." value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} placeholder="Sent to 50 partners on May 5" />
              </div>
              <label className="md:col-span-2 flex items-center gap-2 text-[12px] text-[#A1A9A0]" title="Skip the Slack ping when a map is created from this link. Useful for high-volume tests or internal links you don't want to be noisy.">
                <input type="checkbox" checked={form.suppress_slack} onChange={(e) => setForm({ ...form, suppress_slack: e.target.checked })} />
                Suppress Slack notification when a map is created via this link
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      title="Skip the Slack ping when a map is created from this link. Useful for high-volume tests or internal links you don't want to be noisy."
                      aria-label="Explain Slack suppression"
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#3D4D49] text-[#C8D1C7] transition-colors hover:border-[#FFBA1A]/60 hover:text-[#FFBA1A]"
                    >
                      <Info size={10} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[260px]">Skip the Slack ping when a map is created from this link. Useful for high-volume tests or internal links you don't want to be noisy.</TooltipContent>
                </Tooltip>
              </label>
            </div>
          )}

          {saveErr && <div className="text-[12px] text-[#C02B0A]">{saveErr}</div>}
        </form>
      </section>

      {/* Codes table */}
      {/* Codes grid */}
      <section>
        <div className="flex items-baseline justify-between mb-3 px-1">
          <h2 className="text-sm font-medium text-[#EDF5EC]">Referral links</h2>
          {!loading && sortedRows.length > 0 && (
            <span className="text-[11px] text-[#A1A9A0]">
              {sortedRows.filter((r) => !r.archived_at).length} active
              {sortedRows.some((r) => r.archived_at) && ` · ${sortedRows.filter((r) => r.archived_at).length} archived`}
            </span>
          )}
        </div>
        {loading && <div className="text-[#A1A9A0] text-sm px-1">loading…</div>}
        {err && <div className="text-[#C02B0A] text-sm px-1">{err}</div>}
        {!loading && !err && sortedRows.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#22332F] bg-[#1A2B2A]/40 px-4 py-8 text-center">
            <p className="text-[13px] text-[#EDF5EC] mb-1">No referral links yet</p>
            <p className="text-[11px] text-[#A1A9A0]">Create your first one above to start tracking attribution.</p>
          </div>
        )}
        {!loading && sortedRows.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {sortedRows.map((r) => {
              const url = buildUrl(r);
              const cr = r.conversion_rate * 100;
              const crColor =
                cr >= 50 ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                : cr >= 10 ? "text-[#FFBA1A] bg-[#FFBA1A]/10 border-[#FFBA1A]/20"
                : "text-[#A1A9A0] bg-[#A1A9A0]/5 border-[#22332F]";
              const isCopied = copiedCode === r.code;
              const isArchived = !!r.archived_at;
              const maxFunnel = Math.max(r.clicks, 1);
              const uniquePct = (r.unique_clicks / maxFunnel) * 100;
              const mapsPct = (r.maps_created / maxFunnel) * 100;
              return (
                <article
                  key={r.code}
                  className={`group relative rounded-lg border bg-[#1A2B2A] p-4 transition-colors ${
                    isArchived
                      ? "border-[#22332F]/60 opacity-60"
                      : "border-[#22332F] hover:border-[#FFBA1A]/40 hover:bg-[#1F302F]"
                  }`}
                >
                  {/* Header: code + CR pill */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0">
                      <div className="font-mono text-[15px] text-[#FFBA1A] truncate">{r.code}</div>
                      <div className="text-[12px] text-[#EDF5EC] truncate mt-0.5">{r.label}</div>
                    </div>
                    <span className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-mono ${crColor}`}>
                      {cr.toFixed(1)}%
                    </span>
                  </div>

                  {/* Meta strip */}
                  <div className="flex items-center gap-2 text-[10px] text-[#A1A9A0] mb-3">
                    <span>{relative(r.last_activity_at)}</span>
                    {r.suppress_slack && (
                      <>
                        <span className="opacity-40">·</span>
                        <span className="inline-flex items-center gap-1"><BellOff size={10} /> no slack</span>
                      </>
                    )}
                    {isArchived && (
                      <>
                        <span className="opacity-40">·</span>
                        <span>archived</span>
                      </>
                    )}
                  </div>

                  {/* Funnel */}
                  <div className="space-y-2 mb-4">
                    <FunnelRow icon={<MousePointerClick size={11} />} label="Clicks" value={r.clicks} pct={100} />
                    <FunnelRow icon={<Users size={11} />} label="Unique" value={r.unique_clicks} pct={uniquePct} />
                    <FunnelRow icon={<Sparkles size={11} />} label="Maps" value={r.maps_created} pct={mapsPct} highlight />
                  </div>

                  {/* Link + actions */}
                  <div className="flex items-center gap-1.5 pt-3 border-t border-[#22332F]">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => copy(r.code, url)}
                          className="flex-1 inline-flex items-center gap-1.5 rounded border border-[#22332F] bg-[#0F1E1D] px-2 h-7 text-[11px] text-[#A1A9A0] hover:text-[#FFBA1A] hover:border-[#FFBA1A]/40 transition-colors min-w-0"
                        >
                          {isCopied ? <Check size={12} className="text-emerald-400 shrink-0" /> : <Copy size={12} className="shrink-0" />}
                          <span className="font-mono truncate">{isCopied ? "Copied" : url.replace(/^https?:\/\//, "")}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Copy the full tracking link to your clipboard</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center w-7 h-7 rounded border border-[#22332F] bg-[#0F1E1D] text-[#A1A9A0] hover:text-[#EDF5EC] hover:border-[#22332F] transition-colors"
                        >
                          <ExternalLink size={12} />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent side="top">Open the link in a new tab to test it</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => setDetailCode(r.code)}
                          className="inline-flex items-center justify-center h-7 px-2 rounded border border-[#22332F] bg-[#0F1E1D] text-[11px] text-[#A1A9A0] hover:text-[#EDF5EC] transition-colors"
                        >
                          View
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">See the firms and clicks attributed to this code</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => handleArchive(r.code, !r.archived_at)}
                          className="inline-flex items-center justify-center w-7 h-7 rounded border border-[#22332F] bg-[#0F1E1D] text-[#A1A9A0] hover:text-[#EDF5EC] transition-colors"
                        >
                          {isArchived ? <ArchiveRestore size={12} /> : <Archive size={12} />}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {isArchived ? "Restore this link to active" : "Hide this link from the active list (data is kept)"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </article>
              );
            })}
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

function Input({ label, hint, value, onChange, placeholder, required, mono }: { label: string; hint?: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; mono?: boolean }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#A1A9A0] mb-1">
        <span>{label}{required && " *"}</span>
        {hint && (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                type="button"
                title={hint}
                aria-label={`Explain ${label}`}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#3D4D49] text-[#C8D1C7] transition-colors hover:border-[#FFBA1A]/60 hover:text-[#FFBA1A]"
              >
                <Info size={10} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[280px] normal-case tracking-normal">{hint}</TooltipContent>
          </Tooltip>
        )}
      </span>
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

function FunnelRow({ icon, label, value, pct, highlight }: { icon: React.ReactNode; label: string; value: number; pct: number; highlight?: boolean }) {
  const bar = highlight ? "bg-[#FFBA1A]" : "bg-[#3D5A4A]";
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 w-16 text-[10px] uppercase tracking-wider text-[#A1A9A0]">
        <span className="text-[#A1A9A0]">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="flex-1 h-1.5 rounded-full bg-[#0F1E1D] overflow-hidden">
        <div className={`h-full ${bar} transition-all`} style={{ width: `${Math.max(pct, value > 0 ? 4 : 0)}%` }} />
      </div>
      <div className={`w-8 text-right text-[12px] font-mono ${highlight ? "text-[#FFBA1A]" : "text-[#EDF5EC]"}`}>{value}</div>
    </div>
  );
}
