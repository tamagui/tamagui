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
      profiles: {
        Row: {
          about: string | null
          avatar_url: string | null
          id: string
          name: string | null
        }
        Insert: {
          about?: string | null
          avatar_url?: string | null
          id: string
          name?: string | null
        }
        Update: {
          about?: string | null
          avatar_url?: string | null
          id?: string
          name?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

