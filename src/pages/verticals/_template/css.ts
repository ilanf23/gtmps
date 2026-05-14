export const CSS = `
.cpage {
  --depth: #0F1E1D;
  --depth-soft: #2C3A38;
  --depth-deep: #07110F;
  --depth-line: rgba(15, 30, 29, 0.10);
  --depth-line-soft: rgba(15, 30, 29, 0.06);
  --care: #BF461A;
  --care-bright: #E5582B;
  --care-tint: rgba(191, 70, 26, 0.06);
  --energy: #FFBA1A;
  --purpose: #A79014;
  --purpose-soft: #C9AC2A;
  --purpose-tint: rgba(167, 144, 20, 0.06);
  --cream: #F8F2E5;
  --cream-card: #FCFAF4;
  --cream-paper: #F4ECDB;
  --cream-border: #E5E0CF;
  --cream-line: #ECE6D5;
  --cream-line-soft: #F2EDDD;
  --muted: #6B7370;
  --muted-soft: #9AA09C;
  --ink-line: rgba(248, 242, 229, 0.10);
  --ink-line-strong: rgba(248, 242, 229, 0.18);
  --ink-soft: rgba(248, 242, 229, 0.55);
  --ink-medium: rgba(248, 242, 229, 0.72);
  --display: 'Mabbly Repro', 'Inter Tight', 'Arial Black', 'Helvetica Neue', sans-serif;
  --mono: 'Mabbly Repro Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace;
  --body: 'Inter', 'Inter Tight', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --serif: 'Cormorant Garamond', 'Georgia', 'Times New Roman', serif;
  --ease: cubic-bezier(0.13, 0.28, 0.3, 1);
  --ease-soft: cubic-bezier(0.22, 1, 0.36, 1);

  background: var(--cream);
  color: var(--depth);
  font-family: var(--body);
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  zoom: 1.18;
}
.cpage *, .cpage *::before, .cpage *::after { box-sizing: border-box; }

.cpage .container { max-width: 1180px; margin: 0 auto; padding: 0 32px; }
@media (max-width: 600px) { .cpage .container { padding: 0 22px; } }

.cpage .section { padding: 96px 0; border-top: 1px solid var(--cream-line); background: var(--cream); position: relative; }
.cpage .section:first-of-type { border-top: 0; }
.cpage .section.dark { background: var(--depth); color: var(--cream); border-top: 1px solid var(--depth); }
.cpage .section.dark + .section, .cpage .section + .section.dark { border-top: 1px solid var(--depth); }
@media (max-width: 720px) { .cpage .section { padding: 64px 0; } }

.cpage .section-head { text-align: center; margin: 0 auto 44px; max-width: 920px; }
.cpage .meta-row {
  display: inline-flex; align-items: center; gap: 10px;
  margin-bottom: 16px;
  opacity: 0; transform: translateY(8px);
  transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
}
.cpage .is-in .meta-row { opacity: 1; transform: translateY(0); }
.cpage .meta-row .rule { width: 22px; height: 1px; background: var(--cream-border); }
.cpage .section.dark .meta-row .rule { background: var(--ink-line-strong); }
.cpage .meta-tag {
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.24em;
  text-transform: uppercase; font-weight: 700; color: var(--purpose);
  display: inline-flex; align-items: center;
}
.cpage .section.dark .meta-tag { color: var(--purpose-soft); }
.cpage .meta-tag .num { color: var(--depth); }
.cpage .section.dark .meta-tag .num { color: var(--cream); }
.cpage .meta-tag .pip { color: var(--care); margin: 0 4px; }
.cpage .section.dark .meta-tag .pip { color: var(--care-bright); }

.cpage .section-headline {
  font-family: var(--display); font-weight: 900;
  font-size: clamp(34px, 4.4vw, 52px);
  letter-spacing: -0.03em; line-height: 1.0; color: var(--depth);
  margin: 0 0 16px;
}
.cpage .section-headline .period { color: var(--care); }
.cpage .section.dark .section-headline .period, .cpage .score-headline .period, .cpage .begin-headline .period { color: var(--care); }
.cpage .section-sub {
  font-size: 14.5px; line-height: 1.55; color: var(--muted);
  max-width: 600px; margin: 0 auto;
}
.cpage .section-sub strong { color: var(--depth); font-weight: 600; }

.cpage .reveal { opacity: 0; transform: translateY(10px); transition: opacity 0.7s var(--ease), transform 0.7s var(--ease); }
.cpage .is-in .reveal { opacity: 1; transform: translateY(0); }
.cpage .is-in .reveal.d1 { transition-delay: 0.08s; }
.cpage .is-in .reveal.d2 { transition-delay: 0.16s; }
.cpage .is-in .reveal.d3 { transition-delay: 0.24s; }
.cpage .is-in .reveal.d4 { transition-delay: 0.32s; }
.cpage .is-in .reveal.d5 { transition-delay: 0.40s; }
.cpage .is-in .reveal.d6 { transition-delay: 0.48s; }
.cpage .is-in .reveal.d7 { transition-delay: 0.56s; }
.cpage .is-in .reveal.d8 { transition-delay: 0.80s; }

.cpage .section-hero { padding: 72px 0 110px; border-top: 0; }
.cpage .hero-grid { display: grid; grid-template-columns: 0.85fr 1fr; gap: 64px; align-items: center; }
.cpage .hero-eyebrow { display: inline-flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 22px; }
.cpage .eyebrow-rule { width: 22px; height: 1px; background: var(--purpose); }
.cpage .eyebrow-text { font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 700; color: var(--purpose); }
.cpage .vol-tag { font-family: var(--mono); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--depth); background: var(--cream-card); border: 1px solid var(--cream-border); border-radius: 12px; padding: 3px 8px; font-weight: 700; }
.cpage .hero-headline {
  font-family: var(--display); font-weight: 900;
  font-size: clamp(40px, 5.4vw, 70px);
  letter-spacing: -0.035em; line-height: 0.96;
  color: var(--depth); margin: 0 0 24px;
}
.cpage .hl-line { display: block; }
.cpage .hl-line .period { color: var(--care); }
.cpage .word-mask { display: inline-block; overflow: hidden; vertical-align: bottom; }
.cpage .word-inner { display: inline-block; transform: translateY(105%); transition: transform 0.85s var(--ease); }
.cpage .is-in .word-inner { transform: translateY(0); }
.cpage .is-in .hl-line:nth-child(1) .word-mask:nth-child(1) .word-inner { transition-delay: 0.20s; }
.cpage .is-in .hl-line:nth-child(1) .word-mask:nth-child(2) .word-inner { transition-delay: 0.27s; }
.cpage .is-in .hl-line:nth-child(1) .word-mask:nth-child(3) .word-inner { transition-delay: 0.34s; }
.cpage .is-in .hl-line:nth-child(2) .word-mask:nth-child(1) .word-inner { transition-delay: 0.41s; }
.cpage .is-in .hl-line:nth-child(2) .word-mask:nth-child(2) .word-inner { transition-delay: 0.48s; }
.cpage .is-in .hl-line:nth-child(2) .word-mask:nth-child(3) .word-inner { transition-delay: 0.55s; }
.cpage .is-in .hl-line:nth-child(2) .word-mask:nth-child(4) .word-inner { transition-delay: 0.62s; }
.cpage .is-in .hl-line:nth-child(2) .word-mask:nth-child(5) .word-inner { transition-delay: 0.69s; }

.cpage .hero-lede { font-size: 16px; line-height: 1.55; color: var(--depth-soft); max-width: 540px; margin: 0 0 22px; }
.cpage .hero-lede strong { color: var(--depth); font-weight: 600; }
.cpage .hero-form { display: flex; gap: 8px; max-width: 560px; margin-bottom: 18px; flex-wrap: wrap; }
.cpage .hero-form input {
  flex: 1; min-width: 220px;
  padding: 12px 16px; background: #fff;
  border: 1px solid var(--cream-border); border-radius: 24px;
  font-family: var(--body); font-size: 14px; color: var(--depth);
  outline: none; transition: border-color 0.25s var(--ease), box-shadow 0.25s var(--ease);
}
.cpage .hero-form input:focus { border-color: var(--care); box-shadow: 0 0 0 3px rgba(191, 70, 26, 0.10); }
.cpage .trust-line {
  font-family: var(--mono); font-size: 12px; letter-spacing: 0.10em;
  text-transform: uppercase; font-weight: 600;
  color: var(--depth-soft); line-height: 1.6;
  max-width: 520px;
}
.cpage .trust-line .dot { color: var(--care); margin: 0 6px; }
.cpage .trust-line.dark { color: var(--ink-medium); }
.cpage .trust-line.dark .dot { color: var(--care-bright); }

.cpage .hero-right { display: flex; justify-content: center; }
.cpage .profile-stage { position: relative; width: 100%; max-width: 624px; }
.cpage .profile-stage::before {
  content: ''; position: absolute; inset: -6% -8% -10%;
  background:
    radial-gradient(ellipse 60% 60% at 50% 50%, var(--purpose-tint), transparent 70%),
    radial-gradient(ellipse 60% 30% at 50% 92%, rgba(15,30,29,0.08), transparent 70%);
  pointer-events: none; opacity: 0;
  transition: opacity 1.0s var(--ease); transition-delay: 0.30s;
  z-index: 0;
}
.cpage .is-in .profile-stage::before { opacity: 1; }
.cpage .profile-card {
  position: relative; z-index: 1;
  background: var(--cream-card);
  border: 1px solid var(--cream-border);
  border-radius: 2px;
  padding: 28px 32px 26px;
  box-shadow: 0 1px 0 rgba(15,30,29,0.04), 0 18px 36px -20px rgba(15,30,29,0.16), 0 36px 72px -40px rgba(15,30,29,0.14);
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.9s var(--ease), transform 0.9s var(--ease);
  transition-delay: 0.20s;
}
.cpage .is-in .profile-card { opacity: 1; transform: translateY(0); }
.cpage .profile-card::before { content: ''; position: absolute; top: 0; left: 0; width: 64px; height: 2px; background: var(--care); }

.cpage .profile-eyebrow { display: flex; justify-content: space-between; align-items: center; padding-bottom: 14px; border-bottom: 1px solid var(--cream-border); margin-bottom: 18px; }
.cpage .profile-eyebrow-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 700; color: var(--depth); }
.cpage .profile-eyebrow-label .pip { color: var(--care); margin: 0 4px; }
.cpage .profile-eyebrow-status { font-family: var(--mono); font-size: 8.5px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 700; color: var(--muted); display: inline-flex; align-items: center; gap: 8px; }
.cpage .live-dot { width: 5px; height: 5px; background: var(--depth); border-radius: 50%; position: relative; display: inline-block; }
.cpage .live-dot::after { content: ''; position: absolute; inset: 0; border-radius: 50%; background: var(--depth); animation: livePulse 2.4s ease-out infinite; }
@keyframes livePulse { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(2.4); opacity: 0; } }

.cpage .profile-firm-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
.cpage .profile-firm-label { font-family: var(--mono); font-size: 8.5px; letter-spacing: 0.20em; text-transform: uppercase; font-weight: 600; color: var(--muted); }
.cpage .profile-firm-name { font-family: var(--mono); font-size: 10px; letter-spacing: 0.10em; text-transform: uppercase; font-weight: 700; color: var(--depth); }

.cpage .profile-score-row { display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: baseline; padding-bottom: 18px; border-bottom: 1px solid var(--cream-line); margin-bottom: 18px; }
.cpage .profile-score { font-family: var(--display); font-weight: 900; font-size: 64px; letter-spacing: -0.045em; line-height: 0.9; color: var(--depth); }
.cpage .profile-score .denom { font-size: 0.42em; color: var(--muted); letter-spacing: -0.02em; }
.cpage .profile-score-tier { font-family: var(--mono); font-size: 9px; letter-spacing: 0.20em; text-transform: uppercase; font-weight: 700; color: var(--care); margin-bottom: 6px; }
.cpage .profile-score-msg { font-size: 11.5px; line-height: 1.4; color: var(--depth-soft); }
.cpage .profile-score-msg strong { color: var(--depth); font-weight: 600; }

.cpage .profile-bars { display: flex; flex-direction: column; gap: 14px; }
.cpage .profile-bar-row { display: flex; flex-direction: column; gap: 6px; }
.cpage .profile-bar-label { display: flex; justify-content: space-between; align-items: baseline; }
.cpage .profile-bar-label > span:first-child { font-family: var(--mono); font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; color: var(--depth); }
.cpage .profile-bar-pct { font-family: var(--display); font-weight: 900; font-size: 13px; letter-spacing: -0.02em; color: var(--depth); }
.cpage .profile-bar-track { position: relative; height: 6px; background: var(--cream-line); border-radius: 3px; overflow: visible; }
.cpage .profile-bar-fill { background: var(--care); border-radius: 3px; height: 100%; width: 0; transition: width 1.4s var(--ease); transition-delay: 0.50s; }
.cpage .is-in .profile-bar-fill { width: var(--w); }
.cpage .profile-bar-mark { position: absolute; top: -3px; bottom: -3px; width: 1.5px; background: var(--depth); transform: translateX(-50%); opacity: 0; transition: opacity 0.5s var(--ease); transition-delay: 1.50s; }
.cpage .is-in .profile-bar-mark { opacity: 1; }
.cpage .profile-bar-mark::after { content: 'PEER'; position: absolute; top: 16px; left: 50%; transform: translateX(-50%); font-family: var(--mono); font-size: 7px; letter-spacing: 0.16em; color: var(--muted-soft); font-weight: 700; }

.cpage .profile-foot { margin-top: 22px; padding-top: 14px; border-top: 1px solid var(--cream-border); display: flex; justify-content: space-between; align-items: center; font-family: var(--mono); font-size: 8.5px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; color: var(--muted); }
.cpage .profile-foot-doc { color: var(--depth); }
.cpage .profile-foot-conf { display: inline-flex; align-items: center; gap: 5px; }

.cpage .numbers-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: stretch; }
.cpage .hero-stat {
  position: relative; overflow: hidden; height: 100%;
  background: var(--cream-card); border: 1px solid var(--cream-border); border-radius: 2px;
  padding: 36px 40px 32px;
}
.cpage .hero-stat::before { content: ''; position: absolute; top: 0; left: 0; width: 64px; height: 2px; background: var(--care); }
.cpage .hero-stat-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 700; color: var(--purpose); margin-bottom: 14px; }
.cpage .hero-stat-num { font-family: var(--display); font-weight: 900; font-size: clamp(64px, 8.4vw, 110px); letter-spacing: -0.05em; line-height: 0.88; color: var(--depth); margin-bottom: 18px; }
.cpage .hero-stat-num .unit { font-size: 0.5em; letter-spacing: 0; vertical-align: 0.22em; margin-left: 0.12em; display: inline-block; }
.cpage .hero-stat-sub { font-size: 14px; line-height: 1.55; color: var(--depth-soft); max-width: 380px; margin-bottom: 18px; }
.cpage .hero-stat-sub strong { color: var(--depth); font-weight: 600; }
.cpage .hero-stat-bar { height: 4px; background: var(--cream-line); border-radius: 2px; overflow: hidden; margin-bottom: 14px; }
.cpage .hero-stat-fill { height: 100%; background: var(--care); border-radius: 2px; width: 0; transition: width 1.6s var(--ease); transition-delay: 0.30s; }
.cpage .is-in .hero-stat-fill { width: 78%; }
.cpage .hero-stat-source { font-family: var(--mono); font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; color: var(--muted-soft); }

.cpage .small-stats { display: flex; flex-direction: column; gap: 12px; height: 100%; }
.cpage .small-stat {
  flex: 1;
  display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center;
  background: var(--cream-card); border: 1px solid var(--cream-border); border-radius: 2px;
  padding: 20px 22px;
  transition: border-color 0.3s var(--ease), transform 0.3s var(--ease);
}
.cpage .small-stat:hover { border-color: var(--depth-line); transform: translateX(2px); }
.cpage .small-stat-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; color: var(--muted); margin-bottom: 6px; }
.cpage .small-stat-num { font-family: var(--display); font-weight: 900; font-size: 30px; letter-spacing: -0.03em; line-height: 0.95; color: var(--depth); margin-bottom: 6px; }
.cpage .small-stat-source { font-family: var(--mono); font-size: 8px; letter-spacing: 0.12em; color: var(--muted-soft); text-transform: uppercase; font-weight: 600; }

.cpage .definition-pull {
  position: relative;
  background: var(--cream-card); border: 1px solid var(--cream-border);
  border-left: 3px solid var(--care); border-radius: 2px;
  padding: 30px 36px 28px; margin-bottom: 56px;
}
.cpage .definition-pull-mark {
  position: absolute; top: -10px; left: 28px;
  background: var(--cream); padding: 0 12px;
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.22em;
  text-transform: uppercase; font-weight: 700; color: var(--care);
}
.cpage .definition-pull-term { font-family: var(--display); font-weight: 900; font-size: clamp(26px, 3vw, 32px); letter-spacing: -0.025em; line-height: 1.0; color: var(--depth); margin-bottom: 12px; }
.cpage .definition-pull-body { font-family: var(--serif); font-style: italic; font-size: clamp(15px, 1.4vw, 16.5px); line-height: 1.5; color: var(--depth-soft); max-width: 720px; margin: 0; }

.cpage .reality-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 12px; }
.cpage .reality-card {
  background: var(--cream-card); border: 1px solid var(--cream-border); border-radius: 2px;
  padding: 18px 18px 14px;
  transition: border-color 0.3s var(--ease), transform 0.3s var(--ease);
}
.cpage .reality-card:hover { border-color: var(--depth-line); transform: translateY(-2px); }
.cpage .reality-card-num { font-family: var(--mono); font-size: 9px; letter-spacing: 0.18em; color: var(--care); font-weight: 700; margin-bottom: 8px; }
.cpage .reality-card-stat { font-family: var(--display); font-weight: 900; font-size: 28px; letter-spacing: -0.03em; line-height: 1.0; color: var(--depth); margin-bottom: 8px; }
.cpage .reality-card-stat .unit-sm { font-size: 0.5em; letter-spacing: 0; margin-left: 4px; }
.cpage .reality-card-text { font-size: 11.5px; line-height: 1.45; color: var(--depth-soft); margin-bottom: 10px; }
.cpage .reality-card-source { font-family: var(--mono); font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted-soft); font-weight: 600; border-top: 1px solid var(--cream-line); padding-top: 8px; }

@media (max-width: 980px) {
  .cpage .reality-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .cpage .reality-grid { grid-template-columns: 1fr; }
}

.cpage .break-stack { display: flex; flex-direction: column; gap: 16px; }
.cpage .break-block {
  position: relative;
  background: var(--cream-card); border: 1px solid var(--cream-border); border-radius: 2px;
  display: grid; grid-template-columns: 260px 1fr; gap: 36px;
  align-items: center; padding: 28px 32px;
  overflow: hidden;
}
.cpage .break-chart { display: flex; align-items: center; justify-content: center; }
.cpage .break-chart svg { width: 100%; height: auto; max-width: 240px; }
.cpage .break-num-row { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.cpage .break-num-rule { width: 24px; height: 1px; background: var(--care); opacity: 0.6; }
.cpage .break-num { font-family: var(--mono); font-size: 10px; letter-spacing: 0.20em; color: var(--care); font-weight: 700; text-transform: uppercase; }
.cpage .break-headline { font-family: var(--display); font-weight: 900; font-size: clamp(20px, 2vw, 24px); letter-spacing: -0.025em; line-height: 1.15; color: var(--depth); margin: 0 0 8px; }
.cpage .break-body { font-size: 13.5px; line-height: 1.5; color: var(--depth-soft); margin: 0; }
.cpage .break-body strong { color: var(--depth); font-weight: 600; }

@media (max-width: 980px) {
  .cpage .break-block { grid-template-columns: 180px 1fr; gap: 24px; padding: 22px; }
  .cpage .break-chart svg { max-width: 180px; }
}

.cpage .audit-card {
  max-width: 820px; margin: 0 auto;
  background: var(--cream-card); border: 1px solid var(--cream-border); border-radius: 2px;
  padding: 28px 32px 24px;
}
.cpage .audit-tally { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 18px; border-bottom: 1px solid var(--cream-border); margin-bottom: 18px; }
.cpage .audit-tally-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 700; color: var(--depth); }
.cpage .audit-tally-count { font-family: var(--display); font-weight: 900; font-size: 30px; letter-spacing: -0.03em; line-height: 1.0; color: var(--depth); transition: color 0.3s var(--ease); }
.cpage .audit-tally-count.alert { color: var(--care); }
.cpage .audit-tally-count .of { color: var(--muted); font-size: 14px; letter-spacing: 0; margin-left: 4px; font-weight: 700; }

.cpage .audit-question-row {
  display: grid; grid-template-columns: 24px 1fr auto; gap: 16px; align-items: center;
  padding: 14px 0;
  border-bottom: 1px dashed var(--cream-line);
  transition: background 0.25s var(--ease), padding-left 0.25s var(--ease);
}
.cpage .audit-question-row:last-of-type { border-bottom: 0; }
.cpage .audit-question-row:hover { background: rgba(252,250,244,0.5); padding-left: 4px; }
.cpage .audit-q-num { font-family: var(--mono); font-size: 10px; letter-spacing: 0.06em; color: var(--care); font-weight: 700; }
.cpage .audit-q-text { font-size: 13.5px; line-height: 1.4; color: var(--depth); }
.cpage .audit-toggle { display: inline-flex; gap: 4px; background: var(--cream); border: 1px solid var(--cream-border); border-radius: 16px; padding: 2px; }
.cpage .audit-toggle button {
  padding: 5px 12px; border-radius: 14px; background: transparent; border: 0; cursor: pointer;
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; color: var(--muted);
  transition: color 0.2s var(--ease), background 0.2s var(--ease);
}
.cpage .audit-toggle button:hover { color: var(--depth); }
.cpage .audit-toggle button.active.yes { background: var(--care); color: var(--cream); }
.cpage .audit-toggle button.active.no { background: var(--depth); color: var(--cream); }

.cpage .audit-result {
  margin-top: 18px; padding: 14px 20px;
  background: var(--cream); border-radius: 2px;
  border-left: 3px solid var(--cream-border);
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.10em; text-transform: uppercase; font-weight: 600;
  color: var(--depth); text-align: center;
  transition: background 0.3s var(--ease), border-color 0.3s var(--ease);
}
.cpage .audit-result.alert { background: var(--care-tint); border-left-color: var(--care); }

@media (max-width: 600px) {
  .cpage .audit-question-row { grid-template-columns: 24px 1fr; }
  .cpage .audit-question-row .audit-toggle { grid-column: 2 / 3; justify-self: start; margin-left: 36px; }
}

.cpage .roadmap-shell { position: relative; padding: 8px 0 60px; max-width: 1080px; margin: 0 auto; }
.cpage .roadmap-track {
  position: absolute; top: 56px; left: 6%; right: 6%;
  height: 1px; background: var(--cream-border);
}
.cpage .roadmap-track::after {
  content: ''; position: absolute; top: 0; left: 0; height: 100%; background: var(--care); width: 0;
  transition: width 1.8s var(--ease); transition-delay: 0.30s;
}
.cpage .is-in .roadmap-track::after { width: 100%; }
.cpage .roadmap-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; position: relative; }
.cpage .roadmap-stop { text-align: center; padding: 0 12px; position: relative; }
.cpage .roadmap-day { font-family: var(--mono); font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 700; color: var(--purpose); margin-bottom: 18px; }
.cpage .roadmap-dot {
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--cream); border: 2px solid var(--depth);
  margin: 0 auto;
  transform: scale(0);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.cpage .roadmap-dot.first { background: var(--care); border-color: var(--care); }
.cpage .roadmap-dot.last { background: var(--depth); }
.cpage .is-in .stop-1 .roadmap-dot { transform: scale(1); transition-delay: 0.40s; }
.cpage .is-in .stop-2 .roadmap-dot { transform: scale(1); transition-delay: 0.80s; }
.cpage .is-in .stop-3 .roadmap-dot { transform: scale(1); transition-delay: 1.20s; }
.cpage .is-in .stop-4 .roadmap-dot { transform: scale(1); transition-delay: 1.60s; }
.cpage .roadmap-stop-label { font-family: var(--display); font-weight: 900; font-size: 16px; letter-spacing: -0.02em; line-height: 1.15; color: var(--depth); margin-top: 22px; }
.cpage .roadmap-stop-desc { font-size: 11.5px; line-height: 1.5; color: var(--muted); max-width: 200px; margin: 8px auto 0; }

@media (max-width: 980px) {
  .cpage .roadmap-shell { padding: 8px 0; }
  .cpage .roadmap-track { display: none; }
  .cpage .roadmap-grid { grid-template-columns: 1fr; row-gap: 36px; }
}

.cpage .section.dark { background: radial-gradient(ellipse 1100px 600px at 50% 0%, rgba(191, 70, 26, 0.05), transparent 60%), var(--depth); position: relative; overflow: hidden; }
.cpage .score-bg { position: absolute; inset: 0; opacity: 0.12; overflow: hidden; pointer-events: none; }
.cpage .score-bg svg { width: 100%; height: 100%; }
.cpage .score-inner { position: relative; z-index: 1; text-align: center; padding: 32px 0; }
.cpage .score-headline {
  font-family: var(--display); font-weight: 900;
  font-size: clamp(34px, 4.4vw, 56px);
  letter-spacing: -0.03em; line-height: 1.0;
  color: var(--cream); margin: 0 0 16px;
}
.cpage .score-headline .period { color: var(--care-bright); }
.cpage .score-sub { font-size: 15px; line-height: 1.55; color: var(--ink-medium); max-width: 540px; margin: 0 auto 32px; }
.cpage .score-form { display: flex; gap: 8px; max-width: 560px; margin: 0 auto 18px; justify-content: center; flex-wrap: wrap; }
.cpage .score-form input {
  flex: 1; min-width: 220px;
  padding: 13px 18px;
  background: rgba(248, 242, 229, 0.04);
  border: 1px solid var(--ink-line-strong);
  color: var(--cream); border-radius: 24px;
  font-family: var(--body); font-size: 14px;
  outline: none;
  transition: border-color 0.25s var(--ease), background 0.25s var(--ease);
}
.cpage .score-form input::placeholder { color: var(--ink-soft); }
.cpage .score-form input:focus { border-color: var(--care-bright); background: rgba(248, 242, 229, 0.08); }

.cpage .authors-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px; align-items: stretch; max-width: 920px; margin: 0 auto; }
.cpage .author-tile {
  position: relative;
  background: var(--cream-card); border: 1px solid var(--cream-border); border-radius: 2px;
  padding: 36px 36px 30px;
  display: flex; flex-direction: column;
}
.cpage .author-tile-strip { position: absolute; top: 0; left: 0; width: 56px; height: 2px; }
.cpage .strip-purpose { background: var(--purpose); }
.cpage .strip-care { background: var(--care); }
.cpage .strip-depth { background: var(--depth); }

.cpage .author-monogram-wrap { width: 76px; height: 76px; position: relative; margin-bottom: 22px; }
.cpage .author-monogram {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--display); font-weight: 900; font-size: 26px; letter-spacing: -0.04em;
  background: var(--depth); color: var(--cream);
}
.cpage .tick { position: absolute; width: 10px; height: 10px; border: 1.5px solid var(--depth); }
.cpage .tick-tl { top: -4px; left: -4px; border-right: none; border-bottom: none; }
.cpage .tick-tr { top: -4px; right: -4px; border-left: none; border-bottom: none; }
.cpage .tick-bl { bottom: -4px; left: -4px; border-right: none; border-top: none; }
.cpage .tick-br { bottom: -4px; right: -4px; border-left: none; border-top: none; }

.cpage .author-name { font-family: var(--display); font-weight: 900; font-size: 26px; letter-spacing: -0.02em; line-height: 1.0; color: var(--depth); margin-bottom: 8px; }
.cpage .author-role { font-family: var(--mono); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700; margin-bottom: 18px; }
.cpage .role-purpose { color: var(--purpose); }
.cpage .role-care { color: var(--care); }
.cpage .role-depth { color: var(--depth); }
.cpage .author-bio { font-size: 14px; line-height: 1.65; color: var(--depth-soft); margin: 0 0 22px; flex: 1; }
.cpage .author-bio strong { color: var(--depth); font-weight: 600; }
.cpage .author-stat-row { display: flex; gap: 28px; padding-top: 18px; border-top: 1px solid var(--cream-line); flex-wrap: wrap; }
.cpage .author-stat-num { font-family: var(--display); font-weight: 900; font-size: 22px; letter-spacing: -0.025em; line-height: 1.0; color: var(--depth); }
.cpage .author-stat-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; color: var(--muted); margin-top: 5px; }

@media (max-width: 820px) { .cpage .authors-grid { grid-template-columns: 1fr; max-width: 520px; } }

.cpage .faq-list { max-width: 820px; margin: 0 auto; }
.cpage .faq-item { border-bottom: 1px solid var(--cream-line); }
.cpage .faq-item:first-child { border-top: 1px solid var(--cream-line); }
.cpage .faq-summary {
  cursor: pointer; list-style: none; padding: 20px 0;
  display: grid; grid-template-columns: 96px 1fr 24px; gap: 18px; align-items: center;
  font-family: var(--display); font-weight: 900; font-size: 16px; letter-spacing: -0.02em; line-height: 1.25; color: var(--depth);
  transition: color 0.25s var(--ease);
}
.cpage .faq-summary::-webkit-details-marker { display: none; }
.cpage .faq-summary:hover { color: var(--care); }
.cpage .faq-tag { font-family: var(--mono); font-size: 8.5px; letter-spacing: 0.20em; text-transform: uppercase; font-weight: 700; color: var(--purpose); text-align: left; }
.cpage .faq-toggle { width: 24px; height: 24px; position: relative; }
.cpage .faq-toggle::before, .cpage .faq-toggle::after {
  content: ''; position: absolute; top: 50%; left: 50%; background: var(--depth);
  transition: transform 0.3s var(--ease), opacity 0.3s var(--ease);
}
.cpage .faq-toggle::before { width: 12px; height: 1.5px; transform: translate(-50%, -50%); }
.cpage .faq-toggle::after { width: 1.5px; height: 12px; transform: translate(-50%, -50%); }
.cpage .faq-item[open] .faq-toggle::after { transform: translate(-50%, -50%) rotate(90deg); opacity: 0; }
.cpage .faq-answer { padding: 0 0 22px 114px; font-size: 14px; line-height: 1.6; color: var(--depth-soft); max-width: 720px; margin: 0; }

@media (max-width: 600px) {
  .cpage .faq-summary { grid-template-columns: 1fr 24px; gap: 12px; }
  .cpage .faq-tag { display: none; }
  .cpage .faq-answer { padding-left: 0; padding-right: 28px; }
}

.cpage .begin-inner { position: relative; max-width: 760px; margin: 0 auto; text-align: center; }
.cpage .begin-inner::before {
  content: ''; position: absolute; inset: -40px -10% -40px -10%;
  background: radial-gradient(ellipse 60% 60% at 50% 50%, var(--care-tint), transparent 70%);
  pointer-events: none; z-index: 0;
}
.cpage .begin-inner > * { position: relative; z-index: 1; }
.cpage .begin-headline {
  font-family: var(--display); font-weight: 900;
  font-size: clamp(36px, 4.6vw, 60px);
  letter-spacing: -0.03em; line-height: 0.98;
  color: var(--depth); margin: 16px 0 26px;
}
.cpage .begin-inner .hero-form { justify-content: center; max-width: 560px; }

.cpage .verticals { padding: 56px 0; border-top: 1px solid var(--cream-border); background: var(--cream); }
.cpage .verticals-eyebrow { font-family: var(--mono); font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase; font-weight: 700; color: var(--purpose); text-align: center; margin-bottom: 18px; }
.cpage .verticals-grid { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
.cpage .vertical-chip {
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.16em;
  text-transform: uppercase; font-weight: 700; color: var(--depth);
  text-decoration: none; padding: 8px 14px;
  border: 1px solid var(--cream-border); border-radius: 18px;
  background: var(--cream-card);
  transition: color 0.25s var(--ease), border-color 0.25s var(--ease), background 0.25s var(--ease);
}
.cpage .vertical-chip:hover { color: var(--care); border-color: var(--care); background: var(--cream); }
.cpage .vertical-chip.active { color: var(--care); border-color: var(--care); }

.cpage .cfooter { background: var(--depth); color: var(--cream); padding: 56px 0 32px; }
.cpage .cfooter .container { padding: 0 32px; }
.cpage .footer-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
.cpage .cfooter h4 { font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 700; color: var(--purpose-soft); margin: 0 0 14px; }
.cpage .cfooter ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.cpage .cfooter a { color: var(--ink-medium); text-decoration: none; font-size: 13px; transition: color 0.25s var(--ease); }
.cpage .cfooter a:hover { color: var(--cream); }
.cpage .footer-text { font-family: var(--mono); font-size: 10px; letter-spacing: 0.10em; text-transform: uppercase; color: var(--ink-soft); margin-top: 4px; }
.cpage .footer-bottom { border-top: 1px solid var(--ink-line); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
.cpage .footer-logo { font-family: var(--display); font-weight: 900; font-size: 14px; letter-spacing: -0.02em; color: var(--cream); }
.cpage .footer-logo .dot-care { color: var(--care-bright); }
.cpage .footer-tag { font-family: var(--mono); font-size: 9px; letter-spacing: 0.20em; text-transform: uppercase; color: var(--ink-soft); }
.cpage .footer-legal { font-family: var(--mono); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-soft); }
.cpage .footer-legal a { color: var(--ink-soft); font-size: 9px; letter-spacing: 0.18em; }
.cpage .footer-legal a:hover { color: var(--cream); }

@media (max-width: 980px) { .cpage .footer-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .cpage .footer-grid { grid-template-columns: 1fr; } }

@media (max-width: 980px) {
  .cpage .hero-grid { grid-template-columns: 1fr; gap: 40px; }
  .cpage .profile-stage { max-width: 494px; margin: 0 auto; }
  .cpage .numbers-grid { grid-template-columns: 1fr; }
}

.cpage .cta-pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 22px;
  background: var(--care); color: var(--cream);
  border: 2px solid var(--care); border-radius: 24px;
  font-family: var(--display); font-weight: 900;
  font-size: 11px; letter-spacing: 0.10em;
  text-transform: uppercase; text-decoration: none;
  cursor: pointer;
  transition: background 0.3s var(--ease), border-color 0.3s var(--ease), transform 0.3s var(--ease);
  box-shadow: 0 4px 14px -6px rgba(191, 70, 26, 0.40);
  position: relative; overflow: hidden;
}
.cpage .cta-pill::before {
  content: ''; position: absolute;
  top: 0; left: -60%;
  width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.30), transparent);
  transform: skewX(-20deg);
  animation: shimmer 5s ease-in-out infinite;
  pointer-events: none;
}
@keyframes shimmer { 0% { left: -60%; } 60% { left: 140%; } 100% { left: 140%; } }
.cpage .cta-pill:hover { background: var(--depth); border-color: var(--depth); transform: translateY(-2px); }
.cpage .cta-pill svg { transition: transform 0.3s var(--ease); }
.cpage .cta-pill:hover svg { transform: translateX(3px); }

@media (prefers-reduced-motion: reduce) {
  .cpage *, .cpage *::before, .cpage *::after {
    transition-duration: 0.01ms !important;
    transition-delay: 0ms !important;
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
  }
  .cpage .reveal, .cpage .word-inner, .cpage .meta-row,
  .cpage .profile-card, .cpage .profile-stage::before,
  .cpage .roadmap-dot, .cpage .hero-stat-fill,
  .cpage .roadmap-track::after, .cpage .profile-bar-fill, .cpage .profile-bar-mark {
    opacity: 1 !important;
    transform: none !important;
    width: var(--w, 100%) !important;
  }
  .cpage .roadmap-dot { transform: scale(1) !important; }
}
`;
