import { useEffect, useRef, useState } from "react";
import {
  type PeriodPreset,
  type Grain,
  type CustomRange,
  PRESET_LIST,
  PRESET_LABELS,
} from "@/lib/opsTimeRange";

interface TimeRangePickerProps {
  preset: PeriodPreset;
  custom: CustomRange | undefined;
  grain: Grain;
  prevLabel: string | null;
  onChange: (next: { preset: PeriodPreset; custom?: CustomRange; grain: Grain }) => void;
}

const GRAIN_OPTIONS: Array<{ value: Grain; label: string }> = [
  { value: "auto", label: "Auto" },
  { value: "hour", label: "Hour" },
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

const VISIBLE_PRESETS: PeriodPreset[] = PRESET_LIST.filter((p) => p !== "custom");

function isoDateOnly(value: string | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function TimeRangePicker({
  preset,
  custom,
  grain,
  prevLabel,
  onChange,
}: TimeRangePickerProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState(() => isoDateOnly(custom?.from));
  const [draftTo, setDraftTo] = useState(() => isoDateOnly(custom?.to));
  const popRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDraftFrom(isoDateOnly(custom?.from));
    setDraftTo(isoDateOnly(custom?.to));
  }, [custom?.from, custom?.to]);

  useEffect(() => {
    if (!popoverOpen) return;
    const handler = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [popoverOpen]);

  const applyCustom = () => {
    if (!draftFrom || !draftTo) return;
    onChange({
      preset: "custom",
      custom: {
        from: new Date(`${draftFrom}T00:00:00`).toISOString(),
        to: new Date(`${draftTo}T23:59:59`).toISOString(),
      },
      grain,
    });
    setPopoverOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center rounded-lg border border-[#22332F] bg-[#1A2B2A] p-1 gap-0.5">
        {VISIBLE_PRESETS.map((p) => {
          const active = preset === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange({ preset: p, grain })}
              className={`px-2.5 h-7 rounded-md text-[11px] font-black tracking-[0.06em] uppercase transition-colors ${
                active
                  ? "bg-[#22332F] text-[#FFBA1A] border border-[#2E423E]"
                  : "text-[#A1A9A0] hover:text-[#EDF5EC] hover:bg-[#22332F]/60"
              }`}
            >
              {PRESET_LABELS[p]}
            </button>
          );
        })}

        <div className="relative" ref={popRef}>
          <button
            type="button"
            onClick={() => setPopoverOpen((v) => !v)}
            className={`px-2.5 h-7 rounded-md text-[11px] font-black tracking-[0.06em] uppercase transition-colors inline-flex items-center gap-1.5 ${
              preset === "custom"
                ? "bg-[#22332F] text-[#FFBA1A] border border-[#2E423E]"
                : "text-[#A1A9A0] hover:text-[#EDF5EC] hover:bg-[#22332F]/60"
            }`}
          >
            Custom
            <span className="text-[9px]" aria-hidden>
              ▾
            </span>
          </button>
          {popoverOpen && (
            <div className="absolute right-0 mt-2 z-20 w-[280px] rounded-lg border border-[#22332F] bg-[#1A2B2A] p-3 shadow-lg">
              <div className="space-y-2">
                <label className="block text-[10px] font-black tracking-[0.14em] uppercase text-[#6E7A72]">
                  From
                  <input
                    type="date"
                    value={draftFrom}
                    onChange={(e) => setDraftFrom(e.target.value)}
                    className="mt-1 w-full h-8 rounded-md border border-[#22332F] bg-[#0F1E1D] px-2 text-[12px] text-[#EDF5EC] font-mono focus:outline-none focus:border-[#FFBA1A]"
                  />
                </label>
                <label className="block text-[10px] font-black tracking-[0.14em] uppercase text-[#6E7A72]">
                  To
                  <input
                    type="date"
                    value={draftTo}
                    onChange={(e) => setDraftTo(e.target.value)}
                    className="mt-1 w-full h-8 rounded-md border border-[#22332F] bg-[#0F1E1D] px-2 text-[12px] text-[#EDF5EC] font-mono focus:outline-none focus:border-[#FFBA1A]"
                  />
                </label>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setPopoverOpen(false)}
                    className="h-8 px-3 rounded-md text-[11px] text-[#A1A9A0] hover:text-[#EDF5EC]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!draftFrom || !draftTo}
                    onClick={applyCustom}
                    className="h-8 px-3 rounded-md text-[11px] font-black tracking-[0.06em] uppercase bg-[#FFBA1A] text-[#0F1E1D] disabled:opacity-40"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="inline-flex items-center gap-2">
        <span className="text-[10px] font-black tracking-[0.14em] uppercase text-[#6E7A72]">
          Grain
        </span>
        <select
          value={grain}
          onChange={(e) => onChange({ preset, custom, grain: e.target.value as Grain })}
          className="h-7 rounded-md border border-[#22332F] bg-[#1A2B2A] px-2 text-[11px] text-[#EDF5EC] font-mono focus:outline-none focus:border-[#FFBA1A]"
        >
          {GRAIN_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {prevLabel && (
        <span className="text-[11px] text-[#6E7A72]">vs prior period, {prevLabel}</span>
      )}
    </div>
  );
}
