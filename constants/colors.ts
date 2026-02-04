/**
 * SINGLE SOURCE OF TRUTH - Color Palette
 * B2B Enterprise Design System
 * Professional, Elegant, Minimalistic
 *
 * These values mirror the CSS variables in global.css
 * Use the CSS classes from NativeWind for styling
 * This file provides type-safe access when needed programmatically
 */

export const colors = {
  light: {
    // Primary Colors - Deep Blue (Trust & Professionalism)
    primary: {
      DEFAULT: "#1E3A5F",
      light: "#2D5A8A",
      dark: "#0F1F33",
    },

    // Secondary Colors - Warm Slate (Sophisticated Accent)
    secondary: {
      DEFAULT: "#64748B",
      light: "#94A3B8",
      dark: "#475569",
    },

    // Background Colors
    background: {
      DEFAULT: "#FFFFFF",
      secondary: "#F8FAFC",
      tertiary: "#F1F5F9",
    },

    // Surface Colors (Cards, Modals, Elevated Elements)
    surface: {
      DEFAULT: "#FFFFFF",
      elevated: "#FFFFFF",
    },

    // Border Colors
    border: {
      DEFAULT: "#E2E8F0",
      subtle: "#F1F5F9",
    },

    // Text Colors
    foreground: {
      DEFAULT: "#0F172A",
      secondary: "#475569",
      muted: "#94A3B8",
      inverse: "#F8FAFC",
    },

    // Semantic Colors
    success: {
      DEFAULT: "#059669",
      light: "#D1FAE5",
    },
    warning: {
      DEFAULT: "#D97706",
      light: "#FEF3C7",
    },
    error: {
      DEFAULT: "#DC2626",
      light: "#FEE2E2",
    },
    info: {
      DEFAULT: "#2563EB",
      light: "#DBEAFE",
    },
  },

  dark: {
    // Primary Colors - Lighter Blue for Dark Mode
    primary: {
      DEFAULT: "#3B82F6",
      light: "#60A5FA",
      dark: "#1D4ED8",
    },

    // Secondary Colors
    secondary: {
      DEFAULT: "#94A3B8",
      light: "#CBD5E1",
      dark: "#64748B",
    },

    // Background Colors
    background: {
      DEFAULT: "#0A0A0B",
      secondary: "#141416",
      tertiary: "#1E1E22",
    },

    // Surface Colors
    surface: {
      DEFAULT: "#141416",
      elevated: "#1E1E22",
    },

    // Border Colors
    border: {
      DEFAULT: "#2A2A2E",
      subtle: "#1E1E22",
    },

    // Text Colors
    foreground: {
      DEFAULT: "#F8FAFC",
      secondary: "#CBD5E1",
      muted: "#64748B",
      inverse: "#0F172A",
    },

    // Semantic Colors (Adjusted for dark background)
    success: {
      DEFAULT: "#22C55E",
      light: "#14532D",
    },
    warning: {
      DEFAULT: "#FBBF24",
      light: "#713F12",
    },
    error: {
      DEFAULT: "#F87171",
      light: "#7F1D1D",
    },
    info: {
      DEFAULT: "#60A5FA",
      light: "#1E3A8A",
    },
  },
} as const;

export type ColorScheme = "light" | "dark";

/** Color values structure (non-literal) */
export interface Colors {
  primary: { DEFAULT: string; light: string; dark: string };
  secondary: { DEFAULT: string; light: string; dark: string };
  background: { DEFAULT: string; secondary: string; tertiary: string };
  surface: { DEFAULT: string; elevated: string };
  border: { DEFAULT: string; subtle: string };
  foreground: { DEFAULT: string; secondary: string; muted: string; inverse: string };
  success: { DEFAULT: string; light: string };
  warning: { DEFAULT: string; light: string };
  error: { DEFAULT: string; light: string };
  info: { DEFAULT: string; light: string };
}
