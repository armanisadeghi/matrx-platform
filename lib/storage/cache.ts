/**
 * Cache-First Data Architecture
 *
 * CRITICAL: Always serve cached data first, refresh in background.
 * This ensures instant app responsiveness while keeping data fresh.
 *
 * TTL Guidelines:
 * - User profile: 5 minutes (300000ms)
 * - Static content: 1 hour (3600000ms)
 * - Frequently changing: 1 minute (60000ms)
 * - Real-time data: No cache, use subscriptions
 */

import { cacheStorage, StorageKeys } from "./mmkv";

/**
 * Default TTL values in milliseconds
 */
export const CacheTTL = {
  /** 1 minute - for frequently changing data */
  SHORT: 60 * 1000,
  /** 5 minutes - for user data and preferences */
  MEDIUM: 5 * 60 * 1000,
  /** 30 minutes - for semi-static content */
  LONG: 30 * 60 * 1000,
  /** 1 hour - for static content */
  VERY_LONG: 60 * 60 * 1000,
  /** 24 hours - for rarely changing content */
  DAY: 24 * 60 * 60 * 1000,
} as const;

/**
 * Cache entry with metadata
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Get cache key with prefix
 */
function getCacheKey(key: string): string {
  return `${StorageKeys.CACHE_PREFIX}${key}`;
}

/**
 * Store data in cache with timestamp
 */
export function cacheData<T>(key: string, data: T, ttl: number = CacheTTL.MEDIUM): void {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    ttl,
  };
  cacheStorage.set(getCacheKey(key), JSON.stringify(entry));
}

/**
 * Get cached data if valid (not expired)
 */
export function getCachedData<T>(key: string): T | null {
  const raw = cacheStorage.getString(getCacheKey(key));
  if (!raw) return null;

  try {
    const entry = JSON.parse(raw) as CacheEntry<T>;
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    return isExpired ? null : entry.data;
  } catch {
    return null;
  }
}

/**
 * Get cached data with metadata
 */
export function getCacheEntry<T>(key: string): CacheEntry<T> | null {
  const raw = cacheStorage.getString(getCacheKey(key));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CacheEntry<T>;
  } catch {
    return null;
  }
}

/**
 * Check if cache is stale (expired but data exists)
 */
export function isCacheStale(key: string): boolean {
  const entry = getCacheEntry(key);
  if (!entry) return true;
  return Date.now() - entry.timestamp > entry.ttl;
}

/**
 * Invalidate specific cache entry
 */
export function invalidateCache(key: string): void {
  cacheStorage.delete(getCacheKey(key));
}

/**
 * Invalidate all cache entries matching a prefix
 */
export function invalidateCacheByPrefix(prefix: string): void {
  const keys = cacheStorage.getAllKeys();
  const fullPrefix = getCacheKey(prefix);
  keys
    .filter((k) => k.startsWith(fullPrefix))
    .forEach((k) => cacheStorage.delete(k));
}

/**
 * Clear all cached data
 */
export function clearAllCache(): void {
  cacheStorage.clearAll();
}

/**
 * REQUIRED PATTERN: Cache-first data fetching
 *
 * Always returns cached data immediately (if available),
 * then refreshes in background.
 *
 * @example
 * ```ts
 * const userData = await getData(
 *   'user_profile',
 *   () => fetchUserProfile(userId),
 *   CacheTTL.MEDIUM
 * );
 * ```
 */
export async function getData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = CacheTTL.MEDIUM
): Promise<T> {
  const entry = getCacheEntry<T>(key);

  // If we have valid cached data
  if (entry && Date.now() - entry.timestamp < entry.ttl) {
    // Return cached immediately, refresh in background (fire-and-forget)
    fetchFn()
      .then((fresh) => cacheData(key, fresh, ttl))
      .catch(() => {
        // Silently fail - we have cached data
      });
    return entry.data;
  }

  // If we have stale cached data, return it while fetching fresh
  if (entry) {
    // Return stale data immediately
    fetchFn()
      .then((fresh) => cacheData(key, fresh, ttl))
      .catch(() => {
        // Keep stale data on error
      });
    return entry.data;
  }

  // No cached data - must wait for fresh fetch
  const fresh = await fetchFn();
  cacheData(key, fresh, ttl);
  return fresh;
}

/**
 * Fetch with cache - waits for fresh data if cache is stale
 *
 * Use this when you need guaranteed fresh data but want
 * to show cached data as a fallback on error.
 */
export async function fetchWithCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = CacheTTL.MEDIUM
): Promise<T> {
  try {
    const fresh = await fetchFn();
    cacheData(key, fresh, ttl);
    return fresh;
  } catch (error) {
    // On error, return cached data if available
    const cached = getCacheEntry<T>(key);
    if (cached) {
      return cached.data;
    }
    throw error;
  }
}

/**
 * Preload cache - fetch and cache data in background
 *
 * Use this to pre-fetch data that will be needed soon.
 *
 * @example
 * ```ts
 * // Preload next screen's data
 * preloadCache('next_screen_data', () => fetchNextScreenData());
 * ```
 */
export function preloadCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = CacheTTL.MEDIUM
): void {
  fetchFn()
    .then((data) => cacheData(key, data, ttl))
    .catch(() => {
      // Silently fail - this is a preload
    });
}

/**
 * Request deduplication
 *
 * Prevents duplicate concurrent requests for the same data.
 */
const pendingRequests = new Map<string, Promise<unknown>>();

export async function dedupedRequest<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  // Check if there's already a pending request for this key
  const pending = pendingRequests.get(key);
  if (pending) {
    return pending as Promise<T>;
  }

  // Create new request and track it
  const promise = fn().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}

/**
 * Combined: Deduped cache-first fetching
 *
 * This is the RECOMMENDED pattern for most data fetching.
 * Combines cache-first with request deduplication.
 */
export async function smartFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = CacheTTL.MEDIUM
): Promise<T> {
  return dedupedRequest(key, () => getData(key, fetchFn, ttl));
}
