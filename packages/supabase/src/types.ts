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
          status: "building" | "deployed" | "failed" | "rolled_back";
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
          status?: "building" | "deployed" | "failed" | "rolled_back";
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
          status?: "building" | "deployed" | "failed" | "rolled_back";
          changelog?: string | null;
          is_current?: boolean;
          build_metadata?: Record<string, unknown>;
          deployed_by?: string | null;
          deployed_at?: string;
          created_at?: string;
        };
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
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
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
    };
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
