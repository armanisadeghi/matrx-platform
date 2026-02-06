/**
 * SINGLE SOURCE OF TRUTH - Theme Configuration
 * B2B Enterprise Design System
 *
 * This file aggregates all design tokens and provides
 * a unified interface for the entire design system.
 *
 * IMPORTANT: Components should use NativeWind classes for styling.
 * This file provides programmatic access when needed.
 */

import { colors, type ColorScheme, type Colors } from "./colors";
import { typography, textStyles, type TextStyle } from "./typography";
import {
  spacing,
  componentSpacing,
  borderRadius,
  shadows,
  type Spacing,
  type BorderRadius,
} from "./spacing";

// Re-export all constants
export { colors, typography, textStyles, spacing, componentSpacing, borderRadius, shadows };
export type { ColorScheme, Colors, TextStyle, Spacing, BorderRadius };

/**
 * Theme configuration object
 * Contains all design tokens for the design system
 */
export const theme = {
  colors,
  typography,
  textStyles,
  spacing,
  componentSpacing,
  borderRadius,
  shadows,
} as const;

/**
 * Get colors for a specific color scheme
 */
export function getColors(colorScheme: ColorScheme): Colors {
  return colors[colorScheme];
}

/**
 * Animation durations (in milliseconds)
 */
export const durations = {
  instant: 0,
  fast: 100,
  normal: 200,
  slow: 300,
  slower: 500,
} as const;

/**
 * Animation easing curves
 */
export const easings = {
  linear: "linear",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
} as const;

/**
 * Z-index scale for layering
 */
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
  max: 100,
} as const;

/**
 * Breakpoints for responsive design
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Theme = typeof theme;
export type Duration = keyof typeof durations;
export type Easing = keyof typeof easings;
export type ZIndex = keyof typeof zIndex;
export type Breakpoint = keyof typeof breakpoints;
