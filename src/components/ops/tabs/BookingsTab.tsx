import { useEffect, useState } from "react";
import { opsGet } from "@/lib/opsClient";

interface BookingRow {
  id: string;
  slug: string;
  scheduled_at: string | null;
  calendly_event_id: string | null;
  created_at: string;
}

interface BookingsTabProps {
  refreshNonce: number;
  onUnauth: () => void;
}

export function BookingsTab({ refreshNonce, onUnauth }: BookingsTabProps) {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    opsGet<{ rows: BookingRow[] }>("/ops-bookings")
      .then((d) => !cancelled && setRows(d.rows))
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

  if (loading) return <div className="text-zinc-500 text-sm">loading…</div>;
  if (err) return <div className="text-red-400 text-sm">{err}</div>;

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 text-sm text-zinc-400">
        No bookings tracked yet. Wire the Calendly webhook to <code className="text-zinc-200">magnet-track-booking</code> (Phase 2) to populate this tab. Bookings created via the in-app flow are recorded in <code className="text-zinc-200">magnet_call_bookings</code> directly.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-zinc-900 text-zinc-500 text-xs uppercase tracking-wider">
          <tr>
            <th className="text-left px-3 py-2 font-medium">Slug</th>
            <th className="text-left px-3 py-2 font-medium">Calendly event</th>
            <th className="text-left px-3 py-2 font-medium">Scheduled</th>
            <th className="text-left px-3 py-2 font-medium">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-zinc-900/60">
              <td className="px-3 py-2 font-mono text-xs">
                <a href={`/m/${r.slug}`} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-zinc-100 underline-offset-2 hover:underline">/m/{r.slug}</a>
              </td>
              <td className="px-3 py-2 text-zinc-400 text-xs font-mono">{r.calendly_event_id ?? "-"}</td>
              <td className="px-3 py-2 text-zinc-300 text-xs">{r.scheduled_at ? new Date(r.scheduled_at).toLocaleString() : "-"}</td>
              <td className="px-3 py-2 text-zinc-500 text-xs">{new Date(r.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
