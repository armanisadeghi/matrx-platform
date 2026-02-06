/**
 * Icon component
 *
 * Theme-aware icon wrapper using Ionicons.
 * Automatically uses correct colors from theme.
 */

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

/**
 * Icon name type (Ionicons glyph names)
 */
export type IconName = keyof typeof Ionicons.glyphMap;

/**
 * Icon size presets
 */
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

/**
 * Semantic color variants
 */
export type IconColor =
  | "default"
  | "primary"
  | "secondary"
  | "muted"
  | "inverse"
  | "success"
  | "warning"
  | "error"
  | "info";

export interface IconProps {
  /**
   * Icon name from Ionicons
   */
  name: IconName;

  /**
   * Size preset or custom number
   * @default 'md'
   */
  size?: IconSize | number;

  /**
   * Semantic color
   * @default 'default'
   */
  color?: IconColor;

  /**
   * Custom color override (hex or rgb)
   */
  customColor?: string;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
}

/**
 * Size mapping
 */
const sizeMap: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 40,
};

/**
 * Icon component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Icon name="home" />
 *
 * // With size and color
 * <Icon name="checkmark-circle" size="lg" color="success" />
 *
 * // Custom size
 * <Icon name="settings" size={28} />
 *
 * // Custom color (escape hatch)
 * <Icon name="star" customColor="#FFD700" />
 * ```
 */
export function Icon({
  name,
  size = "md",
  color = "default",
  customColor,
  accessibilityLabel,
}: IconProps) {
  const { colors } = useTheme();

  // Resolve size
  const resolvedSize = typeof size === "number" ? size : sizeMap[size];

  // Resolve color from theme
  const getColor = (): string => {
    if (customColor) return customColor;

    switch (color) {
      case "primary":
        return colors.primary.DEFAULT;
      case "secondary":
        return colors.secondary.DEFAULT;
      case "muted":
        return colors.foreground.muted;
      case "inverse":
        return colors.foreground.inverse;
      case "success":
        return colors.success.DEFAULT;
      case "warning":
        return colors.warning.DEFAULT;
      case "error":
        return colors.error.DEFAULT;
      case "info":
        return colors.info.DEFAULT;
      case "default":
      default:
        return colors.foreground.DEFAULT;
    }
  };

  return (
    <Ionicons
      name={name}
      size={resolvedSize}
      color={getColor()}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
