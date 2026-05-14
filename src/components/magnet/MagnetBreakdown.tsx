// V10 orchestrator for the post-CTA result page (/m/:slug).
// Loads the breakdown + submission, derives client-side scores, picks a CTA
// variant, and renders the 11 V10 sections in order.

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import { useVerticalFlow } from "@/hooks/useVerticalFlow";
import {
  applyDemoBoost,
  computeOrbitScores,
  ctaHeadlineFor,
  profileFromScores,
} from "@/lib/magnetScoring";
import { pickVariant } from "@/content/ctaVariants";
import { trackMagnetEvent } from "@/lib/magnetAnalytics";
import { track } from "@/lib/posthog";
import { displayNameFromSlug } from "@/lib/magnetSlug";
import { getDisplayName } from "@/lib/companyName";
import { shouldForceDarkBodyFallback } from "@/lib/clientTheme";
import { assertReadableBrand } from "@/lib/clientTheme";

import PersonalizedHeader from "./v10/PersonalizedHeader";
import CohortRankCard from "./v10/CohortRankCard";
import FiveOrbitsViz from "./v10/FiveOrbitsViz";
import CoreProofAnalysisSection from "./v10/CoreProofAnalysisSection";
import CompactCtaCard from "./v10/CompactCtaCard";
import WhyResearchMatters from "./v10/WhyResearchMatters";
import ValueInTheirWords from "./v10/ValueInTheirWords";
import FullCtaSection from "./v10/FullCtaSection";
import NotifySignup from "@/components/forms/NotifySignup";
import HighestLeverageMove from "./v10/HighestLeverageMove";
import DeeperFindings from "./v10/DeeperFindings";
import ManuscriptShareSave from "./v10/ManuscriptShareSave";
import ShareAttributionBanner from "./v10/ShareAttributionBanner";
import MobileProgressBar from "./v10/MobileProgressBar";
import StickyShareFab from "./v10/StickyShareFab";
import SectionRail from "@/components/discover/SectionRail";

interface DeeperFindingCard {
  observed?: string | null;
  hypothesis?: string | null;
  question?: string | null;
}

interface DeeperFindingsPayload {
  "10A"?: DeeperFindingCard | null;
  "10B"?: DeeperFindingCard | null;
  "10C"?: DeeperFindingCard | null;
}

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
  deeper_findings?: DeeperFindingsPayload | null;
  client_brand_profile?: {
    palette?: {
      primary?: string | null;
      background?: string | null;
      surface?: string | null;
      text?: string | null;
      textMuted?: string | null;
    } | null;
  } | null;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [brkRes, subRes] = await Promise.all([
        supabase.rpc("get_magnet_breakdown_by_slug", { _slug: slug }),
        supabase.rpc("get_magnet_submission_by_slug", { _slug: slug }),
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
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Derive scores + variant + theme from row data (always called - even when null -
  // so hook order stays stable across loading states).
  const scores = useMemo(() => {
    if (!data) return null;
    const base = computeOrbitScores([
      data.orbit_01,
      data.orbit_02,
      data.orbit_03,
      data.orbit_04,
      data.orbit_05,
    ]);
    return applyDemoBoost(base, slug, data.client_company_name);
  }, [data, slug]);

  const variantId = useMemo(() => {
    if (!scores) return "C" as const;
    return pickVariant({
      vertical: verticalSlug,
      bandOverall: scores.bandOverall,
      dealSizeEstimate: data?.deal_size_estimate ?? null,
    });
  }, [scores, verticalSlug, data?.deal_size_estimate]);

  useEffect(() => {
    if (!data || !scores) return;
    track("magnet_map_rendered", {
      slug,
      score: scores.overall ?? null,
      deal_size_estimate: data.deal_size_estimate
        ? String(data.deal_size_estimate)
        : null,
      cta_variant: variantId ?? null,
    });
  }, [slug, data, scores, variantId]);

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
  //  1. Strip invented dollar figures (the only legitimate $ path is deadZone
  //     Part 3 from real crmEstimate × dealSizeEstimate, which does NOT pass
  //     through this sanitizer; every field that does is supposed to be
  //     dollar-free per the enrich-magnet NUMBERS RULE). Runtime fail-safe.
  //  2. Remove em-dashes / en-dashes per project typography rule (use periods/commas).
  const stripDashes = (s: string): string =>
    s
      .replace(/\s+[–—]\s+/g, ". ")
      .replace(/(\w)[–—](\w)/g, "$1 to $2")
      .replace(/[–—]/g, ",")
      .replace(/\s{2,}/g, " ")
      .trim();

  const STATUS_TAG_RE = /^\s*\[(strong|gap|dormant|untapped)\]\s*/i;

  // Matches a dollar figure plus any leading qualifier ("approximately $X",
  // "an estimated $X", "up to $X") and any trailing claim ("$X in revenue",
  // "$X in Dead Zone value", "$X upside"). Greedy on the noise so the
  // surrounding sentence reads cleanly after removal.
  const MONEY_PHRASE_RE =
    /(?:\b(?:approximately|roughly|around|about|an?\s+estimated|estimated|up\s+to|over|nearly)\s+)?\$\s*\d[\d,.]*\s*[KkMmBb]?\b(?:\s+(?:(?:in|of)\s+)?(?:potential\s+|projected\s+|estimated\s+|incremental\s+)?(?:revenue|pipeline|upside|upsell|value|reactivation|opportunity|recovery|new\s+business|dead\s+zone\s+value|annual\s+recurring\s+revenue|arr))?/gi;

  // Matches fabricated arithmetic like "5 contacts × $7,200" or "12 × $250K".
  const MONEY_ARITHMETIC_RE =
    /\b\d[\d,.]*\s*(?:contacts|leads|relationships|deals|clients|accounts|prospects)?\s*[×x*]\s*\$\s*\d[\d,.]*\s*[KkMmBb]?\b/gi;

  // Cleanup orphaned punctuation/whitespace left behind after stripping.
  const tidyPunctuation = (s: string): string =>
    s
      .replace(/\(\s*\)/g, "")
      .replace(/\s+([.,;:!?])/g, "$1")
      .replace(/([.,;:])(?:\s*\1)+/g, "$1")
      .replace(/\s{2,}/g, " ")
      .trim();

  const sanitizeLLM = (s: string | null | undefined): string | null => {
    if (!s) return null;
    const stripped = s
      .replace(STATUS_TAG_RE, "")
      .replace(MONEY_ARITHMETIC_RE, "")
      .replace(MONEY_PHRASE_RE, "");
    const cleaned = tidyPunctuation(stripDashes(stripped));
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
  // `??` which only catches null/undefined - when enrichment wrote
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

  const sanitizeCard = (
    card: DeeperFindingCard | null | undefined,
  ): DeeperFindingCard | null => {
    if (!card) return null;
    const observed = sanitizeLLM(card.observed);
    const hypothesis = sanitizeLLM(card.hypothesis);
    const question = sanitizeLLM(card.question);
    if (!observed && !hypothesis && !question) return null;
    return { observed, hypothesis, question };
  };
  const sanitizedDeeperFindings = data.deeper_findings
    ? {
        "10A": sanitizeCard(data.deeper_findings["10A"]),
        "10B": sanitizeCard(data.deeper_findings["10B"]),
        "10C": sanitizeCard(data.deeper_findings["10C"]),
      }
    : null;

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

  // ── Dark-body guard - applied to MagnetBreakdown's brand path ──────────
  // assertReadableBrand only rejects when WCAG contrast fails. A dark navy
  // bg with white text passes contrast but still produces an unreadable
  // editorial body (cream-on-ink-designed sections). When the extracted bg
  // is below the dark-body luminance threshold, force body bg to Mabbly
  // cream + ink text. The firm's `primary` accent stays intact for links,
  // button text, and accent rules.
  const brand = shouldForceDarkBodyFallback(readableBrand.background)
    ? { ...readableBrand, background: "#EDF5EC", surface: "#FAF9F5", text: "#0F1E1D", textMuted: "rgba(15, 30, 29,0.6)" }
    : readableBrand;

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
          primary={brand.primary}
          overall={scores.overall}
          band={scores.bandOverall}
          slug={slug}
          onCorrected={(newName) =>
            setData((prev) =>
              prev ? { ...prev, client_company_name: newName } : prev,
            )
          }
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

        <div style={{ padding: '48px 0 32px', textAlign: 'left' }}>
          <header style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2
              style={{
                fontFamily: "'Inter Tight', system-ui, sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(24px, 2.6vw, 32px)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: brand.text,
                margin: '0 0 10px',
              }}
            >
              Two paths forward.
            </h2>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: 'italic',
                fontSize: 'clamp(15px, 1.3vw, 18px)',
                lineHeight: 1.5,
                color: brand.text,
                opacity: 0.7,
                margin: 0,
              }}
            >
              Get scanned by the AI, or talk strategy with the team.
            </p>
          </header>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 20,
            }}
          >
            <NotifySignup
              variant="ai"
              source={`magnet:${slug}`}
              headline="Someone in your market just changed jobs, raised a round, or published."
              sub="Don't miss it. Get your free signal scan, four fields and 60 seconds."
              buttonLabel="Get signal scan"
            />
            <NotifySignup
              variant="com"
              source={`magnet:${slug}`}
              headline="GTM strategy, brand, and content that opens doors."
              sub="Tell us about your firm. We'll show you what's possible."
              buttonLabel="Talk to us"
            />
          </div>
        </div>

        <CoreProofAnalysisSection
          observedCore={sanitizedObserved}
          observedProof={sanitizedAssessment}
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
      </div>

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

      <div className="max-w-[806px] mx-auto px-6 pb-24 ms-centered">
        <DeeperFindings
          customerName={customerName}
          primary={brand.primary}
          slug={slug}
          deeperFindings={sanitizedDeeperFindings}
        />

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
