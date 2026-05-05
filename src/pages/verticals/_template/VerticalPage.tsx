import { useEffect, useRef, useState } from "react";
import VerticalNavBar from "@/components/VerticalLanding/VerticalNavBar";
import Footer from "@/components/Footer";
import { CSS } from "./css";
import type { VerticalConfig, VerticalSlug, SmallStat, BreakBlock } from "./configs";

type AuditAnswer = "yes" | "no" | null;
type AuditState = Record<number, AuditAnswer>;

const VERTICALS_LIST: { href: string; label: string; slug: VerticalSlug }[] = [
  { href: "/consulting", label: "Consulting", slug: "consulting" },
  { href: "/law", label: "Law", slug: "law" },
  { href: "/accounting", label: "Accounting", slug: "accounting" },
  { href: "/msp", label: "MSP", slug: "msp" },
  { href: "/advisory", label: "Financial Advisory", slug: "advisory" },
  { href: "/ae", label: "Architecture", slug: "ae" },
  { href: "/recruiting", label: "Executive Search", slug: "recruiting" },
  { href: "/agency", label: "Marketing", slug: "agency" },
];

const ArrowSvg = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M2 7h10m0 0L8 3m4 4l-4 4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SmallStatViz = ({ kind }: { kind: SmallStat["viz"] }) => {
  if (kind === "density") {
    return (
      <svg width="60" height="48" viewBox="0 0 60 48" aria-hidden="true">
        <g fill="#0F1E1D" opacity="0.16">
          {[6, 18, 30, 42].map((cy) =>
            [6, 18, 30, 42, 54].map((cx) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" />)
          )}
        </g>
        <circle cx="42" cy="18" r="2.6" fill="#BF461A" />
        <circle cx="18" cy="30" r="2.6" fill="#BF461A" />
      </svg>
    );
  }
  if (kind === "bars") {
    return (
      <svg width="60" height="48" viewBox="0 0 60 48" aria-hidden="true">
        <rect x="0" y="34" width="8" height="14" fill="#0F1E1D" opacity="0.20" />
        <rect x="13" y="22" width="8" height="26" fill="#0F1E1D" opacity="0.30" />
        <rect x="26" y="6" width="8" height="42" fill="#A79014" />
        <rect x="39" y="16" width="8" height="32" fill="#0F1E1D" opacity="0.40" />
        <rect x="52" y="28" width="8" height="20" fill="#0F1E1D" opacity="0.30" />
      </svg>
    );
  }
  return (
    <svg width="60" height="48" viewBox="0 0 60 48" aria-hidden="true">
      <polyline
        points="2,40 14,34 26,30 38,20 50,14 58,6"
        fill="none"
        stroke="#0F1E1D"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="58" cy="6" r="2.6" fill="#BF461A" />
    </svg>
  );
};

const BreakChart = ({ kind }: { kind: BreakBlock["chart"] }) => {
  if (kind === "timeline") {
    return (
      <svg viewBox="0 0 180 100" preserveAspectRatio="xMidYMid meet">
        <line x1="14" y1="58" x2="166" y2="58" stroke="#0F1E1D" strokeWidth="1" strokeLinecap="round" />
        <g stroke="#0F1E1D" strokeWidth="1" opacity="0.4">
          <line x1="14" y1="54" x2="14" y2="62" />
          <line x1="52" y1="54" x2="52" y2="62" />
          <line x1="90" y1="54" x2="90" y2="62" />
          <line x1="166" y1="54" x2="166" y2="62" />
        </g>
        <line x1="128" y1="42" x2="128" y2="74" stroke="#BF461A" strokeWidth="2" strokeLinecap="round" />
        <circle cx="128" cy="42" r="3" fill="#BF461A" />
        <text x="14" y="78" fontFamily="var(--mono)" fontSize="7.5" letterSpacing="1" fill="#9AA09C" fontWeight="600">SENT</text>
        <text x="52" y="78" fontFamily="var(--mono)" fontSize="7.5" letterSpacing="1" fill="#9AA09C" fontWeight="600">3MO</text>
        <text x="90" y="78" fontFamily="var(--mono)" fontSize="7.5" letterSpacing="1" fill="#9AA09C" fontWeight="600">6MO</text>
        <text x="128" y="34" textAnchor="middle" fontFamily="var(--mono)" fontSize="7.5" letterSpacing="1.4" fill="#BF461A" fontWeight="700">SILENT</text>
        <text x="128" y="92" textAnchor="middle" fontFamily="var(--mono)" fontSize="7.5" letterSpacing="1" fill="#0F1E1D" fontWeight="700">9MO</text>
        <text x="166" y="78" textAnchor="end" fontFamily="var(--mono)" fontSize="7.5" letterSpacing="1" fill="#9AA09C" fontWeight="600">12MO</text>
      </svg>
    );
  }
  if (kind === "partnerWeek") {
    return (
      <svg viewBox="0 0 180 100" preserveAspectRatio="xMidYMid meet">
        <text x="14" y="22" fontFamily="var(--mono)" fontSize="7.5" letterSpacing="1.4" fill="#0F1E1D" fontWeight="700">PARTNER WEEK · 50 HRS</text>
        <rect x="14" y="34" width="86" height="14" fill="#0F1E1D" opacity="0.5" />
        <rect x="100" y="34" width="48" height="14" fill="#0F1E1D" opacity="0.30" />
        <rect x="148" y="34" width="18" height="14" fill="#BF461A" />
        <g stroke="#0F1E1D" strokeWidth="0.6" opacity="0.4">
          <line x1="14" y1="50" x2="14" y2="54" />
          <line x1="100" y1="50" x2="100" y2="54" />
          <line x1="148" y1="50" x2="148" y2="54" />
          <line x1="166" y1="50" x2="166" y2="54" />
        </g>
        <text x="14" y="68" fontFamily="var(--mono)" fontSize="7" letterSpacing="1" fill="#9AA09C" fontWeight="600">DELIVERY</text>
        <text x="100" y="68" fontFamily="var(--mono)" fontSize="7" letterSpacing="1" fill="#9AA09C" fontWeight="600">ADMIN</text>
        <text x="148" y="68" fontFamily="var(--mono)" fontSize="7" letterSpacing="1" fill="#BF461A" fontWeight="700">BD</text>
        <text x="14" y="82" fontFamily="var(--display)" fontSize="11" letterSpacing="-0.04em" fill="#0F1E1D" fontWeight="900">~38</text>
        <text x="100" y="82" fontFamily="var(--display)" fontSize="11" letterSpacing="-0.04em" fill="#0F1E1D" fontWeight="900">~10</text>
        <text x="148" y="82" fontFamily="var(--display)" fontSize="11" letterSpacing="-0.04em" fill="#BF461A" fontWeight="900">~2</text>
      </svg>
    );
  }
  if (kind === "coldVsWarm") {
    return (
      <svg viewBox="0 0 180 100" preserveAspectRatio="xMidYMid meet">
        <text x="14" y="22" fontFamily="var(--mono)" fontSize="7.5" letterSpacing="1.4" fill="#9AA09C" fontWeight="700">COLD OUTREACH</text>
        <rect x="14" y="28" width="152" height="6" fill="#0F1E1D" opacity="0.10" />
        <rect x="14" y="28" width="3" height="6" fill="#0F1E1D" opacity="0.40" />
        <text x="166" y="33" textAnchor="end" fontFamily="var(--display)" fontSize="11" letterSpacing="-0.03em" fill="#0F1E1D" fontWeight="900">{"<"}2%</text>
        <text x="14" y="60" fontFamily="var(--mono)" fontSize="7.5" letterSpacing="1.4" fill="#BF461A" fontWeight="700">WARM RELATIONSHIPS</text>
        <rect x="14" y="66" width="152" height="6" fill="#0F1E1D" opacity="0.10" />
        <rect x="14" y="66" width="49" height="6" fill="#BF461A" />
        <text x="166" y="71" textAnchor="end" fontFamily="var(--display)" fontSize="11" letterSpacing="-0.03em" fill="#BF461A" fontWeight="900">25 to 40%</text>
        <text x="14" y="92" fontFamily="var(--mono)" fontSize="6.5" letterSpacing="1" fill="#9AA09C" fontWeight="600">REPLY RATE BENCHMARK</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 180 100" preserveAspectRatio="xMidYMid meet">
      <text x="14" y="18" fontFamily="var(--mono)" fontSize="7.5" letterSpacing="1.4" fill="#0F1E1D" fontWeight="700">YOUR NETWORK · 1,000 CONTACTS</text>
      <circle cx="20" cy="38" r="3.5" fill="#0F1E1D" />
      <circle cx="36" cy="38" r="3.5" fill="#0F1E1D" />
      <circle cx="52" cy="38" r="3.5" fill="#0F1E1D" />
      <circle cx="68" cy="38" r="3.5" fill="#0F1E1D" opacity="0.5" />
      {[84, 100, 116].map((cx) => <circle key={cx} cx={cx} cy="38" r="3.5" fill="#0F1E1D" opacity="0.20" />)}
      <circle cx="132" cy="38" r="3.5" fill="#0F1E1D" opacity="0.18" />
      <circle cx="148" cy="38" r="3.5" fill="#0F1E1D" opacity="0.16" />
      <circle cx="164" cy="38" r="3.5" fill="#0F1E1D" opacity="0.14" />
      {[20, 36, 52].map((cx) => <circle key={`r2-${cx}`} cx={cx} cy="54" r="3.5" fill="#0F1E1D" opacity="0.20" />)}
      <circle cx="68" cy="54" r="3.5" fill="#0F1E1D" opacity="0.18" />
      <circle cx="84" cy="54" r="3.5" fill="#0F1E1D" opacity="0.16" />
      <circle cx="100" cy="54" r="3.5" fill="#0F1E1D" opacity="0.14" />
      <circle cx="116" cy="54" r="3.5" fill="#0F1E1D" opacity="0.12" />
      <circle cx="132" cy="54" r="3.5" fill="#0F1E1D" opacity="0.12" />
      <circle cx="148" cy="54" r="3.5" fill="#0F1E1D" opacity="0.10" />
      <circle cx="164" cy="54" r="3.5" fill="#0F1E1D" opacity="0.10" />
      <circle cx="100" cy="38" r="4" fill="none" stroke="#BF461A" strokeWidth="1.2" />
      <circle cx="148" cy="54" r="4" fill="none" stroke="#BF461A" strokeWidth="1.2" />
      <circle cx="20" cy="80" r="2.4" fill="#0F1E1D" />
      <text x="28" y="83" fontFamily="var(--mono)" fontSize="6.5" letterSpacing="1" fill="#0F1E1D" fontWeight="600">ACTIVE 200</text>
      <circle cx="92" cy="80" r="2.4" fill="#0F1E1D" opacity="0.20" />
      <text x="100" y="83" fontFamily="var(--mono)" fontSize="6.5" letterSpacing="1" fill="#9AA09C" fontWeight="600">DORMANT 800</text>
    </svg>
  );
};

const SmallStatNumberDisplay = ({ stat }: { stat: SmallStat }) => {
  if (stat.num.type === "static") {
    return <div className="small-stat-num">{stat.num.text}</div>;
  }
  return (
    <div className="small-stat-num" data-target={stat.num.target} data-format={stat.num.format}>
      0
    </div>
  );
};

const ROADMAP_DEFAULTS = [
  { day: "Day 0", label: "The Score", desc: "90 seconds to build. 10 minutes to read. Free." },
  { day: "Day 7", label: "Practice Growth Profile", desc: "Benchmarked against peer firms. Confidential." },
  { day: "Day 30", label: "Discovery", desc: "Where partnership begins. Run the framework with the team." },
  { day: "Day 90", label: "First Reactivation", desc: "Your first warm reply from a dormant relationship." },
];

export default function VerticalPage({ config }: { config: VerticalConfig }) {
  const [audit, setAudit] = useState<AuditState>({ 1: null, 2: null, 3: null, 4: null, 5: null, 6: null });
  const rootRef = useRef<HTMLDivElement>(null);

  const yesCount = Object.values(audit).filter((v) => v === "yes").length;
  const alert = yesCount >= 2;

  useEffect(() => {
    document.title = config.pageTitle;
    const setMeta = (key: string, content: string) => {
      const selector = `meta[name="${key}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta("description", config.pageDescription);
  }, [config.pageTitle, config.pageDescription]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = root.querySelectorAll<HTMLElement>(".section, .verticals");

    if (reduced) {
      sections.forEach((el) => el.classList.add("is-in"));
      root.querySelectorAll<HTMLElement>(".small-stat-num").forEach((el) => {
        if (!el.dataset.target) return;
        const t = Number(el.dataset.target);
        const fmt = el.dataset.format;
        if (fmt === "suffix-k") el.textContent = t + "K+";
        else if (fmt === "pct-decimal") el.textContent = t.toFixed(1) + "%";
        else el.textContent = t.toLocaleString();
      });
      return;
    }

    const sectionIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            sectionIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    sections.forEach((el) => sectionIO.observe(el));

    const countUp = (el: HTMLElement) => {
      if (el.dataset.counted || !el.dataset.target) return;
      el.dataset.counted = "1";
      const target = Number(el.dataset.target);
      const fmt = el.dataset.format;
      const duration = 1400;
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = target * eased;
        if (fmt === "suffix-k") el.textContent = Math.round(v) + "K+";
        else if (fmt === "pct-decimal") el.textContent = v.toFixed(1) + "%";
        else el.textContent = Math.round(v).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const numIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = (entry.target as HTMLElement).closest(".small-stat") as HTMLElement | null;
            const idx = card && card.parentNode ? Array.from(card.parentNode.children).indexOf(card) : 0;
            window.setTimeout(() => countUp(entry.target as HTMLElement), 200 + idx * 110);
            numIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    root
      .querySelectorAll<HTMLElement>(".small-stat-num")
      .forEach((el) => {
        if (el.dataset.target) numIO.observe(el);
      });

    return () => {
      sectionIO.disconnect();
      numIO.disconnect();
    };
  }, [config.slug]);

  const setAnswer = (q: number, v: AuditAnswer) => setAudit((s) => ({ ...s, [q]: v }));

  const Meta = ({ num, tag }: { num: string; tag: string }) => (
    <div className="meta-row">
      <span className="rule" />
      <span className="meta-tag">
        <span className="num">{num}</span>
        <span className="pip">·</span>
        {tag}
      </span>
      <span className="rule" />
    </div>
  );

  const stops = config.roadmap.stops ?? ROADMAP_DEFAULTS;
  const splitWords = (s: string) => s.split(" ").filter(Boolean);
  const line1Words = splitWords(config.hero.headlineLine1);
  const line2Words = splitWords(config.hero.headlineLine2);

  return (
    <div ref={rootRef} className="cpage">
      <style>{CSS}</style>

      <VerticalNavBar addYourFirmLabel="Add Your Firm" />

      {/* SECTION 01 · HERO */}
      <section className="section section-hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-left">
              <Meta num="01" tag="Hero" />
              <div className="hero-eyebrow reveal d1">
                <span className="eyebrow-rule" />
                <span className="eyebrow-text">{config.hero.eyebrow}</span>
                <span className="vol-tag">Vol. 01</span>
              </div>
              <h1 className="hero-headline">
                <span className="hl-line">
                  {line1Words.map((w, i) => (
                    <span className="word-mask" key={i}>
                      <span className="word-inner">{w}&nbsp;</span>
                    </span>
                  ))}
                </span>
                <span className="hl-line">
                  {line2Words.map((w, i) => (
                    <span className="word-mask" key={i}>
                      <span className="word-inner">{w}&nbsp;</span>
                    </span>
                  ))}
                  <span className="word-mask">
                    <span className="word-inner period">.</span>
                  </span>
                </span>
              </h1>
              <p className="hero-lede reveal d3">{config.hero.lede}</p>
              <form
                className="hero-form reveal d4"
                onSubmit={(e) => {
                  e.preventDefault();
                  document.getElementById("begin")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <input type="url" placeholder="yourfirm.com" aria-label="Firm website URL" />
                <button type="submit" className="cta-pill">
                  {config.score.ctaLabel}
                  <ArrowSvg />
                </button>
              </form>
              <div className="trust-line reveal d5">
                Free <span className="dot">·</span> 90 sec to build <span className="dot">·</span> 10 min to read{" "}
                <span className="dot">·</span> Confidential <span className="dot">·</span> Benchmarked against peer firms
              </div>
            </div>

            <div className="hero-right">
              <div className="profile-stage" aria-hidden="true">
                <div className="profile-card">
                  <header className="profile-eyebrow">
                    <span className="profile-eyebrow-label">
                      {config.profile.eyebrowLabel}
                      <span className="pip">/</span>Preview
                    </span>
                    <span className="profile-eyebrow-status">
                      <span className="live-dot" />
                      Sample Output
                    </span>
                  </header>

                  <div className="profile-firm-row">
                    <span className="profile-firm-label">Firm</span>
                    <span className="profile-firm-name">{config.profile.firmName}</span>
                  </div>

                  <div className="profile-score-row">
                    <div className="profile-score">
                      {config.profile.score}
                      <span className="denom">/100</span>
                    </div>
                    <div className="profile-score-context">
                      <div className="profile-score-tier">{config.profile.tier}</div>
                      <div className="profile-score-msg">{config.profile.msg}</div>
                    </div>
                  </div>

                  <div className="profile-bars">
                    {config.profile.bars.map((b) => (
                      <div className="profile-bar-row" key={b.label}>
                        <div className="profile-bar-label">
                          <span>{b.label}</span>
                          <span className="profile-bar-pct">{b.w}%</span>
                        </div>
                        <div className="profile-bar-track">
                          <div
                            className="profile-bar-fill"
                            style={{ "--w": `${b.w}%` } as React.CSSProperties}
                          />
                          <div className="profile-bar-mark" style={{ left: `${b.mark}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <footer className="profile-foot">
                    <span className="profile-foot-doc">10 Questions · 10 Minutes</span>
                    <span className="profile-foot-conf">
                      <svg viewBox="0 0 12 12" fill="none" width="9" height="9">
                        <rect x="2" y="5" width="8" height="6" stroke="currentColor" strokeWidth="1.2" rx="0.5" />
                        <path d="M4 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1.2" fill="none" />
                      </svg>
                      Confidential
                    </span>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02 · NUMBERS */}
      <section className="section">
        <div className="container">
          <header className="section-head">
            <Meta num="02" tag={config.numbers.metaTag} />
            <h2 className="section-headline reveal d1">
              {config.numbers.headline}
              <span className="period">.</span>
            </h2>
            <p className="section-sub reveal d2">{config.numbers.sub}</p>
          </header>

          <div className="numbers-grid">
            <div className="hero-stat reveal d3">
              <div className="hero-stat-label">{config.numbers.heroStat.label}</div>
              <div className="hero-stat-num">{config.numbers.heroStat.num}</div>
              <div className="hero-stat-sub">{config.numbers.heroStat.sub}</div>
              <div className="hero-stat-bar">
                <div className="hero-stat-fill" />
              </div>
              <div className="hero-stat-source">{config.numbers.heroStat.source}</div>
            </div>

            <div className="small-stats">
              {config.numbers.smallStats.map((s, i) => (
                <div className={`small-stat reveal d${4 + i}`} key={s.label}>
                  <div className="small-stat-text">
                    <div className="small-stat-label">{s.label}</div>
                    <SmallStatNumberDisplay stat={s} />
                    <div className="small-stat-source">{s.source}</div>
                  </div>
                  <div className="small-stat-viz">
                    <SmallStatViz kind={s.viz} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03 · REALITY */}
      <section className="section">
        <div className="container">
          <aside className="definition-pull reveal d1">
            <span className="definition-pull-mark">Definition · First Use</span>
            <div className="definition-pull-term">{config.reality.definitionTerm}</div>
            <p className="definition-pull-body">{config.reality.definitionBody}</p>
          </aside>

          <header className="section-head">
            <Meta num="03" tag={config.reality.metaTag} />
            <h2 className="section-headline reveal d1">
              {config.reality.headline}
              <span className="period">.</span>
            </h2>
            <p className="section-sub reveal d2">{config.reality.sub}</p>
          </header>

          <div className="reality-grid">
            {config.reality.cards.map((c, i) => (
              <div className={`reality-card reveal d${(i % 6) + 2}`} key={c.num}>
                <div className="reality-card-num">{c.num}</div>
                <div className="reality-card-stat">{c.stat}</div>
                <div className="reality-card-text">{c.text}</div>
                <div className="reality-card-source">{c.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 04 · WHERE IT BREAKS */}
      <section className="section">
        <div className="container">
          <header className="section-head">
            <Meta num="04" tag={config.breaks.metaTag} />
            <h2 className="section-headline reveal d1">
              {config.breaks.headline}
              <span className="period">.</span>
            </h2>
          </header>

          <div className="break-stack">
            {config.breaks.blocks.map((b, i) => (
              <article className={`break-block reveal d${i + 2}`} key={b.num}>
                <div className="break-chart">
                  <BreakChart kind={b.chart} />
                </div>
                <div className="break-text">
                  <div className="break-num-row">
                    <span className="break-num-rule" />
                    <span className="break-num">{b.num}</span>
                  </div>
                  <h3 className="break-headline">{b.headline}</h3>
                  <p className="break-body">{b.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 05 · AUDIT */}
      <section className="section">
        <div className="container">
          <header className="section-head">
            <Meta num="05" tag={config.audit.metaTag} />
            <h2 className="section-headline reveal d1">
              {config.audit.headline}
              <span className="period">.</span>
            </h2>
            <p className="section-sub reveal d2">{config.audit.sub}</p>
          </header>

          <div className="audit-card reveal d3">
            <div className="audit-tally">
              <div className="audit-tally-label">◧ Tally</div>
              <div className={`audit-tally-count${alert ? " alert" : ""}`}>
                <span>{yesCount}</span>
                <span className="of">/ 6 critical gaps</span>
              </div>
            </div>

            {config.audit.questions.map((text, i) => {
              const q = i + 1;
              return (
                <div className="audit-question-row" key={q}>
                  <div className="audit-q-num">0{q}</div>
                  <div className="audit-q-text">{text}</div>
                  <div className="audit-toggle">
                    <button
                      type="button"
                      className={`${audit[q] === "yes" ? "active yes" : ""}`}
                      onClick={() => setAnswer(q, "yes")}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className={`${audit[q] === "no" ? "active no" : ""}`}
                      onClick={() => setAnswer(q, "no")}
                    >
                      No
                    </button>
                  </div>
                </div>
              );
            })}

            <div className={`audit-result${alert ? " alert" : ""}`}>
              {alert ? (
                <>
                  <span style={{ color: "var(--care)", fontWeight: 700 }}>→</span> {config.audit.alertMessage}
                </>
              ) : (
                "Click any question to begin your audit"
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 06 · ROADMAP */}
      <section className="section">
        <div className="container">
          <header className="section-head">
            <Meta num="06" tag={config.roadmap.metaTag} />
            <h2 className="section-headline reveal d1">
              {config.roadmap.headline}
              <span className="period">.</span>
            </h2>
            <p className="section-sub reveal d2">{config.roadmap.sub}</p>
          </header>

          <div className="roadmap-shell">
            <div className="roadmap-track" />
            <div className="roadmap-grid">
              {stops.map((s, i) => (
                <div className={`roadmap-stop stop-${i + 1}`} key={s.day}>
                  <div className="roadmap-day">{s.day}</div>
                  <div className={`roadmap-dot ${i === 0 ? "first" : ""} ${i === 3 ? "last" : ""}`} />
                  <div className="roadmap-stop-label">{s.label}</div>
                  <div className="roadmap-stop-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 07 · SCORE DARK */}
      <section className="section dark" id="score">
        <div className="score-bg" aria-hidden="true">
          <svg viewBox="0 0 1200 400" preserveAspectRatio="none">
            <g stroke="#F8F2E5" strokeWidth="0.5" fill="none" opacity="0.5">
              <line x1="40" y1="320" x2="1160" y2="320" />
              <line x1="40" y1="240" x2="1160" y2="240" />
              <line x1="40" y1="160" x2="1160" y2="160" />
              <line x1="40" y1="80" x2="1160" y2="80" />
            </g>
            <polyline
              points="40,300 200,260 360,250 520,200 680,180 840,140 1000,110 1160,80"
              fill="none"
              stroke="#FFBA1A"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="40,310 200,300 360,290 520,280 680,290 840,300 1000,310 1160,300"
              fill="none"
              stroke="#F8F2E5"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.45"
            />
            <g fill="#BF461A">
              <circle cx="200" cy="260" r="2.5" />
              <circle cx="520" cy="200" r="2.5" />
              <circle cx="840" cy="140" r="2.5" />
              <circle cx="1160" cy="80" r="2.5" />
            </g>
          </svg>
        </div>
        <div className="container score-inner">
          <header className="section-head">
            <Meta num="07" tag={config.score.metaTag} />
            <h2 className="score-headline reveal d1">
              {config.score.headline}
              <span className="period">.</span>
            </h2>
            <p className="score-sub reveal d2">{config.score.sub}</p>
          </header>

          <form
            className="score-form reveal d3"
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById("begin")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <input type="url" placeholder="yourfirm.com" aria-label="Firm website URL" />
            <button type="submit" className="cta-pill">
              {config.score.ctaLabel}
              <ArrowSvg />
            </button>
          </form>

          <div className="trust-line dark reveal d4">
            Free <span className="dot">·</span> 90 sec to build <span className="dot">·</span> 10 min to read{" "}
            <span className="dot">·</span> Confidential
          </div>
        </div>
      </section>

      {/* SECTION 08 · AUTHORS */}
      <section className="section">
        <div className="container">
          <header className="section-head">
            <Meta num="08" tag="Who Built This" />
            <h2 className="section-headline reveal d1">
              {config.authorsHeadline}
              <span className="period">.</span>
            </h2>
          </header>

          <div className="authors-grid">
            {[
              {
                strip: "purpose",
                role: "purpose",
                initials: "AF",
                name: "Adam Fridman",
                title: "Co-author · Mabbly Founder",
                bio: (
                  <>
                    Founded Mabbly. <strong>500+ practitioner interviews</strong> on GTM for Professional Services.
                    Built the framework with the firms running it now.
                  </>
                ),
                stats: [
                  { num: "500+", label: "Interviews" },
                  { num: "30", label: "Cohort Firms" },
                ],
              },
              {
                strip: "care",
                role: "care",
                initials: "RA",
                name: "Richard Ashbaugh",
                title: "Co-author · Operator",
                bio: (
                  <>
                    <strong>$1.2B at A.T. Kearney.</strong> $125M AArete revenue as CMO. The framework was forged in his
                    books before it became the manuscript.
                  </>
                ),
                stats: [
                  { num: "$1.2B", label: "A.T. Kearney" },
                  { num: "$125M", label: "AArete CMO" },
                ],
              },
              {
                strip: "depth",
                role: "depth",
                initials: "JC",
                name: "Jonathan Copulsky",
                title: "Foreword · Kellogg · Deloitte",
                bio: (
                  <>
                    Northwestern Kellogg faculty. Former <strong>Deloitte CMO</strong>. Validated the research
                    methodology and wrote the foreword.
                  </>
                ),
                stats: [
                  { num: "Kellogg", label: "Faculty" },
                  { num: "Deloitte", label: "Former CMO" },
                ],
              },
            ].map((a, i) => (
              <article className={`author-tile reveal d${i + 2}`} key={a.initials}>
                <span className={`author-tile-strip strip-${a.strip}`} />
                <div className="author-monogram-wrap">
                  <span className="tick tick-tl" />
                  <span className="tick tick-tr" />
                  <span className="tick tick-bl" />
                  <span className="tick tick-br" />
                  <div className="author-monogram">{a.initials}</div>
                </div>
                <div className="author-name">{a.name}</div>
                <div className={`author-role role-${a.role}`}>{a.title}</div>
                <p className="author-bio">{a.bio}</p>
                <div className="author-stat-row">
                  {a.stats.map((s) => (
                    <div className="author-stat" key={s.label}>
                      <div className="author-stat-num">{s.num}</div>
                      <div className="author-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 09 · FAQ */}
      <section className="section">
        <div className="container">
          <header className="section-head">
            <Meta num="09" tag={config.faq.metaTag} />
            <h2 className="section-headline reveal d1">
              {config.faq.headline}
              <span className="period">.</span>
            </h2>
          </header>

          <div className="faq-list reveal d2">
            {config.faq.items.map((f, i) => (
              <details className="faq-item" key={i}>
                <summary className="faq-summary">
                  <span className="faq-tag">{f.tag}</span>
                  <span>{f.q}</span>
                  <span className="faq-toggle" />
                </summary>
                <p className="faq-answer">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 · BEGIN */}
      <section className="section" id="begin">
        <div className="container">
          <header className="section-head">
            <Meta num="10" tag="Begin" />
          </header>
          <div className="begin-inner">
            <h2 className="begin-headline reveal d1">
              {config.begin.headline}
              <span className="period">.</span>
            </h2>
            <form
              className="hero-form reveal d2"
              style={{ margin: "0 auto" }}
              onSubmit={(e) => e.preventDefault()}
            >
              <input type="url" placeholder="yourfirm.com" aria-label="Firm website URL" />
              <button type="submit" className="cta-pill">
                {config.begin.ctaLabel}
                <ArrowSvg />
              </button>
            </form>
            <div className="trust-line reveal d3" style={{ textAlign: "center", margin: "18px auto 0" }}>
              Free <span className="dot">·</span> 90 sec to build <span className="dot">·</span> 10 min to read{" "}
              <span className="dot">·</span> Confidential <span className="dot">·</span> Benchmarked against peer firms
            </div>
          </div>
        </div>
      </section>

      {/* VERTICALS BLOCK */}
      <section className="verticals" id="verticals">
        <div className="container">
          <div className="verticals-eyebrow">Find Your Industry</div>
          <div className="verticals-grid">
            {VERTICALS_LIST.map((v) => (
              <a
                className={`vertical-chip${v.slug === config.slug ? " active" : ""}`}
                href={v.href}
                key={v.href}
              >
                {v.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
