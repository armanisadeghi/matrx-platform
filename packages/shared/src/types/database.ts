/**
 * Database Model Types
 *
 * These types represent the application-level data models.
 * They are derived from the Supabase-generated types in @matrx/supabase
 * but provide a cleaner interface for application code.
 *
 * When Supabase types are generated, update these to stay in sync.
 */

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  notifications: NotificationPreferences;
  language: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiIntegration {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  type: "prompt" | "agent" | "workflow";
  config: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
