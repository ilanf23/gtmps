import { describe, it, expect } from "vitest";
import {
  resolvePeriod,
  pickGrain,
  parsePeriodFromSearchParams,
  periodToSearchParams,
  easternStartOfDay,
  easternStartOfMonth,
  easternStartOfQuarter,
  easternStartOfYear,
  DEFAULT_PRESET,
} from "../opsTimeRange";

// Reference instant: 2026-05-05 16:30:00 ET = 2026-05-05 20:30:00 UTC (EDT, UTC-4)
const NOW = new Date("2026-05-05T20:30:00.000Z");

describe("easternStartOfDay", () => {
  it("snaps to ET midnight for an EDT instant", () => {
    expect(easternStartOfDay(NOW).toISOString()).toBe("2026-05-05T04:00:00.000Z");
  });

  it("snaps to ET midnight for an EST instant", () => {
    // 2026-01-15 09:00 ET = 14:00 UTC (EST, UTC-5)
    const winter = new Date("2026-01-15T14:00:00.000Z");
    expect(easternStartOfDay(winter).toISOString()).toBe("2026-01-15T05:00:00.000Z");
  });

  it("handles a UTC instant that is the prior day in ET", () => {
    // 2026-05-06 02:00 UTC = 2026-05-05 22:00 ET
    const lateNight = new Date("2026-05-06T02:00:00.000Z");
    expect(easternStartOfDay(lateNight).toISOString()).toBe("2026-05-05T04:00:00.000Z");
  });
});

describe("easternStartOfMonth", () => {
  it("returns May 1 ET for a May ET instant", () => {
    expect(easternStartOfMonth(NOW).toISOString()).toBe("2026-05-01T04:00:00.000Z");
  });

  it("returns Jan 1 ET (EST offset) for a January instant", () => {
    const jan = new Date("2026-01-15T14:00:00.000Z");
    expect(easternStartOfMonth(jan).toISOString()).toBe("2026-01-01T05:00:00.000Z");
  });
});

describe("easternStartOfQuarter", () => {
  it("snaps May 5 to Apr 1 ET (Q2)", () => {
    expect(easternStartOfQuarter(NOW).toISOString()).toBe("2026-04-01T04:00:00.000Z");
  });

  it("snaps Feb 15 to Jan 1 ET (Q1, EST)", () => {
    const feb = new Date("2026-02-15T14:00:00.000Z");
    expect(easternStartOfQuarter(feb).toISOString()).toBe("2026-01-01T05:00:00.000Z");
  });

  it("snaps Aug 10 to Jul 1 ET (Q3)", () => {
    const aug = new Date("2026-08-10T14:00:00.000Z");
    expect(easternStartOfQuarter(aug).toISOString()).toBe("2026-07-01T04:00:00.000Z");
  });

  it("snaps Nov 20 to Oct 1 ET (Q4)", () => {
    const nov = new Date("2026-11-20T14:00:00.000Z");
    expect(easternStartOfQuarter(nov).toISOString()).toBe("2026-10-01T04:00:00.000Z");
  });
});

describe("easternStartOfYear", () => {
  it("snaps to Jan 1 ET (EST offset)", () => {
    expect(easternStartOfYear(NOW).toISOString()).toBe("2026-01-01T05:00:00.000Z");
  });
});

describe("pickGrain", () => {
  const day = 24 * 60 * 60 * 1000;
  it("picks hour for spans up to 2 days", () => {
    expect(pickGrain(0, 1 * day)).toBe("hour");
    expect(pickGrain(0, 2 * day)).toBe("hour");
  });
  it("picks day for spans up to 60 days", () => {
    expect(pickGrain(0, 7 * day)).toBe("day");
    expect(pickGrain(0, 60 * day)).toBe("day");
  });
  it("picks week for spans up to ~366 days", () => {
    expect(pickGrain(0, 90 * day)).toBe("week");
    expect(pickGrain(0, 365 * day)).toBe("week");
  });
  it("picks month beyond a year", () => {
    expect(pickGrain(0, 730 * day)).toBe("month");
  });
});

describe("resolvePeriod", () => {
  it("today: from = ET start-of-day, to = now, prev = matched-length window before", () => {
    const r = resolvePeriod("today", undefined, NOW);
    expect(r.from).toBe("2026-05-05T04:00:00.000Z");
    expect(r.to).toBe(NOW.toISOString());
    expect(r.prevTo).toBe("2026-05-05T04:00:00.000Z");
    // span = 16h30m → prevFrom = 2026-05-04 11:30 UTC
    expect(r.prevFrom).toBe("2026-05-04T11:30:00.000Z");
    expect(r.autoGrain).toBe("hour");
    expect(r.label).toBe("Today");
  });

  it("7d: from = now - 7d, prev = preceding 7d", () => {
    const r = resolvePeriod("7d", undefined, NOW);
    expect(r.from).toBe("2026-04-28T20:30:00.000Z");
    expect(r.to).toBe(NOW.toISOString());
    expect(r.prevTo).toBe("2026-04-28T20:30:00.000Z");
    expect(r.prevFrom).toBe("2026-04-21T20:30:00.000Z");
    expect(r.autoGrain).toBe("day");
    expect(r.label).toBe("Last 7 days");
  });

  it("30d: 30-day rolling window", () => {
    const r = resolvePeriod("30d", undefined, NOW);
    expect(r.from).toBe("2026-04-05T20:30:00.000Z");
    expect(r.autoGrain).toBe("day");
  });

  it("mtd: from = ET start-of-month", () => {
    const r = resolvePeriod("mtd", undefined, NOW);
    expect(r.from).toBe("2026-05-01T04:00:00.000Z");
    expect(r.label).toBe("Month to date");
  });

  it("qtd: from = ET start-of-quarter", () => {
    const r = resolvePeriod("qtd", undefined, NOW);
    expect(r.from).toBe("2026-04-01T04:00:00.000Z");
  });

  it("ytd: from = ET start-of-year", () => {
    const r = resolvePeriod("ytd", undefined, NOW);
    expect(r.from).toBe("2026-01-01T05:00:00.000Z");
    expect(r.autoGrain).toBe("week");
  });

  it("all: prev windows are null", () => {
    const r = resolvePeriod("all", undefined, NOW);
    expect(r.prevFrom).toBeNull();
    expect(r.prevTo).toBeNull();
    expect(r.label).toBe("All time");
    expect(r.autoGrain).toBe("month");
  });

  it("custom: honors provided from/to", () => {
    const r = resolvePeriod(
      "custom",
      { from: "2026-04-01T00:00:00Z", to: "2026-04-15T00:00:00Z" },
      NOW,
    );
    expect(r.from).toBe("2026-04-01T00:00:00.000Z");
    expect(r.to).toBe("2026-04-15T00:00:00.000Z");
    expect(r.prevFrom).toBe("2026-03-18T00:00:00.000Z");
    expect(r.prevTo).toBe("2026-04-01T00:00:00.000Z");
  });

  it("custom: swaps reversed from/to", () => {
    const r = resolvePeriod(
      "custom",
      { from: "2026-04-15T00:00:00Z", to: "2026-04-01T00:00:00Z" },
      NOW,
    );
    expect(r.from).toBe("2026-04-01T00:00:00.000Z");
    expect(r.to).toBe("2026-04-15T00:00:00.000Z");
  });
});

describe("parsePeriodFromSearchParams", () => {
  it("returns default when no period param", () => {
    const sp = new URLSearchParams("");
    const p = parsePeriodFromSearchParams(sp);
    expect(p.preset).toBe(DEFAULT_PRESET);
    expect(p.grain).toBe("auto");
  });

  it("parses preset, grain, custom range", () => {
    const sp = new URLSearchParams("?period=custom&from=2026-04-01&to=2026-04-15&grain=week");
    const p = parsePeriodFromSearchParams(sp);
    expect(p.preset).toBe("custom");
    expect(p.from).toBe("2026-04-01");
    expect(p.to).toBe("2026-04-15");
    expect(p.grain).toBe("week");
  });

  it("falls back to default for unknown preset", () => {
    const sp = new URLSearchParams("?period=garbage");
    expect(parsePeriodFromSearchParams(sp).preset).toBe(DEFAULT_PRESET);
  });

  it("falls back to auto for unknown grain", () => {
    const sp = new URLSearchParams("?grain=fortnight");
    expect(parsePeriodFromSearchParams(sp).grain).toBe("auto");
  });
});

describe("periodToSearchParams", () => {
  it("omits period for the default preset", () => {
    expect(periodToSearchParams(DEFAULT_PRESET)).toEqual({});
  });

  it("emits period for non-default preset", () => {
    expect(periodToSearchParams("30d")).toEqual({ period: "30d" });
  });

  it("emits from/to only for custom", () => {
    expect(
      periodToSearchParams("custom", { from: "2026-04-01", to: "2026-04-15" }),
    ).toEqual({ period: "custom", from: "2026-04-01", to: "2026-04-15" });
  });

  it("emits grain only when not auto", () => {
    expect(periodToSearchParams("30d", undefined, "week")).toEqual({
      period: "30d",
      grain: "week",
    });
    expect(periodToSearchParams("30d", undefined, "auto")).toEqual({ period: "30d" });
  });
});
