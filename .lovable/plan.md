

# discover.mabbly.com — Book Research Landing Page

## Overview
A single-page editorial application for "GTM for Professional Services: The Relationship Revenue OS" by Adam Fridman and Richard Ashbaugh. The page drives managing partners at professional services firms to apply for a 60-minute research session. It uses a rich editorial design system with custom fonts (Cormorant Garamond, Instrument Sans, DM Mono), a parchment/ink/gold palette, and scroll-triggered animations throughout.

## Design System
- **Palette**: Parchment (#FAF7F2), Warm (#EDE8DF), Ink (#0D1117), Gold (#B8933A), Sage (#3D5A4A), Rust (#8B3A2A), Slate (#5A6A7A)
- **Typography**: Cormorant Garamond (display headings), Instrument Sans (body), DM Mono (labels/nav/eyebrows)
- **Animations**: Every section fades in + rises 20px on scroll via IntersectionObserver with 80ms staggered children
- **Rules**: No hyphens/dashes in text, no passive voice, mobile-first responsive

## Sections (8 + nav + footer)

1. **Sticky Sub-Navigation** — Dark bar with MABBLY wordmark (links to mabbly.com), 5 section links (desktop), and pulsing gold "APPLY NOW — 46 SPOTS LEFT" button

2. **Hero (100vh, dark)** — Two-column layout with headline, subhead, urgency strip (46/50 remaining), dual CTAs, 3 stat pills, and 3D book cover display with upload placeholders

3. **The Mission** — Why the book exists, 3 numbered pillars (The Problem, The Window, The Research), and a callout box referencing The Science of Story

4. **The Episode** — YouTube embed of the Signal Activated Growth episode that coined "The Dead Zone," with podcast link pills

5. **The Book** — Framework overview with 4 content cards (Dead Zone, Relationship Revenue OS, Signal Activated Growth, Three Laws), pull quote, and publication timeline with milestone markers

6. **The Authors** — Side-by-side cards for Adam Fridman and Richard Ashbaugh with photo placeholders, bios, credential pills, and links

7. **Go Deeper** — 3 article preview cards, plus dark email capture strip for article subscription

8. **Results Strip (dark)** — 6 stat cards showing real results ($400K deal, 8.1% reply rate, etc.)

9. **Apply Section** — Full application form with 8 fields (name, firm, role, type, revenue, employees, challenge, source), submit with inline success message, urgency note

10. **Footer** — Three-column dark footer with links to mabbly.com, mabbly.ai, podcast, and copyright

## Technical Approach
- Single Index.tsx page with component sections
- Custom CSS variables in index.css matching the provided design system
- Google Fonts loaded in index.html
- IntersectionObserver hook for scroll animations
- Form state managed with React useState, inline success message on submit
- Smooth scrolling with scroll-padding for sticky nav offset
- All responsive breakpoints handled with Tailwind + custom styles

