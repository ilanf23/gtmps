/**
 * Tests for `fetchCohortMetrics` — data-layer fetcher for the future
 * <CohortRankCard>. Mocks the Supabase client so the test does not
 * require a live database connection.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { CohortMetric } from "@/types/cohort";

// Holders for the mock chain that each test re-wires.
const eqInner = vi.fn();
const eqOuter = vi.fn(() => ({ eq: eqInner }));
const select = vi.fn(() => ({ eq: eqOuter }));
const from = vi.fn(() => ({ select }));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => from(table),
  },
}));

// Imported after the mock so the module under test sees the stub.
import { fetchCohortMetrics, COHORT_METRICS_TABLE } from "../cohort";

const sampleRows: CohortMetric[] = [
  {
    id: "row-1",
    firm_id: "cravath",
    cohort_key: "law",
    metric_key: "relationship_revenue_posture",
    metric_value: 72.5,
    cohort_percentile: 88,
    cohort_size: 124,
    computed_at: "2026-05-01T00:00:00Z",
    created_at: "2026-05-01T00:00:00Z",
  },
  {
    id: "row-2",
    firm_id: "cravath",
    cohort_key: "law",
    metric_key: "content_velocity",
    metric_value: 4.2,
    cohort_percentile: 41,
    cohort_size: 124,
    computed_at: "2026-05-01T00:00:00Z",
    created_at: "2026-05-01T00:00:00Z",
  },
];

beforeEach(() => {
  from.mockClear();
  select.mockClear();
  eqOuter.mockClear();
  eqInner.mockClear();
});

describe("fetchCohortMetrics", () => {
  it("queries the cohort_metrics table with the expected filters", async () => {
    eqInner.mockResolvedValueOnce({ data: sampleRows, error: null });

    const rows = await fetchCohortMetrics("cravath", "law");

    expect(from).toHaveBeenCalledWith(COHORT_METRICS_TABLE);
    expect(select).toHaveBeenCalledWith("*");
    expect(eqOuter).toHaveBeenCalledWith("firm_id", "cravath");
    expect(eqInner).toHaveBeenCalledWith("cohort_key", "law");
    expect(rows).toEqual(sampleRows);
  });

  it("returns an empty array when no rows match", async () => {
    eqInner.mockResolvedValueOnce({ data: [], error: null });

    const rows = await fetchCohortMetrics("nobody", "law");

    expect(rows).toEqual([]);
  });

  it("returns an empty array when data is null (Supabase nullable response)", async () => {
    eqInner.mockResolvedValueOnce({ data: null, error: null });

    const rows = await fetchCohortMetrics("cravath", "law");

    expect(rows).toEqual([]);
  });

  it("re-throws Supabase errors so callers can decide how to surface them", async () => {
    const fakeError = { message: "boom", code: "PGRST116" };
    eqInner.mockResolvedValueOnce({ data: null, error: fakeError });

    await expect(fetchCohortMetrics("cravath", "law")).rejects.toBe(fakeError);
  });

  it("preserves the metric_value and cohort_percentile shape", async () => {
    eqInner.mockResolvedValueOnce({ data: sampleRows, error: null });

    const rows = await fetchCohortMetrics("cravath", "law");

    expect(rows[0].metric_value).toBe(72.5);
    expect(rows[0].cohort_percentile).toBe(88);
    expect(rows[0].cohort_size).toBe(124);
    expect(rows[1].metric_key).toBe("content_velocity");
  });
});
