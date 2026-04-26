# Why the magnet page silently failed

The `/m/:slug` page is **not** failing because of a race condition. It fails because of an RLS configuration that has never worked from the browser.

The four magnet tables all have SELECT policies of the form:

```sql
USING (slug = current_setting('app.current_slug', true))
```

That GUC must be set per-request via something like `select set_config('app.current_slug', $1, true)`. **No client code anywhere sets it** (`rg "set_config|current_slug|\.rpc\(" src/` returns zero hits). So for every anon request:

- `current_setting('app.current_slug', true)` returns `NULL`
- `slug = NULL` is `NULL` (never `true`)
- PostgREST returns `[]` with no error

In `MagnetSite.tsx` polling, both queries return `data: null, error: null`, the code hits `if (!subRes.data)` → `setStatus('error')` → user sees "Something went wrong" even though the breakdown row is fully populated in the DB (verified for `ilan_6fwi5uylv3`: status `complete`, full data present).

`MagnetBreakdown.tsx` has the same problem — it would show "Breakdown not found." even on the happy path.

This has been broken for every user since the slug-scoped RLS policies were added; nobody has been able to view their own breakdown from the browser.

---

# The fix (two parts)

## Part 1 — Replace per-session GUC with a SECURITY DEFINER RPC (migration)

The "set a session GUC from the client" pattern is fragile in PostgREST: connection pooling means the GUC may be cleared between the `set_config` call and the actual `SELECT`, even when wrapped in the same supabase-js call. The reliable, equally-safe pattern is a `SECURITY DEFINER` function that takes the slug as an argument and returns only that slug's row.

New migration adds four read functions (one per table) and drops the broken SELECT policies, replacing them with `USING (false)` so the base tables stay locked down and the functions are the only read path.

```sql
-- magnet_submissions: public read by slug
CREATE OR REPLACE FUNCTION public.get_magnet_submission(_slug text)
RETURNS TABLE (
  slug text,
  status text,
  first_name text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT slug, status, first_name, created_at
  FROM public.magnet_submissions
  WHERE slug = _slug
  LIMIT 1;
$$;

-- magnet_breakdowns: public read by slug (excludes raw_* enrichment blobs)
CREATE OR REPLACE FUNCTION public.get_magnet_breakdown(_slug text)
RETURNS TABLE (
  slug text,
  welcome_message text,
  dead_zone_value bigint,
  dead_zone_reasoning text,
  gtm_profile_observed text,
  gtm_profile_assessment text,
  orbit_01 text, orbit_02 text, orbit_03 text, orbit_04 text, orbit_05 text,
  recommended_layer text,
  action_1 text, action_2 text, action_3 text,
  chapter_callouts jsonb,
  enrichment_error text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT slug, welcome_message, dead_zone_value, dead_zone_reasoning,
         gtm_profile_observed, gtm_profile_assessment,
         orbit_01, orbit_02, orbit_03, orbit_04, orbit_05,
         recommended_layer, action_1, action_2, action_3,
         chapter_callouts, enrichment_error
  FROM public.magnet_breakdowns
  WHERE slug = _slug
  LIMIT 1;
$$;

-- (Same pattern for get_magnet_chat_session and get_magnet_call_booking,
--  plus matching upsert/insert RPCs for chat sessions and call bookings
--  so writes don't depend on the GUC either.)

GRANT EXECUTE ON FUNCTION public.get_magnet_submission(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_magnet_breakdown(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_magnet_chat_session(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_magnet_chat_session(text, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.insert_magnet_call_booking(text, text, timestamptz) TO anon, authenticated;

-- Lock down direct SELECT on all four tables (RPCs are now the only read path)
DROP POLICY "View own submission by slug" ON public.magnet_submissions;
CREATE POLICY "No direct select" ON public.magnet_submissions FOR SELECT USING (false);

DROP POLICY "View own breakdown by slug" ON public.magnet_breakdowns;
CREATE POLICY "No direct select" ON public.magnet_breakdowns FOR SELECT USING (false);

DROP POLICY "View chat session by slug" ON public.magnet_chat_sessions;
DROP POLICY "Insert chat session by slug" ON public.magnet_chat_sessions;
DROP POLICY "Update chat session by slug" ON public.magnet_chat_sessions;
CREATE POLICY "No direct access" ON public.magnet_chat_sessions FOR ALL USING (false) WITH CHECK (false);

DROP POLICY "View call booking by slug" ON public.magnet_call_bookings;
DROP POLICY "Insert call booking by slug" ON public.magnet_call_bookings;
CREATE POLICY "No direct access" ON public.magnet_call_bookings FOR ALL USING (false) WITH CHECK (false);
```

Security properties preserved:
- A visitor with a slug can read only that slug's row (same as before in intent).
- No slug enumeration: slugs are random suffixes already; functions return empty when slug is unknown.
- `raw_website_content` and `raw_linkedin_data` enrichment blobs are intentionally excluded from `get_magnet_breakdown` — they were exposed before.
- Service-role insert/update on `magnet_breakdowns` is unchanged (edge functions still work).
- INSERT on `magnet_submissions` stays open ("Anyone can submit assessment").

## Part 2 — Update client + edge functions to use the RPCs

**`src/pages/MagnetSite.tsx`** — replace the two `.from(...).select(...).eq("slug", slug).maybeSingle()` calls inside `fetchStatus` with:

```ts
const [subRes, brkRes] = await Promise.all([
  supabase.rpc('get_magnet_submission', { _slug: slug }),
  supabase.rpc('get_magnet_breakdown', { _slug: slug }),
]);
const submission = subRes.data?.[0] ?? null;
const breakdown = brkRes.data?.[0] ?? null;
```

Then keep the existing "breakdown row populated → complete" priority logic (it's already correct), and add three small hardening tweaks:

1. **Tolerate a missing submission row briefly.** Today: `if (!subRes.data) → error`. New: track `consecutiveMissingSub` and only flip to `error` after 5 consecutive empty polls (~15s), matching the existing `consecutiveFailures` pattern. This covers the small window between INSERT and the first poll.
2. **Hard timeout.** If still in `pending`/`processing` after 90s, stop polling and show error with a "Try again" button (today the loop runs forever).
3. **Backoff.** Poll every 3s for the first 30s, then every 6s. Reduces request volume on slow enrichment.

**`src/components/magnet/MagnetBreakdown.tsx`** — replace both `.from(...)` reads with `supabase.rpc('get_magnet_breakdown', { _slug: slug })` and `supabase.rpc('get_magnet_submission', { _slug: slug })`. Same shape; existing error/empty handling stays.

**`src/components/magnet/MagnetChat.tsx`** — chat reads/writes go through the existing `magnet-chat` edge function, which uses the service role. Update that function to use `get_magnet_chat_session` / `upsert_magnet_chat_session` (or keep direct table access — service role bypasses RLS so it still works). No client change needed there.

**Edge functions** (`enrich-magnet`, `magnet-chat`) — already use `SUPABASE_SERVICE_ROLE_KEY`, so they bypass RLS entirely. No changes required, just verify by reading the two function files during implementation.

---

# Files touched

1. `supabase/migrations/<new>_magnet_rls_via_rpcs.sql` — new migration (Part 1)
2. `src/pages/MagnetSite.tsx` — switch to RPCs + hardened polling (Part 2.1, 2.3)
3. `src/components/magnet/MagnetBreakdown.tsx` — switch to RPCs (Part 2.2)
4. (verify only) `supabase/functions/enrich-magnet/index.ts`, `supabase/functions/magnet-chat/index.ts`

No changes to: types.ts (auto-regenerates), client.ts, routing, UI/copy, edge function deployment config.

---

# Verification

1. Hit `/m/ilan_6fwi5uylv3` → breakdown renders immediately (data already complete in DB).
2. Submit a fresh assessment → loading screen cycles steps → flips to breakdown when enrichment finishes.
3. Hit a non-existent slug like `/m/nope_xxxxx` → after ~15s of empty polls, error screen appears (not instant).
4. Network tab on `/m/:slug`: should see `POST /rest/v1/rpc/get_magnet_submission` and `…/get_magnet_breakdown` returning the rows (not empty arrays as today).
5. Direct table reads from anon (`curl /rest/v1/magnet_breakdowns?slug=eq.…`) return `[]` — the RPCs are now the only read path.
6. `raw_website_content` and `raw_linkedin_data` no longer reachable from the browser.