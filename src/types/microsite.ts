// ─── Microsite Template Data Schema ───
// Claude fills in this interface to generate a new microsite.
// Each microsite page imports { SiteData } and defines a SITE_DATA constant.

export interface SiteData {
  // ── Meta ──
  slug: string;
  companyName: string;
  preparedFor: string;
  accentColor?: string; // defaults to "#C65D3E"
  ogImage?: string;
  preparedDate?: string; // e.g., "March 2026"
  discoveryDate?: string; // e.g., "March 12, 2026"

  // ── Global CTA (used by sticky bar + TabBar pill) ──
  globalCta?: {
    buttonText: string;
    buttonUrl: string;
    subtext: string;
  };

  // ── Tab labels (optional overrides) ──
  tabLabels?: [string, string, string, string, string, string];

  // ── Tab 1: Overview ──
  overview: {
    headline: string; // use \n for line breaks
    headlineSub?: string; // punchy supporting line below headline
    pullQuote: Quote;
    keyNumbers: KeyNumber[];
    secondQuote?: Quote; // deprecated: prefer integrating into discoveryInsights
    discoveryInsights: DiscoveryInsight[];
    strategicObservations?: StrategicObservation[]; // 3 insight cards (replaces expandables when present)
    expandables: ExpandableSection[]; // fallback if strategicObservations not provided
    cta?: {
      buttonText: string;
      buttonUrl?: string;
      subtext: string;
    };
    rrosCurrentStage: number; // 0-4 index into [DISCOVER, PROVE, DESIGN, ACTIVATE, COMPOUND]
    journeyStageDescriptions?: string[]; // prospect-facing descriptions for each RROS stage
  };

  // ── Tab 2: Identity ──
  identity: {
    headline: string;
    headlineFaded?: string; // second line in muted color
    description: string;
    currentPositioning: { title: string; description: string };
    proposedPositioning: { title: string; description: string };
    eosTest?: { title: string; text: string };
    competitors: {
      columns: string[]; // e.g. ["Capability", "Pepper Group", "Trefoil", ...]
      highlightColumn: number; // 1-based index of the featured company
      rows: CompetitorRow[];
    };
    competitorFootnote?: string;
    expandables: ExpandableSection[];
  };

  // ── Tab 3: Orbits + Spectrum ──
  orbits: {
    spectrum: {
      score: number;
      maxScore: number;
      headline: string;
      description: string;
      labels?: { left: string; center: string; right: string };
    };
    haveItems: string[];
    gapItems: string[];
    relationshipEngines: {
      title: string;
      subtitle: string;
      description: string;
      engines: RelationshipEngine[];
      summary: string;
    };
    deadZone: {
      countLabel: string; // e.g. "400+"
      headline: string;
      description: string;
      dotMatrix: {
        activePercent: number; // 0-100
        tooltips: string[];
      };
    };
    calculator: {
      defaultContacts: number;
      defaultValue: number;
      defaultRate: number;
    };
    orbitMap: {
      rings: OrbitRing[];
      centerLabel: string;
    };
    icp: { title: string; text: string }[];
  };

  // ── Tab 4: Signals ──
  signals: {
    headline: string; // use \n for line breaks
    headlineAccent?: string; // colored portion
    formulaCards: FormulaCard[];
    exampleEmail: {
      signalDescription: string;
      emailText: string;
      tags: { label: string; value: string; color: string }[];
      footnote?: string;
    };
    signalTypes: string[];
    firstWeek: { day: string; text: string }[];
  };

  // ── Tab 5: Roadmap ──
  roadmap: {
    headline: string;
    description: string;
    today: MetricRow[];
    future: MetricRow[];
    quarters: QuarterItem[];
    expandables: ExpandableSection[];
  };

  // ── Tab 6: Content Engine ──
  contentEngine: {
    headline: string;
    subtitle: string;
    description: string;
    cadenceNote?: string;
    linkedInPost: {
      author: string;
      status: string;
      wordCount: string;
      paragraphs: string[];
    };
    blogPost: {
      title: string;
      domain: string;
      status: string;
      wordCount: string;
      sections: { num: string; title: string; desc: string }[];
    };
    whyThisMatters: { title: string; text: string };
    validationQuestions: string[];
    dataRequest: { title: string; items: string[] };
    cta: { buttonText: string; buttonUrl?: string; subtext: string };
    footer: { line1: string; line2: string };
  };
}

// ─── Shared Types ───

export interface Quote {
  text: string;
  author: string;
  role: string;
  context?: string;
  sessionDate?: string; // e.g., "March 12, 2026"
  sessionDuration?: string; // e.g., "60 minutes"
}

export interface StrategicObservation {
  title: string;
  text: string;
}

export interface KeyNumber {
  end: number;
  suffix: string;
  label: string;
  accent?: boolean;
  danger?: boolean;
}

export interface DiscoveryInsight {
  quote: string;
  label: string;
  insight: string;
}

export interface ExpandableSection {
  title: string;
  content: ExpandableContent;
}

export type ExpandableContent =
  | { type: "card-grid"; cards: { title: string; text: string }[] }
  | { type: "mapping"; items: { left: string; right: string; text: string }[]; summary?: string }
  | { type: "text"; text: string }
  | { type: "tag-list"; items: string[] }
  | { type: "strengths-gaps"; strengths: { title: string; items: string[] }; gaps: { title: string; items: string[] } };

export interface CompetitorRow {
  capability: string;
  values: CellValue[];
}

export type CellValue =
  | "check"
  | "partial"
  | "none"
  | { status: "check" | "partial" | "none"; note?: string };

export interface RelationshipEngine {
  num: number;
  role: string;
  name: string;
  insight: string;
}

export interface OrbitRing {
  label: string;
  detail: string;
  color: string;
  pulse?: boolean;
  dashed?: boolean;
}

export interface FormulaCard {
  label: string;
  text: string;
  color: string;
}

export interface MetricRow {
  label: string;
  value: string;
  color?: "green" | "red" | "default";
}

export interface QuarterItem {
  q: string;
  text: string;
  highlight?: boolean;
}
