## Goal

Replace the current abstract "constellation + radar arc" loading scene with a more **professional and recognizable** animation that visually represents what's actually being built for the client: their GTM/Relationship Revenue Map.

The current scene (`src/components/magnet/MagnetLoadingScene.tsx`) has a generic celestial/radar feel that doesn't tell the story of the product. The new version stays editorial and on-brand, but shows the system *constructing the map* in front of the user — concrete, narrative, and tied to each loading step.

## Concept: "Cartographer's Drafting Table"

Editorial publishing house meets strategy deck. Feels like watching a cartographer draft a custom market map — line by line, label by label — instead of a sci-fi radar sweep.

### Visual layers (built sequentially as steps progress)

1. **Step 01 — Reading your website**
   A horizontal scanning rule sweeps top-to-bottom across a faint document outline (a tall rectangle suggesting a webpage). Small data ticks light up along the rule as it passes. Concrete and recognizable: this is *reading*.

2. **Step 02 — Identifying your relationship orbits**
   The document fades; five concentric orbit rings draw themselves outward from the center, one per second. As each ring completes, a small labeled node ("Clients", "Partners", "Press", "Talent", "Capital") fades in on the ring at a hand-placed angle.

3. **Step 03 — Mapping your Dead Zone**
   A soft wedge / sector (15 to 25 degree arc) fills with a translucent accent tint between two orbits, with a thin dashed boundary. A tiny serif italic label "Dead Zone" sets next to it.

4. **Step 04 — Calibrating your Five Layers**
   Five short horizontal calibration bars (mini level meters) appear stacked on the right edge of the stage. Each fills smoothly to a different percentage. Reads instantly as tuning or calibrating.

5. **Step 05 — Writing your GTM breakdown**
   A short serif manuscript line types itself out beneath the map (e.g. "Drafting your map..."), with a blinking caret. Optional: a subtle pen nib SVG glides along the line.

### Persistent elements throughout
- The center seal becomes a **compass rose**: a thin 4 point star inside a circle, with the rotating italic numeral (01 through 05) in the center.
- 4 hairline tick marks at N, E, S, W on the center circle. One of the most recognizable mapping cues.
- Background dots reduced from 40 to about 25; lose the random flare pulse. They become quiet paper texture, not stars.
- The radar arc is **removed** (the most sci-fi and least professional element).

### Motion principles
- Every motion is purposeful and tied to a step. No looping decoration that runs forever regardless of progress.
- Durations match the existing `STEP_DURATION_MS = 14_000`.
- `prefers-reduced-motion` shows the final composed state (all 5 layers visible) with no animation.

### Color and type
- Reuses CSS variables (`--ms-accent`, `--ms-text`, `--ms-bg`) so it auto re-skins per client. No hardcoded hex.
- Cormorant Garamond italic for the numeral and inline labels (already used).
- Hairline 1px strokes throughout. Keeps the editorial feel.

## Implementation

Single file change: rewrite `src/components/magnet/MagnetLoadingScene.tsx`.
- Same props signature (`firstName`, `stepIndex`, `stepVisible`, `steps`) so `MagnetSite.tsx` does not change.
- Keep the editorial text block below the stage exactly as is. It is working well.
- Replace only the SVG stage contents and the keyframe block.
- Use `stepIndex` to drive which layers are visible. Each layer mounts when its step starts and remains visible afterward (building, not flickering).

### Files touched
- `src/components/magnet/MagnetLoadingScene.tsx` — full rewrite of the SVG stage and keyframes. Editorial text block below stays untouched.

No schema changes, no routing changes, no other files affected.