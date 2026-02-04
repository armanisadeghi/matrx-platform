/**
 * Demo Route Layout
 *
 * Stack navigation for the component showcase.
 */

import { Stack } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

export default function DemoLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background.DEFAULT,
        },
      }}
    />
  );
}
