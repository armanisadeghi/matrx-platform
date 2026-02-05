/**
 * Widget Component
 *
 * iOS-style widget with glass effect and various sizes.
 * Matches the iOS 26 home screen widget aesthetic.
 */

import { View, Pressable, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
import { useAnimatedPress } from "@/hooks/useAnimatedPress";
import { useHaptics } from "@/hooks/useHaptics";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export type WidgetSize = "small" | "medium" | "large";

export interface WidgetProps {
  /**
   * Widget size (determines grid span)
   * - small: 2x2 (fits 4 per row)
   * - medium: 4x2 (half row width)
   * - large: 4x4 (full row width)
   */
  size?: WidgetSize;

  /**
   * Widget title
   */
  title?: string;

  /**
   * Widget icon
   */
  icon?: keyof typeof Ionicons.glyphMap;

  /**
   * Icon color
   */
  iconColor?: string;

  /**
   * Press handler
   */
  onPress?: () => void;

  /**
   * Whether to use glass effect
   * @default true
   */
  useGlass?: boolean;

  /**
   * Custom background color (when not using glass)
   */
  backgroundColor?: string;

  /**
   * Children content
   */
  children?: React.ReactNode;

  /**
   * Additional className
   */
  className?: string;

  /**
   * Additional style
   */
  style?: ViewStyle;
}

const sizeConfig: Record<WidgetSize, { width: number; height: number }> = {
  small: { width: 80, height: 80 },
  medium: { width: 168, height: 80 },
  large: { width: 168, height: 168 },
};

export function Widget({
  size = "small",
  title,
  icon,
  iconColor,
  onPress,
  useGlass = true,
  backgroundColor,
  children,
  className,
  style,
}: WidgetProps) {
  const { colors } = useTheme();
  const haptics = useHaptics();
  const { animatedStyle, handlers } = useAnimatedPress({
    scaleTo: 0.96,
    disabled: !onPress,
  });

  const config = sizeConfig[size];
  const resolvedIconColor = iconColor || colors.primary.DEFAULT;
  const resolvedBgColor = backgroundColor || colors.surface.elevated;

  const handlePress = () => {
    haptics.light();
    onPress?.();
  };

  const content = (
    <View className={cn("p-3 justify-between h-full", className)}>
      {/* Header with icon and title */}
      {(icon || title) && (
        <View className="flex-row items-center">
          {icon && (
            <Ionicons
              name={icon}
              size={size === "small" ? 18 : 22}
              color={resolvedIconColor}
            />
          )}
          {title && size !== "small" && (
            <Text variant="caption" color="secondary" className="ml-1.5">
              {title}
            </Text>
          )}
        </View>
      )}

      {/* Content */}
      <View className="flex-1 justify-end">{children}</View>

      {/* Title for small widgets at bottom */}
      {title && size === "small" && (
        <Text variant="caption" color="secondary" numberOfLines={1}>
          {title}
        </Text>
      )}
    </View>
  );

  const widgetContent = useGlass ? (
    <GlassContainer
      intensity="light"
      tint="surface"
      borderRadius="xl"
      style={[{ width: config.width, height: config.height }, style]}
    >
      {content}
    </GlassContainer>
  ) : (
    <View
      className="rounded-2xl overflow-hidden"
      style={[
        {
          width: config.width,
          height: config.height,
          backgroundColor: resolvedBgColor,
        },
        style,
      ]}
    >
      {content}
    </View>
  );

  if (onPress) {
    return (
      <Animated.View style={animatedStyle}>
        <Pressable onPress={handlePress} {...handlers}>
          {widgetContent}
        </Pressable>
      </Animated.View>
    );
  }

  return widgetContent;
}

/**
 * Pre-built widget variants for common use cases
 */

interface WeatherWidgetProps {
  temperature: string;
  condition: string;
  location: string;
  high?: string;
  low?: string;
  onPress?: () => void;
}

export function WeatherWidget({
  temperature,
  condition,
  location,
  high,
  low,
  onPress,
}: WeatherWidgetProps) {
  const { colors } = useTheme();

  return (
    <Widget size="medium" icon="partly-sunny" title={location} onPress={onPress}>
      <View>
        <Text variant="h2" color="default">
          {temperature}
        </Text>
        <Text variant="caption" color="secondary">
          {condition}
        </Text>
        {high && low && (
          <Text variant="caption" color="muted">
            H:{high} L:{low}
          </Text>
        )}
      </View>
    </Widget>
  );
}

interface CalendarWidgetProps {
  day: string;
  dayOfWeek: string;
  month: string;
  events?: string[];
  onPress?: () => void;
}

export function CalendarWidget({
  day,
  dayOfWeek,
  month,
  events,
  onPress,
}: CalendarWidgetProps) {
  return (
    <Widget size="small" icon="calendar" onPress={onPress}>
      <View className="items-center">
        <Text variant="caption" color="error" className="uppercase">
          {dayOfWeek}
        </Text>
        <Text variant="h2" color="default">
          {day}
        </Text>
      </View>
    </Widget>
  );
}

interface MusicWidgetProps {
  title: string;
  artist: string;
  albumArt?: React.ReactNode;
  isPlaying?: boolean;
  onPress?: () => void;
}

export function MusicWidget({
  title,
  artist,
  albumArt,
  isPlaying,
  onPress,
}: MusicWidgetProps) {
  const { colors } = useTheme();

  return (
    <Widget size="medium" icon="musical-notes" title="Music" onPress={onPress}>
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-lg bg-surface-elevated items-center justify-center mr-2">
          {albumArt || (
            <Ionicons name="musical-notes" size={20} color={colors.foreground.muted} />
          )}
        </View>
        <View className="flex-1">
          <Text variant="label" numberOfLines={1}>
            {title}
          </Text>
          <Text variant="caption" color="secondary" numberOfLines={1}>
            {artist}
          </Text>
        </View>
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={24}
          color={colors.foreground.DEFAULT}
        />
      </View>
    </Widget>
  );
}
