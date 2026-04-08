

# SPR MAP Page Rebuild (v2)

A structural rethink: 6 current tabs become 4 new tabs + 2 reinstated tabs. The principle is "show SPR their situation, not Mabbly's framework."

## New Tab Structure

```text
Tab 1: The Mirror     (was Overview — keep hero, stats, quotes; remove RROS tracker, Three Laws, Five Truths, spectrum refs)
Tab 2: The Math       (was Orbits — keep calculator + Have/Gap; remove spectrum bar, orbit map, relationship capital)
Tab 3: The Proof      (was Content Engine — keep LinkedIn + blog mockups, add "strengths" cards + "one gap" narrative; remove competitive star chart, digital presence, MAP grid)
Tab 4: What If        (merge Signals email + Roadmap Today/12mo + ContentEngine questions/data request/CTA; remove Signal Types list, First Week, quarterly roadmap, formula cards)
Tab 5: Pilot Lookback (recreate — was deleted last round)
Tab 6: Path Forward   (recreate — was deleted last round)
```

## Phase 1: Structural — Tabs & Routing

**SPRTabBar.tsx**: Update TABS array to `["The Mirror", "The Math", "The Proof", "What If", "Pilot Lookback", "Path Forward"]`

**SPRGroup.tsx**: Update imports and TABS component array to map to new components. Import the two recreated components.

## Phase 2: Rebuild Tab Components

### Tab 1 — `SPROverview.tsx` → "The Mirror"
- Keep: hero headline, Rebecca quote, stats bar (fix styling: dark navy card, large numbers)
- Rewrite: 4 "What You Said / What We Heard" insight paragraphs per the plan (remove all em-dashes, tighten to 2-3 sentences)
- Keep: "What We Know About SPR" expandable, but update cards to include "Identity Tension" and "Delivery-as-sellers" insights
- **Remove**: Three Laws section, Five Truths section, Locked Book Definition, RROS Progress tracker
- Fix dormancy stat display if showing "0 yrs" (currently shows "2 yrs" — verify)

### Tab 2 — `SPROrbits.tsx` → "The Math"
- New headline: "The Revenue Already in Your CRM"
- Keep: Dead Zone calculator (update slider ranges: dormant 1K-15K, value default $150K with "estimate" label, rate 1-10%)
- Add: comparison table below result (1%/3%/5% scenarios)
- Add: paragraph about dormant relationship value (60-70% conversion, 31% more spend, 7x cheaper)
- Keep: What You Have / The Gap cards (update content per plan, fix "Kristin" → "Kristen")
- **Remove**: Spectrum Position score + `SPRSpectrumBar`, Orbit Map + `SPROrbitMap`, Network Assets table
- **Delete**: `SPRSpectrumBar.tsx`, `SPROrbitMap.tsx` (no longer used)

### Tab 3 — New `SPRProof.tsx`
- Headline: "Your Proof Library Is Strong. Your Publishing Cadence Is Not."
- 4 strength cards: case study library, senior delivery team, flexible engagement, aligned leadership
- "The one gap" section: proof does not travel + publishing cadence observation (replaces competitive star chart)
- Keep LinkedIn post mockup (from current ContentEngine) with avatar/engagement bar
- Keep Rebecca blog outline (from current ContentEngine)
- **Remove**: competitive landscape star chart, digital presence analysis, MAP completion grid

### Tab 4 — New `SPRWhatIf.tsx`
- Kyle email mockup (from current Signals tab) with inline color-coded Signal/Proof/Context annotations
- 3-line breakdown below email (signal = timing, proof = credibility, context = relationship)
- Today vs 12 Months comparison table (from current Roadmap — keep the 4-row version from the plan)
- "Did we get this right?" questions (from current ContentEngine)
- Data request list (from current ContentEngine)
- CTA: "Schedule 15 Min MAP Review" (from current ContentEngine)
- **Remove**: Formula card layout, Signal Types chips, First Week expandable, quarterly roadmap, "What Makes This Work" cards

### Tab 5 — Recreate `SPRPilotLookback.tsx`
Restore from git history or rebuild. The ~7% stat hero, 4 stat cards, team workflow, Kristen quote, two-phase approach, Accenture callout.

### Tab 6 — Recreate `SPRPathForward.tsx`
Restore from git history or rebuild. 10-sender roster, 3 pricing options, comparison table, closing CTA.

## Phase 3: Delete Unused Files
- `src/components/spr/SPRSpectrumBar.tsx`
- `src/components/spr/SPROrbitMap.tsx`
- `src/components/spr/SPRDeadZoneCalc.tsx` (keep if reusable, otherwise inline into The Math)

## Phase 4: Global Content Pass
- Replace all em-dashes with commas or sentence restructuring across all tabs
- Ensure "Kristen" spelling everywhere
- Remove all "RROS" mentions, "spectrum" references, orbit model references
- Consistent quote treatment: gold left border, italic serif, bold name + muted title

## Phase 5: Visual Polish
- Stats bar: dark navy (#1B2A4A) card background, large serif numbers
- Calculator result: 48-64px serif with count-up animation
- Email mockup: inline color-coding for Signal/Proof/Context
- LinkedIn mockup: avatar, company badge, engagement bar (already partially done)

## Files Summary

| Action | File |
|--------|------|
| Rewrite | `SPRTabBar.tsx` — 6 new tab names |
| Rewrite | `SPRGroup.tsx` — new imports + component array |
| Rewrite | `SPROverview.tsx` — strip framework, tighten content |
| Rewrite | `SPROrbits.tsx` → becomes "The Math" |
| Create | `SPRProof.tsx` — new tab from ContentEngine pieces |
| Create | `SPRWhatIf.tsx` — merged from Signals + Roadmap + ContentEngine |
| Recreate | `SPRPilotLookback.tsx` |
| Recreate | `SPRPathForward.tsx` |
| Delete | `SPRSpectrumBar.tsx`, `SPROrbitMap.tsx` |
| Delete | `SPRSignals.tsx`, `SPRRoadmap.tsx`, `SPRContentEngine.tsx` (replaced) |

## Implementation Order
1. Foundation: tab bar + page routing + create empty shells
2. The Mirror + The Math (rewrite existing)
3. The Proof + What If (new components)
4. Pilot Lookback + Path Forward (recreate)
5. Global pass: em-dashes, spelling, tone, visual polish

