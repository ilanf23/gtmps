import { Linkedin } from 'lucide-react';

const ADAM_LINKEDIN_URL = 'https://www.linkedin.com/in/adamfridman/';

export default function AdamNote() {
  return (
    <section
      id="adam-note"
      className="adam-note"
      style={{ background: '#FFFFFF' }}
    >
      <style>{`
        .adam-note {
          width: 100%;
          padding: 120px 32px;
          text-align: center;
        }
        .adam-note__inner {
          max-width: 680px;
          margin: 0 auto;
        }
        .adam-note .eyebrow {
          font-family: 'DM Mono', 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 12px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #A79014;
          margin: 0 0 48px;
          font-weight: 500;
          opacity: 0;
          animation: adamFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 0ms both;
        }
        .adam-note .line {
          font-family: 'Playfair Display', 'Cormorant Garamond', 'Fraunces', Georgia, 'Times New Roman', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 22px;
          line-height: 1.55;
          color: #0F1E1D;
          margin: 0 0 28px;
          opacity: 0;
          animation: adamFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) both;
        }
        .adam-note .line:nth-of-type(1) { animation-delay: 200ms; }
        .adam-note .line:nth-of-type(2) { animation-delay: 400ms; }
        .adam-note .line:nth-of-type(3) { animation-delay: 600ms; }
        .adam-note .line:nth-of-type(4) { animation-delay: 800ms; }
        .adam-note .line.closer {
          font-weight: 600;
          margin-top: 36px;
          margin-bottom: 0;
          animation-delay: 1000ms;
        }
        .adam-note .line.closer .period {
          color: #BF461A;
        }
        .adam-note .signature {
          font-family: 'Playfair Display', 'Cormorant Garamond', 'Fraunces', Georgia, serif;
          font-style: italic;
          font-weight: 400;
          font-size: 22px;
          color: #0F1E1D;
          margin: 56px 0 0;
          opacity: 0;
          animation: adamFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1300ms both;
        }
        .adam-note .byline {
          font-family: 'DM Mono', 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #A79014;
          margin: 14px 0 0;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          opacity: 0;
          animation: adamFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1450ms both;
        }
        .adam-note .byline .sep {
          opacity: 0.5;
        }
        .adam-note .linkedin {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          color: #A79014;
          transition: color 200ms cubic-bezier(0.13, 0.28, 0.3, 1), transform 200ms cubic-bezier(0.13, 0.28, 0.3, 1);
        }
        .adam-note .linkedin:hover,
        .adam-note .linkedin:focus-visible {
          color: #0F1E1D;
          transform: translateY(-1px);
        }
        @keyframes adamFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 720px) {
          .adam-note {
            padding: 72px 24px;
          }
          .adam-note .eyebrow {
            margin-bottom: 36px;
          }
          .adam-note .line {
            font-size: 19px;
          }
          .adam-note .signature {
            font-size: 19px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .adam-note .eyebrow,
          .adam-note .line,
          .adam-note .signature,
          .adam-note .byline {
            animation-duration: 0.01ms !important;
          }
          .adam-note .linkedin {
            transition: none;
          }
        }
      `}</style>

      <div className="adam-note__inner">
      <p className="eyebrow">A note from Adam</p>

      <p className="line">"We kept making the same mistake."</p>
      <p className="line">
        We would meet with a firm. They had 400 dormant contacts. "Have you called them?"
      </p>
      <p className="line">
        The answer was always no. Not because they forgot. Because they had no system. No
        permission. No cadence.
      </p>
      <p className="line">
        The Dead Zone is not a CRM problem. It is an avoidance problem.
      </p>
      <p className="line closer">
        This page is the answer<span className="period">.</span>
      </p>

      <p className="signature">- Adam</p>

      <p className="byline">
        <span>Adam Fridman</span>
        <span className="sep" aria-hidden="true">·</span>
        <span>Co-Author</span>
        <a
          href={ADAM_LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Adam Fridman on LinkedIn (opens in new tab)"
          className="linkedin"
        >
          <Linkedin size={14} strokeWidth={1.75} />
        </a>
      </p>
      </div>
    </section>
  );
}
