## Three surgical fixes

### Audit of current state
- `/discover` nav (`src/pages/Discover.tsx`) `navItems` = `[Awards, Podcast]`. No About.
- `/about` nav (`src/pages/About.tsx`) `navItems` = `[Awards, Podcast]`. No About.
- `/awards` nav (`src/pages/Awards.tsx`) is a custom inline `AwardsNav` with hand-written `<Link>` rows for Awards + Podcast. No About.
- Footer typo `"100 practitioner interviews on YouTube"` lives in **both** `src/components/Footer.tsx:158` and `src/components/VerticalLanding/VerticalFooter.tsx:170`.
- `/discover` and `/about` never call `document.title` → both inherit the static `<title>` from `index.html` (`"GTM for Professional Services | Book Research by Mabbly"`).
- `/awards` already sets `document.title = 'GTM for Professional Services Awards · Mabbly'` (needs tweak to match spec).
- Vertical pages all flow through `VerticalLanding.tsx` which sets `document.title = ${vertical.name} · ${researchLabel ?? 'GTM Research'} · Mabbly`. So titles are driven by `name` + `researchLabel` in `src/content/verticals.ts`.

---

### FIX 1 — Add "About" to top nav (3 nav implementations)

**`src/pages/Discover.tsx`** — prepend About to `navItems`:
```ts
const navItems = [
  { label: "About", href: "/about", internal: true },
  { label: "Awards", href: "/awards", internal: true },
  { label: "Podcast", href: PODCAST_HREF, external: true },
];
```
The existing `navItems.map(...)` renderer in both desktop nav (line ~167) and mobile menu (line ~265) will pick it up automatically with identical Inter Tight 14px styling, gold hover, and `data-active` treatment.

**`src/pages/About.tsx`** — same change:
```ts
const navItems = [
  { label: "About", href: "/about", internal: true },
  { label: "Awards", href: "/awards", internal: true },
  { label: "Podcast", href: PODCAST_HREF, external: true },
];
```
Also confirm the existing active-state logic (`data-active` / current-page styling) flags About as active when on `/about`. If active state is derived from `useLocation().pathname`, no extra change needed; if hardcoded, set the About entry to render with the gold accent on this page.

**`src/pages/Awards.tsx`** — manually insert About into the bespoke `AwardsNav`:
- Desktop links block (between line 153 and 154):
  ```tsx
  <Link to="/about" className="an-link">About</Link>
  <Link to="/awards" className="an-link" data-active="true">Awards</Link>
  ```
- Mobile menu (between the verticals loop ending line 176 and the existing Awards mobile link line 177):
  ```tsx
  <Link to="/about" className="an-mobile-link" onClick={() => setOpen(false)}>About</Link>
  ```

**Footer About link**: already present in both `Footer.tsx` (line 207) and `VerticalFooter.tsx` (line 186). Leave untouched — both paths supported as requested.

---

### FIX 2 — Footer "100" → "500"

Two surgical string edits, both copy:
```
100 practitioner interviews on YouTube.
```
to:
```
500 practitioner interviews on YouTube.
```

Files:
- `src/components/Footer.tsx:158`
- `src/components/VerticalLanding/VerticalFooter.tsx:170`

---

### FIX 3 — Per-page meta titles

**`src/pages/Discover.tsx`** — add a `useEffect` at the top of the `Discover` page component:
```ts
useEffect(() => {
  document.title = "Discover · GTM for Professional Services · Mabbly";
}, []);
```

**`src/pages/About.tsx`** — same pattern in the `About` component:
```ts
useEffect(() => {
  document.title = "About · Mabbly";
}, []);
```

**`src/pages/Awards.tsx:192`** — change existing line to:
```ts
document.title = 'GTM for PS Awards · Mabbly';
```

**`src/content/verticals.ts`** — vertical titles are built as `${name} · ${researchLabel} · Mabbly`. Set `researchLabel` per spec (and adjust `name` only where needed to match exact wording):

| Slug | Required title | `name` | `researchLabel` |
|---|---|---|---|
| law | `Law Firms · Origination Strategy Research · Mabbly` | `Law Firms` | `Origination Strategy Research` |
| consulting | `Management Consulting · Practice Growth Research · Mabbly` | `Management Consulting` | `Practice Growth Research` (no change) |
| accounting | `Accounting & Tax · Client Development Research · Mabbly` | `Accounting & Tax` | `Client Development Research` (no change) |
| msp | `MSP & IT Services · GTM Research · Mabbly` | `MSP & IT Services` | unset (falls back to `GTM Research`) — verify and remove any current override if present |
| advisory | `Financial Advisory · Prospecting Research · Mabbly` | `Financial Advisory` | `Prospecting Research` |
| ae | `Architecture & Engineering · BD Research · Mabbly` | `Architecture & Engineering` | `BD Research` |
| recruiting | `Executive Search · Mandate Origination Research · Mabbly` | `Executive Search` | `Mandate Origination Research` (no change) |
| agency | `Marketing & Creative · New Business Research · Mabbly` | `Marketing & Creative` | `New Business Research` (no change) |

For each vertical, I'll verify the current `name` field matches the required prefix; if any differ, I'll only update `researchLabel` (and `name` only if absolutely required). This keeps in-page hero/eyebrow copy untouched — the spec only requires the **document `<title>`** to match.

---

### Files to be modified
1. `src/pages/Discover.tsx` — nav + title `useEffect`
2. `src/pages/About.tsx` — nav + title `useEffect`
3. `src/pages/Awards.tsx` — insert About link (desktop + mobile) + title string
4. `src/components/Footer.tsx` — 100 → 500
5. `src/components/VerticalLanding/VerticalFooter.tsx` — 100 → 500
6. `src/content/verticals.ts` — `researchLabel` adjustments for law, advisory, ae (and verify msp falls through to default)

### Verification after ship
1. Top nav on `/discover`, `/about`, `/awards` shows About between For Your Firm and Awards.
2. Click About → `/about` loads; About link shows gold active state on that page.
3. Footer Across Mabbly Podcast row reads "500 practitioner interviews on YouTube." on every page.
4. Browser tab title matches spec on each of the 11 routes listed.
5. No regressions: For Your Firm dropdown, Add Your Firm CTA, Podcast link unchanged.