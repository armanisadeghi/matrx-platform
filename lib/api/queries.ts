/**
 * Supabase Query Patterns
 *
 * CRITICAL: Follow these patterns for all database queries.
 *
 * Rules:
 * 1. NEVER use select('*') - always specify exact fields
 * 2. ALWAYS use .limit() - default to 20 items
 * 3. Use RPC functions for complex multi-table queries
 * 4. Combine with cache-first pattern from lib/storage
 */

import { smartFetch, CacheTTL } from "../storage";
// import { supabase } from "./supabase";

/**
 * Example: Fetch user profile with cache
 *
 * @example
 * ```ts
 * const profile = await fetchUserProfile(userId);
 * ```
 */
export async function fetchUserProfile(userId: string) {
  return smartFetch(
    `user_profile_${userId}`,
    async () => {
      // CORRECT: Specify exact fields needed
      // const { data, error } = await supabase
      //   .from("profiles")
      //   .select("id, username, avatar_url, bio, created_at")
      //   .eq("id", userId)
      //   .single();
      //
      // if (error) throw error;
      // return data;

      // Placeholder until Supabase is configured
      return {
        id: userId,
        username: "demo_user",
        avatar_url: null,
        bio: "Demo user profile",
        created_at: new Date().toISOString(),
      };
    },
    CacheTTL.MEDIUM // 5 minutes for user data
  );
}

/**
 * Example: Fetch paginated list with cache
 *
 * @example
 * ```ts
 * const posts = await fetchPosts(0, 20);
 * ```
 */
export async function fetchPosts(page: number = 0, pageSize: number = 20) {
  const offset = page * pageSize;

  return smartFetch(
    `posts_page_${page}`,
    async () => {
      // CORRECT: Specific fields, related data, limit, and pagination
      // const { data, error } = await supabase
      //   .from("posts")
      //   .select(`
      //     id,
      //     title,
      //     content,
      //     created_at,
      //     author:profiles(id, username, avatar_url)
      //   `)
      //   .order("created_at", { ascending: false })
      //   .range(offset, offset + pageSize - 1)
      //   .limit(pageSize);
      //
      // if (error) throw error;
      // return data;

      // Placeholder
      return [];
    },
    CacheTTL.SHORT // 1 minute for frequently changing data
  );
}

/**
 * Example: Batch query using RPC function
 *
 * Create this function in Supabase SQL Editor:
 *
 * ```sql
 * CREATE OR REPLACE FUNCTION get_dashboard_data(user_id UUID)
 * RETURNS JSON AS $$
 * DECLARE
 *   result JSON;
 * BEGIN
 *   SELECT json_build_object(
 *     'profile', (SELECT row_to_json(p) FROM profiles p WHERE p.id = user_id),
 *     'recent_posts', (
 *       SELECT json_agg(row_to_json(posts))
 *       FROM (SELECT id, title, created_at FROM posts WHERE author_id = user_id ORDER BY created_at DESC LIMIT 5) posts
 *     ),
 *     'notifications_count', (SELECT COUNT(*) FROM notifications WHERE user_id = user_id AND read = false)
 *   ) INTO result;
 *   RETURN result;
 * END;
 * $$ LANGUAGE plpgsql;
 * ```
 *
 * @example
 * ```ts
 * const dashboard = await fetchDashboardData(userId);
 * ```
 */
export async function fetchDashboardData(userId: string) {
  return smartFetch(
    `dashboard_${userId}`,
    async () => {
      // CORRECT: Single RPC call instead of multiple queries
      // const { data, error } = await supabase
      //   .rpc("get_dashboard_data", { user_id: userId });
      //
      // if (error) throw error;
      // return data;

      // Placeholder
      return {
        profile: null,
        recent_posts: [],
        notifications_count: 0,
      };
    },
    CacheTTL.MEDIUM
  );
}

/**
 * Example: Search with proper indexing
 *
 * Required index in Supabase:
 * CREATE INDEX idx_posts_title_search ON posts USING GIN (to_tsvector('english', title));
 *
 * @example
 * ```ts
 * const results = await searchPosts("react native");
 * ```
 */
export async function searchPosts(query: string, limit: number = 20) {
  // Don't cache search results (or use very short TTL)
  // const { data, error } = await supabase
  //   .from("posts")
  //   .select("id, title, content, created_at")
  //   .textSearch("title", query, { type: "websearch" })
  //   .limit(limit);
  //
  // if (error) throw error;
  // return data;

  // Placeholder
  return [];
}

/**
 * Example: Real-time subscription (no caching)
 *
 * @example
 * ```ts
 * const unsubscribe = subscribeToMessages(chatId, (message) => {
 *   setMessages(prev => [...prev, message]);
 * });
 *
 * // Cleanup on unmount
 * return () => unsubscribe();
 * ```
 */
export function subscribeToMessages(
  chatId: string,
  onMessage: (message: unknown) => void
): () => void {
  // Real-time data should NOT be cached
  // const subscription = supabase
  //   .channel(`chat:${chatId}`)
  //   .on(
  //     "postgres_changes",
  //     {
  //       event: "INSERT",
  //       schema: "public",
  //       table: "messages",
  //       filter: `chat_id=eq.${chatId}`,
  //     },
  //     (payload) => onMessage(payload.new)
  //   )
  //   .subscribe();
  //
  // return () => {
  //   subscription.unsubscribe();
  // };

  // Placeholder
  return () => {};
}

/**
 * Example: Optimistic update pattern
 *
 * @example
 * ```ts
 * await createPost({ title: "New Post", content: "..." });
 * ```
 */
export async function createPost(post: { title: string; content: string }) {
  // 1. Optimistically update local cache
  // 2. Send to server
  // 3. Revalidate cache on success/failure

  // const { data, error } = await supabase
  //   .from("posts")
  //   .insert(post)
  //   .select("id, title, content, created_at")
  //   .single();
  //
  // if (error) throw error;
  //
  // // Invalidate related caches
  // invalidateCacheByPrefix("posts_page_");
  //
  // return data;

  // Placeholder
  return { id: "new-id", ...post, created_at: new Date().toISOString() };
}
