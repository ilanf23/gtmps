

## Replace Hero Subhead with Premium Book Page Preview

**What changes**: Remove the paragraph of text below the headline in HeroSection. Replace it with a styled "book page" component that shows Chapter One content from the uploaded HTML, creating a two-piece visual: the book cover on the right + an open page preview integrated into the left column.

### Changes in `src/components/HeroSection.tsx`

1. **Remove** the subhead paragraph (lines 105-116) — the block starting with "GTM has one universally accepted definition..."

2. **Replace with a book page component** styled to look like a premium printed page:
   - Cream/parchment background (`#f5f0e2`) with subtle box shadow to look like paper
   - "Chapter One" eyebrow with gold rule
   - Italic headline "The founding problem"
   - Title "The Wrong Map" in serif
   - 2-3 body paragraphs from the uploaded HTML (the core content about the wrong GTM assumption)
   - Pull quote at the bottom: "You were not bad at GTM. You were using the wrong map."
   - Page number "12" at bottom center
   - Slightly rotated (~1-2deg) for a premium, editorial feel
   - Max width ~400px, compact so it fits the left column without overwhelming the headline

3. **Keep everything else**: eyebrow, headline, urgency strip, CTA buttons, stat strip all remain unchanged.

### Design details
- Use serif fonts (Playfair Display / EB Garamond via Google Fonts import or fallback to Georgia)
- The page sits between the headline and the urgency strip
- On mobile, the page appears between the book cover and the CTAs
- Subtle gold accents on the chapter rule and pull quote borders to tie into the site's gold palette
- The combination of the 3D book cover (right) and this open page (left) creates a "cover + interior" pairing

### Files
- `src/components/HeroSection.tsx` — single file edit

