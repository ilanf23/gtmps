import type { SiteData } from "@/types/microsite";
import MicrositeShell from "@/components/microsite/MicrositeShell";

// ─── SITE DATA ───
// This is the only part that changes per microsite.
// Claude generates this from discovery session notes.

const SITE_DATA: SiteData = {
  slug: "pepper-group",
  companyName: "Pepper Group",
  preparedFor: "Tim Padgett & George Couris",
  preparedDate: "April 2026",
  discoveryDate: "March 28, 2026",

  globalCta: {
    buttonText: "Book with Adam",
    buttonUrl: "https://calendly.com/adam-fridman/30min",
    subtext: "15-min MAP Review",
  },

  // ── Tab 1: Overview ──
  overview: {
    headline: "Your Network Got\nPromoted Without You",
    headlineSub: "32 years of relationships. Zero systems activating them.",
    pullQuote: {
      text: "I happened to spend this weekend a few hours going through some of our dormant relationships. This is so weird that we're even talking today about this.",
      author: "Tim Padgett",
      role: "Founder",
      context: "8 minutes into Discovery Session",
    },
    keyNumbers: [
      { end: 80, suffix: "%", label: "revenue from existing network", accent: true },
      { end: 400, suffix: "+", label: "dormant relationships", accent: true },
      { end: 32, suffix: "", label: "years of relationships" },
      { end: 0, suffix: "", label: "systems activating them", danger: true },
    ],
    secondQuote: {
      text: "Everybody has all of these past contacts and connections, people that know you, yet all the focus is on let's go get new people.",
      author: "George Couris",
      role: "Partner/CEO",
    },
    discoveryInsights: [
      {
        quote: `"I'm finding those on LinkedIn. They were marketing coordinators when we knew them. They've now climbed the ladder."`,
        label: "Dead Zone Signal",
        insight: "Job change detection. The system catches this automatically and drafts a message before you open LinkedIn.",
      },
      {
        quote: `"This is our 32nd year. We've made many, many, many contacts. A lot of those past contacts would not be viable today."`,
        label: "Orbit Decay",
        insight: "Contacts don't die. They move orbits. The coordinator who isn't viable became the VP who is. The system tracks that migration.",
      },
      {
        quote: `"Everybody has all of these past contacts, people that know you, yet all the focus is on let's go get new people."`,
        label: "The Core Paradox",
        insight: "80% of PS revenue comes from relationships, but 0% of the tech stack is designed to activate them. George named the exact problem RROS solves.",
      },
      {
        quote: `"This is exactly what we've been talking about, but we don't have the technology mindset to do some of these things."`,
        label: "Spectrum Gap",
        insight: "The strategy exists (Revenue Tower). The discipline exists (EOS since 2012). What's missing is the activation layer between knowing people and generating revenue from those relationships.",
      },
    ],
    strategicObservations: [
      {
        title: "Your proof points don't match your positioning",
        text: "Revenue Tower is differentiated IP - Kensing became #1, BASF is a $200M win. But your positioning says 'Top B2B Agency,' which 10 other Chicago firms also claim. The evidence says something sharper.",
      },
      {
        title: "George's networks are an untapped goldmine",
        text: "AMA Chicago, DePaul, CEO Roundtable, Junto - 1,100+ relationships across 4 institutional engines. All managed as volunteer roles, none systematically activated for business development.",
      },
      {
        title: "The strategy and discipline exist. The activation layer doesn't.",
        text: "16 years of EOS. A proprietary framework. 95% retention. But zero technology connecting relationships to revenue. The gap isn't thinking - it's the system between knowing people and generating business from them.",
      },
    ],
    expandables: [],
    cta: {
      buttonText: "Schedule MAP Review",
      buttonUrl: "https://calendly.com/adam-fridman/30min",
      subtext: "This is a mirror, not a pitch. Book 15 minutes with Adam to review what's here, correct what's off, and discuss what's next.",
    },
    rrosCurrentStage: 0,
    journeyStageDescriptions: [
      "Understanding your market, relationships, and positioning gaps",
      "Building evidence-based proof points from your existing wins",
      "Designing the activation system for your dormant relationships",
      "Turning 400+ dormant contacts into active pipeline",
      "Making Revenue Tower + RROS a self-sustaining growth engine",
    ],
  },

  // ── Tab 2: Identity ──
  identity: {
    headline: "Who Pepper Group Is",
    headlineFaded: "(and Who It Could Be)",
    description: "32 years of proof. A proprietary framework. But the positioning doesn't match the evidence.",
    currentPositioning: {
      title: "Top B2B Marketing Agency",
      description: "Broad. Accurate. But shared by 10+ agencies in Chicago.",
    },
    proposedPositioning: {
      title: "The B2B Marketing OS for Manufacturers and PE Portcos",
      description: "Kensing became #1. Enviroserve PE-acquired. Schebler: 3 manufacturing companies. Recent $200M BASF carveout.",
    },
    eosTest: {
      title: "EOS Core Focus Test",
      text: "Core Focus = Niche + Passion. \"B2B marketing\" is too wide. \"Revenue systems for manufacturers scaling through PE\" is magnetic. 16 years of EOS discipline. The structure is already there.",
    },
    competitors: {
      columns: ["Capability", "Pepper Group", "Trefoil", "Walker Sands", "VisualFizz", "c|change"],
      highlightColumn: 1,
      rows: [
        { capability: "Proprietary IP", values: [{ status: "check", note: "Revenue Tower" }, "none", "none", "none", "none"] },
        { capability: "PE Portfolio Proof", values: [{ status: "check", note: "Kensing, BASF" }, "partial", "none", "none", "none"] },
        { capability: "Manufacturing Depth", values: [{ status: "check", note: "Schebler, Robertshaw" }, "partial", "none", "none", "none"] },
        { capability: "Thought Leadership Engine", values: ["partial", "none", { status: "check", note: "Strong" }, "partial", "none"] },
        { capability: "Relationship Activation Tech", values: [{ status: "partial", note: "With Mabbly" }, "none", "none", "none", "none"] },
        { capability: "EOS Discipline", values: [{ status: "check", note: "16 years" }, "none", "none", "none", "none"] },
      ],
    },
    competitorFootnote: "Revenue Tower is differentiated IP. But nobody outside your client base knows it exists.",
    expandables: [
      {
        title: "Full Service Footprint",
        content: {
          type: "tag-list",
          items: ["Strategy & Consulting", "Creative & Brand", "Digital Marketing", "Content Production", "Promotional & Events"],
        },
      },
      {
        title: "George's Digital Presence Analysis",
        content: {
          type: "strengths-gaps",
          strengths: {
            title: "Strengths",
            items: ["Authority Magazine feature", "CityBiz profile", "Booth MBA credential"],
          },
          gaps: {
            title: "Gaps",
            items: [
              "No Forbes or major publication bylines",
              "Sparse LinkedIn cadence (2–3/year vs. 2/month target)",
              "Buried insights - not accessible to prospects",
            ],
          },
        },
      },
    ],
  },

  // ── Tab 3: Orbits + Spectrum ──
  orbits: {
    spectrum: {
      score: 1.5,
      maxScore: 4,
      headline: "You're at 1.5 out of 4",
      description: "Not because the foundation is weak. Because the activation layer doesn't exist yet.",
    },
    haveItems: [
      "BtoB Top Agency",
      "Revenue Tower (proprietary IP)",
      "EOS since 2012",
      "95% client retention",
      "140+ GDUSA awards",
      "Booth MBA credential",
      "32 years of depth",
      "$200M BASF win",
    ],
    gapItems: [
      "No loaded CRM",
      "No signal monitoring",
      "No reactivation content",
      "No cadence system",
      "No migration data",
    ],
    relationshipEngines: {
      title: "George's 4 Institutional\nRelationship Engines",
      subtitle: "Pepper Group",
      description: "Each of these networks represents hundreds of relationships George has earned. None are being systematically activated.",
      engines: [
        { num: 500, role: "Past President", name: "AMA Chicago", insight: "Premier marketing network in Chicago" },
        { num: 300, role: "Advisory Council President", name: "DePaul University", insight: "Academic and alumni connections" },
        { num: 100, role: "Board Member", name: "CEO Roundtable Chicago", insight: "Peer CEO relationships" },
        { num: 200, role: "Team Mentor Since 2012", name: "Junto Institute", insight: "Founder and scaling-company network" },
      ],
      summary: "1,100+ estimated relationships across George's networks alone, before counting Tim's 32 years",
    },
    deadZone: {
      countLabel: "400+",
      headline: "400+ relationships sitting in silence",
      description: "And that's the conservative number. With George's networks, the real number is likely 1,500+.",
      dotMatrix: {
        activePercent: 20,
        tooltips: [
          "Former Schebler contact, now VP Ops at PE-backed manufacturer",
          "2019 proposal contact, promoted to CMO at industrial distributor",
          "AMA Chicago member, launched own B2B consultancy",
          "Junto cohort founder, scaling to $50M and needs marketing OS",
          "DeliverHealth contact, moved to healthcare PE operating partner role",
          "Ex-Kensing contact, now at competing manufacturer seeking agency",
          "Former conference speaker connection, now leads marketing at $100M firm",
          "Chicago CEO Roundtable peer, recently acquired a new portco",
        ],
      },
    },
    calculator: {
      defaultContacts: 500,
      defaultValue: 120000,
      defaultRate: 5,
    },
    orbitMap: {
      rings: [
        { label: "Core Proof", detail: "BASF carveout, Kensing #1 result", color: "#2D2A26" },
        { label: "Active", detail: "Kensing, Schebler, DeliverHealth", color: "#4A6741" },
        { label: "Dead Zone", detail: "400+ dormant contacts", color: "#C65D3E", pulse: true },
        { label: "Warm Adjacency", detail: "AMA, DePaul, CEO Roundtable, Junto", color: "#C4A747" },
        { label: "New Gravity", detail: "Unknown prospects", color: "#A09890", dashed: true },
      ],
      centerLabel: "PG",
    },
    icp: [
      { title: "Manufacturing Decision Makers", text: "VP Marketing, CMO, and GM roles at mid-market manufacturers ($20M–$500M). Often PE-backed." },
      { title: "PE Operating Partners", text: "Portfolio operators seeking marketing infrastructure for newly acquired B2B companies." },
      { title: "B2B Services Leaders", text: "Managing partners and BD leaders at professional services firms exploring systematic growth." },
    ],
  },

  // ── Tab 4: Signals ──
  signals: {
    headline: "Signal + Proof + Context\n= Response, Not Pitch.",
    headlineAccent: "= Response, Not Pitch.",
    formulaCards: [
      { label: "Signal", text: "Their company wins an award", color: "#C4A747" },
      { label: "Proof", text: "Your Kensing case study matches", color: "#C65D3E" },
      { label: "Context", text: "You worked together in 2019", color: "#4A6741" },
    ],
    exampleEmail: {
      signalDescription: "Former proposal contact promoted to VP Marketing at PE-backed manufacturer",
      emailText: "Hey Sarah. We sent your team a proposal back in 2020 when you were at Schebler. I see you're now VP Marketing at Graystone Manufacturing and they just closed their Series B. Congratulations. We helped a PE-backed carveout called Kensing become the #1 manufacturer in its category in 3 years using our Revenue Tower methodology. Thought this might be relevant as you build out the marketing engine. Happy to share the case study if useful.",
      tags: [
        { label: "Signal", value: "Job change + funding", color: "#C4A747" },
        { label: "Proof", value: "Kensing case study", color: "#C65D3E" },
        { label: "Context", value: "2020 proposal history", color: "#4A6741" },
      ],
      footnote: "30 seconds to personalize. Zero pitch. 100% relevant.",
    },
    signalTypes: [
      "Job promotions",
      "Company changes",
      "PE acquisitions",
      "Industry awards",
      "Funding rounds",
      "New hires (CMO/VP Mktg)",
      "Expansion announcements",
      "LinkedIn engagement",
    ],
    firstWeek: [
      { day: "Monday", text: "Review 10 system-generated drafts. Each paired with a signal and proof point." },
      { day: "Tuesday–Thursday", text: "Send, edit, or skip. Each message takes 30 seconds to personalize." },
      { day: "Friday", text: "Check replies. Weekly report: messages sent, opened, replied. Pipeline activity." },
    ],
  },

  // ── Tab 5: Roadmap ──
  roadmap: {
    headline: "From 1.5 to 3.0 on the Spectrum",
    description: "A system that generates revenue whether Tim and George are in the room or not.",
    today: [
      { label: "Spectrum", value: "1.5" },
      { label: "Dormant contacts", value: "400+", color: "red" },
      { label: "Signal monitoring", value: "None", color: "red" },
      { label: "Outreach", value: "Manual" },
    ],
    future: [
      { label: "Spectrum", value: "3.0", color: "green" },
      { label: "Dormant", value: "120 (280 reactivated)", color: "green" },
      { label: "Signal monitoring", value: "Active", color: "green" },
      { label: "Outreach", value: "System-driven", color: "green" },
    ],
    quarters: [
      { q: "Q1", text: "50-contact pilot. Manufacturing beachhead. Build the proof.", highlight: true },
      { q: "Q2", text: "Full Dead Zone activation. First reactivated client." },
      { q: "Q3", text: "Revenue Tower + Signal-Activated Growth bundle." },
      { q: "Q4", text: "Channel play live. Flywheel turning." },
    ],
    expandables: [
      {
        title: "The Channel Play",
        content: {
          type: "card-grid",
          cards: [
            { title: "The Offering", text: "\"We did this for ourselves first.\" Pepper Group becomes the proof case for signal-activated growth." },
            { title: "The Revenue Model", text: "Tech wedge opens the door. Consulting revenue follows. Two revenue streams from one system." },
            { title: "The Competitive Moat", text: "No other Chicago B2B agency has relationship activation technology. First-mover advantage." },
          ],
        },
      },
    ],
  },

  // ── Tab 6: Content Engine ──
  contentEngine: {
    headline: "Your Content Engine,\nAlready Running",
    subtitle: "Before We Ask, We Give",
    description: "We didn't just analyze your business. We built you two pieces of content you can publish this week. In George's voice. On brand. Ready to go.",
    cadenceNote: "George's cadence is 2–3 per year; it should be 2 per month. The gap isn't ideas - it's bandwidth. This is what the system does.",
    linkedInPost: {
      author: "George Couris",
      status: "Ready to publish",
      wordCount: "~150 words",
      paragraphs: [
        "After 22 years running a B2B marketing agency, I've noticed something most manufacturers get wrong about marketing.",
        "They hire vendors. They buy tools. They stack technologies on top of each other like Lego bricks with no blueprint.",
        "Then they wonder why the $200K they spent last year didn't move pipeline.",
        "Here's what we've learned building Revenue Tower, our 6-level marketing operating system: the problem is never one channel, one campaign, or one tool. The problem is that nobody connected Strategy to Showroom to Engagement to Sales Enablement to Retention into one system.",
        "Manufacturers don't need more marketing. They need a marketing operating system. One that treats revenue generation the way they treat production: as an engineered process with measurable throughput at every stage.",
        "Your factory floor has a system. Your marketing should too.",
        "*When was the last time a vendor asked you to think about your business as a system instead of asking you to buy their solution?*",
      ],
    },
    blogPost: {
      title: "Why Your Marketing Stack Isn't a Strategy: The Revenue Tower Approach to B2B Growth",
      domain: "peppergroup.com",
      status: "Draft outline",
      wordCount: "~1,200 words",
      sections: [
        { num: "1", title: "The Illusion of Progress", desc: "Tools without architecture = organized noise" },
        { num: "2", title: "Why Manufacturers Are Different", desc: "They think in systems but accept disconnected marketing" },
        { num: "3", title: "The Revenue Tower Framework", desc: "6 levels, each feeds the next" },
        { num: "4", title: "What the Cornerstones Actually Do", desc: "Content, data, talent, tech as plumbing - not shopping list" },
        { num: "5", title: "What Winners Do Differently", desc: "PE carveout went from unknown to #1 in 3 years" },
      ],
    },
    whyThisMatters: {
      title: "Why This Matters",
      text: "This is what a content engine looks like when it runs. George has 22 years of insight trapped in his head. Two posts per month. 10 minutes editing each. Revenue Tower stops being Pepper Group's best-kept secret.",
    },
    validationQuestions: [
      "Is 1.5 on the Spectrum accurate?",
      "Is the Dead Zone bigger or smaller than 400? (We think 1,500+)",
      "Is manufacturing the right beachhead?",
      "Does the LinkedIn post sound like George?",
    ],
    dataRequest: {
      title: "Before the MAP Review, we'd love to know:",
      items: [
        "What's the average first-year engagement value for a new Pepper Group client?",
        "How many proposals have \"bounced back\" after initial no-response?",
        "How many LinkedIn connections does Tim's profile have?",
      ],
    },
    cta: {
      buttonText: "Schedule 15-Min MAP Review",
      buttonUrl: "https://calendly.com/adam-fridman/30min",
      subtext: "No pitch. Just: what's right, what's wrong, what's next.",
    },
    footer: {
      line1: "Prepared within 24 hours of Discovery Session. It gives before it asks.",
      line2: "Adam Fridman · Mabbly · GTM for Professional Services",
    },
  },
};

// ─── PAGE COMPONENT ───
// This is all that's needed. The shell handles everything.

export default function PepperGroup() {
  return <MicrositeShell data={SITE_DATA} />;
}
