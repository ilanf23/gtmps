# EDITH · Touchpoint Improvement Playbook
**To:** Ilan
**From:** EDITH
**Date:** May 1, 2026
**Re:** Step-by-step improvement list across the entire Discover Mabbly + MAP funnel
**Companion to:** `edith-map-audit-memo.md`

This document walks every touchpoint from first impression to closed deal, lists what's there today, and ranks possible improvements per step. Effort tags: **XS** (<1 day) · **S** (1–2 days) · **M** (3–5 days) · **L** (1–2 weeks).

Priority tags: **[P0]** ship this week · **[P1]** ship next week · **[P2]** within 30 days · **[P3]** polish/backlog.

---

## STAGE 1 · PRE-SITE (Awareness → Click)

### Step 1.1 — The cold email send (Wave 1 cohort)
**Today:** Apollo sequence "Discover Mabbly · Consulting Wave 1 · 5-Touch" routes management consulting partners to `/consulting`. Single-threaded subject lines.

**Improvements:**
1. **[P1, S]** Pre-generated microsites per cohort prospect — flip the ask from "please take this analysis" to "we already analyzed your firm". Per the parked Notion strategy, predicted lift: open rate 35-45% → 50-65%, click rate 3-5% → 12-20%. Build for top-50 priority firms first.
2. **[P0, XS]** A/B test the subject line opener. Three variants minimum: data-led ("Your firm has X dormant proposals"), curiosity-led ("We mapped your Five Orbits"), peer-led ("AArete and SPR are in this cohort").
3. **[P1, S]** Append unique tracked URL per recipient: `discover.mabbly.com/consulting?utm=apollo-w1-[id]&firm=[slug]`. Lets us tie inbound MAP submissions back to specific outbound sends.
4. **[P2, S]** Day-4 follow-up: instead of generic re-send, link to a specific finding ("Saw [firm] just announced X — that's a Signal moment for your Dead Zone").

### Step 1.2 — LinkedIn / podcast / organic entry
**Today:** LinkedIn Adam (5 posts/week) + Richard (3/week) + Podcast (1/week) all route to `discover.mabbly.com`. Generic UTM at best.

**Improvements:**
1. **[P0, XS]** UTM-tagged short links per channel and per-post variant. `discover.mabbly.com/?src=li-adam-[post-id]`. Without this, the cross-channel campaign data is unreadable.
2. **[P1, S]** Per-channel landing variants. LinkedIn click → `/discover?eyebrow=linkedin` shows tweaked hero copy ("You came from LinkedIn — here's what 500 PS leaders found"). Podcast click → `/discover?eyebrow=podcast` shows tweaked hero. One template, four variants.
3. **[P2, M]** Retargeting pixel on every entry page (Meta + LinkedIn TLA). Score takers who don't unlock retarget with chapter-specific creative.

### Step 1.3 — First impression / 0–3 seconds
**Today:** Browser tab title is generic. Adam video autoplays muted. No favicon distinction across surfaces.

**Improvements:**
1. **[P0, XS]** Per-page meta titles (some shipped Apr 27, verify all 11 pages). Each title should include "Mabbly · GTM for PS" suffix for tab consistency.
2. **[P1, S]** Custom OG images per vertical page. Today they likely all share the same default. Per-vertical "For Law Firms · Origination Strategy" hero in OG = bigger LinkedIn click-through.
3. **[P2, S]** Favicon ⊙ symbol — the orbit symbol from the book. Tiny detail, big brand discipline.

---

## STAGE 2 · ENTRY (Land → Engage)

### Step 2.1 — `/discover` homepage hero
**Today:** Eyebrow "THE FIRST RESEARCH ON HOW PS FIRMS GROW", headline "Your next client already knows you", trust line "Free. 10 minutes. Confidential." Adam video card.

**Improvements:**
1. **[P0, XS]** **Time copy mismatch.** Hero says "10 minutes" — `/assess` says "90 seconds." V10 spec said 90 seconds replaces 10 minutes everywhere. Fix the hero to match.
2. **[P0, XS]** Add a 1-line "what is this" beneath the headline for cold visitors who don't know what discover.mabbly.com is. Suggested: "A free 90-second diagnostic that maps your firm's Five Orbits — built from 500 PS firm interviews."
3. **[P1, S]** Replace placeholder Adam S6E1 video with custom 20-second founder intro (still pending per Notion).
4. **[P1, S]** Add subtle scroll cue at hero bottom — most visitors don't know there's more below the fold. A single chevron with ambient pulse is enough.
5. **[P2, S]** A/B test specificity-led variant: "The Dead Zone holds $400K of revenue per client. Here's how to activate it." vs the current poetic version.

### Step 2.2 — `/discover` body sections
**Today:** ~14 sections including Five Orbits, Dead Zone calculator, MAP placeholder, Proof, Manuscript, Podcast, FAQ, etc. Audit doc already specs 10 critical fixes.

**Improvements:**
1. **[P0, S]** **Stat count-up animation glitch.** Richard's stats card (and likely others) gets caught mid-animation if the user scrolls fast. Snap to final value if user passes during count.
2. **[P0, S]** Run the 10-fix priority list from `Audit + Lovable Rebuild Plan` Notion doc — Five Orbits SVG, MAP scores, calculator default, scroll motion, mobile pass.
3. **[P1, S]** Add an inline "see a sample MAP" preview section before the final CTA — a screenshot or 30-second loop showing what the visitor will get. Removes the "what am I getting" objection.
4. **[P2, M]** Build the exit intent modal (Fix 10 from audit, still pending). Captures bounces with Chapter 7 (Dead Zone) free PDF.

### Step 2.3 — Vertical pages (`/consulting`, `/law`, etc.)
**Today:** Eight verticals live with native vocabulary translations. CTA per vertical reads "See Your Firm's [native term] Profile →".

**Improvements:**
1. **[P1, S]** **Industry Reality data sourced and cited per vertical** (still pending per the status checklist). Each vertical should show 3 industry-specific stats with source citations (IBISWorld, ABA, AICPA, AESC).
2. **[P1, S]** Per-vertical case study card. Today only 3 verified cases (Madcraft, Calliope, SPR) and they're all marketing/MSP/consulting-adjacent. Build at least one stub case per vertical even if it's just an anonymized synthesis.
3. **[P2, M]** Vertical-specific FAQ entries — law partners ask different questions than MSP CEOs. Today FAQ is generic.

---

## STAGE 3 · INTAKE (`/assess`)

### Step 3.1 — `/assess` form
**Today:** Single URL field. Sub-line: "ANALYZES POSITIONING, MESSAGING, CTAS, CONSISTENCY." Adam video repeats. CTA "Build My Map →".

**Improvements:**
1. **[P0, XS]** **Misleading sub-line.** "ANALYZES POSITIONING, MESSAGING, CTAS, CONSISTENCY" creates an SEO-audit expectation. Fix to: "Maps your Five Orbits — Core Proof, Active, Dead Zone, Warm Adjacency, New Gravity."
2. **[P0, XS]** Add inline preview thumbnail of a sample MAP below the form. Removes "what does the output look like" objection.
3. **[P1, S]** Add optional "Your name" field (collapsed below the URL by default). Today the MAP says "For [Firm Name]" but never "For [Person]." A tiny optional capture lets us greet the partner by name without adding friction.
4. **[P1, S]** Add validation: if URL fails to scrape (404, blocked, JS-only SPA), surface "We couldn't read this site — try entering your About page URL instead" rather than a hung wait theater.
5. **[P2, S]** "Resume your map" — if visitor previously submitted, recognize cookie and offer to re-open their existing slug instead of creating a duplicate.

### Step 3.2 — Submit interaction
**Today:** Click triggers Supabase insert + fire-and-forget edge function call, navigates to `/m/[slug]`.

**Improvements:**
1. **[P1, S]** Slug collision handling. Two firms with same domain stem create same slug. Append 4-char hash to all slugs.
2. **[P2, S]** Server-side rate limit (one submission per IP per minute). Today nothing prevents a curious dev from submitting 50 firms.

---

## STAGE 4 · GENERATION (Wait Theater + Backend)

### Step 4.1 — Wait theater
**Today:** 4-stage progress bar with time counter, firm logo extracted, "Reading your homepage" label, 60–90 second window.

**Improvements:**
1. **[P0, M]** **Error UI for failed enrichment.** If `enrich_status = 'error'`, show graceful "Something went wrong — we'll email you when it's ready" with email capture. Today an error state likely just hangs.
2. **[P1, S]** Multi-source scraping in parallel. Today the wait theater says "Reading your homepage" but per Notion it should also pull `/about`, `/team`, `/case-studies`. Surface the additional sources in the UI ("Reading homepage / Pulling case studies / Mapping orbits / Building map") to feel more thorough.
3. **[P2, S]** Live-stream the orbit visualization as it computes. Show Core Proof appear at 25%, Active at 40%, Dead Zone at 60%, etc. Theater is good — interactive theater is better.
4. **[P3, S]** Add a "Why this takes 90 seconds" tooltip — 1 line transparency reduces drop-off anxiety.

### Step 4.2 — AI enrichment pipeline (the backend prompt)
**Today:** gpt-4o-mini, temperature 0.4, 2000 max tokens, single-page Jina scrape, Hormozi × RROS system prompt.

**Improvements:**
1. **[P0, M]** **Firm name extraction priority chain.** Pull `<title>` → `og:site_name` → LinkedIn schema → URL stem → AI extraction (in that order, fallback chain). Current AI-first logic is wrong on 2 of 3 firms.
2. **[P0, M]** **Kill template Hypothesis/Question boilerplate.** Move into the AI call tied to the specific `Observed` text per orbit. Currently 100% identical across firms.
3. **[P0, S]** **Audit prompt for fabricated dollar figures.** The "$1.2M unrealized revenue" is appearing word-for-word on multiple firms. Replace with calculated estimate from real signals or remove.
4. **[P1, M]** **Widen signal source.** Scrape `/about`, `/team`, `/case-studies`, recent press releases, LinkedIn schema in parallel. Today the AI scores 5 orbits from 1 page of HTML — that's why scores compress.
5. **[P1, S]** **Bump model from gpt-4o-mini to gpt-4o for the `Observed` sections only** — they need precision. Keep mini for templated/structural fields. ~$0.02/call at gpt-4o, still cheap.
6. **[P2, M]** **Brand color extraction actually applies.** Today all maps render default Mabbly navy. Verify color extraction logic, force non-default if any branded color present, fallback to dominant logo color for accent.
7. **[P2, M]** **Score variance fix.** Either bump temperature variance or rebalance the system prompt to push for actual differentiation across firms (today every firm scores 78–84/26–30/53–55 in same orbits).
8. **[P3, S]** Cache the homepage scrape per domain for 7 days. Saves cost on duplicate submissions.

---

## STAGE 5 · MAP CONSUMPTION (`/m/:slug`)

### Step 5.1 — Section 01 · Personalized Header
**Today:** "Your Revenue Map for [Firm Name]" + cohort line + Truth I quote.

**Improvements:**
1. **[P0, XS]** Validate firm name extraction (per Step 4.2.1 above).
2. **[P0, XS]** **"Not quite — fix this" inline edit on the firm name.** One-click correction if AI extracted wrong text. Closes the personalization trust gap immediately.
3. **[P1, S]** Add visitor name if captured at intake ("For Brandon at AG Consulting Partners"). Tiny detail, big "did we nail it" moment.
4. **[P2, S]** Score-adaptive header subtitle. Today everyone reads "Clear opportunities identified." Variants A/B/C/D from V10 spec are not visibly applied.

### Step 5.2 — Section 02 · Five Orbits Visualization
**Today:** SVG renders 5 concentric circles with scores per orbit. Tap-to-read-observation per orbit.

**Improvements:**
1. **[P1, S]** Score visual scale needs to mean something. Today 80 vs 78 vs 84 looks identical. Use color severity bands (red <30, yellow 30-60, green >60) so the visual scan delivers the verdict before reading.
2. **[P1, S]** Animate the orbit drawing on viewport entry (per audit Wow Moment 2). Today the rings render statically — adds zero theater.
3. **[P2, S]** "Compare to peer firms in your vertical" toggle. Show benchmark band against the 30-firm cohort average per orbit.

### Step 5.3 — Section 03 · Your Core
**Today:** Observed / Hypothesis / Question structure.

**Improvements:**
1. **[P0, S]** **Wire the "Did we nail it?" capture** — copy already exists, mechanism doesn't. Three buttons (👍 Spot on / 🤔 Half right / 👎 Off) plus optional comment field. Posts to `magnet_feedback`.
2. **[P0, M]** Kill template Hypothesis (per Step 4.2.2).
3. **[P1, S]** Add a "Refine my Core" button. Visitor can edit the Observed text directly — corrections feed the prompt improvement loop.

### Step 5.4 — Section 04 · Your Proof
**Today:** Observed / Hypothesis / Question. References Madcraft case proof.

**Improvements:**
1. **[P0, S]** Wire the "Did we nail it?" capture (same as 5.3).
2. **[P0, S]** **Kill the $1.2M fabrication** (per Step 4.2.3). Replace with calculated Dead Zone Value or remove.
3. **[P1, M]** Surface the firm's strongest proof asset directly. Today we say "Your case studies showcase X" generically — better to extract one specific case study URL/title and quote it back.

### Step 5.5 — Section 05 · Compact CTA Card ("Skip ahead. Book Adam now.")
**Today:** First conversion opportunity at position 5. "30 minutes. No pitch."

**Improvements:**
1. **[P0, XS]** Wire click attribution event (`map_cta_clicked` with `cta_location: section_5_compact`).
2. **[P1, S]** Score-adaptive variants A/B/C/D actually different per persona (V10 promised this but visually they look identical).
3. **[P2, S]** Show Adam's actual next 3 available slots inline ("Tuesday 10am · Wednesday 2pm · Thursday 11am") rather than "4-6 slots open this week" generic. Calendly API supports this.

### Step 5.6 — Section 06 · Why This Research Matters
**Today:** "30 firms. 500 practitioner interviews. Validated by Copulsky." + Verified cohort logos (Madcraft, Calliope, SPR, AArete).

**Improvements:**
1. **[P1, S]** Verify the "26 years of PS firm leadership · Richard Ashbaugh scaled A.T. Kearney from $250M to $1.2B" claim is accurate per Notion (the Notion ICP doc says AArete revenue was $400M, Kearney was $1.2B). Make sure both numbers are right and sourced.
2. **[P1, S]** Live updating "X firms in cohort, your firm is the [N]th to contribute" counter. Real-time scarcity-free trust.
3. **[P2, S]** Click-through on each cohort firm logo opens a 1-line case stat in modal, not a dead link.

### Step 5.7 — Section 07 · The Value (In Their Words) + Adam Credibility
**Today:** Madcraft / Calliope / SPR mini-cards with verified quotes. Adam credibility line at bottom.

**Improvements:**
1. **[P1, S]** Add Adam's real photo (placeholder still pending per Notion ship log).
2. **[P1, M]** Vertical-matched testimonial. If visitor came from `/law`, surface a law firm case (build one if it doesn't exist). Today Madcraft (agency) shows for everyone regardless of vertical.
3. **[P2, S]** Add 1-line LinkedIn link per testimonial author so visitors can verify they're real people.

### Step 5.8 — Section 08 · Full CTA Section ("Book a walkthrough with Adam")
**Today:** Inline calendar embed + score-adaptive copy. "Free call. No pitch."

**Improvements:**
1. **[P0, XS]** Wire attribution event (`cta_location: section_8_full`).
2. **[P0, S]** **Embed the actual Calendly inline** rather than CTA-to-modal. Inline embed = booking rate measurably higher.
3. **[P1, S]** Pre-fill Calendly with firm name + slug + map URL so when Adam takes the call, he sees the map context immediately.
4. **[P2, S]** Show "Adam looked at [N] firm maps this week" social proof above the calendar.

### Step 5.9 — Section 09 · Highest Leverage Move
**Today:** "Reactivate your Dead Zone with a 7-minute signal — same play Madcraft ran." Generic 30-min "send personalized email to 3 dormant contacts" instruction.

**Improvements:**
1. **[P0, M]** **De-template this.** Today all three firms got nearly the same advice ("3-5 dormant contacts, 30 min"). Should reflect the specific gap pattern in their orbit scores.
2. **[P1, M]** Generate a downloadable "First Move Card" — printable 1-pager with the move, the script template, and the success criteria. Tangible takeaway = higher recall = higher booking rate later.
3. **[P2, S]** Show 3 alternative moves ranked by leverage, not just one. Reader picks their own.

### Step 5.10 — Section 10 · Deeper Findings (Signal / Cadence / Research Flag)
**Today:** Three accordion sections — Signal Analysis, Cadence Read, Research Flag. Currently all template boilerplate with firm name swapped in.

**Improvements:**
1. **[P0, M]** **De-template all three.** This is the worst offender — these read identical across all three test firms today. Should be 100% AI-generated based on observed signals.
2. **[P0, S]** Wire "Did we nail it?" per finding (3 capture widgets).
3. **[P2, S]** Add a 4th optional finding: "What we couldn't see" — explicit transparency about what the AI flagged but couldn't verify. Builds trust by admitting limits.

### Step 5.11 — Section 11 · Manuscript Anchor + Share + Save
**Today:** Adam quote, Share buttons (email forward / copy link), Save (email me this map).

**Improvements:**
1. **[P0, XS]** Wire attribution events (`map_share_clicked`, `map_save_email_submitted`).
2. **[P1, S]** Add "Forward to my partner" pre-formatted email with intro line ("[Visitor name] thought you'd want to see this — Mabbly's Five Orbits map of [firm name]"). One-click forward = K-factor lift.
3. **[P1, S]** Show how many firms have shared their map this week ("47 PS leaders shared their map this week"). Dynamic social proof.
4. **[P2, S]** Embeddable badge: "Show your GTM Score on your site" — productized virality from the funnel doc. Each badge becomes a backlink.

---

## STAGE 6 · TALK TO THE BOOK (`/m/:slug/chat`)

### Step 6.1 — Chat starter prompts
**Today:** 3 generic hardcoded prompts.

**Improvements:**
1. **[P1, S]** **Generate 3 firm-specific starters as part of enrichment** (per memo Section 5.3). Add `chatStarters: array[3]` to `BreakdownData` schema.
2. **[P2, S]** Suggest follow-up prompts after each AI reply ("Want me to apply this to your Dead Zone specifically?"). Conversation tree, not Q&A.

### Step 6.2 — Chat UX
**Today:** Floating bottom-right panel. Scoped to firm's GTM via `magnet-chat` edge function loading `breakdown_data`.

**Improvements:**
1. **[P1, S]** Add a "Continue this thought in a 30-min call with Adam" CTA after every 5 messages. Highest-engagement point of the chat.
2. **[P1, S]** Persist chat history per slug. Returning visitor sees their prior conversation.
3. **[P2, S]** Allow voice input. Tablets/phones, especially. PS partners are voice-first, not text-first.

---

## STAGE 7 · READ THE MANUSCRIPT (`/m/:slug/read`)

### Step 7.1 — In-book inline feedback
**Today:** Static PDF reader (react-pdf). No feedback layer.

**Improvements:**
1. **[P0, M]** **Floating "💬 React to this page" button** on every page (per memo Section 5.4). Same 3-button widget pattern. Posts to `manuscript_feedback`.
2. **[P1, S]** Highlight + comment per paragraph. Hypothesis-style annotation. Beta Reader Program becomes a real feedback engine.
3. **[P2, M]** "287 PS leaders flagged Chapter 7 as most-relevant" — show feedback aggregates as social proof.
4. **[P2, S]** Per-firm chapter recommendations. AI suggests "Chapter 1 + Chapter 7 are most relevant for your firm" based on the orbit gap pattern.

### Step 7.2 — Reader UX
**Today:** PDF rendering only.

**Improvements:**
1. **[P1, M]** Search across the manuscript.
2. **[P1, S]** Bookmarks per slug.
3. **[P2, M]** Audio narration mode (Adam's voice, AI-cloned for non-recorded chapters).

---

## STAGE 8 · CONVERSION (`/book` → Discovery Session)

### Step 8.1 — `/book` page
**Today:** 4 expectations + Calendly embed (URL still placeholder per launch checklist).

**Improvements:**
1. **[P0, XS]** Replace placeholder Calendly URL.
2. **[P0, S]** Pre-fill Calendly with `slug`, `firm`, `map_url`, `score_total`, `bd_challenge` as hidden custom questions. Adam walks in fully briefed.
3. **[P1, S]** Show Adam's calendar live, not "book a session" CTA. Inline picker, no extra page load.
4. **[P1, S]** Show 1-line testimonial above calendar from a firm in same vertical: "Most useful 30 minutes I've spent this quarter — [Name], [Firm]." Builds last-mile commitment.
5. **[P2, S]** Confirmation page: ICS download + Loom of Adam (1-min) introducing himself + sample MAP from a similar firm.

### Step 8.2 — Pre-call email sequence
**Today:** Calendly's default confirmation only.

**Improvements:**
1. **[P1, S]** Day 0: Confirmation + map link + 1-line "what to bring."
2. **[P1, S]** Day -1: "See you tomorrow + 3 questions Adam might ask."
3. **[P1, S]** Hour -1: "Adam is ready. Here's your map link if you want to pre-read."

### Step 8.3 — Post-call follow-up
**Today:** Manual (Adam sends per his own cadence).

**Improvements:**
1. **[P1, M]** Auto-generated post-call email with: Fathom transcript link + 3 next moves (extracted from call) + booking link for follow-up + "Apply to Beta Reader" CTA.
2. **[P2, M]** Post-call MAP refresh. Insert call findings into a v2 of their map. "Here's what we learned together."

---

## STAGE 9 · POST-MAP LIFECYCLE

### Step 9.1 — Email lifecycle (per GTM Tools spec)
**Today:** No automated sequence wired (per current build status).

**Improvements:**
1. **[P0, M]** Day 0: Map delivered + "save this link" + Beta Reader application CTA.
2. **[P1, S]** Day 2: "Your GTM Score was [X]. Here's the one move that would lift it 20 points."
3. **[P1, S]** Day 5: Vertical-matched case study.
4. **[P1, S]** Day 10: Direct ask — book a call with Richard.
5. **[P1, S]** Day 21: Drop into newsletter sequence if no action.

### Step 9.2 — Re-engagement / 90-day re-take
**Today:** "Re-take in 90 days" promise on Section 11. No automation.

**Improvements:**
1. **[P1, S]** 90-day automated email: "Re-take your map. See how you've changed." Pre-filled with their firm URL, one-click trigger.
2. **[P2, M]** Side-by-side before/after view. Show orbit score delta. Compelling enough to share.

### Step 9.3 — Dead-zone reactivation (irony intended)
**Today:** Submitted but didn't book → silence.

**Improvements:**
1. **[P0, S]** Score takers who didn't book → LinkedIn TLA retargeting ad: "Want your full Playbook?"
2. **[P1, S]** Day 30: "30 firms have booked this month. Here's what they got that you didn't yet."

---

## STAGE 10 · CROSS-CUTTING SYSTEMS

### Step 10.1 — Attribution + Analytics
**Today:** Supabase row tracking only. No PostHog/Segment/Amplitude visible.

**Improvements:**
1. **[P0, S]** **Wire PostHog event taxonomy** (full list in memo Section 4). Day 1 spend.
2. **[P0, S]** Build the funnel view: Submit → Wait Complete → Section 5 viewed → Section 8 CTA clicked → Chat opened → Booking clicked → Booked → Showed.
3. **[P1, S]** Per-vertical funnel breakdown.
4. **[P1, M]** Self-reported attribution survey at booking ("How did you find us?"). Combine with UTM data for true source picture.

### Step 10.2 — "Did We Nail It?" — global capture infra
**Today:** Copy exists at sections 03/04. No mechanism.

**Improvements:**
1. **[P0, S]** Build the unified `magnet_feedback` capture component. Use across every section that has feedback copy. Same widget, same data shape.
2. **[P1, S]** Daily Slack/email digest to Adam: "Yesterday's feedback — 12 spots-on, 4 half-rights, 2 offs. Top comment: '[X]'."
3. **[P2, M]** Use the feedback to auto-tune the system prompt. Sections that score "Off" >20% get rewritten.

### Step 10.3 — Mobile experience
**Today:** Audit doc flagged mobile-first as critical. Some progress, but full mobile pass at 375/414/768 still pending.

**Improvements:**
1. **[P0, M]** Run full mobile audit pass per the 15-point checklist in `Audit + Lovable Rebuild Plan` Notion doc. 65% of B2B traffic is mobile.
2. **[P1, S]** Sticky bottom CTA on mobile maps that auto-hides on chat-open.
3. **[P2, S]** Mobile-specific orbit visualization (audit doc specced a vertical card stack instead of SVG — verify shipped).

### Step 10.4 — Performance / Speed
**Today:** Unknown. No Lighthouse score reported.

**Improvements:**
1. **[P0, S]** Run Lighthouse on `/discover` and `/m/:slug`. Target Performance 90+, Accessibility 95+.
2. **[P1, S]** Lazy-load below-fold sections. Hero must paint <1.5s.
3. **[P1, S]** Prefetch `/assess` from `/discover` hero (probable next page).

### Step 10.5 — Error handling (cross-cutting)
**Today:** Limited error UIs visible.

**Improvements:**
1. **[P0, M]** Enrichment error fallback (per Step 4.1.1).
2. **[P0, S]** Slug-not-found page with "Did you mean...?" suggestions.
3. **[P1, S]** Calendly embed failure fallback (direct booking link).
4. **[P1, S]** Chat error state ("Adam's library is offline — try again in a moment").

### Step 10.6 — Accessibility
**Today:** Audit doc targets WCAG AA. Status unknown.

**Improvements:**
1. **[P1, M]** Full WCAG AA audit. Report any failures. Touch targets, contrast, keyboard nav, screen reader.
2. **[P2, S]** `prefers-reduced-motion` respected on all animations (audit doc says yes — verify on every Wow Moment).

### Step 10.7 — Sharing + virality mechanics
**Today:** Email forward + copy link. "Forward to your partner" copy.

**Improvements:**
1. **[P1, S]** Auto-generated LinkedIn share card (per GTM Tools spec) with firm name + score + 1 finding.
2. **[P1, S]** Embeddable badge: "Show your GTM Score on your site."
3. **[P2, M]** Public/private toggle. Some firms will want their map indexed for SEO; others private.

---

## STAGE 11 · ADJACENT SURFACES (Not directly in MAP funnel)

### Step 11.1 — `/awards`
**Today:** Live. 8 awards per vertical with native vocabulary. Single CTA "Add Your Firm".

**Improvements:**
1. **[P1, S]** "Apply for the Award" should route into `/assess` or a modified intake — most efficient way to capture lead.
2. **[P2, M]** Live winners feed (after Q3 ceremony) — keeps page evergreen.

### Step 11.2 — `/about`
**Today:** Founder bios, S6E1 audio, three rooms architecture, Copulsky foreword.

**Improvements:**
1. **[P1, S]** Add real Adam + Richard working photo (placeholder still pending).
2. **[P2, S]** Live ticker of recent activity ("Adam published Chapter 4 draft 3 days ago", "Richard recorded podcast with [guest] last week").

### Step 11.3 — `/manuscript`
**Today:** Bespoke editorial page.

**Improvements:**
1. **[P1, S]** Single CTA into `/assess`. Today the page may be a content cul-de-sac.
2. **[P2, M]** Live "currently reading" count from Beta Reader cohort. Trust signal.

### Step 11.4 — Cohort microsites (`/pepper-group`, `/google`, `/spr`, `/aletheia`)
**Today:** Per-client personalized pages (shared shell or one-off).

**Improvements:**
1. **[P1, S]** Each cohort microsite should link to "build YOUR map" CTA. Today they're proof artifacts but not lead surfaces.
2. **[P2, M]** Convert one-off microsites (`/spr`, `/aletheia`) to shared shell pattern for maintainability.

---

## STAGE 12 · BACKEND / DATA / OPERATIONS

### Step 12.1 — Supabase schema
**Today:** `magnet_submissions` table.

**Improvements:**
1. **[P0, S]** Add `magnet_feedback` table (for "Did we nail it?" captures).
2. **[P0, S]** Add `manuscript_feedback` table (for in-book reactions).
3. **[P1, S]** Add `magnet_events` table (for client-side event tracking, optional if PostHog wired).
4. **[P1, S]** RLS policies on every new table (per launch checklist).

### Step 12.2 — Cost / scaling
**Today:** ~$0.002/MAP via gpt-4o-mini + Jina free tier.

**Improvements:**
1. **[P1, XS]** Set OpenAI budget alert at $50/day. At $0.002/call that's 25K maps — generous but bounded.
2. **[P1, S]** Cache the gpt-4o-mini response per domain for 7 days. Saves ~30% on duplicate sims (researchers, Adam testing, etc.).
3. **[P2, S]** Tiered model — gpt-4o-mini for low-priority verticals, gpt-4o for high-value (consulting, law).

### Step 12.3 — Operational alerts
**Today:** Unknown.

**Improvements:**
1. **[P0, S]** Slack alert when MAP enrichment fails (`enrich_status = error`). Adam should never silently lose a lead.
2. **[P1, S]** Daily digest: maps generated, bookings booked, feedback captured, top "Off" sentiment.

---

## EXECUTIVE SUMMARY

Total improvements speced: **~120 across 50+ touchpoints**.

**Ship Week 1 (the trifecta + foundations):**
- Firm name extraction (Step 4.2.1)
- Hypothesis/Question de-templating (Step 4.2.2)
- Kill $1.2M fabrication (Step 4.2.3)
- "Did we nail it?" capture (Step 5.3, 5.4, 5.10, 10.2)
- PostHog event wiring (Step 10.1)
- Time copy mismatch (Step 2.1.1)
- Misleading `/assess` sub-line (Step 3.1.1)
- Calendly URL replacement (Step 8.1.1)

**Ship Week 2 (personalization depth + book chat):**
- Score variance fix (Step 4.2.7)
- Multi-source scraping (Step 4.2.4)
- Org-specific chat starters (Step 6.1.1)
- Inline edit on firm name (Step 5.1.2)
- Pre-fill Calendly (Step 8.1.2)

**Ship Week 3-4 (manuscript loop + lifecycle):**
- In-book feedback layer (Step 7.1.1)
- Email lifecycle automation (Step 9.1)
- Mobile audit pass (Step 10.3.1)
- Wait-state error handling (Step 4.1.1)
- LinkedIn share card (Step 10.7.1)

After Week 4: re-run regression suite (same 3 ICP firms, score, compare). Target: average MAP quality 5.3 → 9.0/10.

---

**Next move:** pick which week-1 batch to start, or send this list to Adam for prioritization input. EDITH out.
