/**
 * SINGLE SOURCE OF TRUTH - Spacing
 * B2B Enterprise Design System
 *
 * Spacing scale based on 4px base unit
 * These values complement the Tailwind spacing classes
 */

export const spacing = {
  // Base spacing scale (multiples of 4)
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  18: 72,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
} as const;

// Semantic spacing for consistent component layouts
export const componentSpacing = {
  // Component internal padding
  button: {
    paddingX: spacing[4],
    paddingY: spacing[2.5],
  },
  buttonSm: {
    paddingX: spacing[3],
    paddingY: spacing[1.5],
  },
  buttonLg: {
    paddingX: spacing[6],
    paddingY: spacing[3],
  },

  // Card padding
  card: {
    padding: spacing[4],
    paddingLg: spacing[6],
  },

  // Input padding
  input: {
    paddingX: spacing[3],
    paddingY: spacing[2.5],
  },

  // Modal padding
  modal: {
    padding: spacing[6],
    gap: spacing[4],
  },

  // List item spacing
  listItem: {
    paddingX: spacing[4],
    paddingY: spacing[3],
    gap: spacing[3],
  },

  // Section spacing
  section: {
    gap: spacing[6],
    padding: spacing[4],
  },

  // Page spacing
  page: {
    paddingX: spacing[4],
    paddingY: spacing[6],
    gap: spacing[6],
  },
} as const;

// Border radius scale
export const borderRadius = {
  none: 0,
  sm: 4,
  DEFAULT: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
  full: 9999,
} as const;

// Shadow definitions
export const shadows = {
  none: "none",
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  DEFAULT: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;

export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;
