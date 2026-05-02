import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Item = { q: string; a: string };

const ITEMS: Item[] = [
  {
    q: 'Is this a book about CRM software?',
    a: 'No. This is a strategy book. The MAP framework works with whatever CRM you already have — Salesforce, HubSpot, a spreadsheet — or without one entirely. The problem it solves is GTM mindset and relationship cadence, not tooling.',
  },
  {
    q: 'Does this work for firms under $5M in revenue?',
    a: 'The framework was developed with firms in the $5M–$100M band. Smaller firms can apply the Dead Zone and Five Orbits models, but the full MAP diagnostic is calibrated for firms with an established delivery and an active BD team.',
  },
  {
    q: 'How long does MAP implementation take?',
    a: 'Building your map takes ~90 seconds; reading and acting on it takes ~10 minutes. A full MAP activation — scoring your CRM, mapping your orbits, and establishing a relationship cadence — typically takes 3–4 weeks with one internal owner. Beta cohort firms saw first results within 90 days.',
  },
  {
    q: 'What makes this different from other GTM books?',
    a: 'Most GTM books are written for SaaS companies and retrofitted to services. This one was built from inside professional services firms with operating partners, not consultants. The framework has been tested at firms ranging from $5M to $1.2B.',
  },
  {
    q: 'When does the book ship?',
    a: 'The Beta Reader Program provides manuscript access now, ahead of the official publication date. Beta readers receive all 30 chapters, the MAP diagnostic, and a seat in the peer cohort. Official publication is scheduled for later this year.',
  },
  {
    q: 'Does this work if we already burned bridges with past clients?',
    a: 'Sometimes. If the relationship ended badly, this does not uncook that egg. If you simply disappeared and stopped following up, yes. Most dormant relationships are the second category.',
  },
  {
    q: 'What happens if my firm scores poorly on the diagnostic?',
    a: 'You score with everyone else in your revenue band. Most PS firms score between 28 and 44 out of 100. A low score is not a verdict. It is a starting point. The chapter we send addresses your weakest dimension first.',
  },
];

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="px-6 md:px-10"
      style={{
        background: '#FFFFFF',
        borderTop: '1px solid rgba(15, 30, 29, 0.08)',
        paddingTop: "clamp(64px, 12vw, 144px)",
        paddingBottom: "clamp(64px, 12vw, 144px)",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          animation: 'fadeUp 0.8s ease 0.1s both',
        }}
      >
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 14,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#A8923A',
            margin: 0,
            fontWeight: 500,
          }}
        >
          16 · COMMON QUESTIONS
        </p>
        <div
          aria-hidden
          style={{
            width: 44,
            height: 2,
            background: 'linear-gradient(90deg, #A8923A, rgba(168, 146, 58,0.3))',
            margin: '18px 0 28px',
            animation: 'growRule 0.8s ease both',
          }}
        />
        <h2
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 'clamp(44px, 6vw, 76px)',
            fontWeight: 500,
            color: '#0F1E1D',
            lineHeight: 1.0,
            letterSpacing: '-0.035em',
            margin: '0 0 18px',
          }}
        >
          Things people ask before they read it.
        </h2>
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 'clamp(18px, 1.8vw, 22px)',
            color: 'rgba(15, 30, 29, 0.66)',
            margin: '0 0 56px',
            lineHeight: 1.5,
            fontWeight: 300,
          }}
        >
          Straight answers. No sales language.
        </p>

        <div style={{ borderTop: '1px solid #D5DEC2' }}>
          {ITEMS.map((item, i) => {
            const open = openIdx === i;
            return (
              <div
                key={item.q}
                style={{
                  borderBottom:
                    i < ITEMS.length - 1 ? '1px solid rgba(42,26,8,0.12)' : 'none',
                }}
              >
                <div
                  onClick={() => setOpenIdx(open ? null : i)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '28px 0',
                    userSelect: 'none',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 'clamp(20px, 2.2vw, 28px)',
                      color: '#0F1E1D',
                      flex: 1,
                      paddingRight: 24,
                      lineHeight: 1.3,
                      fontWeight: 500,
                      letterSpacing: '-0.015em',
                    }}
                  >
                    {item.q}
                  </span>
                  <ChevronDown
                    width={26}
                    height={26}
                    color="#A8923A"
                    strokeWidth={2}
                    style={{
                      transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      flexShrink: 0,
                    }}
                  />
                </div>
                <div
                  style={{
                    overflow: 'hidden',
                    maxHeight: open ? 600 : 0,
                    transition: 'max-height 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <div
                    style={{
                      padding: '0 0 28px 0',
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 'clamp(17px, 1.6vw, 20px)',
                      lineHeight: 1.65,
                      color: 'rgba(15, 30, 29, 0.78)',
                      fontWeight: 300,
                      maxWidth: 820,
                    }}
                  >
                    {item.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
