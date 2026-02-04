/**
 * Web Glass Container
 *
 * Uses CSS backdrop-filter for glass effects on web.
 * Provides a consistent look across browsers that support backdrop-filter.
 */

import { View, StyleSheet } from "react-native";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import type { GlassContainerProps } from "./types";
import { borderRadiusMap, intensityToBlur } from "./types";

export function GlassContainer({
  children,
  intensity = "medium",
  tint = "surface",
  borderRadius = "lg",
  className = "",
  style,
  ...props
}: GlassContainerProps) {
  const { isDark } = useAppColorScheme();

  // Calculate values
  const radius = borderRadiusMap[borderRadius];
  const blurRadius = intensityToBlur[intensity];

  // Get background color based on tint and theme
  const getBackgroundColor = () => {
    if (tint === "none") return "transparent";
    if (tint === "primary") {
      return isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(30, 58, 95, 0.1)";
    }
    if (tint === "secondary") {
      return isDark ? "rgba(148, 163, 184, 0.1)" : "rgba(100, 116, 139, 0.1)";
    }
    // Surface tint
    return isDark ? "rgba(20, 20, 22, 0.8)" : "rgba(255, 255, 255, 0.8)";
  };

  return (
    <View
      className={className}
      style={[
        styles.container,
        {
          borderRadius: radius,
          backgroundColor: getBackgroundColor(),
          // @ts-expect-error - Web-specific CSS properties
          backdropFilter: `blur(${blurRadius}px)`,
          WebkitBackdropFilter: `blur(${blurRadius}px)`,
        },
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
