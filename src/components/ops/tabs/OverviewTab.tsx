import { useEffect, useMemo, useState } from "react";
import { opsGet } from "@/lib/opsClient";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface OverviewData {
  kpis: {
    submissions: number;
    completed: number;
    views: number;
    shares: number;
    emails: number;
    bookings: number;
  };
  timeseries: Array<{
    date: string;
    submissions: number;
    completions: number;
    views: number;
    shares: number;
    bookings: number;
  }>;
  activity: Array<{ kind: string; at: string; slug: string; label: string }>;
}

const SERIES = [
  { key: "submissions" as const, color: "#225351", label: "Submissions" },
  { key: "completions" as const, color: "#A79014", label: "Completions" },
  { key: "views" as const, color: "#FFBA1A", label: "Views" },
  { key: "shares" as const, color: "#803402", label: "Shares" },
  { key: "bookings" as const, color: "#BF461A", label: "Bookings" },
];

interface OverviewTabProps {
  refreshNonce: number;
  onUnauth: () => void;
}

export function OverviewTab({ refreshNonce, onUnauth }: OverviewTabProps) {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);
    opsGet<OverviewData>("/ops-overview")
      .then((d) => {
        if (!cancelled) setData(d);
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
  }, [refreshNonce, onUnauth]);

  const sparklines = useMemo(() => {
    if (!data) return null;
    const pick = (key: keyof OverviewData["timeseries"][number]) =>
      data.timeseries.map((t) => Number(t[key] ?? 0));
    return {
      submissions: pick("submissions"),
      completions: pick("completions"),
      views: pick("views"),
      shares: pick("shares"),
      bookings: pick("bookings"),
    };
  }, [data]);

  const deltas = useMemo(() => {
    if (!data) return null;
    const halfA = (arr: number[]) => arr.slice(0, Math.floor(arr.length / 2)).reduce((a, b) => a + b, 0);
    const halfB = (arr: number[]) => arr.slice(Math.floor(arr.length / 2)).reduce((a, b) => a + b, 0);
    const pct = (arr: number[]) => {
      const a = halfA(arr);
      const b = halfB(arr);
      if (a === 0) return b > 0 ? 100 : 0;
      return Math.round(((b - a) / a) * 100);
    };
    if (!sparklines) return null;
    return {
      submissions: pct(sparklines.submissions),
      completions: pct(sparklines.completions),
      views: pct(sparklines.views),
      shares: pct(sparklines.shares),
      bookings: pct(sparklines.bookings),
    };
  }, [data, sparklines]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl border border-[#22332F] bg-[#1A2B2A] animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-96 rounded-xl border border-[#22332F] bg-[#1A2B2A] animate-pulse" />
          <div className="h-96 rounded-xl border border-[#22332F] bg-[#1A2B2A] animate-pulse" />
        </div>
      </div>
    );
  }
  if (err) {
    return (
      <div className="rounded-md border border-[#C02B0A] bg-[#2A1414] px-4 py-3 text-[13px] text-[#EDF5EC]">
        {err}
      </div>
    );
  }
  if (!data || !sparklines || !deltas) return null;

  const { kpis, timeseries, activity } = data;

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard label="Submissions" value={kpis.submissions} delta={deltas.submissions} spark={sparklines.submissions} />
        <KpiCard label="Completed" value={kpis.completed} delta={deltas.completions} spark={sparklines.completions} />
        <KpiCard label="Views" value={kpis.views} delta={deltas.views} spark={sparklines.views} />
        <KpiCard label="Shares" value={kpis.shares} delta={deltas.shares} spark={sparklines.shares} />
        <KpiCard label="Emails" value={kpis.emails} delta={null} spark={null} />
        <KpiCard label="Bookings" value={kpis.bookings} delta={deltas.bookings} spark={sparklines.bookings} />
      </div>

      {/* Chart + activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 rounded-xl border border-[#22332F] bg-[#1A2B2A] p-6 space-y-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-[11px] font-black tracking-[0.14em] uppercase text-[#EDF5EC]">
                Activity — last 30 days
              </h2>
              <p className="text-[12px] text-[#A1A9A0] mt-1">
                Submissions · Completions · Views · Shares · Bookings
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {SERIES.map((s) => (
                <span key={s.key} className="inline-flex items-center gap-1.5 text-[11px] text-[#A1A9A0]">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ background: s.color }} />
                  {s.label}
                </span>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeseries} barGap={0} barCategoryGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#22332F" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#6E7A72"
                  fontSize={10}
                  tickFormatter={(d) => String(d).slice(5)}
                  axisLine={{ stroke: "#22332F" }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6E7A72"
                  fontSize={10}
                  allowDecimals={false}
                  axisLine={{ stroke: "#22332F" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0F1E1D",
                    border: "1px solid #22332F",
                    borderRadius: 6,
                    fontSize: 11,
                    color: "#EDF5EC",
                  }}
                  cursor={{ fill: "#22332F" }}
                />
                <Legend wrapperStyle={{ fontSize: 11, display: "none" }} />
                {SERIES.map((s) => (
                  <Bar key={s.key} dataKey={s.key} stackId="a" fill={s.color} radius={[0, 0, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-[#22332F] bg-[#1A2B2A] flex flex-col">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[11px] font-black tracking-[0.14em] uppercase text-[#EDF5EC]">
                Live activity
              </h2>
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#BF461A]" />
                <span className="text-[9px] font-black tracking-[0.16em] uppercase text-[#BF461A]">
                  Live
                </span>
              </span>
            </div>
            <span className="text-[11px] text-[#A1A9A0]">
              {activity.length} events
            </span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-80 px-2 pb-3">
            {activity.length === 0 ? (
              <div className="px-3 py-6 text-[12px] text-[#6E7A72]">No activity yet.</div>
            ) : (
              <ul>
                {activity.map((a, i) => (
                  <li key={i} className="px-3 py-2.5 flex items-start gap-3">
                    <ActivityAvatar kind={a.kind} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[12px] text-[#EDF5EC] truncate">{a.label}</span>
                        <span className="text-[10px] font-mono text-[#6E7A72] shrink-0">
                          {relTime(a.at)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <KindChip kind={a.kind} />
                        {a.slug && (
                          <a
                            href={`/m/${a.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-mono text-[#A1A9A0] hover:text-[#FFBA1A] truncate"
                          >
                            /m/{a.slug}
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {/* Funnel */}
      <Funnel kpis={kpis} />
    </div>
  );
}

function KpiCard({
  label,
  value,
  delta,
  spark,
}: {
  label: string;
  value: number;
  delta: number | null;
  spark: number[] | null;
}) {
  const max = spark && spark.length ? Math.max(...spark, 1) : 1;
  const deltaColor =
    delta === null ? "#6E7A72" : delta >= 0 ? "#5A8A4E" : "#C02B0A";
  return (
    <div className="rounded-xl border border-[#22332F] bg-[#1A2B2A] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black tracking-[0.12em] uppercase text-[#A1A9A0]">
          {label}
        </span>
        {delta !== null && (
          <span className="text-[11px] font-mono" style={{ color: deltaColor }}>
            {delta >= 0 ? "+" : ""}
            {delta}%
          </span>
        )}
      </div>
      <div className="text-[34px] leading-none font-black tracking-tight text-[#EDF5EC]">
        {value.toLocaleString()}
      </div>
      {spark && spark.length > 0 ? (
        <div className="h-6 flex items-end gap-[2px]">
          {spark.slice(-12).map((v, i) => {
            const h = Math.max(2, Math.round((v / max) * 24));
            const isLast = i === Math.min(spark.length, 12) - 1;
            return (
              <span
                key={i}
                className="flex-1 rounded-[1px]"
                style={{
                  height: h,
                  background: isLast ? "#FFBA1A" : "#225351",
                }}
              />
            );
          })}
        </div>
      ) : (
        <div className="h-6" />
      )}
    </div>
  );
}

function ActivityAvatar({ kind }: { kind: string }) {
  const map: Record<string, { bg: string; fg: string; ch: string }> = {
    submission: { bg: "#225351", fg: "#EDF5EC", ch: "S" },
    completion: { bg: "#BF461A", fg: "#EDF5EC", ch: "C" },
    view: { bg: "#A79014", fg: "#0F1E1D", ch: "V" },
    share: { bg: "#803402", fg: "#EDF5EC", ch: "↗" },
    booking: { bg: "#BF461A", fg: "#EDF5EC", ch: "★" },
    email: { bg: "#225351", fg: "#EDF5EC", ch: "✉" },
  };
  const m = map[kind] ?? { bg: "#22332F", fg: "#EDF5EC", ch: "·" };
  return (
    <span
      className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-black"
      style={{ background: m.bg, color: m.fg }}
    >
      {m.ch}
    </span>
  );
}

function KindChip({ kind }: { kind: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    submission: { bg: "#22332F", fg: "#A1A9A0" },
    completion: { bg: "#352B0E", fg: "#FFBA1A" },
    view: { bg: "#22332F", fg: "#FFBA1A" },
    share: { bg: "#352B0E", fg: "#FFBA1A" },
    booking: { bg: "#1F3A28", fg: "#5A8A4E" },
    email: { bg: "#22332F", fg: "#A1A9A0" },
  };
  const m = map[kind] ?? { bg: "#22332F", fg: "#A1A9A0" };
  return (
    <span
      className="inline-block px-1.5 py-[1px] rounded text-[9px] font-black tracking-[0.14em] uppercase"
      style={{ background: m.bg, color: m.fg }}
    >
      {kind}
    </span>
  );
}

function Funnel({
  kpis,
}: {
  kpis: OverviewData["kpis"];
}) {
  const stages = [
    { label: "Submitted", value: kpis.submissions, bg: "#225351", fg: "#EDF5EC" },
    { label: "Completed", value: kpis.completed, bg: "#A79014", fg: "#0F1E1D" },
    { label: "Viewed", value: kpis.views, bg: "#FFBA1A", fg: "#0F1E1D" },
    { label: "Shared", value: kpis.shares, bg: "#803402", fg: "#EDF5EC" },
    { label: "Booked", value: kpis.bookings, bg: "#BF461A", fg: "#EDF5EC" },
  ];
  const max = Math.max(stages[0].value, 1);
  return (
    <section className="rounded-xl border border-[#22332F] bg-[#1A2B2A] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-black tracking-[0.14em] uppercase text-[#EDF5EC]">
          Funnel — submitted through booked
        </h2>
        <span className="text-[11px] text-[#A1A9A0]">Last 30 days</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
        {stages.map((s, i) => {
          const ratio = s.value / max;
          const height = Math.max(48, Math.round(ratio * 92));
          const prev = i === 0 ? null : stages[i - 1].value;
          const conv = prev === null ? null : prev === 0 ? 0 : Math.round((s.value / prev) * 1000) / 10;
          return (
            <div key={s.label} className="space-y-2">
              <div
                className="rounded-md p-3 flex flex-col gap-1 justify-end"
                style={{ background: s.bg, height }}
              >
                <span className="text-[22px] font-black leading-none" style={{ color: s.fg }}>
                  {s.value.toLocaleString()}
                </span>
                <span
                  className="text-[10px] font-black tracking-[0.14em] uppercase"
                  style={{ color: s.fg }}
                >
                  {s.label}
                </span>
              </div>
              <div className="text-center text-[11px] font-mono">
                {conv === null ? (
                  <span className="text-[#A1A9A0]">100%</span>
                ) : (
                  <span style={{ color: s.bg === "#FFBA1A" ? "#FFBA1A" : "#A1A9A0" }}>
                    {conv}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function relTime(iso: string): string {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (d < 60) return `${d}s`;
  if (d < 3600) return `${Math.floor(d / 60)}m`;
  if (d < 86400) return `${Math.floor(d / 3600)}h`;
  return `${Math.floor(d / 86400)}d`;
}
