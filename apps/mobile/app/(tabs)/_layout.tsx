/**
 * Tabs Layout
 *
 * Main tab navigation with platform-native styling.
 * Uses NativeTabs on iOS 26+ for Liquid Glass tab bar,
 * falls back to regular Tabs elsewhere.
 *
 * NativeTabs is NOT a drop-in replacement for Tabs — it uses a completely
 * different API (Trigger/Icon/Label children vs Tabs.Screen with options).
 * We maintain two rendering paths to handle this correctly.
 */

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { supportsLiquidGlass, isIOS } from "@/lib/platform";

// Conditionally import NativeTabs and its element components (SDK 54 API).
// In SDK 54, Icon/Label are standalone exports, not compound sub-components.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let NativeTabsModule: Record<string, any> | null = null;
if (supportsLiquidGlass) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    NativeTabsModule = require("expo-router/unstable-native-tabs");
  } catch {
    // Native tabs not available, use regular Tabs
  }
}

type IconName = keyof typeof Ionicons.glyphMap;

/**
 * Tab definitions — single source of truth for both native and JS tab paths.
 */
const tabs = [
  {
    name: "index",
    title: "Home",
    ionicon: "home" as IconName,
    sf: { default: "house", selected: "house.fill" },
    drawable: "home",
  },
  {
    name: "explore",
    title: "Explore",
    ionicon: "compass" as IconName,
    sf: { default: "safari", selected: "safari.fill" },
    drawable: "explore",
  },
  {
    name: "notifications",
    title: "Notifications",
    ionicon: "notifications" as IconName,
    sf: { default: "bell", selected: "bell.fill" },
    drawable: "notifications",
  },
  {
    name: "profile",
    title: "Profile",
    ionicon: "person" as IconName,
    sf: { default: "person", selected: "person.fill" },
    drawable: "person",
  },
] as const;

/**
 * NativeTabs layout for iOS 26+ with Liquid Glass.
 * Uses the SDK 54 API: standalone Icon and Label components as Trigger children.
 */
function NativeTabsLayout() {
  const NTabs = NativeTabsModule!.NativeTabs;
  const Icon = NativeTabsModule!.Icon;
  const Label = NativeTabsModule!.Label;

  return (
    <NTabs minimizeBehavior="onScrollDown">
      {tabs.map((tab) => (
        <NTabs.Trigger key={tab.name} name={tab.name}>
          <Icon sf={tab.sf} drawable={tab.drawable} />
          <Label>{tab.title}</Label>
        </NTabs.Trigger>
      ))}
    </NTabs>
  );
}

/**
 * Regular Tabs layout for non-iOS-26 platforms.
 * On iOS (pre-26): uses translucent tab bar with blur effect to approximate glass.
 * On Android/web: uses standard opaque tab bar with theme colors.
 */
function RegularTabsLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.DEFAULT,
        tabBarInactiveTintColor: colors.foreground.muted,
        tabBarStyle: isIOS
          ? {
            // iOS: translucent floating style
            position: "absolute" as const,
            backgroundColor: isDark
              ? "rgba(20, 20, 22, 0.75)"
              : "rgba(255, 255, 255, 0.75)",
            borderTopColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          }
          : {
            // Android/web: standard opaque bar
            backgroundColor: isDark
              ? colors.surface.DEFAULT
              : colors.background.DEFAULT,
            borderTopColor: colors.border.DEFAULT,
            borderTopWidth: 1,
          },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500" as const,
        },
        // iOS: enable blur effect behind tab bar
        ...(isIOS && {
          tabBarBackground: () => {
            // The expo-blur BlurView can be used here for
            // a more authentic translucent effect. For now,
            // the rgba background provides a good approximation.
            return null;
          },
        }),
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.ionicon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

export default function TabsLayout() {
  if (NativeTabsModule) {
    return <NativeTabsLayout />;
  }

  return <RegularTabsLayout />;
}
