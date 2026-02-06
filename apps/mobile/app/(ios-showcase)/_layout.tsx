/**
 * iOS Showcase Layout
 *
 * Stack navigation for iOS 26 native component demonstrations.
 */

import { Stack } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

export default function IOSShowcaseLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background.secondary,
        },
        animation: "slide_from_right",
      }}
    />
  );
}
