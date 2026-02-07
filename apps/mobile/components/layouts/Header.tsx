/**
 * Header component
 *
 * Configurable header with back button, title, and action slots.
 * Uses glass effect on iOS for Liquid Glass appearance.
 */

import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { isIOS } from "@/lib/platform";
import { cn } from "@/lib/utils";
import { GlassContainer } from "@/components/glass";
import type { HeaderConfig } from "./types";
import { headerHeights } from "./types";

interface HeaderProps extends HeaderConfig {
  /**
   * Additional className for styling
   */
  className?: string;
}

export function Header({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  leftContent,
  rightContent,
  useGlassEffect = true,
  transparent = false,
  size = "default",
  className,
}: HeaderProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const height = headerHeights[size];

  // On iOS, use glass header with lighter font weight
  const effectiveTransparent = transparent;
  const showGlass = useGlassEffect && isIOS && !effectiveTransparent;
  const titleWeight = isIOS ? "font-medium" : "font-semibold";

  // Header content
  const headerContent = (
    <View
      className={cn("flex-row items-center justify-between px-4", className)}
      style={[styles.header, { height, paddingTop: effectiveTransparent ? insets.top : 0 }]}
    >
      {/* Left section */}
      <View className="flex-row items-center min-w-[60px]">
        {showBackButton && (
          <Pressable
            onPress={handleBackPress}
            className="p-2 -ml-2 rounded-full active:opacity-70"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={colors.foreground.DEFAULT}
            />
          </Pressable>
        )}
        {leftContent}
      </View>

      {/* Center section - Title */}
      <View className="flex-1 items-center">
        {title && (
          <Text
            className={`text-foreground ${titleWeight} text-lg`}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            className="text-foreground-secondary text-sm"
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right section */}
      <View className="flex-row items-center justify-end min-w-[60px]">
        {rightContent}
      </View>
    </View>
  );

  // Wrap in glass container on iOS if enabled
  if (showGlass) {
    return (
      <GlassContainer
        intensity={isIOS ? "medium" : "light"}
        tint="surface"
        borderRadius="none"
        style={[styles.glassHeader, { paddingTop: insets.top }]}
      >
        {headerContent}
      </GlassContainer>
    );
  }

  // Transparent header (iOS 26 default - content scrolls behind)
  if (effectiveTransparent) {
    return (
      <View
        className="absolute top-0 left-0 right-0 z-10"
        style={{ paddingTop: insets.top }}
      >
        {headerContent}
      </View>
    );
  }

  // Regular opaque header
  return (
    <View className="bg-surface">
      {headerContent}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  glassHeader: {
    // Glass container handles the styling
  },
});
