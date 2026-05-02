// /m/:slug/cohort — standalone cohort-comparison page.
//
// Spec: §9.1.3 / §9.2.14 of the audit. Composes CohortCompareWidget
// (radar + percentile rail) under the existing MagnetShell so the
// per-firm theme, top-nav, and footer all carry over from /m/:slug.

import { useParams, useSearchParams } from "react-router-dom";
import MagnetShell from "@/components/magnet/MagnetShell";
import CohortCompareWidget from "@/components/magnet/v10/CohortCompareWidget";
import { useClientTheme } from "@/hooks/useClientTheme";
import { useVerticalFlow } from "@/hooks/useVerticalFlow";

export default function MagnetCohortPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const urlVertical = searchParams.get("vertical");
  const theme = useClientTheme(slug);
  const { slug: verticalSlug } = useVerticalFlow(urlVertical);

  if (!slug) return null;

  return (
    <MagnetShell>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "clamp(40px, 6vw, 80px) clamp(24px, 4vw, 48px)",
        }}
      >
        <header style={{ marginBottom: 48, maxWidth: 720 }}>
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: theme.accent,
              margin: 0,
              fontWeight: 500,
            }}
          >
            How you compare
          </p>
          <div
            aria-hidden
            style={{
              width: 44,
              height: 2,
              background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}33)`,
              margin: "18px 0 28px",
            }}
          />
          <h1
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 500,
              color: theme.text,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              margin: "0 0 18px",
            }}
          >
            Where your firm sits in the cohort.
          </h1>
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: "clamp(16px, 1.4vw, 18px)",
              color: theme.text,
              opacity: 0.66,
              lineHeight: 1.55,
              margin: 0,
              fontWeight: 400,
            }}
          >
            Pentagonal radar against the peer-median polygon. Per-metric
            percentile rails on the right. Same data behind your MAP, just
            framed for direct comparison.
          </p>
        </header>

        <CohortCompareWidget
          firmId={slug}
          cohortKey={verticalSlug ?? "default"}
          primary={theme.accent}
        />
      </div>
    </MagnetShell>
  );
}
