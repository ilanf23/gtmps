import { useEffect, useState } from "react";
import { opsGet } from "@/lib/opsClient";

interface SharesData {
  outbound_new: Array<Record<string, unknown>>;
  outbound_legacy: Array<Record<string, unknown>>;
  inbound: Array<Record<string, unknown>>;
  top_sharers: Array<{ slug: string; downstream_visits: number }>;
  attribution_wired: boolean;
}

interface SharesTabProps {
  refreshNonce: number;
  onUnauth: () => void;
}

export function SharesTab({ refreshNonce, onUnauth }: SharesTabProps) {
  const [data, setData] = useState<SharesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    opsGet<SharesData>("/ops-shares")
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

  return (
    <div className="space-y-4">
      {!data.attribution_wired && (
        <div className="rounded border border-[#A79014] bg-[#352B0E] text-[#FFBA1A] text-xs px-3 py-2">
          Share-token attribution ships in Phase 2/3. The Outbound (legacy) column shows raw share-button clicks. Sharer/recipient emails and inbound visit attribution will populate once the tracking pixel and share-token edge function are live.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title={`Outbound shares (legacy, ${data.outbound_legacy.length})`}>
          {data.outbound_legacy.length === 0 ? (
            <Empty>no shares yet</Empty>
          ) : (
            <Table
              head={["Slug", "Channel", "When"]}
              rows={data.outbound_legacy.map((s) => [
                <a key="s" href={`/m/${s.slug}`} target="_blank" rel="noreferrer" className="font-mono text-xs text-[#EDF5EC] hover:text-[#EDF5EC] underline-offset-2 hover:underline">/m/{String(s.slug)}</a>,
                String(s.channel),
                String(s.created_at).slice(0, 19),
              ])}
            />
          )}
        </Section>

        <Section title={`Inbound visits via ?ref= (${data.inbound.length})`}>
          {data.inbound.length === 0 ? (
            <Empty>no inbound attribution yet</Empty>
          ) : (
            <Table
              head={["Visiting", "From slug", "When"]}
              rows={data.inbound.map((v) => [
                <span key="v" className="font-mono text-xs text-[#EDF5EC]">/m/{String(v.slug)}</span>,
                <span key="r" className="font-mono text-xs text-[#A1A9A0]">/m/{String(v.referrer_slug)}</span>,
                String(v.viewed_at).slice(0, 19),
              ])}
            />
          )}
        </Section>
      </div>

      <Section title="Top sharers (downstream visits)">
        {data.top_sharers.length === 0 ? (
          <Empty>no downstream traffic yet</Empty>
        ) : (
          <Table
            head={["Slug", "Downstream visits"]}
            rows={data.top_sharers.map((t) => [
              <a key="s" href={`/m/${t.slug}`} target="_blank" rel="noreferrer" className="font-mono text-xs text-[#EDF5EC] hover:text-[#EDF5EC] underline-offset-2 hover:underline">/m/{t.slug}</a>,
              <span key="c" className="text-[#EDF5EC]">{t.downstream_visits}</span>,
            ])}
          />
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[#22332F] bg-[#1A2B2A] p-4">
      <h2 className="text-sm font-medium text-[#EDF5EC] mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-[#A1A9A0]">{children}</div>;
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-[#A1A9A0] text-xs uppercase tracking-wider">
          <tr>{head.map((h) => <th key={h} className="text-left px-2 py-1.5 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-[#22332F]">
          {rows.map((r, i) => (
            <tr key={i}>{r.map((cell, j) => <td key={j} className="px-2 py-1.5 text-[#EDF5EC]">{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
