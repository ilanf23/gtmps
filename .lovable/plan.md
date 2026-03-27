

## Fix: Make Interior Page Half-Visible Behind Cover

The interior page is invisible because it sits at `left: 20` with `translateX(40px)` and `zIndex: -1`, which means it's almost entirely behind the 290px-wide front cover. At the current rotation angle, the 3D offset isn't enough to reveal it.

### Root cause
The `translateZ(-20px)` combined with `rotateY(-18deg)` only creates about 6px of apparent horizontal shift. Combined with `left: 20` and `translateX(40px)`, the page is still fully occluded by the 290px cover.

### Fix in `src/components/HeroSection.tsx`

**Move the interior page far enough right that half of it (roughly 145px) is visible past the cover's right edge:**

1. Change interior page positioning from `left: 20, translateX(40px)` to `left: 160px, translateZ(-20px)` — this pushes the page 160px to the right of the cover's left edge, so about 160px of its 290px width extends past the cover
2. Remove `zIndex: -1` — instead rely on `translateZ(-20px)` for proper 3D stacking (zIndex fights with preserve-3d)
3. Ensure the book wrapper container doesn't clip — verify no `overflow: hidden` on the preserve-3d wrapper

This will show the right half of the interior page fanning out behind the cover, making the chapter heading, body text, and pullquote clearly readable.

### Scope
- Single file: `src/components/HeroSection.tsx`
- Only the interior page div positioning changes (lines ~545–560)

