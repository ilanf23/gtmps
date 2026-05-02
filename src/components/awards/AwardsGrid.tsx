import { Link } from 'react-router-dom';
import {
  Briefcase,
  Scale,
  Calculator,
  Server,
  TrendingUp,
  Compass,
  UserSearch,
  Palette,
  type LucideIcon,
} from 'lucide-react';

type Award = {
  name: string;
  vertical: string;
  slug: string;
  description: string;
  Icon: LucideIcon;
};

const AWARD_DEFINITIONS: Award[] = [
  {
    name: 'The Practice Growth Award',
    vertical: 'Management Consulting',
    slug: 'consulting',
    description:
      'For the consulting firm that activated dormant accounts and built systematic origination beyond partner calendars.',
    Icon: Briefcase,
  },
  {
    name: 'The Origination Award',
    vertical: 'Law Firms',
    slug: 'law',
    description:
      'For the law firm that built origination as a system, not as a hostage to partner books.',
    Icon: Scale,
  },
  {
    name: 'The Client Development Award',
    vertical: 'Accounting & Tax',
    slug: 'accounting',
    description:
      'For the accounting firm that turned tax clients into advisory clients without losing the relationship.',
    Icon: Calculator,
  },
  {
    name: 'The GTM Award',
    vertical: 'MSP & IT Services',
    slug: 'msp',
    description:
      'For the MSP that systemized renewal capture and reactivated lost accounts with signal driven outreach.',
    Icon: Server,
  },
  {
    name: 'The Prospecting Award',
    vertical: 'Financial Advisory',
    slug: 'advisory',
    description:
      'For the advisory firm that built systematic prospecting around wealth events and COI cultivation.',
    Icon: TrendingUp,
  },
  {
    name: 'The BD Award',
    vertical: 'Architecture & Engineering',
    slug: 'ae',
    description:
      'For the A&E firm that converted dormant pursuits and built repeat business as a system.',
    Icon: Compass,
  },
  {
    name: 'The Mandate Origination Award',
    vertical: 'Executive Search',
    slug: 'recruiting',
    description:
      'For the search firm that retracked placed candidates and reignited dormant client mandates.',
    Icon: UserSearch,
  },
  {
    name: 'The New Business Award',
    vertical: 'Marketing & Creative',
    slug: 'agency',
    description:
      'For the agency that systemized lost pitch reactivation and built principal led new business at scale.',
    Icon: Palette,
  },
];

export default function AwardsGrid() {
  return (
    <section
      id="awards"
      style={{
        background: '#0D0905',
        padding: '120px 24px',
        borderTop: '1px solid rgba(168, 146, 58,0.08)',
      }}
    >
      <style>{`
        .ag-header {
          max-width: 880px;
          margin: 0 auto 72px;
          text-align: center;
        }
        .ag-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #A8923A;
          margin: 0 0 20px;
        }
        .ag-headline {
          font-family: var(--font-display);
          font-weight: 900;
          text-transform: uppercase;
          font-weight: 400;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.08;
          letter-spacing: -0.018em;
          color: #EDF5EC;
          margin: 0 0 20px;
        }
        .ag-sub {
          font-family: 'Inter Tight', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: rgba(237, 245, 236,0.6);
          margin: 0;
          max-width: 640px;
          margin: 0 auto;
        }
        .ag-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .ag-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
        }
        @media (min-width: 1280px) {
          .ag-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; }
        }
        .ag-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 32px 28px;
          background: #0F1E1D;
          border: 1px solid rgba(168, 146, 58,0.18);
          border-radius: 4px;
          text-decoration: none;
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
          min-height: 320px;
        }
        .ag-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 48px -16px rgba(168, 146, 58,0.28);
          border-color: rgba(168, 146, 58,0.5);
        }
        .ag-card:hover .ag-icon { transform: scale(1.06); }
        .ag-icon {
          color: #A8923A;
          transition: transform 220ms ease;
        }
        .ag-name {
          font-family: 'Inter Tight', sans-serif;
          font-weight: 600;
          font-size: 22px;
          line-height: 1.25;
          color: #EDF5EC;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .ag-vertical {
          font-family: 'Inter Tight', sans-serif;
          font-style: italic;
          font-size: 14px;
          color: rgba(237, 245, 236,0.55);
          margin: 0;
        }
        .ag-desc {
          font-family: var(--font-display);
          font-weight: 900;
          text-transform: uppercase;
          font-size: 16px;
          line-height: 1.55;
          color: rgba(237, 245, 236,0.75);
          margin: 0;
          flex: 1;
        }
        .ag-link {
          font-family: 'Inter Tight', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #A8923A;
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-color: rgba(168, 146, 58,0.35);
          transition: text-decoration-color 200ms;
        }
        .ag-card:hover .ag-link { text-decoration-color: #A8923A; }
      `}</style>

      <div className="ag-header">
        <p className="ag-eyebrow">02 · The Eight Awards</p>
        <h2 className="ag-headline">One award per vertical. Named in your language.</h2>
        <p className="ag-sub">
          Each award recognizes the firm that exemplifies its industry's signature growth motion. Defined by your vocabulary, judged on your terms.
        </p>
      </div>

      <div className="ag-grid">
        {AWARD_DEFINITIONS.map((a) => {
          const Icon = a.Icon;
          return (
            <Link key={a.slug} to={`/${a.slug}`} className="ag-card">
              <Icon size={40} strokeWidth={1.5} className="ag-icon" />
              <h3 className="ag-name">{a.name}</h3>
              <p className="ag-vertical">{a.vertical}</p>
              <p className="ag-desc">{a.description}</p>
              <span className="ag-link">Apply for {a.vertical.split(' ')[0].toLowerCase()} →</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
