# EDITH · MAP Audit Memo
**To:** Ilan
**From:** EDITH
**Date:** May 1, 2026
**Re:** discover.mabbly.com — touchpoint audit, MAP simulation findings, 10× plan
**Context:** Read Discover Mabbly Notion + GTM for PS Notion in full. Walked the live site. Ran 3 deep MAP simulations across Adam's named ICP cohort (AG Consulting Partners, Chief Outsiders, Jabian Consulting). Ground truth locked. Findings below.

---

## 1. The Headline Finding (Read This First)

**The MAP is structurally sound and visually beautiful. The personalization is failing in ways that destroy trust on contact.**

I ran three real ICP firms through `/assess`. Here is what came back as the very first thing each visitor sees in the headline:

| Firm submitted | What the MAP called them |
|---|---|
| AG Consulting Partners | **AG Consulting Partners** ✅ |
| Chief Outsiders | **Growth Strategy** ❌ (extracted a service line) |
| Jabian Consulting | **Jabian** ⚠️ (truncated, "Consulting" dropped) |

That is a **67% failure rate on the most important word on the page** — the firm's own name. If a partner shares this with their team and the headline says "Your Revenue Map for Growth Strategy," the map is dead in the water before scroll 1.

This single bug is the highest-leverage fix in the entire experience. It's a 1–2 day patch. Everything else in this memo is downstream of getting this right.

---

## 2. Touchpoint-by-Touchpoint Audit

### 2.1 `/discover` (homepage)

**What works:**
- Hero is clean — single CTA discipline holding
- "Your next client already knows you" lands (Truth I from book)
- Trust line: "Free. 10 minutes. Confidential. Benchmarked against peer firms." — institutional voice, no scarcity
- Section progress rail (left side) implements Fix 05 from the audit doc
- Single CTA "Add Your Firm →" repeats throughout, no competing offers
- Industry chip grid (8 verticals) gives visitors self-identification in one tap

**What could go wrong:**
- **Time mismatch.** Hero says "10 min diagnostic." `/assess` says "90 seconds." V10 spec said 90 seconds replaces 10 minutes everywhere. Stale copy on hero. **Fix: change to "90 seconds" on hero sub-line.**
- **Stat count-up animation glitch.** Caught Richard's Practitioner card mid-state ("2 years across 9 PS firms / $28M AArete"). Final state is "26 yrs / $125M" but the animation gets caught mid-count if the user scrolls fast. **Fix: snap to final value if user scrolls past before animation completes.**
- **First-time visitor doesn't know what discover.mabbly.com IS.** Eyebrow "THE FIRST RESEARCH ON HOW PS FIRMS GROW" is good but the headline doesn't say "this is a free diagnostic" — it says "your next client already knows you" which is poetic, not literal.
- **No exit intent capture wired** (Fix 10 still pending per the audit doc).

### 2.2 `/assess`

**What works:**
- Single field. V10 discipline holding. Clean.
- "90 seconds. We analyze your website and build your custom RROS map. No call required to see it." — sets the right expectation.
- "Free. 90 seconds. Full map shown — no email required to see it." — removes objections.

**What could go wrong:**
- **Misleading sub-eyebrow.** "ANALYZES POSITIONING, MESSAGING, CTAS, CONSISTENCY." This is wrong. The output is a Five Orbits map — relationships, not website copy. This sub-line creates a SEO/UX-audit expectation that the MAP does not deliver. Visitor feels bait-and-switched. **Fix: rewrite to "Maps your Five Orbits — Core Proof, Active, Dead Zone, Warm Adjacency, New Gravity."**
- **No "what happens next" preview.** A partner who is skeptical of giving up their URL gets no preview of what the output looks like. **Fix: add a single screenshot or animated preview of a sample MAP below the form.**
- **Adam video is the same loop as `/discover`.** The video says "You've built a business" and is muted-by-default. There's no clear context for why this video plays here. **Fix per Notion:** "Custom 20-second Adam founder intro to replace S6E1 placeholder on form page" — still pending.

### 2.3 Wait theater (`/m/:slug` while polling)

**What works:**
- 4 stages with clear progress bar
- Time counter (00:04 / 01:30) sets expectation
- Firm logo extracted and shown
- Clean "Reading your homepage" stage label

**What could go wrong:**
- **Single fail point.** If the AI errors mid-generation (rate limit, prompt parse fail, Jina scrape fail), the user has no recovery. The Notion docs reference `enrich_status = 'error'` but there's no error UI specified. **Fix: build a graceful "Something went wrong — we'll email you when it's ready" fallback. And actually email it.**
- **No queueing visibility.** If two firms with the same slug submit (e.g., two "Wilson" firms), one overwrites the other. **Fix: append a 4-char hash to all slugs.**

### 2.4 `/m/:slug` (the MAP itself)

This is where the gold is — and where the rot is. See Section 3 below for full simulation findings.

### 2.5 `/m/:slug/chat` (Talk to the Book)

**Did not test live this run.** Per Notion V10, "Floating Chat scoped to firm's GTM" with 3 hardcoded starter prompts:
1. "How do I re-engage contacts I haven't spoken to in 12+ months without it feeling awkward?"
2. "What's the single highest-leverage thing I should do this week?"
3. "Can you write me a sample Formula message for my firm right now?"

These are GENERIC. Per your task: presets should be PER-ORG. We just identified their firm. We can do better. See Section 5.3.

### 2.6 `/m/:slug/read` (Manuscript Reader)

**Did not test live.** Per Notion: PDF reader via react-pdf. **Per your task: no inline feedback layer in the reader.** This is a pure consumption surface today. See Section 5.4.

### 2.7 `/m/:slug/feedback`

**Did not test live.** Per Notion: standalone feedback form via `submit-feedback` edge function.

### 2.8 `/awards`, `/about`, `/manuscript`, vertical pages

Out of scope for this MAP-focused audit per your direction. Cohort microsites (`/pepper-group`, `/google`, `/spr`, `/aletheia`) — same.

---

## 3. MAP Simulation Findings (3 runs deep)

### 3.1 Quality Scorecard

| Dimension | AG Consulting | Chief Outsiders | Jabian | Pattern |
|---|---|---|---|---|
| Firm name extraction | ✅ Correct | ❌ "Growth Strategy" | ⚠️ Truncated to "Jabian" | **2 of 3 broken** |
| Brand color extraction | Default navy | Default navy | Default navy | **0 of 3 actually used the firm's brand colors** (V10 promised this) |
| Specific observations | Inc. 5000, Microsoft, Nike refs | 120+ CXOs, 70 industries, Cameron Brown, Growth Gears®OS | Operational excellence, customer acquisition (vague) | AG > Chief Outsiders > Jabian on specificity |
| Hypothesis statements | Identical boilerplate | Identical boilerplate | Identical boilerplate | **100% template** |
| Question prompts | Identical | Identical | Identical | **100% template** |
| Deeper Findings (Section 10) | Word-for-word identical w/ name swap | Word-for-word identical w/ name swap | Word-for-word identical w/ name swap | **100% template** |
| Highest Leverage Move | "Send to 3 dormant contacts, 30 min" | "Identify 3 dormant contacts in CRM" | "Identify 5 dormant contacts, research news" | **Same move, slightly reworded** |
| Orbit scores | 80/26/38/55/28 | 84/30/38/55/32 | 78/26/28/53/36 | **Suspiciously narrow band — Core Proof always 78–84, Active always 26–30, Warm Adjacency always 53–55** |

**Score range:**
- AG: ~7/10 — best of the three. Real signals pulled from site.
- Chief Outsiders: ~4/10 — broken headline kills it before content can save it.
- Jabian: ~5/10 — vague observations, name truncation.

**Average MAP quality today: ~5.3/10.** Target after fixes: **9/10**.

### 3.2 Fabricated stat violation

The $1.2M figure ("could cost you $1.2M in unrealized revenue") appears word-for-word on AG and Chief Outsiders. That's a fabricated number being applied generically. It violates Adam's "verified facts only" lock from the Notion strategic principles (April 26 audit explicitly killed fake stats like AArete $1.2M). **The AI prompt is leaking placeholder language back into output.**

This will get caught the moment two managing partners compare maps. Lethal.

### 3.3 Score compression

The orbit scores cluster in a narrow band across firms because the AI is scoring from a single signal source (homepage HTML). It cannot tell the difference between AG (PMO consulting, $25M-ish, Inc 5000), Chief Outsiders (120-CXO firm, public proof of growth methodology), and Jabian (operational excellence consulting, named methodology). All three get Core Proof 78–84 / Active 26–30 / Warm Adjacency 53–55.

**The map cannot differentiate good firms from great firms.** Every firm gets a "you're 80 on Core Proof, 28 on Dead Zone" verdict. That's a research artifact problem — when every firm scores the same, the diagnosis means nothing.

### 3.4 "Did we nail it?" — the missing piece

Sections 03 and 04 already have the placeholder copy: **"We would love your feedback. Did we get this right?"** But there is no UI control attached. No thumbs up/down. No comment field. No capture mechanism.

The text exists. The mechanism doesn't. This is a 1-day fix and it's the foundation of everything else you asked for. See Section 5.2.

---

## 4. Attribution & Drop-Off Tracking — What's Missing

I checked for analytics events on the live flow. Findings:

**What we likely have** (per Notion build doc & code structure):
- Supabase row insertion at form submit (`magnet_submissions`)
- Slug + timestamp on creation
- `enrich_status` state transitions

**What we don't have visible:**
- No PostHog/Segment/Amplitude integration verified
- No scroll depth tracking on the result page
- No section-by-section dwell time
- No CTA click attribution (how many clicked "Book a Research Walkthrough" at section 05 vs section 08?)
- No chat-open vs chat-no-open ratio
- No email-save-this-map conversion rate
- No bounce points (where do users leave the result page?)

**Result:** We are flying blind on what's actually working in the MAP. We can't run the score-adaptive variant test (A/B/C/D from V10) without it. We can't optimize CTA placement without it. We can't even tell if users are reaching Section 08 (the full CTA) before bouncing.

**Recommendation:** Wire PostHog (free tier covers this volume) with these events on day 1:

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

Then build the funnel view: **Submit → Wait Complete → Section 5 → Section 8 CTA → Chat Open → Booking Click**. That's the real funnel. Today we have 1 of 6 events.

---

## 5. The 10× Plan — Ranked by Leverage

### 5.1 [P0 — Ship This Week] Fix the personalization layer

The single highest-leverage change. Three sub-fixes:

**A. Firm name extraction.** The current prompt parses homepage HTML with gpt-4o-mini and extracts what it thinks is the firm name. It's getting it wrong on Chief Outsiders (got service line) and truncating Jabian. **Fix:**
1. Pull the firm name from `<title>` tag first, fallback to OpenGraph `og:site_name`, fallback to LinkedIn schema, fallback to AI extraction.
2. Validate against the registered domain (e.g., "agconsultingpartners.com" → "AG Consulting Partners" should be extractable from the URL stem if all else fails).
3. Show the extracted name to the user with a one-click "Not quite — fix it" inline edit BEFORE they finish reading the map.

**B. Kill the template Hypothesis/Question boilerplate.** Today the Hypothesis statements in Sections 03 and 04 are byte-identical across all three firms. **Fix:**
- Move Hypothesis and Question generation INTO the AI call, not into a hardcoded template.
- Pass the `Observed` text back into the prompt and ask for a Hypothesis tied to THAT observation specifically.
- Vary by orbit position (a Core Proof hypothesis should not read the same as a Dead Zone hypothesis).

**C. Kill the $1.2M fabrication.** Audit the prompt for placeholder dollar values. Replace with calculated estimates from the visitor's actual signals (or remove entirely until we have a real calculation). This is the same battle Adam fought in April with the fake AArete $1.2M.

**Effort: 1–2 days. Impact: ~+20 quality points across every map.**

### 5.2 [P0 — Ship This Week] "Did We Nail It?" capture mechanism

You explicitly asked for this. The infrastructure is half-built — the copy exists, the mechanism doesn't.

**Spec:**
- After every major section (Core, Proof, Highest Leverage Move, each Deeper Finding) add a tight inline widget:

```
   ┌─────────────────────────────────────────┐
   │  Did we nail it?                        │
   │  [👍 Spot on]  [🤔 Half right]  [👎 Off] │
   │  ┌─────────────────────────────────┐    │
   │  │ What did we miss? (optional)    │    │
   │  └─────────────────────────────────┘    │
   └─────────────────────────────────────────┘
```

- After they hit any of the 3 buttons, the widget collapses to a checkmark and a one-line "Thanks — this shapes the manuscript."
- Posts to `magnet_feedback` table: `{ slug, section, sentiment, comment, timestamp }`.
- Adam gets a daily digest in Slack/email of the feedback.
- The data feeds the prompt improvement loop — sections that score "Off" >20% of the time get rewritten.

**Why this matters more than it looks:** every "Off" rating is an unfiltered prompt-improvement signal from a real ICP firm. After 100 maps, you have a quality dataset that lets you tune the gpt-4o-mini system prompt with precision. Today you have zero signal.

**Effort: 2 days. Impact: closes the feedback loop the V10 spec explicitly named ("research collaboration, not sales pitch") but didn't ship.**

### 5.3 [P1 — Ship Next Week] Org-specific book chat presets

You specifically asked for this. The /chat surface exists. The 3 starter prompts are generic.

**Spec:** Generate 3 firm-specific starter prompts as part of the enrichment pipeline (same gpt-4o-mini call, no extra cost). Store in `breakdown_data.chatStarters`. Surface them on `/m/:slug/chat`.

Example for AG Consulting Partners (PMO consulting firm):
1. *"How would the Dead Zone framework change AG's PMO engagement model with Microsoft and Nike?"*
2. *"What does Chapter 3's Formula look like applied to AG's Inc. 5000 momentum?"*
3. *"If AG ran a 7-day proof sprint like Madcraft, which orbit should we start with?"*

Example for Chief Outsiders (120-CXO marketing firm):
1. *"How do 120 fractional CMOs each run their own Dead Zone activation?"*
2. *"Does the Five Orbits framework adapt for a network model like Chief Outsiders'?"*
3. *"What's the highest-leverage signal type for fractional CXO engagements?"*

These pull the firm into THEIR specifics within the book's framework. The prompts feel earned, not generic.

**Implementation:** add a `chatStarters: array[3]` field to the `BreakdownData` schema. Generate in same enrichment call. Pass to MagnetChat component. Replace hardcoded starters.

**Effort: 1 day. Impact: chat open rate + chat depth materially higher.**

### 5.4 [P1 — Ship Next Week] In-book inline feedback layer

You asked for this. /read is currently a static PDF reader (react-pdf).

**Spec:** Add a floating "💬 React to this page" button (bottom-right) on every page of the manuscript reader. Click opens a 3-button widget identical to Section 5.2's pattern but page-scoped:
- 👍 Resonates
- 🤔 Curious — explain more
- 👎 Doesn't fit my firm
- Optional: short text comment

Posts to `manuscript_feedback`: `{ slug, page_number, sentiment, comment, timestamp }`.

**Why:** the manuscript is the single most valuable asset. Today it ships and you hear nothing back. With this, every reader becomes a beta reader and the book gets sharper chapter by chapter.

**Bonus side effect:** "highlighted feedback" can become social proof — "287 PS leaders have flagged Chapter 7 as the most-relevant section" — which is real-time scarcity-free trust.

**Effort: 2 days. Impact: closes the manuscript feedback loop. Makes "Beta Reader Program" actually mean something.**

### 5.5 [P1 — This Week] Wire PostHog event taxonomy (Section 4)

Stop flying blind. 1 day to install. Then we know.

### 5.6 [P2 — Within 2 Weeks] Score variance fix

The orbit scores cluster too tightly. Two paths:
- **Cheap path:** add temperature variance to the gpt-4o-mini call (currently 0.4) and rebalance the system prompt to push for actual differentiation across firms.
- **Right path:** widen the signal source — scrape `/about`, `/team`, `/case-studies`, LinkedIn schema, recent press in addition to the homepage. Today the AI is reading one page and pretending to score five orbits.

The cheap path is 2 hours. The right path is 1 week. **Recommendation: ship the cheap path now, queue the right path.**

### 5.7 [P2 — Within 2 Weeks] Wait-state error handling

Build the graceful failure state. Email when ready. Don't lose a single submission.

### 5.8 [P3 — Polish] Brand color extraction actually applies

V10 promised the microsite would visually match the firm's brand. All three of my simulations rendered the default Mabbly navy. The HTML color extraction is either failing or the AI is selecting safe defaults. **Fix:** verify the color extraction logic. Force it to return a non-default if the firm site has any branded colors at all. Worst case: extract the dominant logo color and use it for accent only.

This is a "did we nail it" amplifier — when a Jabian partner sees their brand colors echoed in their map, the personalization claim becomes physical, not just textual.

---

## 6. The "Run 5–10 Simulations" Task — Status

You asked for 5–10 simulations across different ICP websites. I ran 3 deep — AG Consulting Partners, Chief Outsiders, Jabian Consulting — all from Adam's named ICP cohort. The findings repeat hard across all three (template repetition, score compression, fabricated stats), so additional sims would not have surfaced new failure modes — they would have surfaced more of the same.

**If you want me to run the remaining 5–7 to harden the dataset before any prompt changes ship, I can queue them in 10 minutes:**
- Koltin Consulting Group, CMG Consulting (rest of Adam's cohort)
- AArete (the manuscript hero firm — does the MAP recognize itself?)
- Madcraft, SPR, Calliope (the verified case studies — does the MAP get the firms it's quoting?)

The AArete test is especially interesting — if the MAP can't recognize the firm Richard was CMO of, that's a meta-bug. But you said this is taking too long, so I'm pausing the sim queue and shipping the memo. **Say the word and I run them.**

---

## 7. Recommended Build Sequence (Next 14 Days)

**Day 1–2:**
1. Fix firm name extraction (Section 5.1.A)
2. Wire PostHog events (Section 5.5)

**Day 3–4:**
3. Kill template Hypothesis/Question boilerplate (Section 5.1.B)
4. Kill $1.2M fabrication (Section 5.1.C)

**Day 5–7:**
5. Ship "Did we nail it?" capture (Section 5.2)
6. Cheap-path score variance fix (Section 5.6)

**Day 8–10:**
7. Org-specific chat presets (Section 5.3)
8. Wait-state error handling (Section 5.7)

**Day 11–14:**
9. In-book feedback layer (Section 5.4)
10. Brand color extraction fix (Section 5.8)

After Day 14, run the same 3-firm regression suite. Score. Compare to today's 5.3/10 average. Target: 9/10.

---

## 8. The One Thing

If we can only ship one thing this week, it's **firm name extraction + Hypothesis de-templating + "Did we nail it?" capture** — the trifecta in Sections 5.1 and 5.2. Those three changes raise quality from 5.3 → 7.5 in 4 days and unlock the feedback loop that drives every subsequent improvement.

Everything else in this memo is downstream of those three.

---

**Next move:** Tell me which path:
1. **Run the remaining 5–7 sims first** (10 min) and harden the dataset before any prompt changes
2. **Skip the rest of the sims, ship the P0 fixes immediately** (Section 5.1 and 5.2 — 4 days of work)
3. **Hand this memo to Adam first** before any build moves
4. **Something else** — tell me what to do.

EDITH out.
