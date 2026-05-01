# 06 · References & Source Library

> Where the source material lives. Notion docs, Lovable prompt archive, glossary, killed-stats list, recommended reading order. Use this doc as the citation backstop when an editorial decision needs grounding.

---

## Notion source library

Mabbly's Notion is the source of truth for strategy, voice, and roadmap. The codebase implements; Notion decides. When this codebase conflicts with Notion, **Notion wins** (and the codebase needs updating).

### Top-level hubs

| Doc | What's in it | URL |
|---|---|---|
| **🌊 Discover Mabbly** | The category authority hub. Top-level strategy doc. | https://app.notion.com/p/34de1945908680ae8f62d48c1bd39c3f |
| **📘 v2 GTM for PS** | The book hub. Manuscript chapters, voice guide, framework lock. | https://app.notion.com/p/339e1945908680f7b2f4f7cb030fe483 |
| **📡 Channels (Master Hub)** | The 10-channel architecture. Cold email, LinkedIn, podcast, etc. | https://app.notion.com/p/34de194590868139aaa4f29133a5ef0d |

### Strategy & framework

| Doc | What's in it |
|---|---|
| [01 · Strategy & Vision](https://app.notion.com/p/34de19459086819a866aed65c43fbea6) | Hormozi rules, iteration history, plan revenue + probability |
| [02 · ICP — Management Consulting](https://app.notion.com/p/34de1945908681b1af1cf358b59ccdf5) | Narrow ICP definition (Chicago Midwest, $20M–$100M consulting) |
| [03 · The Funnel](https://app.notion.com/p/34de194590868152b852cdebede337b6) | Funnel math, MAP bridge, two-path conversion |
| [Tab 3: Master Framework Lock](https://app.notion.com/p/339e1945908681efb9d3c94011f1e233) | The 12 locked elements (Definition, Formula, Truths, Orbits, Layers, Laws, Beachhead, Win/Loss, Entry Points, AI Conditions, MAP, Core) |
| [Tab 2: Voice Guide](https://app.notion.com/p/339e194590868164924add6e56dbe985) | Adam vs Richard voice rules, format conventions, voice calibration |

### Build & implementation

| Doc | What's in it |
|---|---|
| [GTM Tools (Business Requirements)](https://app.notion.com/p/34de1945908681b3958ecf9a3522ef82) | Three-tier funnel build spec — Score, Light MAP, Discovery MAP |
| [Audit + Lovable Rebuild Plan](https://app.notion.com/p/34ee1945908681d397d5c1a47ee1f208) | The April 25 audit, top 10 critical fixes, scroll motion plan, mobile checklist |
| [🧲 RROS Magnet Microsite — Touchpoints & Process](https://app.notion.com/p/34ee1945908681fb8c50cb4a34aef16e) | The V10 spec — every touchpoint, CTA, form field, data flow, AI step |

### Manuscript chapters

| Chapter | URL |
|---|---|
| [Preface: Start Here](https://app.notion.com/p/339e1945908681ae8b60e6c814e60d60) | — |
| [Ch1: The Dead Zone](https://app.notion.com/p/339e1945908681c29f59f32364315705) | The "purple cow" chapter — the idea that spreads |
| [Ch2: The Wrong Map](https://app.notion.com/p/339e1945908681f48eb1ebd73ec95130) | Why product-company GTM fails for PS |
| [Ch3: The Formula](https://app.notion.com/p/339e1945908681f6b49cc1f0cec2ff5d) | Signal + Proof + Context = Response, Not Pitch |
| [Ch4: The Five Truths, The Core, and The Orbit Model](https://app.notion.com/p/339e194590868160943bfdfe58d0f6f9) | The biggest chapter in Part 1 |
| [Ch5: DISCOVER](https://app.notion.com/p/339e1945908681389317fa610776dd38) | First layer |
| [Ch6: PROVE](https://app.notion.com/p/339e19459086811290bfe2f45f6a1267) | Second layer |
| [Ch7: DESIGN](https://app.notion.com/p/339e1945908681658afcf74b6f0257e0) | Third layer |
| [Ch8: ACTIVATE](https://app.notion.com/p/339e1945908681988ff0f6ebb2868125) | Fourth layer |
| [Ch9: COMPOUND](https://app.notion.com/p/339e1945908681d1ac79c7405ecbbbcc) | Fifth layer |
| [Ch10: The Orbit Implementation Playbook](https://app.notion.com/p/339e1945908681afb201f4c67e8c5175) | Part 3 starts |
| [Ch11: The MAP Template + Discovery Session Guide](https://app.notion.com/p/339e194590868142b74cedf3aacc5b71) | The 12-field MAP definition |
| [Ch12: Tools, Calculators, and Self Assessment](https://app.notion.com/p/339e19459086817fb21addad13835c59) | — |
| [Closing: The Three Laws (Revisited)](https://app.notion.com/p/339e1945908681288d1df409af695296) | — |

### Endorsements

| Doc | What's in it |
|---|---|
| [Jonathan Copulsky | Book Interview Prep](https://app.notion.com/p/341e1945908681798793c4e7a1f762c0) | Foreword author. 9 interview questions mapped to chapters. Source approval workflow. |

### Channels

| Doc | URL |
|---|---|
| [01. LinkedIn Adam](https://app.notion.com/p/34de19459086813fbeccc84db0480c2a) | Cadence, content pillars, CTAs |
| [02. LinkedIn Richard](https://app.notion.com/p/34de1945908681acb003c7a0d5d608c8) | Same |
| [03. Podcast (GTM for PS)](https://app.notion.com/p/34de1945908681dfa74bf53d8dbdb87d) | — |
| [04. Referrals + Partners](https://app.notion.com/p/34de1945908681399649dcd0ee2dd56f) | — |
| [05. Cold Email](https://app.notion.com/p/34de194590868142be06dc7d8df632e3) | — |
| [06. Newsletter](https://app.notion.com/p/34de194590868119b360f6cdb7805da8) | — |
| [07. Paid + Retargeting](https://app.notion.com/p/34de194590868146b36fc6f05e6b571b) | — |
| [10. Earned Media + Awards + Report](https://app.notion.com/p/34de19459086816aa8f6d9f6d9001ccc) | — |

---

## Lovable prompt library

The reusable prompts I wrote during the audit. All committed to the project root. They're agent-agnostic — work in Lovable or Claude Code.

| Prompt | Purpose | Status |
|---|---|---|
| [`lovable-prompt-orbit-deadspace.md`](../lovable-prompt-orbit-deadspace.md) | Tighten Section 02 (Five Orbits) vertical spacing on `/m/:slug` | Ready to ship |
| [`lovable-prompt-adam-avatar.md`](../lovable-prompt-adam-avatar.md) | Replace "AF" initials with locally-bundled headshot from `/public/images/team/adam-fridman.jpg` | Ready (asset: `src/assets/adam-fridman.png` already exists — adapt path) |
| [`lovable-prompt-ops-dashboard.md`](../lovable-prompt-ops-dashboard.md) | Build the password-gated `/ops` dashboard with view tracking, share/affiliate tracking, unified email list | Ready (set Supabase secrets first) |

### Strategy memos (read-only, but useful as briefing material)

| Memo | What's in it |
|---|---|
| [`edith-map-audit-memo.md`](../edith-map-audit-memo.md) | The May 1 audit — 3-firm simulation findings, 10× plan, P0/P1/P2 priorities |
| [`edith-touchpoint-improvements.md`](../edith-touchpoint-improvements.md) | Step-by-step playbook across ~120 improvements at 50+ touchpoints |
| [`edith-email-capture-strategy.md`](../edith-email-capture-strategy.md) | Hormozi-aware, research-framed email capture architecture (3 layers, no gate) |

---

## Glossary

The locked vocabulary, alphabetized. See [01-strategy.md](./01-strategy.md) for the full strategic context.

| Term | Definition |
|---|---|
| **Active** | Orbit ⊙ 02. Relationships spoken to in last 90 days with mutual value exchanged. |
| **Beachhead Principle** | Pick the one segment where proof is deepest, signals most frequent, relationships warmest. Win there before expanding. |
| **Beta Reader Program** | Early-access cohort for the manuscript. Renamed from "Beta" to "Early Access" in audit because "beta" implies unfinished framework. |
| **Core, The** | The center of the Five Orbits. Two sentences: Purpose + Niche. Always capitalized, never hyphenated. |
| **Core Proof** | Orbit ⊙ 01. Top 15–20 relationships. Refer without being asked. The Core expressed outward. |
| **Cohort** | The 30 PS firms in active research participation. Includes AArete, SPR, Madcraft, Calliope. |
| **Dead Zone** | Orbit ⊙ 03. The 60–96% of CRM that's dormant. Biggest GTM asset. **NEVER** "dormant contacts," "inactive leads," "lapsed relationships." |
| **Discover Mabbly** | The authority hub at discover.mabbly.com (this codebase). |
| **Discovery Session** | 60-minute call, free, no pitch. Produces a Tier 3 MAP. |
| **Evernote Test** | The Core must fit in a phone note (10 syllables or less per sentence). |
| **Five Layers** | DISCOVER · PROVE · DESIGN · ACTIVATE · COMPOUND. Always small caps. Always layers, never steps/phases/stages. |
| **Five Orbits** | Core Proof, Active, Dead Zone, Warm Adjacency, New Gravity. The relationship map. |
| **Five Truths** | I. Your next client already knows you. II. Timing beats targeting. III. Reputation is a GTM channel. IV. The Dead Zone is your biggest GTM asset. V. New relationships are earned through relevance. |
| **Formula, The** | Signal + Proof + Context = Response, Not Pitch. |
| **GTM for Professional Services** | The category Mabbly is naming. The book title. |
| **Mabbly.ai** | Product surface. Free pilot, broad B2B. |
| **Mabbly.com** | Services surface. GTM-for-PS agency. |
| **MAP** | Market Activation Profile. 12-field artifact delivered after Discovery Session. **Not a proposal.** A proposal asks. The MAP gives. |
| **Magnet** | The personalized AI lead-gen funnel at `/assess` → `/m/:slug` → `/book`. |
| **Native vocabulary** | Per-vertical translation of "GTM" — origination strategy for law, practice growth for consulting, etc. |
| **New Gravity** | Orbit ⊙ 05. Cold outbound, events, inbound. Most expensive orbit. |
| **North Star** | Professional services firms deserve marketing as sophisticated as the work they sell. |
| **Orbit 03** | The Dead Zone. Always called Orbit 03 with the ⊙ symbol. |
| **Relationship Revenue OS (RROS)** | The methodology. The promised land in the strategic narrative. |
| **Three Laws** | First: Proof before pitch. Second: Relationships before revenue. Third: Signal before message. Always "law," never rule/principle. |
| **Three Rooms** | discover.mabbly.com (authority), mabbly.com (services), mabbly.ai (product). |
| **Three Tier Funnel** | Tier 1 GTM Score · Tier 2 Light MAP · Tier 3 Discovery Session. |
| **V10** | Current Magnet flow architecture (April 27, 2026). Single-field intake, no email gate, 11 sections, score-adaptive variants A/B/C/D. |
| **Warm Adjacency** | Orbit ⊙ 04. One degree removed. Borrowed trust. 7-day decay window. |

---

## Verified facts (the only stats permitted in copy)

### Cohort firms

| Firm | Source | Detail |
|---|---|---|
| **Madcraft** | Stephen Cuccio, Head of New Client Strategy | $400K dormant proposal reactivated, 7-minute reply, after 9 months silent |
| **Calliope** | Mary Tindall, Founder | 2 emails to dormant healthcare contacts, 2 replies |
| **SPR** | Kyle Gams, Managing Director | 150 dormant enterprise contacts identified, 43 emails sent through 3-layer review, 3 replies / conversations restarted |
| **AArete** | Manuscript Ch1 | 160 dormant proposals found in HubSpot |

### Authors

| Person | Verified credentials |
|---|---|
| **Adam Fridman** | 500+ practitioner interviews · 180 podcast episodes · *Inc.* columnist · author of *The Science of Story* |
| **Richard Ashbaugh** | 26 years across 9 PS firms · former CMO of AArete ($125M consulting firm) · scaled A.T. Kearney from $250M to $1.2B · Mabbly co-author |
| **Jonathan Copulsky** | Former CMO of Deloitte Consulting (US) and Global Insights Leader · Senior Lecturer at Northwestern Kellogg & Medill · Wrote the foreword |

### Cohort scale

- 30 PS firms in active research cohort
- 500 practitioner interviews across 6 podcast seasons
- 96% of CRM contacts dormant at the average PS firm (Adam's research benchmark)
- 60–80% dormancy is the conservative public-facing range

---

## Killed stats — DO NOT USE

These stats failed verification in the April 26 audit. They are **forbidden** in any copy, anywhere in the site, ever.

| Killed stat | Why killed |
|---|---|
| Travis Holaway / Coda Strategy quote and $2.4M figure | Placeholder, never a real source |
| $2.6B tracked pipeline / 9 firms | Placeholder |
| 8.1x ROI vs cold outreach | Placeholder |
| 100% of beta cohort closed at least one deal | Placeholder |
| 167% / 51% / 288% stats | Placeholder |
| AArete recovered $1.2M in 90 days | Jarvis fabrication, never real |
| $380K dormant capital national avg / $340K | Jarvis fabrication |
| **$1.2M unrealized revenue** (currently leaking back into AI MAP output) | Fabrication. Audit prompt and remove. **P0 fix in roadmap.** |

If you find any of these stats appearing in code, copy, or AI output — **kill them.** Cite this list as the authority.

---

## AI tells to avoid in copy

These phrases are AI-tells. They sound generic and undermine the editorial voice. Killed in the April 26 audit:

- "leverage" (as a verb)
- "navigate"
- "activate them in order"
- "systematic relationship infrastructure"

Add to this list when you spot new ones in AI output.

---

## Recommended reading order

For a new collaborator (engineer, content writer, advisor) onboarding to this project:

### 30-minute onramp (essentials)

1. **[docs/README.md](./README.md)** — what this project is (5 min)
2. **[docs/01-strategy.md](./01-strategy.md)** — the why and the locked vocabulary (15 min)
3. **[docs/02-architecture.md](./02-architecture.md)** — the technical map (10 min)

### 60-minute deep dive

Add:
4. **[docs/03-magnet-flow.md](./03-magnet-flow.md)** — the most complex piece (15 min)
5. **[docs/04-roadmap.md](./04-roadmap.md)** — what we're shipping next (15 min)

### 90-minute mastery

Add:
6. **[docs/05-playbook.md](./05-playbook.md)** — daily commands and tasks (15 min)
7. **This file (06-references.md)** — sources to come back to (15 min)

### Going deep on the IP (the book itself)

8. Read [Tab 3: Master Framework Lock](https://app.notion.com/p/339e1945908681efb9d3c94011f1e233) on Notion
9. Read [Ch1: The Dead Zone](https://app.notion.com/p/339e1945908681c29f59f32364315705) — the chapter that explains the entire thesis
10. Read [Ch4: The Five Truths, The Core, and The Orbit Model](https://app.notion.com/p/339e194590868160943bfdfe58d0f6f9) — the framework chapter

After that, you're operating with full strategic context and can contribute substantively.

---

## Related external resources

| Resource | Purpose |
|---|---|
| [Hormozi · $100M Offers + $100M Leads](https://www.acquisition.com/) | Underlying offer + lead-gen frameworks. Cited throughout strategy docs. |
| [Refine Labs / Chris Walker](https://www.refinelabs.com/) | Demand creation vs demand capture. Self-reported attribution. |
| [Andy Raskin · Strategic Narrative](https://www.andyraskin.com/) | Antagonist / Promised Land / Bridge structure (used in Mabbly's spine). |
| [Daniel Priestley · Key Person of Influence](https://danielpriestley.com/) | Pitch / Publish / Product / Profile / Partnership. |
| [April Dunford · Obviously Awesome](https://www.aprildunford.com/) | Positioning is upstream of marketing. |
| [Marcus Sheridan · They Ask You Answer](https://marcussheridan.com/) | Every prospect question becomes content. |

---

## Companion artifacts

| Resource | Purpose |
|---|---|
| **Figma board:** [GTM PS One Mabbly](https://www.figma.com/board/7SCpalcjmaPHeF8NhAr6Sb/GTM-PS-One-Mabbly) | Visual map of the funnel |
| **Mabbly vNext Notion** | Parent strategy workspace (broader than discover.mabbly.com) |
| **Master Manuscript Notion** | The book itself — chapter drafts, voice memos, source approvals |
| **Calendly:** (Adam's Discovery Session link) | Set on `/book` page |
| **Apollo sequence:** "Discover Mabbly · Consulting Wave 1 · 5-Touch" | Cold email sequence routing to `/consulting` |

---

*Last updated: May 1, 2026*
