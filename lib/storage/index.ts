/**
 * Storage Module
 *
 * Local-first data architecture using MMKV for high-performance storage.
 *
 * REQUIRED: Use MMKV instead of AsyncStorage everywhere.
 * REQUIRED: Use cache-first pattern for all API data.
 */

export {
  // Storage instances
  storage,
  secureStorage,
  cacheStorage,
  // Storage keys
  StorageKeys,
  // Type-safe wrappers
  AppStorage,
  SecureAppStorage,
} from "./mmkv";

export {
  // TTL constants
  CacheTTL,
  // Cache operations
  cacheData,
  getCachedData,
  getCacheEntry,
  isCacheStale,
  invalidateCache,
  invalidateCacheByPrefix,
  clearAllCache,
  // Data fetching patterns
  getData,
  fetchWithCache,
  preloadCache,
  dedupedRequest,
  smartFetch,
} from "./cache";
