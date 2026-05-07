// SECTION 06 - Why This Research Matters (Dark)
// Dark inversion: research-dashboard-at-night. Stats with corner-tick brackets
// drawing in via stroke-dashoffset, oscillating care-orange glow halos, and
// three numbered editorial chapter blocks. No "Verified Cohort Firms" banner.

import { useEffect, useRef } from "react";

interface Props {
  primary: string;
}

export default function WhyResearchMatters({ primary }: Props) {
  void primary;

  const sectionRef = useRef<HTMLElement>(null);
  const bodyWrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const numRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const nums = numRefs.current.filter(Boolean) as HTMLDivElement[];

    if (reduced) {
      sectionRef.current?.classList.add("is-in");
      bodyWrapRef.current?.classList.add("is-in");
      cards.forEach((el) => el.classList.add("is-in"));
      nums.forEach((el) => {
        const t = Number(el.dataset.target);
        const fmt = el.dataset.format;
        el.textContent = fmt === "plus" ? `${t}+` : t.toString();
      });
      return;
    }

    const targets: Element[] = [];
    if (sectionRef.current) targets.push(sectionRef.current);
    if (bodyWrapRef.current) targets.push(bodyWrapRef.current);
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

    function countUp(el: HTMLDivElement) {
      if (el.dataset.counted) return;
      el.dataset.counted = "1";
      const target = Number(el.dataset.target);
      const fmt = el.dataset.format;
      const duration = 1600;
      const start = performance.now();
      function step(now: number) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = target * eased;
        el.textContent = fmt === "plus" ? `${Math.round(v)}+` : Math.round(v).toString();
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const numIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLDivElement;
            const card = el.closest(".stat-card-wrap");
            const idx =
              card && card.parentNode
                ? Array.from(card.parentNode.children).indexOf(card)
                : 0;
            window.setTimeout(() => countUp(el), 400 + idx * 160);
            numIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    nums.forEach((el) => numIO.observe(el));

    return () => {
      io.disconnect();
      numIO.disconnect();
    };
  }, []);

  const Tick = () => (
    <svg viewBox="0 0 14 14">
      <path d="M 0 14 L 0 0 L 14 0" />
    </svg>
  );

  return (
    <section
      id="s06"
      data-v10-section="6"
      ref={sectionRef}
      className="wrm-section"
    >
      <style>{wrmStyles}</style>
      <div className="grid-bg" />
      <div className="container">
        <header className="section-head">
          <div className="meta-row">
            <span className="rule" />
            <span className="meta-tag">
              <span className="num">06</span>
              <span className="pip">·</span>
              <span>Why This Research Matters</span>
              <span className="live-research-dot" aria-hidden="true" />
            </span>
            <span className="rule" />
          </div>
          <h2 className="section-headline reveal d1">
            <span className="word-mask">
              <span className="word-inner">30&nbsp;</span>
            </span>
            <span className="word-mask">
              <span className="word-inner">firms.&nbsp;</span>
            </span>
            <span className="word-mask">
              <span className="word-inner">500&nbsp;</span>
            </span>
            <span className="word-mask">
              <span className="word-inner">practitioner&nbsp;</span>
            </span>
            <span className="word-mask">
              <span className="word-inner">
                interviews<span className="period">.</span>
              </span>
            </span>
          </h2>
          <p className="section-sub reveal d2">
            The methodology is <strong>real</strong>. Validated. Documented. Your firm sharpens it.
          </p>
        </header>

        <div className="stats-grid">
          {[
            {
              cls: "d3",
              index: "Stat 01",
              target: 30,
              format: "plain" as const,
              label: "PS Firms",
              context: "In the inaugural cohort. Mid-market, partner-led.",
            },
            {
              cls: "d4",
              index: "Stat 02",
              target: 500,
              format: "plus" as const,
              label: "Practitioner Interviews",
              context: "Recorded, transcribed, coded. Across all eight verticals.",
            },
            {
              cls: "d5",
              index: "Stat 03",
              target: 26,
              format: "plain" as const,
              label: "Years of PS Leadership",
              context: "Operator experience behind the framework. Forged in the books.",
            },
          ].map((stat, i) => (
            <div
              key={stat.index}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`stat-card-wrap reveal ${stat.cls}`}
            >
              <span className="tick tl"><Tick /></span>
              <span className="tick tr"><Tick /></span>
              <span className="tick bl"><Tick /></span>
              <span className="tick br"><Tick /></span>
              <div className="stat-card">
                <div className="stat-index"><span>{stat.index}</span></div>
                <div
                  ref={(el) => {
                    numRefs.current[i] = el;
                  }}
                  className="stat-num"
                  data-target={stat.target}
                  data-format={stat.format}
                >
                  0
                </div>
                <div className="stat-rule" />
                <div className="stat-label">{stat.label}</div>
                <p className="stat-context">{stat.context}</p>
              </div>
            </div>
          ))}
        </div>

        <div ref={bodyWrapRef} className="body-wrap reveal d6">
          <div className="body-block">
            <div className="body-eyebrow">
              <span className="body-eyebrow-num">01</span>
              <span className="pip">·</span>
              <span>The Cohort</span>
            </div>
            <p className="body-text">
              <strong>30 PS firms</strong> in the inaugural cohort - including{" "}
              <strong>AArete</strong> and <strong>SPR</strong>. Validated by{" "}
              <strong>Jonathan Copulsky</strong>, former CMO of Deloitte and senior lecturer at
              Northwestern Kellogg. He wrote the foreword.
            </p>
          </div>

          <div className="body-block">
            <div className="body-eyebrow">
              <span className="body-eyebrow-num">02</span>
              <span className="pip">·</span>
              <span>The Operator</span>
            </div>
            <p className="body-text">
              <strong>200 practitioner interviews.</strong> 26 years of PS firm leadership.{" "}
              <strong>Richard Ashbaugh</strong> scaled Kearney from $250M to $1.2B as CMO. The
              methodology is real. Validated. Documented.
            </p>
          </div>

          <div className="body-block">
            <div className="body-eyebrow">
              <span className="body-eyebrow-num">03</span>
              <span className="pip">·</span>
              <span>Your Firm</span>
            </div>
            <p className="body-text pull">
              Your firm contributing your data <strong>sharpens the framework.</strong> The book
              launches Q3 2026. You are part of how it gets there.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const wrmStyles = `
.wrm-section {
  --depth: #0F1E1D;
  --depth-soft: #1A2725;
  --depth-mid: #243431;
  --care: #BF461A;
  --care-bright: #E5582B;
  --energy: #FFBA1A;
  --purpose: #A79014;
  --purpose-soft: #C9AC2A;
  --cream: #F8F2E5;
  --muted: #6B7370;
  --muted-soft: #9AA09C;
  --ink-line: rgba(248, 242, 229, 0.10);
  --ink-line-strong: rgba(248, 242, 229, 0.18);
  --ink-soft: rgba(248, 242, 229, 0.55);
  --ink-medium: rgba(248, 242, 229, 0.72);
  --display: 'Mabbly Repro', 'Arial Black', 'Helvetica Neue', sans-serif;
  --mono: 'Mabbly Repro Mono', 'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace;
  --body: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --serif: 'Cormorant Garamond', 'Georgia', 'Times New Roman', serif;
  --ease: cubic-bezier(0.13, 0.28, 0.3, 1);

  padding: 96px 0 100px;
  position: relative;
  background:
    radial-gradient(ellipse 1100px 600px at 50% 0%, rgba(229, 88, 43, 0.05), transparent 60%),
    radial-gradient(ellipse 700px 500px at 80% 80%, rgba(167, 144, 20, 0.04), transparent 60%),
    var(--depth);
  color: var(--cream);
  overflow: hidden;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  width: 100vw;
}

.wrm-section::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 600px 400px at 50% 50%, rgba(229, 88, 43, 0.04), transparent 60%);
  pointer-events: none;
  animation: wrmAmbientShift 22s ease-in-out infinite alternate;
}
@keyframes wrmAmbientShift {
  0%   { transform: translate(-10%, -8%) scale(1); }
  100% { transform: translate(10%, 8%) scale(1.1); }
}

.wrm-section .grid-bg {
  position: absolute; inset: 0;
  pointer-events: none;
  background-image: radial-gradient(circle at 1px 1px, rgba(248, 242, 229, 0.06) 1px, transparent 1.5px);
  background-size: 32px 32px;
  opacity: 0.55;
}

.wrm-section .container { max-width: 1180px; margin: 0 auto; padding: 0 32px; position: relative; z-index: 1; }
@media (max-width: 720px) { .wrm-section { padding: 64px 0 72px; } }
@media (max-width: 600px) { .wrm-section .container { padding: 0 22px; } }

.wrm-section .section-head { text-align: center; margin-bottom: 56px; position: relative; z-index: 2; }
.wrm-section .section-head .meta-row { margin-bottom: 18px; }

.wrm-section .meta-row {
  display: inline-flex; align-items: center; gap: 10px;
  opacity: 0; transform: translateY(8px);
  transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
}
.wrm-section.is-in .meta-row { opacity: 1; transform: translateY(0); }
.wrm-section .meta-row .rule { width: 22px; height: 1px; background: var(--ink-line-strong); }

.wrm-section .meta-tag {
  font-family: var(--mono); font-size: 10px;
  letter-spacing: 0.24em; text-transform: uppercase;
  color: var(--purpose-soft); font-weight: 700;
  display: inline-flex; align-items: center; gap: 8px;
}
.wrm-section .meta-tag .num { color: var(--cream); }
.wrm-section .meta-tag .pip { color: var(--care-bright); margin: 0 4px; }

.wrm-section .live-research-dot {
  width: 5px; height: 5px;
  background: var(--care-bright);
  border-radius: 50%;
  position: relative;
  margin-left: 6px;
  flex-shrink: 0;
  display: inline-block;
}
.wrm-section .live-research-dot::after {
  content: ''; position: absolute; inset: 0;
  background: var(--care-bright);
  border-radius: 50%;
  animation: wrmLivePulse 2.4s ease-out infinite;
}
@keyframes wrmLivePulse {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2.6); opacity: 0; }
}

.wrm-section .section-headline {
  font-family: var(--display); font-weight: 900;
  font-size: clamp(34px, 4.4vw, 52px);
  letter-spacing: -0.03em; line-height: 1.0;
  color: var(--cream); margin-bottom: 14px;
}
.wrm-section .section-headline .period { color: var(--care-bright); }

.wrm-section .section-sub {
  font-family: var(--body); font-size: 14.5px; line-height: 1.55;
  max-width: 620px; margin: 0 auto;
  color: var(--ink-medium);
}
.wrm-section .section-sub strong { color: var(--cream); font-weight: 600; }

.wrm-section .word-mask { display: inline-block; overflow: hidden; vertical-align: bottom; }
.wrm-section .word-inner {
  display: inline-block;
  transform: translateY(105%);
  transition: transform 0.85s var(--ease);
}
.wrm-section.is-in .word-inner { transform: translateY(0); }
.wrm-section .word-mask:nth-child(1) .word-inner { transition-delay: 0.20s; }
.wrm-section .word-mask:nth-child(2) .word-inner { transition-delay: 0.27s; }
.wrm-section .word-mask:nth-child(3) .word-inner { transition-delay: 0.34s; }
.wrm-section .word-mask:nth-child(4) .word-inner { transition-delay: 0.41s; }
.wrm-section .word-mask:nth-child(5) .word-inner { transition-delay: 0.48s; }

.wrm-section .reveal { opacity: 0; transform: translateY(10px); transition: opacity 0.7s var(--ease), transform 0.7s var(--ease); }
.wrm-section.is-in .reveal,
.wrm-section .stat-card-wrap.is-in.reveal,
.wrm-section .body-wrap.is-in.reveal { opacity: 1; transform: translateY(0); }
.wrm-section.is-in .reveal.d1 { transition-delay: 0.08s; }
.wrm-section.is-in .reveal.d2 { transition-delay: 0.16s; }
.wrm-section .stat-card-wrap.is-in.reveal.d3 { transition-delay: 0.24s; }
.wrm-section .stat-card-wrap.is-in.reveal.d4 { transition-delay: 0.32s; }
.wrm-section .stat-card-wrap.is-in.reveal.d5 { transition-delay: 0.40s; }
.wrm-section .body-wrap.is-in.reveal.d6 { transition-delay: 0.48s; }

.wrm-section .stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 64px;
  position: relative;
  z-index: 2;
}

.wrm-section .stat-card-wrap {
  position: relative;
  padding: 18px 14px 4px;
}

.wrm-section .stat-card-wrap > .tick {
  position: absolute;
  width: 14px; height: 14px;
  pointer-events: none;
}
.wrm-section .stat-card-wrap > .tick svg {
  width: 100%; height: 100%;
  overflow: visible;
}
.wrm-section .stat-card-wrap > .tick path {
  fill: none;
  stroke: var(--ink-line-strong);
  stroke-width: 1.5;
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
  transition: stroke-dashoffset 0.7s var(--ease);
}
.wrm-section .stat-card-wrap.is-in > .tick path { stroke-dashoffset: 0; }

.wrm-section .stat-card-wrap.is-in.d3 .tick.tl path { transition-delay: 0.30s; }
.wrm-section .stat-card-wrap.is-in.d3 .tick.tr path { transition-delay: 0.36s; }
.wrm-section .stat-card-wrap.is-in.d3 .tick.bl path { transition-delay: 0.42s; }
.wrm-section .stat-card-wrap.is-in.d3 .tick.br path { transition-delay: 0.48s; }
.wrm-section .stat-card-wrap.is-in.d4 .tick.tl path { transition-delay: 0.42s; }
.wrm-section .stat-card-wrap.is-in.d4 .tick.tr path { transition-delay: 0.48s; }
.wrm-section .stat-card-wrap.is-in.d4 .tick.bl path { transition-delay: 0.54s; }
.wrm-section .stat-card-wrap.is-in.d4 .tick.br path { transition-delay: 0.60s; }
.wrm-section .stat-card-wrap.is-in.d5 .tick.tl path { transition-delay: 0.54s; }
.wrm-section .stat-card-wrap.is-in.d5 .tick.tr path { transition-delay: 0.60s; }
.wrm-section .stat-card-wrap.is-in.d5 .tick.bl path { transition-delay: 0.66s; }
.wrm-section .stat-card-wrap.is-in.d5 .tick.br path { transition-delay: 0.72s; }

.wrm-section .stat-card-wrap > .tick.tl { top: 0; left: 0; }
.wrm-section .stat-card-wrap > .tick.tr { top: 0; right: 0; transform: scaleX(-1); }
.wrm-section .stat-card-wrap > .tick.bl { bottom: 0; left: 0; transform: scaleY(-1); }
.wrm-section .stat-card-wrap > .tick.br { bottom: 0; right: 0; transform: scale(-1); }

.wrm-section .stat-card {
  background: linear-gradient(180deg, var(--depth-soft) 0%, var(--depth) 100%);
  border: 1px solid var(--ink-line-strong);
  border-radius: 2px;
  padding: 32px 28px 28px;
  position: relative;
  transition: border-color 0.4s var(--ease), transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
  text-align: center;
  overflow: hidden;
}

.wrm-section .stat-card::before {
  content: ''; position: absolute;
  top: 0; left: 0;
  width: 56px; height: 2px;
  background: var(--care-bright);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.5s var(--ease);
}
.wrm-section .stat-card-wrap.is-in .stat-card::before { transform: scaleX(1); transition-delay: 0.50s; }

.wrm-section .stat-card::after {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  width: 200px; height: 200px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(229, 88, 43, 0.10), transparent 60%);
  pointer-events: none;
  animation: wrmNumberGlow 4.6s ease-in-out infinite alternate;
  opacity: 0.6;
}
@keyframes wrmNumberGlow {
  0%   { opacity: 0.4; transform: translate(-50%, -50%) scale(0.92); }
  100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.08); }
}

.wrm-section .stat-card-wrap:hover .stat-card {
  border-color: rgba(229, 88, 43, 0.30);
  transform: translateY(-3px);
  box-shadow:
    0 24px 48px -24px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(229, 88, 43, 0.10);
}
.wrm-section .stat-card-wrap:hover .stat-card::after {
  opacity: 1;
  animation-duration: 2.4s;
}

.wrm-section .stat-index {
  font-family: var(--mono); font-size: 9px;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--purpose-soft); font-weight: 700;
  margin-bottom: 14px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  position: relative; z-index: 1;
}
.wrm-section .stat-index::before, .wrm-section .stat-index::after {
  content: ''; width: 18px; height: 1px;
  background: var(--purpose-soft); opacity: 0.5;
}

.wrm-section .stat-num {
  font-family: var(--display); font-weight: 900;
  font-size: clamp(60px, 7vw, 96px);
  letter-spacing: -0.05em; line-height: 0.88;
  color: var(--cream);
  margin-bottom: 14px;
  position: relative; z-index: 1;
  text-shadow: 0 0 32px rgba(229, 88, 43, 0.18);
}

.wrm-section .stat-rule {
  width: 36px; height: 1.5px;
  background: var(--care-bright);
  margin: 0 auto 14px;
  position: relative; z-index: 1;
  transform: scaleX(0);
  transition: transform 0.6s var(--ease);
}
.wrm-section .stat-card-wrap.is-in .stat-rule { transform: scaleX(1); transition-delay: 0.65s; }

.wrm-section .stat-label {
  font-family: var(--mono); font-size: 10px;
  letter-spacing: 0.24em; text-transform: uppercase;
  color: var(--cream); font-weight: 700;
  position: relative; z-index: 1;
}

.wrm-section .stat-context {
  font-family: var(--body); font-size: 11.5px;
  color: var(--ink-soft); line-height: 1.45;
  margin-top: 6px;
  max-width: 200px; margin-left: auto; margin-right: auto;
  position: relative; z-index: 1;
}

.wrm-section .body-wrap {
  max-width: 740px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
.wrm-section .body-block {
  padding: 24px 0;
  text-align: center;
  border-bottom: 1px solid var(--ink-line);
  position: relative;
}
.wrm-section .body-block:last-child { border-bottom: none; }

.wrm-section .body-block::before {
  content: '';
  position: absolute;
  top: 24px; left: 50%;
  width: 0; height: 1px;
  background: var(--care-bright);
  transform: translateX(-50%);
  transition: width 0.6s var(--ease);
}
.wrm-section .body-wrap.is-in .body-block::before { width: 22px; }

.wrm-section .body-eyebrow {
  font-family: var(--mono); font-size: 9.5px;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--purpose-soft); font-weight: 700;
  margin-bottom: 10px;
  display: inline-flex; align-items: center; gap: 8px;
}
.wrm-section .body-eyebrow .pip { color: var(--care-bright); }
.wrm-section .body-eyebrow-num { color: var(--cream); }

.wrm-section .body-text {
  font-family: var(--body); font-size: 15.5px;
  line-height: 1.55; color: var(--ink-medium);
  max-width: 620px; margin: 0 auto;
}
.wrm-section .body-text strong { color: var(--cream); font-weight: 600; }

.wrm-section .body-text.pull {
  font-family: var(--serif); font-style: italic;
  font-size: 18px;
  color: var(--cream);
  line-height: 1.4;
}
.wrm-section .body-text.pull strong {
  font-style: normal;
  font-family: var(--display);
  font-weight: 900;
  color: var(--care-bright);
  font-size: 17px;
}

@media (max-width: 880px) {
  .wrm-section .stats-grid { grid-template-columns: 1fr; gap: 14px; }
}
@media (max-width: 520px) {
  .wrm-section .stat-num { font-size: 72px; }
}

@media (prefers-reduced-motion: reduce) {
  .wrm-section *, .wrm-section *::before, .wrm-section *::after {
    transition-duration: 0.01ms !important;
    transition-delay: 0ms !important;
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
  }
  .wrm-section .reveal, .wrm-section .word-inner, .wrm-section .meta-row { opacity: 1 !important; transform: none !important; }
  .wrm-section .stat-rule { transform: scaleX(1) !important; }
  .wrm-section .stat-card::before { transform: scaleX(1) !important; }
  .wrm-section .stat-card-wrap > .tick path { stroke-dashoffset: 0 !important; }
  .wrm-section .body-block::before { width: 22px !important; }
}
`;
