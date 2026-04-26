import { useEffect, useRef, useState } from 'react';

export default function DeadZone() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [crmSize, setCrmSize] = useState(500);
  const [displayResult, setDisplayResult] = useState(0);
  const resultRafRef = useRef<number>(0);
  const animFromRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTriggered(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const target = Math.round((Number.isFinite(crmSize) ? crmSize : 0) * 0.7);
    const from = animFromRef.current;
    const start = performance.now();
    const duration = 600;

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (target - from) * eased);
      setDisplayResult(value);
      if (t < 1) {
        resultRafRef.current = requestAnimationFrame(step);
      } else {
        animFromRef.current = target;
      }
    };

    cancelAnimationFrame(resultRafRef.current);
    resultRafRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(resultRafRef.current);
  }, [crmSize, triggered]);

  return (
    <section
      ref={sectionRef}
      id="dead-zone"
      className="relative px-6 md:px-10"
      style={{
        background: '#120D05',
        paddingTop: 144,
        paddingBottom: 144,
      }}
    >
      <style>{`
        .dz-content {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 56px;
        }
        .dz-eyebrow {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #B8933A;
          margin: 0;
          font-weight: 500;
        }
        .dz-rule {
          height: 2px;
          background: #B8933A;
          margin: 16px 0 28px;
          width: 0;
        }
        .dz-rule.dz-on { animation: growRule 0.8s ease forwards; }
        .dz-headline {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(56px, 9vw, 112px);
          font-weight: 500;
          color: #F5EFE0;
          line-height: 0.98;
          letter-spacing: -0.04em;
          margin: 0 0 20px;
        }
        .dz-subhead {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(18px, 2vw, 24px);
          color: rgba(245,239,224,0.55);
          line-height: 1.5;
          margin: 0;
          font-weight: 300;
          max-width: 780px;
        }
        .dz-graph {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(184,147,58,0.18);
          border-radius: 4px;
          padding: 40px 36px;
        }
        .dz-graph-title {
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(245,239,224,0.45);
          margin: 0 0 28px;
          font-weight: 500;
        }
        .dz-bar {
          width: 100%;
          height: 28px;
          background: rgba(255,255,255,0.04);
          border-radius: 3px;
          overflow: hidden;
          display: flex;
          margin-bottom: 22px;
        }
        .dz-bar-seg { width: 0; height: 100%; }
        .dz-bar-dead {
          --target-w: 70%;
          background: rgba(245,239,224,0.18);
          border-radius: 3px 0 0 3px;
        }
        .dz-bar-active {
          --target-w: 30%;
          background: linear-gradient(90deg, #B8933A, #D4AE48);
          border-radius: 0 3px 3px 0;
        }
        .dz-bar-dead.dz-on {
          animation: barFill 1.4s cubic-bezier(0.22,1,0.36,1) 0.3s forwards;
        }
        .dz-bar-active.dz-on {
          animation: barFill 1.4s cubic-bezier(0.22,1,0.36,1) 0.5s forwards;
        }
        .dz-bar-labels {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .dz-bar-label {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .dz-bar-pct {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 600;
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .dz-bar-pct-dead { color: rgba(245,239,224,0.55); }
        .dz-bar-pct-active { color: #B8933A; text-align: right; }
        .dz-bar-tag {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .dz-bar-tag-dead { color: rgba(245,239,224,0.4); }
        .dz-bar-tag-active { color: #B8933A; text-align: right; }
        .dz-body {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 880px;
        }
        .dz-body p {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(18px, 1.7vw, 22px);
          line-height: 1.6;
          color: rgba(245,239,224,0.75);
          margin: 0;
          font-weight: 300;
        }
        .dz-finale {
          border-top: 1px solid rgba(184,147,58,0.2);
          padding-top: 40px;
        }
        .dz-finale-line {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(28px, 3.6vw, 44px);
          line-height: 1.15;
          margin: 0;
          font-weight: 400;
          letter-spacing: -0.02em;
        }
        .dz-finale-line-1 { color: #B8933A; margin-bottom: 8px; }
        .dz-finale-line-2 { color: #F5EFE0; }
        .dz-quote {
          background: rgba(184,147,58,0.05);
          border-left: 4px solid #B8933A;
          border-radius: 0 4px 4px 0;
          padding: 32px 36px;
        }
        .dz-quote-text {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(20px, 2vw, 26px);
          line-height: 1.5;
          color: rgba(245,239,224,0.9);
          margin: 0 0 18px;
          font-weight: 300;
          letter-spacing: -0.01em;
        }
        .dz-quote-attr {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #B8933A;
          font-weight: 500;
          margin: 0;
        }
        .dz-calc {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(184,147,58,0.18);
          border-radius: 4px;
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .dz-calc-label {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(245,239,224,0.45);
          margin: 0;
          font-weight: 500;
        }
        .dz-calc-row {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }
        .dz-calc-input {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(184,147,58,0.3);
          border-radius: 3px;
          padding: 14px 18px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 28px;
          font-weight: 500;
          color: #F5EFE0;
          width: 160px;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .dz-calc-input:focus { border-color: rgba(184,147,58,0.7); }
        .dz-calc-sep {
          font-family: 'Inter Tight', sans-serif;
          font-size: 16px;
          color: rgba(245,239,224,0.45);
          font-weight: 300;
        }
        .dz-calc-result-block {
          display: flex;
          align-items: baseline;
          gap: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .dz-calc-num {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(48px, 7vw, 88px);
          font-weight: 600;
          color: #B8933A;
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .dz-calc-unit {
          font-family: 'Inter Tight', sans-serif;
          font-size: 16px;
          color: rgba(245,239,224,0.55);
          font-weight: 300;
        }
        .dz-calc-note {
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: rgba(245,239,224,0.4);
          margin: 0;
          font-weight: 300;
        }
      `}</style>

      <div className="dz-content">
        <div>
          <p className="dz-eyebrow">03 · The Problem</p>
          <div className={`dz-rule ${triggered ? 'dz-on' : ''}`} style={{ width: 44 }} />
          <h2 className="dz-headline">The Dead Zone</h2>
          <p className="dz-subhead">
            Between 60% and 80% of the contacts in your CRM are here right now.
          </p>
        </div>

        <div className="dz-graph">
          <p className="dz-graph-title">CRM Composition · Industry Benchmark</p>
          <div className="dz-bar" aria-hidden="true">
            <div className={`dz-bar-seg dz-bar-dead ${triggered ? 'dz-on' : ''}`} />
            <div className={`dz-bar-seg dz-bar-active ${triggered ? 'dz-on' : ''}`} />
          </div>
          <div className="dz-bar-labels">
            <div className="dz-bar-label">
              <span className="dz-bar-pct dz-bar-pct-dead">~70%</span>
              <span className="dz-bar-tag dz-bar-tag-dead">Dead Zone</span>
            </div>
            <div className="dz-bar-label">
              <span className="dz-bar-pct dz-bar-pct-active">~30%</span>
              <span className="dz-bar-tag dz-bar-tag-active">Active</span>
            </div>
          </div>
        </div>

        <div className="dz-body">
          <p>
            The Dead Zone is not dormant contacts. It is not lapsed leads. It is the predictable
            result of applying the wrong GTM definition to a relationship business.
          </p>
          <p>
            These are not strangers. These are people who knew you, worked with you, evaluated
            you, or were introduced to you at some point in the past. Every one of them
            represents a relationship that was started but never maintained.
          </p>
        </div>

        <div className="dz-finale">
          <p className="dz-finale-line dz-finale-line-1">Your next client already knows you.</p>
          <p className="dz-finale-line dz-finale-line-2">You have no system to reach them.</p>
        </div>

        <div className="dz-quote">
          <p className="dz-quote-text">
            "The Dead Zone is not a CRM problem. It is an avoidance problem. The contacts are
            there. The trust is there. The only thing missing is the willingness to pick up the
            phone."
          </p>
          <p className="dz-quote-attr">Richard Ashbaugh · Chapter 7 of the manuscript</p>
        </div>

        <div className="dz-calc">
          <p className="dz-calc-label">Your Dead Zone estimate</p>
          <div className="dz-calc-row">
            <input
              type="number"
              className="dz-calc-input"
              value={crmSize}
              min={0}
              onChange={(e) => {
                const v = Number(e.target.value);
                setCrmSize(Number.isFinite(v) && v >= 0 ? v : 0);
              }}
              aria-label="Number of contacts in your CRM"
            />
            <span className="dz-calc-sep">contacts in your CRM</span>
          </div>
          <div className="dz-calc-result-block">
            <span className="dz-calc-num">{displayResult.toLocaleString()}</span>
            <span className="dz-calc-unit">are likely in your Dead Zone</span>
          </div>
          <p className="dz-calc-note">
            Based on industry average of 60–80% dormancy. Build your MAP to get a precise
            estimate benchmarked against peer firms.
          </p>
        </div>
      </div>
    </section>
  );
}
