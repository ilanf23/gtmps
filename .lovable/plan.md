## Goal

Stop the Narrio-style failure where the extractor grabs a third-party "works with" logo (Zendesk, Intercom, etc.) instead of the prospect's own brand mark. Default to **no logo** whenever confidence is low. The microsite already renders cleanly without a logo, so a missing logo is strictly safer than a wrong one.

## Where the bug lives

`supabase/functions/_shared/extract-branding.ts` → `findLogoUrl(html, baseUrl)`.

Today's scoring lets an `<img>` win on circumstantial signals (sits in header + filename contains "logo"). For Narrio, a Zendesk integration logo embedded in a partners strip near the top of the page outscored the real `narrio.svg`.

## Plan

### 1. Add a same-origin / brand-name confidence gate (primary fix)

Inside `findLogoUrl`, after candidate scoring, before returning a winner:

- Compute `baseHost` (e.g. `narrio.app`) and `domainRoot` (already computed: `narrio`).
- Maintain a small denylist of third-party CDN/host fragments that are almost never the prospect's own logo when found on a marketing page:
  `zendesk, intercom, hubspot, salesforce, segment, slack, zapier, stripe, shopify, mailchimp, atlassian, jira, asana, monday, notion, gravatar, cloudfront-` (generic CF buckets are still allowed if they match the brand).
- For every candidate `<img>` whose `src` resolves to a host that is **not** the prospect's host or a subdomain of it:
  - Apply `score -= 25` (knock it out of contention vs. any reasonable same-origin candidate).
  - If the host substring matches the denylist, set `score = 0` (disqualify).
- Add a positive boost for same-origin: `if (resolvedHost === baseHost || endsWith('.'+baseRegistrable)) score += 8`.

### 2. Require a positive logo signal for the winner (safety gate)

After sorting, the top candidate must satisfy at least one of:

- It is the inline header `<svg>` (already trusted).
- It is an SVG/PNG favicon link (`rel=icon` / `mask-icon` / `apple-touch-icon`).
- It is same-origin **and** has at least one of: `domainRoot` in src or alt, `logo` token in src/alt/class/id, or sits in `<header>`/`<nav>` with no negative context.

If nothing passes the gate, return `null`. The microsite already handles `client_logo_url = null` gracefully (header just shows the company name).

### 3. Filename / alt brand-name match bonus

Add a soft bonus when `domainRoot` (≥3 chars) appears as a whole token in the filename (`/narrio.svg`, `narrio-logo.png`) rather than just substring. Tightens the existing `srcLower.includes(domainRoot)` check by also matching against the path basename to avoid coincidental hits.

### 4. Validation step: confirm asset still passes existing HEAD check

Keep the existing `validateLogoAsset` (allowed content types, <500KB). No change.

### 5. Backfill the Narrio row to clear the bad cached value

Already done in the prior turn (manual `UPDATE` to the correct `narrio.svg`). No code change needed here, but verify the row still shows the correct URL after migration.

### 6. Add a debug log line

Log the final winner + score + source (`inline-svg` / `same-origin-img` / `favicon` / `null`) so future regressions show up in `enrich-magnet` logs without re-instrumenting.

### 7. Sanity test against three real sites

Re-run extraction (via a small Deno one-shot or by invoking `enrich-magnet` for a fresh slug) against:

- `https://narrio.app/` → expect `narrio.svg`.
- `https://mabbly.com/` → expect inline SVG (the previously fixed case, must not regress).
- A site with a partners strip (e.g. any agency homepage) → expect their own logo or `null`, never a partner's.

Confirm logs show the right `source` for each.

## Files touched

- `supabase/functions/_shared/extract-branding.ts` (only file with logic changes).
- No DB migration. No frontend changes. No type changes.

## Risk / rollback

- Risk: a small number of legitimate logos hosted on a CDN with a non-matching host (e.g. `cdn.shopify.com/...`) get filtered out. Mitigation: same-origin boost is additive and the denylist is narrow; CDN logos with the brand name in the filename still pass via the existing `domainRoot` bonus.
- Rollback: revert the single edge-function file. Edge functions hot-deploy on save, so rollback is one revert away.

## Out of scope

- Re-running extraction on every existing `magnet_breakdowns` row. We only fix forward; existing wrong logos can be corrected one-off via `client_company_name_override`-style manual edits or by re-submitting.
