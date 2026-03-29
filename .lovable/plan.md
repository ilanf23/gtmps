

## Plan: Scale book image to 75%

Reduce all responsive image sizes to 75% of current values in `src/components/HeroSection.tsx` line 215:

| Breakpoint | Current | 75% |
|---|---|---|
| base | `max-w-[280px]` | `max-w-[210px]` |
| sm | `max-w-[360px]` | `max-w-[270px]` |
| md | `max-w-[420px]` | `max-w-[315px]` |
| lg | `w-[520px]` | `w-[390px]` |

Single line change in the `className` of the `<img>` element.

