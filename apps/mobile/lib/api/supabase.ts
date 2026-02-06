/**
 * Supabase Client Configuration
 *
 * SETUP REQUIRED:
 * 1. Install: pnpm add @supabase/supabase-js
 * 2. Create .env file with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
 * 3. Uncomment the code below
 *
 * This file provides the Supabase client configuration and type-safe helpers.
 */

// import { createClient } from "@supabase/supabase-js";
// import { AppStorage } from "../storage";

/**
 * Environment variables (set in .env)
 *
 * EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
 * EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 */

// const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabase client with MMKV storage adapter
 *
 * Uses MMKV for auth token persistence (faster than AsyncStorage).
 */
// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     storage: {
//       getItem: (key: string) => AppStorage.getString(key) ?? null,
//       setItem: (key: string, value: string) => AppStorage.setString(key, value),
//       removeItem: (key: string) => AppStorage.delete(key),
//     },
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });

/**
 * Placeholder export until Supabase is configured
 */
export const supabase = null;

/**
 * Database types placeholder
 *
 * Generate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/api/database.types.ts
 */
export type Database = {
  public: {
    Tables: {
      // Define your tables here after generating types
      // Example:
      // users: {
      //   Row: { id: string; email: string; created_at: string };
      //   Insert: { id?: string; email: string; created_at?: string };
      //   Update: { id?: string; email?: string; created_at?: string };
      // };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
