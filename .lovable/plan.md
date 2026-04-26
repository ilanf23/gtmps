I found the root issue: the current implementation only adds a small client logo and only tints one active nav underline if a `theme-color` meta tag exists. For Maverich, the website has no `theme-color`, so the microsite falls back to Mabbly gold. Also, the Read, Chat, and Feedback pages render the shared shell without loading the client branding at all. The result is technically co-branded, but not actually customized to the client's website.

Plan to fix the personalized microsite branding

1. Upgrade brand extraction during microsite generation
   - Keep Firecrawl out of the flow.
   - Expand the current direct website crawl to extract a richer brand profile from HTML, CSS, meta tags, and visible page styles.
   - Capture:
     - Logo candidates, prioritizing true logo assets over `og:image` screenshots.
     - Primary accent color from buttons, CSS variables, gradients, inline styles, and repeated brand colors.
     - Background color and text style signals.
     - Font family from Google Fonts and CSS.
     - A compact brand profile JSON for future use.
   - For Maverich specifically, this should detect the black/white foundation and orange accent visible on the site, instead of returning `client_brand_color: null`.

2. Store a real client theme, not just logo/color
   - Add database fields such as:
     - `client_accent_color`
     - `client_background_color`
     - `client_text_color`
     - `client_font_family`
     - `client_brand_profile` JSON
   - Update the public breakdown RPC so the app can load these theme values securely by slug.
   - Preserve the existing columns so current microsites do not break.

3. Centralize branding across every microsite page
   - Create a shared client branding loader for `/m/:slug`, `/m/:slug/chat`, `/m/:slug/read`, and `/m/:slug/feedback`.
   - Make `MagnetShell` use the slug to fetch branding if it was not already provided.
   - Ensure the nav, Read page, Talk to the Book page, Feedback page, and loading experience all receive the same client theme.

4. Rebuild the microsite visual system around dynamic theme variables
   - Keep the Mabbly/RROS structure, but make the page feel client-specific.
   - Apply the client's brand theme to:
     - Page background and subtle gradients.
     - Header divider and active tabs.
     - Loading orbit animation.
     - Section labels.
     - Formula assessment cards.
     - Orbit numerals and ring accents.
     - Starting layer chip.
     - Quick win numbering.
     - Book/chat send buttons and focus states.
   - Add safe contrast handling so light client colors do not create unreadable text.
   - Fall back to the current Mabbly warm editorial palette if extraction fails.

5. Fix this existing Maverich microsite
   - Backfill branding for the already-created slug `ilan_2izvdg78iy`.
   - Update its stored brand profile so the current page reflects Maverich's black/white/orange look without requiring the user to resubmit the assessment.

6. Validate the experience
   - Check that the generated breakdown still loads.
   - Verify the nav logo appears correctly.
   - Verify `/m/ilan_2izvdg78iy`, `/m/ilan_2izvdg78iy/chat`, `/m/ilan_2izvdg78iy/read`, and `/m/ilan_2izvdg78iy/feedback` share the same client theme.
   - Confirm existing microsites without extracted branding still render cleanly with the Mabbly fallback.

Technical notes

- I will not edit the generated backend client or generated backend types directly.
- I will use Lovable Cloud migrations for the database changes.
- I will keep the extractor dependency-free: direct fetch plus HTML/CSS parsing, no Firecrawl connector.
- I will keep the OpenAI map and Talk to the Book context intact. This change is focused on how the generated microsite is themed and branded.