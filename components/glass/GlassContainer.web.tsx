/**
 * Web Glass Container
 *
 * Uses CSS backdrop-filter for glass effects on web.
 * Provides a consistent look across browsers that support backdrop-filter.
 */

import { View, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import type { GlassContainerProps } from "./types";
import { borderRadiusMap, intensityToBlur } from "./types";

/**
 * Convert a hex color to an rgba string with the given opacity.
 */
function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function GlassContainer({
  children,
  intensity = "medium",
  tint = "surface",
  borderRadius = "lg",
  className,
  style,
  ...props
}: GlassContainerProps) {
  const { colors } = useTheme();

  // Calculate values
  const radius = borderRadiusMap[borderRadius];
  const blurRadius = intensityToBlur[intensity];

  // Get background color based on tint and theme, derived from theme tokens
  const getBackgroundColor = () => {
    if (tint === "none") return "transparent";
    if (tint === "primary") return hexToRgba(colors.primary.DEFAULT, 0.1);
    if (tint === "secondary") return hexToRgba(colors.secondary.DEFAULT, 0.1);
    // Surface tint
    return hexToRgba(colors.surface.DEFAULT, 0.8);
  };

  return (
    <View
      className={className}
      style={[
        styles.container,
        {
          borderRadius: radius,
          backgroundColor: getBackgroundColor(),
          // Web-specific CSS properties for glass effect
          backdropFilter: `blur(${blurRadius}px)`,
          WebkitBackdropFilter: `blur(${blurRadius}px)`,
        } as any, // Type assertion needed for web-specific CSS properties
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});
