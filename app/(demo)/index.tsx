/**
 * Demo Index Page
 *
 * Central hub linking to all component demonstrations.
 */

import { View, ScrollView, Platform } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Text,
  Card,
  Switch,
  Badge,
} from "@/components/ui";
import { ScreenLayout } from "@/components/layouts";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { useTheme } from "@/hooks/useTheme";

interface DemoLinkProps {
  href: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

function DemoLink({ href, title, description, icon }: DemoLinkProps) {
  const { colors } = useTheme();

  return (
    <Link href={href as never} asChild>
      <Card variant="outlined" pressable className="mb-3">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
            <Ionicons name={icon} size={20} color={colors.primary.DEFAULT} />
          </View>
          <View className="flex-1">
            <Text variant="label">{title}</Text>
            <Text variant="caption" color="secondary">
              {description}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.foreground.muted}
          />
        </View>
      </Card>
    </Link>
  );
}

export default function DemoIndex() {
  const insets = useSafeAreaInsets();
  const { colorScheme, toggleColorScheme, isDark } = useAppColorScheme();
  const { colors } = useTheme();

  return (
    <ScreenLayout safeAreaEdges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="py-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text variant="h2">Component Library</Text>
            <Badge variant="primary">v1.0.0</Badge>
          </View>
          <Text variant="body" color="secondary">
            Explore all available components and design tokens
          </Text>
        </View>

        {/* Theme Toggle */}
        <Card variant="filled" className="mb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={20}
                color={colors.warning.DEFAULT}
              />
              <Text variant="label" className="ml-3">
                {isDark ? "Dark Mode" : "Light Mode"}
              </Text>
            </View>
            <Switch value={isDark} onValueChange={toggleColorScheme} />
          </View>
          <Text variant="caption" color="muted" className="mt-2">
            Platform: {Platform.OS} | Color Scheme: {colorScheme}
          </Text>
        </Card>

        {/* Foundation */}
        <Text variant="overline" color="secondary" className="mb-3 ml-1">
          Foundation
        </Text>
        <DemoLink
          href="/(demo)/colors"
          title="Colors"
          description="Color palette and semantic colors"
          icon="color-palette"
        />
        <DemoLink
          href="/(demo)/typography"
          title="Typography"
          description="Text styles and variants"
          icon="text"
        />

        {/* Components */}
        <Text variant="overline" color="secondary" className="mb-3 ml-1 mt-4">
          Components
        </Text>
        <DemoLink
          href="/(demo)/buttons"
          title="Buttons"
          description="Button variants and states"
          icon="radio-button-on"
        />
        <DemoLink
          href="/(demo)/inputs"
          title="Inputs"
          description="Text inputs and form fields"
          icon="create"
        />
        <DemoLink
          href="/(demo)/cards"
          title="Cards"
          description="Card variants and compositions"
          icon="card"
        />
        <DemoLink
          href="/(demo)/toggles"
          title="Toggles"
          description="Switches, checkboxes, and radios"
          icon="toggle"
        />
        <DemoLink
          href="/(demo)/glass"
          title="Glass Effects"
          description="Platform-native glass components"
          icon="sparkles"
        />
        <DemoLink
          href="/(demo)/feedback"
          title="Feedback"
          description="Badges, spinners, and indicators"
          icon="notifications"
        />
        <DemoLink
          href="/(demo)/lists"
          title="Lists"
          description="List items and sections"
          icon="list"
        />
        <DemoLink
          href="/(demo)/avatars"
          title="Avatars"
          description="User avatars and groups"
          icon="people"
        />
      </ScrollView>
    </ScreenLayout>
  );
}
