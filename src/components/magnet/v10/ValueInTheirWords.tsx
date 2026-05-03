// SECTION 07 - The Value (in their words)
// 3-card testimonial layout: stat as visual hero, verbatim quote below.
// Stats: $400K Madcraft / 2 of 2 Calliope / 150 SPR - counted up on viewport entry.

import { useEffect, useRef } from "react";

interface Props {
  primary: string;
}

interface CaseCard {
  client: string;
  statTarget: number;
  statPrefix: string;
  statSuffix: string;
  statRender: (n: number) => string;
  caption: string;
  quote: string;
  name: string;
  role: string;
  squigglePath: string;
  avatar: JSX.Element;
}

const CASES: CaseCard[] = [
  {
    client: "Madcraft",
    statTarget: 400,
    statPrefix: "$",
    statSuffix: "K",
    statRender: (n) => `$${n}K`,
    caption: "Reactivated in 7 minutes",
    quote:
      "The proposal had been silent nine months. We sent one note built from Mabbly's framework. The reply came back in seven minutes - and the deal closed.",
    name: "Stephen Cuccio",
    role: "Head of New Client Strategy",
    squigglePath: "M 2 4 Q 25 1, 50 4 T 98 4",
    avatar: (
      <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="40" height="40" fill="#3d2f24" />
        <circle cx="20" cy="15" r="7" fill="#c4946e" />
        <path d="M5 40 C 5 30, 12 24, 20 24 C 28 24, 35 30, 35 40 Z" fill="#5a4226" />
        <path d="M14 12 Q 20 10, 26 12 L 26 14 L 14 14 Z" fill="#2a1d0f" />
      </svg>
    ),
  },
  {
    client: "Calliope",
    statTarget: 2,
    statPrefix: "",
    statSuffix: "/2",
    statRender: (n) => `${n}/2`,
    caption: "Replied · 100% response rate",
    quote:
      "We picked two dormant healthcare contacts we hadn't spoken to in over a year. Both replied within the same day. Two for two.",
    name: "Mary Tindall",
    role: "Founder · Calliope",
    squigglePath: "M 2 4 Q 25 7, 50 4 T 98 4",
    avatar: (
      <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="40" height="40" fill="#3d2840" />
        <circle cx="20" cy="15" r="7" fill="#d4a888" />
        <path d="M5 40 C 5 30, 12 24, 20 24 C 28 24, 35 30, 35 40 Z" fill="#6d3a52" />
        <path d="M12 14 Q 20 8, 28 14 L 28 18 Q 20 14, 12 18 Z" fill="#2a1820" />
      </svg>
    ),
  },
  {
    client: "SPR",
    statTarget: 150,
    statPrefix: "",
    statSuffix: "",
    statRender: (n) => `${n}`,
    caption: "Dormant enterprise contacts identified",
    quote:
      "We found 150 dormant enterprise contacts in the CRM. After Mabbly's three-layer review, 43 emails went out. Three conversations restarted - two are now active deals.",
    name: "Kyle Gams",
    role: "Managing Director · SPR",
    squigglePath: "M 2 5 Q 25 2, 50 5 T 98 3",
    avatar: (
      <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="40" height="40" fill="#2c3a3a" />
        <circle cx="20" cy="15" r="7" fill="#b8896a" />
        <path d="M5 40 C 5 30, 12 24, 20 24 C 28 24, 35 30, 35 40 Z" fill="#3d4f4d" />
        <path d="M14 13 Q 20 11, 26 13 L 26 15 L 14 15 Z" fill="#1a2424" />
      </svg>
    ),
  },
];

export default function ValueInTheirWords({ primary }: Props) {
  void primary;

  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const statRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    const stats = statRefs.current.filter(Boolean) as HTMLSpanElement[];

    if (reduced) {
      sectionRef.current?.classList.add("is-in");
      cards.forEach((el) => el.classList.add("is-in"));
      stats.forEach((el) => {
        const target = Number(el.dataset.target);
        const idx = Number(el.dataset.index);
        el.textContent = CASES[idx].statRender(target);
      });
      return;
    }

    const targets: Element[] = [];
    if (sectionRef.current) targets.push(sectionRef.current);
    cards.forEach((el) => targets.push(el));

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
    targets.forEach((el) => io.observe(el));

    function countUp(el: HTMLSpanElement) {
      if (el.dataset.counted) return;
      el.dataset.counted = "1";
      const target = Number(el.dataset.target);
      const idx = Number(el.dataset.index);
      const render = CASES[idx].statRender;
      const duration = 1400;
      const start = performance.now();
      function step(now: number) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = render(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const numIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLSpanElement;
            window.setTimeout(() => countUp(el), 200);
            numIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    stats.forEach((el) => numIO.observe(el));

    return () => {
      io.disconnect();
      numIO.disconnect();
    };
  }, []);

  return (
    <section
      id="v10-section-7"
      data-v10-section="7"
      ref={sectionRef}
      className="vitw-section"
    >
      <style>{vitwStyles}</style>

      <svg
        className="vitw-scribble-bg"
        viewBox="0 0 576 610"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M537.319 540.412L227.81 609.6L34.3851 540.412L0 302.629L34.3851 34.5832L270.807 0L537.319 34.5832L576 259.406L537.319 540.412Z"
          fill="#CBD3CA"
        />
      </svg>

      <div className="vitw-container">
        <header className="vitw-head">
          <div className="vitw-meta-row">
            <span className="vitw-rule" />
            <p className="vitw-eyebrow">07 · The Value (In Their Words)</p>
            <span className="vitw-rule" />
          </div>
          <h2 className="vitw-headline">
            <span className="vitw-word-mask">
              <span className="vitw-word-inner">What&nbsp;</span>
            </span>
            <span className="vitw-word-mask">
              <span className="vitw-word-inner">firms&nbsp;</span>
            </span>
            <span className="vitw-word-mask">
              <span className="vitw-word-inner">in&nbsp;</span>
            </span>
            <span className="vitw-word-mask">
              <span className="vitw-word-inner">the&nbsp;</span>
            </span>
            <span className="vitw-word-mask">
              <span className="vitw-word-inner">research&nbsp;</span>
            </span>
            <span className="vitw-word-mask">
              <span className="vitw-word-inner">
                found<span className="vitw-period">.</span>
              </span>
            </span>
          </h2>
          <p className="vitw-sub">Three named firms. Hard outcomes. Verified, on the record.</p>
        </header>

        <div className="vitw-grid">
          {CASES.map((c, i) => (
            <article
              key={c.client}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`vitw-card vitw-card--d${i + 1}`}
            >
              <span className="vitw-card-quote-mark" aria-hidden="true">&ldquo;</span>

              <p className="vitw-firm-tag">
                {c.client}
                <svg viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
                  <path d={c.squigglePath} />
                </svg>
              </p>

              <p className="vitw-stat">
                <span
                  ref={(el) => {
                    statRefs.current[i] = el;
                  }}
                  className="vitw-stat-num"
                  data-target={c.statTarget}
                  data-index={i}
                >
                  {c.statRender(0)}
                </span>
              </p>
              <p className="vitw-stat-caption">{c.caption}</p>

              <p className="vitw-quote-text">
                <span className="vitw-open-mark">&ldquo;</span>
                {c.quote}
                <span aria-hidden="true">&rdquo;</span>
              </p>

              <div className="vitw-attr">
                <div className="vitw-avatar">{c.avatar}</div>
                <div className="vitw-attr-text">
                  <span className="vitw-attr-name">{c.name}</span>
                  <span className="vitw-attr-role">{c.role}</span>
                </div>
              </div>

              <a href="#" className="vitw-read-link">
                Read full case
                <span className="vitw-arrow" aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>

        <p className="vitw-footer-line">
          From the verified case library
          <span className="vitw-sep" aria-hidden="true"> · </span>
          30-firm research cohort
          <span className="vitw-sep" aria-hidden="true"> · </span>
          <a href="#" className="vitw-footer-link">
            See all cases <span aria-hidden="true">→</span>
          </a>
        </p>
      </div>
    </section>
  );
}

const vitwStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,500;1,700&display=swap');

.vitw-section {
  --color-cream:   #F5F1E8;
  --color-card:    #fdfbf6;
  --color-depth:   #0F1E1D;
  --color-care:    #BF461A;
  --color-purpose: #A79014;
  --color-olive:   #CBD3CA;
  --vitw-display: 'Mabbly Repro', 'Arial Black', 'Helvetica Neue', Impact, system-ui, sans-serif;
  --vitw-mono:    'Mabbly Repro Mono', 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
  --vitw-body:    'Inter', 'Mabbly Repro', system-ui, -apple-system, 'Helvetica Neue', sans-serif;
  --vitw-quote:   'Playfair Display', 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --vitw-ease:    cubic-bezier(0.13, 0.28, 0.3, 1);

  position: relative;
  background: var(--color-cream);
  color: var(--color-depth);
  padding: 96px 0 100px;
  overflow: hidden;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  width: 100vw;
}
@media (max-width: 720px) { .vitw-section { padding: 64px 0 72px; } }

.vitw-scribble-bg {
  position: absolute;
  bottom: -200px; right: -200px;
  width: 720px; opacity: 0.32;
  z-index: 0;
  pointer-events: none;
  animation: vitwBlobSpin 100s linear infinite;
}
@keyframes vitwBlobSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.vitw-container {
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 56px;
}
@media (max-width: 720px) { .vitw-container { padding: 0 24px; } }

.vitw-head {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 56px;
}

.vitw-meta-row {
  display: inline-flex; align-items: center; gap: 14px;
  margin-bottom: 18px;
  opacity: 0; transform: translateY(8px);
  transition: opacity 0.7s var(--vitw-ease), transform 0.7s var(--vitw-ease);
}
.vitw-section.is-in .vitw-meta-row { opacity: 1; transform: translateY(0); }
.vitw-rule { width: 28px; height: 1.5px; background: var(--color-purpose); opacity: 0.6; }
.vitw-eyebrow {
  font-family: var(--vitw-mono);
  font-size: 12px; letter-spacing: 0.32em;
  text-transform: uppercase; font-weight: 700;
  color: var(--color-purpose);
  margin: 0;
}

.vitw-headline {
  font-family: var(--vitw-display);
  font-weight: 900;
  font-size: clamp(40px, 5.4vw, 76px);
  line-height: 1.0;
  letter-spacing: -0.025em;
  color: var(--color-depth);
  margin: 0 0 16px;
}
.vitw-period { color: var(--color-care); }
.vitw-word-mask { display: inline-block; overflow: hidden; vertical-align: bottom; }
.vitw-word-inner {
  display: inline-block;
  transform: translateY(110%);
  transition: transform 0.8s var(--vitw-ease);
}
.vitw-section.is-in .vitw-word-inner { transform: translateY(0); }
.vitw-section.is-in .vitw-word-mask:nth-child(1) .vitw-word-inner { transition-delay: 0.40s; }
.vitw-section.is-in .vitw-word-mask:nth-child(2) .vitw-word-inner { transition-delay: 0.50s; }
.vitw-section.is-in .vitw-word-mask:nth-child(3) .vitw-word-inner { transition-delay: 0.60s; }
.vitw-section.is-in .vitw-word-mask:nth-child(4) .vitw-word-inner { transition-delay: 0.70s; }
.vitw-section.is-in .vitw-word-mask:nth-child(5) .vitw-word-inner { transition-delay: 0.80s; }
.vitw-section.is-in .vitw-word-mask:nth-child(6) .vitw-word-inner { transition-delay: 0.90s; }

.vitw-sub {
  font-family: var(--vitw-body);
  font-size: 17px; line-height: 1.5;
  color: var(--color-depth);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.7s var(--vitw-ease), transform 0.7s var(--vitw-ease);
  transition-delay: 1.10s;
  margin: 0;
}
.vitw-section.is-in .vitw-sub { opacity: 0.7; transform: translateY(0); }

.vitw-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 1000px) {
  .vitw-grid { grid-template-columns: 1fr; gap: 16px; }
}

.vitw-card {
  background: var(--color-card);
  border: 1px solid rgba(15, 30, 29, 0.08);
  border-left: 3px solid var(--color-purpose);
  border-radius: 4px 14px 14px 4px;
  padding: 32px 30px 28px 30px;
  position: relative;
  overflow: hidden;
  display: flex; flex-direction: column;
  min-height: 520px;
  opacity: 0; transform: translateY(24px);
  transition:
    opacity 0.7s var(--vitw-ease),
    transform 280ms var(--vitw-ease),
    box-shadow 280ms var(--vitw-ease);
}
.vitw-card.is-in { opacity: 1; transform: translateY(0); }
.vitw-card--d1.is-in { transition-delay: 1.30s, 0s, 0s; }
.vitw-card--d2.is-in { transition-delay: 1.45s, 0s, 0s; }
.vitw-card--d3.is-in { transition-delay: 1.60s, 0s, 0s; }
.vitw-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 24px 48px -16px rgba(15, 30, 29, 0.18),
    0 8px 16px -8px rgba(15, 30, 29, 0.08);
}
@media (max-width: 1000px) {
  .vitw-card { min-height: auto; }
}

.vitw-card-quote-mark {
  position: absolute;
  top: 20px; right: 26px;
  font-family: var(--vitw-quote);
  font-style: italic; font-weight: 700;
  font-size: 96px; line-height: 1;
  color: var(--color-purpose);
  opacity: 0.18;
  pointer-events: none;
}

.vitw-firm-tag {
  display: inline-block; position: relative;
  padding-bottom: 10px;
  margin: 0 0 28px;
  font-family: var(--vitw-mono);
  font-size: 11px; letter-spacing: 0.24em;
  text-transform: uppercase; font-weight: 700;
  color: var(--color-purpose);
  align-self: flex-start;
}
.vitw-firm-tag::after {
  content: ""; position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 2px;
  background: var(--color-purpose); opacity: 0.5;
  transform-origin: left;
  transform: scaleX(0.6);
  transition: transform 350ms var(--vitw-ease);
}
.vitw-card:hover .vitw-firm-tag::after { transform: scaleX(1); }
.vitw-firm-tag svg {
  position: absolute; left: 0; right: 0; bottom: -3px;
  width: 100%; height: 8px;
  overflow: visible;
  opacity: 0;
  transition: opacity 350ms var(--vitw-ease);
}
.vitw-card:hover .vitw-firm-tag svg { opacity: 0.9; }
.vitw-firm-tag svg path {
  fill: none; stroke: var(--color-care);
  stroke-width: 2; stroke-linecap: round;
}

.vitw-stat {
  font-family: var(--vitw-display);
  font-weight: 900;
  font-size: clamp(56px, 5.4vw, 76px);
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: var(--color-purpose);
  margin: 0 0 12px;
}
.vitw-stat-num { display: inline-block; }

.vitw-stat-caption {
  font-family: var(--vitw-mono);
  font-size: 11px; letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-depth); opacity: 0.75;
  margin: 0 0 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(15, 30, 29, 0.08);
}

.vitw-quote-text {
  flex: 1;
  margin: 0 0 28px;
  font-family: var(--vitw-quote);
  font-style: italic;
  font-weight: 500;
  font-size: 17px;
  line-height: 1.5;
  color: var(--color-depth);
}
.vitw-open-mark { color: var(--color-care); margin-right: 1px; }

.vitw-attr {
  display: flex; align-items: center; gap: 12px;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(15, 30, 29, 0.08);
}
.vitw-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 1.5px solid var(--color-purpose);
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}
.vitw-avatar svg { display: block; width: 100%; height: 100%; }
.vitw-attr-text { display: flex; flex-direction: column; gap: 2px; }
.vitw-attr-name {
  font-family: var(--vitw-body);
  font-weight: 600;
  font-size: 14px;
  color: var(--color-depth);
}
.vitw-attr-role {
  font-family: var(--vitw-mono);
  font-size: 10px; letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-purpose);
}

.vitw-read-link {
  margin-top: 14px;
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--vitw-mono);
  font-size: 10px; letter-spacing: 0.14em;
  text-transform: uppercase; font-weight: 700;
  color: var(--color-care); text-decoration: none;
  opacity: 0; transform: translateY(4px);
  transition: opacity 300ms var(--vitw-ease), transform 300ms var(--vitw-ease);
}
.vitw-card:hover .vitw-read-link { opacity: 1; transform: translateY(0); }
.vitw-read-link .vitw-arrow {
  transition: transform 300ms cubic-bezier(0.85, 0, 0.15, 1);
}
.vitw-read-link:hover .vitw-arrow { transform: translateX(4px); }

.vitw-footer-line {
  margin: 56px 0 0;
  text-align: center;
  font-family: var(--vitw-mono);
  font-size: 11px; letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-depth); opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.7s var(--vitw-ease), transform 0.7s var(--vitw-ease);
  transition-delay: 2.00s;
}
.vitw-section.is-in .vitw-footer-line { opacity: 0.7; transform: translateY(0); }
.vitw-sep { color: var(--color-care); }
.vitw-footer-link {
  color: var(--color-care);
  text-decoration: none;
  border-bottom: 1px solid currentColor;
  padding-bottom: 1px;
  transition: opacity 0.2s var(--vitw-ease);
}
.vitw-footer-link:hover { opacity: 0.75; }

@media (prefers-reduced-motion: reduce) {
  .vitw-section *, .vitw-section *::before, .vitw-section *::after {
    transition-duration: 0.01ms !important;
    transition-delay: 0ms !important;
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
  }
  .vitw-section .vitw-meta-row,
  .vitw-section .vitw-word-inner,
  .vitw-section .vitw-sub,
  .vitw-section .vitw-card,
  .vitw-section .vitw-footer-line {
    opacity: 1 !important;
    transform: none !important;
  }
  .vitw-section .vitw-sub,
  .vitw-section .vitw-footer-line { opacity: 0.7 !important; }
}
`;
