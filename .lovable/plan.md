# Rebuild Aletheia MAP Microsite

## Goal

Recreate the `/aletheia` page and its 15 components inside the current project. **Nothing existing is touched** except adding one route line in `src/App.tsx`. All v10 magnet work, Calendly integration, Discover hub, scoring fixes, etc. stay exactly as they are.

## What I have (verbatim, recovered from chat history)

From the original Claude prompt (message #437) and approved build plan (#438):

- **Design system**: Navy `#0B1A2E`, Amber gold `#C8963E`, Off-white `#F5F1E8`, Muted slate `#7A8AA0`. Playfair Display + Inter + EB Garamond (already loaded in `index.html`).
- **Hero**: Full Travis Roderick 3 line quote, eyebrow, attribution, subhead, Calendly CTA — verbatim.
- **Field 01 The Core**: Core statement, Mission, Doctrine — verbatim.
- **Field 02 Language Lock**: All 6 cards (Core, Niche, Problem, Pivot, Category Shift, Why) with full quotes and speakers — verbatim.
- **Field 03 What They Said / What We Heard**: All 4 paired cards — verbatim.
- **Field 04 ICP Lock**: Tier 3 pill, Rule, Application — verbatim (Thesis block was truncated, will write a faithful one-line stub matching tone).
- **Field 05 Proven Process**: 6 verbs in order (Surface, Confront, Architect, Install, Cohere, Compound) + Guild Pulse callout naming Joe Pung. I have structure + verb names but **not the per-verb body copy**.
- **Field 06 Calendar**: 4 horizontal blocks (CLARITY, FOCUS, PRESSURE, STANDARD). Structure only.
- **Field 07 Everything Built**: 4 cards (445 Node Map, Core Diagnosis, S6E1 Barry, Doctrine). Structure only.
- **Field 08 Chapters**: Ch3 The Formula, Ch4 Five Truths/Core/Orbits, Ch5 DISCOVER, Ch11 MAP Template + Discovery Guide. Structure + chapter titles.
- **Field 09 Revenue Calc**: Full math spec. 5 sliders (Discoveries 10, Conversion 60%, AvgValue $300K, Pool 40, ReactConv 12%) → $8.64M default total.
- **Field 10 Vision**: Pull quote slot. Need attribution copy.
- **Field 11 Dead Zone**: 3 stat blocks. Structure only.
- **Final CTA**: Two CTAs (Calendly `/adam-fridman/30min` + `mailto:adam@mabbly.com?subject=Re: Aletheia MAP`).
- **Non-negotiables**: No hyphens / en dashes / em dashes anywhere. No hero video. Mobile single column under 768px.

## Two paths to fill the gaps for Fields 5, 6, 7, 8, 10, 11

**Path A (highest fidelity, recommended)**: You remix the old preview version (`a5168633...`) into a separate throwaway project. Tell me the project name. I use `cross_project--read_project_file` to pull the exact original component files into this project as is. Zero copy guesswork. Takes ~2 minutes once you've remixed.

**Path B (start now, refine after)**: I rebuild now using the full structure + all verbatim copy I have, and write tight placeholder copy for the 6 truncated field bodies in the same voice (no dashes, no hyphens, operator tone). You paste the original Claude prompt for Fields 5–11 when you find it and I swap the placeholders in. Visually and structurally identical to the original day one; copy reaches 100% fidelity once you supply it.

## Files this plan creates

- `src/pages/Aletheia.tsx` — page assembly
- `src/components/aletheia/AletheiaNav.tsx`
- `src/components/aletheia/AletheiaHero.tsx`
- `src/components/aletheia/AletheiaCore.tsx` (Field 01)
- `src/components/aletheia/AletheiaLanguageLock.tsx` (Field 02)
- `src/components/aletheia/AletheiaSaidHeard.tsx` (Field 03)
- `src/components/aletheia/AletheiaICPLock.tsx` (Field 04)
- `src/components/aletheia/AletheiaProvenProcess.tsx` (Field 05)
- `src/components/aletheia/AletheiaCalendar.tsx` (Field 06)
- `src/components/aletheia/AletheiaEverythingBuilt.tsx` (Field 07)
- `src/components/aletheia/AletheiaChapters.tsx` (Field 08)
- `src/components/aletheia/AletheiaRevenueCalc.tsx` (Field 09, interactive)
- `src/components/aletheia/AletheiaVision.tsx` (Field 10)
- `src/components/aletheia/AletheiaDeadZone.tsx` (Field 11)
- `src/components/aletheia/AletheiaFinalCTA.tsx`
- `src/components/aletheia/AletheiaSectionReveal.tsx` (fade up wrapper)

## Files this plan edits

- `src/App.tsx` — add one import and one `<Route path="/aletheia" element={<Aletheia />} />` above the catch-all. Nothing else.

## Out of scope

- No backend changes, no Supabase migrations, no edge functions, no env / secrets touched.
- No changes to `discover.mabbly.com` DNS — already routes to this project, so `/aletheia` will be live at `https://discover.mabbly.com/aletheia` immediately after deploy.
- No edits to any existing page, component, hook, or route.

## Which path?

Tell me **A** (you'll remix the old version, then I copy files exact) or **B** (I start building now with placeholders for the truncated copy).
