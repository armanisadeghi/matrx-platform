/**
 * AppIcon Component
 *
 * iOS-style app icon with optional badge and label.
 * Matches the iOS 26 home screen aesthetic.
 */

import { View, Pressable, Image, type ImageSourcePropType } from "react-native";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Text, Badge } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
import { useAnimatedPress } from "@/hooks/useAnimatedPress";
import { useHaptics } from "@/hooks/useHaptics";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export interface AppIconProps {
  /**
   * App name displayed below the icon
   */
  label: string;

  /**
   * Ionicon name for the icon
   */
  icon?: keyof typeof Ionicons.glyphMap;

  /**
   * Custom image source (overrides icon)
   */
  image?: ImageSourcePropType;

  /**
   * Icon background color
   */
  color?: string;

  /**
   * Badge count (notification count)
   */
  badgeCount?: number;

  /**
   * Whether to use glass effect for the icon
   * @default false
   */
  useGlass?: boolean;

  /**
   * Press handler
   */
  onPress?: () => void;

  /**
   * Long press handler
   */
  onLongPress?: () => void;

  /**
   * Size variant
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";

  /**
   * Additional className
   */
  className?: string;
}

const sizeConfig = {
  sm: {
    iconContainer: 48,
    iconSize: 24,
    labelSize: "caption" as const,
    badgeSize: "sm" as const,
  },
  md: {
    iconContainer: 60,
    iconSize: 30,
    labelSize: "caption" as const,
    badgeSize: "sm" as const,
  },
  lg: {
    iconContainer: 72,
    iconSize: 36,
    labelSize: "bodySmall" as const,
    badgeSize: "md" as const,
  },
};

export function AppIcon({
  label,
  icon,
  image,
  color,
  badgeCount,
  useGlass = false,
  onPress,
  onLongPress,
  size = "md",
  className,
}: AppIconProps) {
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();
  const { animatedStyle, handlers } = useAnimatedPress({
    scaleTo: 0.9,
    disabled: !onPress,
  });

  const config = sizeConfig[size];
  const backgroundColor = color || colors.primary.DEFAULT;

  const handlePress = () => {
    haptics.light();
    onPress?.();
  };

  const handleLongPress = () => {
    haptics.medium();
    onLongPress?.();
  };

  const iconContent = (
    <View
      className="items-center justify-center"
      style={{
        width: config.iconContainer,
        height: config.iconContainer,
        borderRadius: config.iconContainer * 0.22, // iOS-style rounded corners
        backgroundColor: useGlass ? "transparent" : backgroundColor,
      }}
    >
      {image ? (
        <Image
          source={image}
          style={{
            width: config.iconContainer,
            height: config.iconContainer,
            borderRadius: config.iconContainer * 0.22,
          }}
        />
      ) : icon ? (
        <Ionicons
          name={icon}
          size={config.iconSize}
          color={useGlass ? colors.foreground.DEFAULT : "#FFFFFF"}
        />
      ) : null}
    </View>
  );

  const iconWrapper = useGlass ? (
    <GlassContainer
      intensity="medium"
      tint="surface"
      style={{
        width: config.iconContainer,
        height: config.iconContainer,
        borderRadius: config.iconContainer * 0.22,
      }}
    >
      <View className="flex-1 items-center justify-center">
        {icon && (
          <Ionicons
            name={icon}
            size={config.iconSize}
            color={colors.foreground.DEFAULT}
          />
        )}
      </View>
    </GlassContainer>
  ) : (
    iconContent
  );

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        disabled={!onPress}
        className={cn("items-center", className)}
        {...handlers}
      >
        <View className="relative">
          {iconWrapper}
          {badgeCount !== undefined && badgeCount > 0 && (
            <View className="absolute -top-1 -right-1">
              <Badge
                variant="error"
                size={config.badgeSize}
                count={badgeCount}
                maxCount={99}
              />
            </View>
          )}
        </View>
        <Text
          variant={config.labelSize}
          color="default"
          className="mt-1 text-center"
          numberOfLines={1}
          style={{ width: config.iconContainer + 8 }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
