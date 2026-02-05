/**
 * MMKV Storage - High-performance local storage
 *
 * MMKV is up to 30x faster than AsyncStorage and provides
 * synchronous read/write operations for instant data access.
 *
 * IMPORTANT: Always prefer MMKV over AsyncStorage for all storage needs.
 */

import { MMKV } from "react-native-mmkv";

/**
 * Default storage instance for general app data
 */
export const storage = new MMKV({
  id: "app-storage",
});

/**
 * Secure storage instance for sensitive data
 * Note: For production, consider adding encryption key
 */
export const secureStorage = new MMKV({
  id: "secure-storage",
  // In production, add: encryptionKey: 'your-encryption-key'
});

/**
 * Cache storage instance for API responses
 */
export const cacheStorage = new MMKV({
  id: "cache-storage",
});

/**
 * Storage keys - centralized key management
 * Always define keys here to avoid typos and enable refactoring
 */
export const StorageKeys = {
  // User data
  USER_TOKEN: "user_token",
  USER_PROFILE: "user_profile",
  USER_PREFERENCES: "user_preferences",

  // App state
  ONBOARDING_COMPLETED: "onboarding_completed",
  COLOR_SCHEME: "color_scheme",
  LAST_SYNC: "last_sync",

  // Cache prefixes
  CACHE_PREFIX: "cache_",
  CACHE_TIMESTAMP_SUFFIX: "_timestamp",
} as const;

/**
 * Type-safe storage wrapper
 */
export const AppStorage = {
  // String operations
  getString: (key: string): string | undefined => storage.getString(key),
  setString: (key: string, value: string): void => storage.set(key, value),

  // Number operations
  getNumber: (key: string): number | undefined => storage.getNumber(key),
  setNumber: (key: string, value: number): void => storage.set(key, value),

  // Boolean operations
  getBoolean: (key: string): boolean | undefined => storage.getBoolean(key),
  setBoolean: (key: string, value: boolean): void => storage.set(key, value),

  // JSON operations (for objects and arrays)
  getJSON: <T>(key: string): T | undefined => {
    const value = storage.getString(key);
    if (!value) return undefined;
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  },
  setJSON: <T>(key: string, value: T): void => {
    storage.set(key, JSON.stringify(value));
  },

  // Delete operations
  delete: (key: string): void => storage.delete(key),
  clearAll: (): void => storage.clearAll(),

  // Check if key exists
  contains: (key: string): boolean => storage.contains(key),

  // Get all keys
  getAllKeys: (): string[] => storage.getAllKeys(),
};

/**
 * Secure storage wrapper for sensitive data
 */
export const SecureAppStorage = {
  getString: (key: string): string | undefined => secureStorage.getString(key),
  setString: (key: string, value: string): void => secureStorage.set(key, value),
  delete: (key: string): void => secureStorage.delete(key),
  clearAll: (): void => secureStorage.clearAll(),
};
