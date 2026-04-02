

# Remove Publication Timeline

## Change
In `src/components/BookSection.tsx`:

1. **Remove the milestones array** (lines ~32-37) — no longer needed.
2. **Remove the "PUBLICATION TIMELINE" heading** and both timeline renderings (horizontal for desktop, vertical for mobile) — everything after the edition label's closing `</span>` down through the mobile timeline `</div>`.

This removes roughly 50 lines of timeline code and the associated data. The edition label ("First Edition · Q2 2026") remains.

