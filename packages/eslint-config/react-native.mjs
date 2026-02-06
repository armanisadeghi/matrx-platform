import baseConfig from "./base.mjs";

/**
 * ESLint configuration for React Native / Expo apps.
 * Extends the shared base with mobile-specific rules and ignores.
 */
export default [
  ...baseConfig,
  {
    ignores: [
      ".expo/",
      "dist/",
      "android/",
      "ios/",
      "web-build/",
      "babel.config.js",
      "metro.config.js",
      "eslint-plugins/",
      "scripts/",
    ],
  },
];
