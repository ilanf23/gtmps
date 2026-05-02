import { useEffect, useRef, useState } from 'react';

type CardSpec = {
  slug: 'madcraft' | 'calliope' | 'spr';
  clientName: string;
  sector: string;
  metric: { kind: 'dollars'; target: number } | { kind: 'ratio'; target: number; denom: number } | { kind: 'count'; target: number };
  labelHTML: string;
  bodyHTML: string;
  quote: string;
  attribution: string;
  href: string;
};

const CARDS: CardSpec[] = [
  {
    slug: 'madcraft',
    clientName: 'Madcraft',
    sector: 'Digital Agency',
    metric: { kind: 'dollars', target: 400000 },
    labelHTML: 'Dormant proposal reactivated. <strong>7-minute reply.</strong>',
    bodyHTML:
      'Proposal had been silent <strong>9 months</strong>. Buyer replied 7 minutes after a signal-matched email. Asked Madcraft to be their agency of record for 2026.',
    quote: 'Lead nurturing agent created a customized note that reactivated a $400,000 opportunity for us.',
    attribution: 'Stephen Cuccio · Head of New Client Strategy',
    href: 'https://mabbly.ai/case-study/madcraft',
  },
  {
    slug: 'calliope',
    clientName: 'Calliope Communications',
    sector: 'Healthcare B2B Content',
    metric: { kind: 'ratio', target: 2, denom: 2 },
    labelHTML: 'Dormant healthcare contacts replied.',
    bodyHTML:
      'First 2 emails sent. Both replied. One positive engagement, one "stay in touch" reopened door. <strong>Founder voice preserved through human review.</strong>',
    quote: 'The AI has done a pretty good job connecting the dots.',
    attribution: 'Mary Tindall · Founder',
    href: 'https://mabbly.ai/case-study/calliope',
  },
  {
    slug: 'spr',
    clientName: 'SPR',
    sector: 'Chicago Technology Consulting',
    metric: { kind: 'count', target: 150 },
    labelHTML: 'Dormant enterprise contacts identified. <strong>43 sent · 3 conversations restarted.</strong>',
    bodyHTML:
      '3-layer human review (enrichment, content, executive). 4 ICPs. Reply rate <strong>~7%</strong>. Kyle Gams (Managing Director) was final approver.',
    quote: "Your guys' signal is the personalization piece.",
    attribution: 'Kristin Rosa · Creative & Content Manager',
    href: 'https://mabbly.ai/case-study/spr',
  },
];

const HEADLINE_WORDS = ['The', 'framework', 'works', 'in', 'the', 'field.'];

function formatDollars(n: number) {
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return '$' + Math.round(n / 1e3) + 'K';
  return '$' + Math.round(n);
}

function MetricNum({
  spec,
  trigger,
  reduced,
  delayMs,
}: {
  spec: CardSpec['metric'];
  trigger: boolean;
  reduced: boolean;
  delayMs: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!trigger || startedRef.current) return;
    startedRef.current = true;
    const el = ref.current;
    if (!el) return;

    const setFinal = () => {
      if (spec.kind === 'dollars') el.textContent = formatDollars(spec.target);
      else if (spec.kind === 'ratio')
        el.innerHTML = `${spec.target}<span class="slash">/</span><span class="denom">${spec.denom}</span>`;
      else el.textContent = spec.target.toLocaleString();
    };

    if (reduced) {
      setFinal();
      return;
    }

    let raf = 0;
    const startAt = performance.now() + delayMs;
    const duration = 1400;

    const step = (now: number) => {
      if (now < startAt) {
        raf = requestAnimationFrame(step);
        return;
      }
      const p = Math.min((now - startAt) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = spec.target * eased;
      if (spec.kind === 'dollars') el.textContent = formatDollars(v);
      else if (spec.kind === 'ratio')
        el.innerHTML = `${Math.round(v)}<span class="slash">/</span><span class="denom">${spec.denom}</span>`;
      else el.textContent = Math.round(v).toLocaleString();
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [trigger, reduced, delayMs, spec]);

  const initial =
    spec.kind === 'dollars' ? '$0K' : spec.kind === 'ratio' ? `0/${spec.denom}` : '0';

  return (
    <span ref={ref} className="metric-num">
      {initial.includes('/') ? (
        <>
          {initial.split('/')[0]}
          <span className="slash">/</span>
          <span className="denom">{initial.split('/')[1]}</span>
        </>
      ) : (
        initial
      )}
    </span>
  );
}

export default function Results() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [reduced, setReduced] = useState(false);
  const [sectionIn, setSectionIn] = useState(false);
  const [cardIn, setCardIn] = useState<boolean[]>(() => CARDS.map(() => false));

  // Detect reduced motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Section IO — triggers entrance animations
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (reduced) {
      setSectionIn(true);
      setCardIn(CARDS.map(() => true));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSectionIn(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);

    // Fallback: re-check after 100ms in case the section is already on screen
    const fallback = window.setTimeout(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) setSectionIn(true);
    }, 100);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [reduced]);

  // Per-card IO — triggers count-up on each card individually
  useEffect(() => {
    if (reduced) return;
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((el, idx) => {
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setCardIn((prev) => {
                if (prev[idx]) return prev;
                const next = [...prev];
                next[idx] = true;
                return next;
              });
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 },
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((io) => io.disconnect());
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="results"
      className={`proof-section ${sectionIn ? 'is-in' : ''}`}
      aria-label="Proof — three documented cases"
    >
      <style>{`
        .proof-section {
          --depth: #0F1E1D;
          --depth-soft: #2C3A38;
          --depth-deep: #07110F;
          --care: #BF461A;
          --care-bright: #E5582B;
          --energy: #FFBA1A;
          --purpose: #C9AC2A;
          --cream: #F8F2E5;
          --cream-card: #FCFAF4;
          --cream-border: #E5E0CF;
          --cream-line: #ECE6D5;
          --muted: #6B7370;
          --muted-soft: #9AA09C;
          --ink-line: rgba(248, 242, 229, 0.10);
          --ink-line-strong: rgba(248, 242, 229, 0.18);
          --ink-soft: rgba(248, 242, 229, 0.55);
          --ink-medium: rgba(248, 242, 229, 0.72);
          --pf-display: 'Inter Tight', 'Arial Black', 'Helvetica Neue', sans-serif;
          --pf-mono: 'DM Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace;
          --pf-body: 'Inter Tight', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          --pf-serif: 'Cormorant Garamond', 'Georgia', 'Times New Roman', serif;
          --ease: cubic-bezier(0.13, 0.28, 0.3, 1);

          position: relative;
          background:
            radial-gradient(ellipse 1100px 600px at 50% 0%, rgba(191, 70, 26, 0.04), transparent 60%),
            var(--depth);
          color: var(--cream);
          padding: 44px 32px 52px;
          overflow: hidden;
        }

        /* Frame hairlines */
        .proof-section .frame-top,
        .proof-section .frame-bottom {
          position: absolute;
          left: 32px;
          right: 32px;
          height: 1px;
          background: var(--ink-line);
          pointer-events: none;
        }
        .proof-section .frame-top { top: 18px; }
        .proof-section .frame-bottom { bottom: 18px; }

        .proof-section .running-head,
        .proof-section .running-head-r {
          position: absolute;
          top: 22px;
          font-family: var(--pf-mono);
          font-size: 8px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-soft);
          font-weight: 600;
        }
        .proof-section .running-head { left: 32px; }
        .proof-section .running-head-r { right: 32px; }

        /* Inner wrapper */
        .proof-section .section {
          max-width: 1180px;
          margin: 0 auto;
          padding-top: 24px;
          position: relative;
          z-index: 1;
        }

        /* Section header */
        .proof-section .section-head {
          text-align: center;
          margin-bottom: 38px;
        }
        .proof-section .meta-row {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          font-family: var(--pf-mono);
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 22px;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.6s var(--ease), transform 0.6s var(--ease);
        }
        .proof-section .meta-row::before,
        .proof-section .meta-row::after {
          content: "";
          display: inline-block;
          width: 28px;
          height: 1px;
          background: var(--ink-line-strong);
        }
        .proof-section .meta-num { color: var(--cream); }
        .proof-section .meta-pip { color: var(--care-bright); }
        .proof-section .meta-word { color: var(--purpose); }

        .proof-section .headline {
          font-family: var(--pf-display);
          font-size: clamp(34px, 4.6vw, 56px);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.02;
          color: var(--cream);
          margin: 0 auto;
          max-width: 18ch;
        }
        .proof-section .headline .period { color: var(--care-bright); }
        .proof-section .word-mask {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          line-height: 1.02;
        }
        .proof-section .word-inner {
          display: inline-block;
          transform: translateY(105%);
          transition: transform 0.7s var(--ease);
        }
        .proof-section .subhead {
          font-family: var(--pf-body);
          font-size: 14px;
          line-height: 1.5;
          color: var(--ink-medium);
          margin: 18px auto 0;
          max-width: 560px;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.6s var(--ease) 0.55s, transform 0.6s var(--ease) 0.55s;
        }

        /* Headline word delays */
        .proof-section .word-mask:nth-child(1) .word-inner { transition-delay: 0.10s; }
        .proof-section .word-mask:nth-child(2) .word-inner { transition-delay: 0.16s; }
        .proof-section .word-mask:nth-child(3) .word-inner { transition-delay: 0.22s; }
        .proof-section .word-mask:nth-child(4) .word-inner { transition-delay: 0.28s; }
        .proof-section .word-mask:nth-child(5) .word-inner { transition-delay: 0.34s; }
        .proof-section .word-mask:nth-child(6) .word-inner { transition-delay: 0.40s; }

        /* Reveal */
        .proof-section.is-in .meta-row { opacity: 1; transform: translateY(0); }
        .proof-section.is-in .word-inner { transform: translateY(0); }
        .proof-section.is-in .subhead { opacity: 1; transform: translateY(0); }

        /* Card grid */
        .proof-section .card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 36px;
        }

        .proof-section .case-card {
          background: var(--cream-card);
          border: 1px solid rgba(15, 30, 29, 0.10);
          border-radius: 2px;
          padding: 22px 22px 18px;
          display: flex;
          flex-direction: column;
          position: relative;
          color: var(--depth);
          box-shadow:
            0 1px 0 rgba(0, 0, 0, 0.10),
            0 12px 32px -14px rgba(0, 0, 0, 0.45),
            0 24px 60px -28px rgba(0, 0, 0, 0.35);
          opacity: 0;
          transform: translateY(14px);
          transition:
            opacity 0.7s var(--ease),
            transform 0.7s var(--ease),
            border-color 0.3s var(--ease),
            box-shadow 0.3s var(--ease);
        }
        .proof-section .case-card:nth-child(1) { transition-delay: 0.65s, 0.65s, 0s, 0s; }
        .proof-section .case-card:nth-child(2) { transition-delay: 0.74s, 0.74s, 0s, 0s; }
        .proof-section .case-card:nth-child(3) { transition-delay: 0.83s, 0.83s, 0s, 0s; }
        .proof-section.is-in .case-card { opacity: 1; transform: translateY(0); }

        .proof-section .case-card::before {
          content: '';
          position: absolute;
          top: -1px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--care);
          transition: width 0.4s var(--ease);
        }
        .proof-section .case-card:hover::before { width: 56px; }
        .proof-section .case-card:hover {
          border-color: rgba(191, 70, 26, 0.30);
          transform: translateY(-3px);
          box-shadow:
            0 1px 0 rgba(0, 0, 0, 0.10),
            0 22px 44px -12px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(191, 70, 26, 0.08);
        }

        .proof-section .eyebrow {
          font-family: var(--pf-mono);
          font-size: 9px;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          line-height: 1.4;
          margin: 0 0 18px;
        }
        .proof-section .eyebrow-name { color: var(--purpose); font-weight: 700; }
        .proof-section .eyebrow-pip { color: var(--muted-soft); margin: 0 6px; }
        .proof-section .eyebrow-sector { color: var(--depth); font-weight: 600; }

        .proof-section .metric-num {
          font-family: var(--pf-display);
          font-size: clamp(40px, 4.4vw, 56px);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 0.94;
          color: var(--depth);
          display: inline-block;
        }
        .proof-section .metric-num .slash {
          color: var(--care);
          font-size: 0.78em;
          margin: 0 0.04em;
        }
        .proof-section .metric-num .denom {
          color: var(--muted);
          font-size: 0.7em;
          letter-spacing: -0.03em;
        }
        .proof-section .metric-label {
          font-family: var(--pf-body);
          font-size: 12.5px;
          line-height: 1.4;
          color: var(--depth);
          margin: 10px 0 14px;
          font-weight: 500;
        }
        .proof-section .metric-label strong { font-weight: 700; }

        .proof-section .case-body {
          font-family: var(--pf-body);
          font-size: 12.5px;
          line-height: 1.55;
          color: var(--depth-soft);
          margin: 0 0 18px;
        }
        .proof-section .case-body strong {
          color: var(--depth);
          font-weight: 700;
        }

        .proof-section .case-quote {
          font-family: var(--pf-serif);
          font-style: italic;
          font-size: 14px;
          line-height: 1.4;
          color: var(--depth);
          border-left: 2px solid var(--care);
          padding: 4px 0 4px 12px;
          margin: 0 0 14px;
        }
        .proof-section .case-quote::before { content: "\\201C"; }
        .proof-section .case-quote::after { content: "\\201D"; }

        .proof-section .attribution {
          font-family: var(--pf-mono);
          font-size: 9px;
          letter-spacing: 0.16em;
          line-height: 1.5;
          text-transform: uppercase;
          color: var(--muted);
          font-weight: 600;
          margin: 0 0 16px;
        }

        .proof-section .case-foot {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--cream-line);
        }
        .proof-section .case-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--pf-mono);
          font-size: 9.5px;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--depth);
          text-decoration: none;
          transition: color 0.3s var(--ease);
        }
        .proof-section .case-link svg { transition: transform 0.3s var(--ease); }
        .proof-section .case-link:hover { color: var(--care); }
        .proof-section .case-link:hover svg { transform: translateX(4px); }

        /* Disclaimer */
        .proof-section .disclaimer {
          max-width: 780px;
          margin: 0 auto;
          padding-top: 24px;
          border-top: 1px solid var(--ink-line);
          text-align: center;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.6s var(--ease) 1.00s, transform 0.6s var(--ease) 1.00s;
        }
        .proof-section.is-in .disclaimer { opacity: 1; transform: translateY(0); }
        .proof-section .disclaimer-tag {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: var(--pf-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--care-bright);
          margin-bottom: 14px;
        }
        .proof-section .disclaimer-tag::before,
        .proof-section .disclaimer-tag::after {
          content: "";
          display: inline-block;
          width: 22px;
          height: 1px;
          background: rgba(191, 70, 26, 0.45);
        }
        .proof-section .disclaimer-body {
          font-family: var(--pf-serif);
          font-style: italic;
          font-size: 14px;
          line-height: 1.55;
          color: var(--ink-soft);
          margin: 0;
        }
        .proof-section .disclaimer-body .not {
          font-family: var(--pf-body);
          font-style: normal;
          font-weight: 600;
          font-size: 13px;
          color: var(--cream);
        }

        /* Responsive */
        @media (max-width: 920px) {
          .proof-section { padding: 36px 22px 44px; }
          .proof-section .frame-top,
          .proof-section .frame-bottom { left: 22px; right: 22px; }
          .proof-section .running-head { left: 22px; }
          .proof-section .running-head-r { right: 22px; }
          .proof-section .card-grid { grid-template-columns: 1fr; gap: 12px; }
          .proof-section .case-card { padding: 20px; }
          .proof-section .metric-num { font-size: 44px; }
        }
        @media (max-width: 480px) {
          .proof-section .headline { font-size: 30px; }
          .proof-section .meta-row::before,
          .proof-section .meta-row::after { width: 18px; }
          .proof-section .case-quote { font-size: 13px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .proof-section *,
          .proof-section *::before,
          .proof-section *::after {
            transition-duration: 0.01ms !important;
            transition-delay: 0ms !important;
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
          }
          .proof-section .meta-row,
          .proof-section .word-inner,
          .proof-section .subhead,
          .proof-section .case-card,
          .proof-section .disclaimer {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="frame-top" aria-hidden />
      <div className="frame-bottom" aria-hidden />
      <span className="running-head">Discover Mabbly</span>
      <span className="running-head-r">Section 12 · Proof</span>

      <div className="section">
        <header className="section-head">
          <p className="meta-row">
            <span className="meta-num">12</span>
            <span className="meta-pip">·</span>
            <span className="meta-word">Proof</span>
          </p>
          <h2 className="headline">
            {HEADLINE_WORDS.map((word, i) => {
              const isLast = i === HEADLINE_WORDS.length - 1;
              if (isLast) {
                // "field." — split off the period so we can color it
                return (
                  <span className="word-mask" key={`${word}-${i}`}>
                    <span className="word-inner">
                      field<span className="period">.</span>{' '}
                    </span>
                  </span>
                );
              }
              return (
                <span className="word-mask" key={`${word}-${i}`}>
                  <span className="word-inner">{word}&nbsp;</span>
                </span>
              );
            })}
          </h2>
          <p className="subhead">Three documented cases. Real firms. Real outcomes. Real quotes.</p>
        </header>

        <div className="card-grid">
          {CARDS.map((card, idx) => (
            <article
              key={card.slug}
              ref={(el) => { cardRefs.current[idx] = el; }}
              className="case-card"
            >
              <p className="eyebrow">
                <span className="eyebrow-name">{card.clientName}</span>
                <span className="eyebrow-pip">·</span>
                <span className="eyebrow-sector">{card.sector}</span>
              </p>
              <MetricNum
                spec={card.metric}
                trigger={cardIn[idx]}
                reduced={reduced}
                delayMs={700 + idx * 120}
              />
              <p
                className="metric-label"
                dangerouslySetInnerHTML={{ __html: card.labelHTML }}
              />
              <p
                className="case-body"
                dangerouslySetInnerHTML={{ __html: card.bodyHTML }}
              />
              <p className="case-quote">{card.quote}</p>
              <p className="attribution">{card.attribution}</p>
              <div className="case-foot">
                <a
                  className="case-link"
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read full case study
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path
                      d="M2 7h10m0 0L8 3m4 4l-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="disclaimer">
          <p className="disclaimer-tag">Honest Note</p>
          <p className="disclaimer-body">
            What did <span className="not">not</span> work for everyone: each of these firms had an
            internal owner who ran the work. Without an owner, the framework does not run itself.
            Three firms in our pilot saw little movement. The pattern was the same: no one owned it.
            We tell you this because you should know.
          </p>
        </div>
      </div>
    </section>
  );
}
