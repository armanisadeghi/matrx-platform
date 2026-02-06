/**
 * Dock & Navigation Demo
 *
 * Showcases iOS navigation patterns:
 * - Glass dock variations
 * - Floating tab bar
 * - Header variations
 * - Navigation patterns
 */

import { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text, Card, Button } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
import { HeaderLayout, Header } from "@/components/layouts";
import {
  GlassDock,
  FloatingBar,
  type DockItem,
} from "@/components/ios";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";

export default function DockDemo() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();

  const [activeDock, setActiveDock] = useState<"none" | "dock" | "tabbar">("none");
  const [activeTab, setActiveTab] = useState("home");
  const [headerStyle, setHeaderStyle] = useState<"default" | "large" | "transparent">("default");

  // Dock items
  const dockItems: DockItem[] = [
    { id: "phone", icon: "call", color: "#34C759", badgeCount: 2, onPress: () => haptics.light() },
    { id: "safari", icon: "compass", color: "#007AFF", onPress: () => haptics.light() },
    { id: "messages", icon: "chatbubble-ellipses", color: "#34C759", badgeCount: 5, onPress: () => haptics.light() },
    { id: "music", icon: "musical-notes", color: "#FF2D55", onPress: () => haptics.light() },
  ];

  // Floating bar actions (converted from tab bar items)
  const floatingBarActions = [
    {
      id: "home",
      icon: "home-outline" as const,
      label: "Home",
      onPress: () => { haptics.selection(); setActiveTab("home"); },
    },
    {
      id: "explore",
      icon: "compass-outline" as const,
      label: "Explore",
      onPress: () => { haptics.selection(); setActiveTab("explore"); },
    },
    {
      id: "notifications",
      icon: "notifications-outline" as const,
      label: "Alerts",
      onPress: () => { haptics.selection(); setActiveTab("notifications"); },
    },
    {
      id: "profile",
      icon: "person-outline" as const,
      label: "Profile",
      onPress: () => { haptics.selection(); setActiveTab("profile"); },
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <HeaderLayout
        header={{
          title: "Dock & Navigation",
          showBackButton: true,
          size: headerStyle === "large" ? "large" : "default",
          transparent: headerStyle === "transparent",
        }}
        safeAreaEdges={["bottom"]}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: activeDock !== "none" ? 120 : 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 py-4">
            {/* Dock Controls */}
            <Text variant="overline" color="secondary" className="mb-3 ml-1">
              Bottom Navigation
            </Text>

            <Card variant="outlined" className="mb-4">
              <Text variant="label" className="mb-3">
                Select Navigation Style
              </Text>
              <View className="gap-2">
                <Button
                  variant={activeDock === "dock" ? "primary" : "secondary"}
                  onPress={() => {
                    haptics.light();
                    setActiveDock(activeDock === "dock" ? "none" : "dock");
                  }}
                  leftIcon={<Ionicons name="apps" size={18} color={activeDock === "dock" ? "#FFFFFF" : colors.foreground.DEFAULT} />}
                >
                  {activeDock === "dock" ? "Hide Glass Dock" : "Show Glass Dock"}
                </Button>
                <Button
                  variant={activeDock === "tabbar" ? "primary" : "secondary"}
                  onPress={() => {
                    haptics.light();
                    setActiveDock(activeDock === "tabbar" ? "none" : "tabbar");
                  }}
                  leftIcon={<Ionicons name="menu" size={18} color={activeDock === "tabbar" ? "#FFFFFF" : colors.foreground.DEFAULT} />}
                >
                  {activeDock === "tabbar" ? "Hide Tab Bar" : "Show Floating Tab Bar"}
                </Button>
              </View>
            </Card>

            {/* Header Variations */}
            <Text variant="overline" color="secondary" className="mb-3 ml-1 mt-4">
              Header Styles
            </Text>

            <Card variant="glass" className="mb-4">
              <Text variant="label" className="mb-3">
                Header Variations
              </Text>
              <View className="gap-2">
                <Button
                  variant={headerStyle === "default" ? "primary" : "ghost"}
                  size="sm"
                  onPress={() => { haptics.light(); setHeaderStyle("default"); }}
                >
                  Default Header
                </Button>
                <Button
                  variant={headerStyle === "large" ? "primary" : "ghost"}
                  size="sm"
                  onPress={() => { haptics.light(); setHeaderStyle("large"); }}
                >
                  Large Header
                </Button>
              </View>
            </Card>

            {/* Dock Preview */}
            <Text variant="overline" color="secondary" className="mb-3 ml-1 mt-4">
              Dock Preview
            </Text>

            <Card variant="outlined" className="mb-4" padding="lg">
              <Text variant="label" className="mb-4 text-center">
                Glass Dock Style
              </Text>
              <View className="items-center">
                <GlassContainer intensity="medium" tint="surface" borderRadius="full">
                  <View className="flex-row items-center px-3 py-3">
                    {dockItems.map((item) => (
                      <View key={item.id} className="px-3">
                        <View
                          className="w-12 h-12 rounded-2xl items-center justify-center"
                          style={{ backgroundColor: item.color + "20" }}
                        >
                          <Ionicons name={item.icon} size={24} color={item.color} />
                        </View>
                      </View>
                    ))}
                  </View>
                </GlassContainer>
              </View>
              <Text variant="caption" color="muted" className="text-center mt-4">
                iOS 26 Liquid Glass dock with app icons
              </Text>
            </Card>

            {/* Tab Bar Preview */}
            <Card variant="outlined" className="mb-4" padding="lg">
              <Text variant="label" className="mb-4 text-center">
                Floating Tab Bar Style
              </Text>
              <View className="items-center">
                <GlassContainer intensity="medium" tint="surface" borderRadius="full">
                  <View className="flex-row items-center px-2 py-2">
                    {floatingBarActions.map((item) => (
                      <Pressable
                        key={item.id}
                        onPress={() => {
                          haptics.selection();
                          setActiveTab(item.id);
                        }}
                        className={`items-center px-4 py-2 rounded-full ${
                          activeTab === item.id ? "bg-primary/10" : ""
                        }`}
                      >
                        <Ionicons
                          name={item.icon}
                          size={22}
                          color={activeTab === item.id ? colors.primary.DEFAULT : colors.foreground.muted}
                        />
                        <Text
                          variant="caption"
                          style={{
                            color: activeTab === item.id ? colors.primary.DEFAULT : colors.foreground.muted,
                            fontWeight: activeTab === item.id ? "600" : "400",
                          }}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </GlassContainer>
              </View>
              <Text variant="caption" color="muted" className="text-center mt-4">
                Active tab: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </Text>
            </Card>

            {/* Design Notes */}
            <Card variant="filled" className="mt-4">
              <View className="flex-row items-start">
                <Ionicons
                  name="information-circle"
                  size={20}
                  color={colors.info.DEFAULT}
                  style={{ marginRight: 12, marginTop: 2 }}
                />
                <View className="flex-1">
                  <Text variant="label">iOS 26 Navigation Patterns</Text>
                  <Text variant="caption" color="secondary" className="mt-1">
                    iOS 26 introduces Liquid Glass effects for navigation elements.
                    The dock and tab bars use native blur effects that adapt to the
                    content behind them, creating a seamless visual experience.
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>
      </HeaderLayout>

      {/* Glass Dock */}
      {activeDock === "dock" && <GlassDock items={dockItems} />}

      {/* Floating Bar */}
      {activeDock === "tabbar" && <FloatingBar actions={floatingBarActions} visible mode="labeled" />}
    </View>
  );
}
