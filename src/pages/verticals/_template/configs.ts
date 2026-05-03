import type { ReactNode } from "react";

export type VerticalSlug = "consulting" | "law" | "accounting" | "msp" | "advisory" | "ae" | "recruiting" | "agency";

export type SmallStatNum =
  | { type: "count"; target: number; format: "suffix-k" | "number" | "pct-decimal" }
  | { type: "static"; text: string };

export type SmallStat = {
  label: string;
  num: SmallStatNum;
  source: string;
  viz: "density" | "bars" | "sparkline";
};

export type RealityCard = {
  num: string;
  stat: ReactNode;
  text: string;
  source: string;
};

export type BreakBlock = {
  num: string;
  headline: string;
  body: ReactNode;
  chart: "timeline" | "partnerWeek" | "coldVsWarm" | "networkDensity";
};

export type Faq = { tag: string; q: string; a: string };

export type ProfileBar = { label: string; w: number; mark: number };

export type VerticalConfig = {
  slug: VerticalSlug;
  shortLabel: string;
  pageTitle: string;
  pageDescription: string;

  hero: {
    eyebrow: string;
    headlineLine1: string;
    headlineLine2: string;
    lede: ReactNode;
  };

  profile: {
    eyebrowLabel: string;
    firmName: string;
    score: number;
    tier: string;
    msg: ReactNode;
    bars: [ProfileBar, ProfileBar, ProfileBar];
  };

  numbers: {
    metaTag: string;
    headline: string;
    sub: ReactNode;
    heroStat: { label: string; num: ReactNode; sub: ReactNode; source: string };
    smallStats: [SmallStat, SmallStat, SmallStat];
  };

  reality: {
    metaTag: string;
    headline: string;
    sub: string;
    definitionTerm: string;
    definitionBody: string;
    cards: RealityCard[];
  };

  breaks: {
    metaTag: string;
    headline: string;
    blocks: [BreakBlock, BreakBlock, BreakBlock, BreakBlock];
  };

  audit: {
    metaTag: string;
    headline: string;
    sub: ReactNode;
    questions: [string, string, string, string, string, string];
    alertMessage: string;
  };

  roadmap: {
    metaTag: string;
    headline: string;
    sub: ReactNode;
    stops: [
      { day: string; label: string; desc: string },
      { day: string; label: string; desc: string },
      { day: string; label: string; desc: string },
      { day: string; label: string; desc: string },
    ];
  };

  score: {
    metaTag: string;
    headline: string;
    sub: string;
    ctaLabel: string;
  };

  authorsHeadline: string;

  faq: {
    metaTag: string;
    headline: string;
    items: [Faq, Faq, Faq, Faq, Faq, Faq];
  };

  begin: {
    headline: string;
    ctaLabel: string;
  };
};
