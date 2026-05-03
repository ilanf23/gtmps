export type SubmissionStatus =
  | 'pending'
  | 'processing'
  | 'complete'
  | 'error';

export type RROSLayer =
  | 'DISCOVER'
  | 'PROVE'
  | 'DESIGN'
  | 'ACTIVATE'
  | 'COMPOUND';

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface ChapterCallout {
  /** e.g. "Ch.1 - The Dead Zone" */
  chapter: string;
  /** Personalized paragraph for their firm */
  callout: string;
}

export interface MagnetSubmission {
  id: string;
  created_at: string;
  slug: string;
  first_name: string;
  role: string;
  website_url: string;
  linkedin_url: string;
  email: string;
  status: SubmissionStatus;
}

export interface MagnetBreakdown {
  id: string;
  created_at: string;
  slug: string;
  welcome_message: string | null;
  dead_zone_value: number | null;
  dead_zone_reasoning: string | null;
  gtm_profile_observed: string | null;
  gtm_profile_assessment: string | null;
  orbit_01: string | null;
  orbit_02: string | null;
  orbit_03: string | null;
  orbit_04: string | null;
  orbit_05: string | null;
  recommended_layer: RROSLayer | null;
  action_1: string | null;
  action_2: string | null;
  action_3: string | null;
  chapter_callouts: ChapterCallout[];
  raw_website_content: string | null;
  raw_linkedin_data: Record<string, unknown>;
  enrichment_error: string | null;
}

export interface MagnetChatSession {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  messages: ChatMessage[];
}

export interface MagnetCallBooking {
  id: string;
  created_at: string;
  slug: string;
  calendly_event_id: string | null;
  scheduled_at: string | null;
}

export interface AssessmentFormInput {
  first_name: string;
  role: string;
  website_url: string;
  linkedin_url: string;
  email: string;
}

export interface MagnetContext {
  submission: MagnetSubmission;
  breakdown: MagnetBreakdown | null;
}
