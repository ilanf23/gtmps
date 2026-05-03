import { ChevronDown } from 'lucide-react';

type Item = { q: string; a: React.ReactNode };

const GROUPS: { label: string; honest?: boolean; items: Item[] }[] = [
  {
    label: 'About the book',
    items: [
      {
        q: 'Is this a book about CRM software?',
        a: (
          <>
            No.{' '}
            <span className="faq-care">
              The Dead Zone is not a CRM problem - it's an avoidance problem.
            </span>{' '}
            The book is about the operating system that turns dormant
            relationships into recurring revenue, regardless of which CRM your
            firm uses.
          </>
        ),
      },
      {
        q: 'What makes this different from other GTM books?',
        a: (
          <>
            <span className="faq-accent">
              500 practitioner interviews. 30 firms in the research cohort.
            </span>{' '}
            Foreword by Copulsky, former CMO of Deloitte and Senior Lecturer at
            Northwestern Kellogg.
            <br />
            <br />
            Every framework is anchored in verified case proof - Madcraft's{' '}
            <span className="faq-accent">$400K reactivated in seven minutes</span>,
            SPR's <span className="faq-accent">150 dormant contacts</span>{' '}
            identified, AArete's{' '}
            <span className="faq-accent">160 dormant proposals</span> found. No
            frameworks pulled from thin air.
          </>
        ),
      },
      {
        q: 'When does the book ship?',
        a: (
          <>
            Public launch is scheduled for{' '}
            <span className="faq-accent">Q4 2026</span>. Early Access readers see
            the manuscript{' '}
            <span className="faq-accent">90 days before public launch</span>.
            Approved firms get chapters as they're finalized - not all at once.
          </>
        ),
      },
    ],
  },
  {
    label: 'Will it work for my firm?',
    items: [
      {
        q: 'Does this work for firms under $5M in revenue?',
        a: (
          <>
            The research cohort focuses on PS firms{' '}
            <span className="faq-accent">$5M to $100M</span>. Smaller firms can
            absolutely apply the principles, but the playbook assumes you've
            already built a book of dormant relationships worth reactivating.
            <br />
            <br />
            If you're pre-revenue or below $5M, this is adjacent - useful as a
            long-term framework, but not optimized for your stage. We'd point you
            toward the podcast first, not the diagnostic.
          </>
        ),
      },
      {
        q: 'How long does MAP implementation take?',
        a: (
          <>
            Discovery audit: <span className="faq-accent">90 minutes</span>. RROS
            map design: 1–2 weeks. Full implementation:{' '}
            <span className="faq-accent">60–90 days</span> with weekly working
            sessions.
            <br />
            <br />
            <span className="faq-care">
              We don't hand off and disappear.
            </span>{' '}
            Mabbly's team stays through the rebuild - the timeline depends on
            how fast your internal owner can move.
          </>
        ),
      },
    ],
  },
  {
    label: 'Honest cases',
    honest: true,
    items: [
      {
        q: 'Does this work if we already burned bridges with past clients?',
        a: (
          <>
            Honestly - sometimes. The system gives you{' '}
            <span className="faq-care">permission and cadence</span> to reach
            back out, but if there's an unresolved issue (a botched engagement, a
            fee dispute, a partner conflict), the framework can't fix that.
            <br />
            <br />
            What it can do: identify which dormant relationships are reachable
            and which aren't. We've had firms find that{' '}
            <span className="faq-accent">60% of their "burned" list</span> was
            actually salvageable. The other 40% should stay dormant.
          </>
        ),
      },
      {
        q: 'What happens if my firm scores poorly on the diagnostic?',
        a: (
          <>
            You get the truthful read.{' '}
            <span className="faq-accent">
              Three firms in pilot saw little movement
            </span>{' '}
            - every one of them had no internal owner for the work.
            <br />
            <br />
            The diagnostic identifies the gap, but{' '}
            <span className="faq-care">
              you need someone on your team to own the rebuild.
            </span>{' '}
            If that person doesn't exist, the framework can't compensate. We'll
            tell you that on the discovery call before you commit.
          </>
        ),
      },
    ],
  },
];

const HEADLINE_WORDS = ['Things', 'people', 'ask', 'before', 'they', 'read', 'it.'];

export default function Faq() {
  return (
    <section
      id="faq"
      className="faq-section"
      style={{
        background: '#F5F1E8',
        borderTop: '1px solid rgba(15, 30, 29, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .faq-section {
          padding: clamp(64px, 12vw, 144px) 56px;
        }
        .faq-section .faq-inner {
          max-width: 980px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .faq-blob {
          position: absolute;
          top: -240px;
          right: -200px;
          width: 720px;
          height: 720px;
          opacity: 0.28;
          pointer-events: none;
          animation: faqBlobRotate 100s linear infinite;
          z-index: 0;
        }
        @keyframes faqBlobRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes faqDrawLine {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes faqWordIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes faqFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .faq-eyebrow {
          font-family: 'DM Mono', 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #A79014;
          margin: 0;
          font-weight: 500;
          opacity: 0;
          animation: faqFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 0ms forwards;
        }
        .faq-underline {
          display: block;
          width: 64px;
          height: 2px;
          background: #A79014;
          margin: 14px 0 28px;
          transform-origin: left;
          transform: scaleX(0);
          animation: faqDrawLine 800ms cubic-bezier(0.45, 0, 0.2, 1) 400ms forwards;
        }
        .faq-headline {
          font-family: 'Inter Tight', sans-serif;
          font-weight: 900;
          font-size: clamp(40px, 5.4vw, 76px);
          line-height: 1.0;
          letter-spacing: -0.02em;
          max-width: 18ch;
          color: #0F1E1D;
          margin: 0 0 18px;
        }
        .faq-headline .faq-word {
          display: inline-block;
          opacity: 0;
          transform: translateY(40px);
          animation: faqWordIn 800ms cubic-bezier(0.13, 0.28, 0.3, 1) forwards;
          margin-right: 0.22em;
        }
        .faq-headline .faq-word:last-child { margin-right: 0; }
        .faq-period {
          color: #BF461A;
        }
        .faq-subline {
          font-family: 'Inter Tight', sans-serif;
          font-size: 18px;
          line-height: 1.5;
          color: #0F1E1D;
          opacity: 0;
          margin: 0 0 56px;
          animation: faqFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1400ms forwards;
        }
        .faq-group {
          margin-top: 40px;
          opacity: 0;
          animation: faqFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) forwards;
        }
        .faq-group:first-of-type { margin-top: 0; }
        .faq-group-1 { animation-delay: 1600ms; }
        .faq-group-2 { animation-delay: 1800ms; }
        .faq-group-3 { animation-delay: 2000ms; }
        .faq-group-label {
          display: flex;
          align-items: center;
          gap: 14px;
          font-family: 'DM Mono', 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #A79014;
          margin: 0 0 14px;
          font-weight: 500;
        }
        .faq-group-label .faq-line {
          flex: 1;
          height: 1px;
          background: #A79014;
          opacity: 0.35;
        }
        .faq-group-label.faq-honest {
          color: #BF461A;
        }
        .faq-group-label.faq-honest .faq-line {
          background: #BF461A;
          opacity: 0.4;
        }
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .faq-item {
          background: #fdfbf6;
          border: 1px solid rgba(15, 30, 29, 0.1);
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          transition: border-color 250ms, background 250ms;
        }
        .faq-item:hover {
          border-color: rgba(15, 30, 29, 0.18);
        }
        .faq-item:hover .faq-chevron { opacity: 0.85; }
        .faq-item[open] {
          border-color: #BF461A;
          background: rgba(255, 255, 255, 0.6);
        }
        .faq-item::before {
          content: "";
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 3px;
          background: #BF461A;
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 280ms cubic-bezier(0.13, 0.28, 0.3, 1);
        }
        .faq-item[open]::before { transform: scaleY(1); }
        .faq-summary {
          list-style: none;
          cursor: pointer;
          padding: 22px 24px;
          display: flex;
          align-items: center;
          gap: 18px;
          user-select: none;
        }
        .faq-summary::-webkit-details-marker { display: none; }
        .faq-num {
          font-family: 'DM Mono', 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #A79014;
          width: 28px;
          flex-shrink: 0;
          font-weight: 500;
          transition: color 250ms;
        }
        .faq-item[open] .faq-num { color: #BF461A; }
        .faq-question {
          flex: 1;
          font-family: 'Inter Tight', sans-serif;
          font-weight: 700;
          font-size: 18px;
          line-height: 1.3;
          letter-spacing: -0.01em;
          color: #0F1E1D;
        }
        .faq-chevron {
          width: 20px;
          height: 20px;
          color: #0F1E1D;
          opacity: 0.55;
          transition: transform 350ms cubic-bezier(0.13, 0.28, 0.3, 1), color 250ms, opacity 250ms;
          flex-shrink: 0;
        }
        .faq-item[open] .faq-chevron {
          transform: rotate(180deg);
          color: #BF461A;
          opacity: 1;
        }
        .faq-answer {
          padding: 0 24px 24px 70px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: #0F1E1D;
          opacity: 0.85;
          max-width: 60ch;
        }
        .faq-accent {
          background: linear-gradient(to top, rgba(167, 144, 20, 0.28) 38%, transparent 38%);
          padding: 0 2px;
          font-weight: 600;
        }
        .faq-care {
          background: linear-gradient(to top, rgba(191, 70, 26, 0.22) 38%, transparent 38%);
          padding: 0 2px;
          font-weight: 600;
        }
        .faq-more-hint {
          margin: 56px 0 0;
          text-align: center;
          font-family: 'DM Mono', 'IBM Plex Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          opacity: 0;
          color: rgba(15, 30, 29, 0.55);
          animation: faqFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 2300ms forwards;
        }
        .faq-more-hint a {
          color: #BF461A;
          text-decoration: none;
          border-bottom: 1px solid rgba(191, 70, 26, 0.4);
          padding-bottom: 1px;
          transition: border-color 250ms;
        }
        .faq-more-hint a:hover {
          border-bottom-color: #BF461A;
        }
        @media (max-width: 720px) {
          .faq-section {
            padding: 56px 24px;
          }
          .faq-headline {
            font-size: clamp(32px, 9vw, 48px);
          }
          .faq-summary {
            padding: 18px;
            gap: 14px;
          }
          .faq-question {
            font-size: 16px;
          }
          .faq-answer {
            padding: 0 18px 20px 56px;
            font-size: 14px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .faq-eyebrow,
          .faq-underline,
          .faq-headline .faq-word,
          .faq-subline,
          .faq-group,
          .faq-more-hint,
          .faq-blob {
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
          }
          .faq-item,
          .faq-item::before,
          .faq-chevron,
          .faq-num {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <svg
        className="faq-blob"
        viewBox="0 0 720 720"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M360 60c100 0 180 50 240 130s80 180 30 270-160 140-270 140-220-50-280-150S20 240 80 160 260 60 360 60z"
          fill="#CBD3CA"
        />
      </svg>

      <div className="faq-inner">
        <p className="faq-eyebrow">
          16 · Common Questions
        </p>
        <span className="faq-underline" aria-hidden="true" />
        <h2 className="faq-headline">
          {HEADLINE_WORDS.map((w, i) => {
            const isLast = i === HEADLINE_WORDS.length - 1;
            return (
              <span
                key={i}
                className="faq-word"
                style={{ animationDelay: `${600 + i * 100}ms` }}
              >
                {isLast ? (
                  <>
                    {w.replace('.', '')}
                    <span className="faq-period">.</span>
                  </>
                ) : (
                  w
                )}
              </span>
            );
          })}
        </h2>
        <p className="faq-subline">Straight answers. No sales language.</p>

        {GROUPS.map((group, gi) => {
          let qNum = 0;
          for (let i = 0; i < gi; i++) qNum += GROUPS[i].items.length;
          return (
            <div
              key={group.label}
              className={`faq-group faq-group-${gi + 1}`}
            >
              <p
                className={`faq-group-label${group.honest ? ' faq-honest' : ''}`}
              >
                <span>{group.label}</span>
                <span className="faq-line" aria-hidden="true" />
              </p>
              <div className="faq-list">
                {group.items.map((item, idx) => {
                  const num = String(qNum + idx + 1).padStart(2, '0');
                  return (
                    <details key={item.q} className="faq-item">
                      <summary className="faq-summary">
                        <span className="faq-num">{num}</span>
                        <span className="faq-question">{item.q}</span>
                        <ChevronDown
                          className="faq-chevron"
                          strokeWidth={2.4}
                          aria-hidden="true"
                        />
                      </summary>
                      <div className="faq-answer">
                        <p style={{ margin: 0 }}>{item.a}</p>
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>
          );
        })}

        <p className="faq-more-hint">
          More questions?{' '}
          <a href="mailto:adam@mabbly.com">Email Adam directly →</a>
        </p>
      </div>
    </section>
  );
}
