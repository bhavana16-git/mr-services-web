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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null
          content_markdown: string
          cover_image_path: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          meta_description: string | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content_markdown: string
          cover_image_path?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content_markdown?: string
          cover_image_path?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          linked_client_id: string | null
          message: string
          name: string
          phone: string
          service_interested_in: Database["public"]["Enums"]["service_category"]
          status: Database["public"]["Enums"]["contact_status"]
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          linked_client_id?: string | null
          message: string
          name: string
          phone: string
          service_interested_in: Database["public"]["Enums"]["service_category"]
          status?: Database["public"]["Enums"]["contact_status"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          linked_client_id?: string | null
          message?: string
          name?: string
          phone?: string
          service_interested_in?: Database["public"]["Enums"]["service_category"]
          status?: Database["public"]["Enums"]["contact_status"]
        }
        Relationships: [
          {
            foreignKeyName: "contact_submissions_linked_client_id_fkey"
            columns: ["linked_client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: Database["public"]["Enums"]["document_category"]
          client_id: string
          created_at: string
          file_size_bytes: number | null
          id: string
          request_id: string | null
          storage_path: string
          title: string
          uploaded_by: string
        }
        Insert: {
          category: Database["public"]["Enums"]["document_category"]
          client_id: string
          created_at?: string
          file_size_bytes?: number | null
          id?: string
          request_id?: string | null
          storage_path: string
          title: string
          uploaded_by: string
        }
        Update: {
          category?: Database["public"]["Enums"]["document_category"]
          client_id?: string
          created_at?: string
          file_size_bytes?: number | null
          id?: string
          request_id?: string | null
          storage_path?: string
          title?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment_storage_path: string | null
          body: string
          client_id: string
          created_at: string
          id: string
          read_at: string | null
          request_id: string | null
          sender_id: string
          sender_role: Database["public"]["Enums"]["message_sender_role"]
        }
        Insert: {
          attachment_storage_path?: string | null
          body: string
          client_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          request_id?: string | null
          sender_id: string
          sender_role: Database["public"]["Enums"]["message_sender_role"]
        }
        Update: {
          attachment_storage_path?: string | null
          body?: string
          client_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          request_id?: string | null
          sender_id?: string
          sender_role?: Database["public"]["Enums"]["message_sender_role"]
        }
        Relationships: [
          {
            foreignKeyName: "messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          mobile_number: string | null
          notification_preference: Database["public"]["Enums"]["notification_preference"]
          role: Database["public"]["Enums"]["user_role"]
          society_or_business_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          mobile_number?: string | null
          notification_preference?: Database["public"]["Enums"]["notification_preference"]
          role?: Database["public"]["Enums"]["user_role"]
          society_or_business_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          mobile_number?: string | null
          notification_preference?: Database["public"]["Enums"]["notification_preference"]
          role?: Database["public"]["Enums"]["user_role"]
          society_or_business_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      request_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size_bytes: number | null
          id: string
          request_id: string
          storage_path: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size_bytes?: number | null
          id?: string
          request_id: string
          storage_path: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size_bytes?: number | null
          id?: string
          request_id?: string
          storage_path?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_attachments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      request_internal_notes: {
        Row: {
          author_id: string
          created_at: string
          id: string
          note: string
          request_id: string
        }
        Insert: {
          author_id: string
          created_at?: string
          id?: string
          note: string
          request_id: string
        }
        Update: {
          author_id?: string
          created_at?: string
          id?: string
          note?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_internal_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_internal_notes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          client_id: string
          created_at: string
          description: string
          id: string
          internal_notes: string | null
          package_id: string | null
          preferred_contact_method: Database["public"]["Enums"]["preferred_contact_method"]
          preferred_start_date: string | null
          request_number: string
          service_category: Database["public"]["Enums"]["service_category"]
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description: string
          id?: string
          internal_notes?: string | null
          package_id?: string | null
          preferred_contact_method?: Database["public"]["Enums"]["preferred_contact_method"]
          preferred_start_date?: string | null
          request_number: string
          service_category: Database["public"]["Enums"]["service_category"]
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string
          id?: string
          internal_notes?: string | null
          package_id?: string | null
          preferred_contact_method?: Database["public"]["Enums"]["preferred_contact_method"]
          preferred_start_date?: string | null
          request_number?: string
          service_category?: Database["public"]["Enums"]["service_category"]
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "service_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      service_package_features: {
        Row: {
          feature_text: string
          id: string
          package_id: string
          sort_order: number
        }
        Insert: {
          feature_text: string
          id?: string
          package_id: string
          sort_order?: number
        }
        Update: {
          feature_text?: string
          id?: string
          package_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_package_features_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "service_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      service_packages: {
        Row: {
          best_for: string
          category: Database["public"]["Enums"]["package_category"]
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          price_unit: string
          slug: string
          sort_order: number
          starting_price: number
          turnaround: string
          updated_at: string
        }
        Insert: {
          best_for: string
          category: Database["public"]["Enums"]["package_category"]
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          price_unit?: string
          slug: string
          sort_order?: number
          starting_price: number
          turnaround: string
          updated_at?: string
        }
        Update: {
          best_for?: string
          category?: Database["public"]["Enums"]["package_category"]
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price_unit?: string
          slug?: string
          sort_order?: number
          starting_price?: number
          turnaround?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_name: string
          author_role: string | null
          created_at: string
          id: string
          is_active: boolean
          is_featured: boolean
          quote: string
          sort_order: number
        }
        Insert: {
          author_name: string
          author_role?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_featured?: boolean
          quote: string
          sort_order?: number
        }
        Update: {
          author_name?: string
          author_role?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_featured?: boolean
          quote?: string
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { uid: string }; Returns: boolean }
    }
    Enums: {
      contact_status: "new" | "contacted" | "closed"
      document_category:
        | "society_accounting"
        | "business_accounting"
        | "typing"
        | "other"
      message_sender_role: "client" | "admin"
      notification_preference: "email" | "whatsapp" | "both"
      package_category:
        | "society_accounting"
        | "business_accounting"
        | "typing_services"
      preferred_contact_method: "call" | "whatsapp" | "email"
      request_status: "received" | "in_progress" | "completed"
      service_category:
        | "society_accounting"
        | "business_accounting"
        | "typing_services"
        | "other"
      user_role: "client" | "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      contact_status: ["new", "contacted", "closed"],
      document_category: [
        "society_accounting",
        "business_accounting",
        "typing",
        "other",
      ],
      message_sender_role: ["client", "admin"],
      notification_preference: ["email", "whatsapp", "both"],
      package_category: [
        "society_accounting",
        "business_accounting",
        "typing_services",
      ],
      preferred_contact_method: ["call", "whatsapp", "email"],
      request_status: ["received", "in_progress", "completed"],
      service_category: [
        "society_accounting",
        "business_accounting",
        "typing_services",
        "other",
      ],
      user_role: ["client", "admin"],
    },
  },
} as const
