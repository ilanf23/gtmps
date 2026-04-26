import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
}

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
      "Why 60–96% of your CRM is sleeping and what it costs you every quarter.",
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
      "Why most PS firms can't close — and how to fix the proof library in 7 days.",
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
      "Orbit by orbit — the exact steps to activate ⊙01 through ⊙05 in sequence.",
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

const formatDeadZone = (n: number | null): string => {
  if (!n || n <= 0) return "—";
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `$${m >= 10 ? Math.round(m) : m.toFixed(1)}M`;
  }
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
};

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

  return (
    <div className="min-h-screen bg-[#FBF8F4] text-[#1C1008]">
      <div className="max-w-2xl mx-auto px-6 pb-24">
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
                  // Real logos sit roughly between 1:2 (tall) and 5:1 (wide).
                  // Anything outside that range is almost certainly a banner
                  // or social-share photo masquerading as a logo.
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
          <p className="text-[#B8933A] text-xs uppercase tracking-widest">
            YOUR PERSONALIZED RROS BREAKDOWN
          </p>
          <h1 className="text-3xl font-bold mt-3 leading-tight">
            {data.welcome_message ?? "Your GTM breakdown."}
          </h1>
          {data.gtm_profile_observed && (
            <p className="text-base opacity-60 mt-3 max-w-lg leading-relaxed">
              {data.gtm_profile_observed}
            </p>
          )}
        </section>

        {/* SECTION 2: THE FORMULA / GTM ASSESSMENT */}
        <section className="py-12 border-b border-black/10">
          <p className="text-[#B8933A] text-xs uppercase tracking-widest mb-6">
            THE FORMULA: SIGNAL + PROOF + CONTEXT = RESPONSE, NOT PITCH
          </p>

          {data.gtm_profile_observed && (
            <div className="bg-black/5 border border-black/10 p-5 rounded-sm mb-3">
              <p className="text-[#B8933A] text-xs uppercase tracking-wider">
                OBSERVED
              </p>
              <p className="text-sm opacity-80 mt-2 leading-relaxed">
                {data.gtm_profile_observed}
              </p>
            </div>
          )}

          {data.gtm_profile_assessment && (
            <div className="bg-[#B8933A]/10 border border-[#B8933A]/30 p-5 rounded-sm">
              <p className="text-[#B8933A] text-xs uppercase tracking-wider">
                ASSESSMENT
              </p>
              <p className="text-sm mt-2 leading-relaxed">
                {data.gtm_profile_assessment}
              </p>
            </div>
          )}
        </section>

        {/* SECTION 3: YOUR ORBIT MAP */}
        <section className="py-12 border-b border-black/10">
          <p className="text-[#B8933A] text-xs uppercase tracking-widest mb-6">
            YOUR FIVE ORBITS
          </p>

          {orbits.map((desc, i) => {
            const id = String(i + 1).padStart(2, "0");
            const name = ORBIT_NAMES[i];
            return (
              <div
                key={id}
                className="flex items-start gap-4 py-4 border-b border-black/5 last:border-b-0"
              >
                <div className="w-8 h-8 shrink-0 rounded-full bg-[#B8933A]/15 border border-[#B8933A]/40 text-[#B8933A] flex items-center justify-center text-xs font-semibold">
                  {id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">
                    ⊙{id} {name}
                  </p>
                  <p className="text-xs opacity-60 mt-1 leading-relaxed">
                    {desc ?? "—"}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* SECTION 4: YOUR DEAD ZONE */}
        <section className="py-12 border-b border-black/10">
          <p className="text-[#B8933A] text-xs uppercase tracking-widest">
            YOUR DEAD ZONE
          </p>
          <p className="text-5xl font-bold mt-4 tracking-tight">
            {formatDeadZone(data.dead_zone_value)}
          </p>
          {data.dead_zone_reasoning && (
            <p className="text-sm opacity-60 mt-4 max-w-lg leading-relaxed">
              {data.dead_zone_reasoning}
            </p>
          )}
          <p className="italic opacity-40 text-xs mt-3">
            Estimated based on typical conversion rates for firms at your stage and size.
          </p>
        </section>

        {/* SECTION 5: WHERE TO START */}
        <section className="py-12 border-b border-black/10">
          <p className="text-[#B8933A] text-xs uppercase tracking-widest mb-6">
            YOUR STARTING LAYER
          </p>
          <div className="flex flex-wrap gap-2">
            {LAYERS.map((layer) => {
              const active = layer === recommended;
              return (
                <span
                  key={layer}
                  className={
                    active
                      ? "bg-[#B8933A] text-[#120D05] font-semibold px-4 py-2 text-sm"
                      : "bg-black/5 text-black/30 px-4 py-2 text-sm"
                  }
                >
                  {layer}
                </span>
              );
            })}
          </div>
        </section>

        {/* SECTION 6: THREE QUICK WINS */}
        {actions.length > 0 && (
          <section className="py-12 border-b border-black/10">
            <p className="text-[#B8933A] text-xs uppercase tracking-widest mb-6">
              THREE QUICK WINS
            </p>
            {actions.map((action, i) => {
              const { title, description } = splitAction(action);
              const num = String(i + 1).padStart(2, "0");
              return (
                <div key={i} className="flex gap-4 items-start mb-6 last:mb-0">
                  <span className="text-3xl font-bold text-black/10 w-12 shrink-0 leading-none">
                    {num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{title}</p>
                    {description && (
                      <p className="text-sm opacity-60 mt-1 leading-relaxed">
                        {description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* SECTION 7: THE MANUSCRIPT */}
        <section className="py-12 border-b border-black/10">
          <p className="text-[#B8933A] text-xs uppercase tracking-widest mb-8">
            THE MANUSCRIPT — RELATIONSHIP REVENUE OS
          </p>
          <p className="text-sm opacity-40 mb-8 leading-relaxed">
            14 chapters. The complete system. Sections marked ✦ are written
            specifically for your firm.
          </p>

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
              Want to see how all 14 chapters apply to{" "}
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

        {/* SECTION 8: CTA */}
        <section className="py-16 text-center">
          <p className="text-base opacity-70 max-w-md mx-auto mb-8 leading-relaxed">
            This is the start of your map. The next step is a 30-minute conversation
            to walk through the highest-leverage move for your firm.
          </p>
          <button
            type="button"
            onClick={() => navigate("/book")}
            className="inline-block bg-[#B8933A] hover:bg-[#a07c2e] text-[#120D05] font-semibold px-8 py-4 uppercase tracking-wide text-sm transition-colors"
          >
            BOOK A CALL WITH ADAM →
          </button>
          <p className="text-xs opacity-30 mt-4">
            30 minutes. No pitch. Just the plan.
          </p>
        </section>
      </div>
    </div>
  );
}
