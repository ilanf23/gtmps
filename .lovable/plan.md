

# Build SPR Market Activation Profile

A new 8-tab microsite at `/spr` following the same architecture as Pepper Group, customized for SPR (53-year technology consulting firm, Anderson acquisition context).

## Scope

**13 new files** in `src/components/spr/` + 1 page file + 1 route addition:

```text
src/pages/SPRGroup.tsx          ← Main page (tab state, transitions, meta tags)
src/components/spr/
  SPRTopBar.tsx                 ← "MABBLY" | discover.mabbly.com/spr | "Prepared for Doug, Tom & Rebecca"
  SPRTabBar.tsx                 ← 8 tabs (Overview through Path Forward)
  SPROverview.tsx               ← Rebecca quote, 4 stat cards, What You Said/Heard table, company accordion, RROS progress
  SPRIdentity.tsx               ← Current vs RROS positioning, 6-company competitor grid, digital presence
  SPROrbits.tsx                 ← Spectrum bar (1.5-2.0), Have/Gap cards, Network Assets (4 cards + total bar), Dead Zone calc, Orbit diagram
  SPRSignals.tsx                ← Formula visual, email mockup (Kyle to former CIO), signal type chips, first week playbook
  SPRRoadmap.tsx                ← Today vs 12 Months comparison, quarterly cards (Q2 2026 - Q1 2027)
  SPRContentEngine.tsx          ← Gap explanation, Kyle LinkedIn post, Rebecca blog outline, "Did We Get This Right?", data request, CTA
  SPRPilotLookback.tsx          ← NEW TAB: Dark hero (~7% stat), 4 stat cards, team workflow (Brian→Kristin→Kyle→Rebecca), Kristin quote, two-phase approach, Accenture callout, adoption signal
  SPRPathForward.tsx            ← NEW TAB: 10-sender roster, 3 pricing options (A/B/C), comparison table, closing section with CTA
  SPRSpectrumBar.tsx            ← Marker at 1.5-2.0 position (vs Pepper's 1.5)
  SPRDeadZoneCalc.tsx           ← Sliders: 1K-20K contacts, $50K-$500K value, 1-10% rate, default=$60M
  SPROrbitMap.tsx                ← SVG rings: Core Proof → Active (Kyle 150) → Dead Zone (8K-10K pulsing) → Anderson → New Gravity
```

## Reusable from Pepper

These Pepper components can be imported directly (no duplication needed):
- `PepperAnimatedCounter` — same count-up logic
- `PepperExpandable` — same accordion pattern
- `PepperDotMatrix` — can be reused or SPR gets its own version given different numbers

## Key Differences from Pepper Group

| Aspect | Pepper Group | SPR |
|--------|-------------|-----|
| Tabs | 6 | 8 (+ Pilot Lookback, Path Forward) |
| Tone | Scrappy 32yr agency | Enterprise 53yr, acquisition context |
| Stats | 400+ dormant, 80% revenue | 59K CRM, 8-10K dormant, 10 BDMs |
| Spectrum | 1.5 of 4 | 1.5-2.0 of 5 |
| Dead Zone calc defaults | 500 contacts, $120K, 5% | 8,000 contacts, $250K, 3% |
| Orbit rings | 4 rings | 5 rings (adds Anderson ring) |
| Competitors | 5 agencies | 5 tech consultancies (Slalom, West Monroe, etc.) |
| Content Engine | George's voice | Kyle LinkedIn + Rebecca blog |
| Pricing | Not shown | 3 options ($1,199 / ~$3,949 / $7.5K-$12K) |
| CTA | 30-min review | "Schedule MAP Review with Adam" |

## Route

Add `/spr` route in `App.tsx` pointing to `SPRGroup.tsx`.

## Implementation Order

Due to the size, this will be built across multiple messages:
1. **Foundation**: SPRGroup page, TopBar, TabBar, route — gets navigation working
2. **Tabs 1-3**: Overview, Identity, Orbits (with SPRSpectrumBar, SPRDeadZoneCalc, SPROrbitMap)
3. **Tabs 4-6**: Signals, Roadmap, Content Engine
4. **Tabs 7-8**: Pilot Lookback, Path Forward (the two new tabs)

All content is static/hardcoded per the prompt. Same visual identity (colors, fonts, textures, interactions) as Pepper Group.

