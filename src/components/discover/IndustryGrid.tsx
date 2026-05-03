import { Link } from 'react-router-dom';
import {
  Briefcase,
  Scale,
  Calculator,
  Server,
  TrendingUp,
  Building2,
  UserSearch,
  Megaphone,
  type LucideIcon,
} from 'lucide-react';

type Vertical = {
  slug: string;
  name: string;
  term: string;
  hook: string;
  Icon: LucideIcon;
};

const VERTICALS: Vertical[] = [
  {
    slug: 'consulting',
    name: 'Management Consulting',
    term: 'Practice Growth',
    hook: 'For partner-led practices selling six- to seven-figure engagements.',
    Icon: Briefcase,
  },
  {
    slug: 'law',
    name: 'Law Firms',
    term: 'Origination Strategy',
    hook: 'For partners building books in AmLaw and boutique firms.',
    Icon: Scale,
  },
  {
    slug: 'accounting',
    name: 'Accounting & Tax',
    term: 'Client Development',
    hook: 'For partners growing books beyond compliance season.',
    Icon: Calculator,
  },
  {
    slug: 'msp',
    name: 'MSP & IT Services',
    term: 'Tech-Native GTM',
    hook: 'For MSPs renewing contracts and expanding to managed services.',
    Icon: Server,
  },
  {
    slug: 'advisory',
    name: 'Financial Advisory',
    term: 'Prospecting Strategy',
    hook: 'For RIAs and wealth advisors building HNW books.',
    Icon: TrendingUp,
  },
  {
    slug: 'ae',
    name: 'Architecture & Engineering',
    term: 'Business Development',
    hook: 'For A&E firms winning project pipelines and recurring clients.',
    Icon: Building2,
  },
  {
    slug: 'recruiting',
    name: 'Executive Search',
    term: 'Mandate Origination',
    hook: 'For search firms building recurring placement pipelines.',
    Icon: UserSearch,
  },
  {
    slug: 'agency',
    name: 'Marketing & Creative',
    term: 'New Business',
    hook: 'For agencies converting prospects and reactivating dormant clients.',
    Icon: Megaphone,
  },
];

export default function IndustryGrid() {
  return (
    <section id="industries" className="ind-section">
      <style>{`
        .ind-section {
          --color-elevation: #EDF5EC;
          --color-depth:     #0F1E1D;
          --color-care:      #BF461A;
          --color-energy:    #FFBA1A;
          --color-purpose:   #A79014;
          --color-olive:     #CBD3CA;
          --color-voyage:    #225351;
          --ind-mono: 'DM Mono', ui-monospace, Menlo, monospace;
          --ind-display: 'Inter Tight', system-ui, sans-serif;
          --ind-body: 'Inter Tight', system-ui, sans-serif;

          position: relative;
          background: var(--color-depth);
          color: var(--color-elevation);
          overflow: hidden;
          border-top: 1px solid rgba(237, 245, 236, 0.06);
          border-bottom: 1px solid rgba(237, 245, 236, 0.06);
        }
        .ind-section::before {
          content: ""; position: absolute;
          top: -200px; left: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(167, 144, 20, 0.10) 0%, transparent 60%);
          pointer-events: none; z-index: 0;
        }
        .ind-section::after {
          content: ""; position: absolute;
          bottom: -150px; right: -150px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(191, 70, 26, 0.10) 0%, transparent 60%);
          pointer-events: none; z-index: 0;
        }
        .ind-blob {
          position: absolute;
          bottom: -240px; right: -180px;
          width: 720px; height: auto;
          opacity: 0.05;
          z-index: 0;
          pointer-events: none;
          animation: ind-blob-rotate 100s linear infinite;
          transform-origin: 60% 40%;
        }
        @keyframes ind-blob-rotate { to { transform: rotate(360deg); } }

        .ind-inner {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
        }
        .ind-header {
          padding: 96px 32px 48px 32px;
        }
        .ind-eyebrow {
          font-family: var(--ind-mono);
          font-size: 13px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--color-energy);
          margin: 0;
          font-weight: 500;
          opacity: 0;
          animation: ind-fadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 0ms forwards;
        }
        .ind-rule {
          width: 56px; height: 2px;
          background: var(--color-energy);
          margin: 16px 0 28px;
          transform-origin: left center;
          transform: scaleX(0);
          animation: ind-drawLine 800ms cubic-bezier(0.45, 0, 0.2, 1) 400ms forwards;
        }
        .ind-headline {
          font-family: var(--ind-display);
          font-weight: 900;
          font-size: clamp(48px, 6.4vw, 104px);
          line-height: 0.95;
          letter-spacing: -0.025em;
          color: var(--color-elevation);
          margin: 0;
          max-width: 18ch;
        }
        .ind-headline .w {
          display: inline-block;
          opacity: 0;
          transform: translateY(40px);
          animation: ind-wordIn 800ms cubic-bezier(0.13, 0.28, 0.3, 1) forwards;
          margin-right: 0.28em;
        }
        .ind-headline .w:last-child { margin-right: 0; }
        .ind-headline .w1 { animation-delay: 600ms; }
        .ind-headline .w2 { animation-delay: 700ms; }
        .ind-headline .w3 { animation-delay: 800ms; }
        .ind-headline .w4 { animation-delay: 900ms; }
        .ind-headline .period { color: var(--color-energy); }

        .ind-sub {
          font-family: var(--ind-body);
          font-size: 19px;
          line-height: 1.5;
          color: var(--color-elevation);
          opacity: 0;
          max-width: 60ch;
          margin: 22px 0 0;
          font-weight: 400;
          animation: ind-subIn 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1100ms forwards;
        }
        @keyframes ind-subIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 0.78; transform: translateY(0); }
        }

        /* GRID */
        .ind-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          padding: 0 56px 32px 56px;
        }
        @media (max-width: 1100px) {
          .ind-grid { grid-template-columns: repeat(2, 1fr); padding: 0 32px 32px 32px; }
        }
        @media (max-width: 540px) {
          .ind-grid { grid-template-columns: 1fr; padding: 0 20px 24px 20px; }
        }

        /* CARD */
        .vcard {
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 240px;
          padding: 28px 24px 22px 24px;
          background: rgba(237, 245, 236, 0.04);
          border: 1px solid rgba(237, 245, 236, 0.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 16px;
          color: var(--color-elevation);
          text-decoration: none;
          overflow: hidden;
          cursor: pointer;
          opacity: 0;
          transform: translateY(20px);
          animation: ind-cardIn 600ms cubic-bezier(0.13, 0.28, 0.3, 1) forwards;
          transition:
            transform 280ms cubic-bezier(0.13, 0.28, 0.3, 1),
            border-color 280ms ease,
            box-shadow 280ms ease,
            background 280ms ease;
        }
        @media (max-width: 540px) {
          .vcard { min-height: auto; }
        }
        .vcard.c1 { animation-delay: 1300ms; }
        .vcard.c2 { animation-delay: 1380ms; }
        .vcard.c3 { animation-delay: 1460ms; }
        .vcard.c4 { animation-delay: 1540ms; }
        .vcard.c5 { animation-delay: 1620ms; }
        .vcard.c6 { animation-delay: 1700ms; }
        .vcard.c7 { animation-delay: 1780ms; }
        .vcard.c8 { animation-delay: 1860ms; }

        .vcard::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--color-energy), var(--color-care));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 350ms cubic-bezier(0.13, 0.28, 0.3, 1);
        }

        .vcard:hover {
          transform: translateY(-4px);
          background: rgba(237, 245, 236, 0.07);
          border-color: rgba(255, 186, 26, 0.55);
          box-shadow:
            0 16px 40px -12px rgba(0, 0, 0, 0.5),
            0 0 32px -8px rgba(255, 186, 26, 0.18);
        }
        .vcard:hover::before { transform: scaleX(1); }
        .vcard:focus-visible {
          outline: 2px solid var(--color-energy);
          outline-offset: 3px;
        }

        .vcard-slug {
          position: absolute;
          top: 22px;
          right: 22px;
          font-family: var(--ind-mono);
          font-size: 10px;
          letter-spacing: 0.06em;
          color: var(--color-elevation);
          opacity: 0.3;
          transition: color 280ms ease, opacity 280ms ease;
        }
        .vcard:hover .vcard-slug {
          opacity: 0.95;
          color: var(--color-energy);
        }

        .icon-wrap {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: rgba(237, 245, 236, 0.06);
          border: 1px solid rgba(237, 245, 236, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          transition: background 280ms ease, border-color 280ms ease, transform 280ms ease;
        }
        .vcard:hover .icon-wrap {
          background: rgba(255, 186, 26, 0.12);
          border-color: rgba(255, 186, 26, 0.45);
          transform: scale(1.05);
        }
        .icon-wrap svg {
          width: 24px; height: 24px;
          color: var(--color-energy);
          stroke: currentColor;
        }

        .vcard-term {
          font-family: var(--ind-mono);
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-energy);
          opacity: 0.85;
          margin: 0 0 8px;
          font-weight: 500;
        }
        .vcard-name {
          font-family: var(--ind-display);
          font-weight: 900;
          font-size: 22px;
          line-height: 1.05;
          letter-spacing: -0.015em;
          color: var(--color-elevation);
          margin: 0 0 10px;
        }
        .vcard-hook {
          font-family: var(--ind-body);
          font-size: 13px;
          line-height: 1.45;
          color: var(--color-elevation);
          opacity: 0.65;
          margin: 0 0 16px;
        }
        .vcard-link {
          margin-top: auto;
          font-family: var(--ind-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-energy);
          opacity: 0.55;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: opacity 280ms ease;
        }
        .vcard:hover .vcard-link { opacity: 1; }
        .vcard-link .arrow {
          display: inline-block;
          transition: transform 350ms cubic-bezier(0.85, 0, 0.15, 1);
        }
        .vcard:hover .vcard-link .arrow { transform: translateX(4px); }

        /* FOOTER PILL */
        .ind-foot {
          padding: 16px 32px 96px 32px;
          display: flex;
          justify-content: center;
          opacity: 0;
          animation: ind-fadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 2100ms forwards;
        }
        .ind-foot-pill {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 10px 18px;
          border-radius: 100px;
          background: rgba(237, 245, 236, 0.05);
          border: 1px solid rgba(237, 245, 236, 0.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          font-family: var(--ind-mono);
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-elevation);
          opacity: 0.85;
        }
        .ind-foot-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--color-energy);
          box-shadow: 0 0 12px rgba(255, 186, 26, 0.6);
          animation: ind-pulseDot 1.6s ease-in-out infinite;
        }
        @keyframes ind-pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.2); opacity: 0.5; }
        }

        /* keyframes */
        @keyframes ind-fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ind-drawLine {
          to { transform: scaleX(1); }
        }
        @keyframes ind-wordIn {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ind-cardIn {
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 720px) {
          .ind-header { padding: 72px 20px 32px; }
          .ind-foot { padding: 12px 20px 72px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ind-section *,
          .ind-section *::before,
          .ind-section *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .ind-section .ind-eyebrow,
          .ind-section .ind-sub,
          .ind-section .ind-foot,
          .ind-section .vcard,
          .ind-section .ind-headline .w { opacity: 1; transform: none; }
          .ind-section .ind-sub { opacity: 0.78; }
          .ind-section .ind-rule { transform: scaleX(1); }
        }
      `}</style>

      <svg className="ind-blob" viewBox="0 0 576 610" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M537.319 540.412L227.81 609.6L34.3851 540.412L0 302.629L34.3851 34.5832L270.807 0L537.319 34.5832L576 259.406L537.319 540.412Z"
          fill="#EDF5EC"
        />
      </svg>

      <div className="ind-inner">
        <div className="ind-header">
          <p className="ind-eyebrow">07 · The Verticals</p>
          <div className="ind-rule" aria-hidden />
          <h2 className="ind-headline">
            <span className="w w1">Built</span>
            <span className="w w2">for</span>
            <span className="w w3">relationship-driven</span>
            <span className="w w4">
              firms<span className="period">.</span>
            </span>
          </h2>
          <p className="ind-sub">
            One operating system. Eight specialties. The same recurring revenue posture.
          </p>
        </div>

        <div className="ind-grid">
          {VERTICALS.map((v, i) => {
            const Icon = v.Icon;
            return (
              <Link
                key={v.slug}
                to={`/${v.slug}`}
                className={`vcard c${i + 1}`}
                aria-label={`${v.name} - view thesis`}
              >
                <span className="vcard-slug">/{v.slug}</span>
                <span className="icon-wrap" aria-hidden>
                  <Icon strokeWidth={2} />
                </span>
                <p className="vcard-term">{v.term}</p>
                <h3 className="vcard-name">{v.name}</h3>
                <p className="vcard-hook">{v.hook}</p>
                <span className="vcard-link">
                  View thesis <span className="arrow">→</span>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="ind-foot">
          <span className="ind-foot-pill">
            <span className="ind-foot-dot" aria-hidden />
            <span>All 8 verticals live · Click your industry to see the full thesis</span>
          </span>
        </div>
      </div>
    </section>
  );
}
