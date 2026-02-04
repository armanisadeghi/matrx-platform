/**
 * IconButton component
 *
 * Button with icon only, for toolbar actions and navigation.
 */

import { Pressable, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { isIOS } from "@/lib/platform";

/**
 * IconButton variant types
 */
export type IconButtonVariant = "default" | "filled" | "tinted" | "ghost";

/**
 * IconButton size types
 */
export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps {
  /**
   * Icon name from Ionicons
   */
  icon: keyof typeof Ionicons.glyphMap;

  /**
   * Button variant
   * @default 'default'
   */
  variant?: IconButtonVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: IconButtonSize;

  /**
   * Icon color override
   */
  color?: "primary" | "secondary" | "error" | "muted" | "inverse";

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the button is in loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Press handler
   */
  onPress?: () => void;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;

  /**
   * Additional className
   */
  className?: string;

  /**
   * Test ID
   */
  testID?: string;
}

/**
 * Size configurations
 */
const sizeConfig: Record<
  IconButtonSize,
  { container: number; icon: number; hitSlop: number }
> = {
  sm: { container: 32, icon: 18, hitSlop: 8 },
  md: { container: 40, icon: 22, hitSlop: 6 },
  lg: { container: 48, icon: 26, hitSlop: 4 },
};

/**
 * IconButton component
 *
 * @example
 * ```tsx
 * <IconButton icon="close" onPress={handleClose} />
 * <IconButton icon="heart" variant="filled" color="error" />
 * <IconButton icon="settings" variant="tinted" size="lg" />
 * ```
 */
export function IconButton({
  icon,
  variant = "default",
  size = "md",
  color,
  disabled = false,
  loading = false,
  onPress,
  accessibilityLabel,
  className = "",
  testID,
}: IconButtonProps) {
  const { colors, isDark } = useTheme();
  const config = sizeConfig[size];
  const isDisabled = disabled || loading;

  // Determine icon color
  const getIconColor = () => {
    if (color === "primary") return colors.primary.DEFAULT;
    if (color === "secondary") return colors.secondary.DEFAULT;
    if (color === "error") return colors.error.DEFAULT;
    if (color === "muted") return colors.foreground.muted;
    if (color === "inverse") return colors.foreground.inverse;

    // Default based on variant
    if (variant === "filled") return "#FFFFFF";
    return colors.foreground.DEFAULT;
  };

  // Determine background based on variant
  const getBackgroundClass = () => {
    switch (variant) {
      case "filled":
        return "bg-primary";
      case "tinted":
        return isDark ? "bg-primary/20" : "bg-primary/10";
      case "ghost":
        return "bg-transparent";
      default:
        return "bg-transparent";
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      testID={testID}
      hitSlop={{
        top: config.hitSlop,
        bottom: config.hitSlop,
        left: config.hitSlop,
        right: config.hitSlop,
      }}
      className={`
        items-center justify-center rounded-full
        ${getBackgroundClass()}
        ${isDisabled ? "opacity-50" : ""}
        ${className}
      `}
      style={({ pressed }) => ({
        width: config.container,
        height: config.container,
        opacity: pressed && !isDisabled ? (isIOS ? 0.7 : 1) : 1,
        backgroundColor:
          pressed && !isDisabled && variant === "default"
            ? isDark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.05)"
            : undefined,
      })}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "filled" ? "#FFFFFF" : colors.primary.DEFAULT}
        />
      ) : (
        <Ionicons name={icon} size={config.icon} color={getIconColor()} />
      )}
    </Pressable>
  );
}
