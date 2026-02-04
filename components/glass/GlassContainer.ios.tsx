/**
 * iOS Liquid Glass Container
 *
 * Uses expo-glass-effect for native iOS 26+ Liquid Glass effects.
 * Falls back to a simple View on older iOS versions.
 */

import { View } from "react-native";
import { GlassView } from "expo-glass-effect";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { supportsLiquidGlass } from "@/lib/platform";
import type { GlassContainerProps } from "./types";
import { borderRadiusMap } from "./types";

export function GlassContainer({
  children,
  intensity = "medium",
  tint = "surface",
  interactive = false,
  borderRadius = "lg",
  className = "",
  style,
  ...props
}: GlassContainerProps) {
  const { isDark } = useAppColorScheme();

  // Calculate border radius
  const radius = borderRadiusMap[borderRadius];

  // If device doesn't support Liquid Glass, fall back to a styled View
  if (!supportsLiquidGlass) {
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

  // Map tint to iOS glass style
  const glassStyle = tint === "none" ? "regular" : "prominent";

  return (
    <GlassView
      style={[{ borderRadius: radius, overflow: "hidden" }, style]}
      glassStyle={glassStyle}
      isInteractive={interactive}
      {...props}
    >
      <View className={className}>{children}</View>
    </GlassView>
  );
}
