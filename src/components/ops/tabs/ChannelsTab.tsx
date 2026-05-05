import { useEffect, useMemo, useState } from "react";
import { opsGet } from "@/lib/opsClient";

interface ChannelRow {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  views: number;
  unique_visitors: number;
  save_submits: number;
  book_clicks: number;
  share_clicks: number;
  feedback_submits: number;
}

interface ChannelsResponse {
  since: string;
  rows: ChannelRow[];
}

interface ChannelsTabProps {
  refreshNonce: number;
  onUnauth: () => void;
}

const SOURCE_PRESETS = [
  "linkedin",
  "email",
  "twitter",
  "newsletter",
  "partner",
  "direct",
];
const MEDIUM_PRESETS = ["post", "dm", "signature", "comment", "inline", "newsletter"];

const RANGE_PRESETS: Array<{ id: string; label: string; days: number | null }> = [
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "90d", label: "Last 90 days", days: 90 },
  { id: "all", label: "All time", days: null },
];

function origin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "https://discover.mabbly.com";
}

function buildUtmUrl(
  baseUrl: string,
  source: string,
  medium: string,
  campaign: string,
): string {
  if (!baseUrl) return "";
  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    return "";
  }
  if (source) url.searchParams.set("utm_source", source);
  if (medium) url.searchParams.set("utm_medium", medium);
  if (campaign) url.searchParams.set("utm_campaign", campaign);
  return url.toString();
}

function rate(num: number, denom: number): string {
  if (denom <= 0) return ",";
  return `${((num / denom) * 100).toFixed(1)}%`;
}

export function ChannelsTab({ refreshNonce, onUnauth }: ChannelsTabProps) {
  const [data, setData] = useState<ChannelsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [range, setRange] = useState<string>("30d");

  // Builder state.
  const [path, setPath] = useState<string>("/m/");
  const [source, setSource] = useState<string>("linkedin");
  const [medium, setMedium] = useState<string>("post");
  const [campaign, setCampaign] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);
    const preset = RANGE_PRESETS.find((p) => p.id === range) ?? RANGE_PRESETS[1];
    const params: Record<string, string> = {};
    if (preset.days != null) {
      params.since = new Date(
        Date.now() - preset.days * 24 * 60 * 60 * 1000,
      ).toISOString();
    } else {
      params.since = new Date(0).toISOString();
    }
    opsGet<ChannelsResponse>("/ops-channels", params)
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
  }, [refreshNonce, onUnauth, range]);

  const builtUrl = useMemo(() => {
    const base = origin() + (path.startsWith("/") ? path : `/${path}`);
    return buildUtmUrl(base, source.trim(), medium.trim(), campaign.trim());
  }, [path, source, medium, campaign]);

  const handleCopy = async () => {
    if (!builtUrl) return;
    try {
      await navigator.clipboard.writeText(builtUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-4">
      {/* Link builder */}
      <section className="rounded-lg border border-[#22332F] bg-[#1A2B2A] p-4">
        <h2 className="text-sm font-medium text-[#EDF5EC] mb-1">Link builder</h2>
        <p className="text-[11px] text-[#A1A9A0] mb-4">
          Mint a channel-tagged URL. First-touch attribution: a viewer who lands
          via this link will be credited to{" "}
          <code className="text-[#FFBA1A]">
            {source || "?"} / {medium || "?"} / {campaign || "?"}
          </code>{" "}
          for every conversion event they fire on this magnet, even on later
          visits.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <label className="block">
            <span className="block text-[10px] uppercase tracking-wider text-[#A1A9A0] mb-1">
              Destination path
            </span>
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="/m/<slug>"
              className="w-full rounded border border-[#22332F] bg-[#0F1E1D] px-3 py-2 text-[13px] text-[#EDF5EC] font-mono focus:outline-none focus:border-[#FFBA1A]"
            />
          </label>
          <label className="block">
            <span className="block text-[10px] uppercase tracking-wider text-[#A1A9A0] mb-1">
              Campaign
            </span>
            <input
              type="text"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="e.g. may-launch"
              className="w-full rounded border border-[#22332F] bg-[#0F1E1D] px-3 py-2 text-[13px] text-[#EDF5EC] font-mono focus:outline-none focus:border-[#FFBA1A]"
            />
          </label>
          <label className="block">
            <span className="block text-[10px] uppercase tracking-wider text-[#A1A9A0] mb-1">
              Source
            </span>
            <input
              type="text"
              list="utm-source-presets"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="linkedin"
              className="w-full rounded border border-[#22332F] bg-[#0F1E1D] px-3 py-2 text-[13px] text-[#EDF5EC] font-mono focus:outline-none focus:border-[#FFBA1A]"
            />
            <datalist id="utm-source-presets">
              {SOURCE_PRESETS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </label>
          <label className="block">
            <span className="block text-[10px] uppercase tracking-wider text-[#A1A9A0] mb-1">
              Medium
            </span>
            <input
              type="text"
              list="utm-medium-presets"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              placeholder="post"
              className="w-full rounded border border-[#22332F] bg-[#0F1E1D] px-3 py-2 text-[13px] text-[#EDF5EC] font-mono focus:outline-none focus:border-[#FFBA1A]"
            />
            <datalist id="utm-medium-presets">
              {MEDIUM_PRESETS.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            readOnly
            value={builtUrl}
            className="flex-1 rounded border border-[#22332F] bg-[#0F1E1D] px-3 py-2 text-[12px] text-[#FFBA1A] font-mono focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCopy}
            disabled={!builtUrl}
            className="inline-flex items-center gap-2 rounded border border-[#22332F] bg-[#22332F] px-3 h-9 text-[12px] text-[#EDF5EC] hover:bg-[#2E423E] disabled:opacity-50 transition-colors"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </section>

      {/* Funnel report */}
      <section className="rounded-lg border border-[#22332F] bg-[#1A2B2A] p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-[#EDF5EC]">
            Per-channel funnel
          </h2>
          <div className="flex items-center gap-1">
            {RANGE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setRange(p.id)}
                className={`px-2 h-7 rounded text-[11px] border transition-colors ${
                  range === p.id
                    ? "border-[#FFBA1A] bg-[#352B0E] text-[#FFBA1A]"
                    : "border-[#22332F] bg-[#0F1E1D] text-[#A1A9A0] hover:text-[#EDF5EC]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {loading && <div className="text-[#A1A9A0] text-sm">loading…</div>}
        {err && <div className="text-[#C02B0A] text-sm">{err}</div>}
        {!loading && !err && data && data.rows.length === 0 && (
          <div className="text-[12px] text-[#A1A9A0]">
            No channel-tagged traffic yet, paste a UTM link from above into
            LinkedIn or an email and check back.
          </div>
        )}
        {!loading && !err && data && data.rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[#A1A9A0] uppercase tracking-wider">
                <tr>
                  <th className="text-left px-2 py-1 font-medium">Source</th>
                  <th className="text-left px-2 py-1 font-medium">Medium</th>
                  <th className="text-left px-2 py-1 font-medium">Campaign</th>
                  <th className="text-right px-2 py-1 font-medium">Views</th>
                  <th className="text-right px-2 py-1 font-medium">Unique</th>
                  <th className="text-right px-2 py-1 font-medium">Save→CR</th>
                  <th className="text-right px-2 py-1 font-medium">Saves</th>
                  <th className="text-right px-2 py-1 font-medium">Book clicks</th>
                  <th className="text-right px-2 py-1 font-medium">Shares</th>
                  <th className="text-right px-2 py-1 font-medium">Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#22332F]">
                {data.rows.map((r, i) => {
                  const untagged =
                    !r.utm_source && !r.utm_medium && !r.utm_campaign;
                  return (
                    <tr key={i} className={untagged ? "opacity-60" : ""}>
                      <td className="px-2 py-1 font-mono text-[#EDF5EC]">
                        {r.utm_source ?? ","}
                      </td>
                      <td className="px-2 py-1 font-mono text-[#EDF5EC]">
                        {r.utm_medium ?? ","}
                      </td>
                      <td className="px-2 py-1 font-mono text-[#EDF5EC]">
                        {r.utm_campaign ?? (untagged ? "(untagged)" : ",")}
                      </td>
                      <td className="px-2 py-1 text-right text-[#EDF5EC]">{r.views}</td>
                      <td className="px-2 py-1 text-right text-[#EDF5EC]">
                        {r.unique_visitors}
                      </td>
                      <td className="px-2 py-1 text-right text-[#FFBA1A]">
                        {rate(r.save_submits, r.unique_visitors)}
                      </td>
                      <td className="px-2 py-1 text-right text-[#EDF5EC]">
                        {r.save_submits}
                      </td>
                      <td className="px-2 py-1 text-right text-[#EDF5EC]">
                        {r.book_clicks}
                      </td>
                      <td className="px-2 py-1 text-right text-[#EDF5EC]">
                        {r.share_clicks}
                      </td>
                      <td className="px-2 py-1 text-right text-[#EDF5EC]">
                        {r.feedback_submits}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
