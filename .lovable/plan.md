

# Scroll to Specific MAP Field on Click

## Problem
Currently, clicking a MAP field in the completion strip navigates to the correct tab but always scrolls to the top of the page. Users want to land directly on the specific field section.

## Approach
Add `id` attributes to each field's `<section>` element in the tab components, then update the navigation to scroll to that element after the tab switch completes.

## Changes

### 1. Add a `fieldId` to the FIELDS data in `SPRCompletionStrip.tsx`
Each field gets an anchor ID like `map-field-1`, `map-field-2`, etc. Update `onNavigate` to also pass the field ID.

### 2. Update `SPRCompletionStrip.tsx` callback
Change `onNavigate` prop from `(tab: number) => void` to `(tab: number, fieldId: string) => void`. Each click passes `(f.tab, "map-field-" + f.num)`.

### 3. Update `SPRGroup.tsx` handleTabChange
Accept an optional `fieldId` parameter. After the tab switch and fade-in, use `document.getElementById(fieldId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })` with a small delay to let the new tab render first.

### 4. Add `id` attributes to sections in each tab component
- **SPRWhoYouAre.tsx**: Add `id="map-field-2"` to Session Voice section, `id="map-field-1"` to The Core, `id="map-field-4"` to Core Values, `id="map-field-5"` to ICP Lock
- **SPRSittingOn.tsx**: Add `id="map-field-8"` to Dead Zone, `id="map-field-7"` to Spectrum Position, `id="map-field-9"` to Orbit Priority
- **SPRTriggers.tsx**: Add `id="map-field-10"` to Primary Signal Type, `id="map-field-6"` to Beachhead Segment, `id="map-field-12"` to Competitive Landscape
- **SPRWhereGoing.tsx**: Add `id="map-field-3"` to Corporate Objectives, `id="map-field-11"` to Vision State

### 5. Scroll offset
Add a `scroll-margin-top` style (e.g. 120px) to each section to account for the fixed top bar and tab bar.

**Files modified**: `SPRCompletionStrip.tsx`, `SPRGroup.tsx`, `SPRWhoYouAre.tsx`, `SPRSittingOn.tsx`, `SPRTriggers.tsx`, `SPRWhereGoing.tsx`

