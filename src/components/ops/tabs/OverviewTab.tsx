import { useEffect, useState } from "react";
import { opsGet } from "@/lib/opsClient";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
  { key: "submissions", color: "#a3a3a3" },
  { key: "completions", color: "#4ade80" },
  { key: "views", color: "#60a5fa" },
  { key: "shares", color: "#facc15" },
  { key: "bookings", color: "#f472b6" },
];

interface OverviewTabProps {
  refreshNonce: number;
  onUnauth: () => void;
}

export function OverviewTab({ refreshNonce, onUnauth }: OverviewTabProps) {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [visible, setVisible] = useState<Record<string, boolean>>(
    Object.fromEntries(SERIES.map((s) => [s.key, true])),
  );

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

  if (loading) return <div className="text-zinc-500 text-sm">loading…</div>;
  if (err) return <div className="text-red-400 text-sm">{err}</div>;
  if (!data) return null;

  const { kpis, timeseries, activity } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Kpi label="Submissions" value={kpis.submissions} />
        <Kpi label="Completed" value={kpis.completed} />
        <Kpi label="Views" value={kpis.views} />
        <Kpi label="Shares" value={kpis.shares} />
        <Kpi label="Emails" value={kpis.emails} />
        <Kpi label="Bookings" value={kpis.bookings} />
      </div>

      <section className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-zinc-300">Last 30 days</h2>
          <div className="flex flex-wrap gap-2">
            {SERIES.map((s) => (
              <button
                key={s.key}
                onClick={() => setVisible((v) => ({ ...v, [s.key]: !v[s.key] }))}
                className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded border transition-colors ${
                  visible[s.key]
                    ? "border-zinc-700 bg-zinc-800 text-zinc-200"
                    : "border-zinc-800 bg-transparent text-zinc-500"
                }`}
              >
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: s.color }} />
                {s.key}
              </button>
            ))}
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeseries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickFormatter={(d) => d.slice(5)} />
              <YAxis stroke="#71717a" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 6 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {SERIES.filter((s) => visible[s.key]).map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  stroke={s.color}
                  strokeWidth={1.5}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <h2 className="text-sm font-medium text-zinc-300 mb-3">Recent activity</h2>
        {activity.length === 0 ? (
          <div className="text-sm text-zinc-500">no activity yet</div>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {activity.map((a, i) => (
              <li key={i} className="flex items-center justify-between gap-4 py-2 text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-zinc-500 font-mono w-32 shrink-0">{new Date(a.at).toLocaleString()}</span>
                  <span className="text-zinc-300 truncate">{a.label}</span>
                </div>
                {a.slug && (
                  <a
                    href={`/m/${a.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-zinc-400 hover:text-zinc-200 font-mono shrink-0"
                  >
                    /m/{a.slug}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="text-2xl font-semibold text-zinc-100 mt-1">{value.toLocaleString()}</div>
    </div>
  );
}
