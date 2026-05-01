# 05 · Operational Playbook

> The daily doc. Setup, common tasks, deployment, migration plan. What you do when you sit down to work.

---

## First-time setup

### Prerequisites

- **Node.js** 20+ (check with `node -v`)
- **npm** 10+ (or **bun** — `bun.lockb` exists, both work)
- **Git**
- A Supabase project with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- (Optional) Vercel CLI if you want to deploy from the command line

### Clone & install

```bash
git clone [repo-url] discover-mabbly
cd discover-mabbly
npm install
# Or with bun:
# bun install
```

### Environment variables

Create `.env` in the project root (it's gitignored):

```
VITE_SUPABASE_URL=https://[your-project].supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
```

**Never commit secrets.** The publishable (anon) key is safe on the client. The service-role key never touches the client bundle.

### Run dev server

```bash
npm run dev
```

Opens at `http://localhost:8080`. Hot module replacement is on. Vite is fast — most changes show up instantly.

### Verify the install

Visit `http://localhost:8080`. You should see the `/discover` homepage. If you see a Supabase error in console, your `.env` values are wrong or the project is paused.

---

## Daily commands

```bash
# Dev
npm run dev                 # Dev server at localhost:8080
npm run preview             # Preview production build (after `npm run build`)

# Build
npm run build               # Production build
npm run build:dev           # Development-mode build (debug)

# Test
npm run test                # Vitest single run
npm run test:watch          # Vitest watch mode
npx vitest run path/to/file.test.ts   # Run a single test file
npx playwright test         # E2E suite (minimal coverage today)

# Lint
npm run lint                # ESLint across the project
```

**You should NOT need to run `npm run build` during development.** Use `npm run dev` for HMR. Only build before deploy or to debug a production-only bug.

---

## Common tasks

### Add a vertical landing

1. Edit `src/content/verticals.ts` — add a config block:
   ```typescript
   newVertical: {
     slug: "new-vertical",
     nativeTerm: "New Vertical Term",
     // ... copy + config per VerticalContent type
   }
   ```
2. Add a one-line wrapper at `src/pages/verticals/NewVertical.tsx`:
   ```typescript
   import { VerticalLanding } from "@/components/VerticalLanding/VerticalLanding";
   import { VERTICALS } from "@/content/verticals";

   export default function NewVertical() {
     return <VerticalLanding vertical={VERTICALS.newVertical} />;
   }
   ```
3. Register the route in `src/App.tsx` ABOVE the catch-all `*`:
   ```tsx
   <Route path="/new-vertical" element={<NewVertical />} />
   ```
4. Verify: visit `http://localhost:8080/new-vertical`. Confirm the vertical appears in the homepage's "Find Your Industry" grid (driven by the same content file).

### Add a client microsite (shared shell)

1. Copy `src/pages/microsites/PepperGroup.tsx` → `src/pages/microsites/<NewClient>.tsx`
2. Edit the `SITE_DATA` object:
   ```typescript
   const SITE_DATA: SiteData = {
     clientName: "...",
     // ... see src/types/microsite.ts for full shape
   };
   ```
3. Register the route in `src/App.tsx`:
   ```tsx
   <Route path="/new-client" element={<NewClient />} />
   ```
4. The shell handles tabs, navigation, theming. **Do not duplicate shell logic.**

### Add a one-off microsite

Only do this if the shared shell can't express what the client needs (e.g., bespoke hero, custom narrative flow).

1. Create `src/components/<client>/` for client-specific components
2. Create `src/pages/<Client>.tsx` composing those components
3. Register the route

Use `/aletheia` or `/spr` as templates. Note: these predate the shared shell — only follow this pattern if absolutely necessary.

### Edit copy on a vertical landing

99% of vertical-landing copy lives in `src/content/verticals.ts`. **Edit there, not in JSX.**

```bash
# Find the right key
grep -n "your-search-term" src/content/verticals.ts
```

Edit, save, refresh — Vite HMR shows the change instantly.

### Edit copy on the homepage (`/discover`)

Homepage sections compose ~30 components from `src/components/discover/`. Each section component holds its own copy.

To find a specific section:

```bash
grep -rn "search phrase from the page" src/components/discover/
```

### Add an edge function

1. Create `supabase/functions/<function-name>/index.ts`:
   ```typescript
   import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

   Deno.serve(async (req) => {
     // ... handler
     return new Response(JSON.stringify({ ok: true }), {
       headers: { "Content-Type": "application/json" },
     });
   });
   ```
2. Use shared CORS helpers from `supabase/functions/_shared/`
3. Deploy via Supabase CLI:
   ```bash
   supabase functions deploy <function-name>
   ```
4. Set any required env secrets in the Supabase dashboard
5. Call from client via `supabase.functions.invoke('<function-name>', { body: { ... } })`

### Add a database migration

1. Create a new SQL file in `supabase/migrations/` named `YYYYMMDDHHMMSS_<description>.sql`:
   ```sql
   create table if not exists my_new_table (
     id uuid primary key default gen_random_uuid(),
     created_at timestamptz default now()
   );

   alter table my_new_table enable row level security;

   create policy "anon read" on my_new_table for select to anon using (true);
   ```
2. Apply locally:
   ```bash
   supabase db reset    # rebuilds local db with all migrations
   ```
3. Push to remote:
   ```bash
   supabase db push
   ```
4. Regenerate types:
   ```bash
   supabase gen types typescript --linked > src/integrations/supabase/types.ts
   ```

**Always plan RLS.** Anon role accesses tables from the client. Either add proper RLS policies or use an RPC wrapper.

### Run a MAP simulation against the live site

Submit a test URL via `/assess`:

```
https://example.com               # Cheap test, won't burn a real-firm slug
https://www.agconsultingpartners.com   # Real ICP firm from Adam's cohort
```

Wait ~90 seconds. Visit `/m/[slug]` to see the result.

Each call costs ~$0.002. Don't worry about cost during development.

### Inspect Supabase data

Use the Supabase dashboard SQL editor:

```sql
-- See recent submissions
select slug, website_url, enrich_status, created_at
from magnet_submissions
order by created_at desc
limit 20;

-- Inspect a specific breakdown
select breakdown_data
from magnet_submissions
where slug = 'agconsultingpartners';

-- Count by status
select enrich_status, count(*)
from magnet_submissions
group by enrich_status;
```

### Roll back a bad change

```bash
git log --oneline -10        # Find the commit before the regression
git revert <commit-hash>     # Creates a revert commit
git push                     # Auto-deploys via Vercel
```

For a hard rollback (only if you really mean it):

```bash
git reset --hard <commit-hash>
git push --force             # Coordinate with team — destructive
```

---

## Deployment

### Production (Vercel)

After the Lovable → local migration, the deployment flow is:

1. **Push to `main`** → Vercel auto-deploys to production (`https://discover.mabbly.com`)
2. **Push to a feature branch** → Vercel creates a preview deployment with a unique URL
3. **Open a pull request** → Preview URL gets posted to the PR

### Vercel project setup (one-time)

If the Vercel project is not yet linked:

1. Go to vercel.com → New Project → Import the discover-mabbly Git repo
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set env vars in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
6. Connect domain `discover.mabbly.com` → DNS A/CNAME records to Vercel
7. (Optional) Set up Vercel CLI:
   ```bash
   npm i -g vercel
   vercel link            # Link the local repo to the Vercel project
   vercel --prod          # Deploy from CLI
   ```

### Lovable → local → Vercel migration plan

The project was scaffolded by Lovable. The migration is partially complete:

✅ **Done:**
- Code committed to local git repo
- Project running locally via `npm run dev`
- Supabase env vars wired

⏳ **In progress:**
- Vercel project linkage
- DNS cutover from Lovable's hosting to Vercel

🔜 **To do:**
- Remove `lovable-tagger` from `devDependencies` (currently in `package.json`)
- Remove `componentTagger()` plugin from `vite.config.ts` (only runs in dev mode, but unnecessary)
- Remove `.lovable/` folder (still has stale `plan.md`)
- Update `index.html` if any Lovable-specific meta tags remain

**Until the Vercel cutover is complete**, treat Lovable as the deploy target. Once Vercel is live, deprecate Lovable for this project.

---

## Branching & commits

### Branch naming

```
main                    ← production
feature/[short-name]    ← new features
fix/[short-name]        ← bug fixes
copy/[short-name]       ← copy-only changes
chore/[short-name]      ← dependency bumps, configs
```

### Commit messages

Format: `<verb> <area> — <what changed>`

Examples:
- `Fix Section 02 (Five Orbits) vertical spacing on /m/:slug`
- `Add law-firm-specific case study to /law`
- `Kill $1.2M fabrication in enrich-magnet system prompt`
- `Wire PostHog event taxonomy on Magnet flow`
- `Update Adam Fridman avatar to local asset, no external hosting`

**No "WIP" or "fix stuff" or "update". Be specific. The commit log is documentation.**

### When to commit

- After a single coherent change
- Before switching tasks
- Before a meeting (so the WIP isn't lost)
- At end of day

### When to PR

- Before merging anything to `main`
- For any change touching the AI prompt
- For any new database migration
- For any change to `App.tsx` routing

Coordinate with Ilan before merging schema changes or anything that touches `enrich-magnet` payload shape (it's coupled to client render code).

---

## Working with Lovable prompts

The `lovable-prompt-*.md` files at the project root are reusable prompts I (EDITH) wrote during the audit. Now that we're on Claude Code locally, you have two options:

**Option A — Use as Claude Code prompts.**
Paste the prompt body into Claude Code. Claude Code will execute the changes locally with full file access. Faster iteration, no Lovable round-trip.

**Option B — Use as Lovable prompts.**
If a feature is faster to build through Lovable's UI (e.g., new shadcn components), paste the prompt into Lovable as before. Lovable will commit to the same Git repo and the changes will be available locally.

The prompts are written to be agent-agnostic — heavy guardrails, specific file paths, explicit DO NOT lists. They work in either tool.

Available prompts as of May 1:
- [`lovable-prompt-orbit-deadspace.md`](../lovable-prompt-orbit-deadspace.md) — Tighten Section 02 spacing on `/m/:slug`
- [`lovable-prompt-adam-avatar.md`](../lovable-prompt-adam-avatar.md) — Replace AF initials with locally-bundled headshot
- [`lovable-prompt-ops-dashboard.md`](../lovable-prompt-ops-dashboard.md) — Build the password-gated `/ops` dashboard

---

## Troubleshooting

### `Cannot find module '@/...'`

The path alias isn't resolving. Verify:
1. `tsconfig.json` has `"paths": { "@/*": ["./src/*"] }`
2. `vite.config.ts` has the matching alias
3. Restart the dev server (`npm run dev`)

### Supabase connection errors

```
Failed to fetch ... supabase.co
```

Check:
1. `.env` exists and has correct `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY`
2. Supabase project isn't paused (free tier auto-pauses after inactivity)
3. Browser network tab — what's the actual response? 401 = bad key. CORS error = unusual config issue.

### `enrich-magnet` returns error

1. Check the edge function logs: `supabase functions logs enrich-magnet`
2. Verify `OPENAI_API_KEY` is set in Supabase Secrets (different from the local `.env`)
3. Check Jina rate limits — if you've been testing heavily, the free tier can throttle
4. Manually invoke with curl to isolate:
   ```bash
   curl -X POST '<your-supabase-url>/functions/v1/enrich-magnet' \
     -H 'Authorization: Bearer <anon-key>' \
     -H 'Content-Type: application/json' \
     -d '{"slug":"test","websiteUrl":"https://example.com"}'
   ```

### Magnet polling never completes

1. Check `magnet_submissions` row in Supabase — what's the `enrich_status`?
2. If `pending` for >2 minutes, the edge function probably failed silently. Check logs.
3. If `error`, the edge function returned a parse error. Inspect what the AI returned.
4. If `complete` but UI still shows wait theater, polling logic in `MagnetSite.tsx` is broken — check console errors.

### Build fails on Vercel but works locally

1. Check Node version mismatch — set `engines.node` in `package.json` if needed
2. Check env vars are set in Vercel dashboard (not just locally)
3. Look for Vite plugin errors specific to production mode (`build:dev` vs `build`)

### Tailwind classes not applying

1. Check that the file path is in `tailwind.config.ts` `content` array
2. If using a dynamic class name (`bg-${color}`), Tailwind can't tree-shake it — use a static class or safelist it

---

## Performance budgets

Targets for `/discover` and `/m/:slug` (post-roadmap):

| Metric | Target | Tool |
|---|---|---|
| Lighthouse Performance | 90+ | Chrome DevTools |
| Lighthouse Accessibility | 95+ | Chrome DevTools |
| First Contentful Paint | <1.5s | DevTools network tab |
| Time to Interactive | <3.5s | DevTools |
| Largest Contentful Paint | <2.5s | DevTools |

Don't optimize prematurely. Ship features, then run the audit.

---

## Working with EDITH (the AI co-pilot)

If you're using Claude Code or the EDITH skill on this project:

- **Always reference [01-strategy.md](./01-strategy.md) when asking for copy changes** — locked vocabulary matters
- **Tell EDITH the file path** — surgical edits are better than regenerations
- **Heavy guardrails work** — the existing `lovable-prompt-*.md` files demonstrate the pattern
- **Never let EDITH commit without review** — quality varies, especially on AI prompt changes

---

## See also

- [01-strategy.md](./01-strategy.md) — voice and framework lock
- [02-architecture.md](./02-architecture.md) — what to expect when adding to the codebase
- [03-magnet-flow.md](./03-magnet-flow.md) — the most complex piece you'll touch
- [04-roadmap.md](./04-roadmap.md) — what to ship next
- [06-references.md](./06-references.md) — Notion sources, glossary

---

*Last updated: May 1, 2026*
