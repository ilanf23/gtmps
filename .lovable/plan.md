

# Fix Index Page Social Share Preview

## Problem
The `og:image` in `index.html` points to an auto-generated full-page screenshot URL from Lovable's preview system. Social platforms resize this tall image into the 1200×630 card format, producing the banded/squished appearance.

## Solution
Create and use a dedicated 1200×630px OG image for the index page, similar to how `/pepper-group` already uses `og-pepper-group.jpg`.

### Steps

1. **Design a proper OG image** (1200×630px) — dark background with the book title "GTM for Professional Services: The Relationship Revenue OS", Mabbly branding, and a tagline. Generated programmatically or provided by you.

2. **Save to `public/og-index.png`** and update `index.html` to reference it:
   ```html
   <meta property="og:image" content="https://discover.mabbly.com/og-index.png">
   <meta name="twitter:image" content="https://discover.mabbly.com/og-index.png">
   ```

### Option
If you have a designed OG image ready, upload it and I'll wire it in. Otherwise I can generate one programmatically using the site's brand colors (dark navy `#0D1117`, gold `#B8933A`, cream `#FBF8F4`) with the title text.

