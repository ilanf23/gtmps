

# Redesign Book Cover — Lighter, Connected to Science of Story

## Concept
The Science of Story uses a **periodic table element** motif — a bold red square on white, with "St" as the element symbol, atomic number, and metadata. Clean, iconic, instantly recognizable.

The GTM book cover should follow the same visual system to read as a sequel/companion:
- **White/cream background** (not dark navy) — matches Science of Story's light cover and solves the "too dark" problem
- **Periodic table element** as the central graphic, but with the element "Gt" (for GTM), a different accent color (gold #B8933A instead of red), and relevant metadata (e.g., "Gt", "V. 1", "50")
- Same typographic hierarchy: large element symbol, book title below, subtitle, author names at bottom
- The orbit/concentric circle diagram could appear subtly behind or within the element card as a nod to the Relationship Revenue OS concept

## Technical Steps
1. Use AI image generation to create a new book cover inspired by the Science of Story periodic table design but in gold/cream tones
2. QA the generated image
3. Replace `src/assets/book-cover.png`
4. No code changes needed — both HeroSection and BookSection already import from that path

## Design Spec for Image Generation
- **Canvas**: 2:3 aspect ratio (book cover proportions)
- **Background**: White or off-white (#F5F0E8)
- **Central element**: Gold (#B8933A) square/card with "Gt" in large serif type, small "50" top-left (like atomic number), "gtm" or "growth" small text, "V. 1 · 50" below symbol
- **Title**: "GTM for Professional Services" in dark text below the element
- **Subtitle**: "The Relationship Revenue OS" in italic
- **Authors**: "ADAM FRIDMAN · RICHARD ASHBAUGH" at bottom
- **Subtle detail**: Thin concentric orbit lines behind or around the element card in light gold
- **Overall feel**: Clean, editorial, high-end, clearly a companion to Science of Story

