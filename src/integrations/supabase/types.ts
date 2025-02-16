export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          status: string
          story_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          story_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          story_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_packages: {
        Row: {
          created_at: string
          credits: number
          id: string
          name: string
          price: number
          size: Database["public"]["Enums"]["credit_package_size"]
          stripe_price_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credits: number
          id?: string
          name: string
          price: number
          size: Database["public"]["Enums"]["credit_package_size"]
          stripe_price_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credits?: number
          id?: string
          name?: string
          price?: number
          size?: Database["public"]["Enums"]["credit_package_size"]
          stripe_price_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      credit_purchases: {
        Row: {
          amount: number
          created_at: string
          credits_granted: number
          id: string
          package_id: string
          profile_id: string
          status: string
          stripe_payment_id: string
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          credits_granted: number
          id?: string
          package_id: string
          profile_id: string
          status: string
          stripe_payment_id: string
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          credits_granted?: number
          id?: string
          package_id?: string
          profile_id?: string
          status?: string
          stripe_payment_id?: string
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_purchases_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "credit_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_purchases_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      families: {
        Row: {
          created_at: string
          created_by: string
          id: string
          max_members: number
          name: string
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          max_members?: number
          name: string
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          max_members?: number
          name?: string
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "families_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          created_at: string
          family_id: string
          id: string
          is_admin: boolean | null
          profile_id: string
          role: string
          subscription_paid_by: string | null
        }
        Insert: {
          created_at?: string
          family_id: string
          id?: string
          is_admin?: boolean | null
          profile_id: string
          role?: string
          subscription_paid_by?: string | null
        }
        Update: {
          created_at?: string
          family_id?: string
          id?: string
          is_admin?: boolean | null
          profile_id?: string
          role?: string
          subscription_paid_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_subscription_paid_by_fkey"
            columns: ["subscription_paid_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_transcripts: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          story_id: string | null
          transcript: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          story_id?: string | null
          transcript: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          story_id?: string | null
          transcript?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_transcripts_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          profile_id: string | null
          status: string
          stripe_payment_id: string
          subscription_duration: Database["public"]["Enums"]["subscription_duration"]
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          profile_id?: string | null
          status: string
          stripe_payment_id: string
          subscription_duration: Database["public"]["Enums"]["subscription_duration"]
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          profile_id?: string | null
          status?: string
          stripe_payment_id?: string
          subscription_duration?: Database["public"]["Enums"]["subscription_duration"]
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_field_values: {
        Row: {
          created_at: string
          field_id: string | null
          id: string
          profile_id: string | null
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          field_id?: string | null
          id?: string
          profile_id?: string | null
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          field_id?: string | null
          id?: string
          profile_id?: string | null
          updated_at?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_field_values_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "profile_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_field_values_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_fields: {
        Row: {
          active: boolean | null
          created_at: string
          display_order: number | null
          id: string
          label: string
          name: string
          options: Json | null
          required: boolean | null
          type: Database["public"]["Enums"]["profile_field_type"]
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          display_order?: number | null
          id?: string
          label: string
          name: string
          options?: Json | null
          required?: boolean | null
          type: Database["public"]["Enums"]["profile_field_type"]
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          display_order?: number | null
          id?: string
          label?: string
          name?: string
          options?: Json | null
          required?: boolean | null
          type?: Database["public"]["Enums"]["profile_field_type"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string
          first_name: string | null
          full_name: string | null
          gender: string | null
          hometown: string | null
          id: string
          is_free_tier: boolean | null
          last_payment_date: string | null
          last_payment_status: string | null
          monthly_story_tokens: number | null
          purchased_story_credits: number | null
          single_user_stories: number | null
          stripe_customer_id: string | null
          subscription_auto_renew: boolean | null
          subscription_end_date: string | null
          subscription_plan:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          subscription_start_date: string | null
          tokens_reset_date: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          hometown?: string | null
          id: string
          is_free_tier?: boolean | null
          last_payment_date?: string | null
          last_payment_status?: string | null
          monthly_story_tokens?: number | null
          purchased_story_credits?: number | null
          single_user_stories?: number | null
          stripe_customer_id?: string | null
          subscription_auto_renew?: boolean | null
          subscription_end_date?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          subscription_start_date?: string | null
          tokens_reset_date?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          hometown?: string | null
          id?: string
          is_free_tier?: boolean | null
          last_payment_date?: string | null
          last_payment_status?: string | null
          monthly_story_tokens?: number | null
          purchased_story_credits?: number | null
          single_user_stories?: number | null
          stripe_customer_id?: string | null
          subscription_auto_renew?: boolean | null
          subscription_end_date?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          subscription_start_date?: string | null
          tokens_reset_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      promo_code_redemptions: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          promo_code_id: string
          tokens_granted: number
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          promo_code_id: string
          tokens_granted: number
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          promo_code_id?: string
          tokens_granted?: number
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_redemptions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_redemptions_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string | null
          id: string
          max_uses: number | null
          times_used: number | null
          tokens_granted: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          times_used?: number | null
          tokens_granted?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          times_used?: number | null
          tokens_granted?: number
          updated_at?: string
        }
        Relationships: []
      }
      prompt_logs: {
        Row: {
          cost_usd: number
          created_at: string
          id: string
          model: Database["public"]["Enums"]["llm_model"]
          prompt: string
          response: string
          status: string
          story_id: string | null
          tokens_used: number
          user_id: string | null
        }
        Insert: {
          cost_usd: number
          created_at?: string
          id?: string
          model: Database["public"]["Enums"]["llm_model"]
          prompt: string
          response: string
          status: string
          story_id?: string | null
          tokens_used: number
          user_id?: string | null
        }
        Update: {
          cost_usd?: number
          created_at?: string
          id?: string
          model?: Database["public"]["Enums"]["llm_model"]
          prompt?: string
          response?: string
          status?: string
          story_id?: string | null
          tokens_used?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_logs_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      question_prompts: {
        Row: {
          category: string
          created_at: string
          id: string
          question: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          question: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          question?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: Database["public"]["Enums"]["question_category"]
          created_at: string
          description: string | null
          id: string
          question: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["question_category"]
          created_at?: string
          description?: string | null
          id?: string
          question: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["question_category"]
          created_at?: string
          description?: string | null
          id?: string
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          author_id: string
          content: string
          created_at: string
          family_id: string | null
          id: string
          last_auto_save: string | null
          question_id: string | null
          status: Database["public"]["Enums"]["story_status"] | null
          title: string
          updated_at: string
          version: number | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          family_id?: string | null
          id?: string
          last_auto_save?: string | null
          question_id?: string | null
          status?: Database["public"]["Enums"]["story_status"] | null
          title: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          family_id?: string | null
          id?: string
          last_auto_save?: string | null
          question_id?: string | null
          status?: Database["public"]["Enums"]["story_status"] | null
          title?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stories_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      story_contributions: {
        Row: {
          amount: number
          contributor_id: string
          created_at: string
          id: string
          recipient_id: string
          status: string | null
          story_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          contributor_id: string
          created_at?: string
          id?: string
          recipient_id: string
          status?: string | null
          story_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          contributor_id?: string
          created_at?: string
          id?: string
          recipient_id?: string
          status?: string | null
          story_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_contributions_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_contributions_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_contributions_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_purchases: {
        Row: {
          amount: number
          created_at: string
          id: string
          profile_id: string | null
          status: string
          stripe_payment_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          profile_id?: string | null
          status: string
          stripe_payment_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          profile_id?: string | null
          status?: string
          stripe_payment_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_purchases_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_prices: {
        Row: {
          created_at: string
          duration: Database["public"]["Enums"]["subscription_duration"]
          id: string
          price: number
          stripe_price_id: string
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration: Database["public"]["Enums"]["subscription_duration"]
          id?: string
          price: number
          stripe_price_id: string
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration?: Database["public"]["Enums"]["subscription_duration"]
          id?: string
          price?: number
          stripe_price_id?: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      system_prompts: {
        Row: {
          content: string
          created_at: string
          id: string
          type: Database["public"]["Enums"]["prompt_type"]
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          type: Database["public"]["Enums"]["prompt_type"]
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          type?: Database["public"]["Enums"]["prompt_type"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      migrate_profile_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      redeem_promo_code: {
        Args: {
          code_text: string
        }
        Returns: {
          success: boolean
          message: string
          tokens_granted: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      credit_package_size: "small" | "medium" | "large"
      llm_model: "gpt-4o-mini" | "gpt-4o"
      profile_field_type: "text" | "number" | "select"
      prompt_type: "interview" | "story_generation"
      question_category:
        | "childhood_memories"
        | "life_lessons"
        | "family_traditions"
        | "personal_achievements"
        | "historical_events"
      story_status: "draft" | "published" | "private"
      subscription_duration: "monthly" | "annual"
      subscription_tier: "free" | "basic" | "premium" | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
