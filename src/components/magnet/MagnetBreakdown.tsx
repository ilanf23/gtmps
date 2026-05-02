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
import { displayNameFromSlug } from "@/lib/magnetSlug";
import { getDisplayName } from "@/lib/companyName";
import { shouldForceDarkBodyFallback } from "@/lib/clientTheme";
import { assertReadableBrand } from "@/lib/clientTheme";

import PersonalizedHeader from "./v10/PersonalizedHeader";
import CohortRankCard from "./v10/CohortRankCard";
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
  client_logo_url?: string | null;
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
      <div className="min-h-screen bg-[#EDF5EC] flex items-center justify-center">
        <div
          className="w-10 h-10 rounded-full border-2 border-[#A8923A]/30 border-t-[#A8923A] animate-spin"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (error || !data || !scores) {
    return (
      <div className="min-h-screen bg-[#EDF5EC] text-[#0F1E1D] flex items-center justify-center px-6">
        <p className="text-sm opacity-60 text-center max-w-md">
          We couldn't load your breakdown. {error ?? ""}
        </p>
      </div>
    );
  }

  // Universal LLM text sanitizer:
  //  1. Strip invented dollar figures (only real CRM-size x deal-size calcs allowed).
  //  2. Remove em-dashes / en-dashes per project typography rule (use periods/commas).
  const stripDashes = (s: string): string =>
    s
      .replace(/\s+[—–]\s+/g, ". ")
      .replace(/(\w)[—–](\w)/g, "$1 to $2")
      .replace(/[—–]/g, ",")
      .replace(/\s{2,}/g, " ")
      .trim();

  const sanitizeLLM = (s: string | null | undefined): string | null => {
    if (!s) return null;
    const cleaned = stripDashes(
      s.replace(/\s*\$\s*[\d,.]+\s*[KkMm]?\b(?: in (?:potential )?revenue)?/g, ""),
    );
    return cleaned || null;
  };

  const sanitizedOrbits = [
    sanitizeLLM(data.orbit_01),
    sanitizeLLM(data.orbit_02),
    sanitizeLLM(data.orbit_03),
    sanitizeLLM(data.orbit_04),
    sanitizeLLM(data.orbit_05),
  ];

  // Firm-name fallback: never render an empty hero. The previous chain used
  // `??` which only catches null/undefined — when enrichment wrote
  // client_company_name="" (whitespace-trimmed empty), the hero rendered
  // "Your Revenue Map for ___" with no name (the v2 P0 Cravath bug).
  // getDisplayName() handles null, undefined, "", and whitespace.
  const customerName = getDisplayName({
    companyName: data.client_company_name,
    slug,
    fallback: "your firm",
  });

  const sanitizedAction = sanitizeLLM(data.action_1);
  const sanitizedObserved = sanitizeLLM(data.gtm_profile_observed);
  const sanitizedAssessment = sanitizeLLM(data.gtm_profile_assessment);

  // Derive brand palette + run the legibility guard. If the extracted text
  // does not meet WCAG AA contrast against the extracted background, fall
  // back to safe Mabbly defaults (cream + ink), preserving the firm's
  // primary accent when it still reads. See assertReadableBrand for detail.
  const p = data.client_brand_profile?.palette ?? {};
  const rawBrand = {
    primary: pick(p.primary, "#A8923A"),
    background: pick(p.background, "#EDF5EC"),
    surface: pick(p.surface, "#FAF9F5"),
    text: pick(p.text, "#0F1E1D"),
    textMuted: pick(p.textMuted, "#0F1E1D"),
  };
  const { brand: readableBrand } = assertReadableBrand(rawBrand, data.client_company_name);

  // ── Dark-body guard — applied to MagnetBreakdown's brand path ──────────
  // assertReadableBrand only rejects when WCAG contrast fails. A dark navy
  // bg with white text passes contrast but still produces an unreadable
  // editorial body (cream-on-ink-designed sections). When the extracted bg
  // is below the dark-body luminance threshold, force body bg to Mabbly
  // cream + ink text. The firm's `primary` accent stays intact for links,
  // button text, and accent rules.
  const brand = shouldForceDarkBodyFallback(readableBrand.background)
    ? { ...readableBrand, background: "#EDF5EC", surface: "#FAF9F5", text: "#0F1E1D", textMuted: "rgba(15, 30, 29,0.6)" }
    : readableBrand;

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

      <div className="max-w-[806px] mx-auto px-6 pb-24 ms-centered">
        <style>{`
          /* Center all editorial content inside the breakdown column. Headlines,
             body copy, eyebrows, and inline-flex CTA rows are all centered.
             Grid/flex layouts (orbit chips, OHQ panels, share cards) keep their
             own alignment because text-align does not affect their item axis. */
          .ms-centered { text-align: center; }
          .ms-centered .max-w-xl,
          .ms-centered .max-w-prose,
          .ms-centered figure[class*="max-w-"] { margin-left: auto; margin-right: auto; }
          .ms-centered .flex.items-center.gap-2 { justify-content: center; }
          .ms-centered figure[style*="border-left"] {
            border-left: none !important;
            padding-left: 0 !important;
          }
          /* Re-left-align dense card bodies so OHQ panels and share/save cards
             don't read as ransom-notes when text wraps. */
          .ms-centered [class*="bg-[#EDF5EC]"] { text-align: left; }
          .ms-centered [class*="bg-[#EDF5EC]"] .flex.items-center.gap-2 { justify-content: flex-start; }
        `}</style>
        <PersonalizedHeader
          firmName={customerName}
          buildSecondsAgo={buildSecondsAgo}
          bandOverall={scores.bandOverall}
          primary={brand.primary}
        />

        <CohortRankCard
          firmId={slug}
          cohortKey={verticalSlug ?? "default"}
          primary={brand.primary}
        />

        <FiveOrbitsViz
          orbits={sanitizedOrbits}
          perOrbit={scores.perOrbit}
          bandPerOrbit={scores.bandPerOrbit}
          primary={brand.primary}
          clientLogoUrl={data.client_logo_url ?? null}
          calendlyCtx={{
            slug,
            firmName: customerName,
            firstName: submission?.first_name ?? null,
            primary: brand.primary,
            background: brand.background,
            text: brand.text,
          }}
        />

        <CoreAnalysisSection
          observed={sanitizedObserved}
          primary={brand.primary}
          slug={slug}
        />

        <ProofAnalysisSection
          observed={sanitizedAssessment}
          primary={brand.primary}
          slug={slug}
        />

        <CompactCtaCard
          slug={slug}
          vertical={verticalSlug}
          primary={brand.primary}
          background={brand.background}
          text={brand.text}
          customerName={customerName}
          firstName={submission?.first_name ?? null}
        />

        <WhyResearchMatters primary={brand.primary} />

        <ValueInTheirWords primary={brand.primary} />

        <FullCtaSection
          slug={slug}
          vertical={verticalSlug}
          variantId={variantId}
          scoreAdaptiveHeadline={ctaHeadline}
          customerName={customerName}
          firstName={submission?.first_name ?? null}
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

        <section className="pt-10 pb-6 border-t border-black/10 mt-8">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="h-px w-6"
              style={{ backgroundColor: `var(--brand-accent, ${brand.primary})` }}
              aria-hidden
            />
            <p
              className="text-[11px] uppercase tracking-[0.3em] font-semibold opacity-70"
              style={{ color: `var(--brand-accent, ${brand.primary})` }}
            >
              More Resources
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a
              href={`/m/${slug}/chat`}
              className="underline underline-offset-4 hover:opacity-80 transition-opacity"
              style={{ color: `var(--brand-accent, ${brand.primary})` }}
            >
              Talk to the Book →
            </a>
            <a
              href={`/m/${slug}/read`}
              className="underline underline-offset-4 hover:opacity-80 transition-opacity"
              style={{ color: `var(--brand-accent, ${brand.primary})` }}
            >
              Read the Manuscript →
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

// Suppress lint about used-but-not-exported track helper in this file.
void trackMagnetEvent;
