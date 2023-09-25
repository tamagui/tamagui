export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
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
          joined: number
          name: string
          requested: number
          start: string
          type: Database["public"]["Enums"]["climb_type"]
        }
        Insert: {
          created_at?: string
          created_by: string
          duration?: string
          id?: number
          joined?: number
          name: string
          requested?: number
          start?: string
          type: Database["public"]["Enums"]["climb_type"]
        }
        Update: {
          created_at?: string
          created_by?: string
          duration?: string
          id?: number
          joined?: number
          name?: string
          requested?: number
          start?: string
          type?: Database["public"]["Enums"]["climb_type"]
        }
        Relationships: [
          {
            foreignKeyName: "climbs_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "profile_climbs_climb_id_fkey"
            columns: ["climb_id"]
            referencedRelation: "climbs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_climbs_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          climb_type: Database["public"]["Enums"]["climb_type"][] | null
          expo_token: string | null
          first_name: string
          id: string
          last_name: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          climb_type?: Database["public"]["Enums"]["climb_type"][] | null
          expo_token?: string | null
          first_name: string
          id: string
          last_name: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          climb_type?: Database["public"]["Enums"]["climb_type"][] | null
          expo_token?: string | null
          first_name?: string
          id?: string
          last_name?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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

