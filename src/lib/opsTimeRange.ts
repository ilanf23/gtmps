// Time-range resolution for the /ops Overview filter.
//
// All boundary math (start of day, month, quarter, year) is done in
// America/New_York wall-clock so that a Mabbly operator's "today" matches
// what they'd see on a wall clock, not UTC. The resolved from/to values
// are returned as UTC ISO strings for transport over the wire.

export type PeriodPreset =
  | "today"
  | "7d"
  | "30d"
  | "90d"
  | "mtd"
  | "qtd"
  | "ytd"
  | "all"
  | "custom";

export type Grain = "auto" | "hour" | "day" | "week" | "month";
export type ResolvedGrain = Exclude<Grain, "auto">;

export interface ResolvedPeriod {
  preset: PeriodPreset;
  from: string;
  to: string;
  prevFrom: string | null;
  prevTo: string | null;
  autoGrain: ResolvedGrain;
  label: string;
  prevLabel: string | null;
}

export const TZ = "America/New_York";
export const EPOCH = "1970-01-01T00:00:00.000Z";
export const DEFAULT_PRESET: PeriodPreset = "7d";

const PRESET_ORDER: PeriodPreset[] = [
  "today",
  "7d",
  "30d",
  "90d",
  "mtd",
  "qtd",
  "ytd",
  "all",
  "custom",
];

export const PRESET_LABELS: Record<PeriodPreset, string> = {
  today: "Today",
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
  mtd: "MTD",
  qtd: "QTD",
  ytd: "YTD",
  all: "All time",
  custom: "Custom",
};

export const PRESET_LIST = PRESET_ORDER;

interface EasternParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

function easternParts(d: Date): EasternParts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(d);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? "0");
  // Intl can return "24" for hour at midnight in some engines; normalize.
  const hour = get("hour") % 24;
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour,
    minute: get("minute"),
    second: get("second"),
  };
}

// Returns the UTC Date that corresponds to a given Eastern wall-clock time.
// The trick: pick a UTC time with the same numeric components, ask "what
// wall-clock would that UTC reading produce in Eastern", then subtract the
// drift. Handles DST automatically because Intl honors the tz at that instant.
function easternToUTC(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): Date {
  const guessMs = Date.UTC(year, month - 1, day, hour, minute, second);
  const ep = easternParts(new Date(guessMs));
  const easternMs = Date.UTC(ep.year, ep.month - 1, ep.day, ep.hour, ep.minute, ep.second);
  const offset = guessMs - easternMs;
  return new Date(guessMs + offset);
}

export function easternStartOfDay(d: Date): Date {
  const ep = easternParts(d);
  return easternToUTC(ep.year, ep.month, ep.day, 0, 0, 0);
}

export function easternStartOfMonth(d: Date): Date {
  const ep = easternParts(d);
  return easternToUTC(ep.year, ep.month, 1, 0, 0, 0);
}

export function easternStartOfQuarter(d: Date): Date {
  const ep = easternParts(d);
  const qStartMonth = Math.floor((ep.month - 1) / 3) * 3 + 1;
  return easternToUTC(ep.year, qStartMonth, 1, 0, 0, 0);
}

export function easternStartOfYear(d: Date): Date {
  const ep = easternParts(d);
  return easternToUTC(ep.year, 1, 1, 0, 0, 0);
}

export function pickGrain(fromMs: number, toMs: number): ResolvedGrain {
  const days = (toMs - fromMs) / (24 * 60 * 60 * 1000);
  if (days <= 2) return "hour";
  if (days <= 60) return "day";
  if (days <= 366) return "week";
  return "month";
}

function shortDate(d: Date): string {
  const ep = easternParts(d);
  return `${ep.month.toString().padStart(2, "0")}/${ep.day.toString().padStart(2, "0")}`;
}

function formatLabel(preset: PeriodPreset, from: Date, to: Date): string {
  if (preset === "all") return "All time";
  if (preset === "today") return "Today";
  if (preset === "7d") return "Last 7 days";
  if (preset === "30d") return "Last 30 days";
  if (preset === "90d") return "Last 90 days";
  if (preset === "mtd") return "Month to date";
  if (preset === "qtd") return "Quarter to date";
  if (preset === "ytd") return "Year to date";
  return `${shortDate(from)} to ${shortDate(to)}`;
}

function isoOrNull(d: Date | null): string | null {
  return d ? d.toISOString() : null;
}

export interface CustomRange {
  from?: string;
  to?: string;
}

export function resolvePeriod(
  preset: PeriodPreset,
  custom?: CustomRange,
  now: Date = new Date(),
): ResolvedPeriod {
  let from: Date;
  let to: Date = now;

  switch (preset) {
    case "today":
      from = easternStartOfDay(now);
      break;
    case "7d":
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "mtd":
      from = easternStartOfMonth(now);
      break;
    case "qtd":
      from = easternStartOfQuarter(now);
      break;
    case "ytd":
      from = easternStartOfYear(now);
      break;
    case "all":
      from = new Date(EPOCH);
      break;
    case "custom": {
      const f = custom?.from ? new Date(custom.from) : null;
      const t = custom?.to ? new Date(custom.to) : null;
      from = f && !isNaN(f.getTime()) ? f : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      to = t && !isNaN(t.getTime()) ? t : now;
      if (from.getTime() > to.getTime()) [from, to] = [to, from];
      break;
    }
    default:
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  let prevFrom: Date | null = null;
  let prevTo: Date | null = null;
  if (preset !== "all") {
    const span = to.getTime() - from.getTime();
    prevTo = new Date(from.getTime());
    prevFrom = new Date(from.getTime() - span);
  }

  const autoGrain = pickGrain(from.getTime(), to.getTime());
  const label = formatLabel(preset, from, to);
  const prevLabel = prevFrom && prevTo ? `${shortDate(prevFrom)} to ${shortDate(prevTo)}` : null;

  return {
    preset,
    from: from.toISOString(),
    to: to.toISOString(),
    prevFrom: isoOrNull(prevFrom),
    prevTo: isoOrNull(prevTo),
    autoGrain,
    label,
    prevLabel,
  };
}

export interface ParsedPeriodParams {
  preset: PeriodPreset;
  from?: string;
  to?: string;
  grain: Grain;
}

export function parsePeriodFromSearchParams(sp: URLSearchParams): ParsedPeriodParams {
  const rawPreset = sp.get("period");
  const preset: PeriodPreset = (PRESET_ORDER as string[]).includes(rawPreset ?? "")
    ? (rawPreset as PeriodPreset)
    : DEFAULT_PRESET;
  const from = sp.get("from") ?? undefined;
  const to = sp.get("to") ?? undefined;
  const rawGrain = sp.get("grain");
  const grain: Grain = (["auto", "hour", "day", "week", "month"] as Grain[]).includes(
    rawGrain as Grain,
  )
    ? (rawGrain as Grain)
    : "auto";
  return { preset, from, to, grain };
}

export function periodToSearchParams(
  preset: PeriodPreset,
  custom?: CustomRange,
  grain: Grain = "auto",
): Record<string, string> {
  const out: Record<string, string> = {};
  if (preset !== DEFAULT_PRESET) out.period = preset;
  if (preset === "custom") {
    if (custom?.from) out.from = custom.from;
    if (custom?.to) out.to = custom.to;
  }
  if (grain !== "auto") out.grain = grain;
  return out;
}

export function effectiveGrain(resolved: ResolvedPeriod, requested: Grain): ResolvedGrain {
  return requested === "auto" ? resolved.autoGrain : requested;
}

export function formatBucketLabel(bucket: string, grain: ResolvedGrain): string {
  // bucket is server-emitted; format by grain.
  if (grain === "hour") {
    // "2026-05-05T14:00" → "5/5 14:00" or just "14:00" if same day as next bucket
    const datePart = bucket.slice(5, 10).replace("-", "/");
    const timePart = bucket.slice(11, 16);
    return `${datePart} ${timePart}`;
  }
  if (grain === "month") return bucket; // "2026-05"
  if (grain === "week") return bucket.slice(5); // "MM-DD" of week start
  return bucket.slice(5); // day: "MM-DD"
}
