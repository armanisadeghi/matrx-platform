import baseConfig from "./base.mjs";

/**
 * ESLint configuration for Next.js apps.
 * Extends the shared base with Next.js-specific rules.
 */
export default [
  ...baseConfig,
  {
    ignores: [
      ".next/",
      "out/",
      "public/",
    ],
  },
];
