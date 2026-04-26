# Three Surgical Fixes

## Scope summary

| Fix | Files touched | Risk |
|---|---|---|
| 1. About in top nav | `src/pages/Discover.tsx`, `src/pages/About.tsx`, `src/pages/Awards.tsx` | Low |
| 2. Footer "100 → 500" typo | `src/components/Footer.tsx`, `src/components/VerticalLanding/VerticalFooter.tsx` | Trivial |
| 3. Per-page meta titles | `src/pages/Discover.tsx`, `src/pages/About.tsx`, `src/pages/Awards.tsx`, `src/content/verticals.ts` (one helper edit in `VerticalLanding.tsx`) | Low |

No new components, no routing changes, no DB work. About link in footer bottom strip stays as-is per requirement.

---

## Fix 1 — Add "About" link to top nav (between For Your Firm and Awards)

The site has **three independent nav implementations**, each with its own desktop and mobile menus. All three need the same edit.

### 1a. `src/pages/Discover.tsx` (Discover page TopNav)

The `navItems` array drives both desktop and mobile renderers.

```ts
// line 39-42 — current
const navItems = [
  { label: "Awards", href: "/awards", external: false, internal: true },
  { label: "Podcast", href: PODCAST_HREF, external: true },
];

// becomes
const navItems = [
  { label: "About", href: "/about", external: false, internal: true },
  { label: "Awards", href: "/awards", external: false, internal: true },
  { label: "Podcast", href: PODCAST_HREF, external: true },
];
```

That single change cascades through both the desktop list (line 167) and the mobile list (line 265). Active state is not currently rendered on this nav (it lives on `/discover` only), so no extra work needed here.

### 1b. `src/pages/About.tsx` (About page TopNav)

Same `navItems` array structure (line 17-20). Apply the same insertion. **Important:** since the user is on `/about` when this nav renders, give the About link an active-state color treatment matching how `/awards` highlights itself in the Awards nav (gold `#B8933A`). Inline the active style on the About `<Link>` only (not via `data-active` since this nav doesn't have that CSS hook).

```ts
// Insert About first, mark it visually active when on /about
{ label: "About", href: "/about", internal: true, active: true },
```

In the JSX, conditionally apply `color: "#B8933A"` when `n.active` is true (overriding the default `linkColor`). Same on mobile.

### 1c. `src/pages/Awards.tsx` (Awards page AwardsNav)

This nav uses scoped CSS classes (`.an-link`, `.an-link[data-active="true"]`). Add About **before** the Awards link, both desktop (around line 154) and mobile (around line 177).

```tsx
// desktop, between For Your Firm dropdown and Awards
<Link to="/about" className="an-link">About</Link>
<Link to="/awards" className="an-link" data-active="true">Awards</Link>

// mobile, between vertical list and Awards
<Link to="/about" className="an-mobile-link" onClick={() => setOpen(false)}>About</Link>
```

The existing `.an-link:hover` rule already handles hover. The `data-active="true"` selector is reserved for the page's own link, so on `/awards` the About link stays in default color — correct.

### Acceptance for Fix 1
- Top nav order on `/discover`, `/about`, `/awards`: **For Your Firm ▼ | About | Awards | Podcast | Add Your Firm →**
- About is gold/active when on `/about`
- About is default color (not active) on `/discover` and `/awards`
- Hamburger menu on mobile shows About in the same order
- Footer About link in bottom strip is **not removed** — keeps both paths

---

## Fix 2 — Footer "100 → 500" typo

Two places, identical change.

### 2a. `src/components/Footer.tsx` line 158

```diff
- 100 practitioner interviews on YouTube.
+ 500 practitioner interviews on YouTube.
```

### 2b. `src/components/VerticalLanding/VerticalFooter.tsx` line 170

```diff
- <span className="vf-am-desc">100 practitioner interviews on YouTube.</span>
+ <span className="vf-am-desc">500 practitioner interviews on YouTube.</span>
```

That covers every page (Discover, About, Awards, magnet pages all use `Footer.tsx`; verticals use `VerticalFooter.tsx`).

I checked `src/components/v1/Footer.tsx` — the legacy footer does not contain this descriptor, and is only mounted on `/1` (the V1 archive). Leaving it untouched.

---

## Fix 3 — Per-page meta titles

Currently:
- `/discover` and `/about` inherit `index.html`'s static `<title>GTM for Professional Services | Book Research by Mabbly</title>`.
- `/awards` already sets a title but with slightly different copy than spec.
- Vertical pages compute `${vertical.name} · ${researchLabel ?? 'GTM Research'} · Mabbly`. Spec wants different copy for several.

### 3a. Add `useEffect` title setters to `/discover` and `/about`

`src/pages/Discover.tsx` — add inside the `Discover` component (alongside the existing scroll-restoration effect, or as a new effect):

```ts
useEffect(() => {
  document.title = 'Discover · GTM for Professional Services · Mabbly';
}, []);
```

`src/pages/About.tsx` — add inside the `About` component:

```ts
useEffect(() => {
  document.title = 'About · Mabbly';
}, []);
```

(`useEffect` is already imported in both files.)

### 3b. Update Awards title string

`src/pages/Awards.tsx` line 192:

```diff
- document.title = 'GTM for Professional Services Awards · Mabbly';
+ document.title = 'GTM for PS Awards · Mabbly';
```

### 3c. Vertical page titles — content-data approach

The cleanest fix is to update `researchLabel` (and one `name`) in `src/content/verticals.ts` so the existing `${name} · ${researchLabel} · Mabbly` template produces exactly the spec strings. No code changes to `VerticalLanding.tsx`.

Required spec → current → action:

| Slug | Spec title | Current `name` | Current `researchLabel` | Edit |
|---|---|---|---|---|
| law | `Law Firms · Origination Strategy Research · Mabbly` | `Law Firms` | `Origination Research` | researchLabel → `Origination Strategy Research` |
| consulting | `Management Consulting · Practice Growth Research · Mabbly` | `Management Consulting` | `Practice Growth Research` | none ✓ |
| accounting | `Accounting & Tax · Client Development Research · Mabbly` | `Accounting & Tax` | `Client Development Research` | none ✓ |
| msp | `MSP & IT Services · GTM Research · Mabbly` | `MSP & IT Services` | (none, falls back to `GTM Research`) | none ✓ |
| advisory | `Financial Advisory · Prospecting Research · Mabbly` | `Financial Advisory` | `Prospecting Strategy Research` | researchLabel → `Prospecting Research` |
| ae | `Architecture & Engineering · BD Research · Mabbly` | `Architecture & Engineering` | `Business Development Research` | researchLabel → `BD Research` |
| recruiting | `Executive Search · Mandate Origination Research · Mabbly` | `Executive Search` | `Mandate Origination Research` | none ✓ |
| agency | `Marketing & Creative · New Business Research · Mabbly` | `Marketing & Creative` | `New Business Research` | none ✓ |

Three single-line `researchLabel` edits in `src/content/verticals.ts` (law line 177, advisory line 409, ae line 483). No JSX touched.

**Risk note:** `researchLabel` is also used as the `diagnosticEyebrow` fallback in some places — I'll grep to confirm it isn't surfaced in user-visible body copy elsewhere. If it is, I'll add a separate `metaTitle` field on `VerticalContent` instead and switch the title template to prefer it. Default plan assumes researchLabel is title-only.

### Acceptance for Fix 3
Open each route in a fresh tab, browser tab title equals the exact spec string above. Verify by opening 4-5 tabs side-by-side.

---

## Out of scope (intentionally not touching)

- `/`, `/1`, `/manuscript`, `/spr`, `/pepper-group`, `/google`, `/m/:slug`, `/book`, `/assess` — not in spec
- Footer About link (already shipped, stays)
- Top-nav About on the magnet/microsite pages (different shells, not in spec)
- React Helmet — overkill for 11 simple titles; `document.title` in `useEffect` is the established pattern in this codebase

---

## Test plan after ship

1. `/discover` — top nav shows For Your Firm ▼ | About | Awards | Podcast. About not highlighted. Tab title: `Discover · GTM for Professional Services · Mabbly`.
2. Click About → `/about` loads. About link is gold. Tab title: `About · Mabbly`.
3. `/awards` — About present, Awards highlighted gold. Tab title: `GTM for PS Awards · Mabbly`.
4. Footer (any page using `Footer.tsx` or `VerticalFooter.tsx`) — Podcast item reads "500 practitioner interviews on YouTube."
5. Visit each of the 8 vertical pages, confirm tab title matches the spec table above.
6. Mobile (375px): hamburger menu on `/discover`, `/about`, `/awards` shows About in the same order between For Your Firm verticals and Awards.
