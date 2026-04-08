

# SPR MAP Page Rebuild (v3) — Verbatim Copy

A complete restructuring of `/spr` from 6 framework-heavy tabs to 4 diagnostic tabs organized around 12 MAP fields, using exact copy from the discovery session document.

## Structure

**6 tabs → 4 tabs:**
- "Who You Are" (Fields 1, 2, 4, 5)
- "What You're Sitting On" (Fields 7, 8, 9)
- "What Triggers Growth" (Fields 6, 10, 12)
- "Where You're Going" (Fields 3, 11 + closing)

**New persistent element:** MAP Completion Strip below tab bar showing 12 fields with gold/outlined/gray status indicators. Clickable. Collapses on mobile to progress bar with expandable.

## Global Rules Enforced
1. No em dashes anywhere
2. No "RROS," "Orbit 03," "Spectrum Position 1.5" jargon
3. No fabricated data
4. Use their exact words from session
5. No star ratings, scores, or grades
6. Tone: direct, respectful, specific

## Files to Create

### `src/components/spr/SPRCompletionStrip.tsx`
Horizontal strip of 12 small cards. Each shows field number, short name, status (gold fill = complete, gold outline = partial, gray outline = incomplete). Gold progress bar beneath (~40%). Summary: "5 of 12 fields captured. A complete MAP typically requires one additional conversation." Clickable cards trigger tab navigation. Mobile: collapses to single progress bar with "View all fields" expandable.

Field statuses (verbatim from doc):
1. The Core — Incomplete
2. Session Voice — Complete
3. Corporate Objectives — Partial
4. Core Values — Incomplete
5. ICP Lock — Partial
6. Beachhead Segment — Incomplete
7. Spectrum Position — Partial
8. Dead Zone Estimate — Partial
9. Orbit Priority — Complete
10. Primary Signal Type — Partial
11. Vision State — Incomplete
12. Competitive Landscape Signal — Partial

### `src/components/spr/SPRWhoYouAre.tsx` (Tab 1)

**Section 1: Session Voice (Field 2, Complete)**
Label: "MAP FIELD 2: SESSION VOICE" with Complete badge.
Heading: "What You Said"
Subhead: "Five verbatim phrases from the discovery session. Not paraphrased. Your exact words."

5 quote cards (gold 4px left border, italic serif, bold name + muted role):

1. "There is no GTM framework for professional services. Even among professional services marketers, we were using the same words, but we had different definitions of those words." — Rebecca Butman, EVP Marketing

2. "You can only ask and you can only shove your way into so many things. And I had realized that I had shoved my way into so many aspects of the business that I was like, I cannot touch that hot stove again." — Rebecca Butman, EVP Marketing

3. "New BDMs take two years before someone can actually sell something. If they are just relying on their past book of business and they have a non-compete for the first year, and then it takes them another year to sell anything, we cannot scale quickly." — Rebecca Butman, EVP Marketing

4. "Everything in our CRM, we have about 59,000 contacts. I do not think they are nearly all worth going to. We have about 5,000 that BDMs are actively, over the course of several years, been in contact with." — Brian Chorba, Marketing Analyst and Salesforce Administrator

5. "Our sales team is very seasoned. They come here with a book of business. They sell to that book of business. They occasionally expand their relationships." — Rebecca Butman, EVP Marketing

**Section 2: The Core (Field 1, Incomplete)**
Label: "MAP FIELD 1: THE CORE" with Incomplete badge.
Heading: "The Core: Purpose and Niche"
Body: "The Core is two sentences. The first is your purpose, why your firm exists. The second is your niche, who you serve better than anyone. If both halves cannot be stated from memory in under ten syllables each, The Core is not yet set."

Two-column card:
- Left (muted): CURRENT POSITIONING — "Delivering Beyond the Build" — "SPR's positioning lives in individual BDM relationships, not in a system. Rebecca described the promise: seasoned technologists, knowledge transfer throughout the process, a flexible engagement model. But she also said: 'I am not naive to think that truly what we have is that different.'"
- Right: WHAT WE STILL NEED — bullet list: Purpose sentence, Niche sentence, Validation question

Footer: "The Core is the first field in the MAP. Until it is set, everything else is built on a foundation that shifts depending on who is in the room."

**Section 3: Core Values (Field 4, Incomplete)**
Label: "MAP FIELD 4: CORE VALUES" with Incomplete badge.
Body: "Not discussed in the discovery session. Core Values feed into The Core, they are not a standalone exercise. To be captured in a follow-up conversation."

**Section 4: ICP Lock (Field 5, Partial)**
Label: "MAP FIELD 5: ICP LOCK" with Partial badge.
Heading: "Who You Sell To"

"What we know" table:
| Dimension | Value |
|---|---|
| Department | IT |
| Organization size | Medium to enterprise |
| Geography | Not specified |
| Buying trigger | Not specified |
| Decision maker title | Not specified |

"What is changing:" paragraph about AI expanding buyer beyond IT, Anderson acquisition.

"What we still need:" paragraph about locked ICP specificity.

### `src/components/spr/SPRSittingOn.tsx` (Tab 2)

**Section 1: Dead Zone Estimate (Field 8, Partial)**
Label: "MAP FIELD 8: DEAD ZONE ESTIMATE" with Partial badge.
Heading: "The Revenue Already in Your CRM"

Stats table (navy bg, gold accents):
| Stat | Value | Source |
|---|---|---|
| Total CRM contacts | 59,000 | Brian |
| Contacts BDMs have worked | ~5,000 | Brian |
| Active in marketing automation | ~4,000 to 5,000 | Brian |
| Dormant relationships | 8,000 to 10,000 | Brian and Rebecca |
| SPR's dormancy definition | 2 years | Rebecca |
| Most firms' dormancy definition | 90 days | Industry standard |

Calculator: 3 sliders. Dormant contacts default 8,000 (range 1,000-15,000). Avg engagement value default $0/empty with label "We do not have this number. This is the most important input. Ask Tom's team." Reactivation rate default 3% (range 1%-10%). Result in large serif 48-64px warm gold with count-up animation. When $0, show "Enter your average engagement size to see your Dead Zone Value."

Paragraph below calculator (verbatim): "Every one of these contacts chose to engage with SPR at some point. They are not strangers. They are relationships that went quiet because nobody had a system to maintain them. Existing clients convert at 60% to 70%, spend 31% more per engagement, and cost seven times less to reactivate than a new client costs to acquire."

Footnote: "Dead Zone Value is partial because we do not yet know SPR's average engagement size. With that number, this field is complete."

**Section 2: Strengths and Gaps (no MAP field)**
Heading: "What We Heard: Strengths and Gaps"
Two-column cards with verbatim bullet lists from doc.

**Section 3: Spectrum Position (Field 7, Partial)**
Label: "MAP FIELD 7: SPECTRUM POSITION" with Partial badge.
Heading: "Where SPR Sits Today"
NO numerical score. Qualitative paragraph only (verbatim from doc).

**Section 4: Orbit Priority (Field 9, Complete)**
Label: "MAP FIELD 9: ORBIT PRIORITY" with Complete badge.
Heading: "Where to Focus First"
Paragraph (verbatim from doc) about 8,000-10,000 dormant relationships.

### `src/components/spr/SPRTriggers.tsx` (Tab 3)

**Section 1: Primary Signal Type (Field 10, Partial)**
Label: "MAP FIELD 10: PRIMARY SIGNAL TYPE" with Partial badge.
Heading: "What Creates a Reason to Reach Out"
Three paragraphs (verbatim from doc).

Email mockup (Gmail-like chrome with To/From/Subject):
- To: [Former CIO contact]
- From: Kyle Gams
- Subject: Saw the move to [New Company]. Quick thought on their modernization challenge.
- Body: verbatim from doc with color-coded inline labels for Signal/Proof/Context.

Three-line breakdown beneath. Footnote about complete signal strategy.

**Section 2: Beachhead Segment (Field 6, Incomplete)**
Label: "MAP FIELD 6: BEACHHEAD SEGMENT" with Incomplete badge.
Heading: "The One Segment to Win First"
Body + three bullet questions (verbatim from doc).

**Section 3: Competitive Landscape Signal (Field 12, Partial)**
Label: "MAP FIELD 12: COMPETITIVE LANDSCAPE SIGNAL" with Partial badge.
Heading: "What Is Happening Around You"
Paragraphs about Anderson acquisition (verbatim). "What we still need" bullets.

### `src/components/spr/SPRWhereGoing.tsx` (Tab 4)

**Section 1: Corporate Objectives (Field 3, Partial)**
Label: "MAP FIELD 3: CORPORATE OBJECTIVES" with Partial badge.
Heading: "What SPR Is Trying to Achieve"
Two parallel objectives (verbatim). "What we still need" bullets.

**Section 2: Vision State (Field 11, Incomplete)**
Label: "MAP FIELD 11: VISION STATE" with Incomplete badge.
Heading: "Where SPR Wants to Be in Three Years"
Body + three questions (verbatim from doc).

**Section 3: Closing — "Did We Get This Right?"**
Body: "This MAP was built from a single 58-minute conversation. Five fields are partially captured. Five are incomplete. These questions would help us finish it."
4 numbered questions (verbatim). Data request list (verbatim). CTA: "Schedule 15 Min MAP Review" → adam@mabbly.com.
Footer: "Prepared within 24 hours of the discovery session on April 6, 2026."

## Files to Modify

### `src/components/spr/SPRTabBar.tsx`
4 tabs: "Who You Are", "What You're Sitting On", "What Triggers Growth", "Where You're Going"

### `src/pages/SPRGroup.tsx`
- Update imports to 4 new tab components + SPRCompletionStrip
- Remove old imports (SPROverview, SPRIdentity, SPROrbits, SPRSignals, SPRRoadmap, SPRContentEngine)
- Add SPRCompletionStrip between tab bar and main content
- Pass tab navigation callback to completion strip

### `src/components/spr/SPRTopBar.tsx`
Update right side text: "Prepared for Doug, Tom, and Rebecca"

## Files to Delete
- `src/components/spr/SPROverview.tsx`
- `src/components/spr/SPRIdentity.tsx`
- `src/components/spr/SPROrbits.tsx`
- `src/components/spr/SPRSignals.tsx`
- `src/components/spr/SPRRoadmap.tsx`
- `src/components/spr/SPRContentEngine.tsx`
- `src/components/spr/SPRSpectrumBar.tsx`
- `src/components/spr/SPROrbitMap.tsx`

## Files to Keep (reused)
- `src/components/spr/SPRDeadZoneCalc.tsx` — modify: default engagement value to $0, show prompt when $0, warm gold result, verbatim copy beneath
- `src/components/pepper/PepperAnimatedCounter.tsx` — used for calculator count-up

## UI Specifications
- Page bg: #F5F0EB
- Dark cards: #1B2A4A
- Accent: #C8963E (warm gold)
- Active tab: terra cotta (current)
- Status badges: pill-shaped (Complete = gold bg/white text, Partial = gold outline/gold text, Incomplete = gray outline/gray text)
- Quote cards: 4px warm gold left border, italic serif, bold name
- Calculator result: serif 48-64px warm gold, count-up animation
- MAP field labels: small caps tracked out muted "MAP FIELD 2: SESSION VOICE"

## Implementation Order
1. SPRCompletionStrip + SPRTabBar (4 tabs) + SPRGroup page shell
2. Tab 1 (SPRWhoYouAre) + Tab 2 (SPRSittingOn) with modified calculator
3. Tab 3 (SPRTriggers) + Tab 4 (SPRWhereGoing)
4. Delete old files, global em-dash and jargon sweep

