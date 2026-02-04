/**
 * Divider component
 *
 * Visual separator for content sections.
 */

import { View } from "react-native";
import { Text } from "./Text";

export interface DividerProps {
  /**
   * Orientation of the divider
   * @default 'horizontal'
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Spacing around the divider
   * @default 'md'
   */
  spacing?: "none" | "sm" | "md" | "lg";

  /**
   * Label text to display in the center (horizontal only)
   */
  label?: string;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * Spacing styles
 */
const spacingStyles: Record<
  NonNullable<DividerProps["spacing"]>,
  { horizontal: string; vertical: string }
> = {
  none: { horizontal: "", vertical: "" },
  sm: { horizontal: "my-2", vertical: "mx-2" },
  md: { horizontal: "my-4", vertical: "mx-4" },
  lg: { horizontal: "my-6", vertical: "mx-6" },
};

/**
 * Divider component
 *
 * @example
 * ```tsx
 * <Divider />
 * <Divider label="OR" />
 * <Divider orientation="vertical" />
 * ```
 */
export function Divider({
  orientation = "horizontal",
  spacing = "md",
  label,
  className = "",
}: DividerProps) {
  const spacingClass = spacingStyles[spacing][orientation];

  // Vertical divider
  if (orientation === "vertical") {
    return (
      <View
        className={`w-px bg-border self-stretch ${spacingClass} ${className}`}
      />
    );
  }

  // Horizontal divider with label
  if (label) {
    return (
      <View className={`flex-row items-center ${spacingClass} ${className}`}>
        <View className="flex-1 h-px bg-border" />
        <Text variant="caption" color="muted" className="px-3">
          {label}
        </Text>
        <View className="flex-1 h-px bg-border" />
      </View>
    );
  }

  // Simple horizontal divider
  return <View className={`h-px bg-border ${spacingClass} ${className}`} />;
}
