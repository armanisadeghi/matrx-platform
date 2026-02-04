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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
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
  const { colors } = useTheme();

  // Calculate values
  const radius = borderRadiusMap[borderRadius];
  const blurRadius = intensityToBlur[intensity];

  // Get tint color based on theme
  const getTintColor = () => {
    if (tint === "none") return "transparent";
    if (tint === "primary") return colors.primary.DEFAULT;
    if (tint === "secondary") return colors.secondary.DEFAULT;
    return colors.surface.DEFAULT;
  };

  // If device doesn't support Material 3 Expressive or module not available, fall back
  if (!supportsMaterial3Expressive || !LiquidGlassView) {
    return (
      <View
        className={`overflow-hidden bg-surface/85 ${className}`}
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
      surfaceColor={`${colors.surface.DEFAULT}80`}
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
