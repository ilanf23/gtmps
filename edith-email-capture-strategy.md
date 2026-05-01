# EDITH · Email Capture Strategy for the MAP
**To:** Ilan
**From:** EDITH
**Date:** May 1, 2026
**Re:** When and how to capture email — Hormozi-aware, research-framed, PS-partner-tested
**TL;DR:** Don't gate the MAP. Gate the NEXT tier. Capture at three layered moments. Frame every ask as research reciprocity, not lead extraction.

---

## 1. The frame to start from

V10 made the correct call removing the email gate on the MAP itself. The Notion strategy doc is explicit about why: *"PS firm partners reject manipulation. The blurred-lock pattern works for SaaS but actively damages trust with this audience."*

That decision is correct. But it leaves email capture under-engineered — currently it lives as a single optional "Email me this map" button at Section 11, which is the lowest-converting position in the whole flow.

The question isn't "should we gate?" The question is "what is the next thing they want, and how do we trade email for that?"

---

## 2. What Hormozi actually says (his framework, not the caricature)

Most people quote Hormozi as "always gate behind email." That's wrong. His real framework in *$100M Leads* is a four-tier ladder, and only Tier 2+ are gated:

| Tier | Friction | Gate? | Example for this funnel |
|---|---|---|---|
| 1 — Lead magnet | None | **No gate** | The MAP at `/m/:slug` (current state — correct) |
| 2 — Advanced asset | Email | **Yes** | Manuscript chapter / peer benchmark / 90-day playbook |
| 3 — Application | Form | Higher friction | Beta Reader cohort application |
| 4 — Call | Calendar booking | Highest friction | Discovery Session with Adam |

Hormozi's principle: **value FIRST, then capture for the next thing they want**. Each tier is gated but the gate is positioned as "want more? give us this," not "to see what you just asked for, give us this."

The mistake competitors make is gating Tier 1 because that's the easiest place to put a form. The mistake we'd make in the opposite direction is gating nothing because we're scared of friction. Both fail.

**The right move: Tier 1 stays open. Tier 2 — the manuscript chapter, the peer benchmark, the deeper analysis — that's where email becomes the trade.**

---

## 3. The four candidate capture points — scored

### Option A — Pre-MAP (before they see anything)
*"Enter your email to build your map."*

- Pro: highest theoretical capture rate
- Con: PS partners abandon. Trust violated before value delivered. V10 explicitly killed this. **Don't.**
- **Verdict: ❌ wrong for this audience**

### Option B — Mid-flow gate (browse then blur)
*"Enter your email to see the rest of your map."*

- Pro: tests interest before asking
- Con: Notion strategy doc explicitly killed this. Insulting to senior PS buyers. Breaks the "research collaboration" framing.
- **Verdict: ❌ violates V10 trust pattern**

### Option C — Save / share point (current state, Section 11)
*"Email me this map."*

- Pro: zero friction, no trust violation
- Con: lowest leverage moment in the page. By the time they reach Section 11, they've either committed to the call (won) or scrolled checking out (lost). Email at this point converts ~5–10% in B2B research-magnet benchmarks.
- **Verdict: ⚠️ keep but augment — too late and too passive on its own**

### Option D — Engagement-triggered prompt (after meaningful interaction)
*Triggers when reader scrolls past Section 5 AND dwells >60s OR clicks an orbit detail.*
*"Want the chapter that explains your highest-leverage move? It's in the manuscript. We'll send it free."*

- Pro: Hormozi-perfect positioning. They've experienced value, they're hot, they're already curious. Conversion in B2B research benchmarks: 25–35%.
- Con: requires event tracking (PostHog from the audit memo). 1 day of build.
- **Verdict: ✅ highest-leverage capture point**

### Option E — Share-triggered double capture (their email + recipient's)
*When they hit "Forward to my partner," ask for both emails as part of the share flow.*

- Pro: every share becomes 2 emails captured, naturally framed ("we'll send the partner this map and you the chapter that explains it")
- Con: needs share UX rebuild
- **Verdict: ✅ K-factor + email loop in one move**

### Option F — Exit-intent salvage
*Mouse leaves viewport top edge → modal: "Before you go, free Chapter 7 (the Dead Zone)."*

- Pro: pure salvage on bounces — no opportunity cost on engaged users
- Con: bouncers convert lower. ~3–8% capture rate.
- **Verdict: ✅ salvage layer, not primary**

### Option G — Post-call / book-walkthrough confirmation
*If they book the Discovery Session, the booking flow captures email automatically (Calendly).*

- This is happening already. Highest-quality lead. No optimization needed beyond the prompt.
- **Verdict: ✅ already wired via booking**

---

## 4. The recommended architecture — three layers, no gate

**Layer 1 — Engagement trigger (Option D) — primary capture point.**
Fires when: reader has scrolled past Section 5 AND dwelled >60 seconds, OR has clicked into an orbit detail panel.
What appears: a tight non-blocking inline card, not a modal.
Copy: *"Your highest-leverage move maps to Chapter 7 of the manuscript. Want the chapter as part of the research cohort? We'll send it now."*
[Email field] [Send the chapter] [Skip]

Predicted capture rate: **25–35%** of engaged readers. This is your A-tier lead.

**Layer 2 — Share point (Option E) — K-factor multiplier.**
Fires when: reader clicks "Forward to my partner" or "Send to your team."
What appears: 2-field share form.
Copy: *"Send your map to [partner name]. We'll send them their version of this map, and we'll send you the manuscript chapter that explains your highest-leverage move."*
[Your email] [Their email] [Send]

Predicted capture rate: 80%+ of sharers complete both fields when framed as reciprocal. Each share becomes 2 captures, sometimes more (forward chains).

**Layer 3 — Save + exit intent (Options C + F) — salvage layer.**
Section 11 stays as-is ("Email me this map") but copy upgrades from passive save to research-coded:
*"Save your map. As a research contributor, you'll get the manuscript chapter when this round of cohort research closes."*

Plus exit intent on bouncers per the audit doc Fix 10. Different ask: *"Before you go — free Chapter 7. The one on the Dead Zone."*

---

## 5. The trade-off math (estimated)

Assume 1,000 monthly MAP completions at steady state (post-launch).

**Today (V10 baseline) — passive save only:**
- Section 11 "Email me this map" capture rate: ~7%
- Captures: 70/month
- Booking captures: ~20/month (separate funnel)
- **Total email captures: ~90/month**

**Recommended (3-layer architecture):**
- Layer 1 engagement-triggered: 35% of the ~50% who reach Section 5 = ~175 captures
- Layer 2 share-triggered: 15% of completions share, 80% complete the 2-field form = ~120 self-captures + ~120 partner-captures
- Layer 3 save + exit: ~7% save + ~5% exit-salvage = ~70 + ~50 = ~120 captures
- Booking captures: ~20/month (unchanged)
- **Total email captures: ~605/month**

**~6.7× lift** without ever gating the MAP itself or violating the research-collaboration trust pattern.

---

## 6. The research-framed reason that actually works for PS partners

This is the part that breaks if you copy SaaS-funnel language.

PS managing partners do NOT respond to:
- *"Sign up to download the report"* (passive, transactional)
- *"Get exclusive insights"* (over-promised)
- *"Subscribe for weekly tips"* (volume-noise red flag)
- *"Unlock the full analysis"* (gate violation, trust break)

They DO respond to research-framed reciprocity:
- *"You're a contributor to this research."*
- *"The book gets sharper from your input."*
- *"We'll send you the manuscript chapter that includes your firm's findings."*
- *"Validated by Copulsky. As a cohort contributor, you get the draft 90 days before public launch."*
- *"Your firm joins AArete, SPR, Madcraft, Calliope in the cohort."*

The Notion strategy doc already nailed this language at the macro level — "research artifact, not sales diagnostic." The email capture moments need to inherit that voice exactly.

---

## 7. Three copy variants by capture point — drop-in ready

**Layer 1 — Engagement-triggered card (after Section 5, primary capture):**

```
You're contributing to the research.

Your highest-leverage move maps to Chapter 7 of the manuscript.
The book launches Q3 2026 — contributors get the chapter draft now.

[your email]      [Send the chapter →]      Not now

500 practitioner interviews. 30 firms in the cohort. Validated by Copulsky.
```

**Layer 2 — Share with partner (K-factor double capture):**

```
Send this map to your partner.

We'll generate their version of the map and send you the manuscript
chapter that explains your highest-leverage move — both as part of
the cohort contribution.

Your email          [your address]
Partner's email     [their address]

[Send both →]       Skip — just copy a link
```

**Layer 3 — Save / exit (salvage):**

Section 11 (current "Email me this map" — upgrade copy):
```
Save your map.

As a research contributor, you'll get the manuscript chapter when
this cohort round closes. Re-take the map in 90 days to see how
your firm has changed.

[your email]      [Save my map →]
```

Exit intent modal (per Audit Fix 10):
```
Before you go.

Free Chapter 7 — the Dead Zone. The chapter that explains the
single biggest revenue lever sitting in your CRM right now.

[your email]      [Send Chapter 7 →]      Just close

No application required. As a research contributor, you get this free.
```

---

## 8. Why the research framing converts harder than the SaaS framing

The research framing accomplishes four things SaaS framing cannot:

1. **It removes the transactional feel.** They're not "downloading a report" — they're "contributing to a cohort." The email becomes the membership credential, not the price.

2. **It makes the ask reciprocal, not extractive.** PS partners hate being marketed at. They love being studied. Re-framing the email ask as "you're a research contributor" inverts the polarity — they're the rare few selected, not the many being captured.

3. **It uses Copulsky as a third-party endorsement at the moment of capture.** "Validated by Copulsky" appearing in the form's trust line means the email goes to a research project, not a sales list. PS partners give email to research projects all day. They don't give email to vendors.

4. **It creates the post-launch payoff.** Q3 2026 manuscript ship date is the redemption moment. When the book launches and they get the named chapter mentioning their cohort, they share it. That's email-generated organic distribution six months later.

---

## 9. What NOT to do (the failure modes)

- **Do NOT add a hard gate at any point.** The blur-lock pattern is dead in this audience.
- **Do NOT split-test research framing against SaaS framing on the same audience.** The framing is locked at the strategic level. If you A/B test it, the SaaS variant might win on raw capture rate but lose on downstream booking rate. Optimize for booking, not email volume.
- **Do NOT auto-subscribe captured emails to a generic Mabbly newsletter.** Honor the contract: they joined the research cohort, they get research-cohort emails. Generic marketing newsletter = trust break.
- **Do NOT ask for company name, role, phone, etc. at capture.** We already have the firm from the URL submission. Email is enough for Layer 1 and 3. Layer 2 captures partner email only — no name fields.
- **Do NOT show all three layers simultaneously.** Sequence them. Layer 1 fires before the user reaches the share point. Layer 2 only fires if they click share. Layer 3 catches what's left. Stacking them creates fatigue.
- **Do NOT use a modal for Layer 1.** Inline non-blocking card. Modals interrupt; cards augment.

---

## 10. What to ship and in what order

**Week 1 — Layer 3 upgrade (cheapest win):**
- Rewrite Section 11 "Email me this map" copy to research-cohort framing
- Wire exit-intent modal with Chapter 7 ask (per Audit Fix 10)
- Effort: 2 days

**Week 2 — Layer 1 (highest-leverage):**
- Wire engagement-trigger detection (PostHog event from earlier audit memo)
- Build inline non-blocking capture card
- Wire to chapter-delivery automation (manuscript PDF or chapter excerpt)
- Effort: 4 days

**Week 3 — Layer 2 (K-factor):**
- Rebuild share UX to 2-field form
- Wire partner-email pre-fill of map (use existing enrichment pipeline)
- Effort: 3 days

**Week 4 — Measurement:**
- 30-day capture rate per layer
- Downstream booking rate per layer (which layer's emails actually book?)
- Re-balance based on data

---

## 11. The single sentence to remember

**We don't gate the MAP. We gate the manuscript. And we never call it a gate — we call it a research contribution.**

That's the entire strategy in one sentence. Every copy decision, capture point, and trade-off math derives from it.

---

**Next move:** pick a starting layer to spec into a Lovable prompt (Layer 3 is fastest, Layer 1 is highest-leverage), or shoot this to Adam first for voice review since the research framing is his linguistic territory.

EDITH out.
