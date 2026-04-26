## What's already correct (no change needed)

`MagnetBreakdown.tsx` already uses the correct `ORBIT_NAMES` constant: "Core Proof", "Active", "Dead Zone", "Warm Adjacency", "New Gravity". Part A is already done client-side. The fix is still needed in the edge function (Part E).

There is no `BreakdownData` interface in this file — the type is `BreakdownRow`. I'll add the two new optional estimate fields there.

## Part B — Replace CHAPTERS in `src/components/magnet/MagnetBreakdown.tsx`

Replace lines 39–54 with the full 14-entry list (Preface = 0 through Closing = 13) using the exact titles and summaries provided. The existing `getChapterNumber` helper already supports `chapter_number`, so the lookup keeps working for entries with `chapterNumber` 0–13.

Also update the line "14 chapters. The complete system." → "14 sections. The complete system." (still 14 entries: preface + 12 chapters + closing).

## Part C — Create `src/components/magnet/MagnetImpactModel.tsx`

New component built exactly to spec:
- Props: `crmEstimate?`, `dealSizeEstimate?`, `companyName`
- Constants: `DORMANCY_RATE 0.81`, `DZ_CONVERSION 0.03`, `ACQ_MULTIPLIER 7`, `BASE_CONTACTS 200`, `BASE_WITHOUT 78000`, `BASE_WITH 486000`, `BASE_DEAL 150000`
- State: `crm` (default `crmEstimate ?? 1500`), `deal` (default `dealSizeEstimate ?? 150000`)
- Derived values: `dormant`, `deadZoneValue`, `replaceCost`, `pipelineWithout`, `pipelineWith`, `multiplier`
- `fmtMoney` helper as specified
- Sections in order:
  1. Monday Morning Test header + Ch.1 attribution
  2. Two sliders (Contacts / Avg engagement size); each shows "Estimated from your website/market" hint when the corresponding prop was passed
  3. Three metric cards: Dormant Contacts, Dead Zone Value (gold-highlighted), Cost to Replace
  4. Formula multiplier — Without/With cards side by side + stacked bar visual using `(pipelineWithout / pipelineWith) * 100%` for the gray bar, 100% for the gold bar
  5. Four stat chips (74%, 8.1%, 7×, 60–70%) with the exact copy
  6. Three "Verified in Practice" cards (Stephen at Madcraft, SPR, AArete)
- Uses brand colors: text `#F5EFE0`, accent `#B8933A`, surfaces `bg-white/5 border border-white/10`. `bg-transparent` outer.

## Part D — Wire into `MagnetBreakdown.tsx`

1. Add `crmEstimate?: number` and `dealSizeEstimate?: number` to the `BreakdownRow` interface (the existing equivalent of `BreakdownData`).
2. Import `MagnetImpactModel` at top.
3. Insert a new `<section className="py-12 border-t border-white/10">` containing `<MagnetImpactModel companyName={data.client_company_name ?? ""} crmEstimate={data.crmEstimate} dealSizeEstimate={data.dealSizeEstimate} />` AFTER the Five Orbits section (currently lines 257–285) and BEFORE the existing standalone Dead Zone section.
4. Remove the existing standalone Dead Zone section (lines 287–303) — the one with the `text-5xl` dollar amount. The new impact model replaces it.

Note: the breakdown page uses a light cream theme (`bg-[#FBF8F4]`) but the impact model spec uses dark surface colors (`text-[#F5EFE0]`, `bg-white/5`). I'll wrap the inserted impact-model section in a dark band (`bg-[#120D05]` full-bleed via `-mx-6 px-6` inside the `max-w-2xl` container) so the gold/cream-on-dark surface treatment in the spec reads correctly. This preserves the spec's color tokens exactly while keeping the rest of the page on its cream background.

## Part E — `supabase/functions/enrich-magnet/index.ts`

In the system prompt:
1. Update line 40–41 rule #2 to: `Orbit names MUST be exactly: Core Proof, Active, Dead Zone, Warm Adjacency, New Gravity (in that order, IDs 01-05).`
2. Update the JSON schema orbit entries (lines 62–66) to use `Core Proof`, `Active`, `Dead Zone`, `Warm Adjacency`, `New Gravity`.
3. Add two new fields to the JSON schema, between `deadZone` and `layerRecommendation`:
   - `"crmEstimate": number` — with the inline comment about LinkedIn headcount × 8 fallback
   - `"dealSizeEstimate": number` — with the inline comment about engagement size, plain integer

Also update the schema-mapping block (around lines 240–320) to persist the two new estimates so they reach `MagnetBreakdown`. Two paths:
- Add columns `crm_estimate` and `deal_size_estimate` to `magnet_breakdowns` via a migration.
- Update the `get_magnet_breakdown_by_slug` SQL function to return them.
- Add them to the upserted `breakdownRow`.
- Map them onto `data.crmEstimate` / `data.dealSizeEstimate` in the client.

## Database migration

```sql
ALTER TABLE public.magnet_breakdowns
  ADD COLUMN IF NOT EXISTS crm_estimate integer,
  ADD COLUMN IF NOT EXISTS deal_size_estimate integer;
```

Then `CREATE OR REPLACE FUNCTION public.get_magnet_breakdown_by_slug(...)` to add `b.crm_estimate, b.deal_size_estimate` to the return columns.

In the client `useEffect`, map `row.crm_estimate` → `crmEstimate` and `row.deal_size_estimate` → `dealSizeEstimate` when setting state.

## Files

CREATE
- `src/components/magnet/MagnetImpactModel.tsx`

MODIFY
- `src/components/magnet/MagnetBreakdown.tsx` — replace `CHAPTERS`, extend `BreakdownRow`, import + render `MagnetImpactModel`, remove old standalone Dead Zone section, map new fields from RPC row
- `supabase/functions/enrich-magnet/index.ts` — fix orbit names in prompt rule + JSON schema, add `crmEstimate` / `dealSizeEstimate` to schema, persist them on `breakdownRow`

MIGRATION
- Add `crm_estimate`, `deal_size_estimate` columns to `magnet_breakdowns`
- Update `get_magnet_breakdown_by_slug` to return the two new columns

Nothing else changes.