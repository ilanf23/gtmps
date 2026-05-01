## Reduce gap between CH numbers and titles

In `src/components/aletheia/AletheiaChapters.tsx`, the chapter row is a 12-column grid where the CH label takes col-span-2 and the title takes col-span-10, leaving a large empty space between them.

### Change
- Shrink the CH label column from `md:col-span-2` to `md:col-span-1`
- Expand the title column from `md:col-span-10` to `md:col-span-11`
- Reduce grid `gap-4` to `gap-2` to further tighten the spacing

This pulls the chapter title much closer to the "CH 0X" label while keeping the gold left border and overall row rhythm intact.
