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
      platform: {
        Row: {
          created_at: string
          id: string
          max_project_page_per_user: number
          max_project_row_per_user: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_project_page_per_user?: number
          max_project_row_per_user?: number
          name?: string
        }
        Update: {
          created_at?: string
          id?: string
          max_project_page_per_user?: number
          max_project_row_per_user?: number
          name?: string
        }
        Relationships: []
      }
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
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          name?: string
          user_id?: string
        }
        Relationships: []
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
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          description?: string | null
          id?: string
          name: string
          project_id: number
          type: string
          user_id?: string
        }
        Update: {
          content?: Json
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          project_id?: number
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_page_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_page_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "project_view"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      project_page_view: {
        Row: {
          content: Json | null
          created_at: string | null
          description: string | null
          id: string | null
          name: string | null
          owner: boolean | null
          project_id: number | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          name?: string | null
          owner?: never
          project_id?: number | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          name?: string | null
          owner?: never
          project_id?: number | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_page_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_page_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "project_view"
            referencedColumns: ["id"]
          }
        ]
      }
      project_view: {
        Row: {
          created_at: string | null
          description: string | null
          id: number | null
          name: string | null
          owner: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number | null
          name?: string | null
          owner?: never
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number | null
          name?: string | null
          owner?: never
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_platform_limits: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          id: string
          max_project_page_per_user: number
          max_project_row_per_user: number
          name: string
        }
      }
      get_user_project_page_rows: {
        Args: {
          project_id: number
        }
        Returns: number
      }
      get_user_project_rows: {
        Args: {
          user_id: string
        }
        Returns: number
      }
      is_user_same_as_auth_user: {
        Args: {
          user_id: string
        }
        Returns: boolean
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

