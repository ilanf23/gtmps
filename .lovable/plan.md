

## Plan: Replace CSS book with uploaded images

The right column of HeroSection currently renders a complex CSS/HTML 3D book (~300 lines of markup). Replace it with the two uploaded images used as an actual image element.

### Steps

1. **Copy images to project**
   - Copy `Screenshot_2026-03-29_at_9.45.44_AM.png` to `src/assets/book-open.png` (the open book spread)
   - Copy `Screenshot_2026-03-29_at_9.45.59_AM.png` to `src/assets/book-cover.png` (the full cover)

2. **Simplify HeroSection right column**
   - Remove the entire CSS 3D book markup (the `perspective` container with left page, spine, right page — roughly lines 260–610)
   - Replace with a single `<img>` element importing `book-open.png`, styled with subtle shadow and hover tilt transform to maintain the premium feel
   - Keep the edition label below the image
   - Keep the `pageHover` state for a gentle CSS transform on hover

3. **Responsive considerations**
   - Set `max-width: 100%` on the image so it scales on smaller screens
   - Adjust the grid gap and padding for mobile via a media query or container query approach

### Technical details
- Import images via ES6: `import bookOpen from "@/assets/book-open.png"`
- The right column will go from ~350 lines of inline-styled divs to ~20 lines
- The `pageHover` state and mouse handlers stay to provide a subtle 3D tilt effect on the image

