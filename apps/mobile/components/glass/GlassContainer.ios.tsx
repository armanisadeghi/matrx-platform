/**
 * iOS Glass Container
 *
 * On iOS 26+: Uses expo-glass-effect for native Liquid Glass.
 * On older iOS: Uses expo-blur BlurView for a frosted glass effect
 * that closely approximates the Liquid Glass aesthetic.
 *
 * Falls back to a simple View when Reduce Transparency is enabled.
 */

import { useState, useEffect } from "react";
import { View, AccessibilityInfo, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { supportsLiquidGlass } from "@/lib/platform";
import { cn } from "@/lib/utils";
import type { GlassContainerProps, GlassIntensity } from "./types";
import { borderRadiusMap } from "./types";

// Conditionally import GlassView (only available on iOS 26+)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let GlassViewComponent: any = null;
if (supportsLiquidGlass) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const glassModule = require("expo-glass-effect");
    GlassViewComponent = glassModule.GlassView;
  } catch {
    // expo-glass-effect not available
  }
}

/**
 * Map intensity to BlurView intensity values (0-100)
 */
const blurIntensityMap: Record<GlassIntensity, number> = {
  subtle: 20,
  light: 40,
  medium: 60,
  strong: 80,
};

/**
 * Map tint to overlay colors for the glass effect
 */
function getTintOverlay(
  tint: GlassContainerProps["tint"],
  isDark: boolean
): string {
  switch (tint) {
    case "primary":
      return isDark ? "rgba(59, 130, 246, 0.08)" : "rgba(30, 58, 95, 0.06)";
    case "secondary":
      return isDark ? "rgba(148, 163, 184, 0.08)" : "rgba(100, 116, 139, 0.06)";
    case "surface":
      return isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.25)";
    case "none":
    default:
      return "transparent";
  }
}

/**
 * Hook to check if user has Reduce Transparency enabled (accessibility)
 */
function useReduceTransparency(): boolean {
  const [reduceTransparency, setReduceTransparency] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceTransparencyEnabled().then(setReduceTransparency);
    const subscription = AccessibilityInfo.addEventListener(
      "reduceTransparencyChanged",
      setReduceTransparency
    );
    return () => subscription.remove();
  }, []);

  return reduceTransparency;
}

export function GlassContainer({
  children,
  intensity = "medium",
  tint = "surface",
  interactive = false,
  borderRadius = "lg",
  className,
  style,
  ...props
}: GlassContainerProps) {
  const { isDark } = useAppColorScheme();
  const reduceTransparency = useReduceTransparency();
  const radius = borderRadiusMap[borderRadius];

  // Accessibility fallback: solid View
  if (reduceTransparency) {
    return (
      <View
        className={cn("overflow-hidden", isDark ? "bg-surface" : "bg-surface", className)}
        style={[{ borderRadius: radius }, style]}
        {...props}
      >
        {children}
      </View>
    );
  }

  // iOS 26+: Use native Liquid Glass
  if (supportsLiquidGlass && GlassViewComponent) {
    return (
      <GlassViewComponent
        style={[{ borderRadius: radius, overflow: "hidden" }, style]}
        glassEffectStyle="clear"
        isInteractive={interactive}
        {...props}
      >
        <View className={className}>{children}</View>
      </GlassViewComponent>
    );
  }

  // Pre-iOS 26: Beautiful frosted glass with BlurView
  const blurAmount = blurIntensityMap[intensity];
  const tintOverlay = getTintOverlay(tint, isDark);

  return (
    <View
      style={[
        {
          borderRadius: radius,
          overflow: "hidden",
        },
        style,
      ]}
      {...props}
    >
      {/* Blur layer */}
      <BlurView
        intensity={blurAmount}
        tint={isDark ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />

      {/* Tint overlay */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: tintOverlay,
          },
        ]}
      />

      {/* Subtle border for glass edge definition */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: radius,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.12)"
              : "rgba(255, 255, 255, 0.5)",
          },
        ]}
      />

      {/* Content */}
      <View className={className}>{children}</View>
    </View>
  );
}
