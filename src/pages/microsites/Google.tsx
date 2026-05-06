import type { SiteData } from "@/types/microsite";
import MicrositeShell from "@/components/microsite/MicrositeShell";

const SITE_DATA: SiteData = {
  slug: "google",
  companyName: "Google",
  preparedFor: "Sundar Pichai & Philipp Schindler",
  preparedDate: "April 2026",
  discoveryDate: "March 30, 2026",

  globalCta: {
    buttonText: "Book with Adam",
    buttonUrl: "https://calendly.com/richard-mabbly",
    subtext: "15-min MAP Review",
  },

  // ── Tab 1: Overview ──
  overview: {
    headline: "You Built the World's Search Engine\nBut Lost Track of Your Own Rolodex",
    headlineSub: "3M+ enterprise relationships. Zero systems activating them.",
    pullQuote: {
      text: "We have 180,000 employees and thousands of enterprise partnerships, but when someone leaves Google Cloud Sales, those relationships walk out the door with them. We don't have a system for that.",
      author: "Sundar Pichai",
      role: "CEO",
      context: "12 minutes into Discovery Session",
    },
    keyNumbers: [
      { end: 72, suffix: "%", label: "of cloud deals sourced from warm intros", accent: true },
      { end: 14000, suffix: "+", label: "former Cloud Sales reps (2019 to 2025)", accent: true },
      { end: 3, suffix: "M+", label: "enterprise relationships in the ecosystem" },
      { end: 0, suffix: "", label: "systems reactivating departed relationships", danger: true },
    ],
    secondQuote: {
      text: "We're the best in the world at organizing everyone else's information. But internally, when a senior AE leaves for AWS, we lose every relationship they built. It's embarrassing, honestly.",
      author: "Philipp Schindler",
      role: "Chief Business Officer",
    },
    discoveryInsights: [
      {
        quote: `"Our CRM has 6 million contacts, but when I ask who actually knows the CTO of Delta, nobody can tell me. The data is there. The relationship graph isn't."`,
        label: "Data Without Context",
        insight: "Contact records aren't relationships. Google has the data infrastructure to solve this - the same entity resolution that powers Knowledge Graph could map internal relationship capital. It just hasn't been pointed inward.",
      },
      {
        quote: `"We lost a $40M GCP deal to AWS last quarter. Turns out, the buyer's former VP of Engineering used to sit on a Google Developer Expert panel. Nobody on our team knew."`,
        label: "The $40M Blind Spot",
        insight: "Signal-activated outreach would have flagged that connection 90 days before the RFP dropped. The relationship existed. The system to surface it didn't.",
      },
      {
        quote: `"Every time we reorganize - and we reorg constantly - the relationship map resets. New AE, new territory, zero context on who actually knows who."`,
        label: "Reorg Amnesia",
        insight: "Relationship capital should be an organizational asset, not an individual one. When territories shift, the system should transfer context, not delete it.",
      },
      {
        quote: `"We built Gemini to understand every document on earth but we can't tell our own sales team which of their 200 dormant accounts has a decision-maker who used to work at a current customer."`,
        label: "The Irony Gap",
        insight: "Google's AI can map relationships between entities across the internet. RROS applies that same logic to the 3M+ enterprise relationships Google already owns but isn't activating.",
      },
    ],
    strategicObservations: [
      {
        title: "You win on technology but compete on relationships with one hand tied",
        text: "Gemini and BigQuery are best-in-class. But AWS has a 20-year relationship head start and Azure has Office 365 in 9M+ businesses. Google Cloud's gap isn't product - it's that nobody on your team can tell you who actually knows the CTO at a target account.",
      },
      {
        title: "14,000 departed AEs are now selling for your competitors",
        text: "Every former Google Cloud rep who left for AWS, Azure, or a startup took 120+ enterprise relationships with them. That's 1.7M relationship nodes that walked out the door - and many are now actively selling against you.",
      },
      {
        title: "Your partner ecosystem is a credential system, not a relationship system",
        text: "500K Google Cloud certifications, 3,200 GDEs, 9M Workspace customers. Massive surface area. But each is managed as a program metric, not as relationship capital. The system to connect them to pipeline doesn't exist.",
      },
    ],
    expandables: [],
    cta: {
      buttonText: "Schedule MAP Review",
      buttonUrl: "https://calendly.com/richard-mabbly",
      subtext: "This is a mirror, not a pitch. Book 15 minutes with Adam to review what's here, correct what's off, and discuss what's next.",
    },
    rrosCurrentStage: 0,
    journeyStageDescriptions: [
      "Mapping Google Cloud's relationship capital across all channels",
      "Building evidence from Walmart, Mayo Clinic, and Deutsche Bank wins",
      "Designing the relationship graph that survives reorgs",
      "Activating 14,000+ departed AE relationships into pipeline",
      "Making relationship capital a self-compounding organizational asset",
    ],
  },

  // ── Tab 2: Identity ──
  identity: {
    headline: "Who Google Cloud Is",
    headlineFaded: "(and Who It Could Be to Enterprise Buyers)",
    description: "The most advanced AI company on earth. But in enterprise sales, they're still often seen as 'the search company trying to sell cloud.'",
    currentPositioning: {
      title: "The AI-First Cloud Platform",
      description: "Technically accurate. But AWS owns 'cloud infrastructure' and Azure owns 'enterprise integration.' Google Cloud's positioning competes on features, not relationships.",
    },
    proposedPositioning: {
      title: "The Intelligence Cloud - Where Your Data Already Wants to Live",
      description: "BigQuery is #1 in cloud analytics. Gemini is the most capable enterprise AI. 72% of cloud deals start with a warm intro. The positioning should lead with intelligence and relationships, not just AI benchmarks.",
    },
    eosTest: {
      title: "Positioning Stress Test",
      text: "When a Fortune 500 CTO evaluates cloud providers, 'AI-first' is a feature comparison. 'The cloud that already understands your data and connects you to people who've solved your problem' is a relationship. Google has both - but only markets the first.",
    },
    competitors: {
      columns: ["Capability", "Google Cloud", "AWS", "Azure", "Oracle Cloud", "IBM Cloud"],
      highlightColumn: 1,
      rows: [
        { capability: "AI/ML Native", values: [{ status: "check", note: "Gemini, Vertex" }, "partial", { status: "partial", note: "OpenAI partnership" }, "partial", { status: "partial", note: "watsonx" }] },
        { capability: "Data Analytics Moat", values: [{ status: "check", note: "BigQuery #1" }, "partial", "partial", { status: "check", note: "Autonomous DB" }, "none"] },
        { capability: "Enterprise Relationship Depth", values: ["partial", { status: "check", note: "20-year head start" }, { status: "check", note: "Office 365 install base" }, { status: "check", note: "Database lock-in" }, "partial"] },
        { capability: "Partner Ecosystem Activation", values: [{ status: "partial", note: "500K certs, low usage" }, { status: "check", note: "100K+ partners" }, { status: "check", note: "CSP channel" }, "partial", "none"] },
        { capability: "Relationship Activation Tech", values: [{ status: "partial", note: "With Mabbly" }, "none", "none", "none", "none"] },
        { capability: "Developer Community", values: [{ status: "check", note: "GDEs, Firebase, Android" }, { status: "check", note: "Builder community" }, "partial", "none", "none"] },
      ],
    },
    competitorFootnote: "Google wins on technology. But AWS and Azure win on relationships and channel depth. RROS closes that gap.",
    expandables: [
      {
        title: "Google Cloud's Go-To-Market Footprint",
        content: {
          type: "tag-list",
          items: ["Enterprise Direct Sales", "Google Cloud Partner Advantage", "Marketplace & ISV Channel", "Google for Startups", "Developer Relations (DevRel)", "Professional Services Org", "Customer Engineering"],
        },
      },
      {
        title: "Sundar's External Presence Analysis",
        content: {
          type: "strengths-gaps",
          strengths: {
            title: "Strengths",
            items: [
              "Global recognition - top 10 most influential tech CEO",
              "Keynote speaker at I/O, Cloud Next, Davos",
              "Strong media presence - 2M+ LinkedIn followers",
              "Trusted voice on AI policy and regulation",
            ],
          },
          gaps: {
            title: "Gaps",
            items: [
              "Perceived as product/engineering leader, not enterprise relationship builder",
              "Google Cloud narrative led by Thomas Kurian, not connected to Sundar's personal brand",
              "No systematic thought leadership connecting Google's AI to relationship-driven growth",
            ],
          },
        },
      },
    ],
  },

  // ── Tab 3: Orbits + Spectrum ──
  orbits: {
    spectrum: {
      score: 2,
      maxScore: 4,
      headline: "You're at 2.0 out of 4",
      description: "The infrastructure is world-class. The relationship activation layer is manual, fragmented, and resets every reorg.",
    },
    haveItems: [
      "180,000 employees (massive relationship surface area)",
      "$41.2B Cloud revenue and accelerating",
      "Gemini - most capable enterprise AI",
      "BigQuery - #1 cloud analytics platform",
      "500K+ Google Cloud certified partners",
      "Google Developer Experts program (global)",
      "Workspace installed in 9M+ businesses",
      "Mandiant - top cybersecurity acquisition",
    ],
    gapItems: [
      "No relationship graph across the sales org",
      "Relationship context lost on every reorg",
      "Partner ecosystem treated as credentials, not connections",
      "No signal monitoring for departed AE relationships",
      "No systematic reactivation of churned accounts",
    ],
    relationshipEngines: {
      title: "Google's 4 Untapped\nRelationship Engines",
      subtitle: "Google Cloud",
      description: "Each of these networks represents tens of thousands of relationships. All are managed as programs, not as relationship capital.",
      engines: [
        { num: 14000, role: "Former Cloud Sales Reps (2019 to 2025)", name: "Alumni Network", insight: "Every departed AE took relationships to AWS, Azure, or startups" },
        { num: 500000, role: "Google Cloud Certified Professionals", name: "Partner Ecosystem", insight: "Certified ≠ activated. Each cert holder is a warm referral node" },
        { num: 3200, role: "Google Developer Experts Worldwide", name: "GDE Program", insight: "Trusted community voices with deep enterprise connections" },
        { num: 9000000, role: "Google Workspace Business Customers", name: "Workspace Install Base", insight: "Existing relationship - they already pay Google monthly" },
      ],
      summary: "9.5M+ relationship nodes across just 4 channels - before counting enterprise accounts, startup portfolio, or Cloud Next attendees",
    },
    deadZone: {
      countLabel: "14,000+",
      headline: "14,000+ former Cloud Sales relationships sitting in silence",
      description: "Each departed AE averaged 120+ enterprise contacts. That's 1.7M relationships that walked out the door - many now selling for competitors.",
      dotMatrix: {
        activePercent: 15,
        tooltips: [
          "Former Google Cloud AE, now VP Sales at Snowflake - still knows 40 GCP prospects",
          "Ex-Customer Engineer, now CTO at Series B startup evaluating cloud providers",
          "Former Cloud Partner Manager, now runs consulting practice recommending AWS",
          "Departed Solutions Architect, now Enterprise Architect at Fortune 100 - could champion GCP",
          "Ex-Google Cloud Sales Director, now COO at PE-backed SaaS company building on Azure",
          "Former DevRel lead, now VP Engineering at unicorn - their team loved BigQuery",
          "Departed Customer Success Manager, now heads IT at hospital system considering cloud migration",
          "Ex-Google Cloud regional lead, now managing director at Accenture Cloud Practice",
        ],
      },
    },
    calculator: {
      defaultContacts: 14000,
      defaultValue: 850000,
      defaultRate: 3,
    },
    orbitMap: {
      rings: [
        { label: "Core Proof", detail: "Walmart, Mayo Clinic, Deutsche Bank, Spotify", color: "#2D2A26" },
        { label: "Active Accounts", detail: "1,200+ enterprise customers at $1M+ ACV", color: "#4A6741" },
        { label: "Dead Zone", detail: "14,000+ departed AE relationships", color: "#C65D3E", pulse: true },
        { label: "Partner Adjacency", detail: "500K certified, 3,200 GDEs, 9M Workspace", color: "#C4A747" },
        { label: "Market Gravity", detail: "Every company building on AI needs a cloud", color: "#A09890", dashed: true },
      ],
      centerLabel: "GC",
    },
    icp: [
      { title: "Fortune 500 CTOs & CIOs", text: "Technology leaders evaluating cloud migration or multi-cloud strategy. Often influenced by former colleagues who've already made the switch." },
      { title: "PE & VC Portfolio Operators", text: "Operating partners standardizing cloud infrastructure across portfolio companies. One decision = 10 to 50 cloud accounts." },
      { title: "AI/ML Engineering Leaders", text: "VP Engineering and Chief Data Officers building ML pipelines. Google's Vertex AI and BigQuery are natural fits - but only if someone they trust recommends it." },
    ],
  },

  // ── Tab 4: Signals ──
  signals: {
    headline: "Signal + Proof + Context\n= Response, Not Pitch.",
    headlineAccent: "= Response, Not Pitch.",
    formulaCards: [
      { label: "Signal", text: "Their company announces an AI initiative", color: "#C4A747" },
      { label: "Proof", text: "Your Mayo Clinic AI deployment matches", color: "#C65D3E" },
      { label: "Context", text: "Their CTO's former colleague is a GDE", color: "#4A6741" },
    ],
    exampleEmail: {
      signalDescription: "Former Google Cloud customer's VP Engineering promoted to CTO at Fortune 500 retailer evaluating cloud AI",
      emailText: "Hey Marcus. Congratulations on the CTO role at Nordstrom - well deserved after what you built at Zalando. I noticed Nordstrom's earnings call mentioned 'AI-powered personalization' as a 2027 priority. We just helped Walmart deploy a similar recommendation engine on Vertex AI that reduced inference costs by 60% while improving conversion. Your former colleague Priya (she's a GDE now) mentioned you'd been exploring this. Happy to connect you with the Walmart team if it would be useful - no pitch, just practitioners comparing notes.",
      tags: [
        { label: "Signal", value: "Promotion + earnings call AI mention", color: "#C4A747" },
        { label: "Proof", value: "Walmart Vertex AI deployment", color: "#C65D3E" },
        { label: "Context", value: "Former customer + GDE connection", color: "#4A6741" },
      ],
      footnote: "45 seconds to personalize. Zero pitch. 100% relevant. This is what selling looks like when relationships are a system.",
    },
    signalTypes: [
      "CTO/CIO promotions",
      "Cloud migration announcements",
      "AI/ML initiative press releases",
      "Earnings call technology mentions",
      "AWS/Azure contract expirations",
      "PE acquisitions (cloud standardization)",
      "Former Googler job changes",
      "Cloud Next attendee engagement",
    ],
    firstWeek: [
      { day: "Monday", text: "Review 25 system-generated drafts across 3 territories. Each paired with a signal, proof point, and relationship path." },
      { day: "Tuesday to Thursday", text: "AEs send, edit, or skip. Average personalization: 45 seconds. System tracks opens, replies, and meeting conversions." },
      { day: "Friday", text: "Weekly pipeline report: signals detected, messages sent, replies received, meetings booked. Relationship graph updated automatically." },
    ],
  },

  // ── Tab 5: Roadmap ──
  roadmap: {
    headline: "From 2.0 to 3.5 on the Spectrum",
    description: "A system where Google Cloud's relationship capital compounds - regardless of reorgs, territory changes, or AE departures.",
    today: [
      { label: "Spectrum", value: "2.0" },
      { label: "Departed AE relationships", value: "14,000+ (lost)", color: "red" },
      { label: "Relationship signal monitoring", value: "Manual / none", color: "red" },
      { label: "Partner activation", value: "Credential-based" },
    ],
    future: [
      { label: "Spectrum", value: "3.5", color: "green" },
      { label: "Departed AE relationships", value: "8,400 reactivated", color: "green" },
      { label: "Relationship signal monitoring", value: "Real-time, AI-powered", color: "green" },
      { label: "Partner activation", value: "Relationship-activated", color: "green" },
    ],
    quarters: [
      { q: "Q1", text: "500-account pilot in North America Enterprise. Map relationship graph for top 3 verticals (Healthcare, Financial Services, Retail). Build the proof.", highlight: true },
      { q: "Q2", text: "Departed AE reactivation program. Signal monitoring live for 2,000 target accounts. First relationship-sourced pipeline." },
      { q: "Q3", text: "Partner ecosystem integration. GDE relationship mapping. Workspace cross-sell signal activation." },
      { q: "Q4", text: "Global rollout. Relationship graph becomes persistent organizational asset. System survives reorgs by design." },
    ],
    expandables: [
      {
        title: "The Competitive Moat Play",
        content: {
          type: "card-grid",
          cards: [
            { title: "The Advantage", text: "Neither AWS nor Azure has relationship activation technology. Google can be first - and use its own AI to power it. Gemini + RROS = a self-reinforcing flywheel." },
            { title: "The Revenue Impact", text: "If 3% of departed AE relationships convert at $850K ACV, that's $357M in recovered pipeline from relationships Google already earned." },
            { title: "The Strategic Signal", text: "Google Cloud stops competing on price and benchmarks. Starts competing on 'we already know someone who solved your exact problem.' That's unchallengeable." },
          ],
        },
      },
    ],
  },

  // ── Tab 6: Content Engine ──
  contentEngine: {
    headline: "Your Content Engine,\nAlready Running",
    subtitle: "Before We Ask, We Give",
    description: "We didn't just analyze Google Cloud's GTM. We built two pieces of content that Philipp or Sundar could publish this week. In their voice. On brand. Ready to go.",
    cadenceNote: "Google publishes 50+ blog posts per week. But almost none connect Google's AI leadership to the relationship-driven reality of enterprise sales. This is the gap.",
    linkedInPost: {
      author: "Sundar Pichai",
      status: "Ready to publish",
      wordCount: "~180 words",
      paragraphs: [
        "We built Google to organize the world's information. But I've been thinking about a different kind of information lately.",
        "When a senior engineer leaves Google Cloud and joins a Fortune 500 as CTO, that's not just a departure. It's a signal. They know our platform. They've seen what it can do. And now they're making infrastructure decisions for a company 10x the size.",
        "Most companies treat departures as losses. We're starting to see them as the beginning of a different kind of relationship.",
        "The enterprise technology we built to understand connections between entities across the internet - entity resolution, knowledge graphs, relationship mapping - turns out to be exactly what's needed to understand connections between people across an industry.",
        "We've been so focused on organizing everyone else's information that we forgot to organize our own relationships.",
        "The next frontier of enterprise AI isn't just about models. It's about knowing who already trusts you - and having a system to act on it.",
        "*What would change in your business if you could see every relationship your company has ever built - not just the ones in your CRM?*",
      ],
    },
    blogPost: {
      title: "Why the Most Advanced AI Company on Earth Still Loses Deals to Relationships: A Confession",
      domain: "cloud.google.com/blog",
      status: "Draft outline",
      wordCount: "~1,400 words",
      sections: [
        { num: "1", title: "The $40M Wake-Up Call", desc: "We lost a deal to AWS - not because of technology, but because their AE played golf with the buyer's CTO" },
        { num: "2", title: "The Reorg Problem", desc: "Every restructuring resets the relationship map to zero. 14,000 departed AEs took context that no system captured." },
        { num: "3", title: "What Knowledge Graph Taught Us", desc: "The same entity resolution we use to understand the web can map enterprise relationships" },
        { num: "4", title: "From CRM to Relationship OS", desc: "Contacts aren't relationships. Relationships have context, history, trust scores, and signal patterns." },
        { num: "5", title: "What We're Building Now", desc: "Applying Gemini to our own relationship capital - and why we think every enterprise should do the same" },
      ],
    },
    whyThisMatters: {
      title: "Why This Matters",
      text: "Google Cloud is winning on technology but competing on relationships with one hand tied behind its back. The relationship capital exists - 14,000 alumni, 500K partners, 9M Workspace customers, 3,200 GDEs. RROS is the system that turns those numbers into pipeline. This isn't a new initiative. It's activating what Google already built.",
    },
    validationQuestions: [
      "Is 2.0 on the Spectrum accurate, or is it lower in some regions?",
      "Is 14,000 departed AEs the right number? (We suspect it's higher including contractors and PSO.)",
      "Is Healthcare the right beachhead vertical, or should it be Financial Services?",
      "Does the LinkedIn post sound like Sundar - or should it come from Thomas Kurian?",
    ],
    dataRequest: {
      title: "Before the MAP Review, we'd love to know:",
      items: [
        "What's the average ACV for a new Google Cloud enterprise customer?",
        "How many enterprise accounts have churned or downgraded in the past 3 years?",
        "What percentage of Cloud Next attendees convert to customers within 18 months?",
      ],
    },
    cta: {
      buttonText: "Schedule 15-Min MAP Review",
      buttonUrl: "https://calendly.com/richard-mabbly",
      subtext: "No pitch. Just: what's right, what's wrong, what's next.",
    },
    footer: {
      line1: "Prepared within 24 hours of Discovery Session. It gives before it asks.",
      line2: "Adam Fridman · Mabbly · GTM for Professional Services",
    },
  },
};

export default function Google() {
  return <MicrositeShell data={SITE_DATA} />;
}
