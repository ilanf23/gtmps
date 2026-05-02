import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { VerticalContent } from '@/content/verticals';
import { NAV_VERTICAL_LINKS } from '@/content/verticals';
import { INDUSTRY_ICONS } from '@/content/industryIcons';
import { INDUSTRY_STATS } from '@/content/industryStats';
import VerticalNav from './VerticalNav';
import VerticalFooter from './VerticalFooter';
import VerticalStickyCta from './VerticalStickyCta';

type Props = { vertical: VerticalContent };

const DEFAULT_CTA = 'Add Your Firm →';

export default function VerticalLanding({ vertical }: Props) {
  const ctaLabel = vertical.ctaLabel ?? DEFAULT_CTA;
  const sizingEyebrow = vertical.sizingEyebrow ?? 'B · INDUSTRY REALITY';
  useEffect(() => {
    document.title = `${vertical.name} · ${vertical.researchLabel ?? 'GTM Research'} · Mabbly`;

    const params = new URLSearchParams(window.location.search);
    const isCold = params.get('utm_source') === 'cold';
    const wantsDiagnostic = params.get('utm_anchor') === 'diagnostic';

    if (isCold && wantsDiagnostic) {
      try {
        sessionStorage.setItem('vertical_cohort', vertical.slug);
        sessionStorage.setItem('utm_vertical', params.get('utm_vertical') ?? '');
        (window as any).dataLayer = (window as any).dataLayer ?? [];
        (window as any).dataLayer.push({
          event: 'cold_email_landing',
          vertical: vertical.slug,
          utm_source: 'cold',
        });
      } catch {}
      setTimeout(() => {
        document.getElementById('add-your-firm')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 600);
    } else {
      // Defeat any browser scroll restoration — anchor at top of hero
      window.scrollTo(0, 0);
    }
  }, [vertical]);

  return (
    <>
      <style>{`
        .vl-root {
          background: #FBF8F4;
          color: #2A1A08;
          font-family: 'Inter Tight', system-ui, sans-serif;
          min-height: 100vh;
          padding-bottom: 140px;
        }
        .vl-eyebrow {
          font-family: 'DM Mono', 'Courier New', monospace;
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #B8933A;
          margin: 0 0 18px;
        }
        .vl-rule {
          width: 44px; height: 2px;
          background: linear-gradient(90deg, #B8933A, rgba(184,147,58,0.3));
          margin: 0 0 28px;
        }
        .vl-h2 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(36px, 5.4vw, 64px);
          font-weight: 500;
          line-height: 1.04;
          letter-spacing: -0.025em;
          color: #2A1A08;
          margin: 0 0 24px;
        }
        .vl-sub {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(18px, 1.7vw, 22px);
          font-weight: 300;
          color: rgba(42,26,8,0.65);
          line-height: 1.55;
          margin: 0 0 36px;
          max-width: 640px;
        }

        .vl-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #B8933A 0%, #D4AE48 100%);
          color: #0D1117;
          font-family: 'Inter Tight', sans-serif;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.04em;
          padding: 16px 32px;
          border-radius: 999px;
          text-decoration: none;
          transition: transform 180ms ease, box-shadow 180ms ease;
          box-shadow: 0 8px 24px -10px rgba(184,147,58,0.55);
        }
        .vl-cta-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 28px -10px rgba(184,147,58,0.7);
        }

        .vl-hero {
          padding: 144px 24px 96px;
          max-width: 1100px;
          margin: 0 auto;
          text-align: left;
        }
        @media (min-width: 768px) {
          .vl-hero { padding: 160px 40px 120px; }
        }
        .vl-hero-icon {
          color: #B8933A;
          width: 120px;
          height: 120px;
          margin: 0 0 24px;
          animation: vlHeroPulse 3s ease-in-out infinite;
          display: block;
        }
        @media (min-width: 768px) {
          .vl-hero-icon { width: 200px; height: 200px; }
        }
        @keyframes vlHeroPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @media (prefers-reduced-motion: reduce) {
          .vl-hero-icon { animation: none; }
        }
        .vl-hero-cohort {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          color: rgba(42,26,8,0.5);
          margin: 18px 0 0;
        }
        .vl-hero-cohort strong { color: #B8933A; font-weight: 600; }

        /* Industry sizing section (B · INDUSTRY REALITY) */
        .vl-sizing {
          padding: 80px 24px;
          background: #FBF8F4;
          border-top: 1px solid rgba(184,147,58,0.12);
        }
        @media (min-width: 768px) {
          .vl-sizing { padding: 112px 40px; }
        }
        .vl-sizing-inner { max-width: 1100px; margin: 0 auto; }
        .vl-sizing-grid {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (min-width: 1024px) {
          .vl-sizing-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; }
        }
        .vl-sizing-card {
          background: #fff;
          border: 1px solid rgba(184,147,58,0.18);
          border-radius: 4px;
          padding: 28px 22px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .vl-sizing-num {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(36px, 4.5vw, 56px);
          font-weight: 500;
          line-height: 1;
          color: #B8933A;
          letter-spacing: -0.025em;
        }
        .vl-sizing-label {
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          line-height: 1.4;
          color: #2A1A08;
          margin: 0;
        }
        .vl-sizing-source {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(42,26,8,0.5);
          margin: 4px 0 0;
        }

        .vl-reality {
          padding: 96px 24px;
          background: #F5EFE0;
          border-top: 1px solid rgba(184,147,58,0.12);
        }
        @media (min-width: 768px) {
          .vl-reality { padding: 128px 40px; }
        }
        .vl-reality-inner { max-width: 1100px; margin: 0 auto; }
        .vl-reality-list {
          margin: 32px 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          border-top: 1px solid rgba(184,147,58,0.18);
        }
        @media (min-width: 768px) {
          .vl-reality-list { grid-template-columns: 1fr 1fr; }
        }
        .vl-reality-item {
          padding: 24px 0;
          border-bottom: 1px solid rgba(184,147,58,0.18);
          font-family: 'Inter Tight', sans-serif;
          font-size: 17px;
          line-height: 1.5;
          color: #2A1A08;
        }
        @media (min-width: 768px) {
          .vl-reality-item:nth-child(odd) { padding-right: 32px; border-right: 1px solid rgba(184,147,58,0.18); }
          .vl-reality-item:nth-child(even) { padding-left: 32px; }
        }
        .vl-reality-source {
          display: block;
          margin-top: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(184,147,58,0.7);
        }

        .vl-pain {
          padding: 96px 24px;
          background: #FBF8F4;
        }
        @media (min-width: 768px) {
          .vl-pain { padding: 128px 40px; }
        }
        .vl-pain-inner { max-width: 1100px; margin: 0 auto; }
        .vl-pain-grid {
          margin-top: 48px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 768px) {
          .vl-pain-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
        }
        .vl-pain-card {
          background: #fff;
          border: 1px solid rgba(184,147,58,0.18);
          border-radius: 4px;
          padding: 28px 26px;
        }
        .vl-pain-card-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 24px;
          font-weight: 500;
          line-height: 1.2;
          color: #2A1A08;
          margin: 0 0 12px;
        }
        .vl-pain-card-body {
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          line-height: 1.55;
          color: rgba(42,26,8,0.7);
          margin: 0;
        }

        .vl-q {
          padding: 96px 24px;
          background: #1C1008;
          color: #F5EFE0;
        }
        @media (min-width: 768px) {
          .vl-q { padding: 144px 40px; }
        }
        .vl-q-inner { max-width: 900px; margin: 0 auto; }
        .vl-q-h {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(32px, 4.5vw, 52px);
          font-weight: 400;
          line-height: 1.08;
          letter-spacing: -0.02em;
          color: #F5EFE0;
          margin: 0 0 56px;
        }
        .vl-q-list {
          list-style: none;
          padding: 0;
          margin: 0;
          counter-reset: vlq;
        }
        .vl-q-item {
          counter-increment: vlq;
          padding: 24px 0;
          border-bottom: 1px solid rgba(184,147,58,0.18);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(20px, 2.4vw, 28px);
          font-weight: 400;
          line-height: 1.32;
          color: #F5EFE0;
          display: flex;
          gap: 20px;
          align-items: baseline;
        }
        .vl-q-item:before {
          content: counter(vlq, decimal-leading-zero);
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.16em;
          color: #B8933A;
          flex-shrink: 0;
          padding-top: 6px;
          min-width: 32px;
        }
        .vl-q-closing {
          margin-top: 48px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 16px;
          color: rgba(245,239,224,0.6);
          font-style: italic;
        }

        .vl-cases {
          padding: 96px 24px;
          background: #FBF8F4;
        }
        @media (min-width: 768px) {
          .vl-cases { padding: 128px 40px; }
        }
        .vl-cases-inner { max-width: 1100px; margin: 0 auto; }
        .vl-case {
          background: #fff;
          border: 1px solid rgba(184,147,58,0.2);
          border-radius: 4px;
          padding: 36px 32px;
          margin-bottom: 24px;
        }
        .vl-case:last-child { margin-bottom: 0; }
        .vl-case-firm {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 28px;
          font-weight: 500;
          color: #2A1A08;
          margin: 0 0 4px;
        }
        .vl-case-segment {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #B8933A;
          margin: 0 0 20px;
        }
        .vl-case-body {
          font-family: 'Inter Tight', sans-serif;
          font-size: 16px;
          line-height: 1.55;
          color: rgba(42,26,8,0.75);
          margin: 0 0 20px;
        }
        .vl-case-contact {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          color: rgba(42,26,8,0.55);
          margin: 0 0 20px;
        }
        .vl-case-quote {
          border-left: 2px solid #B8933A;
          padding: 8px 0 8px 20px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 20px;
          line-height: 1.4;
          font-style: italic;
          color: #2A1A08;
          margin: 0;
        }
        .vl-case-quote-author {
          display: block;
          margin-top: 10px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-style: normal;
          color: rgba(42,26,8,0.55);
        }
        .vl-cohort-card {
          background: #fff;
          border: 1px dashed rgba(184,147,58,0.35);
          border-radius: 4px;
          padding: 36px 32px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 20px;
          line-height: 1.5;
          color: #2A1A08;
        }

        .vl-diag {
          padding: 96px 24px;
          background: #F5EFE0;
          border-top: 1px solid rgba(184,147,58,0.18);
        }
        @media (min-width: 768px) {
          .vl-diag { padding: 144px 40px; }
        }
        .vl-diag-inner {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
        }
        .vl-diag-foot {
          margin-top: 18px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          color: rgba(42,26,8,0.5);
        }

        .vl-authors {
          padding: 96px 24px;
          background: #FBF8F4;
        }
        @media (min-width: 768px) {
          .vl-authors { padding: 128px 40px; }
        }
        .vl-authors-inner { max-width: 1100px; margin: 0 auto; }
        .vl-authors-grid {
          margin-top: 48px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        @media (min-width: 768px) {
          .vl-authors-grid { grid-template-columns: 1fr 1fr 1fr; gap: 32px; }
        }
        .vl-author {
          padding: 24px 0;
        }
        .vl-author-name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 24px;
          font-weight: 500;
          color: #2A1A08;
          margin: 0 0 4px;
        }
        .vl-author-role {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #B8933A;
          margin: 0 0 14px;
        }
        .vl-author-bio {
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          line-height: 1.55;
          color: rgba(42,26,8,0.7);
          margin: 0;
        }

        .vl-faq {
          padding: 96px 24px;
          background: #F5EFE0;
        }
        @media (min-width: 768px) {
          .vl-faq { padding: 128px 40px; }
        }
        .vl-faq-inner { max-width: 900px; margin: 0 auto; }
        .vl-faq-list {
          margin-top: 40px;
          border-top: 1px solid rgba(184,147,58,0.2);
        }
        .vl-faq-item {
          border-bottom: 1px solid rgba(184,147,58,0.2);
          padding: 24px 0;
        }
        .vl-faq-q {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px;
          font-weight: 500;
          color: #2A1A08;
          margin: 0 0 10px;
        }
        .vl-faq-a {
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: rgba(42,26,8,0.7);
          margin: 0;
        }

        .vl-other {
          padding: 80px 24px;
          background: #FBF8F4;
          border-top: 1px solid rgba(184,147,58,0.12);
        }
        .vl-other-inner { max-width: 1100px; margin: 0 auto; text-align: center; }
        .vl-other-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #B8933A;
          margin: 0 0 24px;
        }
        .vl-other-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }
        .vl-other-chip {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          letter-spacing: 0.04em;
          padding: 9px 18px;
          border: 1px solid rgba(184,147,58,0.35);
          border-radius: 999px;
          color: #2A1A08;
          text-decoration: none;
          background: transparent;
          transition: background 180ms, color 180ms, border-color 180ms;
        }
        .vl-other-chip:hover {
          background: #B8933A;
          color: #fff;
          border-color: #B8933A;
        }
      `}</style>

      <VerticalNav currentSlug={vertical.slug} />

      <main className="vl-root">
        <section className="vl-hero">
          {(() => {
            const Icon = INDUSTRY_ICONS[vertical.slug];
            return <Icon className="vl-hero-icon" strokeWidth={1.5} aria-hidden />;
          })()}
          <p className="vl-eyebrow">{vertical.industryEyebrow}</p>
          <div className="vl-rule" />
          <h1 className="vl-h2" style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
            {vertical.hero.headline}
          </h1>
          <p className="vl-sub">{vertical.hero.sub}</p>
          <a href="#add-your-firm" className="vl-cta-primary" data-cta="add-your-firm">{ctaLabel}</a>
          <p className="vl-hero-cohort">{vertical.hero.cohortLine}</p>
        </section>

        <section className="vl-sizing">
          <div className="vl-sizing-inner">
            <p className="vl-eyebrow">{sizingEyebrow}</p>
            <div className="vl-rule" />
            <h2 className="vl-h2">{vertical.name} in numbers.</h2>
            <div className="vl-sizing-grid">
              {INDUSTRY_STATS[vertical.slug].map((s, i) => (
                <div key={i} className="vl-sizing-card">
                  <span className="vl-sizing-num">{s.value}</span>
                  <p className="vl-sizing-label">{s.label}</p>
                  <p className="vl-sizing-source">{s.source}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="vl-reality">
          <div className="vl-reality-inner">
            <p className="vl-eyebrow">C · INDUSTRY DYNAMICS</p>
            <div className="vl-rule" />
            <h2 className="vl-h2">{vertical.reality.title}</h2>
            {vertical.deadZoneTooltip && (
              <aside
                aria-label="Definition: The Dead Zone"
                style={{
                  marginTop: 24,
                  padding: '20px 22px',
                  background: '#FBF8F4',
                  border: '1px solid rgba(184,147,58,0.28)',
                  borderLeft: '3px solid #B8933A',
                  borderRadius: 4,
                  maxWidth: 760,
                }}
              >
                <p
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#B8933A',
                    margin: '0 0 8px',
                  }}
                >
                  Definition · First use
                </p>
                <p
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: 'rgba(42,26,8,0.78)',
                    margin: 0,
                  }}
                >
                  {vertical.deadZoneTooltip}
                </p>
              </aside>
            )}
            <ul className="vl-reality-list">
              {vertical.reality.facts.map((f, i) => (
                <li key={i} className="vl-reality-item">
                  {f.text}
                  {f.source && <span className="vl-reality-source">[Source: {f.source}]</span>}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="vl-pain">
          <div className="vl-pain-inner">
            <p className="vl-eyebrow">03 · WHERE IT BREAKS</p>
            <div className="vl-rule" />
            <h2 className="vl-h2">{vertical.pain.title}</h2>
            <div className="vl-pain-grid">
              {vertical.pain.cards.map((c, i) => (
                <article key={i} className="vl-pain-card">
                  <h3 className="vl-pain-card-title">{c.title}</h3>
                  <p className="vl-pain-card-body">{c.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="vl-q">
          <div className="vl-q-inner">
            <p className="vl-eyebrow">04 · THE PAIN AUDIT</p>
            <div className="vl-rule" />
            <h2 className="vl-q-h">{vertical.questions.title}</h2>
            <ol className="vl-q-list">
              {vertical.questions.items.map((q, i) => (
                <li key={i} className="vl-q-item">{q}</li>
              ))}
            </ol>
            <p className="vl-q-closing">{vertical.questions.closing}</p>
          </div>
        </section>

        <section className="vl-cases">
          <div className="vl-cases-inner">
            <p className="vl-eyebrow">05 · {vertical.cases.mode === 'verified' ? 'CASES' : 'PEER FIRMS'}</p>
            <div className="vl-rule" />
            <h2 className="vl-h2">
              {vertical.cases.mode === 'verified'
                ? `Validated in ${vertical.shortLabel}.`
                : 'Validated in adjacent verticals.'}
            </h2>
            {vertical.cases.mode === 'verified' && vertical.cases.cases ? (
              vertical.cases.cases.map((c, i) => (
                <article key={i} className="vl-case">
                  <h3 className="vl-case-firm">{c.firmName}</h3>
                  <p className="vl-case-segment">{c.segment}</p>
                  <p className="vl-case-body">{c.body}</p>
                  <p className="vl-case-contact">{c.contact}</p>
                  <blockquote className="vl-case-quote">
                    "{c.quote.text}"
                    <span className="vl-case-quote-author">— {c.quote.author}</span>
                  </blockquote>
                </article>
              ))
            ) : (
              <div className="vl-cohort-card">{vertical.cases.cohortBody}</div>
            )}
          </div>
        </section>

        {vertical.orbitsBlock && (
          <section
            style={{
              padding: '96px 24px',
              background: '#1C1008',
              color: '#F5EFE0',
            }}
          >
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              <p className="vl-eyebrow" style={{ color: '#B8933A' }}>D · THE FIVE ORBITS</p>
              <div className="vl-rule" />
              <h2 className="vl-h2" style={{ color: '#F5EFE0' }}>{vertical.orbitsBlock.title}</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: '32px 0 0', borderTop: '1px solid rgba(184,147,58,0.2)' }}>
                {vertical.orbitsBlock.items.map((o) => (
                  <li
                    key={o.id}
                    style={{
                      padding: '22px 0',
                      borderBottom: '1px solid rgba(184,147,58,0.2)',
                      display: 'flex',
                      gap: 20,
                      alignItems: 'baseline',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 12,
                        letterSpacing: '0.16em',
                        color: '#B8933A',
                        flexShrink: 0,
                        minWidth: 32,
                      }}
                    >
                      {o.id}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 'clamp(20px, 2.2vw, 26px)',
                        fontWeight: 500,
                        color: '#F5EFE0',
                        flexShrink: 0,
                      }}
                    >
                      {o.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 15,
                        lineHeight: 1.55,
                        color: 'rgba(245,239,224,0.7)',
                        flex: '1 1 320px',
                      }}
                    >
                      {o.body}
                    </span>
                  </li>
                ))}
              </ul>

              {vertical.rrosTooltip && (
                <aside
                  aria-label="Definition: Relationship Revenue OS"
                  style={{
                    marginTop: 40,
                    padding: '24px 26px',
                    background: 'rgba(184,147,58,0.08)',
                    border: '1px solid rgba(184,147,58,0.3)',
                    borderLeft: '3px solid #B8933A',
                    borderRadius: 4,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: '#B8933A',
                      margin: '0 0 8px',
                    }}
                  >
                    Definition · First use
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 15,
                      lineHeight: 1.55,
                      color: 'rgba(245,239,224,0.85)',
                      margin: 0,
                    }}
                  >
                    {vertical.rrosTooltip}
                  </p>
                </aside>
              )}
            </div>
          </section>
        )}

        <section className="vl-diag" id="add-your-firm">
          <div className="vl-diag-inner">
            <p className="vl-eyebrow">{vertical.diagnosticEyebrow ?? '06 · THE GTM SCORE'}</p>
            <div className="vl-rule" style={{ margin: '0 auto 28px' }} />
            <h2 className="vl-h2" style={{ textAlign: 'center' }}>{vertical.diagnostic.title}</h2>
            <p className="vl-sub" style={{ margin: '0 auto 36px', textAlign: 'center' }}>
              {vertical.diagnostic.sub}
            </p>
            <a
              href={`/assess?vertical=${vertical.slug}`}
              className="vl-cta-primary"
              data-vertical={vertical.slug}
              data-cta="add-your-firm"
            >
              {ctaLabel}
            </a>
            <p className="vl-diag-foot">Free. 90 seconds to build. 10 minutes to read. Most decisions within 48 hours.</p>
          </div>
        </section>

        <section className="vl-authors">
          <div className="vl-authors-inner">
            <p className="vl-eyebrow">07 · WHO BUILT THIS</p>
            <div className="vl-rule" />
            <h2 className="vl-h2">Two practitioners. One academic.</h2>
            <div className="vl-authors-grid">
              <div className="vl-author">
                <h3 className="vl-author-name">Adam Fridman</h3>
                <p className="vl-author-role">CO-AUTHOR · MABBLY FOUNDER</p>
                <p className="vl-author-bio">
                  Founded Mabbly. 500+ practitioner interviews on GTM for Professional Services. Built the framework with operating partners, not consultants.
                </p>
              </div>
              <div className="vl-author">
                <h3 className="vl-author-name">Richard Ashbaugh</h3>
                <p className="vl-author-role">CO-AUTHOR · OPERATOR</p>
                <p className="vl-author-bio">
                  $1.2B at A.T. Kearney. $125M AArete revenue as CMO. The framework was forged in his books before it was written.
                </p>
              </div>
              <div className="vl-author">
                <h3 className="vl-author-name">Jonathan Copulsky</h3>
                <p className="vl-author-role">FOREWORD · KELLOGG · DELOITTE</p>
                <p className="vl-author-bio">
                  Northwestern Kellogg faculty. Former Deloitte CMO. Validated the research methodology and wrote the foreword.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="vl-faq">
          <div className="vl-faq-inner">
            <p className="vl-eyebrow">08 · FAQ</p>
            <div className="vl-rule" />
            <h2 className="vl-h2">{vertical.shortLabel} firm questions.</h2>
            <div className="vl-faq-list">
              {vertical.faq.map((f, i) => (
                <div key={i} className="vl-faq-item">
                  <h3 className="vl-faq-q">{f.q}</h3>
                  <p className="vl-faq-a">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="vl-diag" style={{ background: '#1C1008', borderTop: 'none' }}>
          <div className="vl-diag-inner">
            <p className="vl-eyebrow" style={{ color: '#B8933A' }}>09 · BEGIN</p>
            <div className="vl-rule" style={{ margin: '0 auto 28px' }} />
            <h2 className="vl-h2" style={{ color: '#F5EFE0', textAlign: 'center' }}>
              {vertical.hero.headline}
            </h2>
            <a
              href={`/assess?vertical=${vertical.slug}`}
              className="vl-cta-primary"
              data-vertical={vertical.slug}
              data-cta="add-your-firm"
            >
              {ctaLabel}
            </a>
            <p className="vl-diag-foot" style={{ color: 'rgba(245,239,224,0.5)' }}>
              {vertical.hero.cohortLine}
            </p>
          </div>
        </section>

        <section className="vl-other">
          <div className="vl-other-inner">
            <p className="vl-other-eyebrow">FIND YOUR INDUSTRY</p>
            <div className="vl-other-row">
              {NAV_VERTICAL_LINKS.filter((v) => v.slug !== vertical.slug).map((v) => (
                <Link key={v.slug} to={`/${v.slug}`} className="vl-other-chip">
                  {v.label.replace(/ Firms?$| & .+$/, '').trim() || v.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <VerticalFooter />
      <VerticalStickyCta label={ctaLabel} vertical={vertical.slug} />
    </>
  );
}
