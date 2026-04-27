// V10 orchestrator for the post-CTA result page (/m/:slug).
// Loads the breakdown + submission, derives client-side scores, picks a CTA
// variant, and renders the 11 V10 sections in order.

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import { useVerticalFlow } from "@/hooks/useVerticalFlow";
import {
  computeOrbitScores,
  ctaHeadlineFor,
  profileFromScores,
} from "@/lib/magnetScoring";
import { pickVariant } from "@/content/ctaVariants";
import { trackMagnetEvent } from "@/lib/magnetAnalytics";

import PersonalizedHeader from "./v10/PersonalizedHeader";
import FiveOrbitsViz from "./v10/FiveOrbitsViz";
import CoreAnalysisSection from "./v10/CoreAnalysisSection";
import ProofAnalysisSection from "./v10/ProofAnalysisSection";
import CompactCtaCard from "./v10/CompactCtaCard";
import WhyResearchMatters from "./v10/WhyResearchMatters";
import ValueInTheirWords from "./v10/ValueInTheirWords";
import FullCtaSection from "./v10/FullCtaSection";
import HighestLeverageMove from "./v10/HighestLeverageMove";
import DeeperFindings from "./v10/DeeperFindings";
import ManuscriptShareSave from "./v10/ManuscriptShareSave";
import ShareAttributionBanner from "./v10/ShareAttributionBanner";
import MobileProgressBar from "./v10/MobileProgressBar";
import StickyShareFab from "./v10/StickyShareFab";
import SectionRail from "@/components/discover/SectionRail";

interface BreakdownRow {
  welcome_message: string | null;
  gtm_profile_observed: string | null;
  gtm_profile_assessment: string | null;
  orbit_01: string | null;
  orbit_02: string | null;
  orbit_03: string | null;
  orbit_04: string | null;
  orbit_05: string | null;
  action_1: string | null;
  enrichment_error: string | null;
  client_company_name?: string | null;
  deal_size_estimate?: number | null;
  client_brand_profile?: {
    palette?: {
      primary?: string | null;
      background?: string | null;
      surface?: string | null;
      text?: string | null;
      textMuted?: string | null;
    } | null;
  } | null;
  created_at?: string;
}

interface SubmissionRow {
  first_name: string | null;
  share_token: string | null;
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/;
const isHex = (v: unknown): v is string =>
  typeof v === "string" && HEX_RE.test(v.trim());
const pick = (v: unknown, fallback: string): string =>
  isHex(v) ? (v as string).trim() : fallback;

export default function MagnetBreakdown({
  slug,
  vertical,
  shareId,
}: {
  slug: string;
  vertical?: string | null;
  shareId?: string | null;
}) {
  const { flow, slug: verticalSlug } = useVerticalFlow(vertical);
  const [data, setData] = useState<BreakdownRow | null>(null);
  const [submission, setSubmission] = useState<SubmissionRow | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [brkRes, subRes, brkRowRes] = await Promise.all([
        supabase.rpc("get_magnet_breakdown_by_slug", { _slug: slug }),
        supabase.rpc("get_magnet_submission_by_slug", { _slug: slug }),
        supabase
          .from("magnet_breakdowns")
          .select("created_at")
          .eq("slug", slug)
          .maybeSingle(),
      ]);

      if (cancelled) return;

      const row = Array.isArray(brkRes.data) ? brkRes.data[0] : null;
      const sub = Array.isArray(subRes.data) ? subRes.data[0] : null;

      if (brkRes.error) {
        setError(brkRes.error.message);
      } else if (!row) {
        setError("Breakdown not found.");
      } else if (row.enrichment_error) {
        setError(row.enrichment_error);
      } else {
        setData(row as unknown as BreakdownRow);
        setSubmission((sub as SubmissionRow) ?? null);
        setCreatedAt(brkRowRes.data?.created_at ?? null);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Derive scores + variant + theme from row data (always called — even when null —
  // so hook order stays stable across loading states).
  const scores = useMemo(() => {
    if (!data) return null;
    return computeOrbitScores([
      data.orbit_01,
      data.orbit_02,
      data.orbit_03,
      data.orbit_04,
      data.orbit_05,
    ]);
  }, [data]);

  const variantId = useMemo(() => {
    if (!scores) return "C" as const;
    return pickVariant({
      vertical: verticalSlug,
      bandOverall: scores.bandOverall,
      dealSizeEstimate: data?.deal_size_estimate ?? null,
    });
  }, [scores, verticalSlug, data?.deal_size_estimate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF8F4] flex items-center justify-center">
        <div
          className="w-10 h-10 rounded-full border-2 border-[#B8933A]/30 border-t-[#B8933A] animate-spin"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (error || !data || !scores) {
    return (
      <div className="min-h-screen bg-[#FBF8F4] text-[#1C1008] flex items-center justify-center px-6">
        <p className="text-sm opacity-60 text-center max-w-md">
          We couldn't load your breakdown. {error ?? ""}
        </p>
      </div>
    );
  }

  const orbits = [
    data.orbit_01,
    data.orbit_02,
    data.orbit_03,
    data.orbit_04,
    data.orbit_05,
  ];

  const customerName = data.client_company_name ?? "your firm";

  // Strip any LLM-invented dollar figures from the recommended action — never
  // surface a $ number unless it ties to a real CRM-size × deal-size calc.
  const sanitizedAction = (data.action_1 ?? "").replace(
    /\s*\$\s*[\d,.]+\s*[KkMm]?\b(?: in (?:potential )?revenue)?/g,
    "",
  ).replace(/\s{2,}/g, " ").trim() || null;

  // Derive brand palette
  const p = data.client_brand_profile?.palette ?? {};
  const brand = {
    primary: pick(p.primary, "#B8933A"),
    background: pick(p.background, "#FBF8F4"),
    surface: pick(p.surface, "#FFFFFF"),
    text: pick(p.text, "#1C1008"),
    textMuted: pick(p.textMuted, "#1C1008"),
  };

  // "Built X seconds ago" — only meaningful for first 5 minutes
  const buildSecondsAgo = createdAt
    ? Math.max(
        1,
        Math.min(
          299,
          Math.round((Date.now() - new Date(createdAt).getTime()) / 1000)
        )
      )
    : null;

  // Score-adaptive Section 8 headline
  const findingProfile = profileFromScores(scores);
  const ctaHeadline = ctaHeadlineFor(findingProfile);

  // Share attribution: only show when ?share_id matches the persisted token
  const showAttribution =
    Boolean(shareId) &&
    Boolean(submission?.share_token) &&
    shareId === submission?.share_token;

  // Section progress nav rail items (11 v10 sections).
  const railItems = [
    { id: "v10-section-1", label: "Profile" },
    { id: "v10-section-2", label: "Orbits" },
    { id: "v10-section-3", label: "Core" },
    { id: "v10-section-4", label: "Proof" },
    { id: "v10-section-5", label: "Skip ahead" },
    { id: "v10-section-6", label: "Research" },
    { id: "v10-section-7", label: "Voices" },
    { id: "v10-section-8", label: "Book Adam" },
    { id: "v10-section-9", label: "Leverage" },
    { id: "v10-section-10", label: "Deeper" },
    { id: "v10-section-11", label: "Share" },
  ];

  const handleStickyShare = () => {
    trackMagnetEvent(slug, "share_click", { channel: "fab", vertical: verticalSlug });
    window.dispatchEvent(new CustomEvent("v10:share-copy"));
  };

  return (
    <div
      style={{
        backgroundColor: brand.background,
        color: brand.text,
      }}
      className="min-h-screen"
    >
      {showAttribution && (
        <ShareAttributionBanner
          fromName={submission?.first_name ?? null}
          fromFirm={data.client_company_name ?? null}
          primary={brand.primary}
        />
      )}

      <SectionRail items={railItems} />
      <MobileProgressBar />
      <StickyShareFab onClick={handleStickyShare} />

      <div className="max-w-2xl mx-auto px-6 pb-24">
        <PersonalizedHeader
          firmName={customerName}
          buildSecondsAgo={buildSecondsAgo}
          bandOverall={scores.bandOverall}
          primary={brand.primary}
        />

        <FiveOrbitsViz
          orbits={orbits}
          perOrbit={scores.perOrbit}
          bandPerOrbit={scores.bandPerOrbit}
          primary={brand.primary}
        />

        <CoreAnalysisSection
          observed={data.gtm_profile_observed}
          primary={brand.primary}
        />

        <ProofAnalysisSection
          observed={data.gtm_profile_assessment}
          primary={brand.primary}
        />

        <CompactCtaCard
          slug={slug}
          vertical={verticalSlug}
          primary={brand.primary}
        />

        <WhyResearchMatters primary={brand.primary} />

        <ValueInTheirWords primary={brand.primary} />

        <FullCtaSection
          slug={slug}
          vertical={verticalSlug}
          variantId={variantId}
          scoreAdaptiveHeadline={ctaHeadline}
          customerName={customerName}
          primary={brand.primary}
          background={brand.background}
          text={brand.text}
          calendarCta={flow.calendarCta}
        />

        <HighestLeverageMove
          profile={findingProfile}
          customerName={customerName}
          recommendedAction={sanitizedAction}
          primary={brand.primary}
        />

        <DeeperFindings customerName={customerName} primary={brand.primary} />

        <ManuscriptShareSave
          slug={slug}
          shareToken={submission?.share_token ?? null}
          vertical={verticalSlug}
          customerName={customerName}
          fromName={submission?.first_name ?? null}
          primary={brand.primary}
          emailSubject={flow.emailSubject}
          shareTemplate={flow.shareTemplate}
        />
      </div>
    </div>
  );
}

// Suppress lint about used-but-not-exported track helper in this file.
void trackMagnetEvent;
