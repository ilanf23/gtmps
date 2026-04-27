import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import MagnetImpactModel from "./MagnetImpactModel";
// MagnetChat was replaced by the dedicated /m/:slug/chat page in MagnetShell.

interface ChapterCallout {
  /** Preferred: numeric chapter (1–14). */
  chapter_number?: number;
  /** Legacy/fallback: e.g. "Ch.1 — The Dead Zone". */
  chapter?: string;
  callout: string;
}

interface BreakdownRow {
  welcome_message: string | null;
  dead_zone_value: number | null;
  dead_zone_reasoning: string | null;
  gtm_profile_observed: string | null;
  gtm_profile_assessment: string | null;
  orbit_01: string | null;
  orbit_02: string | null;
  orbit_03: string | null;
  orbit_04: string | null;
  orbit_05: string | null;
  recommended_layer: string | null;
  action_1: string | null;
  action_2: string | null;
  action_3: string | null;
  chapter_callouts: ChapterCallout[] | null;
  enrichment_error: string | null;
  client_logo_url?: string | null;
  client_company_name?: string | null;
  crm_estimate?: number | null;
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
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/;
const isHex = (v: unknown): v is string =>
  typeof v === "string" && HEX_RE.test(v.trim());
const pick = (v: unknown, fallback: string): string =>
  isHex(v) ? (v as string).trim() : fallback;

interface SubmissionRow {
  first_name: string | null;
}

const CHAPTERS = [
  {
    number: 0,
    title: "Preface: Start Here",
    summary: "Why two operators wrote this book, and what it is not.",
  },
  {
    number: 1,
    title: "Ch1: The Dead Zone",
    summary:
      "Why 60 to 96% of your CRM is sleeping and what it costs you every quarter.",
  },
  {
    number: 2,
    title: "Ch2: The Wrong Map",
    summary:
      "The GTM playbook built for product companies is actively harming PS firms.",
  },
  {
    number: 3,
    title: "Ch3: The Formula",
    summary:
      "Signal + Proof + Context = Response, Not Pitch. The $400K email in 7 minutes.",
  },
  {
    number: 4,
    title: "Ch4: The Five Truths, The Core, and The Orbit Model",
    summary:
      "Your next client already knows you. The system for activating who you already own.",
  },
  {
    number: 5,
    title: "Ch5: DISCOVER",
    summary:
      "The Discovery Session. The MAP artifact. What you must know before any motion starts.",
  },
  {
    number: 6,
    title: "Ch6: PROVE",
    summary:
      "Why most PS firms can't close, and how to fix the proof library in 7 days.",
  },
  {
    number: 7,
    title: "Ch7: DESIGN",
    summary:
      "ICP, signal matrix, channel architecture. The beachhead that makes everything else work.",
  },
  {
    number: 8,
    title: "Ch8: ACTIVATE",
    summary:
      "Signal-activated outreach. When to reach out, what to say, and why it works.",
  },
  {
    number: 9,
    title: "Ch9: COMPOUND",
    summary:
      "What it looks like when the system runs on its own and gets stronger over time.",
  },
  {
    number: 10,
    title: "Ch10: The Orbit Implementation Playbook",
    summary:
      "Orbit by orbit, the exact steps to activate ⊙01 through ⊙05 in sequence.",
  },
  {
    number: 11,
    title: "Ch11: The MAP Template + Discovery Session Guide",
    summary:
      "The 12-field artifact that replaces your pitch deck. Run it yourself.",
  },
  {
    number: 12,
    title: "Ch12: Tools, Calculators, and Self Assessment",
    summary:
      "Every framework, every calculator, every template. Built for Monday morning.",
  },
  {
    number: 13,
    title: "Closing: The Three Laws (Revisited)",
    summary:
      "The three laws every PS firm must respect to make the system compound.",
  },
];

const getChapterNumber = (c: ChapterCallout): number | null => {
  if (typeof c.chapter_number === "number") return c.chapter_number;
  if (c.chapter) {
    const m = c.chapter.match(/\d+/);
    if (m) return parseInt(m[0], 10);
  }
  return null;
};

const ORBIT_NAMES = [
  "Core Proof",
  "Active",
  "Dead Zone",
  "Warm Adjacency",
  "New Gravity",
];

const LAYERS = ["DISCOVER", "PROVE", "DESIGN", "ACTIVATE", "COMPOUND"];

const splitAction = (text: string): { title: string; description: string } => {
  const trimmed = text.trim();
  // Try splitting on first sentence-ending punctuation
  const match = trimmed.match(/^(.{6,90}?[.:—–])\s+(.+)$/);
  if (match) {
    return {
      title: match[1].replace(/[.:—–]\s*$/, ""),
      description: match[2],
    };
  }
  // Fallback: first ~7 words as title
  const words = trimmed.split(/\s+/);
  if (words.length <= 8) return { title: trimmed, description: "" };
  return {
    title: words.slice(0, 7).join(" "),
    description: words.slice(7).join(" "),
  };
};

export default function MagnetBreakdown({ slug }: { slug: string }) {
  const navigate = useNavigate();
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

  if (error || !data) {
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

  const actions = [data.action_1, data.action_2, data.action_3].filter(
    (a): a is string => Boolean(a && a.trim())
  );

  const recommended = (data.recommended_layer ?? "DISCOVER").toUpperCase();

  const recommendedIndex = Math.max(0, LAYERS.indexOf(recommended));
  const customerName = data.client_company_name ?? "your firm";
  const writtenChapters = (data.chapter_callouts ?? []).filter((c) =>
    Boolean(c.callout && c.callout.trim())
  ).length;

  // Derive firm brand palette with safe fallbacks to existing Mabbly look.
  const p = data.client_brand_profile?.palette ?? {};
  const brand = {
    primary: pick(p.primary, "#B8933A"),
    background: pick(p.background, "#FBF8F4"),
    surface: pick(p.surface, "#FFFFFF"),
    text: pick(p.text, "#1C1008"),
    textMuted: pick(p.textMuted, "#1C1008"),
  };
  const isDarkBg = (() => {
    const m = brand.background.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!m) return false;
    const r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
  })();
  // Subtle alpha tints derived from primary using 8-digit hex.
  const tint = (alpha: string) => brand.primary + alpha;
  // Neutral border that adapts to bg luminance.
  const neutralBorder = isDarkBg ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)";
  const neutralBorderSoft = isDarkBg ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";

  return (
    <div
      style={{
        ["--brand-primary" as string]: brand.primary,
        ["--brand-bg" as string]: brand.background,
        ["--brand-surface" as string]: brand.surface,
        ["--brand-text" as string]: brand.text,
        ["--brand-text-muted" as string]: brand.textMuted,
        backgroundColor: brand.background,
        color: brand.text,
      } as React.CSSProperties}
      className="min-h-screen magnet-themed"
      data-magnet-theme
    >
      <style
        // Scoped overrides: remap the hardcoded Mabbly palette to the firm's brand palette
        // wherever it appears as a Tailwind arbitrary-value class, while leaving everything else intact.
        dangerouslySetInnerHTML={{
          __html: `
[data-magnet-theme] .bg-\\[\\#FBF8F4\\] { background-color: ${brand.surface} !important; }
[data-magnet-theme] .text-\\[\\#1C1008\\] { color: ${brand.text} !important; }
[data-magnet-theme] .text-\\[\\#FBF8F4\\] { color: ${brand.text} !important; }
[data-magnet-theme] .text-\\[\\#B8933A\\] { color: ${brand.primary} !important; }
[data-magnet-theme] .bg-\\[\\#B8933A\\] { background-color: ${brand.primary} !important; }
[data-magnet-theme] .bg-\\[\\#B8933A\\]\\/10 { background-color: ${tint("1A")} !important; }
[data-magnet-theme] .bg-\\[\\#B8933A\\]\\/15 { background-color: ${tint("26")} !important; }
[data-magnet-theme] .bg-\\[\\#B8933A\\]\\/20 { background-color: ${tint("33")} !important; }
[data-magnet-theme] .bg-\\[\\#B8933A\\]\\/5 { background-color: ${tint("0D")} !important; }
[data-magnet-theme] .border-\\[\\#B8933A\\] { border-color: ${brand.primary} !important; }
[data-magnet-theme] .border-\\[\\#B8933A\\]\\/30 { border-color: ${tint("4D")} !important; }
[data-magnet-theme] .border-\\[\\#B8933A\\]\\/40 { border-color: ${tint("66")} !important; }
[data-magnet-theme] .border-\\[\\#B8933A\\]\\/50 { border-color: ${tint("80")} !important; }
[data-magnet-theme] .border-\\[\\#B8933A\\]\\/30 { border-color: ${tint("4D")} !important; }
[data-magnet-theme] .hover\\:bg-\\[\\#B8933A\\]\\/10:hover { background-color: ${tint("1A")} !important; }
[data-magnet-theme] .hover\\:bg-\\[\\#a07c2e\\]:hover { background-color: ${brand.primary} !important; filter: brightness(0.9); }
[data-magnet-theme] .hover\\:border-\\[\\#B8933A\\]\\/40:hover { border-color: ${tint("66")} !important; }
[data-magnet-theme] .text-\\[\\#120D05\\] { color: ${isDarkBg ? brand.background : "#FFFFFF"} !important; }
[data-magnet-theme] .border-\\[\\#B8933A\\]\\/50 { border-color: ${tint("80")} !important; }
[data-magnet-theme] .border-black\\/5 { border-color: ${neutralBorderSoft} !important; }
[data-magnet-theme] .border-black\\/10 { border-color: ${neutralBorder} !important; }
[data-magnet-theme] .border-t.border-black\\/10 { border-color: ${neutralBorder} !important; }
[data-magnet-theme] .bg-black\\/\\[0\\.03\\] { background-color: ${isDarkBg ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"} !important; }
[data-magnet-theme] .bg-black\\/\\[0\\.04\\] { background-color: ${isDarkBg ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"} !important; }
[data-magnet-theme] .bg-black\\/10 { background-color: ${isDarkBg ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)"} !important; }
[data-magnet-theme] .bg-black\\/5 { background-color: ${isDarkBg ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"} !important; }
[data-magnet-theme] .text-black\\/30 { color: ${brand.textMuted} !important; opacity: 0.6; }
[data-magnet-theme] .text-black\\/20 { color: ${brand.textMuted} !important; opacity: 0.45; }
[data-magnet-theme] .bg-white\\/10 { background-color: ${isDarkBg ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"} !important; }
[data-magnet-theme] .border-white\\/10 { border-color: ${isDarkBg ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)"} !important; }
[data-magnet-theme] .accent-\\[\\#B8933A\\] { accent-color: ${brand.primary} !important; }
[data-magnet-theme] .bg-\\[\\#B8933A\\]\\/40 { background-color: ${tint("66")} !important; }
[data-magnet-theme] .border-\\[\\#B8933A\\]\\/50 { border-color: ${tint("80")} !important; }
          `,
        }}
      />
      <div className="max-w-2xl mx-auto px-6 pb-24">
        {/* Full reveal — no gate, no blur. */}
        <div id="magnet-full-reveal">
        {/* SECTION 1: PERSONAL HEADER */}
        <section className="pt-16 pb-12 border-b border-black/10">
          {data.client_logo_url ? (
            <div className="mb-8 flex items-center gap-3">
              <img
                src={data.client_logo_url}
                alt={data.client_company_name ? `${data.client_company_name} logo` : "Logo"}
                className="h-10 w-auto max-w-[200px] object-contain"
                onLoad={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  const w = img.naturalWidth;
                  const h = img.naturalHeight;
                  if (!w || !h) return;
                  const ratio = w / h;
                  if (ratio > 5 || ratio < 0.5) {
                    img.style.display = "none";
                  }
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              {data.client_company_name ? (
                <>
                  <span className="h-5 w-px bg-black/15" aria-hidden />
                  <span className="text-xs uppercase tracking-[0.28em] opacity-60">
                    {data.client_company_name}
                  </span>
                </>
              ) : null}
            </div>
          ) : null}
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-6 bg-[#B8933A]" aria-hidden />
            <p className="text-[#B8933A] text-[11px] uppercase tracking-[0.3em] font-semibold">
              Your Personalized RROS Breakdown
            </p>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-[1.15] tracking-tight">
            {data.welcome_message ?? "Your GTM breakdown."}
          </h1>

          {/* Snapshot strip */}
          <div className="mt-8 grid grid-cols-3 gap-px bg-black/10 border border-black/10">
            <div className="bg-[#FBF8F4] p-4">
              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1.5">Firm</p>
              <p className="text-sm font-semibold truncate">{customerName}</p>
            </div>
            <div className="bg-[#FBF8F4] p-4">
              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1.5">Starting Layer</p>
              <p className="text-sm font-semibold text-[#B8933A]">{recommended}</p>
            </div>
            <div className="bg-[#FBF8F4] p-4">
              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1.5">Custom Sections</p>
              <p className="text-sm font-semibold">
                {writtenChapters}<span className="opacity-40"> / 14</span>
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE FORMULA / GTM ASSESSMENT */}
        <section className="py-12 border-b border-black/10">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-6 bg-[#B8933A]" aria-hidden />
            <p className="text-[#B8933A] text-[11px] uppercase tracking-[0.3em] font-semibold">
              The Formula
            </p>
          </div>
          <h2 className="text-2xl font-bold leading-tight mb-3">
            Signal <span className="opacity-40">+</span> Proof <span className="opacity-40">+</span> Context <span className="opacity-40">=</span> Response
          </h2>
          <p className="text-sm opacity-60 mb-6 leading-relaxed">
            Not pitch. Here's how each element lands for {customerName} right now.
          </p>

          <div className="grid gap-3">
            {data.gtm_profile_observed && (
              <div className="bg-black/[0.04] border border-black/10 p-5 rounded-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#B8933A] text-[10px] uppercase tracking-[0.25em] font-semibold">
                    Observed
                  </p>
                  <span className="text-[10px] uppercase tracking-wider opacity-40">
                    What we see
                  </span>
                </div>
                <p className="text-sm opacity-80 leading-relaxed">
                  {data.gtm_profile_observed}
                </p>
              </div>
            )}

            {data.gtm_profile_assessment && (
              <div className="bg-[#B8933A]/10 border border-[#B8933A]/30 p-5 rounded-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#B8933A]" aria-hidden />
                <div className="flex items-center justify-between mb-2 pl-2">
                  <p className="text-[#B8933A] text-[10px] uppercase tracking-[0.25em] font-semibold">
                    Assessment
                  </p>
                  <span className="text-[10px] uppercase tracking-wider opacity-50">
                    What it means
                  </span>
                </div>
                <p className="text-sm leading-relaxed pl-2">
                  {data.gtm_profile_assessment}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3: YOUR ORBIT MAP */}
        <section className="py-12 border-b border-black/10">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-6 bg-[#B8933A]" aria-hidden />
            <p className="text-[#B8933A] text-[11px] uppercase tracking-[0.3em] font-semibold">
              Your Five Orbits
            </p>
          </div>
          <h2 className="text-2xl font-bold leading-tight mb-3">
            Your next client is already orbiting you.
          </h2>
          <p className="text-sm opacity-60 mb-6 leading-relaxed">
            They sit in one of these five orbits right now. The only question is which signal reaches them first.
          </p>

          <div className="grid gap-2">
            {orbits.map((desc, i) => {
              const id = String(i + 1).padStart(2, "0");
              const name = ORBIT_NAMES[i];
              const hasContent = Boolean(desc && desc.trim() && desc.trim() !== "—" && desc.trim() !== "");
              return (
                <div
                  key={id}
                  className="bg-[#FBF8F4] border border-black/10 p-5 hover:border-[#B8933A]/40 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 shrink-0 rounded-full bg-[#B8933A]/15 border border-[#B8933A]/40 text-[#B8933A] flex items-center justify-center text-xs font-semibold">
                      {id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-sm font-semibold">
                          <span className="text-[#B8933A] mr-1">⊙{id}</span>
                          {name}
                        </p>
                        <span className="text-[10px] uppercase tracking-wider opacity-40 shrink-0">
                          {hasContent ? "Mapped" : "Pending"}
                        </span>
                      </div>
                      <p className="text-xs opacity-60 mt-1.5 leading-relaxed">
                        {desc ?? "Pending"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 4: IMPACT MODEL — Dead Zone calc + Formula multiplier */}
        <section className="border-b border-black/10 -mx-6">
          <div className="px-6 pt-8 pb-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-6 bg-[#B8933A]" aria-hidden />
              <p className="text-[#B8933A] text-[11px] uppercase tracking-[0.3em] font-semibold">
                Impact Model
              </p>
            </div>
            <h2 className="text-2xl font-bold leading-tight">
              The cost of leaving the Dead Zone untouched.
            </h2>
          </div>
          <div className="bg-transparent px-6 py-12 mt-6">
            <MagnetImpactModel
              companyName={data.client_company_name ?? ""}
              crmEstimate={data.crm_estimate ?? undefined}
              dealSizeEstimate={data.deal_size_estimate ?? undefined}
              primaryColor={brand.primary}
            />
          </div>
          <div className="bg-black/[0.04] border-t border-black/10 px-6 py-5">
            <p className="text-xs italic opacity-60 text-center leading-relaxed">
              Every month without a system, 3 to 5 warm contacts cross the Dead Zone threshold permanently.
            </p>
          </div>
        </section>

        {/* SECTION 5: WHERE TO START */}
        <section className="py-12 border-b border-black/10">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-6 bg-[#B8933A]" aria-hidden />
            <p className="text-[#B8933A] text-[11px] uppercase tracking-[0.3em] font-semibold">
              Your Starting Layer
            </p>
          </div>
          <h2 className="text-2xl font-bold leading-tight mb-3">
            Start at <span className="text-[#B8933A]">{recommended}</span>. Compound from there.
          </h2>
          <p className="text-sm opacity-60 mb-6 leading-relaxed">
            The five layers run in sequence. Skipping ahead breaks the system. Here's where {customerName} has the most leverage today.
          </p>

          {/* Layer progression */}
          <div className="grid grid-cols-5 gap-1 mb-6">
            {LAYERS.map((layer, i) => {
              const active = i === recommendedIndex;
              const passed = i < recommendedIndex;
              return (
                <div
                  key={layer}
                  className={
                    active
                      ? "bg-[#B8933A] text-[#120D05] font-semibold px-2 py-3 text-[11px] text-center uppercase tracking-wider"
                      : passed
                      ? "bg-[#B8933A]/20 text-[#B8933A] px-2 py-3 text-[11px] text-center uppercase tracking-wider"
                      : "bg-black/5 text-black/30 px-2 py-3 text-[11px] text-center uppercase tracking-wider"
                  }
                >
                  {layer}
                </div>
              );
            })}
          </div>

          <div className="bg-[#B8933A]/10 border border-[#B8933A]/30 p-5">
            <p className="text-[#B8933A] text-[10px] uppercase tracking-[0.25em] font-semibold mb-2">
              Why {recommended} first
            </p>
            <p className="text-sm leading-relaxed">
              {recommended === "DISCOVER"
                ? "You don't yet have a single source of truth on who you serve, what proof you own, and where the next deal lives. Everything else compounds from this."
                : recommended === "PROVE"
                ? "The signals are there. The proof library isn't. Until your last 3 wins are documented in one place, every conversation restarts from zero."
                : recommended === "DESIGN"
                ? "You know who you serve and you can prove it. Now the channel architecture and signal matrix decide whether activation scales or stalls."
                : recommended === "ACTIVATE"
                ? "The system is ready. The orbits are mapped. What's missing is the signal-triggered outreach cadence that turns warm into closed."
                : "Discover, Prove, Design, and Activate are operating. The work now is to make the system run on its own and get stronger every quarter."}
            </p>
          </div>
        </section>

        {/* SECTION 6: THREE QUICK WINS */}
        {actions.length > 0 && (
          <section className="py-12 border-b border-black/10">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-6 bg-[#B8933A]" aria-hidden />
              <p className="text-[#B8933A] text-[11px] uppercase tracking-[0.3em] font-semibold">
                First Signals This Week
              </p>
            </div>
            <h2 className="text-2xl font-bold leading-tight mb-3">
              Three moves. Under an hour each.
            </h2>
            <p className="text-sm opacity-60 mb-6 leading-relaxed">
              Each one designed to trigger a response, not ask for one. Run them in order.
            </p>

            <div className="grid gap-3">
              {actions.map((action, i) => {
                const { title, description } = splitAction(action);
                const num = String(i + 1).padStart(2, "0");
                return (
                  <div
                    key={i}
                    className="bg-[#FBF8F4] border border-black/10 p-5 hover:border-[#B8933A]/40 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        <span className="block text-2xl font-bold text-[#B8933A] leading-none">
                          {num}
                        </span>
                        <span className="block text-[9px] uppercase tracking-widest opacity-40 mt-1">
                          Move
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 border-l border-black/10 pl-4">
                        <p className="text-sm font-semibold leading-snug">{title}</p>
                        {description && (
                          <p className="text-sm opacity-65 mt-2 leading-relaxed">
                            {description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-black/5">
                          <span className="text-[10px] uppercase tracking-widest opacity-40">
                            Time
                          </span>
                          <span className="text-[10px] font-semibold opacity-70">
                            Under 60 min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 7: THE MANUSCRIPT */}
        <section className="py-12 border-b border-black/10">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-6 bg-[#B8933A]" aria-hidden />
            <p className="text-[#B8933A] text-[11px] uppercase tracking-[0.3em] font-semibold">
              The Manuscript: Relationship Revenue OS
            </p>
          </div>
          <h2 className="text-2xl font-bold leading-tight mb-3">
            14 sections. {writtenChapters > 0 ? `${writtenChapters} written for ${customerName}.` : `Written for ${customerName}.`}
          </h2>
          <p className="text-sm opacity-60 mb-8 leading-relaxed">
            Sections marked <span className="text-[#B8933A] font-semibold">✦</span> include callouts written specifically for your firm based on what we observed.
          </p>

          {/* Manuscript stat strip */}
          <div className="grid grid-cols-2 gap-px bg-black/10 border border-black/10 mb-6">
            <div className="bg-[#FBF8F4] p-4">
              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1.5">Custom Callouts</p>
              <p className="text-lg font-bold text-[#B8933A]">{writtenChapters}<span className="text-sm opacity-40 font-normal"> sections</span></p>
            </div>
            <div className="bg-[#FBF8F4] p-4">
              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1.5">Total System</p>
              <p className="text-lg font-bold">14<span className="text-sm opacity-40 font-normal"> sections</span></p>
            </div>
          </div>

          {CHAPTERS.map((chapter) => {
            const callout = (data.chapter_callouts ?? []).find(
              (c) => getChapterNumber(c) === chapter.number
            );
            const num = String(chapter.number).padStart(2, "0");

            if (callout) {
              return (
                <div
                  key={chapter.number}
                  className="border border-[#B8933A]/30 bg-[#B8933A]/5 mb-3"
                >
                  <div className="flex items-start p-5 gap-4">
                    <span className="text-[#B8933A]/40 text-xs font-mono w-8 pt-0.5 shrink-0">
                      {num}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1C1008]">
                        <span className="text-[#B8933A]">✦ </span>
                        {chapter.title}
                      </p>
                      <p className="text-xs opacity-50 mt-1 leading-relaxed">
                        {chapter.summary}
                      </p>
                    </div>
                    <span className="text-[#B8933A] text-xs uppercase tracking-wider shrink-0 pt-0.5">
                      APPLIED TO YOU
                    </span>
                  </div>
                  <div className="p-5 pt-0">
                    <div className="border-l-2 border-[#B8933A] pl-4">
                      <p className="text-sm opacity-80 italic leading-relaxed">
                        {callout.callout}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={chapter.number}
                className="border border-black/5 bg-transparent mb-3"
              >
                <div className="flex items-start p-5 gap-4">
                  <span className="text-black/20 text-xs font-mono w-8 pt-0.5 shrink-0">
                    {num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold opacity-70">
                      {chapter.title}
                    </p>
                    <p className="text-xs opacity-30 mt-1 leading-relaxed">
                      {chapter.summary}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="bg-black/[0.03] border border-black/10 p-6 mt-6 text-center">
            <p className="text-sm opacity-50 mb-4">
              Want to see how all 14 sections apply to{" "}
              {submission?.first_name ? `${submission.first_name}'s firm` : "your firm"}?
            </p>
            <button
              type="button"
              onClick={() => navigate("/book")}
              className="inline-block border border-[#B8933A]/50 text-[#B8933A] text-sm px-6 py-3 hover:bg-[#B8933A]/10 uppercase tracking-wide transition-colors"
            >
              WALK THROUGH IT WITH ADAM →
            </button>
          </div>
        </section>

        {/* SECTION 8: BOOK A CALL — primary action */}
        <section className="py-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-6 bg-[#B8933A]" aria-hidden />
            <p className="text-[#B8933A] text-[11px] uppercase tracking-[0.3em] font-semibold">
              What's next for {customerName}
            </p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
            See how this map applies to {customerName} live with Adam.
          </h2>
          <p className="text-base opacity-70 mb-8 leading-relaxed max-w-lg">
            20 minutes. No pitch. We walk through your map together and
            answer the questions you have right now.
          </p>

          <CalendlyInlineWidget
            url="https://calendly.com/adam-mabbly/gtm"
            brandPrimary={brand.primary.replace("#", "")}
            brandBackground={brand.background.replace("#", "")}
            brandText={brand.text.replace("#", "")}
          />

          {/* Optional save + share row */}
          <SaveAndShareRow slug={slug} customerName={customerName} />

          {/* Secondary path — read the manuscript */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate(`/m/${slug}/read`)}
              className="text-xs text-[#1C1008]/60 hover:text-[#1C1008] underline underline-offset-4"
            >
              Or read the manuscript first
            </button>
          </div>

          {/* Book mention — editorial italic + cover thumbnail */}
          <div className="mt-12 pt-8 border-t border-black/10 flex items-start gap-5">
            <button
              type="button"
              onClick={() => navigate("/about")}
              className="shrink-0 block"
              aria-label="About the authors"
            >
              <div
                className="w-[100px] h-[140px] bg-[#1C1008] flex items-center justify-center text-[10px] uppercase tracking-[0.18em] text-[#B8933A] text-center px-2 leading-snug"
                style={{
                  boxShadow: "0 8px 24px -8px rgba(28,16,8,0.35)",
                }}
              >
                Relationship<br />Revenue<br />OS
              </div>
            </button>
            <p className="text-xs italic opacity-70 leading-relaxed">
              This analysis comes from the methodology in{" "}
              <em className="not-italic font-semibold opacity-90">
                "GTM for Professional Services: The Relationship Revenue OS,"
              </em>{" "}
              launching Q3 2026 — co-authored by{" "}
              <button
                type="button"
                onClick={() => navigate("/about")}
                className="underline underline-offset-2 hover:text-[#B8933A] transition-colors"
              >
                Adam Fridman and Richard Ashbaugh
              </button>
              , foreword by Jonathan Copulsky.
            </p>
          </div>
        </section>
        </div>{/* /magnet-full-reveal */}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE A — Teaser + email-confirm gate.
//
// Shown above the full breakdown until the visitor confirms their email.
// The "map" preview is rendered as a blurred SVG-driven five-orbits diagram
// with a centered lock icon. Labels stay readable; values are blurred.
// ─────────────────────────────────────────────────────────────────────────────
function TeaserAndGate({
  data,
  customerName,
  confirmEmail,
  setConfirmEmail,
  handleUnlock,
}: {
  data: BreakdownRow;
  customerName: string;
  confirmEmail: string;
  setConfirmEmail: (v: string) => void;
  handleUnlock: (e: React.FormEvent) => void;
}) {
  // Build a simple "leaking $X" hero line from existing breakdown fields.
  const dz = data.dead_zone_value;
  const leakSentence = dz
    ? `${customerName} is leaking ~$${Math.round(dz / 1000)}K in dormant pipeline.`
    : `${customerName} likely has a dormant-relationship gap. We mapped where it lives.`;

  // Strongest / weakest orbit — heuristic on text length as a proxy for the
  // amount of signal the enrich function found in each orbit.
  const orbits = [
    data.orbit_01,
    data.orbit_02,
    data.orbit_03,
    data.orbit_04,
    data.orbit_05,
  ];
  const ORBIT_LABELS = [
    "⊙01 Core Proof",
    "⊙02 Active",
    "⊙03 Dead Zone",
    "⊙04 Warm Adjacency",
    "⊙05 New Gravity",
  ];
  let strongestIdx = 0;
  let weakestIdx = 0;
  let maxLen = -1;
  let minLen = Number.POSITIVE_INFINITY;
  orbits.forEach((o, i) => {
    const len = (o ?? "").trim().length;
    if (len > maxLen) {
      maxLen = len;
      strongestIdx = i;
    }
    if (len > 0 && len < minLen) {
      minLen = len;
      weakestIdx = i;
    }
  });

  return (
    <section className="pt-10 pb-12">
      <p className="text-[#B8933A] text-[11px] uppercase tracking-[0.3em] font-semibold">
        Your Revenue Map
      </p>
      <h1 className="mt-3 text-3xl md:text-4xl font-bold leading-[1.15] tracking-tight">
        {leakSentence}
      </h1>

      {data.gtm_profile_observed && (
        <p className="mt-5 text-base leading-relaxed text-[#1C1008]/85">
          {data.gtm_profile_observed}
        </p>
      )}

      <p className="mt-4 text-sm italic text-[#1C1008]/70 leading-relaxed">
        Your strongest orbit:{" "}
        <span className="text-[#B8933A] not-italic font-semibold">
          {ORBIT_LABELS[strongestIdx]}
        </span>
        . Your weakest:{" "}
        <span className="text-[#B8933A] not-italic font-semibold">
          {ORBIT_LABELS[weakestIdx]}
        </span>
        .
      </p>

      {/* ─── Blurred orbit map preview ─────────────────────────────── */}
      <div className="mt-10 relative border border-black/10 bg-black/[0.03] aspect-square max-w-md mx-auto overflow-hidden">
        <BlurredOrbitPreview />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(251,248,244,0.55) 0%, rgba(251,248,244,0.85) 100%)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <div className="w-12 h-12 rounded-full border border-[#B8933A]/40 bg-[#B8933A]/10 flex items-center justify-center mb-3">
            <LockIcon />
          </div>
          <p className="text-[10px] uppercase tracking-[0.28em] font-semibold text-[#B8933A]">
            Map Locked
          </p>
          <p className="text-xs text-[#1C1008]/70 mt-1">
            Confirm your email to unlock
          </p>
        </div>
      </div>

      {/* ─── Email-confirm gate ────────────────────────────────────── */}
      <form
        onSubmit={handleUnlock}
        className="mt-10 border border-[#B8933A]/40 bg-[#B8933A]/5 p-6"
      >
        <p className="text-[#B8933A] text-[10px] uppercase tracking-[0.28em] font-semibold">
          Unlock your full map
        </p>
        <p className="mt-2 text-base font-semibold text-[#1C1008] leading-snug">
          See your complete RROS map, 3 strategic insights, and your custom
          90-day plan.
        </p>

        <label className="block mt-5 text-[10px] uppercase tracking-wider text-[#1C1008]/60">
          Confirm your work email
        </label>
        <input
          type="email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          placeholder="you@yourfirm.com"
          required
          className="mt-2 w-full bg-white border border-black/10 text-[#1C1008] placeholder:text-black/30 focus:border-[#B8933A] focus:outline-none focus:ring-0 rounded-none h-12 px-4 text-base"
        />
        <button
          type="submit"
          className="mt-4 w-full h-12 bg-[#B8933A] hover:bg-[#a07c2e] text-[#120D05] font-semibold tracking-wide uppercase text-sm transition-colors"
        >
          Unlock My Map →
        </button>
        <p className="mt-3 text-xs text-[#1C1008]/50 text-center">
          Free forever. We never sell your data. Unsubscribe in one click.
        </p>
      </form>
    </section>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#B8933A"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function BlurredOrbitPreview() {
  const SIZE = 320;
  const C = SIZE / 2;
  const rings = [40, 72, 104, 136, 168];
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="absolute inset-0 w-full h-full"
      aria-hidden
    >
      <circle cx={C} cy={C} r={5} fill="#B8933A" />
      {rings.map((r, i) => (
        <g key={i}>
          <circle
            cx={C}
            cy={C}
            r={r}
            fill="none"
            stroke="#1C1008"
            strokeOpacity={0.18}
          />
          {/* node */}
          <circle
            cx={C + r * Math.cos((i * 72 - 30) * (Math.PI / 180))}
            cy={C + r * Math.sin((i * 72 - 30) * (Math.PI / 180))}
            r={5}
            fill="#B8933A"
            opacity={0.65}
          />
        </g>
      ))}
      {/* faux numeric labels (these are what the blur obscures) */}
      {rings.map((r, i) => (
        <text
          key={`v-${i}`}
          x={C + r * Math.cos((i * 72 - 30) * (Math.PI / 180)) + 10}
          y={C + r * Math.sin((i * 72 - 30) * (Math.PI / 180)) + 4}
          fontFamily="'Inter Tight', system-ui, sans-serif"
          fontSize={11}
          fontWeight={600}
          fill="#1C1008"
        >
          {[78, 64, 32, 56, 41][i]}
        </text>
      ))}
    </svg>
  );
}
