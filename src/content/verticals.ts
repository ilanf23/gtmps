// Per-vertical metadata (slug + nav links + labels) consumed by Discover, About,
// and other shared surfaces. The vertical pages themselves (/consulting, /law, …)
// are rendered by src/pages/verticals/_template/VerticalPage.tsx and read their
// own content from src/pages/verticals/_template/data.tsx.

export type VerticalSlug =
  | 'consulting'
  | 'law'
  | 'accounting'
  | 'msp'
  | 'advisory'
  | 'ae'
  | 'recruiting'
  | 'agency';

export type CaseStudy = {
  firmName: string;
  segment: string;
  contact: string;
  body: string;
  quote: { text: string; author: string };
};

export type RealityFact = {
  text: string;
  source?: string;
};

export type PainCard = {
  title: string;
  body: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type OrbitItem = {
  id: string;   // "01"
  name: string; // "Core Proof"
  body: string; // law-native one-liner
};

export type VerticalContent = {
  slug: VerticalSlug;
  name: string;            // human label, e.g. "Management Consulting"
  shortLabel: string;      // chip label, e.g. "Consulting"
  industryEyebrow: string; // GTM RESEARCH FOR ... FIRMS
  hero: {
    headline: string;
    sub: string;
    cohortLine: string;    // Free. 90 seconds to build. 10 minutes to read. N consulting firms in the cohort.
  };
  reality: {
    title: string;
    facts: RealityFact[];
  };
  pain: {
    title: string;
    cards: PainCard[];
  };
  questions: {
    title: string;
    items: string[];
    closing: string;
  };
  cases: {
    mode: 'verified' | 'cohort';
    cohortBody?: string;   // when mode = 'cohort'
    cases?: CaseStudy[];   // when mode = 'verified'
  };
  diagnostic: {
    title: string;     // headline for Section F
    sub: string;       // sub-line
  };
  faq: FaqItem[];
  // Optional vertical-specific overrides (currently used by /law)
  ctaLabel?: string;            // overrides "Get MY Map →"
  sizingEyebrow?: string;       // overrides "B · INDUSTRY REALITY"
  deadZoneTooltip?: string;     // first-use Dead Zone explainer
  rrosTooltip?: string;         // first-use RROS explainer
  researchLabel?: string;       // overrides "GTM Research" in document.title
  diagnosticEyebrow?: string;   // overrides "06 · THE GTM SCORE"
  orbitsBlock?: {
    title: string;
    items: OrbitItem[];
  };
};

const consulting: VerticalContent = {
  slug: 'consulting',
  name: 'Management Consulting',
  shortLabel: 'Consulting',
  industryEyebrow: 'PRACTICE GROWTH RESEARCH FOR MANAGEMENT CONSULTING FIRMS',
  hero: {
    headline: 'Your next consulting client already knows you.',
    sub: 'The first research on practice growth in management consulting. 200 practitioner interviews. Validated by Jonathan Copulsky (Former CMO Deloitte, Senior Lecturer Northwestern Kellogg). Designed to surface dormant accounts and benchmark your firm\'s origination capability.',
    cohortLine: 'Free. 90 seconds to build. 10 minutes to read. Confidential. Benchmarked against peer management consulting firms.',
  },
  ctaLabel: 'See Your Firm\'s Practice Growth Profile →',
  researchLabel: 'Practice Growth Research',
  diagnosticEyebrow: '06 · THE PRACTICE GROWTH SCORE',
  sizingEyebrow: 'B · THE PRACTICE GROWTH GAP',
  deadZoneTooltip: 'THE DEAD ZONE. Dormant accounts. Stalled proposals. Lost pursuits. The clients you used to serve and the prospects you used to pitch. 60-80% of contacts in a typical consulting CRM are here right now.',
  rrosTooltip: 'THE RELATIONSHIP REVENUE OS. A system for turning the relationships you already have into the engagements you have not yet won.',
  orbitsBlock: {
    title: 'The Five Orbits, in consulting terms.',
    items: [
      { id: '01', name: 'Core Proof', body: 'Your case studies, marquee accounts, named outcomes the partners can point to.' },
      { id: '02', name: 'Active', body: 'Live engagements. Active proposals. Open pursuits.' },
      { id: '03', name: 'The Dead Zone', body: 'Dormant accounts. Stalled proposals. The pipeline that decayed.' },
      { id: '04', name: 'Warm Adjacency', body: 'Alumni network. Referrals. Adjacent practice introductions.' },
      { id: '05', name: 'New Gravity', body: 'New accounts pulled by your thought leadership and authority.' },
    ],
  },
  reality: {
    title: 'The consulting reality.',
    facts: [
      { text: '6 to 12 month average sales cycle for $1M+ engagements.' },
      { text: '80% of new business at top firms comes from existing clients.', source: 'McKinsey Sales Force Effectiveness research' },
      { text: 'Average partner book turnover when partner leaves: 18 to 24 months.', source: 'industry research' },
      { text: 'Win rate on cold outreach <2%. On warm relationships 25 to 40%.' },
      { text: 'Most firms have no formal post-engagement relationship cadence.' },
      { text: '60 to 80% of contacts in a typical CRM are dormant.', source: 'the manuscript' },
    ],
  },
  pain: {
    title: 'Where consulting practice growth breaks.',
    cards: [
      { title: 'Proposals stall in the Dead Zone.', body: 'Average proposal goes silent 9 to 12 months. No system to know when to re-engage.' },
      { title: 'Partner time is the bottleneck.', body: 'Origination depends on partner calendars. The framework runs on signals, not calendars.' },
      { title: 'Generic outreach kills the brand.', body: 'Most firms send "checking in" emails. Buyers ignore them.' },
      { title: 'The network is the moat, but the network decays.', body: 'Hundreds of dormant relationships worth millions in active opportunities.' },
    ],
  },
  questions: {
    title: 'Six questions that tell us how big your practice growth gap is.',
    items: [
      'How many proposals are sitting silent past 6 months in your pursuits?',
      'What percent of new engagements came from existing clients vs new accounts this year?',
      'When did you last systematically reactivate dormant accounts?',
      'Do you have a partner-led origination plan or is new business development ad hoc?',
      'What percent of your top 10 accounts have written case studies?',
      'How many of your former clients are paying competing consulting firms right now?',
    ],
    closing: 'If two or more of these landed, you owe yourself the diagnostic.',
  },
  cases: {
    mode: 'cohort',
    cohortBody: 'Independent management consulting firms in the current research are validating the framework against $5M-$100M practice growth patterns. Your firm benchmarks against peer practices on dormant accounts, proposal velocity, and partner origination capacity. The framework has shown real outcomes in adjacent verticals: Madcraft (digital agency) reactivated a $400K dormant proposal in 7 minutes. SPR (Chicago technology consulting) restarted 3 conversations from 43 sends across 150 dormants.',
  },
  diagnostic: {
    title: 'Score your consulting firm in 10 minutes.',
    sub: '10 questions. Your practice growth strategy benchmarked against peer consulting firms.',
  },
  faq: [
    { q: 'Does this work for boutique consulting firms ($5 to $15M)?', a: 'Yes. The framework is built for partner-led origination and is most effective at firms where 1 to 5 partners drive most new engagements. Boutique firms see results faster because the relationship base is finite and easier to map.' },
    { q: 'Does this work for management vs strategy vs operations consulting?', a: 'Yes across all three. The dynamics differ in cycle length and engagement size, but the dormant-relationship problem is universal. We adapt the cadence to your sales cycle.' },
    { q: 'How long does implementation take with 1 to 2 BD owners?', a: '90 days from data ingestion to first reactivated relationship. Most firms see their first warm response within the first 30 days of activation.' },
    { q: 'What if my firm is partner-led with no BD team?', a: 'That is the most common configuration. The framework reduces partner BD time from ~10 hours/week to ~2 hours/week by surfacing only the relationships worth a partner-level outreach.' },
    { q: 'How does this fit with our existing partner economics?', a: 'The framework respects partner origination credit and book ownership. Reactivated relationships are routed to the originating partner where one exists, and to a designated practice lead where the relationship is firm-owned. No partner economics are changed; the framework only surfaces the work.' },
    { q: 'Can my firm participate confidentially without being named in the published research?', a: 'Yes. Participation defaults to anonymous benchmarking. Named cases are opt-in only. Most participating firms remain unnamed in the manuscript and only contribute aggregated data.' },
  ],
};

const law: VerticalContent = {
  slug: 'law',
  name: 'Law Firms',
  shortLabel: 'Law',
  industryEyebrow: 'ORIGINATION STRATEGY RESEARCH FOR LAW FIRMS',
  hero: {
    headline: 'Your next matter already knows you.',
    sub: 'The first research on origination strategy in law. 200 practitioner interviews. Validated by Jonathan Copulsky (Former CMO Deloitte, Senior Lecturer Northwestern Kellogg). Designed to surface dormant client relationships and benchmark your firm\'s origination capability.',
    cohortLine: 'Free. 90 seconds to build. 10 minutes to read. Confidential. Benchmarked against 20+ independent law firms.',
  },
  ctaLabel: 'See Your Firm\'s Origination Profile →',
  researchLabel: 'Origination Strategy Research',
  diagnosticEyebrow: '06 · THE ORIGINATION SCORE',
  sizingEyebrow: 'B · THE ORIGINATION GAP',
  deadZoneTooltip: 'THE DEAD ZONE. Your dormant client relationships. The clients you used to work with, the matters that went silent, the contacts who knew you and stopped hearing from you. 60-80% of contacts in a typical law firm CRM are here right now.',
  rrosTooltip: 'THE RELATIONSHIP REVENUE OS. A system for turning the relationships you already have into the matters you have not yet won.',
  orbitsBlock: {
    title: 'The Five Orbits, in law firm terms.',
    items: [
      { id: '01', name: 'Core Proof', body: 'Your strongest client testimonials, named outcomes, billing partners who can speak for you.' },
      { id: '02', name: 'Active', body: 'Open matters. Engaged prospects. Active mandates.' },
      { id: '03', name: 'The Dead Zone', body: 'Dormant clients. Lapsed prospects. The book that decayed.' },
      { id: '04', name: 'Warm Adjacency', body: 'Referral sources. Peer counsel. Lateral introductions.' },
      { id: '05', name: 'New Gravity', body: 'New firms pulled by your authority and content.' },
    ],
  },
  reality: {
    title: 'The law firm reality.',
    facts: [
      { text: '80%+ of new matters come from existing clients at AmLaw 200 firms.', source: 'Altman Weil' },
      { text: 'Average cross-sell rate at midmarket firms <30%.' },
      { text: 'Lateral partner book retention rate <50% over 24 months.', source: 'industry research' },
      { text: 'Mid-market law firm origination is 90% partner-led.' },
      { text: 'Most firms have no formal CRM or relationship cadence.' },
      { text: 'The Dead Zone: 60 to 80% of contacts in a typical law firm CRM have no follow-up system.' },
    ],
  },
  pain: {
    title: 'Where law firm origination breaks.',
    cards: [
      { title: 'Lateral hires bring books that decay.', body: 'Most laterals do not retain their book past 24 months without systematic relationship maintenance.' },
      { title: 'Cross-selling is partner dependent.', body: 'Without signals, partners only refer clients in their direct relationships.' },
      { title: 'Origination depends on individuals.', body: 'When a partner leaves, the book leaves. No firm-level relationship asset.' },
      { title: 'Generic BD undermines the firm.', body: 'Templated outreach is the opposite of what your reputation rests on.' },
    ],
  },
  questions: {
    title: 'Six questions that tell us how big your origination gap is.',
    items: [
      'How many former clients have not heard from you in 12+ months?',
      'What percent of new matters come from existing client referrals vs new business development?',
      'Do you have a deliberate origination plan beyond partners\' personal networks?',
      'How many lateral hires have brought books that decayed within 24 months?',
      'What percent of your associates contribute to BD pipeline?',
      'When a partner retires or leaves, does the firm retain the book?',
    ],
    closing: 'If two or more of these landed, you owe yourself the diagnostic.',
  },
  cases: {
    mode: 'cohort',
    cohortBody: 'Independent law firms in the current research are validating the framework against AmLaw 200 origination patterns. Your firm benchmarks against 20+ peer practices on dormant client relationships, matter origination, and partner pipeline depth. The framework has already shown real outcomes in adjacent verticals: Madcraft (digital agency) reactivated a $400K dormant proposal in 7 minutes. SPR (Chicago technology consulting) restarted 3 conversations from 43 sends across 150 dormants. Law firm cases coming next. Add yours to be among the first.',
  },
  diagnostic: {
    title: 'Score your origination strategy in 10 minutes.',
    sub: '10 questions. Your origination strategy benchmarked against 20+ peer law firms.',
  },
  faq: [
    { q: 'Does this work for AmLaw 100 firms vs midmarket?', a: 'Both. AmLaw 100 firms benefit from cross-practice activation. Midmarket firms benefit most from systematizing what their top originators do informally.' },
    { q: 'How does this fit our existing CRM (Foundation, InterAction)?', a: 'The framework sits on top. We ingest from your existing relationship intelligence platform and add signal capture and cadence. We do not replace your CRM.' },
    { q: 'What about ethics and bar advertising rules?', a: 'The outreach is relationship-based and personalized, not solicitation. Every firm reviews messaging against their state bar rules before activation. We have not encountered a rule-of-conduct conflict among peer law firms to date.' },
    { q: 'Does this work for transactional vs litigation practices?', a: 'Yes. Transactional practices benefit from deal-trigger signals. Litigation practices benefit from cross-practice referrals and matter-completion follow-up.' },
    { q: 'What about ABA Model Rule 7.2 and bar advertising rules? Does this comply?', a: 'The diagnostic and the framework operate inside the firm\'s own systems. Outreach to dormant clients is not advertising under Model Rule 7.2 (which governs solicitation of new clients). Re-engaging existing client relationships and former clients of record is governed by Model Rules 1.18 and 7.3, which permit it under most circumstances. Always confirm with your firm\'s general counsel.' },
    { q: 'Can my firm participate confidentially without being named in the published research?', a: 'Yes. Participation defaults to anonymous benchmarking. Named cases are opt-in only. Most participating firms remain unnamed in the manuscript and only contribute aggregated data.' },
  ],
};

const accounting: VerticalContent = {
  slug: 'accounting',
  name: 'Accounting & Tax',
  shortLabel: 'Accounting',
  industryEyebrow: 'CLIENT DEVELOPMENT RESEARCH FOR ACCOUNTING FIRMS',
  hero: {
    headline: 'Your next client already knows you.',
    sub: 'The first research on client development in accounting. 200 practitioner interviews. Validated by Jonathan Copulsky (Former CMO Deloitte, Senior Lecturer Northwestern Kellogg). Designed to surface dormant clients, identify cross-sell gaps, and benchmark your firm\'s advisory expansion capability.',
    cohortLine: 'Free. 90 seconds to build. 10 minutes to read. Confidential. Benchmarked against peer accounting firms.',
  },
  ctaLabel: 'See Your Firm\'s Client Development Profile →',
  researchLabel: 'Client Development Research',
  diagnosticEyebrow: '06 · THE CLIENT DEVELOPMENT SCORE',
  sizingEyebrow: 'B · THE CLIENT DEVELOPMENT GAP',
  deadZoneTooltip: 'THE DEAD ZONE. Tax-only clients you never cross-sold. Lapsed advisory prospects. Former clients you have not contacted since the last engagement closed. 60-80% of contacts in a typical accounting CRM are here right now.',
  rrosTooltip: 'THE RELATIONSHIP REVENUE OS. A system for turning the relationships you already have into the engagements you have not yet won.',
  orbitsBlock: {
    title: 'The Five Orbits, in accounting terms.',
    items: [
      { id: '01', name: 'Core Proof', body: 'Your strongest client testimonials, named outcomes, partners who deliver advisory.' },
      { id: '02', name: 'Active', body: 'Active engagements. Tax + advisory clients in motion.' },
      { id: '03', name: 'The Dead Zone', body: 'Tax-only clients you never cross-sold. Lapsed advisory prospects.' },
      { id: '04', name: 'Warm Adjacency', body: 'Partner referrals. Peer firm intros. COI relationships.' },
      { id: '05', name: 'New Gravity', body: 'New clients pulled by your specialization and content.' },
    ],
  },
  reality: {
    title: 'The accounting reality.',
    facts: [
      { text: 'Average client tenure 7+ years. High stickiness, low expansion.' },
      { text: 'Cross-sell rate from tax to advisory <20% on average.', source: 'industry research' },
      { text: '60%+ of partners spend <10% time on origination.' },
      { text: 'Mid-market firms losing share to PE rollups.' },
      { text: 'Most firms have no signal-based outreach system.' },
      { text: 'Dormant client gap is wider in accounting than other PS due to annual cadence assumption.' },
    ],
  },
  pain: {
    title: 'Where accounting client development breaks.',
    cards: [
      { title: 'Tax is the door. Advisory is the kitchen.', body: 'Most firms never make the cross-sell from compliance work into advisory engagements.' },
      { title: 'Partners are delivery machines, not client development machines.', body: 'The economics suffer when no one owns expansion.' },
      { title: 'Annual cadence creates false comfort.', body: 'Once-a-year contact is not a relationship system.' },
      { title: 'PE rollups are taking your clients.', body: 'Your dormant base is their pipeline.' },
    ],
  },
  questions: {
    title: 'Six questions that tell us how big your client development gap is.',
    items: [
      'How many tax-only clients have you NOT cross-sold to advisory?',
      'What percent of your firm\'s revenue comes from existing client expansion vs new clients?',
      'Do you have a systematic client development plan beyond annual reviews?',
      'How many former clients lapsed without a goodbye conversation?',
      'What percent of your partners are origination-active vs delivery-only?',
      'How many of your top clients are quietly evaluating PE-backed alternatives?',
    ],
    closing: 'If two or more of these landed, you owe yourself the diagnostic.',
  },
  cases: {
    mode: 'cohort',
    cohortBody: 'Independent accounting firms in the current research are validating the framework against $5M-$100M client development patterns. Your firm benchmarks against peer practices on tax-to-advisory cross-sell, lapsed client reactivation, and partner origination. The framework has shown real outcomes in adjacent verticals: Madcraft (digital agency) reactivated a $400K dormant proposal in 7 minutes. SPR (Chicago technology consulting) restarted 3 conversations from 43 sends across 150 dormants.',
  },
  diagnostic: {
    title: 'Score your accounting firm in 10 minutes.',
    sub: '10 questions. Your client development strategy benchmarked against peer accounting firms.',
  },
  faq: [
    { q: 'Does this work for tax-only firms vs full-service?', a: 'Both. Tax-only firms use it to identify advisory cross-sell. Full-service firms use it to systematize the cross-practice handoff that today depends on partner memory.' },
    { q: 'How does this fit with our existing CRM (CCH, Thomson Reuters)?', a: 'We sit on top of your practice management stack. We ingest engagement data and surface signals. No data migration required.' },
    { q: 'What about our annual tax season cadence?', a: 'The cadence runs around tax season, not against it. Activation windows are timed for off-season months when partners have capacity.' },
    { q: 'Does this work for industry specializations (manufacturing, healthcare, etc.)?', a: 'Industry specialization makes it work better. The signal triggers (M&A, leadership change, regulatory shift) are sharper when narrowed to one industry.' },
    { q: 'What about AICPA independence rules and engagement rotation?', a: 'The framework operates within firm-defined independence boundaries. Reactivation outreach to attest clients is gated against the firm\'s independence matrix; advisory and non-attest clients flow through standard cadence. Your independence partner reviews configuration before activation.' },
    { q: 'Can my firm participate confidentially without being named in the published research?', a: 'Yes. Participation defaults to anonymous benchmarking. Named cases are opt-in only. Most participating firms remain unnamed in the manuscript and only contribute aggregated data.' },
  ],
};

const msp: VerticalContent = {
  slug: 'msp',
  name: 'MSP & IT Services',
  shortLabel: 'MSP',
  industryEyebrow: 'GTM RESEARCH FOR MSPs AND IT SERVICES FIRMS',
  hero: {
    headline: 'Your next renewal already knows you.',
    sub: 'The first research on GTM in MSPs and IT services. 200 practitioner interviews. Validated by Jonathan Copulsky (Former CMO Deloitte, Senior Lecturer Northwestern Kellogg). Designed to surface dormant accounts, lapsed POCs, and benchmark your firm\'s land-and-expand capability. SPR (Chicago technology consulting) identified 150 dormant enterprise contacts and restarted 3 conversations from 43 sends.',
    cohortLine: 'Free. 90 seconds to build. 10 minutes to read. Confidential. Benchmarked against peer MSPs.',
  },
  ctaLabel: 'See Your Firm\'s GTM Profile →',
  sizingEyebrow: 'B · THE PIPELINE GAP',
  deadZoneTooltip: 'THE DEAD ZONE. Churned customers. Lapsed POCs. Past contacts who moved to new firms. 60-80% of contacts in a typical MSP CRM are here right now.',
  rrosTooltip: 'THE RELATIONSHIP REVENUE OS. A system for turning the relationships you already have into the accounts you have not yet won.',
  orbitsBlock: {
    title: 'The Five Orbits, in MSP terms.',
    items: [
      { id: '01', name: 'Core Proof', body: 'Anchor accounts. Named case studies. NPS-positive customers.' },
      { id: '02', name: 'Active', body: 'Open opportunities. Active proposals. Pipeline in motion.' },
      { id: '03', name: 'The Dead Zone', body: 'Churned customers. Lapsed prospects. Stale POCs.' },
      { id: '04', name: 'Warm Adjacency', body: 'Channel partners. Vendor co-sells. Customer referrals.' },
      { id: '05', name: 'New Gravity', body: 'New accounts pulled by your category position.' },
    ],
  },
  reality: {
    title: 'The MSP reality.',
    facts: [
      { text: 'Average client churn 8 to 15% annual.' },
      { text: 'Cross-sell to managed services <40%.' },
      { text: 'Buyer journey 6 to 12 months of research before engagement.' },
      { text: '70%+ of new business still relationship-driven.' },
      { text: 'Most former clients never receive a "we want you back" outreach.' },
    ],
  },
  pain: {
    title: 'Where MSP GTM breaks.',
    cards: [
      { title: 'Churn happens silently.', body: 'By the time you notice, they are with a competitor.' },
      { title: 'Cross-sell to managed services is hit or miss.', body: 'No signal, no systematic ask.' },
      { title: 'Buyer journey is invisible.', body: 'Prospects research for 6 to 12 months before reaching out.' },
      { title: 'Hundreds of past contacts moved to new firms.', body: 'New roles. New budgets. You missed the window.' },
    ],
  },
  questions: {
    title: 'Six questions that tell us how big your gap is.',
    items: [
      'How many former clients churned without a renewal conversation?',
      'What percent of new business comes from existing client expansion?',
      'Do you have signal triggers for client tech stack changes?',
      'How many decision makers at your former clients have moved to new firms?',
      'What percent of your AEs are origination vs farming?',
      'How many of your former champions are now at firms that buy what you sell?',
    ],
    closing: 'If two or more of these landed, you owe yourself the diagnostic.',
  },
  cases: {
    mode: 'verified',
    cases: [
      {
        firmName: 'SPR',
        segment: 'Chicago Technology Consulting',
        contact: 'Kyle Gams, Managing Director',
        body: 'Identified 150 dormant enterprise contacts across 4 ICPs. Sent 43 emails through 3-layer human review. 3 conversations restarted. ~7% reply rate. Your firm benchmarks against peer MSPs on churn risk, expansion velocity, and dormant account reactivation.',
        quote: { text: 'Your guys\' signal is the personalization piece.', author: 'Kristin Rosa, Creative & Content Manager' },
      },
    ],
  },
  diagnostic: {
    title: 'Score your MSP in 10 minutes.',
    sub: '10 questions. Your GTM benchmarked against peer MSPs and IT services firms.',
  },
  faq: [
    { q: 'Does this work for pure MSPs vs technology consulting?', a: 'Both. Pure MSPs benefit most from churn prevention and renewal expansion. Technology consulting firms benefit from project-to-managed-service conversion.' },
    { q: 'How does this fit with our PSA tools (ConnectWise, Autotask, Datto)?', a: 'We ingest from your PSA. No replacement. Signal capture happens externally and lands as enriched contact records back in your system.' },
    { q: 'What about client confidentiality on enterprise accounts?', a: 'All signals are public-domain (LinkedIn, news, regulatory filings). No client data leaves your environment. Outreach is per-account approved.' },
    { q: 'Does this work for nonprofit MSPs?', a: 'Yes. The dynamics are similar to commercial MSPs with longer sales cycles. We adjust cadence accordingly.' },
    { q: 'Can my firm participate confidentially without being named in the published research?', a: 'Yes. Participation defaults to anonymous benchmarking. Named cases are opt-in only. Most participating firms remain unnamed in the manuscript and only contribute aggregated data.' },
  ],
};

const advisory: VerticalContent = {
  slug: 'advisory',
  name: 'Financial Advisory',
  shortLabel: 'Advisory',
  industryEyebrow: 'PROSPECTING STRATEGY RESEARCH FOR FINANCIAL ADVISORY FIRMS',
  hero: {
    headline: 'Your next client already knows you.',
    sub: 'The first research on prospecting strategy in financial advisory. 200 practitioner interviews. Validated by Jonathan Copulsky (Former CMO Deloitte, Senior Lecturer Northwestern Kellogg). Designed to surface dormant prospects, activate wealth event triggers, and benchmark your firm\'s practice growth capability.',
    cohortLine: 'Free. 90 seconds to build. 10 minutes to read. Confidential. Benchmarked against peer financial advisory firms.',
  },
  ctaLabel: 'See Your Firm\'s Prospecting Strategy Profile →',
  researchLabel: 'Prospecting Research',
  diagnosticEyebrow: '06 · THE PROSPECTING SCORE',
  sizingEyebrow: 'B · THE PROSPECTING GAP',
  deadZoneTooltip: 'THE DEAD ZONE. Lost prospects. Cold COIs. Former clients who left without a goodbye conversation. 60-80% of contacts in a typical advisory firm CRM are here right now.',
  rrosTooltip: 'THE RELATIONSHIP REVENUE OS. A system for turning the relationships you already have into the accounts you have not yet won.',
  orbitsBlock: {
    title: 'The Five Orbits, in advisory terms.',
    items: [
      { id: '01', name: 'Core Proof', body: 'Top client relationships. Wealth event success stories.' },
      { id: '02', name: 'Active', body: 'Active prospects. Open onboardings. Engaged COIs.' },
      { id: '03', name: 'The Dead Zone', body: 'Lost prospects. Lapsed referral sources. Cold COIs.' },
      { id: '04', name: 'Warm Adjacency', body: 'Centers of Influence. Allied advisors. Client family networks.' },
      { id: '05', name: 'New Gravity', body: 'Wealth event triggers. New affluent segments pulled by your specialty.' },
    ],
  },
  reality: {
    title: 'The advisory reality.',
    facts: [
      { text: '80%+ of AUM growth from existing client referrals.' },
      { text: 'Average prospect-to-client conversion takes 2 to 4 years.' },
      { text: 'Most firms have no repeatable origination process.' },
      { text: 'Wealth tier transitions create reactivation triggers.' },
      { text: '60%+ of advisors do no proactive prospecting beyond their book.' },
    ],
  },
  pain: {
    title: 'Where advisory prospecting breaks.',
    cards: [
      { title: 'Referrals are the only growth source.', body: 'No referral signal from COIs, no practice growth.' },
      { title: 'Prospects research for years before engaging.', body: 'You miss them in the dead zone.' },
      { title: 'Wealth events are reactivation triggers most firms miss.', body: 'Liquidity, exit, inheritance all create windows the firm never sees.' },
      { title: 'Advisor-led prospecting cannot scale.', body: 'Beyond the partner\'s calendar, practice growth stalls.' },
    ],
  },
  questions: {
    title: 'Six questions that tell us how big your prospecting gap is.',
    items: [
      'How many former prospects lost interest because timing was wrong?',
      'What percent of your AUM growth comes from existing client referrals vs new affluent prospects?',
      'Do you have a systematic prospecting process or rely on advisor relationships and COI introductions?',
      'How many introductions did you receive from your COIs vs ask for in the last quarter?',
      'What percent of your team contributes to practice growth?',
      'How many former prospects are now in wealth events you missed?',
    ],
    closing: 'If two or more of these landed, you owe yourself the diagnostic.',
  },
  cases: {
    mode: 'cohort',
    cohortBody: 'Independent financial advisory firms in the current research are validating the framework against $5M-$100M practice growth patterns. Your firm benchmarks against peer practices on dormant prospect reactivation, COI cultivation, and wealth event capture. The framework has shown real outcomes in adjacent verticals: Madcraft (digital agency) reactivated a $400K dormant proposal in 7 minutes. SPR (Chicago technology consulting) restarted 3 conversations from 43 sends across 150 dormants.',
  },
  diagnostic: {
    title: 'Score your advisory firm in 10 minutes.',
    sub: '10 questions. Your prospecting strategy benchmarked against peer advisory firms.',
  },
  faq: [
    { q: 'Does this work for RIA vs broker-dealer affiliated?', a: 'Both. Independent RIAs have more flexibility on outreach cadence. Broker-dealer affiliated firms work within their compliance framework.' },
    { q: 'How does this fit with our CRM (Redtail, Wealthbox, Salesforce FSC)?', a: 'We ingest from your CRM and write enriched signals back. No replacement.' },
    { q: 'What about FINRA / SEC compliance and outreach rules?', a: 'All outreach goes through your firm\'s compliance review before send. We provide the messaging and the cadence; your compliance team approves before activation. Reactivation outreach to former clients of record is governed by your firm\'s communications policy and is not solicitation under standard FINRA interpretation, but every firm should confirm with its CCO.' },
    { q: 'Does this work for ultra-high-net-worth vs mass affluent?', a: 'Both. UHNW benefits from wealth-event triggers and family-office signals. Mass affluent benefits from referral-loop activation and life-stage triggers.' },
    { q: 'Can my firm participate confidentially without being named in the published research?', a: 'Yes. Participation defaults to anonymous benchmarking. Named cases are opt-in only. Most participating firms remain unnamed in the manuscript and only contribute aggregated data.' },
  ],
};

const ae: VerticalContent = {
  slug: 'ae',
  name: 'Architecture & Engineering',
  shortLabel: 'A&E',
  industryEyebrow: 'BUSINESS DEVELOPMENT RESEARCH FOR ARCHITECTURE AND ENGINEERING FIRMS',
  hero: {
    headline: 'Your next project already knows you.',
    sub: 'The first research on business development in A&E. 200 practitioner interviews. Validated by Jonathan Copulsky (Former CMO Deloitte, Senior Lecturer Northwestern Kellogg). Designed to surface dormant pursuits, activate repeat-client opportunities, and benchmark your firm\'s BD capability.',
    cohortLine: 'Free. 90 seconds to build. 10 minutes to read. Confidential. Benchmarked against peer A&E firms.',
  },
  ctaLabel: 'See Your Firm\'s BD Profile →',
  researchLabel: 'BD Research',
  diagnosticEyebrow: '06 · THE BD SCORE',
  sizingEyebrow: 'B · THE BD GAP',
  deadZoneTooltip: 'THE DEAD ZONE. Lost RFPs. Past project clients without recent contact. Dormant pursuits. 60-80% of contacts in a typical A&E firm CRM are here right now.',
  rrosTooltip: 'THE RELATIONSHIP REVENUE OS. A system for turning the relationships you already have into the projects you have not yet won.',
  orbitsBlock: {
    title: 'The Five Orbits, in A&E terms.',
    items: [
      { id: '01', name: 'Core Proof', body: 'Your portfolio. Named projects. Repeat client testimonials.' },
      { id: '02', name: 'Active', body: 'Active pursuits. Open RFPs. Live projects in design or construction.' },
      { id: '03', name: 'The Dead Zone', body: 'Lost RFPs. Past clients without recent contact. Dormant backlog.' },
      { id: '04', name: 'Warm Adjacency', body: 'Allied firms. GC and owner network. Repeat client referrals.' },
      { id: '05', name: 'New Gravity', body: 'New project types pulled by your portfolio and authority.' },
    ],
  },
  reality: {
    title: 'The A&E reality.',
    facts: [
      { text: 'Average backlog turnover 18 to 36 months.' },
      { text: 'Repeat business rate 40 to 60% at top firms.' },
      { text: 'RFP win rate <10% on cold pursuits. 30 to 50% on relationship-based.' },
      { text: 'Most firms don\'t track post-project relationship cadence.' },
      { text: 'Firms rely on shortlisting, missing dormant pursuits.' },
    ],
  },
  pain: {
    title: 'Where A&E BD breaks.',
    cards: [
      { title: 'RFPs are a slow grind.', body: 'Win rate without relationship is brutal.' },
      { title: 'Repeat business is the moat, but post-project relationships decay.', body: 'Without a cadence, the next project goes to a competing firm.' },
      { title: 'Principal time is BD time.', body: 'The framework runs on signals, not principal calendars.' },
      { title: 'Shortlists are luck.', body: 'Without dormant pursuit activation, you miss 70% of fit projects.' },
    ],
  },
  questions: {
    title: 'Six questions that tell us how big your BD gap is.',
    items: [
      'How many RFPs did you pursue that went silent without award?',
      'What percent of your backlog comes from existing client repeat business?',
      'Do you have a systematic post-project relationship plan?',
      'How many former clients have not seen your latest portfolio work?',
      'What percent of your principals carry origination responsibility?',
      'How many shortlists did you miss because no one knew you were pursuing?',
    ],
    closing: 'If two or more of these landed, you owe yourself the diagnostic.',
  },
  cases: {
    mode: 'cohort',
    cohortBody: 'Independent A&E firms in the current research are validating the framework against $5M-$100M BD patterns. Your firm benchmarks against peer practices on RFP win rate, repeat-client capture, and principal-led pursuit capacity. The framework has shown real outcomes in adjacent verticals: Madcraft (digital agency) reactivated a $400K dormant proposal in 7 minutes. SPR (Chicago technology consulting) restarted 3 conversations from 43 sends across 150 dormants.',
  },
  diagnostic: {
    title: 'Score your A&E firm in 10 minutes.',
    sub: '10 questions. Your BD strategy benchmarked against peer A&E firms.',
  },
  faq: [
    { q: 'Does this work for architecture vs engineering vs combined firms?', a: 'All three. The dynamics differ in cycle length and shortlist mechanics, but the dormant pursuit problem is universal.' },
    { q: 'How does this fit with our project management tools (Deltek, Newforma)?', a: 'We ingest from project management and write enriched signals back. No replacement.' },
    { q: 'What about public sector vs private sector clients?', a: 'Both. Public sector benefits most from RFP-trigger signals and selection-committee mapping. Private sector benefits from owner-rep relationship activation.' },
    { q: 'Does this work for design-build vs traditional delivery?', a: 'Yes. Design-build firms see faster results because the relationship base is concentrated. Traditional firms see deeper results because the dormant base is larger.' },
    { q: 'How does this fit with our project pursuit and Go/No-Go process?', a: 'The framework feeds Go/No-Go with relationship-strength signal and prior-pursuit history per owner. Pursuit committees use the data as one input alongside fee, fit, and capacity scoring. We do not replace the Go/No-Go process; we make it sharper at the relationship layer.' },
    { q: 'Can my firm participate confidentially without being named in the published research?', a: 'Yes. Participation defaults to anonymous benchmarking. Named cases are opt-in only. Most participating firms remain unnamed in the manuscript and only contribute aggregated data.' },
  ],
};

const recruiting: VerticalContent = {
  slug: 'recruiting',
  name: 'Executive Search',
  shortLabel: 'Search',
  industryEyebrow: 'MANDATE ORIGINATION RESEARCH FOR EXECUTIVE SEARCH AND RECRUITING FIRMS',
  hero: {
    headline: 'Your next mandate already knows you.',
    sub: 'The first research on mandate origination in executive search. 200 practitioner interviews. Validated by Jonathan Copulsky (Former CMO Deloitte, Senior Lecturer Northwestern Kellogg). Designed to surface dormant clients, retrack placed candidates, and benchmark your firm\'s origination capability.',
    cohortLine: 'Free. 90 seconds to build. 10 minutes to read. Confidential. Benchmarked against peer executive search firms.',
  },
  ctaLabel: 'See Your Firm\'s Mandate Origination Profile →',
  researchLabel: 'Mandate Origination Research',
  diagnosticEyebrow: '06 · THE MANDATE ORIGINATION SCORE',
  sizingEyebrow: 'B · THE MANDATE ORIGINATION GAP',
  deadZoneTooltip: 'THE DEAD ZONE. Past clients without recent mandates. Placed candidates not retracked. Searches that went on hold and never restarted. 60-80% of contacts in a typical search firm CRM are here right now.',
  rrosTooltip: 'THE RELATIONSHIP REVENUE OS. A system for turning the relationships you already have into the mandates you have not yet won.',
  orbitsBlock: {
    title: 'The Five Orbits, in search firm terms.',
    items: [
      { id: '01', name: 'Core Proof', body: 'Marquee placements. Named search successes. Repeat client mandates.' },
      { id: '02', name: 'Active', body: 'Open searches. Live mandates. Active retainers.' },
      { id: '03', name: 'The Dead Zone', body: 'Past clients without recent mandates. Placed candidates not retracked.' },
      { id: '04', name: 'Warm Adjacency', body: 'Placed candidate network. Industry COIs. Allied search firms.' },
      { id: '05', name: 'New Gravity', body: 'New mandate types pulled by your sector specialization.' },
    ],
  },
  reality: {
    title: 'The search reality.',
    facts: [
      { text: 'Repeat client rate at top firms 60 to 70%.' },
      { text: 'Most firms don\'t track placed candidates as future clients.' },
      { text: 'Average client gap between mandates 12 to 24 months.' },
      { text: 'Researcher-to-BD ratio typically 5:1.' },
      { text: 'Few firms have signal-based outreach for new retainers.' },
    ],
  },
  pain: {
    title: 'Where search mandate origination breaks.',
    cards: [
      { title: 'Placed candidates become future clients.', body: 'Most firms never retrack placed candidates after the search closes.' },
      { title: 'Mandates go on hold and never restart.', body: 'No system to detect the right re-engage moment for a paused search.' },
      { title: 'Researchers do research, partners do BD.', body: 'The economics break above $20M.' },
      { title: 'Industry shifts are mandate triggers most firms miss.', body: 'M&A, leadership change, new funding all create windows for a retainer the firm never sees.' },
    ],
  },
  questions: {
    title: 'Six questions that tell us how big your mandate origination gap is.',
    items: [
      'How many client searches went on hold and never restarted?',
      'What percent of your placements led to second mandates from the same client?',
      'Do you have a systematic relationship plan for placed candidates as future retainer clients?',
      'How many former clients have you not contacted in 18+ months?',
      'What percent of your researchers contribute to mandate origination?',
      'How many of your placed candidates moved to new firms with new search needs?',
    ],
    closing: 'If two or more of these landed, you owe yourself the diagnostic.',
  },
  cases: {
    mode: 'cohort',
    cohortBody: 'Independent executive search firms in the current research are validating the framework against $5M-$100M mandate origination patterns. Your firm benchmarks against peer practices on dormant client reactivation, placed candidate retracking, and BD capacity. The framework has shown real outcomes in adjacent verticals: Madcraft (digital agency) reactivated a $400K dormant proposal in 7 minutes. SPR (Chicago technology consulting) restarted 3 conversations from 43 sends across 150 dormants.',
  },
  diagnostic: {
    title: 'Score your search firm in 10 minutes.',
    sub: '10 questions. Your mandate origination strategy benchmarked against peer search firms.',
  },
  faq: [
    { q: 'Does this work for retained search vs contingent recruiting?', a: 'Both. Retained search benefits most from placed-candidate-to-future-client tracking. Contingent recruiting benefits from req-trigger signals at past clients.' },
    { q: 'How does this fit our existing ATS (Bullhorn, Invenias, Clockwork)?', a: 'We ingest from your ATS and write enriched contact records back. No replacement.' },
    { q: 'What about candidate confidentiality?', a: 'All signals are public-domain. No candidate data is shared outside the firm. Confidential searches stay confidential.' },
    { q: 'Does this work for industry-specialized vs generalist firms?', a: 'Industry specialization makes it work better. Triggers are sharper when narrowed.' },
    { q: 'Can my firm participate confidentially without being named in the published research?', a: 'Yes. Participation defaults to anonymous benchmarking. Named cases are opt-in only. Most participating firms remain unnamed in the manuscript and only contribute aggregated data.' },
  ],
};

const agency: VerticalContent = {
  slug: 'agency',
  name: 'Marketing & Creative',
  shortLabel: 'Agency',
  industryEyebrow: 'NEW BUSINESS RESEARCH FOR MARKETING AND CREATIVE AGENCIES',
  hero: {
    headline: 'Your next account already knows you.',
    sub: 'The first research on new business in marketing and creative agencies. 200 practitioner interviews. Validated by Jonathan Copulsky (Former CMO Deloitte, Senior Lecturer Northwestern Kellogg). Madcraft (digital agency) reactivated a $400K dormant proposal in 7 minutes. Calliope (B2B healthcare content) sent 2 emails to dormants and got 2 replies. Designed to surface lost pitches, activate dormant prospects, and benchmark your firm\'s new business capability.',
    cohortLine: 'Free. 90 seconds to build. 10 minutes to read. Confidential. Benchmarked against peer agencies.',
  },
  ctaLabel: 'See Your Firm\'s New Business Profile →',
  researchLabel: 'New Business Research',
  diagnosticEyebrow: '06 · THE NEW BUSINESS SCORE',
  sizingEyebrow: 'B · THE NEW BUSINESS GAP',
  deadZoneTooltip: 'THE DEAD ZONE. Lost pitches. Past clients without recent contact. Stalled prospects. 60-80% of contacts in a typical agency CRM are here right now.',
  rrosTooltip: 'THE RELATIONSHIP REVENUE OS. A system for turning the relationships you already have into the accounts you have not yet won.',
  orbitsBlock: {
    title: 'The Five Orbits, in agency terms.',
    items: [
      { id: '01', name: 'Core Proof', body: 'Anchor accounts. Award-winning campaigns. Named client outcomes.' },
      { id: '02', name: 'Active', body: 'Live accounts. Active pitches. Open RFPs.' },
      { id: '03', name: 'The Dead Zone', body: 'Lost pitches. Past clients without recent contact. Stalled prospects.' },
      { id: '04', name: 'Warm Adjacency', body: 'Vendor / production partners. Strategic alliances. Client referrals.' },
      { id: '05', name: 'New Gravity', body: 'New verticals pulled by your specialty and creative authority.' },
    ],
  },
  reality: {
    title: 'The agency reality.',
    facts: [
      { text: 'Average proposal-to-close cycle 3 to 9 months.' },
      { text: 'Pitch dropout rate 60%+. The silent dead zone.' },
      { text: 'Repeat business rate 30 to 50% at well-run firms.' },
      { text: 'Most agencies have no systematic relationship cadence.' },
      { text: '80% of new business still comes through referrals.' },
    ],
  },
  pain: {
    title: 'Where agency new business breaks.',
    cards: [
      { title: 'Pitches that go silent post-chemistry meeting are the agency dead zone.', body: 'Most firms never reactivate a lost pitch.' },
      { title: 'Generic outreach is fatal for agencies.', body: 'The brand IS the work.' },
      { title: 'Account team turnover at clients creates reactivation triggers.', body: 'Most agencies miss them.' },
      { title: 'Founder-led new business breaks above $5M.', body: 'The framework runs on signals, not founder time.' },
    ],
  },
  questions: {
    title: 'Six questions that tell us how big your new business gap is.',
    items: [
      'How many pitches stalled in the dead zone past 9 months?',
      'What percent of your revenue comes from existing account expansion vs new accounts?',
      'Do you have signal triggers for client team changes?',
      'How many former clients are paying competing agencies right now?',
      'What percent of your principals own new business?',
      'How many of your dormant prospects are now in new roles with new budgets?',
    ],
    closing: 'If two or more of these landed, you owe yourself the diagnostic.',
  },
  cases: {
    mode: 'verified',
    cases: [
      {
        firmName: 'Madcraft',
        segment: 'Digital Agency',
        contact: 'Stephen Cuccio, Head of New Client Strategy',
        body: '$400K dormant proposal reactivated. Buyer replied in 7 minutes after 9 months silent. Your firm benchmarks against peer agencies on lost-pitch reactivation, account expansion, and principal-led new business capacity.',
        quote: { text: 'Lead nurturing agent created a customized note that reactivated a $400,000 opportunity for us.', author: 'Stephen Cuccio' },
      },
      {
        firmName: 'Calliope Communications',
        segment: 'B2B Healthcare Content',
        contact: 'Mary Tindall, Founder',
        body: '2 emails sent to dormant healthcare contacts. Both replied.',
        quote: { text: 'The AI has done a pretty good job connecting the dots.', author: 'Mary Tindall' },
      },
    ],
  },
  diagnostic: {
    title: 'Score your agency in 10 minutes.',
    sub: '10 questions. Your new business strategy benchmarked against peer agencies.',
  },
  faq: [
    { q: 'Does this work for full-service vs specialized agencies?', a: 'Both. Specialized agencies see results faster because the target client profile is narrower. Full-service agencies see broader results across multiple service lines.' },
    { q: 'How does this fit with our project management tools (HubSpot, Workamajig, Asana)?', a: 'We ingest from your CRM and project management. No replacement.' },
    { q: 'What about creative voice and brand integrity?', a: 'Every message is reviewed by your team before send. We provide the signal and the angle. You provide the voice.' },
    { q: 'Does this work for performance agencies vs brand agencies?', a: 'Both. Performance agencies benefit most from churn-trigger signals. Brand agencies benefit most from creative-team-change triggers at past clients.' },
    { q: 'How does this fit our pitch process and chemistry meetings?', a: 'The framework feeds your pitch funnel earlier. Reactivated relationships enter as warm chemistry meeting candidates rather than cold RFP responses, which materially shifts win rate. We do not change how you pitch; we change which pitches you get into.' },
    { q: 'Can my firm participate confidentially without being named in the published research?', a: 'Yes. Participation defaults to anonymous benchmarking. Named cases are opt-in only. Most participating firms remain unnamed in the manuscript and only contribute aggregated data.' },
  ],
};

export const VERTICALS: Record<VerticalSlug, VerticalContent> = {
  consulting,
  law,
  accounting,
  msp,
  advisory,
  ae,
  recruiting,
  agency,
};

export const VERTICAL_ORDER: VerticalSlug[] = [
  'consulting',
  'law',
  'accounting',
  'msp',
  'advisory',
  'ae',
  'recruiting',
  'agency',
];

export const NAV_VERTICAL_LINKS: { label: string; slug: VerticalSlug }[] = [
  { label: 'Management Consulting', slug: 'consulting' },
  { label: 'Law Firms', slug: 'law' },
  { label: 'Accounting & Tax', slug: 'accounting' },
  { label: 'MSP & IT Services', slug: 'msp' },
  { label: 'Financial Advisory', slug: 'advisory' },
  { label: 'Architecture & Engineering', slug: 'ae' },
  { label: 'Executive Search', slug: 'recruiting' },
  { label: 'Marketing & Creative', slug: 'agency' },
];
