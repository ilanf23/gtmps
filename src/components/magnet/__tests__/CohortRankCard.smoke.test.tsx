// Smoke tests for the styled CohortRankCard. The data layer is covered
// in src/lib/__tests__/cohort.test.ts; these tests exercise the render
// behavior - silent omission when there are no rows, and the rank +
// percentile copy when there are.

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import type { CohortMetric } from "@/types/cohort";

const fetchCohortMetrics = vi.fn();
vi.mock("@/lib/cohort", () => ({
  fetchCohortMetrics: (firmId: string, cohortKey: string) =>
    fetchCohortMetrics(firmId, cohortKey),
}));

import CohortRankCard, { rankFromPercentile } from "../v10/CohortRankCard";

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
  fetchCohortMetrics.mockReset();
});

describe("CohortRankCard render", () => {
  it("renders nothing when the cohort has no rows", async () => {
    fetchCohortMetrics.mockResolvedValueOnce([]);
    const { container } = render(
      <CohortRankCard firmId="nobody" cohortKey="law" primary="#B8933A" />,
    );
    await waitFor(() => {
      expect(fetchCohortMetrics).toHaveBeenCalledTimes(1);
    });
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when the fetch errors", async () => {
    fetchCohortMetrics.mockRejectedValueOnce(new Error("boom"));
    const { container } = render(
      <CohortRankCard firmId="cravath" cohortKey="law" primary="#B8933A" />,
    );
    await waitFor(() => {
      expect(fetchCohortMetrics).toHaveBeenCalledTimes(1);
    });
    expect(container).toBeEmptyDOMElement();
  });

  it("shows ordinal rank computed from the top metric percentile", async () => {
    fetchCohortMetrics.mockResolvedValueOnce(sampleRows);
    render(
      <CohortRankCard firmId="cravath" cohortKey="law" primary="#B8933A" />,
    );
    // Top metric is 88th percentile across 124 firms - that maps to rank 15.
    expect(await screen.findByText(/You rank 15/)).toBeInTheDocument();
    expect(screen.getByText(/of 124 firms in your cohort/)).toBeInTheDocument();
  });

  it("renders the top metric label as the strongest signal", async () => {
    fetchCohortMetrics.mockResolvedValueOnce(sampleRows);
    render(
      <CohortRankCard firmId="cravath" cohortKey="law" primary="#B8933A" />,
    );
    // The label appears in both the subhead em and the list span.
    const matches = await screen.findAllByText("Relationship Revenue posture");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("renders one progressbar per metric (capped at 3)", async () => {
    fetchCohortMetrics.mockResolvedValueOnce(sampleRows);
    render(
      <CohortRankCard firmId="cravath" cohortKey="law" primary="#B8933A" />,
    );
    const bars = await screen.findAllByRole("progressbar");
    expect(bars).toHaveLength(2);
  });
});

describe("rankFromPercentile", () => {
  it("90th percentile in a cohort of 100 ranks 10th", () => {
    expect(rankFromPercentile(90, 100)).toBe(10);
  });

  it("100th percentile ranks 1st", () => {
    expect(rankFromPercentile(100, 50)).toBe(1);
  });

  it("0th percentile ranks last", () => {
    expect(rankFromPercentile(0, 50)).toBe(50);
  });

  it("clamps percentile out of range", () => {
    expect(rankFromPercentile(150, 100)).toBe(1);
    expect(rankFromPercentile(-10, 100)).toBe(100);
  });

  it("returns 1 when cohort size is zero", () => {
    expect(rankFromPercentile(50, 0)).toBe(1);
  });
});
