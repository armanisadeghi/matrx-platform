/**
 * Supabase Database Types
 *
 * GENERATED FILE - Do not edit directly.
 *
 * Regenerate with:
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types.ts
 *
 * This is a placeholder matching the migration schema.
 * Replace with generated types once your Supabase project is configured.
 */

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string;
          email: string;
          bio: string | null;
          avatar_url: string | null;
          role: "super_admin" | "admin" | "member" | "viewer";
          is_active: boolean;
          last_sign_in_at: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name: string;
          email: string;
          bio?: string | null;
          avatar_url?: string | null;
          role?: "super_admin" | "admin" | "member" | "viewer";
          is_active?: boolean;
          last_sign_in_at?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          display_name?: string;
          email?: string;
          bio?: string | null;
          avatar_url?: string | null;
          role?: "super_admin" | "admin" | "member" | "viewer";
          is_active?: boolean;
          last_sign_in_at?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          owner_id: string;
          plan: "free" | "starter" | "pro" | "enterprise";
          settings: Record<string, unknown>;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          logo_url?: string | null;
          owner_id: string;
          plan?: "free" | "starter" | "pro" | "enterprise";
          settings?: Record<string, unknown>;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          logo_url?: string | null;
          owner_id?: string;
          plan?: "free" | "starter" | "pro" | "enterprise";
          settings?: Record<string, unknown>;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "organizations_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: "owner" | "admin" | "member" | "viewer";
          invited_by: string | null;
          joined_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: "owner" | "admin" | "member" | "viewer";
          invited_by?: string | null;
          joined_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string;
          role?: "owner" | "admin" | "member" | "viewer";
          invited_by?: string | null;
          joined_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          theme: "light" | "dark" | "system";
          language: string;
          timezone: string;
          notifications: Record<string, unknown>;
          dashboard_layout: Record<string, unknown>;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: "light" | "dark" | "system";
          language?: string;
          timezone?: string;
          notifications?: Record<string, unknown>;
          dashboard_layout?: Record<string, unknown>;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: "light" | "dark" | "system";
          language?: string;
          timezone?: string;
          notifications?: Record<string, unknown>;
          dashboard_layout?: Record<string, unknown>;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          parent_id: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          content_format: "markdown" | "html" | "rich_text";
          cover_image_url: string | null;
          author_id: string;
          category_id: string | null;
          status: "draft" | "published" | "archived";
          published_at: string | null;
          tags: string[];
          seo_title: string | null;
          seo_description: string | null;
          seo_keywords: string[] | null;
          og_image_url: string | null;
          view_count: number;
          reading_time_minutes: number | null;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string;
          content_format?: "markdown" | "html" | "rich_text";
          cover_image_url?: string | null;
          author_id: string;
          category_id?: string | null;
          status?: "draft" | "published" | "archived";
          published_at?: string | null;
          tags?: string[];
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string[] | null;
          og_image_url?: string | null;
          view_count?: number;
          reading_time_minutes?: number | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string;
          content_format?: "markdown" | "html" | "rich_text";
          cover_image_url?: string | null;
          author_id?: string;
          category_id?: string | null;
          status?: "draft" | "published" | "archived";
          published_at?: string | null;
          tags?: string[];
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string[] | null;
          og_image_url?: string | null;
          view_count?: number;
          reading_time_minutes?: number | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "blog_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      dynamic_pages: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          content_type: "html" | "react" | "markdown";
          is_sandboxed: boolean;
          custom_css: string | null;
          head_tags: string | null;
          status: "draft" | "published" | "archived";
          author_id: string;
          published_at: string | null;
          layout: "default" | "full_width" | "sidebar" | "blank";
          seo_title: string | null;
          seo_description: string | null;
          og_image_url: string | null;
          metadata: Record<string, unknown>;
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content?: string;
          content_type?: "html" | "react" | "markdown";
          is_sandboxed?: boolean;
          custom_css?: string | null;
          head_tags?: string | null;
          status?: "draft" | "published" | "archived";
          author_id: string;
          published_at?: string | null;
          layout?: "default" | "full_width" | "sidebar" | "blank";
          seo_title?: string | null;
          seo_description?: string | null;
          og_image_url?: string | null;
          metadata?: Record<string, unknown>;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          content_type?: "html" | "react" | "markdown";
          is_sandboxed?: boolean;
          custom_css?: string | null;
          head_tags?: string | null;
          status?: "draft" | "published" | "archived";
          author_id?: string;
          published_at?: string | null;
          layout?: "default" | "full_width" | "sidebar" | "blank";
          seo_title?: string | null;
          seo_description?: string | null;
          og_image_url?: string | null;
          metadata?: Record<string, unknown>;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dynamic_pages_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      file_metadata: {
        Row: {
          id: string;
          storage_path: string;
          bucket: string;
          filename: string;
          mime_type: string;
          size_bytes: number;
          uploaded_by: string;
          organization_id: string | null;
          category: string | null;
          tags: string[];
          description: string | null;
          width: number | null;
          height: number | null;
          blurhash: string | null;
          public_url: string | null;
          is_public: boolean;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          storage_path: string;
          bucket: string;
          filename: string;
          mime_type: string;
          size_bytes: number;
          uploaded_by: string;
          organization_id?: string | null;
          category?: string | null;
          tags?: string[];
          description?: string | null;
          width?: number | null;
          height?: number | null;
          blurhash?: string | null;
          public_url?: string | null;
          is_public?: boolean;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          storage_path?: string;
          bucket?: string;
          filename?: string;
          mime_type?: string;
          size_bytes?: number;
          uploaded_by?: string;
          organization_id?: string | null;
          category?: string | null;
          tags?: string[];
          description?: string | null;
          width?: number | null;
          height?: number | null;
          blurhash?: string | null;
          public_url?: string | null;
          is_public?: boolean;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      app_versions: {
        Row: {
          id: string;
          app_name: "web" | "mobile_ios" | "mobile_android";
          version: string;
          build_number: number | null;
          git_commit_sha: string | null;
          git_branch: string | null;
          git_tag: string | null;
          environment: "development" | "staging" | "production";
          deployment_provider: "vercel" | "eas" | "manual" | null;
          deployment_url: string | null;
          deployment_id: string | null;
          status: "pending" | "building" | "deployed" | "failed" | "rolled_back" | "canceled";
          changelog: string | null;
          is_current: boolean;
          build_metadata: Record<string, unknown>;
          deployed_by: string | null;
          deployed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          app_name: "web" | "mobile_ios" | "mobile_android";
          version: string;
          build_number?: number | null;
          git_commit_sha?: string | null;
          git_branch?: string | null;
          git_tag?: string | null;
          environment?: "development" | "staging" | "production";
          deployment_provider?: "vercel" | "eas" | "manual" | null;
          deployment_url?: string | null;
          deployment_id?: string | null;
          status?: "pending" | "building" | "deployed" | "failed" | "rolled_back" | "canceled";
          changelog?: string | null;
          is_current?: boolean;
          build_metadata?: Record<string, unknown>;
          deployed_by?: string | null;
          deployed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          app_name?: "web" | "mobile_ios" | "mobile_android";
          version?: string;
          build_number?: number | null;
          git_commit_sha?: string | null;
          git_branch?: string | null;
          git_tag?: string | null;
          environment?: "development" | "staging" | "production";
          deployment_provider?: "vercel" | "eas" | "manual" | null;
          deployment_url?: string | null;
          deployment_id?: string | null;
          status?: "pending" | "building" | "deployed" | "failed" | "rolled_back" | "canceled";
          changelog?: string | null;
          is_current?: boolean;
          build_metadata?: Record<string, unknown>;
          deployed_by?: string | null;
          deployed_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          organization_id: string;
          settings: Record<string, unknown>;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          organization_id: string;
          settings?: Record<string, unknown>;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          organization_id?: string;
          settings?: Record<string, unknown>;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workspaces_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_integrations: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          description: string | null;
          type: "prompt" | "agent" | "workflow";
          config: Record<string, unknown>;
          is_active: boolean;
          version: number;
          last_executed_at: string | null;
          execution_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          description?: string | null;
          type: "prompt" | "agent" | "workflow";
          config?: Record<string, unknown>;
          is_active?: boolean;
          version?: number;
          last_executed_at?: string | null;
          execution_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          name?: string;
          description?: string | null;
          type?: "prompt" | "agent" | "workflow";
          config?: Record<string, unknown>;
          is_active?: boolean;
          version?: number;
          last_executed_at?: string | null;
          execution_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_integrations_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      error_groups: {
        Row: {
          id: string;
          fingerprint: string;
          title: string;
          culprit: string | null;
          platform: string;
          level: "fatal" | "error" | "warning" | "info";
          status: "unresolved" | "resolved" | "ignored" | "muted";
          first_seen_at: string;
          last_seen_at: string;
          event_count: number;
          user_count: number;
          assigned_to: string | null;
          resolved_at: string | null;
          resolved_by: string | null;
          tags: Record<string, unknown>;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          fingerprint: string;
          title: string;
          culprit?: string | null;
          platform?: string;
          level?: "fatal" | "error" | "warning" | "info";
          status?: "unresolved" | "resolved" | "ignored" | "muted";
          first_seen_at?: string;
          last_seen_at?: string;
          event_count?: number;
          user_count?: number;
          assigned_to?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          tags?: Record<string, unknown>;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          fingerprint?: string;
          title?: string;
          culprit?: string | null;
          platform?: string;
          level?: "fatal" | "error" | "warning" | "info";
          status?: "unresolved" | "resolved" | "ignored" | "muted";
          first_seen_at?: string;
          last_seen_at?: string;
          event_count?: number;
          user_count?: number;
          assigned_to?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          tags?: Record<string, unknown>;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      error_events: {
        Row: {
          id: string;
          group_id: string;
          message: string;
          stack_trace: string | null;
          platform: string;
          environment: string;
          release: string | null;
          user_id: string | null;
          user_agent: string | null;
          ip_address: string | null;
          url: string | null;
          component: string | null;
          action: string | null;
          breadcrumbs: unknown[];
          context: Record<string, unknown>;
          tags: Record<string, unknown>;
          request: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          message: string;
          stack_trace?: string | null;
          platform?: string;
          environment?: string;
          release?: string | null;
          user_id?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          url?: string | null;
          component?: string | null;
          action?: string | null;
          breadcrumbs?: unknown[];
          context?: Record<string, unknown>;
          tags?: Record<string, unknown>;
          request?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          message?: string;
          stack_trace?: string | null;
          platform?: string;
          environment?: string;
          release?: string | null;
          user_id?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          url?: string | null;
          component?: string | null;
          action?: string | null;
          breadcrumbs?: unknown[];
          context?: Record<string, unknown>;
          tags?: Record<string, unknown>;
          request?: Record<string, unknown> | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "error_events_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "error_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      error_rate_limits: {
        Row: {
          fingerprint: string;
          window_start: string;
          event_count: number;
        };
        Insert: {
          fingerprint: string;
          window_start: string;
          event_count?: number;
        };
        Update: {
          fingerprint?: string;
          window_start?: string;
          event_count?: number;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          actor_email: string | null;
          action: string;
          resource: string;
          resource_id: string | null;
          changes: Record<string, unknown>;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          actor_email?: string | null;
          action: string;
          resource: string;
          resource_id?: string | null;
          changes?: Record<string, unknown>;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          actor_email?: string | null;
          action?: string;
          resource?: string;
          resource_id?: string | null;
          changes?: Record<string, unknown>;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_error_group_count: {
        Args: {
          p_fingerprint: string;
          p_title: string;
          p_culprit?: string;
          p_platform?: string;
          p_level?: string;
        };
        Returns: string;
      };
      check_error_rate_limit: {
        Args: {
          p_fingerprint: string;
          p_window_minutes?: number;
          p_max_per_window?: number;
        };
        Returns: boolean;
      };
      cleanup_error_rate_limits: {
        Args: {
          p_older_than_hours?: number;
        };
        Returns: number;
      };
    };
    Enums: {
      profile_role: "super_admin" | "admin" | "member" | "viewer";
      org_member_role: "owner" | "admin" | "member" | "viewer";
      subscription_plan: "free" | "starter" | "pro" | "enterprise";
      content_status: "draft" | "published" | "archived";
      content_format: "markdown" | "html" | "rich_text";
      page_content_type: "html" | "react" | "markdown";
      page_layout: "default" | "full_width" | "sidebar" | "blank";
      integration_type: "prompt" | "agent" | "workflow";
      app_name: "web" | "mobile_ios" | "mobile_android";
      deployment_env: "development" | "staging" | "production";
      error_level: "fatal" | "error" | "warning" | "info";
      error_status: "unresolved" | "resolved" | "ignored" | "muted";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
