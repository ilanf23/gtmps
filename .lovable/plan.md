

# Remove Pilot Lookback & Path Forward Tabs

## Changes

### 1. `src/components/spr/SPRTabBar.tsx`
Remove "Pilot Lookback" and "Path Forward" from the TABS array, leaving 6 tabs: Overview, Identity, Orbits, Signals, Roadmap, Content Engine.

### 2. `src/pages/SPRGroup.tsx`
- Remove imports for `SPRPilotLookback` and `SPRPathForward`
- Remove them from the TABS array (line 13), leaving 6 components

### 3. Delete files
- `src/components/spr/SPRPilotLookback.tsx`
- `src/components/spr/SPRPathForward.tsx`

Three file edits + two file deletions. No other files reference these components.

