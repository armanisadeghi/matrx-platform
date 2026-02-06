# Backend Integration Guide

This guide covers integrating Supabase with the mobile app while maintaining performance standards.

## Quick Start

### 1. Install Dependencies

```bash
pnpm add @supabase/supabase-js
```

### 2. Environment Setup

Create `.env` in project root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Configure Supabase Client

Update `lib/api/supabase.ts` - uncomment the configuration code.

### 4. Generate Database Types

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/api/database.types.ts
```

## Query Patterns

### NEVER Do This

```typescript
// ❌ FORBIDDEN - Fetches all columns
const { data } = await supabase.from("users").select("*");

// ❌ FORBIDDEN - No limit
const { data } = await supabase.from("posts").select("id, title");

// ❌ FORBIDDEN - Multiple separate queries
const user = await getUser();
const posts = await getPosts();
const comments = await getComments();
```

### ALWAYS Do This

```typescript
// ✅ CORRECT - Specific fields only
const { data } = await supabase
  .from("users")
  .select("id, name, avatar_url")
  .eq("id", userId)
  .single();

// ✅ CORRECT - Always use limit
const { data } = await supabase
  .from("posts")
  .select("id, title, created_at")
  .order("created_at", { ascending: false })
  .limit(20);

// ✅ CORRECT - Single RPC for multiple tables
const { data } = await supabase.rpc("get_dashboard_data", { user_id: userId });
```

## Cache Integration

All queries MUST use the cache-first pattern:

```typescript
import { smartFetch, CacheTTL } from "@/lib/storage";

export async function fetchUserProfile(userId: string) {
  return smartFetch(
    `user_profile_${userId}`,
    async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, bio")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    },
    CacheTTL.MEDIUM // 5 minutes
  );
}
```

### TTL Guidelines

| Data Type | TTL | Constant |
|-----------|-----|----------|
| Frequently changing | 1 min | `CacheTTL.SHORT` |
| User data | 5 min | `CacheTTL.MEDIUM` |
| Semi-static | 30 min | `CacheTTL.LONG` |
| Static content | 1 hour | `CacheTTL.VERY_LONG` |
| Rarely changes | 24 hours | `CacheTTL.DAY` |

## Required Database Indexes

Add these indexes for all frequently queried columns:

```sql
-- User queries
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_username ON profiles(username);

-- Time-based queries
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Filter queries
CREATE INDEX idx_posts_status ON posts(status) WHERE status != 'archived';
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read = false;

-- Full-text search
CREATE INDEX idx_posts_title_search ON posts USING GIN (to_tsvector('english', title));

-- Composite indexes for common queries
CREATE INDEX idx_posts_user_status ON posts(user_id, status, created_at DESC);
```

## RPC Functions for Complex Queries

Create Supabase functions for multi-table queries:

```sql
-- Dashboard data in single query
CREATE OR REPLACE FUNCTION get_dashboard_data(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'profile', (
      SELECT row_to_json(p)
      FROM profiles p
      WHERE p.id = p_user_id
    ),
    'recent_posts', (
      SELECT COALESCE(json_agg(row_to_json(posts)), '[]'::json)
      FROM (
        SELECT id, title, created_at
        FROM posts
        WHERE author_id = p_user_id
        ORDER BY created_at DESC
        LIMIT 5
      ) posts
    ),
    'unread_count', (
      SELECT COUNT(*)::int
      FROM notifications
      WHERE user_id = p_user_id AND read = false
    )
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Image Upload with Blurhash

### Server-Side Blurhash (Recommended)

Create an Edge Function for blurhash generation:

```typescript
// supabase/functions/process-image/index.ts
import { encode } from "https://esm.sh/blurhash@2.0.5";
import sharp from "https://esm.sh/sharp@0.33.2";

Deno.serve(async (req) => {
  const { bucket, path } = await req.json();

  // Download image from storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(path);

  if (error) throw error;

  // Process with sharp
  const buffer = await data.arrayBuffer();
  const { data: pixels, info } = await sharp(buffer)
    .resize(32, 32, { fit: "inside" })
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  // Generate blurhash
  const blurhash = encode(
    new Uint8ClampedArray(pixels),
    info.width,
    info.height,
    4,
    3
  );

  return new Response(JSON.stringify({ blurhash }));
});
```

### Storage Trigger

Set up a database trigger to auto-generate blurhash:

```sql
-- Function to call edge function
CREATE OR REPLACE FUNCTION generate_image_blurhash()
RETURNS TRIGGER AS $$
BEGIN
  -- Call edge function asynchronously
  PERFORM net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/process-image',
    headers := '{"Authorization": "Bearer " || current_setting('supabase.service_role_key')}',
    body := json_build_object('bucket', TG_ARGV[0], 'path', NEW.name)::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on storage insert
CREATE TRIGGER on_image_upload
AFTER INSERT ON storage.objects
FOR EACH ROW
WHEN (NEW.bucket_id = 'images')
EXECUTE FUNCTION generate_image_blurhash('images');
```

## Real-Time Subscriptions

For real-time data, skip caching:

```typescript
export function subscribeToMessages(
  chatId: string,
  onMessage: (message: Message) => void
): () => void {
  const subscription = supabase
    .channel(`chat:${chatId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => onMessage(payload.new as Message)
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}
```

## Authentication with MMKV

The Supabase client is configured to use MMKV for token storage:

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: (key) => AppStorage.getString(key) ?? null,
      setItem: (key, value) => AppStorage.setString(key, value),
      removeItem: (key) => AppStorage.delete(key),
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

## Error Handling Pattern

```typescript
import { smartFetch, invalidateCache } from "@/lib/storage";

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select("id, username, avatar_url, bio")
      .single();

    if (error) throw error;

    // Invalidate cache on success
    invalidateCache(`user_profile_${userId}`);

    return { success: true, data };
  } catch (error) {
    // Return cached data on error
    const cached = getCachedData(`user_profile_${userId}`);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      cachedData: cached,
    };
  }
}
```

## Performance Checklist

Before deploying:

- [ ] All queries specify exact fields needed
- [ ] All list queries use `.limit()`
- [ ] Complex queries use RPC functions
- [ ] Required indexes are created
- [ ] Cache-first pattern used for all reads
- [ ] Blurhash generated for all images
- [ ] Real-time subscriptions properly cleaned up
- [ ] Error handling returns cached data as fallback
