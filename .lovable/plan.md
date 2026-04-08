
# Remove Pilot Lookback & Path Forward Tabs

## Changes

### 1. `src/components/spr/SPRTabBar.tsx`
Remove "Pilot Lookback" and "Path Forward" from the TABS array, leaving 4 tabs: The Mirror, The Math, The Proof, What If.

### 2. `src/pages/SPRGroup.tsx`
- Remove imports for `SPRPilotLookback` and `SPRPathForward`
- Update TABS array to `[SPROverview, SPROrbits, SPRProof, SPRWhatIf]`

### 3. Delete files
- `src/components/spr/SPRPilotLookback.tsx`
- `src/components/spr/SPRPathForward.tsx`

Two file edits + two file deletions.
