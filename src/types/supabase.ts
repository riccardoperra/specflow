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
      project: {
        Row: {
          created_at: string
          description: string
          id: number
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          name?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      project_page: {
        Row: {
          content: Json
          created_at: string
          description: string | null
          id: string
          name: string
          project_id: number
          type: string
        }
        Insert: {
          content: Json
          created_at?: string
          description?: string | null
          id?: string
          name: string
          project_id: number
          type: string
        }
        Update: {
          content?: Json
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          project_id?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_page_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "project"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
