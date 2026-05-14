import { useEffect, useRef, useState } from 'react';

type CardSpec = {
  slug: 'madcraft' | 'calliope' | 'spr';
  clientName: string;
  sector: string;
  metric:
    | { kind: 'dollars'; target: number }
    | { kind: 'ratio'; target: number; denom: number }
    | { kind: 'count'; target: number }
    | { kind: 'percent'; target: number };
  labelHTML: string;
  bodyHTML: string;
  quote: string;
  attribution: string;
  href: string;
};

type FeaturedSpec = CardSpec & {
  headline: string;
  deck: string;
  sections: { eyebrow: string; bodyHTML: string }[];
  closingHTML: string;
  highlights: { stat: string; label: string }[];
};

const FEATURED: FeaturedSpec = {
  slug: 'madcraft',
  clientName: 'Madcraft',
  sector: 'Digital Agency · Chicago',
  metric: { kind: 'dollars', target: 400000 },
  headline: '$400K in 7 minutes.',
  deck: 'How Madcraft reactivated a dead proposal that had been silent for 9 months.',
  labelHTML: 'Dormant proposal reactivated. <strong>7-minute reply.</strong>',
  bodyHTML:
    'Proposal had been silent <strong>9 months</strong>. Buyer replied 7 minutes after a signal-matched email. Asked Madcraft to be their agency of record for 2026.',
  sections: [
    {
      eyebrow: 'The Setup',
      bodyHTML:
        'Madcraft is a digital agency, strategy, design, development, performance. Stephen Cuccio runs new client strategy. They had a high-intent proposal sitting silent for <strong>9 to 10 months</strong>. The relationship was real. The work was real. But the timing was off, and the next outreach could not sound generic.',
    },
    {
      eyebrow: 'The Move',
      bodyHTML:
        'The team used the <strong>Lead Nurturing Agent</strong>. Real-world signals surfaced. Email drafted in the practitioner\'s voice. Human review before sending. Stephen approved.',
    },
    {
      eyebrow: 'The Reply',
      bodyHTML:
        'The buyer replied in <strong>7 minutes</strong>. The reply asked if Madcraft could be their <strong>agency of record for 2026</strong>. Branding, digital, media buying. The whole engagement.',
    },
    {
      eyebrow: 'Why It Landed',
      bodyHTML:
        'Not a "checking in" email. The note referenced something specific the buyer cared about <em>right now</em>. The agent surfaced the signal. A human approved the words. Then it sent. This is what "signal-based" looks like in practice, a specific acknowledgement, a value drop, a clean next step.',
    },
  ],
  closingHTML:
    'Most outreach centers the sender. This <strong>centered the buyer</strong>. It worked because it was <strong>earned, not generic</strong>.',
  highlights: [
    { stat: '9 mo', label: 'Silent before reactivation' },
    { stat: '7 min', label: 'Buyer reply after send' },
    { stat: '2026', label: 'Agency of record awarded' },
  ],
  quote: 'Lead nurturing agent created a customized note that reactivated a $400,000 opportunity for us.',
  attribution: 'Stephen Cuccio · Head of New Client Strategy',
  href: 'https://mabbly.ai/case-study/madcraft',
};

const SUPPORTING: CardSpec[] = [
  {
    slug: 'calliope',
    clientName: 'Calliope Communications',
    sector: 'Healthcare B2B Content',
    metric: { kind: 'ratio', target: 2, denom: 2 },
    labelHTML: 'dormant healthcare contacts replied',
    bodyHTML:
      'First 2 emails sent. Both replied. One positive engagement, one "stay in touch" reopened door. Founder voice preserved through human review.',
    quote: 'The AI has done a pretty good job connecting the dots.',
    attribution: 'Mary Tindall · Founder',
    href: 'https://mabbly.ai/case-study/calliope',
  },
  {
    slug: 'spr',
    clientName: 'SPR',
    sector: 'Chicago Technology Consulting',
    metric: { kind: 'count', target: 150 },
    labelHTML: 'dormant enterprise contacts identified, 43 emails sent, 3 conversations restarted',
    bodyHTML:
      '3-layer human review (enrichment, content, executive). 4 ICPs. Reply rate ~7%. Kyle Gams (Managing Director) was final approver.',
    quote: "Your guys' signal is the personalization piece.",
    attribution: 'Kristin Rosa · Creative & Content Manager',
    href: 'https://mabbly.ai/case-study/spr',
  },
];

const CARDS: CardSpec[] = [FEATURED, ...SUPPORTING];

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
      else if (spec.kind === 'percent')
        el.innerHTML = `${spec.target}<span class="pct">%</span>`;
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
      else if (spec.kind === 'percent')
        el.innerHTML = `${Math.round(v)}<span class="pct">%</span>`;
      else el.textContent = Math.round(v).toLocaleString();
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [trigger, reduced, delayMs, spec]);

  if (spec.kind === 'ratio') {
    return (
      <span ref={ref} className="metric-num">
        0<span className="slash">/</span><span className="denom">{spec.denom}</span>
      </span>
    );
  }
  if (spec.kind === 'percent') {
    return (
      <span ref={ref} className="metric-num">
        0<span className="pct">%</span>
      </span>
    );
  }
  return (
    <span ref={ref} className="metric-num">
      {spec.kind === 'dollars' ? '$0K' : '0'}
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

  // Section IO - triggers entrance animations
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

  // Per-card IO - triggers count-up on each card individually
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
      aria-label="Proof - three documented cases"
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
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 36px;
        }
        .proof-section .featured-wrap {
          margin-bottom: 14px;
        }

        /* Featured (Madcraft) card */
        .proof-section .featured-card {
          background: var(--cream-card);
          border: 1px solid rgba(15, 30, 29, 0.10);
          border-radius: 16px;
          padding: 0;
          position: relative;
          color: var(--depth);
          overflow: hidden;
          box-shadow:
            0 1px 0 rgba(0, 0, 0, 0.10),
            0 22px 50px -16px rgba(0, 0, 0, 0.55),
            0 40px 80px -30px rgba(0, 0, 0, 0.40);
          opacity: 0;
          transform: translateY(14px);
          transition:
            opacity 0.7s var(--ease) 0.55s,
            transform 0.7s var(--ease) 0.55s,
            border-color 0.3s var(--ease),
            box-shadow 0.3s var(--ease);
        }
        .proof-section.is-in .featured-card { opacity: 1; transform: translateY(0); }
        .proof-section .featured-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--care) 0%, var(--energy) 50%, var(--purpose) 100%);
        }
        .proof-section .featured-card:hover {
          border-color: rgba(191, 70, 26, 0.30);
          box-shadow:
            0 1px 0 rgba(0, 0, 0, 0.10),
            0 30px 60px -14px rgba(0, 0, 0, 0.60),
            0 0 0 1px rgba(191, 70, 26, 0.10);
        }

        .proof-section .featured-grid {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: 0;
        }
        @media (max-width: 920px) {
          .proof-section .featured-grid { grid-template-columns: 1fr; }
        }

        .proof-section .featured-left {
          padding: 30px 32px 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          border-right: 1px solid var(--cream-line);
        }
        @media (max-width: 920px) {
          .proof-section .featured-left { border-right: none; border-bottom: 1px solid var(--cream-line); }
        }

        .proof-section .featured-tagrow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .proof-section .featured-eyebrow {
          font-family: var(--pf-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          line-height: 1.4;
          margin: 0;
          color: var(--purpose);
          font-weight: 700;
        }
        .proof-section .featured-eyebrow .pip { color: var(--muted-soft); margin: 0 6px; }
        .proof-section .featured-eyebrow .sec { color: var(--depth); font-weight: 600; }
        .proof-section .featured-flag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--pf-mono);
          font-size: 9.5px;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--care);
          padding: 5px 10px;
          background: rgba(191, 70, 26, 0.08);
          border: 1px solid rgba(191, 70, 26, 0.25);
          border-radius: 999px;
        }
        .proof-section .featured-flag::before {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--care);
          box-shadow: 0 0 8px rgba(191, 70, 26, 0.6);
        }

        .proof-section .featured-headline-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .proof-section .featured-headline {
          font-family: var(--pf-display);
          font-weight: 900;
          font-size: clamp(34px, 4.2vw, 54px);
          line-height: 1.02;
          letter-spacing: -0.03em;
          color: var(--depth);
          margin: 0;
        }
        .proof-section .featured-headline em {
          font-style: italic;
          color: var(--care);
          font-weight: 800;
        }
        .proof-section .featured-deck {
          font-family: var(--pf-serif);
          font-style: italic;
          font-size: 19px;
          line-height: 1.4;
          color: var(--depth-soft);
          margin: 0;
          max-width: 46ch;
        }

        .proof-section .featured-sections {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .proof-section .featured-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .proof-section .featured-section-eyebrow {
          font-family: var(--pf-mono);
          font-size: 9.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--purpose);
          font-weight: 700;
          margin: 0;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .proof-section .featured-section-eyebrow::before {
          content: '';
          width: 14px;
          height: 1px;
          background: var(--care);
        }
        .proof-section .featured-section-body {
          font-family: var(--pf-body);
          font-size: 14px;
          line-height: 1.6;
          color: var(--depth-soft);
          margin: 0;
        }
        .proof-section .featured-section-body strong { color: var(--depth); font-weight: 700; }
        .proof-section .featured-section-body em { font-style: italic; color: var(--care); font-weight: 600; }

        .proof-section .featured-closing {
          font-family: var(--pf-serif);
          font-style: italic;
          font-size: 16px;
          line-height: 1.5;
          color: var(--depth);
          margin: 4px 0 0;
          padding: 14px 0 0;
          border-top: 1px solid var(--cream-line);
        }
        .proof-section .featured-closing strong {
          font-style: normal;
          color: var(--depth);
          font-weight: 700;
        }

        .proof-section .featured-quote-block {
          margin-top: 4px;
          padding-top: 18px;
          border-top: 1px dashed rgba(15, 30, 29, 0.18);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .proof-section .featured-quote {
          font-family: var(--pf-serif);
          font-style: italic;
          font-size: 17px;
          line-height: 1.4;
          color: var(--depth);
          border-left: 3px solid var(--care);
          padding: 4px 0 4px 16px;
          margin: 0;
        }
        .proof-section .featured-quote::before { content: "\\201C"; }
        .proof-section .featured-quote::after { content: "\\201D"; }
        .proof-section .featured-attribution {
          font-family: var(--pf-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          line-height: 1.5;
          text-transform: uppercase;
          color: var(--muted);
          font-weight: 600;
          margin: 0;
          padding-left: 19px;
        }

        .proof-section .featured-foot {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid var(--cream-line);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .proof-section .featured-foot-meta {
          font-family: var(--pf-mono);
          font-size: 9px;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: var(--muted-soft);
          font-weight: 600;
        }
        .proof-section .featured-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--pf-mono);
          font-size: 10px;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          font-weight: 700;
          color: #fff;
          background: var(--care);
          padding: 9px 14px;
          border-radius: 2px;
          text-decoration: none;
          transition: background 0.3s var(--ease), transform 0.3s var(--ease);
        }
        .proof-section .featured-link svg { transition: transform 0.3s var(--ease); }
        .proof-section .featured-link:hover {
          background: var(--care-bright);
          transform: translateY(-1px);
        }
        .proof-section .featured-link:hover svg { transform: translateX(4px); }

        .proof-section .featured-right {
          padding: 30px 32px 28px;
          background:
            radial-gradient(ellipse 320px 200px at 80% 10%, rgba(255, 186, 26, 0.12), transparent 70%),
            linear-gradient(180deg, #FCFAF4 0%, #F5EFDD 100%);
          display: flex;
          flex-direction: column;
          gap: 22px;
          position: relative;
        }
        .proof-section .featured-metric-block {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .proof-section .featured-metric-eyebrow {
          font-family: var(--pf-mono);
          font-size: 9.5px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--care);
          font-weight: 700;
          margin: 0;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .proof-section .featured-metric-eyebrow::before {
          content: '';
          width: 18px;
          height: 1px;
          background: var(--care);
        }
        .proof-section .featured-metric-block .metric-num {
          font-family: var(--pf-display);
          font-size: clamp(72px, 9vw, 128px);
          font-weight: 900;
          letter-spacing: -0.045em;
          line-height: 0.85;
          background: linear-gradient(135deg, #A79014 0%, #BF461A 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: inline-block;
          font-variant-numeric: tabular-nums;
        }
        .proof-section .featured-metric-block .metric-num .slash,
        .proof-section .featured-metric-block .metric-num .denom,
        .proof-section .featured-metric-block .metric-num .pct {
          background: linear-gradient(135deg, #A79014 0%, #BF461A 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .proof-section .featured-metric-label {
          font-family: var(--pf-body);
          font-size: 13px;
          line-height: 1.5;
          color: var(--depth);
          margin: 0;
          font-weight: 500;
        }
        .proof-section .featured-metric-label strong { font-weight: 700; }

        .proof-section .featured-highlights {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border-top: 1px dashed rgba(15, 30, 29, 0.18);
          border-bottom: 1px dashed rgba(15, 30, 29, 0.18);
          padding: 14px 0;
        }
        .proof-section .featured-highlight {
          padding: 0 12px;
          border-right: 1px solid rgba(15, 30, 29, 0.10);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .proof-section .featured-highlight:first-child { padding-left: 0; }
        .proof-section .featured-highlight:last-child { border-right: none; padding-right: 0; }
        .proof-section .featured-highlight-stat {
          font-family: var(--pf-display);
          font-weight: 800;
          font-size: 22px;
          letter-spacing: -0.02em;
          color: var(--depth);
          line-height: 1;
        }
        .proof-section .featured-highlight-label {
          font-family: var(--pf-mono);
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
          font-weight: 600;
          line-height: 1.35;
        }

        .proof-section .featured-timeline {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .proof-section .featured-timeline-title {
          font-family: var(--pf-mono);
          font-size: 9.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--purpose);
          font-weight: 700;
          margin: 0 0 4px;
        }
        .proof-section .featured-timeline-row {
          display: grid;
          grid-template-columns: 70px 1fr;
          gap: 12px;
          align-items: baseline;
          padding: 6px 0;
          border-bottom: 1px solid rgba(15, 30, 29, 0.06);
        }
        .proof-section .featured-timeline-row:last-child { border-bottom: none; }
        .proof-section .tl-time {
          font-family: var(--pf-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
          font-weight: 700;
        }
        .proof-section .featured-timeline-row.is-end .tl-time { color: var(--care); }
        .proof-section .tl-text {
          font-family: var(--pf-body);
          font-size: 13px;
          line-height: 1.45;
          color: var(--depth);
          margin: 0;
        }
        .proof-section .featured-timeline-row.is-end .tl-text { font-weight: 700; }
        @media (max-width: 920px) {
          .proof-section .featured-left,
          .proof-section .featured-right { padding: 24px 22px; }
          .proof-section .featured-metric-block .metric-num { font-size: 64px; }
          .proof-section .featured-highlights { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 480px) {
          .proof-section .featured-highlights { grid-template-columns: 1fr; gap: 12px; padding: 14px 0; }
          .proof-section .featured-highlight {
            border-right: none;
            border-bottom: 1px solid rgba(15, 30, 29, 0.10);
            padding: 0 0 10px;
          }
          .proof-section .featured-highlight:last-child { border-bottom: none; padding-bottom: 0; }
        }

        .proof-section .case-card {
          background: var(--cream-card);
          border: 1px solid rgba(15, 30, 29, 0.10);
          border-radius: 16px;
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
          font-size: clamp(56px, 5.4vw, 76px);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 0.9;
          color: #A79014;
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
        .proof-section .metric-num .pct {
          font-size: 0.62em;
          letter-spacing: -0.02em;
          margin-left: 0.02em;
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
          .proof-section .metric-num { font-size: 56px; }
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

      <div className="section">
        <header className="section-head">
          <h2 className="headline">
            {HEADLINE_WORDS.map((word, i) => {
              const isLast = i === HEADLINE_WORDS.length - 1;
              if (isLast) {
                // "field." - split off the period so we can color it
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

        <div className="featured-wrap">
          <article
            ref={(el) => { cardRefs.current[0] = el; }}
            className="featured-card"
            aria-label="Featured case: Madcraft"
          >
            <div className="featured-grid">
              <div className="featured-left">
                <div className="featured-tagrow">
                  <p className="featured-eyebrow">
                    {FEATURED.clientName}
                    <span className="pip">·</span>
                    <span className="sec">{FEATURED.sector}</span>
                  </p>
                  <span className="featured-flag">Featured Case</span>
                </div>

                <div className="featured-headline-block">
                  <h3 className="featured-headline">
                    $400K in <em>7 minutes.</em>
                  </h3>
                  <p className="featured-deck">{FEATURED.deck}</p>
                </div>

                <div className="featured-sections">
                  {FEATURED.sections.map((s) => (
                    <section className="featured-section" key={s.eyebrow}>
                      <p className="featured-section-eyebrow">{s.eyebrow}</p>
                      <p
                        className="featured-section-body"
                        dangerouslySetInnerHTML={{ __html: s.bodyHTML }}
                      />
                    </section>
                  ))}
                </div>

                <p
                  className="featured-closing"
                  dangerouslySetInnerHTML={{ __html: FEATURED.closingHTML }}
                />

                <div className="featured-foot">
                  <span className="featured-foot-meta">Verified · 2025 · Chicago</span>
                  <a
                    className="featured-link"
                    href={FEATURED.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read the full case study
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path
                        d="M2 7h10m0 0L8 3m4 4l-4 4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="featured-right">
                <div className="featured-metric-block">
                  <p className="featured-metric-eyebrow">Opportunity reactivated</p>
                  <MetricNum
                    spec={FEATURED.metric}
                    trigger={cardIn[0]}
                    reduced={reduced}
                    delayMs={500}
                  />
                  <p
                    className="featured-metric-label"
                    dangerouslySetInnerHTML={{ __html: FEATURED.labelHTML }}
                  />
                </div>

                <div className="featured-highlights" aria-label="Key highlights">
                  {FEATURED.highlights.map((h) => (
                    <div className="featured-highlight" key={h.label}>
                      <span className="featured-highlight-stat">{h.stat}</span>
                      <span className="featured-highlight-label">{h.label}</span>
                    </div>
                  ))}
                </div>

                <div className="featured-timeline">
                  <p className="featured-timeline-title">Reactivation Timeline</p>
                  <div className="featured-timeline-row">
                    <span className="tl-time">Day 0</span>
                    <p className="tl-text">Proposal sent. Initial buyer interest.</p>
                  </div>
                  <div className="featured-timeline-row">
                    <span className="tl-time">Day 270</span>
                    <p className="tl-text">9 months silent. Dead Zone.</p>
                  </div>
                  <div className="featured-timeline-row">
                    <span className="tl-time">Pre-send</span>
                    <p className="tl-text">Lead Nurturing Agent surfaced signal · drafted in voice · human approved.</p>
                  </div>
                  <div className="featured-timeline-row is-end">
                    <span className="tl-time">+ 7 min</span>
                    <p className="tl-text">Buyer replied · $400K reactivated · Agency of record 2026.</p>
                  </div>
                </div>

                <div className="featured-quote-block">
                  <blockquote className="featured-quote">{FEATURED.quote}</blockquote>
                  <p className="featured-attribution">{FEATURED.attribution}</p>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="card-grid">
          {SUPPORTING.map((card, sIdx) => {
            const idx = sIdx + 1;
            return (
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
                  delayMs={700 + sIdx * 120}
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
            );
          })}
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
