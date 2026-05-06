import { useEffect, useMemo, useState } from "react";
import { opsGet } from "@/lib/opsClient";
import { supabase } from "@/integrations/supabase/client";

interface ChannelRow {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  views: number;
  unique_visitors: number;
  map_submits: number;
  save_submits: number;
  book_clicks: number;
  share_clicks: number;
  feedback_submits: number;
}

interface ChannelsResponse {
  since: string;
  rows: ChannelRow[];
  health?: {
    tagged_home_views_24h: number | null;
    tagged_submissions_24h: number | null;
  };
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

type PathValidation = {
  ok: boolean;
  error: string | null;
  notice: string | null;
};

/**
 * Validate the destination path. `/m` and `/m/` (no slug) are accepted but
 * surface a notice that the route will redirect to the homepage with UTMs
 * preserved, since `MagnetSite` lives at `/m/:slug`.
 */
function validatePath(raw: string): PathValidation {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Destination path is required.", notice: null };
  }
  if (!trimmed.startsWith("/")) {
    return { ok: false, error: "Path must start with /.", notice: null };
  }
  if (trimmed === "/m" || trimmed === "/m/") {
    return {
      ok: true,
      error: null,
      notice:
        "/m/ has no slug, so this link redirects to the homepage. UTMs are preserved.",
    };
  }
  return { ok: true, error: null, notice: null };
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
  const [path, setPath] = useState<string>("/");
  const [source, setSource] = useState<string>("linkedin");
  const [medium, setMedium] = useState<string>("post");
  const [campaign, setCampaign] = useState<string>("");
  const [saved, setSaved] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedChannels, setSavedChannels] = useState<
    Array<{ utm_source: string; utm_medium: string; utm_campaign: string }>
  >(() => {
    try {
      const raw = localStorage.getItem("ops:savedChannels");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Layer 5: pipeline health checks. Run once on mount.
  type Check = "pending" | "pass" | "fail";
  const [healthInsert, setHealthInsert] = useState<Check>("pending");
  const [testStatus, setTestStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const probeSlug = `__ops_health_${Math.random().toString(36).slice(2, 8)}`;
      const ins = await supabase.from("magnet_views").insert({
        slug: probeSlug,
        utm_source: "ops",
        utm_medium: "health",
        utm_campaign: "probe",
      });
      if (!cancelled) setHealthInsert(ins.error ? "fail" : "pass");
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshNonce]);

  const healthHomeUtm: Check =
    data?.health?.tagged_home_views_24h == null
      ? "pending"
      : data.health.tagged_home_views_24h > 0
        ? "pass"
        : "fail";
  const healthSubUtm: Check =
    data?.health?.tagged_submissions_24h == null
      ? "pending"
      : data.health.tagged_submissions_24h > 0
        ? "pass"
        : "fail";

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

  const pathValidation = useMemo(() => validatePath(path), [path]);

  const builtUrl = useMemo(() => {
    if (!pathValidation.ok) return "";
    const trimmed = path.trim();
    const base = origin() + trimmed;
    return buildUtmUrl(base, source.trim(), medium.trim(), campaign.trim());
  }, [path, pathValidation.ok, source, medium, campaign]);

  const handleSave = async () => {
    if (!builtUrl) return;
    try {
      await navigator.clipboard.writeText(builtUrl);
    } catch {
      /* ignore */
    }
    const entry = {
      utm_source: source.trim(),
      utm_medium: medium.trim(),
      utm_campaign: campaign.trim(),
    };
    setSavedChannels((prev) => {
      const exists = prev.some(
        (p) =>
          p.utm_source === entry.utm_source &&
          p.utm_medium === entry.utm_medium &&
          p.utm_campaign === entry.utm_campaign,
      );
      const next = exists ? prev : [entry, ...prev];
      try {
        localStorage.setItem("ops:savedChannels", JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  };

  const handleTestPipeline = async () => {
    if (!builtUrl) return;
    setTestStatus("Writing probe view…");
    const ins = await supabase.from("magnet_views").insert({
      slug: "__home__",
      utm_source: source.trim() || null,
      utm_medium: medium.trim() || null,
      utm_campaign: campaign.trim() || null,
    });
    if (ins.error) {
      setTestStatus(`Probe insert failed: ${ins.error.message}`);
      return;
    }
    window.open(builtUrl, "_blank", "noopener,noreferrer");
    setTestStatus("Probe written. Opening URL in new tab. Refresh in ~5s.");
    window.setTimeout(() => setTestStatus(null), 6000);
  };

  const mergedRows: ChannelRow[] = useMemo(() => {
    const apiRows = data?.rows ?? [];
    const synthetic: ChannelRow[] = savedChannels
      .filter(
        (s) =>
          !apiRows.some(
            (r) =>
              (r.utm_source ?? "") === s.utm_source &&
              (r.utm_medium ?? "") === s.utm_medium &&
              (r.utm_campaign ?? "") === s.utm_campaign,
          ),
      )
      .map((s) => ({
        utm_source: s.utm_source || null,
        utm_medium: s.utm_medium || null,
        utm_campaign: s.utm_campaign || null,
        views: 0,
        unique_visitors: 0,
        map_submits: 0,
        save_submits: 0,
        book_clicks: 0,
        share_clicks: 0,
        feedback_submits: 0,
      }));
    return [...synthetic, ...apiRows];
  }, [data, savedChannels]);

  const handleCopyRow = async (r: ChannelRow) => {
    const base = origin() + (path.trim() || "/");
    const url = buildUtmUrl(
      base,
      r.utm_source ?? "",
      r.utm_medium ?? "",
      r.utm_campaign ?? "",
    );
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
    const key = `${r.utm_source ?? ""}|${r.utm_medium ?? ""}|${r.utm_campaign ?? ""}`;
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
  };

  return (
    <div className="space-y-4">
      {/* Link builder */}
      <section className="rounded-lg border border-[#22332F] bg-[#1A2B2A] p-4">
        {/* Pipeline health badge */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px]">
          <span className="text-[#A1A9A0] uppercase tracking-wider">
            Pipeline health:
          </span>
          {(
            [
              ["Anon insert", healthInsert],
              ["Tagged home views (24h)", healthHomeUtm],
              ["Tagged submissions (24h)", healthSubUtm],
            ] as Array<[string, Check]>
          ).map(([label, status]) => (
            <span
              key={label}
              className={`px-2 py-0.5 rounded border ${
                status === "pass"
                  ? "border-[#3D5A4A] text-[#9CC2B0] bg-[#16231F]"
                  : status === "fail"
                    ? "border-[#C02B0A] text-[#FF6E4F] bg-[#2A130C]"
                    : "border-[#22332F] text-[#A1A9A0] bg-[#0F1E1D]"
              }`}
            >
              {label}: {status === "pending" ? "…" : status === "pass" ? "ok" : "fail"}
            </span>
          ))}
        </div>

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
              aria-invalid={!pathValidation.ok}
              className={`w-full rounded border bg-[#0F1E1D] px-3 py-2 text-[13px] text-[#EDF5EC] font-mono focus:outline-none ${
                pathValidation.ok
                  ? "border-[#22332F] focus:border-[#FFBA1A]"
                  : "border-[#C02B0A] focus:border-[#C02B0A]"
              }`}
            />
            {!pathValidation.ok && pathValidation.error && (
              <span className="block text-[11px] text-[#C02B0A] mt-1">
                {pathValidation.error}
              </span>
            )}
            {pathValidation.ok && pathValidation.notice && (
              <span className="block text-[11px] text-[#FFBA1A] mt-1">
                {pathValidation.notice}
              </span>
            )}
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
            onClick={handleSave}
            disabled={!builtUrl}
            className="inline-flex items-center gap-2 rounded border border-[#22332F] bg-[#22332F] px-3 h-9 text-[12px] text-[#EDF5EC] hover:bg-[#2E423E] disabled:opacity-50 transition-colors"
          >
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={handleTestPipeline}
            disabled={!builtUrl}
            className="inline-flex items-center gap-2 rounded border border-[#FFBA1A] bg-transparent px-3 h-9 text-[12px] text-[#FFBA1A] hover:bg-[#352B0E] disabled:opacity-50 transition-colors"
          >
            Test pipeline
          </button>
        </div>
        {testStatus && (
          <div className="mt-2 text-[11px] text-[#FFBA1A]">{testStatus}</div>
        )}
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
        {!loading && !err && data && mergedRows.length === 0 && (
          <div className="text-[12px] text-[#A1A9A0]">
            No channel-tagged traffic yet, paste a UTM link from above into
            LinkedIn or an email and check back.
          </div>
        )}
        {!loading && !err && data && mergedRows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[#A1A9A0] uppercase tracking-wider">
                <tr>
                  <th className="text-left px-2 py-1 font-medium">Source</th>
                  <th className="text-left px-2 py-1 font-medium">Medium</th>
                  <th className="text-left px-2 py-1 font-medium">Campaign</th>
                  <th className="text-right px-2 py-1 font-medium">Views</th>
                  <th className="text-right px-2 py-1 font-medium">Unique</th>
                  <th className="text-right px-2 py-1 font-medium">MAPs</th>
                  <th className="text-right px-2 py-1 font-medium">Save→CR</th>
                  <th className="text-right px-2 py-1 font-medium">Saves</th>
                  <th className="text-right px-2 py-1 font-medium">Book clicks</th>
                  <th className="text-right px-2 py-1 font-medium">Shares</th>
                  <th className="text-right px-2 py-1 font-medium">Feedback</th>
                  <th className="text-right px-2 py-1 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#22332F]">
                {mergedRows.map((r, i) => {
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
                        {r.map_submits}
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
                      <td className="px-2 py-1 text-right">
                        {!untagged && (
                          <button
                            type="button"
                            onClick={() => handleCopyRow(r)}
                            className="inline-flex items-center rounded border border-[#22332F] bg-[#0F1E1D] px-2 h-6 text-[11px] text-[#A1A9A0] hover:text-[#FFBA1A] hover:border-[#FFBA1A] transition-colors"
                          >
                            {copiedKey ===
                            `${r.utm_source ?? ""}|${r.utm_medium ?? ""}|${r.utm_campaign ?? ""}`
                              ? "Copied"
                              : "Copy"}
                          </button>
                        )}
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
