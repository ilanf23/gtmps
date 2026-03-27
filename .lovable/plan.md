
Goal: restore the live site on `discover.mabbly.com` and `relationship-revenue-os.lovable.app`.

What I verified
- App code is valid and wired:
  - `src/App.tsx` mounts routes correctly
  - `src/pages/Index.tsx` renders the landing page
  - `src/components/DefinitionBanner.tsx` is valid
  - `index.html` mounts `src/main.tsx`
- Publish settings are correct:
  - published = true
  - visibility = public
- Both live URLs still return the placeholder, not the app:
  - `relationship-revenue-os.lovable.app`
  - `discover.mabbly.com`

Do I know what the issue is?
- Yes. This is a publishing/deployment mapping issue, not a page/component bug.
- The preview app is running.
- The published URLs are serving placeholder content instead of the built frontend.
- The console warnings about refs are non-blocking and do not explain the placeholder page.

Plan
1. Stop chasing component code
   - No more edits to `HeroSection`, `DefinitionBanner`, or routing for this issue.
   - Those files are not the reason the live domain shows the placeholder.

2. Force one clean frontend republish
   - When implementation mode is available, make one tiny harmless frontend edit and publish again.
   - This is only to trigger a fresh deployment record, not to fix app logic.

3. If the placeholder still appears, treat it as platform-side
   - Because both the default published domain and custom domain fail the same way, the custom domain is not the root cause.
   - The publish layer is not attaching the build output to the live deployment.

4. Escalate with exact evidence
   - Report:
     - preview works
     - project is published and public
     - both live URLs show the placeholder
     - app files are present and valid
   - Ask for the published deployment mapping to be refreshed or repaired.

Technical detail
```text
Working preview
      +
Valid frontend code
      +
Public published setting
      =
Live URLs should serve app

Actual result:
Live URLs serve placeholder HTML

Conclusion:
Deployment mapping/sync failure outside app code
```

Expected outcome
- After the publish mapping is repaired, both the `.lovable.app` URL and `discover.mabbly.com` should load the real app without further frontend changes.
