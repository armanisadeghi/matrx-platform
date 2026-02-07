import { Platform } from "react-native";
import { errorReporter } from "@matrx/shared";

/**
 * Mobile Error Tracking
 *
 * Initializes the shared error reporter with React Native-specific settings.
 * Call `initErrorTracking()` once at app startup in _layout.tsx.
 */

let initialized = false;

export function initErrorTracking() {
  if (initialized) return;
  initialized = true;

  const platform = Platform.OS === "ios" ? "mobile_ios" : "mobile_android";
  const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "";

  errorReporter.init({
    endpoint: `${apiUrl}/api/errors`,
    platform,
    environment: __DEV__ ? "development" : "production",
    release: process.env.EXPO_PUBLIC_APP_VERSION ?? "",
    enabled: !__DEV__, // Disabled in dev mode by default
    defaultTags: {
      os: Platform.OS,
      osVersion: String(Platform.Version),
    },
    debug: __DEV__,
  });
}
