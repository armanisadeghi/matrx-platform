/**
 * API Module
 *
 * Supabase integration with performance-optimized patterns.
 *
 * SETUP REQUIRED:
 * 1. pnpm add @supabase/supabase-js
 * 2. Create .env with Supabase credentials
 * 3. Generate database types
 *
 * See docs/BACKEND_INTEGRATION.md for complete setup guide.
 */

export { supabase, type Database } from "./supabase";

export {
  fetchUserProfile,
  fetchPosts,
  fetchDashboardData,
  searchPosts,
  subscribeToMessages,
  createPost,
} from "./queries";

export {
  IMAGE_CONFIG,
  uploadImage,
  getImageUrl,
  type ImageRecord,
} from "./images";
