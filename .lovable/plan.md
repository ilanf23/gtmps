

## Fix Apply Button Hover State

**Problem**: The button's `background` is set via inline `style`, which has higher CSS specificity than Tailwind's `hover:bg-[#C9A845]` class. On hover, the inline style wins, and the button appears white/broken.

**Fix in `src/components/ApplySection.tsx`** (line 172-177):

Move the background color from inline `style` to Tailwind classes so hover works properly:
- Remove `background: "#B8933A"` from the `style` prop
- Add `bg-[#B8933A]` to the className
- Keep `hover:bg-[#C9A845]` in className (already there)
- Keep `color: "#0D1117"` in style (or move to className too)

Single line change, one file.

