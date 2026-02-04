/**
 * Glass Effects Demo Page
 *
 * Showcases platform-native glass components.
 */

import { View, ImageBackground, Platform } from "react-native";
import { Text, Card, Divider } from "@/components/ui";
import { HeaderLayout } from "@/components/layouts";
import { GlassContainer } from "@/components/glass";
import { isIOS, isAndroid, supportsLiquidGlass, supportsMaterial3Expressive } from "@/lib/platform";

export default function GlassDemo() {
  return (
    <HeaderLayout
      header={{
        title: "Glass Effects",
        showBackButton: true,
      }}
    >
      <View className="px-4 py-4">
        <Text variant="body" color="secondary" className="mb-6">
          Glass effects use platform-native implementations for the best visual
          experience on each platform.
        </Text>

        {/* Platform Info */}
        <Card variant="filled" className="mb-6">
          <Text variant="label" className="mb-2">
            Platform Information
          </Text>
          <Text variant="caption" color="secondary">
            Platform: {Platform.OS} (v{Platform.Version})
          </Text>
          <Text variant="caption" color="secondary">
            Liquid Glass (iOS): {supportsLiquidGlass ? "Supported" : "Not supported"}
          </Text>
          <Text variant="caption" color="secondary">
            Material 3 Expressive (Android):{" "}
            {supportsMaterial3Expressive ? "Supported" : "Not supported"}
          </Text>
        </Card>

        {/* Glass Intensity */}
        <Text variant="overline" color="secondary" className="mb-3 ml-1">
          Glass Intensity
        </Text>

        <View className="mb-6">
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800",
            }}
            className="rounded-2xl overflow-hidden"
            resizeMode="cover"
          >
            <View className="p-4 gap-3">
              <GlassContainer intensity="subtle" className="p-3">
                <Text variant="label">Subtle</Text>
                <Text variant="caption" color="secondary">
                  Minimal blur effect
                </Text>
              </GlassContainer>

              <GlassContainer intensity="light" className="p-3">
                <Text variant="label">Light</Text>
                <Text variant="caption" color="secondary">
                  Light blur effect
                </Text>
              </GlassContainer>

              <GlassContainer intensity="medium" className="p-3">
                <Text variant="label">Medium</Text>
                <Text variant="caption" color="secondary">
                  Medium blur effect (default)
                </Text>
              </GlassContainer>

              <GlassContainer intensity="strong" className="p-3">
                <Text variant="label">Strong</Text>
                <Text variant="caption" color="secondary">
                  Strong blur effect
                </Text>
              </GlassContainer>
            </View>
          </ImageBackground>
        </View>

        {/* Glass Tints */}
        <Text variant="overline" color="secondary" className="mb-3 ml-1">
          Glass Tints
        </Text>

        <View className="mb-6">
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800",
            }}
            className="rounded-2xl overflow-hidden"
            resizeMode="cover"
          >
            <View className="p-4 gap-3">
              <GlassContainer tint="surface" className="p-3">
                <Text variant="label">Surface Tint</Text>
                <Text variant="caption" color="secondary">
                  Neutral glass appearance
                </Text>
              </GlassContainer>

              <GlassContainer tint="primary" className="p-3">
                <Text variant="label">Primary Tint</Text>
                <Text variant="caption" color="secondary">
                  Subtle brand color
                </Text>
              </GlassContainer>

              <GlassContainer tint="none" className="p-3">
                <Text variant="label">No Tint</Text>
                <Text variant="caption" color="secondary">
                  Pure transparent
                </Text>
              </GlassContainer>
            </View>
          </ImageBackground>
        </View>

        {/* Border Radius */}
        <Text variant="overline" color="secondary" className="mb-3 ml-1">
          Border Radius
        </Text>

        <View className="mb-6">
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1614851099511-773084f6911d?w=800",
            }}
            className="rounded-2xl overflow-hidden"
            resizeMode="cover"
          >
            <View className="p-4 gap-3">
              <GlassContainer borderRadius="sm" className="p-3">
                <Text variant="caption">borderRadius="sm"</Text>
              </GlassContainer>

              <GlassContainer borderRadius="md" className="p-3">
                <Text variant="caption">borderRadius="md"</Text>
              </GlassContainer>

              <GlassContainer borderRadius="lg" className="p-3">
                <Text variant="caption">borderRadius="lg" (default)</Text>
              </GlassContainer>

              <GlassContainer borderRadius="xl" className="p-3">
                <Text variant="caption">borderRadius="xl"</Text>
              </GlassContainer>

              <GlassContainer borderRadius="full" className="px-6 py-3 self-start">
                <Text variant="caption">borderRadius="full"</Text>
              </GlassContainer>
            </View>
          </ImageBackground>
        </View>

        <Divider spacing="lg" />

        <Card variant="outlined">
          <Text variant="label" className="mb-2">
            Implementation Notes
          </Text>
          <Text variant="caption" color="secondary" className="mb-2">
            • iOS: Uses expo-glass-effect with native UIVisualEffectView
          </Text>
          <Text variant="caption" color="secondary" className="mb-2">
            • Android: Uses expo-liquid-glass-native for blur effects
          </Text>
          <Text variant="caption" color="secondary">
            • Web: Falls back to CSS backdrop-filter
          </Text>
        </Card>
      </View>
    </HeaderLayout>
  );
}
