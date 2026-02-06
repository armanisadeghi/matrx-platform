/**
 * Platform detection utilities
 *
 * Single source for platform-specific logic
 */

import { Platform } from "react-native";

/**
 * Current platform
 */
export const platform = Platform.OS;

/**
 * Platform checks
 */
export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";
export const isWeb = Platform.OS === "web";
export const isNative = Platform.OS !== "web";

/**
 * Platform version
 */
export const platformVersion = Platform.Version;

/**
 * Check if running on iOS 26 or later (for Liquid Glass support)
 */
export const supportsLiquidGlass =
  isIOS && typeof platformVersion === "number" && platformVersion >= 26;

/**
 * Check if running on Android 16 or later (for Material 3 Expressive)
 */
export const supportsMaterial3Expressive =
  isAndroid && typeof platformVersion === "number" && platformVersion >= 36;

/**
 * Select value based on platform
 */
export function platformSelect<T>(options: {
  ios?: T;
  android?: T;
  web?: T;
  native?: T;
  default: T;
}): T {
  if (isIOS && options.ios !== undefined) return options.ios;
  if (isAndroid && options.android !== undefined) return options.android;
  if (isWeb && options.web !== undefined) return options.web;
  if (isNative && options.native !== undefined) return options.native;
  return options.default;
}

/**
 * Platform-specific constants
 */
export const platformConstants = {
  /** Default hit slop for touch targets */
  hitSlop: Platform.select({
    ios: 8,
    android: 12,
    default: 8,
  }),

  /** Minimum touch target size (accessibility) */
  minTouchTarget: Platform.select({
    ios: 44,
    android: 48,
    default: 44,
  }),

  /** Default border radius for buttons */
  buttonRadius: Platform.select({
    ios: 12,
    android: 16,
    default: 12,
  }),

  /** Default border radius for cards */
  cardRadius: Platform.select({
    ios: 16,
    android: 20,
    default: 16,
  }),

  /** Default border radius for modals */
  modalRadius: Platform.select({
    ios: 24,
    android: 28,
    default: 24,
  }),
} as const;
