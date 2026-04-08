import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const FIELDS = [
  { num: 1, name: "The Core", status: "incomplete" as const, tab: 0 },
  { num: 2, name: "Session Voice", status: "complete" as const, tab: 0 },
  { num: 3, name: "Corporate Objectives", status: "partial" as const, tab: 3 },
  { num: 4, name: "Core Values", status: "incomplete" as const, tab: 0 },
  { num: 5, name: "ICP Lock", status: "partial" as const, tab: 0 },
  { num: 6, name: "Beachhead Segment", status: "incomplete" as const, tab: 2 },
  { num: 7, name: "Spectrum Position", status: "partial" as const, tab: 1 },
  { num: 8, name: "Dead Zone Estimate", status: "partial" as const, tab: 1 },
  { num: 9, name: "Orbit Priority", status: "complete" as const, tab: 1 },
  { num: 10, name: "Primary Signal Type", status: "partial" as const, tab: 2 },
  { num: 11, name: "Vision State", status: "incomplete" as const, tab: 3 },
  { num: 12, name: "Competitive Landscape Signal", status: "partial" as const, tab: 2 },
];

const completeCount = FIELDS.filter((f) => f.status === "complete").length;
const progressPct = Math.round(
  ((completeCount + FIELDS.filter((f) => f.status === "partial").length * 0.5) / FIELDS.length) * 100
);

interface Props {
  onNavigate: (tab: number, fieldId?: string) => void;
}

const statusStyle = (s: "complete" | "partial" | "incomplete") => {
  if (s === "complete") return { background: "#C8963E", color: "#fff", border: "1px solid #C8963E" };
  if (s === "partial") return { background: "transparent", color: "#C8963E", border: "1px solid #C8963E" };
  return { background: "transparent", color: "#A09890", border: "1px solid #DDD5CC" };
};

const statusLabel = (s: "complete" | "partial" | "incomplete") =>
  s === "complete" ? "Complete" : s === "partial" ? "Partial" : "Incomplete";

export default function SPRCompletionStrip({ onNavigate }: Props) {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);

  if (isMobile) {
    return (
      <div className="mb-6">
        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(221,213,204,0.5)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-medium" style={{ color: "#6B6560" }}>
              MAP Completion
            </span>
            <span className="text-[12px] font-semibold" style={{ color: "#C8963E" }}>
              {completeCount} of 12
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(221,213,204,0.4)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #C8963E, #C65D3E)" }}
            />
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-[11px] font-medium"
            style={{ color: "#C8963E" }}
          >
            {expanded ? "Hide fields" : "View all fields"}
          </button>
          {expanded && (
            <div className="mt-3 space-y-2">
              {FIELDS.map((f) => (
                <button
                  key={f.num}
                  onClick={() => { onNavigate(f.tab, `map-field-${f.num}`); setExpanded(false); }}
                  className="flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-colors"
                  style={{ background: "rgba(245,240,235,0.5)" }}
                >
                  <span className="text-[11px]" style={{ color: "#2D2A26" }}>
                    <span style={{ color: "#A09890" }}>{f.num}.</span> {f.name}
                  </span>
                  <span
                    className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                    style={statusStyle(f.status)}
                  >
                    {statusLabel(f.status)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div
        className="rounded-xl p-5"
        style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(221,213,204,0.5)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[12px] font-medium tracking-wide" style={{ color: "#6B6560" }}>
            MAP COMPLETION
          </span>
          <span className="text-[12px]" style={{ color: "#A09890" }}>
            {completeCount} of 12 fields captured. A complete MAP typically requires one additional conversation.
          </span>
        </div>
        <div className="grid grid-cols-6 lg:grid-cols-12 gap-2 mb-4">
          {FIELDS.map((f) => (
            <button
              key={f.num}
              onClick={() => onNavigate(f.tab, `map-field-${f.num}`)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 hover:bg-black/[0.03]"
              title={`${f.name}: ${statusLabel(f.status)}`}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={statusStyle(f.status)}
              >
                {f.num}
              </span>
              <span
                className="text-[8px] leading-tight text-center font-medium"
                style={{ color: "#6B6560" }}
              >
                {f.name}
              </span>
            </button>
          ))}
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(221,213,204,0.4)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #C8963E, #C65D3E)" }}
          />
        </div>
      </div>
    </div>
  );
}
