1. Restore the preview connection
   - The current failure is not coming from your React code rendering a white screen.
   - I confirmed the preview request itself is failing at the document level with HTTP 412 before the app loads.
   - The published site still resolves, which points to a preview infrastructure or preview session issue rather than the DiscoverHero edit alone.

2. Apply the structural route fix in code
   - Update the router setup so the homepage works correctly at the preview root and under the current route structure.
   - Specifically review the `BrowserRouter basename="/discover"` setup in `src/App.tsx`, because the app currently defines both `/` and `/discover` routes while also mounting at a `/discover` base. That combination is fragile and can break preview loading depending on how the preview URL is mounted.
   - Normalize the route setup to one consistent base strategy.

3. Verify environment wiring for preview boot
   - Confirm the app still boots cleanly with the managed backend environment values used by `src/integrations/supabase/client.ts`.
   - If preview state lost its managed env injection, refresh the integration-backed preview state and recheck the root document load.
   - `.gitignore` is not excluding `.env`, so this does not look like a simple ignored-env case.

4. Re-test the homepage after the fix
   - Load `/` and `/discover` in preview.
   - Confirm the hero orbit renders, the white deal tag still covers the full text, and the larger black orbit dots still appear.
   - Check console and network again after the preview is healthy.

5. If the preview proxy is still returning 412 after the code cleanup
   - Treat it as a preview platform issue rather than an app issue.
   - I’ll give you the fastest safe recovery steps: refresh the editor preview session, reopen the project preview, and if needed republish once preview is healthy.

Technical details
- Files to update first: `src/App.tsx`
- Files to regression-check after fix: `src/pages/Discover.tsx`, `src/components/discover/DiscoverHero.tsx`
- Evidence gathered:
  - Browser console shows `Failed to load resource: the server responded with a status of 412` on the document request.
  - Browser network shows the top level `GET` for the preview document failing before app assets execute.
  - `src/App.tsx` currently uses `BrowserRouter basename="/discover"` while also declaring both `/` and `/discover` routes.
  - `src/integrations/supabase/client.ts` depends on managed env values at startup.