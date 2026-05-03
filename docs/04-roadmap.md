# 04 · Roadmap

> What's next. Synthesized from the May 1 audit + 3-firm MAP simulation findings + touchpoint playbook + email capture strategy.

> **Status note (2026-05-03):** Sprint 2 (May 2–3) shipped substantial **infrastructure and surface** work — design-system v2 tokens, Discover light-register sweep, the Magnet visualization pack, the cohort layer and `/m/:slug/cohort` page, the vertical-page templating refactor, the `/assess` removal, accessibility primitives, and the magnet polling theater's hard-fail recovery surface. Full details in [`changelog/2026-05-02-2026-05-03-sprint-2.md`](./changelog/2026-05-02-2026-05-03-sprint-2.md). **The four MAP-quality P0s below — firm-name extraction, hypothesis de-templating, $1.2M fabrication, "Did we nail it?" feedback widget — were NOT addressed in Sprint 2 and remain the next ship.** Average MAP quality is therefore unchanged from the May 1 audit.

---

## Quality scorecard — where we are today

Three deep simulations (AG Consulting Partners · Chief Outsiders · Jabian Consulting) ran through the V10 flow on May 1. Findings:

| Dimension | AG Consulting | Chief Outsiders | Jabian | Pattern |
|---|---|---|---|---|
| Firm name extraction | ✅ Correct | ❌ "Growth Strategy" | ⚠️ Truncated to "Jabian" | **2 of 3 broken (67% fail rate on the most important word on the page)** |
| Brand color extraction | Default navy | Default navy | Default navy | **0 of 3 actually used the firm's brand colors** |
| Specific observations | Good (Inc. 5000, Microsoft, Nike refs) | Good (120+ CXOs, Cameron Brown) | Vague (operational excellence, customer acquisition) | Variance unacceptable |
| Hypothesis statements | Identical boilerplate | Identical boilerplate | Identical boilerplate | **100% template repetition** |
| Question prompts | Identical | Identical | Identical | **100% template repetition** |
| Deeper Findings (Section 10) | Word-for-word identical w/ name swap | Word-for-word identical w/ name swap | Word-for-word identical w/ name swap | **100% template repetition** |
| Highest Leverage Move | "Send to 3 dormant contacts, 30 min" | "Identify 3 dormant contacts in CRM" | "Identify 5 dormant contacts, research news" | **Same move, slightly reworded** |
| Orbit scores | 80/26/38/55/28 | 84/30/38/55/32 | 78/26/28/53/36 | **Suspiciously narrow band — Core Proof always 78–84, Active always 26–30, Warm Adjacency always 53–55** |
| Score per simulation | 7/10 | 4/10 | 5/10 | — |

**Average MAP quality today: 5.3/10.**

**Target after roadmap completion: 9.0/10.**

---

## Priority queue

### P0 — Ship This Week (the trifecta + foundations)

These four are coupled. They unlock everything else.

#### 1. Firm name extraction priority chain

**Problem:** AI-first extraction is wrong on 2 of 3 firms.

**Fix:**
1. `<title>` tag first
2. Fallback to OpenGraph `og:site_name`
3. Fallback to LinkedIn schema
4. Fallback to AI extraction
5. **Inline "Not quite — fix this" edit on the firm name** (one-click correction by visitor)

**File:** `supabase/functions/enrich-magnet/index.ts` + `src/components/magnet/MagnetBreakdown.tsx`

**Effort:** 1–2 days
**Lovable prompt:** [`lovable-prompts/firm-name-extraction.md`](../lovable-prompt-orbit-deadspace.md) (TBD — speced in audit memo)

#### 2. Hypothesis / Question de-templating

**Problem:** Hypothesis statements in Sections 03 and 04 are byte-identical across all three firms.

**Fix:**
- Move Hypothesis and Question generation INTO the AI call, not into a hardcoded template
- Pass the `Observed` text back into the prompt and ask for a Hypothesis tied to THAT observation specifically
- Vary by orbit position (a Core Proof hypothesis should not read the same as a Dead Zone hypothesis)

**File:** `supabase/functions/enrich-magnet/index.ts` (system prompt rewrite)

**Effort:** 2 days

#### 3. Kill the $1.2M fabrication

**Problem:** "Could cost you $1.2M in unrealized revenue" appears word-for-word on multiple firms. **Violates the verified-facts lock from [01-strategy.md](./01-strategy.md).**

**Fix:**
- Audit the system prompt for placeholder dollar values
- Replace with calculated estimate from real signals OR remove entirely until there's a real calculation

**File:** `supabase/functions/enrich-magnet/index.ts`

**Effort:** 4 hours

#### 4. "Did we nail it?" capture mechanism

**Problem:** Sections 03 and 04 already have the placeholder copy "We would love your feedback. Did we get this right?" — but no UI control attached.

**Fix:** Build the unified feedback widget:

```
┌─────────────────────────────────────────┐
│  Did we nail it?                        │
│  [👍 Spot on]  [🤔 Half right]  [👎 Off] │
│  ┌─────────────────────────────────┐    │
│  │ What did we miss? (optional)    │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

After they hit any of the 3 buttons, widget collapses to a checkmark + one-line "Thanks — this shapes the manuscript."

Posts to `magnet_feedback` table (new): `{ slug, section, sentiment, comment, timestamp }`.

Adam gets a daily digest in Slack/email.

**Strategic value:** every "Off" rating is an unfiltered prompt-improvement signal from a real ICP firm. After 100 maps, you have a quality dataset for system prompt tuning.

**File:** `src/components/magnet/MagnetBreakdown.tsx` + new edge function `submit-feedback` extension

**Effort:** 2 days

#### 5. PostHog event taxonomy

**Problem:** Today we have one signal — Supabase row insertion. We can't tell where users drop off, which CTAs convert, or how the score-adaptive variants perform.

**Fix:** Wire PostHog (free tier covers this volume) with these events:

```
event: map_section_viewed       props: { slug, section, timestamp }
event: map_orbit_clicked         props: { slug, orbit_id }
event: map_cta_clicked           props: { slug, cta_location, variant }
event: map_chat_opened           props: { slug }
event: map_chat_message_sent     props: { slug, message_index }
event: map_feedback_submitted    props: { slug, section, sentiment, comment }
event: map_share_clicked         props: { slug, share_method }
event: map_save_email_submitted  props: { slug, email_domain }
event: map_scrolled_to_end       props: { slug, time_to_end_ms }
event: map_bounced               props: { slug, last_section_seen, dwell_ms }
```

Funnel view: **Submit → Wait Complete → Section 5 → Section 8 CTA → Chat Open → Booking Click**.

**File:** `src/lib/magnetAnalytics.ts` (new module)

**Effort:** 1 day

#### 6. Time copy mismatch

**Problem:** Hero says "10 min diagnostic" — `/assess` says "90 seconds." V10 spec said 90 seconds replaces 10 minutes everywhere.

**Fix:** Rewrite hero sub-line to "90 seconds."

**File:** `src/components/discover/HeroSection.tsx` (or equivalent in `discover/`)

**Effort:** 15 minutes

#### 7. Misleading `/assess` sub-line

**Problem:** "ANALYZES POSITIONING, MESSAGING, CTAS, CONSISTENCY" creates an SEO-audit expectation. The output is a Five Orbits map.

**Fix:** Rewrite to "Maps your Five Orbits — Core Proof, Active, Dead Zone, Warm Adjacency, New Gravity."

**File:** `src/pages/MagnetAssess.tsx`

**Effort:** 5 minutes

#### 8. Replace placeholder Calendly URL

**Problem:** `/book` page Calendly embed is a placeholder.

**Fix:** Update with the real Calendly URL.

**File:** `src/pages/MagnetBook.tsx`

**Effort:** 2 minutes

---

### P1 — Ship Next Week (personalization depth + book chat + ops)

#### 9. Engagement-triggered email capture (post-Section-5)

**Per the email capture strategy memo.** Inline non-blocking card after Section 5, triggered by scroll past + 60s dwell OR orbit click. Offers manuscript chapter in exchange for email.

**Predicted capture rate:** 25–35% of engaged readers.

**Effort:** 4 days

#### 10. Score variance fix

**Problem:** Orbit scores cluster too tightly (78–84/26–30/53–55).

**Two paths:**
- **Cheap path (2 hours):** Bump temperature variance to 0.6–0.8. Rebalance system prompt to push for differentiation.
- **Right path (1 week):** Widen signal source — scrape `/about`, `/team`, `/case-studies`, LinkedIn schema, recent press in addition to homepage.

**Recommendation:** Ship cheap path now, queue right path.

**File:** `supabase/functions/enrich-magnet/index.ts`

#### 11. Org-specific chat starter prompts

**Per audit memo Section 5.3.** Generate 3 firm-specific starters as part of enrichment. Add `chatStarters: array[3]` to `BreakdownData`. Replace hardcoded generic starters in `BookChat`.

Example for AG Consulting Partners:
1. *"How would the Dead Zone framework change AG's PMO engagement model with Microsoft and Nike?"*
2. *"What does Chapter 3's Formula look like applied to AG's Inc. 5000 momentum?"*
3. *"If AG ran a 7-day proof sprint like Madcraft, which orbit should we start with?"*

**Effort:** 1 day

#### 12. Pre-fill Calendly with map context

**Problem:** When Adam takes a Discovery Session, he doesn't see the map context until manually opening the link.

**Fix:** Pre-fill Calendly with `slug`, `firm`, `map_url`, `score_total` as hidden custom questions.

**File:** `src/lib/calendly.ts` + `src/pages/MagnetBook.tsx`

**Effort:** 3 hours

#### 13. Wait-state error handling

**Problem:** No graceful UI for `enrich_status = 'error'`. User stuck.

**Fix:** Show "Something went wrong — we'll email you when it's ready" + email capture for async delivery.

**File:** `src/components/magnet/MagnetWaitTheater.tsx`

**Effort:** 1 day

#### 14. Ops dashboard at `/ops`

Per [`lovable-prompt-ops-dashboard.md`](../lovable-prompt-ops-dashboard.md). Password-gated internal dashboard with:

- Microsite views per slug
- Share / affiliate tracking (who shared with who)
- Unified email list across all capture sources
- Bookings tracking
- Health/error monitoring

Includes building 5 new tables, 7 new edge functions, full UI. Single comprehensive build.

**Effort:** 1 week

---

### P2 — Within 30 Days

#### 15. In-book inline feedback layer

**Per audit memo Section 5.4.** Floating "💬 React to this page" button on every page of `/m/:slug/read`. Same 3-button pattern. Posts to `manuscript_feedback`.

**Strategic value:** "287 PS leaders flagged Chapter 7 as most-relevant" becomes social proof.

**Effort:** 2 days

#### 16. Brand color extraction actually applies

**Problem:** All maps render default Mabbly navy regardless of firm.

**Fix:** Verify color extraction logic. Force non-default if any branded color extractable. Worst case: extract dominant logo color, use for accent only.

**File:** `supabase/functions/enrich-magnet/index.ts` + `src/lib/clientTheme.ts`

**Effort:** 2 days

#### 17. Mobile audit pass

Run full mobile pass at 375px, 414px, 768px per the 15-point checklist in the original `Audit + Lovable Rebuild Plan` Notion doc. 65% of B2B traffic is mobile.

**Effort:** 3 days

#### 18. Email lifecycle automation

Day 0 / 2 / 5 / 10 / 21 sequence per the GTM Tools spec.

**Effort:** 1 week

#### 19. Share-triggered double email capture

**Per email capture strategy memo Layer 2.** Rebuild share UX to 2-field form (sharer + recipient). Each share = 2+ captures. K-factor amplifier.

**Effort:** 3 days

#### 20. Exit-intent salvage modal

**Per audit doc Fix 10.** Mouse leaves viewport top → modal: "Before you go, free Chapter 7 (the Dead Zone)."

**Effort:** 2 days

#### 21. 90-day re-take automation

Auto email at day 90 with one-click re-take + side-by-side before/after comparison.

**Effort:** 3 days

#### 22. Pre-generated microsites for Wave 1 cold email

**Per parked Notion strategy.** Pre-generate microsites for Named 500 list. Cold email links to dormant pre-generated map. Predicted lift: open rate 35–45% → 50–65%, click rate 3–5% → 12–20%.

**Effort:** 1 week

---

### P3 — Polish / Backlog

- Custom 20-second Adam founder intro video (replace S6E1 placeholder)
- Real Adam + Richard working photo on `/about`
- Trophy 3D commissioned render (replaces placeholder)
- Cold email sequence translation per vertical
- Lighthouse + accessibility audit (target Performance 90+, Accessibility 95+)
- Slug collision handling (4-char hash)
- Server-side rate limit on `/assess`
- WCAG AA accessibility audit
- LinkedIn auto-share card with score + finding
- Public/private map toggle
- Embeddable badge ("Show your GTM Score on your site")

---

## Ship plan — 14-day sequence

### Days 1–2 (P0 wave 1)

1. Firm name extraction priority chain
2. PostHog event taxonomy

### Days 3–4 (P0 wave 2)

3. Kill template Hypothesis/Question boilerplate
4. Kill $1.2M fabrication
5. Time copy mismatch (hero sub-line)
6. `/assess` sub-line rewrite
7. Replace Calendly URL

### Days 5–7 (P0 wave 3 + P1 quick wins)

8. "Did we nail it?" feedback capture
9. Score variance cheap-path fix
10. Wait-state error handling

### Days 8–10 (P1 personalization)

11. Engagement-triggered email capture (post-Section-5)
12. Org-specific chat starter prompts
13. Pre-fill Calendly with map context

### Days 11–14 (P1 ops)

14. Ops dashboard build at `/ops`

### Day 15 — Verification

Re-run the same 3-firm regression suite (AG Consulting Partners, Chief Outsiders, Jabian). Score. Compare to today's 5.3/10 average. **Target: 9.0/10.**

If we hit 9.0, move to P2 sequence.
If we don't, root-cause and iterate before adding new scope.

---

## The trifecta — if we ship only one batch

If only one batch ships, ship the trifecta:

1. **Firm name extraction** (Section 5.1.A in audit memo)
2. **Hypothesis/Question de-templating** (Section 5.1.B)
3. **"Did we nail it?" capture** (Section 5.2)

These three changes raise quality from 5.3 → 7.5 in 4 days and unlock the feedback loop that drives every subsequent improvement.

Everything else is downstream of those three.

---

## Email capture strategy summary (the WHY for these specific fixes)

**Recommendation:** soft, non-blocking, three-layer architecture. Never gate the MAP itself.

| Layer | Where | Trigger | Capture rate |
|---|---|---|---|
| 1 (primary) | Inline card after Section 5 | Scroll past + 60s dwell OR orbit click | 25–35% |
| 2 (K-factor) | Share UX | User clicks "Forward to my partner" | 80%+ of sharers (2 emails per share) |
| 3 (salvage) | Section 11 + exit intent | Save click OR exit intent | 7% + 5% |

**Predicted total lift:** ~6.7× over current baseline (90/month → 605/month captures).

**The ask is research-framed reciprocity, not extraction.** "You're contributing to the cohort. We'll send you the manuscript chapter when this round closes." NOT "Sign up to download the report."

Full strategy in [`edith-email-capture-strategy.md`](../edith-email-capture-strategy.md).

---

## Decision log — locked decisions that constrain the roadmap

These are settled. Don't re-litigate without coordination with Adam.

| Decision | When locked | Why |
|---|---|---|
| **No email gate on the MAP** | V10 (April 27) | PS partners reject manipulation; trust converts to calls |
| **Single-field intake** | V10 | More fields = exponentially lower completion |
| **Research framing throughout** | V10 | "Research artifact, not sales diagnostic" — discriminator vs SaaS pattern |
| **Verified facts only** | April 26 | Killed 7 fabricated stats; protects authority play |
| **Native vocabulary per vertical** | April 25 | Each vertical reads native to its world |
| **Single CTA per page** | April 25 | No competing offers |
| **Confidentiality over scarcity** | April 26 | "Confidential. Benchmarked against peer firms." |
| **Free tools only (Framer Motion + tsparticles + Lenis)** | April 25 | No GSAP, no new licensing cost |

---

## See also

- [`edith-map-audit-memo.md`](../edith-map-audit-memo.md) — full audit findings (the source for many P0 items)
- [`edith-touchpoint-improvements.md`](../edith-touchpoint-improvements.md) — step-by-step playbook across 50+ touchpoints
- [`edith-email-capture-strategy.md`](../edith-email-capture-strategy.md) — the email layer thinking
- [01-strategy.md](./01-strategy.md) — locked decisions and constraints
- [03-magnet-flow.md](./03-magnet-flow.md) — what's being modified

---

*Last updated: May 1, 2026*
