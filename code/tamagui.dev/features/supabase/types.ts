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
      app_installations: {
        Row: {
          created_at: string | null
          github_installation_id: number | null
          id: number
          installed_at: string | null
          subscription_item_id: string
        }
        Insert: {
          created_at?: string | null
          github_installation_id?: number | null
          id?: number
          installed_at?: string | null
          subscription_item_id: string
        }
        Update: {
          created_at?: string | null
          github_installation_id?: number | null
          id?: number
          installed_at?: string | null
          subscription_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'app_installations_subscription_item_id_fkey'
            columns: ['subscription_item_id']
            isOneToOne: false
            referencedRelation: 'subscription_items'
            referencedColumns: ['id']
          },
        ]
      }
      bot_pull_requests: {
        Row: {
          base_pr_number: number
          created_at: string | null
          error: string | null
          final_pr_num: number | null
          github_installation_id: number
          id: number
          repo_id: number | null
        }
        Insert: {
          base_pr_number: number
          created_at?: string | null
          error?: string | null
          final_pr_num?: number | null
          github_installation_id: number
          id?: number
          repo_id?: number | null
        }
        Update: {
          base_pr_number?: number
          created_at?: string | null
          error?: string | null
          final_pr_num?: number | null
          github_installation_id?: number
          id?: number
          repo_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'bot_pull_requests_github_installation_id_fkey'
            columns: ['github_installation_id']
            isOneToOne: false
            referencedRelation: 'app_installations'
            referencedColumns: ['github_installation_id']
          },
        ]
      }
      claims: {
        Row: {
          created_at: string
          data: Json | null
          id: number
          product_id: string
          product_ownership_id: number | null
          subscription_id: string | null
          unclaimed_at: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: number
          product_id: string
          product_ownership_id?: number | null
          subscription_id?: string | null
          unclaimed_at?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: number
          product_id?: string
          product_ownership_id?: number | null
          subscription_id?: string | null
          unclaimed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'claims_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'claims_product_ownership_id_fkey'
            columns: ['product_ownership_id']
            isOneToOne: false
            referencedRelation: 'product_ownership'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'claims_subscription_id_fkey'
            columns: ['subscription_id']
            isOneToOne: false
            referencedRelation: 'subscriptions'
            referencedColumns: ['id']
          },
        ]
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: []
      }
      discord_invites: {
        Row: {
          created_at: string | null
          discord_user_id: string
          id: number
          subscription_id: string
        }
        Insert: {
          created_at?: string | null
          discord_user_id: string
          id?: number
          subscription_id: string
        }
        Update: {
          created_at?: string | null
          discord_user_id?: string
          id?: number
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'discord_invites_subscription_id_fkey'
            columns: ['subscription_id']
            isOneToOne: false
            referencedRelation: 'subscriptions'
            referencedColumns: ['id']
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string | null
          id: number
          team_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          team_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          team_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'memberships_team_id_fkey'
            columns: ['team_id']
            isOneToOne: false
            referencedRelation: 'teams'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'memberships_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database['public']['Enums']['pricing_plan_interval'] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database['public']['Enums']['pricing_type'] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database['public']['Enums']['pricing_plan_interval'] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database['public']['Enums']['pricing_type'] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database['public']['Enums']['pricing_plan_interval'] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database['public']['Enums']['pricing_type'] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'prices_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      product_ownership: {
        Row: {
          created_at: string
          id: number
          price_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          price_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          price_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'product_ownership_price_id_fkey'
            columns: ['price_id']
            isOneToOne: false
            referencedRelation: 'prices'
            referencedColumns: ['id']
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      studio_themes: {
        Row: {
          created_at: string | null
          data: Json | null
          id: number
          team_id: number
          theme_id: string | null
          uid: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: number
          team_id: number
          theme_id?: string | null
          uid?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: number
          team_id?: number
          theme_id?: string | null
          uid?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'studio_themes_team_id_fkey'
            columns: ['team_id']
            isOneToOne: false
            referencedRelation: 'teams'
            referencedColumns: ['id']
          },
        ]
      }
      subscription_items: {
        Row: {
          id: string
          price_id: string
          subscription_id: string
        }
        Insert: {
          id: string
          price_id: string
          subscription_id: string
        }
        Update: {
          id?: string
          price_id?: string
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subscription_items_price_id_fkey'
            columns: ['price_id']
            isOneToOne: false
            referencedRelation: 'prices'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'subscription_items_subscription_id_fkey'
            columns: ['subscription_id']
            isOneToOne: false
            referencedRelation: 'subscriptions'
            referencedColumns: ['id']
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          quantity: number | null
          status: Database['public']['Enums']['subscription_status'] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          quantity?: number | null
          status?: Database['public']['Enums']['subscription_status'] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          quantity?: number | null
          status?: Database['public']['Enums']['subscription_status'] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subscriptions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          github_id: string | null
          id: number
          is_active: boolean
          is_personal: boolean
          name: string | null
          owner_id: string | null
          studio_queued_at: string
          tier: string | null
        }
        Insert: {
          created_at?: string | null
          github_id?: string | null
          id?: number
          is_active: boolean
          is_personal: boolean
          name?: string | null
          owner_id?: string | null
          studio_queued_at?: string
          tier?: string | null
        }
        Update: {
          created_at?: string | null
          github_id?: string | null
          id?: number
          is_active?: boolean
          is_personal?: boolean
          name?: string | null
          owner_id?: string | null
          studio_queued_at?: string
          tier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'teams_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      themes: {
        Row: {
          created_at: string | null
          id: string
          is_dark: boolean
          name: string
          query: string | null
          theme_data: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_dark?: boolean
          name: string
          query?: string | null
          theme_data: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_dark?: boolean
          name?: string
          query?: string | null
          theme_data?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          full_name: string | null
          id: string
          payment_method: Json | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id: string
          payment_method?: Json | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id?: string
          payment_method?: Json | null
        }
        Relationships: []
      }
      users_private: {
        Row: {
          discord_token: string | null
          email: string | null
          full_name: string | null
          github_refresh_token: string | null
          github_token: string | null
          github_user_name: string | null
          id: string
        }
        Insert: {
          discord_token?: string | null
          email?: string | null
          full_name?: string | null
          github_refresh_token?: string | null
          github_token?: string | null
          github_user_name?: string | null
          id: string
        }
        Update: {
          discord_token?: string | null
          email?: string | null
          full_name?: string | null
          github_refresh_token?: string | null
          github_token?: string | null
          github_user_name?: string | null
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_product_info: {
        Args: {
          github_id_input: string
        }
        Returns: {
          product_name: string
        }[]
      }
      has_bento_access: {
        Args: {
          github_id_input: string
        }
        Returns: {
          product_name: string
        }[]
      }
      hello_world: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      pricing_plan_interval: 'day' | 'week' | 'month' | 'year'
      pricing_type: 'one_time' | 'recurring'
      subscription_status:
        | 'trialing'
        | 'active'
        | 'canceled'
        | 'incomplete'
        | 'incomplete_expired'
        | 'past_due'
        | 'unpaid'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
