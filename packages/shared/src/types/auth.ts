/**
 * Authentication Types
 *
 * Shared auth-related type definitions used across web and mobile.
 */

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  organizationId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "owner" | "admin" | "member" | "viewer";

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: User;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  plan: SubscriptionPlan;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionPlan = "free" | "starter" | "pro" | "enterprise";
