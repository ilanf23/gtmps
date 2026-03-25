
Fix the remaining Apply Now hover issue in `src/components/StickyNav.tsx`.

What is actually wrong:
The top navigation CTA still uses inline `style={{ color: "white" }}`. That inline color overrides Tailwind’s `hover:text-ink`, so when the button background turns white on hover, the text stays white and appears to disappear. The screenshot matches this exact conflict.

Implementation plan:
1. Update the desktop nav CTA in `StickyNav.tsx`.
2. Move the text color from inline styles into Tailwind classes, just like the earlier fix in the form button.
3. Keep the white hover background, but let `hover:text-ink` take effect by removing the inline `color`.
4. Optionally move the border into Tailwind too, so the button styling is fully consistent and avoids future specificity issues.
5. Verify the default state stays white text on dark background, and the hover state becomes white background with dark text.

Technical details:
Current problem area:
```tsx
className="hidden md:inline-flex ... hover:bg-white hover:text-ink"
style={{
  border: "1px solid rgba(255,255,255,0.25)",
  color: "white",
  padding: "8px 24px",
}}
```

Target approach:
```tsx
className="hidden md:inline-flex ... text-white border border-white/25 hover:bg-white hover:text-ink"
style={{ fontSize: 13, padding: "8px 24px" }}
```

Files to update:
- `src/components/StickyNav.tsx`

Scope:
- One file
- No layout changes
- No copy changes
- No backend work
