

## Make the Book Mockup Look Like a Real Book

The current implementation renders two flat divs side by side with a thin spine line. It looks like two cards, not a book. The fix is to add **physical depth and realistic book details** using CSS 3D techniques.

### Key problems with current approach
- No visible book thickness (spine is just a 2px line)
- No page edges visible from the side
- Cover has no depth or material difference from interior page
- Flat lighting, no gradient shading that suggests a curved surface

### What changes in `src/components/HeroSection.tsx`

**1. Add a real 3D spine with depth**
- The spine becomes a 30px-wide div with `transform: rotateY(90deg)` positioned between cover and interior page using `preserve-3d`
- Background: dark leather/cloth gradient (#3a3020 to #2a2018) to simulate binding material
- This gives the book actual Z-depth

**2. Add visible page edges (fore-edge)**
- A thin strip (6-8px) on the right side of the right page, slightly recessed, showing stacked page lines
- Use a repeating linear gradient of alternating #e8e0d0 and #d8d0c0 at 1px intervals to simulate cut paper edges
- Transform with `rotateY(90deg)` on the right edge

**3. Make the cover feel like a hard cover**
- Add a 3-4px border/frame effect on the left page to simulate the cover board being slightly larger than the text block
- Darken the cover background slightly compared to interior (#ebe5d4 vs #f5f0e2) or add a subtle linen texture
- Add a very subtle emboss effect on the cover title text using text-shadow

**4. Improve the spine shadow between pages**
- Replace the flat 2px div with a radial gradient shadow that darkens toward the center gutter
- Add `inset` box-shadows on both pages that are stronger near the spine: `inset -8px 0 16px rgba(0,0,0,0.12)` on the left page, `inset 8px 0 16px rgba(0,0,0,0.08)` on the right

**5. Add page stack effect beneath**
- 2-3 thin offset divs (1px each) behind the book pair, shifted 2px down and 1px right each, in slightly different cream tones
- This creates the illusion of multiple pages beneath the visible spread

**6. Enhance the 3D transform and shadow**
- Keep `perspective(1200px) rotateY(-6deg) rotateX(3deg)` 
- Add a soft ambient glow beneath: a blurred ellipse shadow on a pseudo-element below the book

### Technical approach
- All changes are pure inline CSS, no external libraries
- Use `transformStyle: preserve-3d` on the book container to enable true 3D child positioning
- Page stack divs are absolutely positioned behind the main pages
- The spine depth div uses `translateZ()` to sit between the two pages in 3D space

### Scope
- Single file: `src/components/HeroSection.tsx`
- No content, color palette, typography, or left-column changes

