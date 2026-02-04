/**
 * Default Glass Container
 *
 * This file serves as the fallback for platforms without specific implementations.
 * Metro bundler will automatically use platform-specific files when available:
 * - GlassContainer.ios.tsx for iOS
 * - GlassContainer.android.tsx for Android
 * - GlassContainer.web.tsx for Web
 */

import { View } from "react-native";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import type { GlassContainerProps } from "./types";
import { borderRadiusMap } from "./types";

export function GlassContainer({
  children,
  intensity: _intensity = "medium",
  tint: _tint = "surface",
  interactive: _interactive = false,
  borderRadius = "lg",
  className = "",
  style,
  ...props
}: GlassContainerProps) {
  const { isDark } = useAppColorScheme();

  // Calculate border radius
  const radius = borderRadiusMap[borderRadius];

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
