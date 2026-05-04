import type { VerticalConfig } from "./configs";

export const consulting: VerticalConfig = {
  slug: "consulting",
  shortLabel: "Consulting",
  pageTitle: "Consulting - Practice Growth Score | Mabbly",
  pageDescription:
    "The first research on practice growth in management consulting. 500 practitioner interviews. Score your firm in 10 minutes.",
  hero: {
    eyebrow: "Practice Growth Research / Management Consulting",
    headlineLine1: "Your next consulting",
    headlineLine2: "client already knows you",
    lede: (
      <>
        The first research on <strong>practice growth in management consulting</strong>. 500 practitioner interviews.
        Validated against the firms running it now.
      </>
    ),
  },
  profile: {
    eyebrowLabel: "Practice Growth Profile",
    firmName: "Anonymous · MGMT 04",
    score: 47,
    tier: "Below Peer Median",
    msg: (
      <>
        A measurable practice growth gap. Reactivation potential: <strong>$1.2M–$2.4M</strong>.
      </>
    ),
    bars: [
      { label: "Dead Zone Activation", w: 38, mark: 64 },
      { label: "Network Velocity", w: 42, mark: 58 },
      { label: "Origination Discipline", w: 61, mark: 56 },
    ],
  },
  numbers: {
    metaTag: "The Practice Growth Gap",
    headline: "Management consulting in numbers",
    sub: "A $320B industry. 150K firms. Most are partner-led, all are relationship-driven. None of them have a system.",
    heroStat: {
      label: "US Industry Revenue · 2024",
      num: <>$320<span className="unit">B</span></>,
      sub: (
        <>
          The total addressable market for the framework. The Dead Zone is a percentage of <strong>this number</strong>,
          sitting in CRMs across 150,000 firms.
        </>
      ),
      source: "IBISWorld 2024 · 4.2% Annual Growth",
    },
    smallStats: [
      { label: "Total US Firms", num: { type: "count", target: 150, format: "suffix-k" }, source: "IBISWorld 2024", viz: "density" },
      { label: "Firms · $5M–$100M Revenue", num: { type: "count", target: 8200, format: "number" }, source: "Kennedy Research", viz: "bars" },
      { label: "Annual Growth Rate", num: { type: "count", target: 4.2, format: "pct-decimal" }, source: "IBISWorld 2024", viz: "sparkline" },
    ],
  },
  reality: {
    metaTag: "Industry Dynamics",
    headline: "The consulting reality",
    sub: "Six numbers from the field that explain why partner-led practice growth fails without a system.",
    definitionTerm: "The Dead Zone",
    definitionBody:
      "Dormant accounts. Stalled proposals. Lost pursuits. The clients you used to serve and the prospects who went silent. The largest line item in every consulting firm's pipeline that nobody is measuring.",
    cards: [
      { num: "01", stat: <>6–12<span className="unit-sm">mo</span></>, text: "Average sales cycle for $1M+ engagements.", source: "Industry Average" },
      { num: "02", stat: <>80<span className="unit-sm">%</span></>, text: "Of new business at top firms comes from existing clients.", source: "McKinsey · Sales Force Effectiveness" },
      { num: "03", stat: <>18–24<span className="unit-sm">mo</span></>, text: "Partner book turnover when partner leaves.", source: "Industry Research" },
      {
        num: "04",
        stat: (
          <>
            <span style={{ color: "var(--care)" }}>&lt;2%</span>
            <span style={{ color: "var(--muted-soft)", fontSize: "0.7em", margin: "0 4px" }}>/</span>
            25–40<span className="unit-sm">%</span>
          </>
        ),
        text: "Win rate on cold outreach vs warm relationships.",
        source: "Industry Average",
      },
      {
        num: "05",
        stat: (
          <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22, lineHeight: 1.1, letterSpacing: "-0.005em", fontWeight: 500 }}>
            No formal cadence.
          </span>
        ),
        text: "Most firms have no post-engagement relationship system.",
        source: "The Manuscript",
      },
      { num: "06", stat: <>60–80<span className="unit-sm">%</span></>, text: "Of contacts in a typical CRM are dormant.", source: "The Manuscript" },
    ],
  },
  breaks: {
    metaTag: "Where It Breaks",
    headline: "Where consulting practice growth breaks",
    blocks: [
      { num: "01", chart: "timeline", headline: "Proposals stall in the Dead Zone.", body: <>Average proposal goes silent <strong>9 to 12 months</strong> before re-engagement. No system to know when to act on it.</> },
      { num: "02", chart: "partnerWeek", headline: "Partner time is the bottleneck.", body: <>Origination depends on partner calendars. Roughly <strong>2 hours a week</strong> for new business. The framework runs on <strong>signals</strong>, not calendars.</> },
      { num: "03", chart: "coldVsWarm", headline: "Generic outreach kills the brand.", body: <>Most firms send "checking in" emails to dormant contacts and watch reply rates fall <strong>below 2%</strong>. Buyers ignore the un-personal.</> },
      { num: "04", chart: "networkDensity", headline: "The network is the moat. The network decays.", body: <>Hundreds of dormant relationships in every partner's book - worth <strong>millions in reactivatable pipeline</strong>, sitting unsignalled.</> },
    ],
  },
  audit: {
    metaTag: "The Pain Audit",
    headline: "Six questions",
    sub: <>Click <strong>Yes</strong> or <strong>No</strong>. Two or more "yes" means you owe yourself the diagnostic.</>,
    questions: [
      "How many proposals are sitting silent past 6 months in your pursuits?",
      "Did under 30% of your new engagements come from existing clients this year?",
      "Has it been over 6 months since you systematically reactivated dormant accounts?",
      "Is your firm partner-led with no documented BD origination plan?",
      "Do fewer than half of your top 10 accounts have written case studies?",
      "Are former clients now paying competing consulting firms you don't track?",
    ],
    alertMessage: "Your firm has a measurable practice growth gap. Take the score.",
  },
  roadmap: {
    metaTag: "The 90-Day Path",
    headline: "From score to first reactivated client",
    sub: <>Most firms see their first warm reply <strong>within 14 days</strong> of their first outreach round.</>,
    stops: [
      { day: "Day 0", label: "The Score", desc: "90 seconds to build. 10 minutes to read. Free." },
      { day: "Day 7", label: "Practice Growth Profile", desc: "Benchmarked against peer consulting firms. Confidential." },
      { day: "Day 30", label: "Discovery", desc: "Where partnership begins. Run the framework with the team." },
      { day: "Day 90", label: "First Reactivation", desc: "Your first warm reply from a dormant relationship." },
    ],
  },
  score: {
    metaTag: "The Practice Growth Score",
    headline: "Score your consulting firm in 10 minutes",
    sub: "10 questions. Your practice growth strategy benchmarked against peer consulting firms. Most decisions within 48 hours.",
    ctaLabel: "Add Your Firm",
  },
  authorsHeadline: "Two practitioners. One academic",
  faq: {
    metaTag: "Consulting Firm Questions",
    headline: "Six common questions",
    items: [
      { tag: "Fit", q: "Does this work for boutique consulting firms ($5 to $15M)?", a: "Yes. The framework is built for partner-led origination and is most effective at firms where 1 to 5 partners drive the majority of new business. The Dead Zone math works the same; the activation overhead is lower." },
      { tag: "Fit", q: "Does this work for management vs strategy vs operations consulting?", a: "Yes across all three. The dynamics differ in cycle length and engagement size, but the dormant-relationship pattern is universal. The framework adapts; the underlying research holds." },
      { tag: "Timing", q: "How long does implementation take with 1 to 2 BD owners?", a: "90 days from data ingestion to first reactivated relationship. Most firms see their first warm response within 2 weeks of the initial outreach round." },
      { tag: "Configuration", q: "What if my firm is partner-led with no BD team?", a: "That is the most common configuration. The framework reduces partner BD time from ~10 hours/week to under 2, while increasing pipeline coverage 3x." },
      { tag: "Economics", q: "How does this fit with our existing partner economics?", a: "The framework respects partner origination credit and book ownership. Reactivated relationships are routed back to the original partner of record by default." },
      { tag: "Privacy", q: "Can my firm participate confidentially without being named in the published research?", a: "Yes. Participation defaults to anonymous benchmarking. Named cases are opt-in only. Most participating firms remain anonymous in the published manuscript." },
    ],
  },
  begin: {
    headline: "Your next consulting client already knows you",
    ctaLabel: "Add Your Firm",
  },
};

export const law: VerticalConfig = {
  slug: "law",
  shortLabel: "Law",
  pageTitle: "Law Firms - Origination Score | Mabbly",
  pageDescription:
    "The first research on origination strategy in law. 500 practitioner interviews. Score your firm in 10 minutes.",
  hero: {
    eyebrow: "Origination Strategy Research / Law Firms",
    headlineLine1: "Your next matter",
    headlineLine2: "already knows you",
    lede: (
      <>
        The first research on <strong>origination strategy in law firms</strong>. 500 practitioner interviews.
        Designed to surface dormant client relationships and benchmark partner pipeline depth.
      </>
    ),
  },
  profile: {
    eyebrowLabel: "Origination Profile",
    firmName: "Anonymous · LAW 12",
    score: 51,
    tier: "Below Peer Median",
    msg: (
      <>
        A measurable origination gap. Reactivation potential: <strong>$0.9M–$2.1M</strong> in matter pipeline.
      </>
    ),
    bars: [
      { label: "Dormant Client Activation", w: 41, mark: 62 },
      { label: "Cross-Practice Velocity", w: 36, mark: 55 },
      { label: "Partner Origination Depth", w: 58, mark: 60 },
    ],
  },
  numbers: {
    metaTag: "The Origination Gap",
    headline: "Law firms in numbers",
    sub: "A $390B industry. 450K+ active firms. Origination is partner-led; the book is fragile.",
    heroStat: {
      label: "US Legal Services Revenue · 2024",
      num: <>$390<span className="unit">B</span></>,
      sub: (
        <>
          The total addressable market for legal services. <strong>80%+ of new matters</strong> at AmLaw 200 firms come
          from existing clients - the rest is sitting in dormant relationships.
        </>
      ),
      source: "ABA / IBISWorld 2024 · 3.5% Annual Growth",
    },
    smallStats: [
      { label: "Active US Law Firms", num: { type: "count", target: 450, format: "suffix-k" }, source: "ABA Profile 2023", viz: "density" },
      { label: "Firms · $5M–$100M Revenue", num: { type: "count", target: 6800, format: "number" }, source: "Altman Weil", viz: "bars" },
      { label: "Annual Growth Rate", num: { type: "count", target: 3.5, format: "pct-decimal" }, source: "Altman Weil 2024", viz: "sparkline" },
    ],
  },
  reality: {
    metaTag: "Industry Dynamics",
    headline: "The law firm reality",
    sub: "Six numbers that explain why origination depends on individuals - and why the book leaves when the partner does.",
    definitionTerm: "The Dead Zone",
    definitionBody:
      "Dormant clients. Lapsed prospects. Former matters that closed and went silent. The clients who knew you and stopped hearing from you. 60–80% of contacts in a typical law firm CRM live here right now.",
    cards: [
      { num: "01", stat: <>80<span className="unit-sm">%+</span></>, text: "Of new matters at AmLaw 200 firms come from existing clients.", source: "Altman Weil" },
      { num: "02", stat: <>{"<"}30<span className="unit-sm">%</span></>, text: "Average cross-sell rate at midmarket firms.", source: "Industry Research" },
      { num: "03", stat: <>{"<"}50<span className="unit-sm">%</span></>, text: "Lateral partner book retention rate over 24 months.", source: "Industry Research" },
      { num: "04", stat: <>90<span className="unit-sm">%</span></>, text: "Mid-market law firm origination is partner-led.", source: "Altman Weil" },
      {
        num: "05",
        stat: (
          <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22, lineHeight: 1.1, letterSpacing: "-0.005em", fontWeight: 500 }}>
            No formal CRM cadence.
          </span>
        ),
        text: "Most firms have no relationship cadence beyond the partner's calendar.",
        source: "The Manuscript",
      },
      { num: "06", stat: <>60–80<span className="unit-sm">%</span></>, text: "Of contacts in a typical law firm CRM have no follow-up system.", source: "The Manuscript" },
    ],
  },
  breaks: {
    metaTag: "Where It Breaks",
    headline: "Where law firm origination breaks",
    blocks: [
      { num: "01", chart: "timeline", headline: "Matters close. Then silence.", body: <>Most firms have <strong>no post-matter cadence</strong>. The client moves on and the relationship decays inside 12 months.</> },
      { num: "02", chart: "partnerWeek", headline: "Origination depends on individuals.", body: <>When a partner leaves, the book leaves. <strong>Lateral book retention is under 50%</strong> over 24 months without a firm-level relationship system.</> },
      { num: "03", chart: "coldVsWarm", headline: "Generic outreach undermines the brand.", body: <>Templated "checking in" emails are the opposite of what your reputation rests on. Reply rates fall <strong>below 2%</strong>.</> },
      { num: "04", chart: "networkDensity", headline: "Cross-practice referrals stall.", body: <>Without signals, partners only refer clients in their direct relationships. <strong>Hundreds of dormant clients</strong> sit unsignalled across practice groups.</> },
    ],
  },
  audit: {
    metaTag: "The Pain Audit",
    headline: "Six questions",
    sub: <>Click <strong>Yes</strong> or <strong>No</strong>. Two or more "yes" means you owe yourself the diagnostic.</>,
    questions: [
      "Have any former clients not heard from you in 12+ months?",
      "Do under 30% of new matters come from cross-practice referrals?",
      "Is your firm partner-led with no documented origination plan?",
      "Have any laterals in the last 5 years brought books that decayed inside 24 months?",
      "Do fewer than half of associates contribute to BD pipeline?",
      "When a partner retires, does the firm typically lose the book?",
    ],
    alertMessage: "Your firm has a measurable origination gap. Take the score.",
  },
  roadmap: {
    metaTag: "The 90-Day Path",
    headline: "From score to first reactivated client",
    sub: <>Most firms see their first warm reply <strong>within 14 days</strong> of their first outreach round.</>,
    stops: [
      { day: "Day 0", label: "The Score", desc: "90 seconds to build. 10 minutes to read. Free." },
      { day: "Day 7", label: "Origination Profile", desc: "Benchmarked against peer law firms. Confidential." },
      { day: "Day 30", label: "Discovery", desc: "Where partnership begins. Run the framework with the firm." },
      { day: "Day 90", label: "First Reactivation", desc: "Your first warm reply from a dormant client." },
    ],
  },
  score: {
    metaTag: "The Origination Score",
    headline: "Score your origination strategy in 10 minutes",
    sub: "10 questions. Your origination strategy benchmarked against peer law firms. Most decisions within 48 hours.",
    ctaLabel: "Add Your Firm",
  },
  authorsHeadline: "Two practitioners. One academic",
  faq: {
    metaTag: "Law Firm Questions",
    headline: "Six common questions",
    items: [
      { tag: "Fit", q: "Does this work for AmLaw 100 firms vs midmarket?", a: "Both. AmLaw 100 firms benefit most from cross-practice activation. Midmarket firms benefit most from systematizing what their top originators do informally." },
      { tag: "Stack", q: "How does this fit our existing CRM (Foundation, InterAction)?", a: "The framework sits on top. We ingest from your existing relationship intelligence platform and add signal capture and cadence. We do not replace your CRM." },
      { tag: "Ethics", q: "What about ABA Model Rule 7.2 and bar advertising?", a: "Re-engaging former clients of record is governed by Rules 1.18 and 7.3, which permit it under most circumstances. The framework operates inside firm-owned systems. Always confirm with your firm's general counsel." },
      { tag: "Practice", q: "Does this work for transactional vs litigation?", a: "Yes. Transactional practices benefit from deal-trigger signals. Litigation practices benefit from cross-practice referrals and matter-completion follow-up." },
      { tag: "Timing", q: "How long does implementation take?", a: "90 days from data ingestion to first reactivated client. Most firms see their first warm response within 2 weeks of the initial outreach round." },
      { tag: "Privacy", q: "Can my firm participate confidentially?", a: "Yes. Participation defaults to anonymous benchmarking. Named cases are opt-in only. Most participating firms remain unnamed in the published manuscript." },
    ],
  },
  begin: {
    headline: "Your next matter already knows you",
    ctaLabel: "Add Your Firm",
  },
};

export const accounting: VerticalConfig = {
  slug: "accounting",
  shortLabel: "Accounting",
  pageTitle: "Accounting Firms - Client Development Score | Mabbly",
  pageDescription:
    "Client development research for accounting firms. 500 practitioner interviews. Score your firm in 10 minutes.",
  hero: {
    eyebrow: "Client Development Research / Accounting",
    headlineLine1: "Your next client",
    headlineLine2: "already knows you",
    lede: (
      <>
        The first research on <strong>client development in accounting</strong>. 500 practitioner interviews.
        Designed to surface tax-only clients you never cross-sold and benchmark advisory expansion capability.
      </>
    ),
  },
  profile: {
    eyebrowLabel: "Client Development Profile",
    firmName: "Anonymous · ACCT 09",
    score: 44,
    tier: "Below Peer Median",
    msg: (
      <>
        A measurable cross-sell gap. Advisory expansion potential: <strong>$0.6M–$1.4M</strong>.
      </>
    ),
    bars: [
      { label: "Tax → Advisory Cross-Sell", w: 22, mark: 48 },
      { label: "Dormant Client Activation", w: 39, mark: 60 },
      { label: "Partner Origination Time", w: 28, mark: 52 },
    ],
  },
  numbers: {
    metaTag: "The Client Development Gap",
    headline: "Accounting in numbers",
    sub: "A $160B industry. 140K firms. High client tenure, low expansion. PE rollups are taking share.",
    heroStat: {
      label: "US Accounting Revenue · 2024",
      num: <>$160<span className="unit">B</span></>,
      sub: (
        <>
          The total addressable market for accounting and advisory. <strong>Cross-sell from tax to advisory under 20%</strong>{" "}
          on average - that gap is the line item nobody is measuring.
        </>
      ),
      source: "AICPA / IBISWorld 2024 · 5.1% Annual Growth",
    },
    smallStats: [
      { label: "US CPA Firms", num: { type: "count", target: 140, format: "suffix-k" }, source: "AICPA 2024", viz: "density" },
      { label: "Firms · $5M–$100M Revenue", num: { type: "count", target: 5400, format: "number" }, source: "Inside Public Accounting", viz: "bars" },
      { label: "Annual Growth Rate", num: { type: "count", target: 5.1, format: "pct-decimal" }, source: "Inside Public Accounting", viz: "sparkline" },
    ],
  },
  reality: {
    metaTag: "Industry Dynamics",
    headline: "The accounting reality",
    sub: "Six numbers that explain why high stickiness and low expansion is the wrong tradeoff.",
    definitionTerm: "The Dead Zone",
    definitionBody:
      "Tax-only clients you never cross-sold. Lapsed advisory prospects. Former clients you have not contacted since the last engagement closed. 60–80% of contacts in a typical accounting CRM are dormant.",
    cards: [
      { num: "01", stat: <>7<span className="unit-sm">+yr</span></>, text: "Average client tenure. High stickiness, low expansion.", source: "Industry Research" },
      { num: "02", stat: <>{"<"}20<span className="unit-sm">%</span></>, text: "Cross-sell rate from tax to advisory.", source: "Industry Research" },
      { num: "03", stat: <>60<span className="unit-sm">%+</span></>, text: "Of partners spend less than 10% of time on origination.", source: "Industry Research" },
      { num: "04", stat: <>5.1<span className="unit-sm">%</span></>, text: "Industry growth rate. PE rollups are taking share fastest.", source: "Inside Public Accounting" },
      {
        num: "05",
        stat: (
          <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22, lineHeight: 1.1, letterSpacing: "-0.005em", fontWeight: 500 }}>
            Annual cadence assumption.
          </span>
        ),
        text: "Most firms touch clients once a year and call it a relationship.",
        source: "The Manuscript",
      },
      { num: "06", stat: <>60–80<span className="unit-sm">%</span></>, text: "Of contacts in a typical accounting CRM are dormant.", source: "The Manuscript" },
    ],
  },
  breaks: {
    metaTag: "Where It Breaks",
    headline: "Where accounting client development breaks",
    blocks: [
      { num: "01", chart: "timeline", headline: "Tax season ends. Then silence.", body: <>Most firms touch clients once a year. The next 11 months are <strong>dormant by default</strong> - and so is the cross-sell window.</> },
      { num: "02", chart: "partnerWeek", headline: "Partner time is the bottleneck.", body: <>Partners spend <strong>under 10% of their time on origination</strong>. Advisory expansion needs signals, not calendars.</> },
      { num: "03", chart: "coldVsWarm", headline: "Generic outreach kills the relationship.", body: <>Templated "year-end" emails fall flat. Reply rates collapse <strong>below 2%</strong> against a 7-year client tenure.</> },
      { num: "04", chart: "networkDensity", headline: "The book of business is dormant by default.", body: <>Hundreds of tax-only clients sit unsignalled - each one a potential <strong>advisory expansion</strong> the firm never sees.</> },
    ],
  },
  audit: {
    metaTag: "The Pain Audit",
    headline: "Six questions",
    sub: <>Click <strong>Yes</strong> or <strong>No</strong>. Two or more "yes" means you owe yourself the diagnostic.</>,
    questions: [
      "Are over half your tax clients receiving no advisory services from your firm?",
      "Have any clients not heard from you between filings?",
      "Did under 20% of revenue come from cross-sell expansion this year?",
      "Do partners spend under 10% of their time on origination?",
      "Have you lost clients to PE-rollup firms in the last 24 months?",
      "Is the firm relying on annual touchpoints as the relationship cadence?",
    ],
    alertMessage: "Your firm has a measurable client development gap. Take the score.",
  },
  roadmap: {
    metaTag: "The 90-Day Path",
    headline: "From score to first cross-sold client",
    sub: <>Most firms see their first warm reply <strong>within 14 days</strong> of their first outreach round.</>,
    stops: [
      { day: "Day 0", label: "The Score", desc: "90 seconds to build. 10 minutes to read. Free." },
      { day: "Day 7", label: "Client Development Profile", desc: "Benchmarked against peer accounting firms. Confidential." },
      { day: "Day 30", label: "Discovery", desc: "Where partnership begins. Run the framework with the team." },
      { day: "Day 90", label: "First Cross-Sell", desc: "Your first advisory engagement from a tax-only client." },
    ],
  },
  score: {
    metaTag: "The Client Development Score",
    headline: "Score your client development in 10 minutes",
    sub: "10 questions. Your client development strategy benchmarked against peer accounting firms. Most decisions within 48 hours.",
    ctaLabel: "Add Your Firm",
  },
  authorsHeadline: "Two practitioners. One academic",
  faq: {
    metaTag: "Accounting Firm Questions",
    headline: "Six common questions",
    items: [
      { tag: "Fit", q: "Does this work for tax-focused vs advisory-focused firms?", a: "Both. Tax-focused firms benefit most from cross-sell expansion. Advisory-focused firms benefit most from dormant-client reactivation across high-value engagement types." },
      { tag: "Stack", q: "How does this fit with our existing practice management software?", a: "The framework sits on top of your existing PM stack. We ingest client and engagement data and add signal capture and cadence. We do not replace your software." },
      { tag: "Compliance", q: "What about independence rules and audit-client conflicts?", a: "Outreach respects independence rules and audit-client restrictions. The framework only surfaces relationships permitted under firm policy and the AICPA code." },
      { tag: "Timing", q: "How long does implementation take?", a: "90 days from data ingestion to first cross-sold engagement. Most firms see their first warm response within 2 weeks of the initial outreach round." },
      { tag: "Economics", q: "How does this fit with partner compensation models?", a: "The framework respects partner origination credit. Reactivated clients are routed to the originating partner where one exists." },
      { tag: "Privacy", q: "Can my firm participate confidentially?", a: "Yes. Participation defaults to anonymous benchmarking. Named cases are opt-in only. Most participating firms remain unnamed in the published manuscript." },
    ],
  },
  begin: {
    headline: "Your next client already knows you",
    ctaLabel: "Add Your Firm",
  },
};

export const msp: VerticalConfig = {
  slug: "msp",
  shortLabel: "MSP",
  pageTitle: "MSPs - Account Expansion Score | Mabbly",
  pageDescription:
    "Account expansion research for MSPs. 500 practitioner interviews. Score your firm in 10 minutes.",
  hero: {
    eyebrow: "Account Expansion Research / Managed Services",
    headlineLine1: "Your next contract",
    headlineLine2: "already runs your stack",
    lede: (
      <>
        The first research on <strong>account expansion in managed services</strong>. 500 practitioner interviews.
        Designed to surface dormant SMB accounts and benchmark land-and-expand performance.
      </>
    ),
  },
  profile: {
    eyebrowLabel: "Account Expansion Profile",
    firmName: "Anonymous · MSP 07",
    score: 49,
    tier: "Below Peer Median",
    msg: (
      <>
        A measurable expansion gap. Whitespace MRR potential: <strong>$0.5M–$1.3M</strong>.
      </>
    ),
    bars: [
      { label: "Account Whitespace Capture", w: 33, mark: 58 },
      { label: "Dormant Account Reactivation", w: 41, mark: 56 },
      { label: "Cross-Sell Velocity", w: 52, mark: 62 },
    ],
  },
  numbers: {
    metaTag: "The Account Expansion Gap",
    headline: "Managed services in numbers",
    sub: "A $220B industry growing at 12.5%. Land-and-expand is the moat - most firms are landing only.",
    heroStat: {
      label: "US Managed Services Revenue · 2024",
      num: <>$220<span className="unit">B</span></>,
      sub: (
        <>
          The fastest-growing PS vertical. Net revenue retention is the leading indicator -{" "}
          <strong>most MSPs are leaving expansion on the table</strong>.
        </>
      ),
      source: "ChannelE2E 2024 · 12.5% Annual Growth",
    },
    smallStats: [
      { label: "US MSPs", num: { type: "count", target: 40, format: "suffix-k" }, source: "ChannelE2E 2024", viz: "density" },
      { label: "MSPs · $5M–$100M Revenue", num: { type: "count", target: 3900, format: "number" }, source: "ConnectWise State of SMB", viz: "bars" },
      { label: "Annual Growth Rate", num: { type: "count", target: 12.5, format: "pct-decimal" }, source: "ConnectWise 2024", viz: "sparkline" },
    ],
  },
  reality: {
    metaTag: "Industry Dynamics",
    headline: "The MSP reality",
    sub: "Six numbers that explain why land-and-expand without signals leaves money on the table.",
    definitionTerm: "The Dead Zone",
    definitionBody:
      "Existing accounts you never expanded. Former SMB clients who churned to a competitor. Prospects who stalled mid-evaluation. The expansion pipeline most MSPs forgot they had.",
    cards: [
      { num: "01", stat: <>12.5<span className="unit-sm">%</span></>, text: "Industry growth rate. Fastest-growing PS vertical.", source: "ChannelE2E 2024" },
      { num: "02", stat: <>{"<"}30<span className="unit-sm">%</span></>, text: "Of revenue from cross-sell at typical SMB MSP.", source: "ConnectWise" },
      { num: "03", stat: <>3–5<span className="unit-sm">x</span></>, text: "Multiple of cost-to-acquire vs cost-to-expand.", source: "Industry Research" },
      { num: "04", stat: <>{"<"}20<span className="unit-sm">%</span></>, text: "MSPs with formal QBR cadence across all accounts.", source: "ConnectWise" },
      {
        num: "05",
        stat: (
          <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22, lineHeight: 1.1, letterSpacing: "-0.005em", fontWeight: 500 }}>
            No expansion playbook.
          </span>
        ),
        text: "Most MSPs have no signal-driven expansion motion.",
        source: "The Manuscript",
      },
      { num: "06", stat: <>60–80<span className="unit-sm">%</span></>, text: "Of contacts in a typical MSP CRM are dormant or single-product.", source: "The Manuscript" },
    ],
  },
  breaks: {
    metaTag: "Where It Breaks",
    headline: "Where MSP expansion breaks",
    blocks: [
      { num: "01", chart: "timeline", headline: "Land-and-expand stalls at land.", body: <>Most MSPs sell <strong>one product per account</strong> and never trigger the expansion signal. The whitespace map is dormant by default.</> },
      { num: "02", chart: "partnerWeek", headline: "Tech leadership runs sales.", body: <>The CTO or owner spends <strong>under 2 hours/week</strong> on expansion. Without a signal-driven motion, they only expand the accounts they remember.</> },
      { num: "03", chart: "coldVsWarm", headline: "Cold prospecting beats expansion budget.", body: <>Most MSPs spend more on cold prospecting than expanding existing accounts. <strong>Expansion CAC is 3–5x cheaper</strong>.</> },
      { num: "04", chart: "networkDensity", headline: "Churn happens silently.", body: <>SMB accounts churn to competitors <strong>without warning</strong> when no one is watching the relationship signals.</> },
    ],
  },
  audit: {
    metaTag: "The Pain Audit",
    headline: "Six questions",
    sub: <>Click <strong>Yes</strong> or <strong>No</strong>. Two or more "yes" means you owe yourself the diagnostic.</>,
    questions: [
      "Do over half your accounts run only one of your service lines?",
      "Did under 30% of new revenue come from existing-account expansion this year?",
      "Have you lost any accounts to a competitor in the last 12 months without a save attempt?",
      "Is QBR cadence informal or inconsistent across the book?",
      "Does cross-sell depend on the owner / CTO's personal calendar?",
      "Do you spend more on cold prospecting than account expansion?",
    ],
    alertMessage: "Your firm has a measurable expansion gap. Take the score.",
  },
  roadmap: {
    metaTag: "The 90-Day Path",
    headline: "From score to first expanded account",
    sub: <>Most MSPs see their first expansion conversation <strong>within 14 days</strong> of their first outreach round.</>,
    stops: [
      { day: "Day 0", label: "The Score", desc: "90 seconds to build. 10 minutes to read. Free." },
      { day: "Day 7", label: "Account Expansion Profile", desc: "Benchmarked against peer MSPs. Confidential." },
      { day: "Day 30", label: "Discovery", desc: "Where partnership begins. Run the framework with the team." },
      { day: "Day 90", label: "First Expansion", desc: "Your first new product line in an existing account." },
    ],
  },
  score: {
    metaTag: "The Account Expansion Score",
    headline: "Score your account expansion in 10 minutes",
    sub: "10 questions. Your expansion strategy benchmarked against peer MSPs. Most decisions within 48 hours.",
    ctaLabel: "Add Your Firm",
  },
  authorsHeadline: "Two practitioners. One academic",
  faq: {
    metaTag: "MSP Questions",
    headline: "Six common questions",
    items: [
      { tag: "Fit", q: "Does this work for SMB MSPs vs upmarket MSSPs?", a: "Both. SMB MSPs benefit most from systematic cross-sell. Upmarket MSSPs benefit most from QBR-driven expansion and account-level whitespace mapping." },
      { tag: "Stack", q: "How does this fit with our PSA/RMM (ConnectWise, Datto, NinjaOne)?", a: "The framework sits on top. We ingest from your PSA and add signal capture and cadence. We do not replace your PSA or RMM." },
      { tag: "Timing", q: "How long does implementation take?", a: "90 days from data ingestion to first expanded account. Most firms see their first expansion conversation within 2 weeks of the initial outreach round." },
      { tag: "Economics", q: "How does this fit with our existing comp plan?", a: "The framework respects existing comp structures. Expanded accounts route to the original AE / vCIO of record by default." },
      { tag: "Channel", q: "Does this conflict with vendor MDF or co-sell motions?", a: "No. The framework operates inside the firm's own systems and complements vendor co-sell - most firms run both in parallel." },
      { tag: "Privacy", q: "Can my firm participate confidentially?", a: "Yes. Participation defaults to anonymous benchmarking. Named cases are opt-in only." },
    ],
  },
  begin: {
    headline: "Your next contract already runs your stack",
    ctaLabel: "Add Your Firm",
  },
};

export const advisory: VerticalConfig = {
  slug: "advisory",
  shortLabel: "Advisory",
  pageTitle: "Financial Advisory - AUM Growth Score | Mabbly",
  pageDescription:
    "AUM growth research for RIAs and wealth advisors. 500 practitioner interviews. Score your firm in 10 minutes.",
  hero: {
    eyebrow: "AUM Growth Research / Financial Advisory",
    headlineLine1: "Your next client",
    headlineLine2: "already trusts you",
    lede: (
      <>
        The first research on <strong>AUM growth in independent advisory</strong>. 500 practitioner interviews.
        Designed to surface dormant prospects, referral networks, and benchmark organic growth capability.
      </>
    ),
  },
  profile: {
    eyebrowLabel: "AUM Growth Profile",
    firmName: "Anonymous · RIA 14",
    score: 53,
    tier: "Below Peer Median",
    msg: (
      <>
        A measurable organic growth gap. AUM expansion potential: <strong>$8M–$22M</strong> in next-12-month pipeline.
      </>
    ),
    bars: [
      { label: "Referral Activation", w: 36, mark: 60 },
      { label: "Centers-of-Influence Velocity", w: 44, mark: 58 },
      { label: "Wallet-Share Discipline", w: 51, mark: 55 },
    ],
  },
  numbers: {
    metaTag: "The Organic Growth Gap",
    headline: "Independent advisory in numbers",
    sub: "A $128T market. 15K+ RIA firms. The biggest moat is referral - most firms have no referral cadence.",
    heroStat: {
      label: "US Wealth AUM · 2024",
      num: <>$128<span className="unit">T</span></>,
      sub: (
        <>
          Total addressable wealth in the US. Independent advisors capture only a fraction -{" "}
          <strong>organic growth from referrals is the lever</strong> nobody is systematizing.
        </>
      ),
      source: "Cerulli Associates 2024 · 7.8% AUM Growth",
    },
    smallStats: [
      { label: "US RIA Firms", num: { type: "count", target: 15, format: "suffix-k" }, source: "Cerulli 2024", viz: "density" },
      { label: "RIAs · $5M–$100M AUM Tier", num: { type: "count", target: 2100, format: "number" }, source: "Cerulli 2024", viz: "bars" },
      { label: "Annual AUM Growth", num: { type: "count", target: 7.8, format: "pct-decimal" }, source: "Cerulli 2024", viz: "sparkline" },
    ],
  },
  reality: {
    metaTag: "Industry Dynamics",
    headline: "The advisory reality",
    sub: "Six numbers that explain why organic growth is the moat - and why most firms have no organic engine.",
    definitionTerm: "The Dead Zone",
    definitionBody:
      "Centers of influence you never followed up with. Referrals that stalled. Prospects who said 'not yet' two years ago. Former clients who left and never came back. The relationships every advisor knows by name and never re-engages.",
    cards: [
      { num: "01", stat: <>{"<"}5<span className="unit-sm">%</span></>, text: "Median annual organic growth at US RIAs.", source: "Schwab RIA Benchmarking" },
      { num: "02", stat: <>2–3<span className="unit-sm">x</span></>, text: "Top-quartile firms grow 2–3x the median organically.", source: "Cerulli 2024" },
      { num: "03", stat: <>70<span className="unit-sm">%</span></>, text: "Of new AUM at top firms comes from referrals.", source: "Cerulli 2024" },
      { num: "04", stat: <>{"<"}30<span className="unit-sm">%</span></>, text: "RIAs with formal referral cadence with COIs.", source: "Industry Research" },
      {
        num: "05",
        stat: (
          <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22, lineHeight: 1.1, letterSpacing: "-0.005em", fontWeight: 500 }}>
            "Ask for the referral."
          </span>
        ),
        text: "The whole industry's referral playbook in five words.",
        source: "The Manuscript",
      },
      { num: "06", stat: <>60–80<span className="unit-sm">%</span></>, text: "Of contacts in a typical advisory CRM are dormant.", source: "The Manuscript" },
    ],
  },
  breaks: {
    metaTag: "Where It Breaks",
    headline: "Where advisory growth breaks",
    blocks: [
      { num: "01", chart: "timeline", headline: "Prospects say 'not yet'. Then silence.", body: <>Most prospects who decline today are in-market in <strong>9–18 months</strong>. No system to know when to re-engage.</> },
      { num: "02", chart: "partnerWeek", headline: "Advisor time is the bottleneck.", body: <>Senior advisors spend <strong>under 2 hours a week</strong> on referral cultivation. The framework runs on signals, not calendars.</> },
      { num: "03", chart: "coldVsWarm", headline: "Cold campaigns destroy trust.", body: <>Templated newsletters are the opposite of fiduciary brand. Reply rates fall <strong>below 2%</strong>.</> },
      { num: "04", chart: "networkDensity", headline: "COIs decay silently.", body: <>Centers of influence - CPAs, attorneys, business owners - go quiet without a cadence. <strong>Hundreds of dormant referral relationships</strong> sit untouched.</> },
    ],
  },
  audit: {
    metaTag: "The Pain Audit",
    headline: "Six questions",
    sub: <>Click <strong>Yes</strong> or <strong>No</strong>. Two or more "yes" means you owe yourself the diagnostic.</>,
    questions: [
      "Have any 'not yet' prospects from 12+ months ago not been re-contacted?",
      "Did under 30% of new AUM come from referrals this year?",
      "Are there COIs (CPAs, attorneys) you haven't engaged in 6+ months?",
      "Is referral activity informal - no documented cadence?",
      "Are advisors spending under 5 hours a week on origination?",
      "Has the firm not added a new COI relationship in 12 months?",
    ],
    alertMessage: "Your firm has a measurable organic growth gap. Take the score.",
  },
  roadmap: {
    metaTag: "The 90-Day Path",
    headline: "From score to first new household",
    sub: <>Most firms see their first warm reply <strong>within 14 days</strong> of their first outreach round.</>,
    stops: [
      { day: "Day 0", label: "The Score", desc: "90 seconds to build. 10 minutes to read. Free." },
      { day: "Day 7", label: "AUM Growth Profile", desc: "Benchmarked against peer RIAs. Confidential." },
      { day: "Day 30", label: "Discovery", desc: "Where partnership begins. Run the framework with the team." },
      { day: "Day 90", label: "First Reactivation", desc: "Your first warm reply from a dormant prospect or COI." },
    ],
  },
  score: {
    metaTag: "The Organic Growth Score",
    headline: "Score your organic growth in 10 minutes",
    sub: "10 questions. Your AUM growth strategy benchmarked against peer RIAs. Most decisions within 48 hours.",
    ctaLabel: "Add Your Firm",
  },
  authorsHeadline: "Two practitioners. One academic",
  faq: {
    metaTag: "Advisory Firm Questions",
    headline: "Six common questions",
    items: [
      { tag: "Fit", q: "Does this work for RIAs vs hybrid / wirehouse breakaways?", a: "Both. RIAs benefit most from referral systematization. Breakaway teams benefit most from former-client and COI reactivation as the book transitions." },
      { tag: "Compliance", q: "What about SEC and state regulator compliance?", a: "Outreach is relationship-based and personalized, not solicitation. The framework operates inside firm-owned systems and respects Reg BI and fiduciary advertising rules. Always confirm with your CCO." },
      { tag: "Stack", q: "How does this fit with Wealthbox, Redtail, or Salesforce Financial Services Cloud?", a: "The framework sits on top of your existing CRM. We ingest contact and engagement data and add signal capture and cadence." },
      { tag: "Timing", q: "How long does implementation take?", a: "90 days from data ingestion to first new conversation. Most firms see their first warm response within 2 weeks of the initial outreach round." },
      { tag: "Economics", q: "How does this fit with advisor comp / book ownership?", a: "The framework respects book ownership and origination credit. Reactivated relationships route to the originating advisor by default." },
      { tag: "Privacy", q: "Can my firm participate confidentially?", a: "Yes. Participation defaults to anonymous benchmarking. Named cases are opt-in only." },
    ],
  },
  begin: {
    headline: "Your next client already trusts you",
    ctaLabel: "Add Your Firm",
  },
};

export const ae: VerticalConfig = {
  slug: "ae",
  shortLabel: "Architecture",
  pageTitle: "Architecture & Engineering - Win Rate Score | Mabbly",
  pageDescription:
    "Pursuit and origination research for A&E firms. 500 practitioner interviews. Score your firm in 10 minutes.",
  hero: {
    eyebrow: "Pursuit Research / Architecture & Engineering",
    headlineLine1: "Your next project",
    headlineLine2: "already met your team",
    lede: (
      <>
        The first research on <strong>pursuit strategy in architecture and engineering</strong>. 500 practitioner
        interviews. Designed to surface stalled pursuits, dormant clients, and benchmark go-no-go discipline.
      </>
    ),
  },
  profile: {
    eyebrowLabel: "Pursuit Profile",
    firmName: "Anonymous · A&E 06",
    score: 46,
    tier: "Below Peer Median",
    msg: (
      <>
        A measurable pursuit gap. Reactivation potential: <strong>$1.5M–$3.6M</strong> in next-12-month bookings.
      </>
    ),
    bars: [
      { label: "Stalled Pursuit Reactivation", w: 35, mark: 60 },
      { label: "Repeat-Client Velocity", w: 47, mark: 56 },
      { label: "Go/No-Go Discipline", w: 56, mark: 58 },
    ],
  },
  numbers: {
    metaTag: "The Pursuit Gap",
    headline: "A&E in numbers",
    sub: "A $420B industry. 110K firms. Pursuit cycles run 12–24 months. Most firms chase too many.",
    heroStat: {
      label: "US A&E Industry Revenue · 2024",
      num: <>$420<span className="unit">B</span></>,
      sub: (
        <>
          Architecture and engineering combined. Pursuit overhead is the unmeasured tax -{" "}
          <strong>most firms chase 3x more pursuits than they win</strong>.
        </>
      ),
      source: "ENR / ZweigWhite 2024 · 5.4% Annual Growth",
    },
    smallStats: [
      { label: "US A&E Firms", num: { type: "count", target: 110, format: "suffix-k" }, source: "ZweigWhite 2024", viz: "density" },
      { label: "Firms · $5M–$100M Revenue", num: { type: "count", target: 4500, format: "number" }, source: "ZweigWhite 2024", viz: "bars" },
      { label: "Annual Growth Rate", num: { type: "count", target: 5.4, format: "pct-decimal" }, source: "ZweigWhite 2024", viz: "sparkline" },
    ],
  },
  reality: {
    metaTag: "Industry Dynamics",
    headline: "The A&E reality",
    sub: "Six numbers that explain why low-discipline pursuit and dormant clients are a one-two punch on margin.",
    definitionTerm: "The Dead Zone",
    definitionBody:
      "Stalled pursuits. Lost RFPs. Past clients you have not heard from in years. The 80% of pursuits that should never have been chased and the 20% you forgot to follow up with after award.",
    cards: [
      { num: "01", stat: <>12–24<span className="unit-sm">mo</span></>, text: "Average pursuit cycle on $1M+ projects.", source: "Industry Average" },
      { num: "02", stat: <>20–35<span className="unit-sm">%</span></>, text: "Median win rate at midmarket A&E firms.", source: "ZweigWhite" },
      { num: "03", stat: <>60<span className="unit-sm">%+</span></>, text: "Of revenue at top firms is repeat-client work.", source: "Industry Research" },
      { num: "04", stat: <>3<span className="unit-sm">x</span></>, text: "Median firm chases 3x more pursuits than they win.", source: "Industry Research" },
      {
        num: "05",
        stat: (
          <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22, lineHeight: 1.1, letterSpacing: "-0.005em", fontWeight: 500 }}>
            No go/no-go gate.
          </span>
        ),
        text: "Most firms have no formal go/no-go discipline.",
        source: "The Manuscript",
      },
      { num: "06", stat: <>60–80<span className="unit-sm">%</span></>, text: "Of contacts in a typical A&E CRM are dormant.", source: "The Manuscript" },
    ],
  },
  breaks: {
    metaTag: "Where It Breaks",
    headline: "Where A&E pursuit breaks",
    blocks: [
      { num: "01", chart: "timeline", headline: "Pursuits stall in the procurement maze.", body: <>Average $1M+ pursuit goes silent <strong>9 to 18 months</strong> at procurement. No system to know when to re-engage.</> },
      { num: "02", chart: "partnerWeek", headline: "Principal time funds the pursuit tax.", body: <>Principals spend <strong>2 hours a week</strong> on origination - and most of that on chase pursuits the firm shouldn't pursue.</> },
      { num: "03", chart: "coldVsWarm", headline: "Generic SOQs lose to repeat-client wins.", body: <>Cold SOQ submissions win <strong>under 10%</strong>. Repeat-client engagements win 60%+. The math is brutal.</> },
      { num: "04", chart: "networkDensity", headline: "Past clients go silent.", body: <>Hundreds of past clients sit unsignalled - every one a potential <strong>repeat-client engagement</strong> with 60%+ win rates.</> },
    ],
  },
  audit: {
    metaTag: "The Pain Audit",
    headline: "Six questions",
    sub: <>Click <strong>Yes</strong> or <strong>No</strong>. Two or more "yes" means you owe yourself the diagnostic.</>,
    questions: [
      "Are pursuits chasing 3x more RFPs than the firm wins?",
      "Have any past clients not heard from you in 12+ months?",
      "Is go/no-go discipline informal or principal-by-principal?",
      "Did under 30% of new bookings come from repeat clients this year?",
      "Are principals spending more time on cold pursuits than client cultivation?",
      "Have any stalled pursuits gone silent past 6 months without re-engagement?",
    ],
    alertMessage: "Your firm has a measurable pursuit gap. Take the score.",
  },
  roadmap: {
    metaTag: "The 90-Day Path",
    headline: "From score to first reactivated client",
    sub: <>Most firms see their first warm reply <strong>within 14 days</strong> of their first outreach round.</>,
    stops: [
      { day: "Day 0", label: "The Score", desc: "90 seconds to build. 10 minutes to read. Free." },
      { day: "Day 7", label: "Pursuit Profile", desc: "Benchmarked against peer A&E firms. Confidential." },
      { day: "Day 30", label: "Discovery", desc: "Where partnership begins. Run the framework with the team." },
      { day: "Day 90", label: "First Reactivation", desc: "Your first warm reply from a past or stalled client." },
    ],
  },
  score: {
    metaTag: "The Pursuit Score",
    headline: "Score your pursuit strategy in 10 minutes",
    sub: "10 questions. Your pursuit and origination strategy benchmarked against peer A&E firms. Most decisions within 48 hours.",
    ctaLabel: "Add Your Firm",
  },
  authorsHeadline: "Two practitioners. One academic",
  faq: {
    metaTag: "A&E Firm Questions",
    headline: "Six common questions",
    items: [
      { tag: "Fit", q: "Does this work for architecture vs civil/MEP engineering?", a: "Both. The pursuit math and dormant-client pattern are universal. We adapt cadence to project type and procurement cycle." },
      { tag: "Stack", q: "How does this fit with Deltek Vantagepoint or Unanet?", a: "The framework sits on top. We ingest from your project ERP and CRM and add signal capture and cadence." },
      { tag: "Sector", q: "Public sector vs private?", a: "Public-sector pursuits benefit most from go/no-go discipline. Private benefit most from repeat-client cadence. The framework adapts to both." },
      { tag: "Timing", q: "How long does implementation take?", a: "90 days from data ingestion to first reactivated client. Most firms see their first warm response within 2 weeks of the initial outreach round." },
      { tag: "Economics", q: "How does this fit with principal origination credit?", a: "The framework respects principal origination and project-of-record. Reactivated relationships route to the originating principal by default." },
      { tag: "Privacy", q: "Can my firm participate confidentially?", a: "Yes. Participation defaults to anonymous benchmarking. Named cases are opt-in only." },
    ],
  },
  begin: {
    headline: "Your next project already met your team",
    ctaLabel: "Add Your Firm",
  },
};

export const recruiting: VerticalConfig = {
  slug: "recruiting",
  shortLabel: "Executive Search",
  pageTitle: "Executive Search - Mandate Velocity Score | Mabbly",
  pageDescription:
    "Mandate velocity research for executive search firms. 500 practitioner interviews. Score your firm in 10 minutes.",
  hero: {
    eyebrow: "Mandate Research / Executive Search",
    headlineLine1: "Your next mandate",
    headlineLine2: "already placed with you",
    lede: (
      <>
        The first research on <strong>mandate velocity in executive search</strong>. 500 practitioner interviews.
        Designed to surface dormant search clients, candidate networks, and benchmark partner pipeline depth.
      </>
    ),
  },
  profile: {
    eyebrowLabel: "Mandate Profile",
    firmName: "Anonymous · ESF 03",
    score: 50,
    tier: "Below Peer Median",
    msg: (
      <>
        A measurable mandate gap. Repeat-client potential: <strong>$0.4M–$1.1M</strong> in next-12-month fees.
      </>
    ),
    bars: [
      { label: "Repeat-Client Activation", w: 38, mark: 62 },
      { label: "Placement-to-Placement Velocity", w: 45, mark: 58 },
      { label: "Candidate-to-Client Conversion", w: 49, mark: 56 },
    ],
  },
  numbers: {
    metaTag: "The Mandate Gap",
    headline: "Executive search in numbers",
    sub: "A $22B industry. 12K+ firms. The biggest moat is the candidate-to-client flywheel - most firms break it after each placement.",
    heroStat: {
      label: "US Executive Search Revenue · 2024",
      num: <>$22<span className="unit">B</span></>,
      sub: (
        <>
          The TAM is small but the LTV per client is enormous. <strong>Repeat clients drive most fee revenue</strong> -
          and most firms have no post-placement cadence.
        </>
      ),
      source: "AESC 2024 · 6.3% Annual Growth",
    },
    smallStats: [
      { label: "US Executive Search Firms", num: { type: "count", target: 12, format: "suffix-k" }, source: "AESC 2024", viz: "density" },
      { label: "Firms · $5M–$100M Revenue", num: { type: "count", target: 1400, format: "number" }, source: "AESC 2024", viz: "bars" },
      { label: "Annual Growth Rate", num: { type: "count", target: 6.3, format: "pct-decimal" }, source: "AESC 2024", viz: "sparkline" },
    ],
  },
  reality: {
    metaTag: "Industry Dynamics",
    headline: "The executive search reality",
    sub: "Six numbers that explain why placements are point events and the relationship is the asset.",
    definitionTerm: "The Dead Zone",
    definitionBody:
      "Past placements who never re-engaged. Stalled retainers. Candidates you placed who became hiring executives years later - and never came back to you. The flywheel that breaks every time a placement closes.",
    cards: [
      { num: "01", stat: <>60<span className="unit-sm">%+</span></>, text: "Of fees at top retained firms come from repeat clients.", source: "AESC" },
      { num: "02", stat: <>3–6<span className="unit-sm">mo</span></>, text: "Average mandate cycle for VP+ retained search.", source: "Industry Average" },
      { num: "03", stat: <>{"<"}2<span className="unit-sm">x/yr</span></>, text: "Median touch frequency with past placements.", source: "Industry Research" },
      { num: "04", stat: <>5–10<span className="unit-sm">yr</span></>, text: "A candidate placed today is the buyer in 5–10 years.", source: "Industry Average" },
      {
        num: "05",
        stat: (
          <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22, lineHeight: 1.1, letterSpacing: "-0.005em", fontWeight: 500 }}>
            One placement, then silence.
          </span>
        ),
        text: "The default post-placement cadence at most firms.",
        source: "The Manuscript",
      },
      { num: "06", stat: <>60–80<span className="unit-sm">%</span></>, text: "Of contacts in a typical search firm CRM are dormant.", source: "The Manuscript" },
    ],
  },
  breaks: {
    metaTag: "Where It Breaks",
    headline: "Where mandate velocity breaks",
    blocks: [
      { num: "01", chart: "timeline", headline: "Placements close. Then silence.", body: <>Most firms have <strong>no post-placement cadence</strong>. The placed exec moves on, becomes the hiring buyer in 5 years, and goes elsewhere.</> },
      { num: "02", chart: "partnerWeek", headline: "Partner time goes to active mandates only.", body: <>Partners spend <strong>under 2 hours a week</strong> on relationship cultivation. Active mandates eat the rest. The flywheel breaks at every closeout.</> },
      { num: "03", chart: "coldVsWarm", headline: "Cold BD lags candidate-network BD.", body: <>Cold prospecting wins <strong>below 2%</strong>. Past-placement and candidate-turned-buyer networks convert at 25–40%.</> },
      { num: "04", chart: "networkDensity", headline: "The candidate network is the moat. The candidate network decays.", body: <>Hundreds of past placements and candidates sit silent - each one a potential <strong>retained mandate</strong> in 5 years if signaled correctly.</> },
    ],
  },
  audit: {
    metaTag: "The Pain Audit",
    headline: "Six questions",
    sub: <>Click <strong>Yes</strong> or <strong>No</strong>. Two or more "yes" means you owe yourself the diagnostic.</>,
    questions: [
      "Have any past placements not heard from you in 12+ months?",
      "Did under 30% of new mandates come from repeat clients this year?",
      "Is post-placement cadence informal or partner-by-partner?",
      "Are candidates falling out of the network after a single touchpoint?",
      "Are partners spending under 5 hours a week on relationship cultivation?",
      "Have past candidates become hiring buyers without a follow-up from your firm?",
    ],
    alertMessage: "Your firm has a measurable mandate gap. Take the score.",
  },
  roadmap: {
    metaTag: "The 90-Day Path",
    headline: "From score to first repeat mandate",
    sub: <>Most firms see their first warm reply <strong>within 14 days</strong> of their first outreach round.</>,
    stops: [
      { day: "Day 0", label: "The Score", desc: "90 seconds to build. 10 minutes to read. Free." },
      { day: "Day 7", label: "Mandate Profile", desc: "Benchmarked against peer search firms. Confidential." },
      { day: "Day 30", label: "Discovery", desc: "Where partnership begins. Run the framework with the team." },
      { day: "Day 90", label: "First Repeat Mandate", desc: "Your first new search from a past placement or candidate-turned-buyer." },
    ],
  },
  score: {
    metaTag: "The Mandate Velocity Score",
    headline: "Score your mandate velocity in 10 minutes",
    sub: "10 questions. Your mandate strategy benchmarked against peer executive search firms. Most decisions within 48 hours.",
    ctaLabel: "Add Your Firm",
  },
  authorsHeadline: "Two practitioners. One academic",
  faq: {
    metaTag: "Search Firm Questions",
    headline: "Six common questions",
    items: [
      { tag: "Fit", q: "Does this work for retained vs contingent search?", a: "Both. Retained firms benefit most from repeat-client cadence. Contingent firms benefit most from candidate-to-client flywheel activation." },
      { tag: "Stack", q: "How does this fit with our ATS / CRM (Bullhorn, Invenias)?", a: "The framework sits on top. We ingest from your ATS and CRM and add signal capture and cadence." },
      { tag: "Function", q: "Does this work across industries / functions?", a: "Yes. The dormant-relationship pattern is universal. We adapt cadence to function (CXO vs VP) and sector." },
      { tag: "Timing", q: "How long does implementation take?", a: "90 days from data ingestion to first reactivated mandate. Most firms see their first warm response within 2 weeks of the initial outreach round." },
      { tag: "Economics", q: "How does this fit with our partner economics?", a: "The framework respects partner origination credit and book ownership. Repeat mandates route to the originating partner by default." },
      { tag: "Privacy", q: "Can my firm participate confidentially?", a: "Yes. Participation defaults to anonymous benchmarking. Named cases are opt-in only." },
    ],
  },
  begin: {
    headline: "Your next mandate already placed with you",
    ctaLabel: "Add Your Firm",
  },
};

export const agency: VerticalConfig = {
  slug: "agency",
  shortLabel: "Marketing",
  pageTitle: "Marketing Agencies - New Business Score | Mabbly",
  pageDescription:
    "New business research for marketing agencies. 500 practitioner interviews. Score your firm in 10 minutes.",
  hero: {
    eyebrow: "New Business Research / Marketing Agencies",
    headlineLine1: "Your next account",
    headlineLine2: "already worked with you",
    lede: (
      <>
        The first research on <strong>new business in independent agencies</strong>. 500 practitioner interviews.
        Designed to surface dormant clients, lost pitches, and benchmark new-business velocity.
      </>
    ),
  },
  profile: {
    eyebrowLabel: "New Business Profile",
    firmName: "Anonymous · AGY 11",
    score: 48,
    tier: "Below Peer Median",
    msg: (
      <>
        A measurable new-business gap. Reactivation potential: <strong>$0.7M–$1.8M</strong> in next-12-month retainer.
      </>
    ),
    bars: [
      { label: "Lost-Pitch Reactivation", w: 34, mark: 58 },
      { label: "Past-Client Velocity", w: 43, mark: 60 },
      { label: "Pitch-to-Retainer Discipline", w: 54, mark: 56 },
    ],
  },
  numbers: {
    metaTag: "The New Business Gap",
    headline: "Agency new business in numbers",
    sub: "A $275B industry. 60K+ agencies. The pitch tax is real - most agencies pitch 4x more than they win.",
    heroStat: {
      label: "US Agency Revenue · 2024",
      num: <>$275<span className="unit">B</span></>,
      sub: (
        <>
          The TAM is enormous. The pitch tax is the unmeasured cost -{" "}
          <strong>most agencies spend more on pitching than reactivating past clients</strong>.
        </>
      ),
      source: "AdAge / Provoke Insights 2024 · 6.8% Annual Growth",
    },
    smallStats: [
      { label: "US Marketing Agencies", num: { type: "count", target: 60, format: "suffix-k" }, source: "AdAge 2024", viz: "density" },
      { label: "Agencies · $5M–$100M Revenue", num: { type: "count", target: 4800, format: "number" }, source: "Provoke Insights", viz: "bars" },
      { label: "Annual Growth Rate", num: { type: "count", target: 6.8, format: "pct-decimal" }, source: "Provoke Insights", viz: "sparkline" },
    ],
  },
  reality: {
    metaTag: "Industry Dynamics",
    headline: "The agency reality",
    sub: "Six numbers that explain why pitching for new accounts is the most expensive way to grow.",
    definitionTerm: "The Dead Zone",
    definitionBody:
      "Lost pitches that went silent at the second-place finish. Past clients whose project closed and never came back. Marketers you used to work with who moved to a new role and never re-engaged. The pipeline that decayed at every roster change.",
    cards: [
      { num: "01", stat: <>4<span className="unit-sm">x</span></>, text: "Median pitch volume vs wins at independent agencies.", source: "Provoke Insights" },
      { num: "02", stat: <>50<span className="unit-sm">%+</span></>, text: "Of revenue at top firms is repeat or referral.", source: "Industry Research" },
      { num: "03", stat: <>18–24<span className="unit-sm">mo</span></>, text: "Average client tenure at midmarket independents.", source: "RSW/US AgencyNew Business" },
      { num: "04", stat: <>{"<"}10<span className="unit-sm">%</span></>, text: "Pitch win rate at most agencies - including the silent loss tax.", source: "RSW/US" },
      {
        num: "05",
        stat: (
          <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22, lineHeight: 1.1, letterSpacing: "-0.005em", fontWeight: 500 }}>
            "We'll keep you in mind."
          </span>
        ),
        text: "The end of every lost pitch. Then nothing happens.",
        source: "The Manuscript",
      },
      { num: "06", stat: <>60–80<span className="unit-sm">%</span></>, text: "Of contacts in a typical agency CRM are dormant.", source: "The Manuscript" },
    ],
  },
  breaks: {
    metaTag: "Where It Breaks",
    headline: "Where agency new business breaks",
    blocks: [
      { num: "01", chart: "timeline", headline: "Pitches lose. Then silence.", body: <>Most agencies <strong>never re-engage second-place pitches</strong>. The marketer remembers the work; the agency never calls again.</> },
      { num: "02", chart: "partnerWeek", headline: "Founder time funds the pitch tax.", body: <>Founders spend <strong>2 hours a week</strong> on new business - and most of that on pitches the agency shouldn't be in.</> },
      { num: "03", chart: "coldVsWarm", headline: "Cold prospecting beats lost-pitch reactivation budget.", body: <>Most agencies invest more in cold prospecting than reactivating past clients. <strong>Reactivation CAC is 5x cheaper</strong>.</> },
      { num: "04", chart: "networkDensity", headline: "The marketer network decays at every roster change.", body: <>Marketers you used to work with move every 18–24 months. Without a cadence, <strong>the relationship disappears</strong> with the role change.</> },
    ],
  },
  audit: {
    metaTag: "The Pain Audit",
    headline: "Six questions",
    sub: <>Click <strong>Yes</strong> or <strong>No</strong>. Two or more "yes" means you owe yourself the diagnostic.</>,
    questions: [
      "Are pitches running at 4x or higher pitch-to-win volume?",
      "Have any past clients not heard from you in 12+ months?",
      "Did under 30% of new revenue come from past clients or referrals this year?",
      "Are second-place pitch finishes typically not re-engaged?",
      "Have any marketers you worked with moved roles without a follow-up from your team?",
      "Is the agency spending more on cold prospecting than past-client reactivation?",
    ],
    alertMessage: "Your firm has a measurable new business gap. Take the score.",
  },
  roadmap: {
    metaTag: "The 90-Day Path",
    headline: "From score to first reactivated client",
    sub: <>Most agencies see their first warm reply <strong>within 14 days</strong> of their first outreach round.</>,
    stops: [
      { day: "Day 0", label: "The Score", desc: "90 seconds to build. 10 minutes to read. Free." },
      { day: "Day 7", label: "New Business Profile", desc: "Benchmarked against peer agencies. Confidential." },
      { day: "Day 30", label: "Discovery", desc: "Where partnership begins. Run the framework with the team." },
      { day: "Day 90", label: "First Reactivation", desc: "Your first warm reply from a past client or lost pitch." },
    ],
  },
  score: {
    metaTag: "The New Business Score",
    headline: "Score your new business strategy in 10 minutes",
    sub: "10 questions. Your new business strategy benchmarked against peer marketing agencies. Most decisions within 48 hours.",
    ctaLabel: "Add Your Firm",
  },
  authorsHeadline: "Two practitioners. One academic",
  faq: {
    metaTag: "Agency Questions",
    headline: "Six common questions",
    items: [
      { tag: "Fit", q: "Does this work for full-service vs specialist agencies?", a: "Both. Full-service agencies benefit most from cross-discipline expansion. Specialists benefit most from past-client reactivation as marketers move roles." },
      { tag: "Stack", q: "How does this fit with HubSpot, Salesforce, or our project management stack?", a: "The framework sits on top. We ingest from your CRM and PM tool and add signal capture and cadence." },
      { tag: "Discipline", q: "Does this work for performance vs brand vs creative shops?", a: "Yes. The dormant-marketer pattern is universal. We adapt cadence to discipline and engagement type." },
      { tag: "Timing", q: "How long does implementation take?", a: "90 days from data ingestion to first reactivated client. Most agencies see their first warm response within 2 weeks of the initial outreach round." },
      { tag: "Economics", q: "How does this fit with our existing new-business comp?", a: "The framework respects existing comp structures. Reactivated relationships route to the originating account lead by default." },
      { tag: "Privacy", q: "Can my firm participate confidentially?", a: "Yes. Participation defaults to anonymous benchmarking. Named cases are opt-in only." },
    ],
  },
  begin: {
    headline: "Your next account already worked with you",
    ctaLabel: "Add Your Firm",
  },
};
