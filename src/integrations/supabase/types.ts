export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      beta_reader_applications: {
        Row: {
          created_at: string
          email: string | null
          employees: string | null
          firm_name: string | null
          firm_revenue: string | null
          firm_type: string | null
          full_name: string | null
          gtm_challenge: string | null
          id: string
          role: string | null
          source: string | null
          utm_campaign: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          employees?: string | null
          firm_name?: string | null
          firm_revenue?: string | null
          firm_type?: string | null
          full_name?: string | null
          gtm_challenge?: string | null
          id?: string
          role?: string | null
          source?: string | null
          utm_campaign?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          employees?: string | null
          firm_name?: string | null
          firm_revenue?: string | null
          firm_type?: string | null
          full_name?: string | null
          gtm_challenge?: string | null
          id?: string
          role?: string | null
          source?: string | null
          utm_campaign?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      lead_signups: {
        Row: {
          created_at: string
          email: string
          firm: string | null
          first_name: string | null
          id: string
          last_name: string | null
          message: string | null
          page_path: string | null
          referrer_url: string | null
          session_id: string | null
          source: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          variant: string | null
          visitor_fingerprint: string | null
        }
        Insert: {
          created_at?: string
          email: string
          firm?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          message?: string | null
          page_path?: string | null
          referrer_url?: string | null
          session_id?: string | null
          source: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          variant?: string | null
          visitor_fingerprint?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          firm?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          message?: string | null
          page_path?: string | null
          referrer_url?: string | null
          session_id?: string | null
          source?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          variant?: string | null
          visitor_fingerprint?: string | null
        }
        Relationships: []
      }
      magnet_analytics_events: {
        Row: {
          created_at: string
          event_name: string
          id: string
          props: Json
          session_id: string | null
          slug: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          visitor_fingerprint: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          id?: string
          props?: Json
          session_id?: string | null
          slug: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_fingerprint?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          id?: string
          props?: Json
          session_id?: string | null
          slug?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_fingerprint?: string | null
        }
        Relationships: []
      }
      magnet_breakdowns: {
        Row: {
          action_1: string | null
          action_2: string | null
          action_3: string | null
          chapter_callouts: Json
          client_accent_color: string | null
          client_background_color: string | null
          client_brand_color: string | null
          client_brand_profile: Json
          client_company_name: string | null
          client_company_name_override: string | null
          client_font_family: string | null
          client_logo_url: string | null
          client_text_color: string | null
          created_at: string
          crm_estimate: number | null
          dead_zone_reasoning: string | null
          dead_zone_value: number | null
          deal_size_estimate: number | null
          deeper_findings: Json | null
          enrichment_error: string | null
          gtm_profile_assessment: string | null
          gtm_profile_observed: string | null
          id: string
          orbit_01: string | null
          orbit_02: string | null
          orbit_03: string | null
          orbit_04: string | null
          orbit_05: string | null
          raw_linkedin_data: Json
          raw_website_content: string | null
          recommended_layer: string | null
          slug: string
          welcome_message: string | null
        }
        Insert: {
          action_1?: string | null
          action_2?: string | null
          action_3?: string | null
          chapter_callouts?: Json
          client_accent_color?: string | null
          client_background_color?: string | null
          client_brand_color?: string | null
          client_brand_profile?: Json
          client_company_name?: string | null
          client_company_name_override?: string | null
          client_font_family?: string | null
          client_logo_url?: string | null
          client_text_color?: string | null
          created_at?: string
          crm_estimate?: number | null
          dead_zone_reasoning?: string | null
          dead_zone_value?: number | null
          deal_size_estimate?: number | null
          deeper_findings?: Json | null
          enrichment_error?: string | null
          gtm_profile_assessment?: string | null
          gtm_profile_observed?: string | null
          id?: string
          orbit_01?: string | null
          orbit_02?: string | null
          orbit_03?: string | null
          orbit_04?: string | null
          orbit_05?: string | null
          raw_linkedin_data?: Json
          raw_website_content?: string | null
          recommended_layer?: string | null
          slug: string
          welcome_message?: string | null
        }
        Update: {
          action_1?: string | null
          action_2?: string | null
          action_3?: string | null
          chapter_callouts?: Json
          client_accent_color?: string | null
          client_background_color?: string | null
          client_brand_color?: string | null
          client_brand_profile?: Json
          client_company_name?: string | null
          client_company_name_override?: string | null
          client_font_family?: string | null
          client_logo_url?: string | null
          client_text_color?: string | null
          created_at?: string
          crm_estimate?: number | null
          dead_zone_reasoning?: string | null
          dead_zone_value?: number | null
          deal_size_estimate?: number | null
          deeper_findings?: Json | null
          enrichment_error?: string | null
          gtm_profile_assessment?: string | null
          gtm_profile_observed?: string | null
          id?: string
          orbit_01?: string | null
          orbit_02?: string | null
          orbit_03?: string | null
          orbit_04?: string | null
          orbit_05?: string | null
          raw_linkedin_data?: Json
          raw_website_content?: string | null
          recommended_layer?: string | null
          slug?: string
          welcome_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "magnet_breakdowns_slug_fkey"
            columns: ["slug"]
            isOneToOne: true
            referencedRelation: "magnet_submissions"
            referencedColumns: ["slug"]
          },
        ]
      }
      magnet_call_bookings: {
        Row: {
          calendly_event_id: string | null
          created_at: string
          id: string
          scheduled_at: string | null
          slug: string
        }
        Insert: {
          calendly_event_id?: string | null
          created_at?: string
          id?: string
          scheduled_at?: string | null
          slug: string
        }
        Update: {
          calendly_event_id?: string | null
          created_at?: string
          id?: string
          scheduled_at?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "magnet_call_bookings_slug_fkey"
            columns: ["slug"]
            isOneToOne: false
            referencedRelation: "magnet_submissions"
            referencedColumns: ["slug"]
          },
        ]
      }
      magnet_chat_sessions: {
        Row: {
          created_at: string
          id: string
          messages: Json
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "magnet_chat_sessions_slug_fkey"
            columns: ["slug"]
            isOneToOne: false
            referencedRelation: "magnet_submissions"
            referencedColumns: ["slug"]
          },
        ]
      }
      magnet_emails: {
        Row: {
          captured_at: string
          consented_marketing: boolean
          created_at: string
          email: string
          email_domain: string | null
          id: string
          source_event: string
          source_slug: string | null
        }
        Insert: {
          captured_at?: string
          consented_marketing?: boolean
          created_at?: string
          email: string
          email_domain?: string | null
          id?: string
          source_event: string
          source_slug?: string | null
        }
        Update: {
          captured_at?: string
          consented_marketing?: boolean
          created_at?: string
          email?: string
          email_domain?: string | null
          id?: string
          source_event?: string
          source_slug?: string | null
        }
        Relationships: []
      }
      magnet_map_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          slug: string
          vertical: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          slug: string
          vertical?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          slug?: string
          vertical?: string | null
        }
        Relationships: []
      }
      magnet_name_corrections: {
        Row: {
          corrected_name: string
          created_at: string
          id: string
          previous_name: string | null
          slug: string
          visitor_fingerprint: string | null
        }
        Insert: {
          corrected_name: string
          created_at?: string
          id?: string
          previous_name?: string | null
          slug: string
          visitor_fingerprint?: string | null
        }
        Update: {
          corrected_name?: string
          created_at?: string
          id?: string
          previous_name?: string | null
          slug?: string
          visitor_fingerprint?: string | null
        }
        Relationships: []
      }
      magnet_ref_clicks: {
        Row: {
          clicked_at: string
          code: string
          created_at: string
          id: string
          landing_path: string | null
          referrer_url: string | null
          user_agent: string | null
          visitor_fingerprint: string | null
        }
        Insert: {
          clicked_at?: string
          code: string
          created_at?: string
          id?: string
          landing_path?: string | null
          referrer_url?: string | null
          user_agent?: string | null
          visitor_fingerprint?: string | null
        }
        Update: {
          clicked_at?: string
          code?: string
          created_at?: string
          id?: string
          landing_path?: string | null
          referrer_url?: string | null
          user_agent?: string | null
          visitor_fingerprint?: string | null
        }
        Relationships: []
      }
      magnet_referral_codes: {
        Row: {
          archived_at: string | null
          code: string
          created_at: string
          destination_path: string
          label: string
          notes: string | null
          suppress_slack: boolean
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          archived_at?: string | null
          code: string
          created_at?: string
          destination_path?: string
          label: string
          notes?: string | null
          suppress_slack?: boolean
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          archived_at?: string | null
          code?: string
          created_at?: string
          destination_path?: string
          label?: string
          notes?: string | null
          suppress_slack?: boolean
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      magnet_share_events: {
        Row: {
          channel: string
          created_at: string
          id: string
          share_token: string | null
          slug: string
        }
        Insert: {
          channel: string
          created_at?: string
          id?: string
          share_token?: string | null
          slug: string
        }
        Update: {
          channel?: string
          created_at?: string
          id?: string
          share_token?: string | null
          slug?: string
        }
        Relationships: []
      }
      magnet_shares: {
        Row: {
          created_at: string
          id: string
          recipient_email: string | null
          share_method: string
          share_token: string
          shared_at: string
          sharer_email: string | null
          source_slug: string
          visited_at: string | null
          visited_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          recipient_email?: string | null
          share_method: string
          share_token: string
          shared_at?: string
          sharer_email?: string | null
          source_slug: string
          visited_at?: string | null
          visited_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          recipient_email?: string | null
          share_method?: string
          share_token?: string
          shared_at?: string
          sharer_email?: string | null
          source_slug?: string
          visited_at?: string | null
          visited_count?: number
        }
        Relationships: []
      }
      magnet_submissions: {
        Row: {
          bd_challenge: string | null
          case_studies_url: string | null
          created_at: string
          crm_size: string | null
          deal_size: string | null
          email: string
          first_name: string
          id: string
          linkedin_url: string
          ref_code: string | null
          referrer_url: string | null
          role: string
          share_token: string | null
          slug: string
          status: string
          team_page_url: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          vertical: string
          website_url: string
        }
        Insert: {
          bd_challenge?: string | null
          case_studies_url?: string | null
          created_at?: string
          crm_size?: string | null
          deal_size?: string | null
          email: string
          first_name: string
          id?: string
          linkedin_url: string
          ref_code?: string | null
          referrer_url?: string | null
          role: string
          share_token?: string | null
          slug: string
          status?: string
          team_page_url?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          vertical?: string
          website_url: string
        }
        Update: {
          bd_challenge?: string | null
          case_studies_url?: string | null
          created_at?: string
          crm_size?: string | null
          deal_size?: string | null
          email?: string
          first_name?: string
          id?: string
          linkedin_url?: string
          ref_code?: string | null
          referrer_url?: string | null
          role?: string
          share_token?: string | null
          slug?: string
          status?: string
          team_page_url?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          vertical?: string
          website_url?: string
        }
        Relationships: []
      }
      magnet_views: {
        Row: {
          created_at: string
          dwell_seconds: number | null
          id: string
          last_section_seen: string | null
          max_scroll_percent: number | null
          referrer_slug: string | null
          referrer_url: string | null
          session_id: string | null
          slug: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          viewed_at: string
          visitor_fingerprint: string | null
        }
        Insert: {
          created_at?: string
          dwell_seconds?: number | null
          id?: string
          last_section_seen?: string | null
          max_scroll_percent?: number | null
          referrer_slug?: string | null
          referrer_url?: string | null
          session_id?: string | null
          slug: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          viewed_at?: string
          visitor_fingerprint?: string | null
        }
        Update: {
          created_at?: string
          dwell_seconds?: number | null
          id?: string
          last_section_seen?: string | null
          max_scroll_percent?: number | null
          referrer_slug?: string | null
          referrer_url?: string | null
          session_id?: string | null
          slug?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          viewed_at?: string
          visitor_fingerprint?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      correct_magnet_firm_name: {
        Args: {
          _corrected_name: string
          _slug: string
          _visitor_fingerprint?: string
        }
        Returns: string
      }
      get_magnet_breakdown_by_slug: {
        Args: { _slug: string }
        Returns: {
          action_1: string
          action_2: string
          action_3: string
          chapter_callouts: Json
          client_accent_color: string
          client_background_color: string
          client_brand_color: string
          client_brand_profile: Json
          client_company_name: string
          client_font_family: string
          client_logo_url: string
          client_text_color: string
          crm_estimate: number
          dead_zone_reasoning: string
          dead_zone_value: number
          deal_size_estimate: number
          deeper_findings: Json
          enrichment_error: string
          gtm_profile_assessment: string
          gtm_profile_observed: string
          orbit_01: string
          orbit_02: string
          orbit_03: string
          orbit_04: string
          orbit_05: string
          recommended_layer: string
          welcome_message: string
        }[]
      }
      get_magnet_submission_by_slug: {
        Args: { _slug: string }
        Returns: {
          first_name: string
          share_token: string
          status: string
          vertical: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
