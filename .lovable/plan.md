## Change
In `src/pages/About.tsx`, Section 12 (`id="press"`):

- Replace the `mailto:press@mabbly.com` link with `mailto:adam@mabbly.com`
- Replace the visible link text `press@mabbly.com` with `adam@mabbly.com`
- Leave everything else (eyebrow, headline, " · Based in Chicago, Illinois", styling, hover behavior) untouched

## Out of scope
- No other files change
- No nav, footer, or SEO copy changes
- No styling changes

## Verify
1. `/about` Press section shows `adam@mabbly.com · Based in Chicago, Illinois`
2. Clicking the email opens the mail client to `adam@mabbly.com`
3. Underline + gold hover state preserved