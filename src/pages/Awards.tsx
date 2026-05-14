import { useEffect, useRef } from "react";
import { CSS } from "@/pages/verticals/_template/css";
import VerticalNavBar from "@/components/VerticalLanding/VerticalNavBar";
import Footer from "@/components/Footer";
import NotifySignup from "@/components/forms/NotifySignup";

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

const VERTICALS_LIST = [
  { href: "/consulting", label: "Consulting" },
  { href: "/law", label: "Law" },
  { href: "/accounting", label: "Accounting" },
  { href: "/msp", label: "MSP" },
  { href: "/advisory", label: "Financial Advisory" },
  { href: "/ae", label: "Architecture" },
  { href: "/recruiting", label: "Executive Search" },
  { href: "/agency", label: "Marketing" },
];

const AWARDS = [
  {
    num: "01",
    name: "The Practice Growth Award",
    vertical: "Management Consulting",
    slug: "consulting",
    body: "For the consulting firm that activated dormant accounts and built systematic origination beyond partner calendars.",
  },
  {
    num: "02",
    name: "The Origination Award",
    vertical: "Law Firms",
    slug: "law",
    body: "For the law firm that built origination as a system, not as a hostage to partner books.",
  },
  {
    num: "03",
    name: "The Client Development Award",
    vertical: "Accounting & Tax",
    slug: "accounting",
    body: "For the accounting firm that turned tax clients into advisory clients without losing the relationship.",
  },
  {
    num: "04",
    name: "The Account Expansion Award",
    vertical: "MSP & IT Services",
    slug: "msp",
    body: "For the MSP that systemized renewal capture and reactivated lost accounts with signal-driven outreach.",
  },
  {
    num: "05",
    name: "The Organic Growth Award",
    vertical: "Financial Advisory",
    slug: "advisory",
    body: "For the advisory firm that built systematic prospecting around wealth events and COI cultivation.",
  },
  {
    num: "06",
    name: "The Pursuit Award",
    vertical: "Architecture & Engineering",
    slug: "ae",
    body: "For the A&E firm that converted dormant pursuits and built repeat business as a system.",
  },
  {
    num: "07",
    name: "The Mandate Award",
    vertical: "Executive Search",
    slug: "recruiting",
    body: "For the search firm that retracked placed candidates and reignited dormant client mandates.",
  },
  {
    num: "08",
    name: "The New Business Award",
    vertical: "Marketing & Creative",
    slug: "agency",
    body: "For the agency that systemized lost-pitch reactivation and built principal-led new business at scale.",
  },
];

const JUDGING = [
  {
    tag: "Selection",
    headline: "Practitioner panel.",
    body: "Winners selected by Adam Fridman, Richard Ashbaugh, and a panel of practitioners spanning all eight verticals. Validated by Jonathan Copulsky (Kellogg / Deloitte).",
  },
  {
    tag: "Methodology",
    headline: "Systematic excellence.",
    body: "Judged on repeatable systems. The firms that built origination, expansion, or reactivation as a process - not the ones with single lucky wins.",
  },
  {
    tag: "Year One Truth",
    headline: "We will not award where we cannot evidence excellence.",
    body: "Inaugural cohort, 2026. Held verticals re-open Year Two. Winners are firms whose practice is documented, not implied.",
  },
];

const TIMELINE = [
  { day: "June 2026", label: "Nominations Open", desc: "Every firm that takes the diagnostic enters the consideration set. No separate application." },
  { day: "August 2026", label: "Finalists Announced", desc: "Eight finalists per vertical. Public on discover.mabbly.com." },
  { day: "September 2026", label: "Winners Revealed", desc: "Eight named firms. Editorial features in the manuscript and on Mabbly." },
  { day: "Q4 2026", label: "Inaugural Cohort Live", desc: "Winners and finalists become the Year-One reference set for peer firms." },
];

const FAQS = [
  { tag: "Eligibility", q: "Who is eligible?", a: "Any independent professional services firm in one of the eight verticals, with $5M,$100M in revenue and a US presence. The diagnostic determines fit." },
  { tag: "Application", q: "Is there a separate application?", a: "No. Every firm that takes the 10-minute diagnostic is considered by default. Anonymous benchmarking applies; named recognition is opt-in." },
  { tag: "Cost", q: "Is there a fee?", a: "No fee to enter, finalist, or win. The Awards exist to recognize practice excellence - not to monetize entry." },
  { tag: "Privacy", q: "Can my firm participate confidentially?", a: "Yes. Participation defaults to anonymous benchmarking. Named cases are opt-in only. Unsuccessful firms are never publicly identified." },
  { tag: "Methodology", q: "How are winners actually chosen?", a: "Three inputs: diagnostic score (40%), practitioner panel review (40%), and documented systems evidence (20%). The full rubric is published before nominations open." },
  { tag: "Geography", q: "Is this US-only?", a: "The inaugural cohort is US-focused due to the research base. International firms are welcome to take the diagnostic - international awards launch Year Two." },
];

export default function Awards() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "GTM for PS Awards - Inaugural 2026 | Mabbly";
    const setMeta = (key: string, content: string) => {
      let el = document.querySelector(`meta[name="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta(
      "description",
      "Eight awards. One per vertical. Inaugural cohort, Q3 2026. Recognizing the professional services firms that systemized practice growth."
    );
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = root.querySelectorAll<HTMLElement>(".section, .verticals");

    if (reduced) {
      sections.forEach((el) => el.classList.add("is-in"));
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

    return () => sectionIO.disconnect();
  }, []);

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

  const headlineLine1 = "Awards built for the firms".split(" ");
  const headlineLine2 = "that win unfairly".split(" ");

  return (
    <div ref={rootRef} className="cpage">
      <style>{CSS}</style>
      <style>{AWARDS_CSS}</style>

      <VerticalNavBar forYourFirmHref="#verticals" addYourFirmHref="#begin" />

      {/* SECTION 01 · HERO */}
      <section className="section section-hero awards-hero">
        <div className="container">
          <Meta num="01" tag="Inaugural · 2026" />
          <div className="awards-hero-eyebrow reveal d1">
            <span className="eyebrow-rule" />
            <span className="eyebrow-text">GTM for PS Awards / Eight Verticals</span>
            <span className="vol-tag">Vol. 01</span>
          </div>
          <h1 className="awards-hero-headline">
            <span className="hl-line">
              {headlineLine1.map((w, i) => (
                <span className="word-mask" key={i}>
                  <span className="word-inner">{w}&nbsp;</span>
                </span>
              ))}
            </span>
            <span className="hl-line">
              {headlineLine2.map((w, i) => (
                <span className="word-mask" key={i}>
                  <span className="word-inner">{w}&nbsp;</span>
                </span>
              ))}
              <span className="word-mask">
                <span className="word-inner period">.</span>
              </span>
            </span>
          </h1>
          <p className="awards-hero-lede reveal d3">
            Excellence in <strong>relationship-driven practice growth</strong> deserves institutional recognition.
            Eight awards. One per vertical. Inaugural cohort, Q3 2026.
          </p>
          <div className="awards-hero-cta-row reveal d4">
            <a className="cta-pill" href="#begin">
              Enter Your Firm
              <ArrowSvg />
            </a>
            <a className="ghost-link" href="#awards">
              See the Eight Awards →
            </a>
          </div>
          <div className="trust-line reveal d5" style={{ margin: "24px auto 0", textAlign: "center", maxWidth: 600 }}>
            Free <span className="dot">·</span> 90 sec to build <span className="dot">·</span> 10 min to read{" "}
            <span className="dot">·</span> Confidential <span className="dot">·</span> Considered for Awards by default
          </div>
        </div>
      </section>

      {/* SECTION 02 · MANUSCRIPT QUOTE */}
      <section className="section">
        <div className="container">
          <header className="section-head">
            <Meta num="02" tag="From the Manuscript" />
          </header>
          <aside className="quote-pull reveal d1">
            <span className="quote-pull-mark">Chapter 4 · Truth II</span>
            <p className="quote-pull-body">
              "The right person at the wrong moment is just another name in your CRM. The right person at the right
              moment is revenue."
            </p>
            <div className="quote-pull-attr">
              <span className="rule" />
              The Relationship Revenue OS
            </div>
            <p className="quote-pull-tag">We are recognizing the firms that mastered the right moment.</p>
          </aside>
        </div>
      </section>

      {/* SECTION 03 · THE EIGHT AWARDS (DARK) */}
      <section className="section dark awards-eight" id="awards">
        <div className="container score-inner" style={{ textAlign: "left" }}>
          <header className="section-head">
            <Meta num="03" tag="The Eight Awards" />
            <h2 className="score-headline reveal d1" style={{ textAlign: "center" }}>
              One award per vertical<span className="period">.</span>
            </h2>
            <p className="score-sub reveal d2">
              Each award recognizes the firm that exemplifies its industry's signature growth motion. Defined by your
              vocabulary, judged on your terms.
            </p>
          </header>

          <div className="awards-grid">
            {AWARDS.map((a, i) => (
              <a className={`award-card reveal d${(i % 6) + 2}`} href={`/${a.slug}`} key={a.slug}>
                <div className="award-card-num">{a.num}</div>
                <div className="award-card-vertical">{a.vertical}</div>
                <h3 className="award-card-name">{a.name}</h3>
                <p className="award-card-body">{a.body}</p>
                <span className="award-card-link">
                  Apply via {a.vertical.split(" ")[0].toLowerCase()} score <ArrowSvg />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 03B · TWO PATHS (NotifySignup dual) */}
      <section className="section">
        <div className="container">
          <header className="section-head">
            <h2 className="section-headline reveal d1">
              Pick the door that fits<span className="period">.</span>
            </h2>
            <p className="section-sub reveal d2">
              Get scanned by the AI, or talk strategy with the team. Either way, four fields and we take it from there.
            </p>
          </header>

          <div
            className="reveal d3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: 24,
              marginTop: 32,
            }}
          >
            <NotifySignup
              variant="ai"
              source="awards"
              headline="Someone in your market just changed jobs, raised a round, or published."
              sub="Don't miss it. Get your free signal scan, four fields and 60 seconds."
              buttonLabel="Get signal scan"
            />
            <NotifySignup
              variant="com"
              source="awards"
              headline="GTM strategy, brand, and content that opens doors."
              sub="Tell us about your firm. We'll show you what's possible."
              buttonLabel="Talk to us"
            />
          </div>
        </div>
      </section>

      {/* SECTION 04 · JUDGING */}
      <section className="section">
        <div className="container">
          <header className="section-head">
            <Meta num="04" tag="How It Works" />
            <h2 className="section-headline reveal d1">
              Judged by practitioners. Awarded with integrity<span className="period">.</span>
            </h2>
          </header>

          <div className="judging-grid">
            {JUDGING.map((j, i) => (
              <article className={`judging-card reveal d${i + 2}`} key={j.tag}>
                <div className="judging-card-tag">{j.tag}</div>
                <h3 className="judging-card-headline">{j.headline}</h3>
                <p className="judging-card-body">{j.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 05 · CALENDAR */}
      <section className="section">
        <div className="container">
          <header className="section-head">
            <Meta num="05" tag="The 2026 Calendar" />
            <h2 className="section-headline reveal d1">
              Q3 2026<span className="period">.</span>
            </h2>
            <p className="section-sub reveal d2">
              Inaugural cohort opens June 2026. Winners revealed September 2026.
            </p>
          </header>

          <div className="roadmap-shell">
            <div className="roadmap-track" />
            <div className="roadmap-grid">
              {TIMELINE.map((s, i) => (
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

      {/* SECTION 06 · DARK CTA (SCORE) */}
      <section className="section dark">
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
            <Meta num="06" tag="Your Firm Is Already Eligible" />
            <h2 className="score-headline reveal d1">
              Take the diagnostic. The Awards consider you by default<span className="period">.</span>
            </h2>
            <p className="score-sub reveal d2">
              10 questions. Your firm is added to the research and the Awards consideration set in one step. No separate
              application.
            </p>
          </header>

          <form className="score-form reveal d3" onSubmit={(e) => e.preventDefault()}>
            <input type="url" placeholder="yourfirm.com" aria-label="Firm website URL" />
            <button type="submit" className="cta-pill">
              Enter Your Firm
              <ArrowSvg />
            </button>
          </form>

          <div className="trust-line dark reveal d4">
            Free <span className="dot">·</span> 90 sec to build <span className="dot">·</span> 10 min to read{" "}
            <span className="dot">·</span> Confidential
          </div>
        </div>
      </section>

      {/* SECTION 07 · FAQ */}
      <section className="section">
        <div className="container">
          <header className="section-head">
            <Meta num="07" tag="Awards Questions" />
            <h2 className="section-headline reveal d1">
              Six common questions<span className="period">.</span>
            </h2>
          </header>

          <div className="faq-list reveal d2">
            {FAQS.map((f, i) => (
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

      {/* SECTION 08 · BEGIN */}
      <section className="section" id="begin">
        <div className="container">
          <header className="section-head">
            <Meta num="08" tag="Begin" />
          </header>
          <div className="begin-inner">
            <h2 className="begin-headline reveal d1">
              Eight awards. One could carry your firm's name<span className="period">.</span>
            </h2>
            <form
              className="hero-form reveal d2"
              style={{ margin: "0 auto" }}
              onSubmit={(e) => e.preventDefault()}
            >
              <input type="url" placeholder="yourfirm.com" aria-label="Firm website URL" />
              <button type="submit" className="cta-pill">
                Enter Your Firm
                <ArrowSvg />
              </button>
            </form>
            <div className="trust-line reveal d3" style={{ textAlign: "center", margin: "18px auto 0" }}>
              Free <span className="dot">·</span> 90 sec to build <span className="dot">·</span> 10 min to read{" "}
              <span className="dot">·</span> Confidential <span className="dot">·</span> Considered for Awards by default
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
              <a className="vertical-chip" href={v.href} key={v.href}>
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

const AWARDS_CSS = `
.cpage .awards-hero { padding: 96px 0 110px; text-align: center; }
.cpage .awards-hero .meta-row { margin-bottom: 24px; }
.cpage .awards-hero-eyebrow {
  display: inline-flex; align-items: center; gap: 12px; flex-wrap: wrap;
  margin-bottom: 28px; justify-content: center;
}
.cpage .awards-hero-headline {
  font-family: var(--display); font-weight: 900;
  font-size: clamp(44px, 6.4vw, 88px);
  letter-spacing: -0.035em; line-height: 0.96;
  color: var(--depth);
  max-width: 1000px; margin: 0 auto 28px;
  text-align: center;
}
.cpage .awards-hero-headline .hl-line { display: block; }
.cpage .awards-hero-headline .period { color: var(--care); }
.cpage .awards-hero-lede {
  font-size: 17px; line-height: 1.55; color: var(--depth-soft);
  max-width: 600px; margin: 0 auto 32px;
  opacity: 0; transform: translateY(10px);
  transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
}
.cpage .is-in .awards-hero-lede { opacity: 1; transform: translateY(0); transition-delay: 0.24s; }
.cpage .awards-hero-lede strong { color: var(--depth); font-weight: 600; }

.cpage .awards-hero-cta-row {
  display: inline-flex; gap: 16px; align-items: center; flex-wrap: wrap; justify-content: center;
}
.cpage .ghost-link {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em;
  text-transform: uppercase; font-weight: 700; color: var(--depth);
  text-decoration: none; padding: 10px 4px;
  border-bottom: 1px solid var(--cream-border);
  transition: color 0.25s var(--ease), border-color 0.25s var(--ease);
}
.cpage .ghost-link:hover { color: var(--care); border-bottom-color: var(--care); }

.cpage .quote-pull {
  position: relative;
  background: var(--cream-card); border: 1px solid var(--cream-border);
  border-left: 3px solid var(--care); border-radius: 2px;
  padding: 48px 56px 40px; max-width: 880px; margin: 0 auto;
  text-align: left;
}
.cpage .quote-pull-mark {
  position: absolute; top: -10px; left: 28px;
  background: var(--cream); padding: 0 12px;
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.22em;
  text-transform: uppercase; font-weight: 700; color: var(--care);
}
.cpage .quote-pull-body {
  font-family: var(--serif); font-style: italic; font-weight: 400;
  font-size: clamp(22px, 2.8vw, 34px);
  line-height: 1.32; letter-spacing: -0.005em;
  color: var(--depth);
  margin: 0 0 28px;
}
.cpage .quote-pull-attr {
  display: inline-flex; align-items: center; gap: 12px;
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.18em;
  text-transform: uppercase; font-weight: 700; color: var(--depth-soft);
  margin-bottom: 14px;
}
.cpage .quote-pull-attr .rule { width: 32px; height: 1px; background: var(--care); }
.cpage .quote-pull-tag {
  font-family: var(--body); font-style: italic; font-size: 14.5px;
  color: var(--depth-soft); margin: 0;
}
@media (max-width: 720px) {
  .cpage .quote-pull { padding: 36px 28px 28px; }
}

.cpage .awards-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
}
.cpage .award-card {
  position: relative; display: flex; flex-direction: column;
  background: var(--cream-card); border: 1px solid var(--cream-border); border-radius: 2px;
  padding: 26px 24px 22px; text-decoration: none;
  min-height: 280px; overflow: hidden;
  transition: border-color 0.3s var(--ease), transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}
.cpage .award-card::before {
  content: ''; position: absolute; top: 0; left: 0;
  width: 0; height: 2px; background: var(--care);
  transition: width 0.5s var(--ease);
}
.cpage .award-card:hover {
  border-color: var(--depth-line); transform: translateY(-4px);
  box-shadow: 0 18px 36px -22px rgba(15,30,29,0.18);
}
.cpage .award-card:hover::before { width: 100%; }
.cpage .award-card-num {
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.20em;
  color: var(--care); font-weight: 700; margin-bottom: 14px;
}
.cpage .award-card-vertical {
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.18em;
  text-transform: uppercase; font-weight: 600; color: var(--purpose);
  margin-bottom: 10px;
}
.cpage .award-card-name {
  font-family: var(--display); font-weight: 900;
  font-size: 19px; letter-spacing: -0.02em; line-height: 1.18;
  color: var(--depth); margin: 0 0 12px;
}
.cpage .award-card-body {
  font-size: 12.5px; line-height: 1.5; color: var(--depth-soft);
  margin: 0 0 18px; flex: 1;
}
.cpage .award-card-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.16em;
  text-transform: uppercase; font-weight: 700; color: var(--care);
  border-top: 1px solid var(--cream-line); padding-top: 14px;
}
.cpage .award-card:hover .award-card-link svg { transform: translateX(3px); }
.cpage .award-card-link svg { transition: transform 0.3s var(--ease); }

@media (max-width: 1100px) {
  .cpage .awards-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .cpage .awards-grid { grid-template-columns: 1fr; }
}

/* DARK VARIANT - Section 03 */
.cpage .section.awards-eight {
  background: radial-gradient(ellipse 1100px 600px at 50% 0%, rgba(191, 70, 26, 0.06), transparent 60%), var(--depth);
}
.cpage .awards-eight .score-inner { padding: 0; }
.cpage .awards-eight .score-sub {
  text-align: center; max-width: 600px; margin: 0 auto 44px;
}
.cpage .awards-eight .award-card {
  background: rgba(248, 242, 229, 0.03);
  border: 1px solid var(--ink-line-strong);
}
.cpage .awards-eight .award-card:hover {
  border-color: rgba(248, 242, 229, 0.32);
  background: rgba(248, 242, 229, 0.05);
  box-shadow: 0 18px 36px -22px rgba(0, 0, 0, 0.5);
}
.cpage .awards-eight .award-card::before { background: var(--care-bright); }
.cpage .awards-eight .award-card-num { color: var(--care-bright); }
.cpage .awards-eight .award-card-vertical { color: var(--purpose-soft); }
.cpage .awards-eight .award-card-name { color: var(--cream); }
.cpage .awards-eight .award-card-body { color: var(--ink-medium); }
.cpage .awards-eight .award-card-link {
  color: var(--care-bright);
  border-top-color: var(--ink-line);
}

.cpage .judging-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  max-width: 1080px; margin: 0 auto;
}
.cpage .judging-card {
  position: relative;
  background: var(--cream-card); border: 1px solid var(--cream-border); border-radius: 2px;
  padding: 32px 28px 28px;
  transition: border-color 0.3s var(--ease), transform 0.3s var(--ease);
}
.cpage .judging-card::before {
  content: ''; position: absolute; top: 0; left: 0;
  width: 56px; height: 2px; background: var(--care);
}
.cpage .judging-card:hover { border-color: var(--depth-line); transform: translateY(-2px); }
.cpage .judging-card-tag {
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.22em;
  text-transform: uppercase; font-weight: 700; color: var(--purpose);
  margin-bottom: 18px;
}
.cpage .judging-card-headline {
  font-family: var(--display); font-weight: 900;
  font-size: 22px; letter-spacing: -0.02em; line-height: 1.15;
  color: var(--depth); margin: 0 0 12px;
}
.cpage .judging-card-body {
  font-size: 13.5px; line-height: 1.55; color: var(--depth-soft); margin: 0;
}

@media (max-width: 980px) {
  .cpage .judging-grid { grid-template-columns: 1fr; }
}
`;
