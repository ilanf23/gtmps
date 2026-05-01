# Lovable Prompt · Replace AF Initials Placeholder with Adam Fridman Profile Photo

**Target file:** `src/components/magnet/MagnetBreakdown.tsx` (and any other location where the "AF" initials avatar appears)
**Issue:** The Adam Fridman credibility anchor in Section 07 (and possibly elsewhere) currently displays a placeholder "AF" initials avatar — a dark circle with gold "AF" text. This needs to be replaced with Adam's actual profile photo, locally bundled into the project files (not externally hosted), so it ships with every microsite creation by default.
**Goal:** Every personalized MAP rendered at `/m/:slug` (and any other surface that displays the Adam credibility avatar) shows Adam's real headshot. The image is downloaded into the project's `/public/` directory so it loads instantly, requires no external CDN, and is part of the production build artifact.

---

## ASSET SPECIFICATION (must be added to the project)

**File path:** `/public/images/team/adam-fridman.jpg`

**Image specs:**
- Format: JPG (or WebP if the project pipeline supports it — check if there are existing `.webp` files in `/public/`)
- Dimensions: minimum 400×400 px, ideally 800×800 px (high-DPI display friendly)
- Aspect ratio: 1:1 (square — the avatar is rendered as a circle via CSS `border-radius: 50%`)
- File size: under 100 KB (compress before commit)
- Cropping: head-and-shoulders, eyes roughly 1/3 from the top, generous padding around the head so the circle crop doesn't clip
- Color: full color (not B&W)
- Background: clean — solid color, neutral environment, or soft blur

**Fallback file** (recommended): `/public/images/team/adam-fridman.webp` for browsers that prefer WebP, with the JPG as the `<picture>` source fallback.

---

## Copy/paste prompt for Lovable

```
Replace the "AF" initials placeholder avatar with Adam Fridman's actual profile photo across the personalized MAP microsite (and anywhere else the AF placeholder appears in the codebase). The photo must be downloaded into the project's /public/ directory so it ships with every build — NO external image URLs, NO CDN hot-linking, NO data: URIs longer than 1KB.

STEP 1 — LOCATE THE AF PLACEHOLDER:
Search the entire src/ folder for any occurrence of the "AF" initials avatar pattern. Likely locations:
- src/components/magnet/MagnetBreakdown.tsx (Section 07 · "I'm building this research with practitioners like you...")
- src/components/magnet/v10/ (any V10 sub-components)
- src/components/microsite/ (if the Adam avatar appears in shared shell)
- Any other component that renders "AF" inside a circular dark background

For each occurrence: report back the file path and line number BEFORE making changes. Wait for confirmation before editing if more than 3 locations are found — uncertainty about scope means stop and ask.

STEP 2 — CONFIRM THE ASSET EXISTS:
Check if /public/images/team/adam-fridman.jpg (or .webp) already exists in the project.

- If YES: proceed to STEP 3.
- If NO: STOP. Output this exact message and wait:
  "I cannot find /public/images/team/adam-fridman.jpg in the project. The user needs to add the file before I can wire it up. The image should be:
  - Path: /public/images/team/adam-fridman.jpg
  - Dimensions: at least 400×400 px (800×800 preferred)
  - Aspect ratio: 1:1 square
  - File size: under 100 KB
  - Head-and-shoulders crop, eyes ~1/3 from the top, generous padding
  Once the file is added to the project, re-run this prompt."

DO NOT attempt to generate, fetch, scrape, or AI-create a substitute image. DO NOT use a placeholder service URL like placeholder.com, picsum.photos, ui-avatars.com, or any AI image generator. DO NOT hot-link to LinkedIn, Twitter, Mabbly's website, or any external host.

STEP 3 — REPLACE THE PLACEHOLDER:
For each location identified in STEP 1, replace the "AF" initials avatar with an <img> element (or <picture> element if both .webp and .jpg exist) referencing the local file. Specifically:

REPLACE this pattern (the "AF" initials placeholder):
- A circular div with a dark background (likely bg-ink or similar Tailwind class) containing the text "AF"
- Or any equivalent JSX rendering the AF initials
- Approximately 80px diameter (verify against actual sizing in the component)

WITH this pattern:
```jsx
<div className="[same wrapper classes as before — circular, sized identically]">
  <img
    src="/images/team/adam-fridman.jpg"
    alt="Adam Fridman, co-author of GTM for Professional Services"
    className="w-full h-full object-cover rounded-full"
    loading="lazy"
    width="80"
    height="80"
    onError={(e) => {
      // Fallback: if image fails to load, restore the AF initials display
      e.currentTarget.style.display = 'none';
      const fallback = e.currentTarget.parentElement?.querySelector('.af-initials-fallback');
      if (fallback) (fallback as HTMLElement).style.display = 'flex';
    }}
  />
  <span className="af-initials-fallback" style={{ display: 'none', /* same styles as the original AF initials */ }}>
    AF
  </span>
</div>
```

If the project uses <picture> with WebP fallback elsewhere, use the same pattern here:
```jsx
<picture>
  <source srcSet="/images/team/adam-fridman.webp" type="image/webp" />
  <img src="/images/team/adam-fridman.jpg" alt="Adam Fridman, co-author of GTM for Professional Services" className="w-full h-full object-cover rounded-full" loading="lazy" width="80" height="80" />
</picture>
```

STEP 4 — PRESERVE EVERYTHING ELSE:
The wrapper div's outer dimensions, gold border ring, background color, drop shadow, positioning, and surrounding layout MUST stay exactly as they are. Only the inner content changes from "AF" text to <img>. Do not adjust:
- The avatar's size, position, or alignment relative to the quote
- The Adam Fridman attribution text below or beside the avatar
- The quote copy ("I'm building this research with practitioners like you...")
- Any spacing, margin, or padding around the avatar
- Section 07's eyebrow, heading, or sub-elements
- Any other section above or below

DO NOT do any of the following — explicit redundant guardrails:

- Do NOT use any external image URL. The image MUST be loaded from /public/images/team/adam-fridman.jpg (a relative URL served from the same domain). No https://, no //, no CDN domains.
- Do NOT use a placeholder service (placeholder.com, picsum.photos, ui-avatars.com, gravatar.com, lorem-picsum, robohash, etc.).
- Do NOT generate the image with an AI image tool, prompt, or external API.
- Do NOT hot-link to LinkedIn, Twitter, Mabbly's marketing site, or any other host.
- Do NOT inline the image as a base64 data URI longer than 1KB. (Tiny SVG icons are fine, full headshots are not.)
- Do NOT change the alt text format other than what is specified above.
- Do NOT remove the lazy loading attribute. The avatar appears below the fold in Section 07 — lazy load is correct.
- Do NOT remove the explicit width and height attributes — they prevent layout shift while loading.
- Do NOT change Section 07's surrounding copy, the Adam Fridman quote, or the case study cards (Madcraft / Calliope / SPR) above the quote.
- Do NOT modify Section 06 (Why this research matters), Section 08 (Book a walkthrough), or any other numbered section.
- Do NOT add Tailwind classes that change the avatar's circular crop (object-cover and rounded-full are required).
- Do NOT introduce a CSS background-image instead of an <img> tag — semantic <img> is required for screen readers.
- Do NOT add any new npm dependencies (no next/image, no react-image, no image optimization libraries unless already installed).
- Do NOT install Next.js Image component — this is a Vite project, not Next.
- Do NOT add CDN integrations (Cloudinary, imgix, Cloudflare Images).
- Do NOT generate responsive srcSet variations (small/medium/large) unless specifically requested. The 800x800 source is sufficient for 80px display.
- Do NOT modify vite.config.ts, tailwind.config.ts, package.json, or tsconfig.json.
- Do NOT add the image to /src/assets/ — the project pattern is /public/ for static files served at the root URL.
- Do NOT commit any test image, debug image, or temporary placeholder file. Only the final adam-fridman.jpg/webp.
- Do NOT touch the wait theater (MagnetWaitTheater), the floating chat (MagnetChat.tsx), or any non-MAP component unless that component also displays the AF placeholder.
- Do NOT modify the orbit visualization, the Five Orbits component, or any SVG.
- Do NOT change the Supabase data fetch, the breakdown_data shape, or any TypeScript types.
- Do NOT add console.log, comments mocking the placeholder, or commented-out code.
- Do NOT change the firm-specific greeting ("For [Firm Name]") in any section.
- Do NOT introduce conditional rendering based on score band, vertical, or any other prop. The avatar shows for everyone, every time, no exceptions.
- Do NOT add image fallback chains beyond the one onError handler specified above. One fallback is enough.
- Do NOT compress, resize, or modify the image file itself. Use it as the user provides it. (If the user-provided file is over 200KB, output a warning recommending compression but use it anyway.)
- If the image is missing AT BUILD TIME (file not in /public/images/team/), the page should still render — the onError fallback handles runtime missing-image cases.
- Do NOT change the page's Open Graph image, favicon, or any other metadata image.
- Do NOT add an avatar to surfaces that don't currently have one. The change is replacement-only, not new placement.
- Do NOT touch the about page (/about) Adam photo placeholder — that's a separate ship item per the project ship log and uses a different photo (working photo, not headshot).
- Do NOT modify any code in /src/components/discover/, /src/components/aletheia/, /src/components/spr/, /src/components/awards/, /src/components/v1/, or /src/components/microsite/ unless those components display the AF placeholder being replaced.
- Do NOT run npm run build, npm run test, or npm run lint. Just make the edits.
- After the edit, do NOT auto-commit. Leave the changes staged for human review.

VERIFICATION AFTER EDIT:
- /public/images/team/adam-fridman.jpg exists in the project tree.
- Visit /m/agconsultingpartners (or any existing test slug) — Section 07 shows Adam's headshot in place of the "AF" initials.
- The avatar renders as a perfect circle with the existing gold border (or whatever ring treatment was on the placeholder).
- The avatar size matches the original placeholder (no layout shift).
- The Adam Fridman quote and attribution still render correctly beside the avatar.
- Open browser DevTools → Network tab → reload the page. The avatar request goes to /images/team/adam-fridman.jpg (same origin). NO external image requests for the avatar.
- Disable JavaScript and reload — the avatar still renders (it's a server-served static file, not JS-injected).
- Test on mobile (375px), tablet (768px), and desktop (1280px) — avatar scales correctly at every width.
- Test image-failure path: temporarily rename the file in /public/, reload — the AF initials fallback should appear instead of a broken image icon.
- Run grep across src/ for "AF" inside avatar components — no remaining placeholders should exist.

COMMIT MESSAGE (when staging the edit):
"Replace AF initials placeholder with Adam Fridman headshot in MAP Section 07 — local asset, no external hosting"

REPORT TO USER:
After the edit, report back:
1. List of files modified
2. List of locations where the AF placeholder was found (full file paths + line numbers)
3. The exact path of the image file used (/public/images/team/adam-fridman.jpg)
4. Confirmation that no external URLs were introduced
5. Any place you found the AF placeholder but DID NOT replace (with reason)
```

---

## Why these specific guardrails

The "no external hosting" rules are the most important block in the prompt. Lovable's default behavior with image replacements is often to:
1. Suggest a placeholder service URL (placeholder.com, ui-avatars.com)
2. Hot-link to a "found" image elsewhere on the web
3. Generate a base64 data URI for "convenience"
4. Recommend Cloudinary or imgix integration

All four are wrong for this use case. Ilan said "downloaded into the files on the creation" — meaning the asset is part of the build artifact, served from the same origin, no third-party dependency, no runtime fetching. Every guardrail above is calibrated against that single requirement.

The **STOP-and-ask if file missing** clause prevents the most common Lovable failure mode: when asked to replace an image and the asset isn't present, it confidently invents a URL or generates a placeholder. Forcing it to halt and report keeps the system honest.

---

## What you need to do before pasting this prompt

1. **Get a headshot of Adam.** Square crop, 800×800 ideal, under 100KB, head-and-shoulders. LinkedIn profile photo (downloaded, not hot-linked) works fine.
2. **Add it to the project.** Create the folder if needed: `/public/images/team/` and drop `adam-fridman.jpg` in there. (Optional: also generate a WebP version.)
3. **Commit the asset to the repo first**, before running the Lovable prompt. That way Lovable finds the file in STEP 2 and proceeds.
4. **Paste the prompt** into Lovable.

---

## After the edit ships

Same pattern applies to Richard Ashbaugh — when you're ready to add a Richard avatar to the same component (or to /about), reuse this prompt with `richard-ashbaugh.jpg` swapped for the file path. The "AF" → "RA" placeholder swap follows the identical template.

EDITH out.
