// ─────────────────────────────────────────────────────────────────────────────
// Per-vertical content for the post-CTA "diagnostic" flow (form → wait → result).
//
// When a visitor arrives at /assess?vertical=<slug>, the flow swaps generic
// language for vertical-native vocabulary at every stage. The slug propagates
// into the URL of the wait/result pages and is persisted on the submission row
// so a refresh after Calendly redirects, etc., still hydrates the right copy.
//
// `general` is the fallback when no vertical is present (e.g., /discover or
// direct link to /assess).
// ─────────────────────────────────────────────────────────────────────────────

import type { VerticalSlug } from './verticals';

export type VerticalFlowSlug = VerticalSlug | 'general';

export type VerticalFlow = {
  /** Form eyebrow above the headline. */
  eyebrow: string;
  /** Used in: "See exactly where your {headlineSuffix} are leaking." */
  headlineSuffix: string;
  /** Sub-line on the form, replaces the "positioning, messaging, CTAs…" line. */
  methodologyLine: string;
  /** 4 wait-stage titles (override defaults). */
  waitStageTitles: [string, string, string, string];
  /** 4 wait-stage rotating ticks. */
  waitStageTicks: [string[], string[], string[], string[]];
  /** Appended to the result map header after the company name (e.g., "· Law Firm"). */
  resultMapHeaderSuffix: string;
  /** Single word the result page leans on (e.g., "origination", "BD"). */
  insightNativeTerm: string;
  /** Eyebrow above the Calendly section on the result page. */
  calendarCta: string;
  /** Used in insight cards in place of "Firms in your size band". */
  peerBenchmarkPhrase: string;
  /** Heading lead-in for the chapter recommendation block. */
  chapterRecommendationLead: string;
  /** Subject line + dialog title for the optional "email me this map" capture. */
  emailSubject: string;
  /** Optional template surfaced when copying the share link. */
  shareTemplate: string;
};

// ─── general (fallback, matches current generic copy) ───────────────────────
const general: VerticalFlow = {
  eyebrow: 'GET YOUR PERSONALIZED ANALYSIS',
  headlineSuffix: "firm's revenue relationships",
  methodologyLine: 'Analyzes positioning, messaging, CTAs, consistency.',
  waitStageTitles: [
    'Reading your homepage',
    'Mapping your services',
    'Mapping your dormant relationships',
    'Building your RROS map',
  ],
  waitStageTicks: [
    ['Reading your homepage…', 'Reading your value prop…', 'Reading your services…', 'Reading your proof…'],
    ['Identifying your ICP…', 'Mapping your offer surface…', 'Detecting your service areas…', 'Comparing against industry baseline…'],
    ['Estimating your CRM dormancy…', 'Inferring your reactivation cadence…', 'Detecting engagement signals…', 'Mapping your Five Orbits…'],
    ['Generating your RROS map…', 'Scoring your orbits…', 'Drafting your highest leverage move…', 'Almost ready…'],
  ],
  resultMapHeaderSuffix: '',
  insightNativeTerm: 'GTM',
  calendarCta: 'Book a walkthrough with Adam',
  peerBenchmarkPhrase: 'Firms in your size band',
  chapterRecommendationLead: 'How peer firms reactivate dormant relationships',
  emailSubject: 'Your RROS revenue map',
  shareTemplate: 'I just got a custom GTM analysis for our firm — thought you should see it:',
};

// ─── law ─────────────────────────────────────────────────────────────────────
const law: VerticalFlow = {
  eyebrow: 'ORIGINATION STRATEGY ANALYSIS',
  headlineSuffix: "law firm's origination signals",
  methodologyLine: 'Analyzes practice positioning, partner origination signals, lateral retention patterns, and dormant client cadence.',
  waitStageTitles: [
    'Reading your practice areas',
    'Mapping your origination signals',
    'Mapping your dormant client book',
    'Building your origination map',
  ],
  waitStageTicks: [
    ['Looking at how your firm describes its practice areas…', 'Reading your service positioning…', 'Identifying your practice groups…'],
    ['Detecting partner-led origination signals…', 'Checking lateral & cross-sell entry points…', 'Comparing against AmLaw origination baselines…'],
    ['Estimating your dormant client book size…', 'Detecting partner re-engagement signals…', 'Mapping your Five Orbits of relationship value…'],
    ['Calculating your origination score…', 'Compiling partner-specific callouts…', 'Almost ready. Your origination map is generating…'],
  ],
  resultMapHeaderSuffix: '· Law Firm',
  insightNativeTerm: 'origination',
  calendarCta: 'Book your origination strategy call',
  peerBenchmarkPhrase: 'Law firms in your size band',
  chapterRecommendationLead: 'How AmLaw firms reactivate dormant partner books',
  emailSubject: 'Your law firm origination map',
  shareTemplate: 'I just got an origination strategy analysis for our firm — worth a look:',
};

// ─── consulting ──────────────────────────────────────────────────────────────
const consulting: VerticalFlow = {
  eyebrow: 'PRACTICE GROWTH ANALYSIS',
  headlineSuffix: "consulting practice's growth levers",
  methodologyLine: 'Analyzes practice positioning, partner-led BD signals, alumni cadence, and dormant account reactivation patterns.',
  waitStageTitles: [
    'Reading your practice positioning',
    'Mapping your BD motion',
    'Mapping your dormant accounts',
    'Building your practice growth map',
  ],
  waitStageTicks: [
    ['Looking at how your firm describes its practices…', 'Reading your industry / functional split…', 'Identifying your service lines…'],
    ['Detecting partner-led BD signals…', 'Checking thought-leadership cadence…', 'Comparing against peer consulting firm baselines…'],
    ['Estimating your alumni & client base…', 'Detecting reactivation signals…', 'Mapping your Five Orbits of practice growth…'],
    ['Calculating your practice growth score…', 'Compiling partner-specific callouts…', 'Almost ready. Your practice growth map is generating…'],
  ],
  resultMapHeaderSuffix: '· Consulting',
  insightNativeTerm: 'practice growth',
  calendarCta: 'Book your practice growth call',
  peerBenchmarkPhrase: 'Consulting firms in your size band',
  chapterRecommendationLead: 'How peer consulting firms reactivate alumni and dormant accounts',
  emailSubject: 'Your consulting practice growth map',
  shareTemplate: 'I just got a practice growth analysis for our firm — sharing in case it sparks something:',
};

// ─── accounting ──────────────────────────────────────────────────────────────
const accounting: VerticalFlow = {
  eyebrow: 'CLIENT DEVELOPMENT ANALYSIS',
  headlineSuffix: "firm's client development signals",
  methodologyLine: 'Analyzes service-line positioning, partner-led client development signals, advisory cross-sell paths, and dormant client cadence.',
  waitStageTitles: [
    'Reading your service lines',
    'Mapping your client development motion',
    'Mapping your dormant client base',
    'Building your client development map',
  ],
  waitStageTicks: [
    ['Looking at how your firm describes audit, tax & advisory…', 'Reading your industry specializations…', 'Identifying your service lines…'],
    ['Detecting partner-led client development signals…', 'Checking advisory cross-sell entry points…', 'Comparing against peer firm baselines…'],
    ['Estimating your dormant client base…', 'Detecting reactivation signals…', 'Mapping your Five Orbits of client value…'],
    ['Calculating your client development score…', 'Compiling partner-specific callouts…', 'Almost ready. Your map is generating…'],
  ],
  resultMapHeaderSuffix: '· Accounting & Tax',
  insightNativeTerm: 'client development',
  calendarCta: 'Book your client development call',
  peerBenchmarkPhrase: 'Accounting firms in your size band',
  chapterRecommendationLead: 'How peer firms reactivate dormant client books and cross-sell advisory',
  emailSubject: 'Your client development map',
  shareTemplate: 'I just got a client development analysis for our firm — worth a look:',
};

// ─── msp ─────────────────────────────────────────────────────────────────────
const msp: VerticalFlow = {
  eyebrow: 'GTM & RENEWAL ANALYSIS',
  headlineSuffix: "MSP's GTM, renewals, and churn",
  methodologyLine: 'Analyzes service positioning, renewal signal cadence, churn risk patterns, and dormant client expansion paths.',
  waitStageTitles: [
    'Reading your service catalog',
    'Mapping your renewal motion',
    'Mapping your dormant accounts & churn risk',
    'Building your GTM map',
  ],
  waitStageTicks: [
    ['Looking at how your firm describes managed services…', 'Reading your stack positioning…', 'Identifying your service tiers…'],
    ['Detecting renewal signals…', 'Checking expansion / cross-sell entry points…', 'Comparing against peer MSP baselines…'],
    ['Estimating your dormant client base…', 'Detecting churn-risk and reactivation signals…', 'Mapping your Five Orbits…'],
    ['Calculating your GTM score…', 'Compiling account-specific callouts…', 'Almost ready. Your map is generating…'],
  ],
  resultMapHeaderSuffix: '· MSP',
  insightNativeTerm: 'GTM',
  calendarCta: 'Book your GTM strategy call',
  peerBenchmarkPhrase: 'MSPs in your size band',
  chapterRecommendationLead: 'How peer MSPs reduce churn and expand dormant accounts',
  emailSubject: 'Your MSP GTM map',
  shareTemplate: 'I just got a GTM, renewals, and churn analysis for our MSP — sharing it:',
};

// ─── advisory ────────────────────────────────────────────────────────────────
const advisory: VerticalFlow = {
  eyebrow: 'PROSPECTING & AUM GROWTH ANALYSIS',
  headlineSuffix: "advisory practice's prospecting and AUM channels",
  methodologyLine: 'Analyzes positioning, advisor-led prospecting signals, referral cadence, and dormant prospect & client reactivation patterns.',
  waitStageTitles: [
    'Reading your advisory positioning',
    'Mapping your prospecting motion',
    'Mapping your dormant prospect & client base',
    'Building your AUM growth map',
  ],
  waitStageTicks: [
    ['Looking at how your firm describes its advisory model…', 'Reading your client segmentation…', 'Identifying your service tiers…'],
    ['Detecting advisor-led prospecting signals…', 'Checking referral & COI cadence…', 'Comparing against peer advisory baselines…'],
    ['Estimating your dormant prospect & client base…', 'Detecting reactivation signals…', 'Mapping your Five Orbits…'],
    ['Calculating your AUM growth score…', 'Compiling advisor-specific callouts…', 'Almost ready. Your map is generating…'],
  ],
  resultMapHeaderSuffix: '· Financial Advisory',
  insightNativeTerm: 'prospecting',
  calendarCta: 'Book your AUM growth call',
  peerBenchmarkPhrase: 'Advisory practices in your size band',
  chapterRecommendationLead: 'How peer advisors reactivate dormant prospects and grow AUM',
  emailSubject: 'Your AUM growth map',
  shareTemplate: 'I just got a prospecting and AUM growth analysis for our practice — worth a look:',
};

// ─── ae (architecture & engineering) ────────────────────────────────────────
const ae: VerticalFlow = {
  eyebrow: 'BD & PROJECT PURSUIT ANALYSIS',
  headlineSuffix: "firm's BD, RFPs, and project pursuits",
  methodologyLine: 'Analyzes practice positioning, principal-led BD signals, RFP win patterns, and dormant client reactivation cadence.',
  waitStageTitles: [
    'Reading your practice positioning',
    'Mapping your BD motion',
    'Mapping your dormant client base',
    'Building your BD map',
  ],
  waitStageTicks: [
    ['Looking at how your firm describes its studios & sectors…', 'Reading your project positioning…', 'Identifying your specialties…'],
    ['Detecting principal-led BD signals…', 'Checking RFP & pursuit cadence…', 'Comparing against peer A/E firm baselines…'],
    ['Estimating your dormant client base…', 'Detecting reactivation signals on past projects…', 'Mapping your Five Orbits…'],
    ['Calculating your BD score…', 'Compiling principal-specific callouts…', 'Almost ready. Your map is generating…'],
  ],
  resultMapHeaderSuffix: '· Architecture & Engineering',
  insightNativeTerm: 'BD',
  calendarCta: 'Book your BD strategy call',
  peerBenchmarkPhrase: 'A/E firms in your size band',
  chapterRecommendationLead: 'How peer A/E firms turn past projects into the next pursuit',
  emailSubject: 'Your BD pursuit map',
  shareTemplate: 'I just got a BD and pursuit analysis for our firm — sharing it:',
};

// ─── recruiting (executive search) ──────────────────────────────────────────
const recruiting: VerticalFlow = {
  eyebrow: 'MANDATE ORIGINATION ANALYSIS',
  headlineSuffix: "search practice's mandate origination signals",
  methodologyLine: 'Analyzes practice positioning, partner-led mandate origination signals, candidate-to-client conversion paths, and dormant client cadence.',
  waitStageTitles: [
    'Reading your practice positioning',
    'Mapping your mandate origination motion',
    'Mapping your dormant client base',
    'Building your mandate origination map',
  ],
  waitStageTicks: [
    ['Looking at how your firm describes its functions & sectors…', 'Reading your placement positioning…', 'Identifying your specialty practices…'],
    ['Detecting partner-led origination signals…', 'Checking candidate-to-client conversion paths…', 'Comparing against peer search firm baselines…'],
    ['Estimating your dormant client base…', 'Detecting reactivation signals on past placements…', 'Mapping your Five Orbits…'],
    ['Calculating your mandate origination score…', 'Compiling partner-specific callouts…', 'Almost ready. Your map is generating…'],
  ],
  resultMapHeaderSuffix: '· Executive Search',
  insightNativeTerm: 'mandate origination',
  calendarCta: 'Book your mandate origination call',
  peerBenchmarkPhrase: 'Search firms in your size band',
  chapterRecommendationLead: 'How peer search firms turn past placements into new mandates',
  emailSubject: 'Your mandate origination map',
  shareTemplate: 'I just got a mandate origination analysis for our practice — worth a look:',
};

// ─── agency (marketing & creative) ──────────────────────────────────────────
const agency: VerticalFlow = {
  eyebrow: 'NEW BUSINESS ANALYSIS',
  headlineSuffix: "agency's new business and pitch channels",
  methodologyLine: 'Analyzes positioning, partner-led new business signals, pitch conversion patterns, and dormant client reactivation cadence.',
  waitStageTitles: [
    'Reading your agency positioning',
    'Mapping your new business motion',
    'Mapping your dormant client base',
    'Building your new business map',
  ],
  waitStageTicks: [
    ['Looking at how your agency describes its capabilities…', 'Reading your client positioning…', 'Identifying your service offerings…'],
    ['Detecting partner-led new business signals…', 'Checking pitch process & chemistry-meeting cadence…', 'Comparing against peer agency baselines…'],
    ['Estimating your dormant client base…', 'Detecting creative-team-change & reactivation signals…', 'Mapping your Five Orbits…'],
    ['Calculating your new business score…', 'Compiling partner-specific callouts…', 'Almost ready. Your map is generating…'],
  ],
  resultMapHeaderSuffix: '· Marketing & Creative',
  insightNativeTerm: 'new business',
  calendarCta: 'Book your new business call',
  peerBenchmarkPhrase: 'Agencies in your size band',
  chapterRecommendationLead: 'How peer agencies reactivate dormant clients and shorten the pitch cycle',
  emailSubject: 'Your agency new business map',
  shareTemplate: 'I just got a new business analysis for our agency — sharing it:',
};

export const VERTICAL_FLOWS: Record<VerticalFlowSlug, VerticalFlow> = {
  general,
  consulting,
  law,
  accounting,
  msp,
  advisory,
  ae,
  recruiting,
  agency,
};

const KNOWN: Set<string> = new Set(Object.keys(VERTICAL_FLOWS));

/** Validate a raw URL value into a known slug, falling back to "general". */
export function resolveVerticalSlug(raw: string | null | undefined): VerticalFlowSlug {
  if (!raw) return 'general';
  const v = raw.trim().toLowerCase();
  return KNOWN.has(v) ? (v as VerticalFlowSlug) : 'general';
}
