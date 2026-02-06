/**
 * iOS Showcase Index
 *
 * Hub for all iOS 26 native component demonstrations.
 * Features Liquid Glass design language and native iOS patterns.
 */

import { View, ScrollView, Platform } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, Card, Badge } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
import { HeaderLayout } from "@/components/layouts";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";
import { supportsLiquidGlass } from "@/lib/platform";

interface ShowcaseLinkProps {
  href: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  isNew?: boolean;
}

function ShowcaseLink({
  href,
  title,
  description,
  icon,
  iconColor,
  isNew,
}: ShowcaseLinkProps) {
  const { colors } = useTheme();
  const haptics = useHaptics();

  return (
    <Link href={href as never} asChild>
      <Card
        variant="glass"
        pressable
        onPress={() => haptics.light()}
        className="mb-3"
      >
        <View className="flex-row items-center">
          <View
            className="w-12 h-12 rounded-xl items-center justify-center mr-4"
            style={{ backgroundColor: iconColor }}
          >
            <Ionicons name={icon} size={24} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text variant="label">{title}</Text>
              {isNew && (
                <Badge variant="primary" size="sm" className="ml-2">
                  New
                </Badge>
              )}
            </View>
            <Text variant="caption" color="secondary" className="mt-0.5">
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

export default function IOSShowcaseIndex() {
  const { colors, isDark } = useTheme();

  return (
    <HeaderLayout
      header={{
        title: "iOS 26 Showcase",
        showBackButton: true,
        rightContent: (
          <Badge variant={supportsLiquidGlass ? "success" : "warning"} size="sm">
            {supportsLiquidGlass ? "Native" : "Fallback"}
          </Badge>
        ),
      }}
      safeAreaEdges={["bottom"]}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4">
          {/* Hero Section */}
          <GlassContainer
            intensity="medium"
            tint="surface"
            borderRadius="xl"
            className="mb-6 p-4"
          >
            <View className="items-center">
              <View className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-info items-center justify-center mb-3">
                <Ionicons name="phone-portrait" size={40} color="#FFFFFF" />
              </View>
              <Text variant="h4" className="text-center">
                iOS 26 Liquid Glass
              </Text>
              <Text variant="body" color="secondary" className="text-center mt-1">
                Experience native iOS design patterns with Liquid Glass effects
              </Text>
              <View className="flex-row items-center mt-3 gap-4">
                <View className="flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-success mr-1.5" />
                  <Text variant="caption" color="muted">
                    {Platform.OS === "ios" ? `iOS ${Platform.Version}` : Platform.OS}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons
                    name={supportsLiquidGlass ? "checkmark-circle" : "alert-circle"}
                    size={14}
                    color={supportsLiquidGlass ? colors.success.DEFAULT : colors.warning.DEFAULT}
                  />
                  <Text variant="caption" color="muted" className="ml-1">
                    {supportsLiquidGlass ? "Glass Effects Active" : "Using Fallbacks"}
                  </Text>
                </View>
              </View>
            </View>
          </GlassContainer>

          {/* Core Experiences */}
          <Text variant="overline" color="secondary" className="mb-3 ml-1">
            Core Experiences
          </Text>

          <ShowcaseLink
            href="/(ios-showcase)/dashboard"
            title="Dashboard"
            description="iOS home screen with widgets and app icons"
            icon="apps"
            iconColor="#007AFF"
            isNew
          />

          <ShowcaseLink
            href="/(ios-showcase)/messages"
            title="Messages"
            description="Full iMessage-style chat experience"
            icon="chatbubbles"
            iconColor="#34C759"
            isNew
          />

          <ShowcaseLink
            href="/(ios-showcase)/settings"
            title="Settings"
            description="Complete iOS Settings app replica"
            icon="settings"
            iconColor="#8E8E93"
            isNew
          />

          {/* Components */}
          <Text variant="overline" color="secondary" className="mb-3 ml-1 mt-4">
            Components
          </Text>

          <ShowcaseLink
            href="/(ios-showcase)/notifications"
            title="Notifications"
            description="Banners, badges, sheets, and alerts"
            icon="notifications"
            iconColor="#FF3B30"
            isNew
          />

          <ShowcaseLink
            href="/(ios-showcase)/dock-demo"
            title="Dock & Navigation"
            description="Glass dock, tab bars, and floating controls"
            icon="menu"
            iconColor="#AF52DE"
          />

          <ShowcaseLink
            href="/(ios-showcase)/music-player"
            title="Music Player"
            description="Full-screen player with mini player"
            icon="musical-notes"
            iconColor="#FF2D55"
          />

          {/* Info Card */}
          <Card variant="outlined" className="mt-4">
            <View className="flex-row items-start">
              <Ionicons
                name="information-circle"
                size={20}
                color={colors.info.DEFAULT}
                style={{ marginRight: 12, marginTop: 2 }}
              />
              <View className="flex-1">
                <Text variant="label">About This Showcase</Text>
                <Text variant="caption" color="secondary" className="mt-1">
                  These demos showcase iOS 26 Liquid Glass design patterns using
                  native components where available. On non-iOS devices, appropriate
                  fallbacks are used while maintaining the design intent.
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </HeaderLayout>
  );
}
