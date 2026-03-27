

## Add Interior Page Back to the 3D Book

The current book only shows the front cover. The previous version had a second page (interior/chapter page) visible as part of the open spread. It needs to come back, positioned behind the front cover in the 3D space.

### Changes in `src/components/HeroSection.tsx`

**Add an interior page div after the front cover (after line 542), inside the book wrapper.**

The interior page will be:
- Same dimensions as the cover (290×404)
- Positioned with `translateZ(-16px) translateX(16px)` so it peeks out from behind the right edge of the front cover, visible as a sliver suggesting the book is slightly open
- Background `#f5f0e2` (warmer cream, distinct from the cover)
- Contains the Chapter One content from the original spec:
  - "CHAPTER ONE" header with gold line
  - "The founding problem" subtitle in italic
  - "The Wrong Map" title in Playfair Display bold
  - Two body paragraphs in 11px, justified
  - Pullquote block with top/bottom borders: "You were not bad at GTM. You were using the wrong map."
  - Page number "12" centered at bottom
- Padding 32px 28px
- Subtle inset shadow on the left edge to simulate gutter shadow

This keeps the 3D closed-book silhouette while showing the interior page peeking out behind it, giving the impression of a slightly fanned book.

### Scope
- Single file: `src/components/HeroSection.tsx`
- No left column, color, or typography changes

