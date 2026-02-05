/**
 * ScreenLayout - Foundation for all screens
 *
 * Provides:
 * - SafeArea handling
 * - Edge-to-edge support
 * - Background theming
 * - Status bar configuration
 */

import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { cn } from "@/lib/utils";
import type { ScreenLayoutProps } from "./types";

/**
 * Get background class based on variant
 */
function getBackgroundClass(
  background: ScreenLayoutProps["background"]
): string {
  switch (background) {
    case "secondary":
      return "bg-background-secondary";
    case "tertiary":
      return "bg-background-tertiary";
    case "surface":
      return "bg-surface";
    case "transparent":
      return "bg-transparent";
    default:
      return "bg-background";
  }
}

/**
 * ScreenLayout component
 *
 * Base layout wrapper that handles safe areas, status bar, and background.
 * All other layouts should be built on top of this.
 *
 * @example
 * ```tsx
 * <ScreenLayout safeAreaEdges={['top', 'bottom']}>
 *   <Text>Screen content</Text>
 * </ScreenLayout>
 * ```
 */
export function ScreenLayout({
  children,
  safeAreaEdges = ["top", "bottom"],
  background = "background",
  edgeToEdge: _edgeToEdge = true,
  className,
  style,
  testID,
  ...props
}: ScreenLayoutProps) {
  const { isDark } = useAppColorScheme();
  const insets = useSafeAreaInsets();

  // Calculate safe area padding
  const safeAreaStyle = {
    paddingTop: safeAreaEdges.includes("top") ? insets.top : 0,
    paddingBottom: safeAreaEdges.includes("bottom") ? insets.bottom : 0,
    paddingLeft: safeAreaEdges.includes("left") ? insets.left : 0,
    paddingRight: safeAreaEdges.includes("right") ? insets.right : 0,
  };

  const backgroundClass = getBackgroundClass(background);

  return (
    <View
      className={cn("flex-1", backgroundClass, className)}
      style={[styles.container, safeAreaStyle, style]}
      testID={testID}
      {...props}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
