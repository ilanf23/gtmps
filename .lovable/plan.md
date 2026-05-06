# Switch all Calendly CTAs from Adam to Richard

Replace every Adam Calendly URL (`calendly.com/adam-fridman/30min` and `calendly.com/adam-mabbly/gtm`) with **`https://calendly.com/richard-mabbly`** so all "Book a call" CTAs route to Richard.

## Locations found (16 code references across 12 files)

### Components
1. `src/components/ApplySection.tsx:186` — visible link text
2. `src/components/v1/ApplySection.tsx:181` — visible link text (legacy /v1)
3. `src/components/aletheia/AletheiaNav.tsx:43` — top nav "BOOK WORKING SESSION"
4. `src/components/aletheia/AletheiaHero.tsx:55` — hero CTA
5. `src/components/aletheia/AletheiaFinalCTA.tsx:51` — final CTA
6. `src/components/pepper/PepperContentEngine.tsx:229` — Pepper microsite CTA

### Pages / microsites
7. `src/pages/MagnetBook.tsx:118` — Calendly inline embed `data-url` (currently `adam-mabbly/gtm`, includes branded colors. Will keep query string params and only swap the user slug.)
8. `src/pages/microsites/Google.tsx` — lines 13, 77, 357 (3 buttonUrl entries in SITE_DATA)
9. `src/pages/microsites/PepperGroup.tsx` — lines 17, 81, 356 (3 buttonUrl entries)

### Library / config
10. `src/lib/calendly.ts:9` — `BASE_URL` constant (single source of truth used by `lib/calendly.ts` helpers). Also update the doc comment on line 3.

### Edge function
11. `supabase/functions/magnet-chat/index.ts:130` — system prompt instructs the AI to share `calendly.com/adam-mabbly/gtm` in fallback. Update to Richard's link.

## Notes / decisions

- **Scope**: only code + edge function. Markdown docs (CLAUDE.md, docs/*, edith-*.md, lovable-prompt-*.md) reference the old link historically. Leaving them as is unless you want them updated too.
- **Path suffix**: Richard's link has no `/30min` suffix. Using `https://calendly.com/richard-mabbly` exactly as you specified everywhere. For the `MagnetBook.tsx` embed, will preserve the existing query string (`?hide_gdpr_banner=1&background_color=...`) and only swap the user/event path.
- **Memory update**: project core memory currently says "Primary Calendly link is https://calendly.com/adam-fridman/30min". Will update `mem://index.md` Core rule to point to Richard's link so future work doesn't regress.

## Out of scope

- No copy/label changes (buttons still say "Book a Call", "Book Working Session", etc.).
- Not rewriting docs/changelog/strategy files.
- Not changing analytics event names that contain "adam" (none found in the matched lines).

After approval I'll make all edits in one pass and update the memory rule.
