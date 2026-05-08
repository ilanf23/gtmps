## Remove the "Definition · First Use" eyebrow label

The small label above "The Dead Zone" definition pull on every vertical landing page reads "Definition · First Use", which is editorial jargon and reads oddly to visitors. Remove the label entirely while keeping the term ("The Dead Zone") and its body copy intact.

### Change

In `src/pages/verticals/_template/VerticalPage.tsx` (Section 03 · Reality, around line 483), delete the single line:

```tsx
<span className="definition-pull-mark">Definition · First Use</span>
```

The surrounding `<aside class="definition-pull">` keeps the term heading and body paragraph, so the block still reads cleanly as a defined term call-out.

### Scope

Affects all eight vertical landing pages (`/consulting`, `/law`, `/accounting`, `/msp`, `/advisory`, `/ae`, `/recruiting`, `/agency`) since they share the template. No data file changes needed. No CSS cleanup required (the `.definition-pull-mark` class can stay unused; it is scoped to this template only).