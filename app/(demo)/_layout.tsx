/**
 * Demo Route Layout
 *
 * Stack navigation for the component showcase.
 */

import { Stack } from "expo-router";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";

export default function DemoLayout() {
  const { isDark } = useAppColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDark ? "#0A0A0B" : "#FFFFFF",
        },
      }}
    />
  );
}
