/**
 * Tabs Layout
 *
 * Main tab navigation with platform-native styling.
 * Uses native tabs on iOS 26+ for Liquid Glass tab bar.
 */

import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { isIOS, supportsLiquidGlass } from "@/lib/platform";

// Try to import native tabs (iOS 26+)
// This is unstable API and may change
let NativeTabs: typeof Tabs | null = null;
try {
  if (supportsLiquidGlass) {
    const nativeTabsModule = require("expo-router/unstable-native-tabs");
    NativeTabs = nativeTabsModule.NativeTabs;
  }
} catch {
  // Native tabs not available, use regular Tabs
}

type IconName = keyof typeof Ionicons.glyphMap;

interface TabIconProps {
  name: IconName;
  color: string;
  size: number;
}

function TabIcon({ name, color, size }: TabIconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function TabsLayout() {
  const { colors, isDark } = useTheme();

  // Common tab screen options
  const screenOptions = {
    headerShown: false,
    tabBarActiveTintColor: colors.primary.DEFAULT,
    tabBarInactiveTintColor: colors.foreground.muted,
    tabBarStyle: {
      backgroundColor: isDark ? colors.surface.DEFAULT : colors.background.DEFAULT,
      borderTopColor: colors.border.DEFAULT,
      borderTopWidth: 1,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: "500" as const,
    },
  };

  // Use native tabs on iOS 26+ for Liquid Glass, otherwise regular Tabs
  const TabsComponent = NativeTabs || Tabs;

  return (
    <TabsComponent screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="compass" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="notifications" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="person" color={color} size={size} />
          ),
        }}
      />
    </TabsComponent>
  );
}
