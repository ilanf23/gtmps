// SECTION 11 - Manuscript Anchor + Share + Save cards.
// Cream pull-quote on top, two dark depth-ink action cards below.

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MANUSCRIPT_INTRODUCTION } from "@/content/manuscriptQuotes";
import { trackMagnetEvent } from "@/lib/magnetAnalytics";

interface Props {
  slug: string;
  shareToken: string | null;
  vertical: string;
  customerName: string;
  fromName: string | null;
  primary: string;
  emailSubject: string;
  shareTemplate: string;
}

const QUOTE_WORDS = [
  "I", "had", "spent", "8", "years", "conducting", "more", "than", "500", "interviews.",
  "Firms", "with", "extraordinary", "reputations", "and", "trusted", "relationships", "had",
  "no", "system", "for", "turning", "that", "trust", "into", "predictable", "growth.",
];

export default function ManuscriptShareSave({
  slug,
  shareToken,
  vertical,
  customerName,
  fromName,
  primary,
  emailSubject,
  shareTemplate,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Intersection observer drives the section's entry choreography.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const buildShareUrl = () => {
    const base = `${window.location.origin}/m/${slug}`;
    const params = new URLSearchParams();
    if (shareToken) params.set("share_id", shareToken);
    if (vertical && vertical !== "general") params.set("vertical", vertical);
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  };

  const handleCopyShare = async () => {
    const url = buildShareUrl();
    const text = `${shareTemplate} ${url}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied. Share it with your team.");
      trackMagnetEvent(slug, "share_click", { channel: "copy", vertical });
      await supabase
        .from("magnet_share_events")
        .insert({ slug, share_token: shareToken, channel: "copy" });
    } catch {
      toast.error("Couldn't copy. Long-press the URL bar to copy manually.");
    }
  };

  const handleEmailForward = async () => {
    const url = buildShareUrl();
    const subject = encodeURIComponent(`${emailSubject}: ${customerName}`);
    const body = encodeURIComponent(
      `${shareTemplate}\n\n${url}\n\n${
        fromName ? `${fromName}` : ""
      }`.trim()
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    trackMagnetEvent(slug, "share_click", { channel: "email", vertical });
    await supabase
      .from("magnet_share_events")
      .insert({ slug, share_token: shareToken, channel: "email" });
  };

  // Allow the sticky share FAB (rendered elsewhere) to trigger copy-share.
  useEffect(() => {
    const onCopy = () => { void handleCopyShare(); };
    window.addEventListener("v10:share-copy", onCopy);
    return () => window.removeEventListener("v10:share-copy", onCopy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, shareToken, vertical, shareTemplate]);

  const submitSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = emailValue.trim();
    if (!trimmed.includes("@")) return;
    setEmailSending(true);
    trackMagnetEvent(slug, "save_submit", { vertical });
    const { error } = await supabase
      .from("magnet_map_emails")
      .insert({ slug, email: trimmed, vertical });
    setEmailSending(false);
    if (error) {
      toast.error("Couldn't save your email. Try again.");
      return;
    }
    setEmailSent(true);
  };

  return (
    <section
      ref={sectionRef}
      id="v10-section-11"
      data-v10-section="11"
      className="mss-section mss-scope"
    >
      <style>{`
        .mss-scope {
          --mss-depth: #0F1E1D;
          --mss-depth-soft: #1A2725;
          --mss-depth-mid: #243431;
          --mss-depth-line: rgba(15, 30, 29, 0.10);
          --mss-care: #BF461A;
          --mss-care-bright: #E5582B;
          --mss-care-tint: rgba(191, 70, 26, 0.06);
          --mss-energy: #FFBA1A;
          --mss-purpose: #A79014;
          --mss-purpose-soft: #C9AC2A;
          --mss-cream: #F8F2E5;
          --mss-cream-card: #FCFAF4;
          --mss-cream-border: #E5E0CF;
          --mss-cream-line: #ECE6D5;
          --mss-muted: #6B7370;
          --mss-muted-soft: #9AA09C;
          --mss-ink-line: rgba(248, 242, 229, 0.10);
          --mss-ink-line-strong: rgba(248, 242, 229, 0.18);
          --mss-ink-soft: rgba(248, 242, 229, 0.55);
          --mss-ink-medium: rgba(248, 242, 229, 0.78);
          --mss-display: 'Mabbly Repro', 'Arial Black', 'Helvetica Neue', sans-serif;
          --mss-mono: 'Mabbly Repro Mono', 'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace;
          --mss-body: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          --mss-serif: 'Cormorant Garamond', 'Georgia', 'Times New Roman', serif;
          --mss-ease: cubic-bezier(0.13, 0.28, 0.3, 1);
        }

        .mss-section {
          padding: 96px 0;
          position: relative;
        }
        @media (max-width: 720px) {
          .mss-section { padding: 64px 0; }
        }

        .mss-container {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 32px;
        }
        @media (max-width: 600px) {
          .mss-container { padding: 0 22px; }
        }

        /* Section head */
        .mss-section-head {
          text-align: center;
          margin-bottom: 32px;
        }
        .mss-meta-row {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.7s var(--mss-ease), transform 0.7s var(--mss-ease);
        }
        .mss-section.is-in .mss-meta-row { opacity: 1; transform: translateY(0); }
        .mss-meta-row .mss-rule {
          width: 22px;
          height: 1px;
          background: var(--mss-cream-border);
        }
        .mss-meta-tag {
          font-family: var(--mss-mono);
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--mss-purpose);
          font-weight: 700;
        }
        .mss-meta-tag .mss-num { color: var(--mss-depth); }
        .mss-meta-tag .mss-pip { color: var(--mss-care); margin: 0 4px; }

        /* Pull-quote */
        .mss-pullquote-wrap {
          max-width: 940px;
          margin: 0 auto 60px;
          text-align: center;
          position: relative;
          padding: 32px 32px 0;
        }
        .mss-pullquote-mark {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--mss-serif);
          font-style: normal;
          font-size: 96px;
          font-weight: 500;
          line-height: 0.65;
          color: var(--mss-care);
          opacity: 0;
          transition:
            opacity 0.7s var(--mss-ease) 0.20s,
            transform 0.7s var(--mss-ease) 0.20s;
        }
        .mss-section.is-in .mss-pullquote-mark {
          opacity: 1;
          transform: translateX(-50%) translateY(-8px);
        }

        .mss-pullquote {
          font-family: var(--mss-serif);
          font-style: italic;
          font-weight: 500;
          font-size: clamp(24px, 2.8vw, 36px);
          line-height: 1.22;
          letter-spacing: -0.012em;
          color: var(--mss-depth);
          max-width: 880px;
          margin: 0 auto 32px;
        }
        .mss-pullquote-line { display: block; overflow: hidden; }

        .mss-word-mask {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
        }
        .mss-word-inner {
          display: inline-block;
          transform: translateY(105%);
          transition: transform 0.85s var(--mss-ease);
        }
        .mss-section.is-in .mss-word-inner { transform: translateY(0); }

        .mss-pullquote .mss-word-mask:nth-child(1) .mss-word-inner { transition-delay: 0.30s; }
        .mss-pullquote .mss-word-mask:nth-child(2) .mss-word-inner { transition-delay: 0.34s; }
        .mss-pullquote .mss-word-mask:nth-child(3) .mss-word-inner { transition-delay: 0.38s; }
        .mss-pullquote .mss-word-mask:nth-child(4) .mss-word-inner { transition-delay: 0.42s; }
        .mss-pullquote .mss-word-mask:nth-child(5) .mss-word-inner { transition-delay: 0.46s; }
        .mss-pullquote .mss-word-mask:nth-child(6) .mss-word-inner { transition-delay: 0.50s; }
        .mss-pullquote .mss-word-mask:nth-child(7) .mss-word-inner { transition-delay: 0.54s; }
        .mss-pullquote .mss-word-mask:nth-child(8) .mss-word-inner { transition-delay: 0.58s; }
        .mss-pullquote .mss-word-mask:nth-child(9) .mss-word-inner { transition-delay: 0.62s; }
        .mss-pullquote .mss-word-mask:nth-child(10) .mss-word-inner { transition-delay: 0.66s; }
        .mss-pullquote .mss-word-mask:nth-child(n+11) .mss-word-inner { transition-delay: 0.70s; }

        /* Attribution */
        .mss-attribution {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          opacity: 0;
          transform: translateY(8px);
          transition:
            opacity 0.6s var(--mss-ease) 1.00s,
            transform 0.6s var(--mss-ease) 1.00s;
        }
        .mss-section.is-in .mss-attribution { opacity: 1; transform: translateY(0); }

        .mss-attribution-row {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--mss-mono);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--mss-depth);
          font-weight: 700;
        }
        .mss-attribution-row .mss-em-dash { color: var(--mss-muted-soft); margin-right: 4px; }
        .mss-attribution-row .mss-att-pip { color: var(--mss-care); }
        .mss-attribution-row .mss-role { color: var(--mss-muted); font-weight: 600; }

        .mss-attribution-rule {
          width: 0;
          height: 1px;
          background: var(--mss-care);
          transition: width 0.6s var(--mss-ease) 1.30s;
        }
        .mss-section.is-in .mss-attribution-rule { width: 56px; }

        /* Action grid */
        .mss-action-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          max-width: 1080px;
          margin: 0 auto;
        }

        .mss-action-card {
          position: relative;
          background:
            radial-gradient(ellipse 480px 280px at 0% 0%, rgba(229, 88, 43, 0.10), transparent 60%),
            linear-gradient(180deg, var(--mss-depth-soft) 0%, var(--mss-depth) 100%);
          border: 1px solid var(--mss-ink-line-strong);
          border-radius: 4px;
          padding: 30px 32px 28px;
          color: var(--mss-cream);
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow:
            0 1px 0 rgba(0, 0, 0, 0.05),
            0 14px 32px -22px rgba(0, 0, 0, 0.45);
          opacity: 0;
          transform: translateY(14px);
          transition:
            opacity 0.7s var(--mss-ease),
            transform 0.7s var(--mss-ease),
            border-color 0.4s var(--mss-ease),
            box-shadow 0.4s var(--mss-ease);
        }
        .mss-section.is-in .mss-action-card { opacity: 1; transform: translateY(0); }
        .mss-section.is-in .mss-action-card.mss-d4 { transition-delay: 0.40s; }
        .mss-section.is-in .mss-action-card.mss-d5 { transition-delay: 0.55s; }

        .mss-action-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 56px;
          height: 2px;
          background: var(--mss-care-bright);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s var(--mss-ease);
        }
        .mss-section.is-in .mss-action-card::before { transform: scaleX(1); transition-delay: 0.70s; }

        .mss-action-card::after {
          content: '';
          position: absolute;
          top: 0;
          right: -20%;
          width: 80%;
          height: 60%;
          background: radial-gradient(ellipse 60% 80% at 100% 0%, rgba(229, 88, 43, 0.08), transparent 65%);
          pointer-events: none;
          animation: mssCardHaloDrift 14s ease-in-out infinite alternate;
        }
        @keyframes mssCardHaloDrift {
          0%   { transform: translate(0, 0); }
          100% { transform: translate(-12%, 8%); }
        }

        .mss-action-card:hover {
          transform: translateY(-3px);
          border-color: rgba(229, 88, 43, 0.40);
          box-shadow:
            0 1px 0 rgba(0, 0, 0, 0.05),
            0 24px 44px -16px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(229, 88, 43, 0.10);
        }

        /* Card content */
        .mss-card-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--mss-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--mss-purpose-soft);
          font-weight: 700;
          margin-bottom: 18px;
          position: relative;
          z-index: 1;
        }
        .mss-card-eyebrow .mss-icon-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--mss-depth);
          border: 1.5px solid var(--mss-care-bright);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--mss-care-bright);
          flex-shrink: 0;
        }
        .mss-card-eyebrow .mss-icon-circle svg { width: 12px; height: 12px; }

        .mss-card-title {
          font-family: var(--mss-display);
          font-weight: 900;
          font-size: clamp(22px, 2.4vw, 28px);
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: var(--mss-cream);
          margin: 0 0 14px;
          max-width: 360px;
          position: relative;
          z-index: 1;
        }
        .mss-card-title .mss-period { color: var(--mss-care-bright); }

        .mss-card-body {
          font-family: var(--mss-body);
          font-size: 13.5px;
          line-height: 1.55;
          color: var(--mss-ink-medium);
          margin: 0 0 24px;
          max-width: 440px;
          flex: 1;
          position: relative;
          z-index: 1;
        }
        .mss-card-body strong { color: var(--mss-cream); font-weight: 600; }

        .mss-card-divider {
          height: 1px;
          background: var(--mss-ink-line);
          margin: 4px 0 22px;
          position: relative;
          z-index: 1;
        }

        .mss-card-cta-row {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }

        /* Primary CTA pill */
        .mss-cta-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          background: var(--mss-care);
          color: var(--mss-cream);
          border: 2px solid var(--mss-care);
          border-radius: 25px;
          font-family: var(--mss-display);
          font-weight: 900;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition:
            background 0.6s cubic-bezier(0.85, 0, 0.15, 1),
            border-color 0.6s cubic-bezier(0.85, 0, 0.15, 1),
            color 0.3s var(--mss-ease),
            transform 0.3s var(--mss-ease);
          box-shadow: 0 4px 14px -6px rgba(191, 70, 26, 0.50);
        }
        .mss-cta-pill::before {
          content: '';
          position: absolute;
          top: 0;
          left: -60%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.30), transparent);
          transform: skewX(-20deg);
          animation: mssShimmer 5s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes mssShimmer {
          0%   { left: -60%; }
          60%  { left: 140%; }
          100% { left: 140%; }
        }
        .mss-cta-pill:hover {
          background: var(--mss-cream);
          border-color: var(--mss-cream);
          color: var(--mss-depth);
          transform: translateY(-1px);
        }
        .mss-cta-pill svg { transition: transform 0.3s var(--mss-ease); }
        .mss-cta-pill:hover svg { transform: translateX(3px); }

        /* Secondary link */
        .mss-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--mss-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--mss-cream);
          text-decoration: none;
          font-weight: 700;
          padding: 0 0 2px;
          border: 0;
          border-bottom: 1px solid var(--mss-ink-line-strong);
          background: transparent;
          cursor: pointer;
          transition: color 0.3s var(--mss-ease), border-color 0.3s var(--mss-ease);
        }
        .mss-cta-secondary:hover {
          color: var(--mss-care-bright);
          border-color: var(--mss-care-bright);
        }
        .mss-cta-secondary svg { transition: transform 0.3s var(--mss-ease); }
        .mss-cta-secondary:hover svg { transform: translateX(2px); }

        /* Responsive */
        @media (max-width: 880px) {
          .mss-action-grid { grid-template-columns: 1fr; gap: 14px; }
          .mss-pullquote-wrap { padding: 28px 16px 0; }
        }
        @media (max-width: 600px) {
          .mss-pullquote { font-size: 22px; }
          .mss-pullquote-mark { font-size: 70px; }
          .mss-action-card { padding: 24px 22px 22px; }
          .mss-card-title { font-size: 20px; }
          .mss-card-cta-row { gap: 12px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .mss-section *,
          .mss-section *::before,
          .mss-section *::after {
            transition-duration: 0.01ms !important;
            transition-delay: 0ms !important;
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
            animation-iteration-count: 1 !important;
          }
          .mss-meta-row,
          .mss-pullquote-mark,
          .mss-word-inner,
          .mss-attribution,
          .mss-action-card { opacity: 1 !important; transform: none !important; }
          .mss-attribution-rule { width: 56px !important; }
          .mss-action-card::before { transform: scaleX(1) !important; }
        }
      `}</style>

      <div className="mss-container">
        <header className="mss-section-head">
          <div className="mss-meta-row">
            <span className="mss-rule" aria-hidden />
            <span className="mss-meta-tag">
              <span className="mss-num">11</span>
              <span className="mss-pip">·</span>
              Manuscript Anchor
            </span>
            <span className="mss-rule" aria-hidden />
          </div>
        </header>

        <div className="mss-pullquote-wrap">
          <span className="mss-pullquote-mark" aria-hidden="true">&ldquo;</span>

          <blockquote className="mss-pullquote">
            <span className="mss-pullquote-line">
              {QUOTE_WORDS.map((word, i) => {
                const isLast = i === QUOTE_WORDS.length - 1;
                return (
                  <span className="mss-word-mask" key={`${word}-${i}`}>
                    <span className="mss-word-inner">
                      {word}
                      {isLast ? <>&rdquo;</> : <>&nbsp;</>}
                    </span>
                  </span>
                );
              })}
            </span>
          </blockquote>

          <div className="mss-attribution">
            <div className="mss-attribution-rule" />
            <div className="mss-attribution-row">
              <span className="mss-em-dash">&mdash;</span>
              <span>Adam Fridman</span>
              <span className="mss-att-pip">·</span>
              <span className="mss-role">Introduction</span>
            </div>
          </div>
        </div>

        <div className="mss-action-grid">
          {/* SHARE */}
          <article className="mss-action-card mss-d4">
            <div className="mss-card-eyebrow">
              <span className="mss-icon-circle" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none">
                  <circle cx="3.5" cy="8" r="1.6" stroke="currentColor" strokeWidth="1.4" />
                  <circle cx="12" cy="3.5" r="1.6" stroke="currentColor" strokeWidth="1.4" />
                  <circle cx="12" cy="12.5" r="1.6" stroke="currentColor" strokeWidth="1.4" />
                  <line x1="5" y1="7.2" x2="10.5" y2="4.2" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="5" y1="8.8" x2="10.5" y2="11.8" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
              <span>Share</span>
            </div>

            <h3 className="mss-card-title">
              Send this to your partner<span className="mss-period">.</span>
            </h3>

            <p className="mss-card-body">
              If someone else at your firm should see this, they should. They will see your{" "}
              <strong>map, scores, and findings</strong>, with your name on it.
            </p>

            <div className="mss-card-divider" />

            <div className="mss-card-cta-row">
              <button
                type="button"
                className="mss-cta-pill"
                onClick={handleEmailForward}
              >
                Email Forward
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10m0 0L8 3m4 4l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className="mss-cta-secondary"
                onClick={handleCopyShare}
              >
                Copy Link
                <svg width="9" height="9" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M5 9 L 9 5 M 5 5 H 9 V 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </article>

          {/* SAVE */}
          <article className="mss-action-card mss-d5">
            <div className="mss-card-eyebrow">
              <span className="mss-icon-circle" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M4 3 V 13.5 L 8 11 L 12 13.5 V 3 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
                </svg>
              </span>
              <span>Save</span>
            </div>

            <h3 className="mss-card-title">
              Email me this map<span className="mss-period">.</span>
            </h3>

            <p className="mss-card-body">
              Save it for later. <strong>Re-take in 90 days.</strong> See how you have changed.
            </p>

            <div className="mss-card-divider" />

            <div className="mss-card-cta-row">
              <button
                type="button"
                className="mss-cta-pill"
                onClick={() => {
                  trackMagnetEvent(slug, "save_click", { vertical });
                  setEmailSent(false);
                  setEmailValue("");
                  setEmailOpen(true);
                }}
              >
                Email Me This Map
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10m0 0L8 3m4 4l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </article>
        </div>
      </div>

      {/* Save dialog - real submit handler preserved */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent className="sm:max-w-md bg-[#FCFAF4] text-[#0F1E1D] border border-black/10 rounded-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold leading-tight">
              {emailSent ? "Sent." : emailSubject}
            </DialogTitle>
            <DialogDescription className="text-[#0F1E1D]/70">
              {emailSent
                ? `We'll send the ${customerName} map to ${emailValue.trim()} shortly. The map stays here either way.`
                : "We'll send a copy to your inbox. No newsletter, no follow-up sequence. Just the map."}
            </DialogDescription>
          </DialogHeader>
          {!emailSent && (
            <form onSubmit={submitSaveEmail} className="space-y-4 pt-2">
              <input
                type="email"
                required
                autoFocus
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="you@yourfirm.com"
                className="w-full bg-white border border-black/10 text-[#0F1E1D] placeholder:text-black/30 focus:outline-none focus:ring-0 rounded-none h-12 px-4 text-base"
                style={{ borderColor: "rgba(0,0,0,0.15)" }}
              />
              <DialogFooter>
                <button
                  type="submit"
                  disabled={emailSending}
                  className="w-full h-12 font-semibold tracking-wide uppercase text-sm transition-opacity disabled:opacity-50 hover:opacity-90"
                  style={{
                    backgroundColor: primary,
                    color: "#120D05",
                  }}
                >
                  {emailSending ? "Saving…" : "Send map"}
                </button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
