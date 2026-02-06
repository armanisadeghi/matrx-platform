import type { ViewProps } from "react-native";

/**
 * Glass effect intensity levels
 */
export type GlassIntensity = "subtle" | "light" | "medium" | "strong";

/**
 * Glass container props
 */
export interface GlassContainerProps extends ViewProps {
  /**
   * Children to render inside the glass container
   */
  children?: React.ReactNode;

  /**
   * Intensity of the glass blur effect
   * @default 'medium'
   */
  intensity?: GlassIntensity;

  /**
   * Optional tint color for the glass effect
   * Use semantic color names from the theme
   */
  tint?: "primary" | "secondary" | "surface" | "none";

  /**
   * Whether the glass effect is interactive (responds to touches)
   * Only affects iOS Liquid Glass
   * @default false
   */
  interactive?: boolean;

  /**
   * Border radius for the glass container
   * @default 'lg'
   */
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "full";

  /**
   * Additional className for NativeWind styling
   */
  className?: string;
}

/**
 * Map intensity to blur radius values
 */
export const intensityToBlur: Record<GlassIntensity, number> = {
  subtle: 4,
  light: 8,
  medium: 16,
  strong: 24,
};

/**
 * Map border radius names to values
 */
export const borderRadiusMap: Record<
  NonNullable<GlassContainerProps["borderRadius"]>,
  number
> = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
