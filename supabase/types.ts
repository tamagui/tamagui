export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      climbs: {
        Row: {
          created_at: string
          created_by: string
          duration: string
          id: number
          start: string
          type: Database["public"]["Enums"]["climb_type"]
        }
        Insert: {
          created_at?: string
          created_by: string
          duration?: string
          id?: number
          start?: string
          type: Database["public"]["Enums"]["climb_type"]
        }
        Update: {
          created_at?: string
          created_by?: string
          duration?: string
          id?: number
          start?: string
          type?: Database["public"]["Enums"]["climb_type"]
        }
      }
      profile_climbs: {
        Row: {
          climb_id: number
          created_at: string | null
          id: number
          profile_id: string
        }
        Insert: {
          climb_id: number
          created_at?: string | null
          id?: number
          profile_id: string
        }
        Update: {
          climb_id?: number
          created_at?: string | null
          id?: number
          profile_id?: string
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          climb_type: Database["public"]["Enums"]["climb_type"][] | null
          first_name: string
          id: string
          last_name: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          climb_type?: Database["public"]["Enums"]["climb_type"][] | null
          first_name: string
          id: string
          last_name: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          climb_type?: Database["public"]["Enums"]["climb_type"][] | null
          first_name?: string
          id?: string
          last_name?: string
          username?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      climb_type: "top_rope" | "lead_rope" | "boulder"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

