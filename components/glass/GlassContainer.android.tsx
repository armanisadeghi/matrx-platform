/**
 * Android Glass Container
 *
 * Uses expo-liquid-glass-native for Android Material 3 Expressive glass effects.
 * Falls back to a styled View on older Android versions.
 */

import { View, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { supportsMaterial3Expressive } from "@/lib/platform";
import type { GlassContainerProps } from "./types";
import { borderRadiusMap, intensityToBlur } from "./types";

// Conditionally import LiquidGlassView to avoid errors on unsupported platforms
let LiquidGlassView: React.ComponentType<{
  blurRadius?: number;
  lensRadiusX?: number;
  lensRadiusY?: number;
  tintColor?: string;
  surfaceColor?: string;
  style?: object;
  children?: React.ReactNode;
}> | null = null;

try {
  // Dynamic import for Android-specific module
  const liquidGlass = require("expo-liquid-glass-native");
  LiquidGlassView = liquidGlass.LiquidGlassView;
} catch {
  // Module not available, will fall back to View
}

export function GlassContainer({
  children,
  intensity = "medium",
  tint = "surface",
  borderRadius = "lg",
  className = "",
  style,
  ...props
}: GlassContainerProps) {
  const { isDark } = useTheme();

  // Calculate values
  const radius = borderRadiusMap[borderRadius];
  const blurRadius = intensityToBlur[intensity];

  // Get tint color based on theme
  const getTintColor = () => {
    if (tint === "none") return "transparent";
    if (tint === "primary") return isDark ? "#3B82F6" : "#1E3A5F";
    if (tint === "secondary") return isDark ? "#94A3B8" : "#64748B";
    return isDark ? "#141416" : "#FFFFFF";
  };

  // If device doesn't support Material 3 Expressive or module not available, fall back
  if (!supportsMaterial3Expressive || !LiquidGlassView) {
    return (
      <View
        className={`overflow-hidden ${
          isDark ? "bg-surface/80" : "bg-surface/90"
        } ${className}`}
        style={[{ borderRadius: radius }, style]}
        {...props}
      >
        {children}
      </View>
    );
  }

  return (
    <LiquidGlassView
      blurRadius={blurRadius}
      lensRadiusX={12}
      lensRadiusY={24}
      tintColor={getTintColor()}
      surfaceColor={isDark ? "#14141680" : "#FFFFFF80"}
      style={[styles.container, { borderRadius: radius }, style]}
    >
      <View className={className}>{children}</View>
    </LiquidGlassView>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});
