/**
 * SINGLE SOURCE OF TRUTH - Typography
 * B2B Enterprise Design System
 *
 * Font scales follow a consistent ratio for visual harmony
 * These values complement the Tailwind typography classes
 */

export const typography = {
  // Font Families
  fontFamily: {
    sans: "Inter",
    mono: "JetBrains Mono",
  },

  // Font Sizes with Line Heights
  // Format: [fontSize, lineHeight]
  fontSize: {
    "2xs": [10, 14], // Extra small labels
    xs: [12, 16], // Captions, hints
    sm: [14, 20], // Secondary text
    base: [16, 24], // Body text
    lg: [18, 28], // Emphasized body
    xl: [20, 28], // Small headings
    "2xl": [24, 32], // Section headings
    "3xl": [30, 36], // Page headings
    "4xl": [36, 40], // Large headings
    "5xl": [48, 48], // Display headings
  } as const,

  // Font Weights
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  } as const,

  // Letter Spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
  } as const,
} as const;

// Text style presets for common use cases
export const textStyles = {
  // Headings
  h1: {
    fontSize: typography.fontSize["4xl"][0],
    lineHeight: typography.fontSize["4xl"][1],
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  h2: {
    fontSize: typography.fontSize["3xl"][0],
    lineHeight: typography.fontSize["3xl"][1],
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  h3: {
    fontSize: typography.fontSize["2xl"][0],
    lineHeight: typography.fontSize["2xl"][1],
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.normal,
  },
  h4: {
    fontSize: typography.fontSize.xl[0],
    lineHeight: typography.fontSize.xl[1],
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.normal,
  },
  h5: {
    fontSize: typography.fontSize.lg[0],
    lineHeight: typography.fontSize.lg[1],
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.normal,
  },
  h6: {
    fontSize: typography.fontSize.base[0],
    lineHeight: typography.fontSize.base[1],
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.normal,
  },

  // Body Text
  bodyLarge: {
    fontSize: typography.fontSize.lg[0],
    lineHeight: typography.fontSize.lg[1],
    fontWeight: typography.fontWeight.normal,
  },
  body: {
    fontSize: typography.fontSize.base[0],
    lineHeight: typography.fontSize.base[1],
    fontWeight: typography.fontWeight.normal,
  },
  bodySmall: {
    fontSize: typography.fontSize.sm[0],
    lineHeight: typography.fontSize.sm[1],
    fontWeight: typography.fontWeight.normal,
  },

  // UI Text
  label: {
    fontSize: typography.fontSize.sm[0],
    lineHeight: typography.fontSize.sm[1],
    fontWeight: typography.fontWeight.medium,
  },
  caption: {
    fontSize: typography.fontSize.xs[0],
    lineHeight: typography.fontSize.xs[1],
    fontWeight: typography.fontWeight.normal,
  },
  overline: {
    fontSize: typography.fontSize.xs[0],
    lineHeight: typography.fontSize.xs[1],
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.wider,
  },

  // Code
  code: {
    fontSize: typography.fontSize.sm[0],
    lineHeight: typography.fontSize.sm[1],
    fontWeight: typography.fontWeight.normal,
  },
} as const;

export type TextStyle = keyof typeof textStyles;
