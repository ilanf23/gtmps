import { useEffect, useState } from "react";
import { opsGet } from "@/lib/opsClient";

interface HealthData {
  enrichment_errors: Array<{ slug: string; enrichment_error: string; created_at: string }>;
  pending_long: Array<{ slug: string; first_name: string | null; created_at: string; status: string }>;
  daily_stats: Array<{ date: string; submissions: number; completed: number; errors: number }>;
}

interface HealthTabProps {
  refreshNonce: number;
  onUnauth: () => void;
}

export function HealthTab({ refreshNonce, onUnauth }: HealthTabProps) {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    opsGet<HealthData>("/ops-health")
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
  }, [refreshNonce, onUnauth]);

  if (loading) return <div className="text-[#A1A9A0] text-sm">loading…</div>;
  if (err) return <div className="text-[#C02B0A] text-sm">{err}</div>;
  if (!data) return null;

  const totals = data.daily_stats.reduce(
    (acc, d) => {
      acc.submissions += d.submissions;
      acc.completed += d.completed;
      acc.errors += d.errors;
      return acc;
    },
    { submissions: 0, completed: 0, errors: 0 },
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-lg border border-[#22332F] bg-[#1A2B2A] p-4">
          <h2 className="text-sm font-medium text-[#EDF5EC] mb-3">
            Recent enrichment errors ({data.enrichment_errors.length})
          </h2>
          {data.enrichment_errors.length === 0 ? (
            <div className="text-sm text-[#A1A9A0]">no errors in the last 7 days</div>
          ) : (
            <ul className="space-y-2 text-xs">
              {data.enrichment_errors.map((e, i) => (
                <li key={i} className="rounded border border-[#C02B0A] bg-[#2A1414]/30 p-2">
                  <div className="flex items-center justify-between">
                    <a href={`/m/${e.slug}`} target="_blank" rel="noreferrer" className="font-mono text-[#FF7A5A] hover:text-[#FFCDB2]">/m/{e.slug}</a>
                    <span className="text-[#A1A9A0]">{new Date(e.created_at).toLocaleString()}</span>
                  </div>
                  <div className="mt-1 text-[#FFCDB2]/80 break-words">{e.enrichment_error}</div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-[#22332F] bg-[#1A2B2A] p-4">
          <h2 className="text-sm font-medium text-[#EDF5EC] mb-3">
            Long-pending submissions ({data.pending_long.length})
          </h2>
          {data.pending_long.length === 0 ? (
            <div className="text-sm text-[#A1A9A0]">nothing stuck</div>
          ) : (
            <ul className="space-y-1 text-xs">
              {data.pending_long.map((p) => (
                <li key={p.slug} className="rounded border border-[#A79014] bg-[#352B0E]/30 p-2 flex items-center justify-between">
                  <a href={`/m/${p.slug}`} target="_blank" rel="noreferrer" className="font-mono text-[#FFBA1A] hover:text-[#FFE08A]">/m/{p.slug}</a>
                  <span className="text-[#A1A9A0]">{new Date(p.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-lg border border-[#22332F] bg-[#1A2B2A] p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-[#EDF5EC]">Daily stats (last 30d)</h2>
          <span className="text-xs text-[#A1A9A0]">
            {totals.submissions} subs · {totals.completed} done · {totals.errors} errors
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-[#A1A9A0] uppercase tracking-wider">
              <tr>
                <th className="text-left px-2 py-1 font-medium">Date</th>
                <th className="text-right px-2 py-1 font-medium">Submissions</th>
                <th className="text-right px-2 py-1 font-medium">Completed</th>
                <th className="text-right px-2 py-1 font-medium">Errors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#22332F]">
              {data.daily_stats.slice().reverse().map((d) => (
                <tr key={d.date}>
                  <td className="px-2 py-1 font-mono text-[#A1A9A0]">{d.date}</td>
                  <td className="px-2 py-1 text-right text-[#EDF5EC]">{d.submissions}</td>
                  <td className="px-2 py-1 text-right text-[#EDF5EC]">{d.completed}</td>
                  <td className={`px-2 py-1 text-right ${d.errors > 0 ? "text-[#C02B0A]" : "text-[#EDF5EC]"}`}>{d.errors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-[11px] text-[#6E7A72]">
          Edge function error rate: wire Supabase Logs API in v2 for live error rate per function.
        </div>
      </section>
    </div>
  );
}
