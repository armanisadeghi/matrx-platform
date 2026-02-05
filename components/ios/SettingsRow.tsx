/**
 * SettingsRow Component
 *
 * iOS-style settings row with icon, label, value, and navigation.
 * Designed to match iOS Settings app appearance exactly.
 */

import { View, Pressable, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Text, Switch } from "@/components/ui";
import { useAnimatedPress } from "@/hooks/useAnimatedPress";
import { useHaptics } from "@/hooks/useHaptics";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export interface SettingsRowProps {
  /**
   * Row label
   */
  label: string;

  /**
   * Icon name
   */
  icon?: keyof typeof Ionicons.glyphMap;

  /**
   * Icon background color
   */
  iconColor?: string;

  /**
   * Value text (displayed on the right)
   */
  value?: string;

  /**
   * Whether this row has a toggle switch
   */
  hasSwitch?: boolean;

  /**
   * Switch value (when hasSwitch is true)
   */
  switchValue?: boolean;

  /**
   * Switch change handler
   */
  onSwitchChange?: (value: boolean) => void;

  /**
   * Whether to show chevron (navigation indicator)
   * @default true when onPress is provided and no switch
   */
  showChevron?: boolean;

  /**
   * Whether this is a destructive action
   */
  destructive?: boolean;

  /**
   * Press handler
   */
  onPress?: () => void;

  /**
   * Whether this is the last item in a section (no separator)
   */
  isLast?: boolean;

  /**
   * Custom right content
   */
  rightContent?: React.ReactNode;

  /**
   * Additional className
   */
  className?: string;
}

export function SettingsRow({
  label,
  icon,
  iconColor,
  value,
  hasSwitch,
  switchValue,
  onSwitchChange,
  showChevron,
  destructive,
  onPress,
  isLast,
  rightContent,
  className,
}: SettingsRowProps) {
  const { colors } = useTheme();
  const haptics = useHaptics();
  const isPressable = !!onPress && !hasSwitch;
  const { animatedStyle, handlers } = useAnimatedPress({
    scaleTo: 0.98,
    disabled: !isPressable,
  });

  const shouldShowChevron = showChevron ?? (isPressable && !hasSwitch);
  const resolvedIconColor = iconColor || colors.primary.DEFAULT;
  const labelColor = destructive ? colors.error.DEFAULT : colors.foreground.DEFAULT;

  const handlePress = () => {
    haptics.light();
    onPress?.();
  };

  const content = (
    <View
      className={cn(
        "flex-row items-center py-3 px-4 bg-surface",
        className
      )}
    >
      {/* Icon */}
      {icon && (
        <View
          className="w-7 h-7 rounded-md items-center justify-center mr-3"
          style={{ backgroundColor: resolvedIconColor }}
        >
          <Ionicons name={icon} size={18} color="#FFFFFF" />
        </View>
      )}

      {/* Label */}
      <Text
        variant="body"
        style={{ color: labelColor, flex: 1 }}
        numberOfLines={1}
      >
        {label}
      </Text>

      {/* Right content */}
      {rightContent ? (
        rightContent
      ) : hasSwitch ? (
        <Switch value={switchValue} onValueChange={onSwitchChange} />
      ) : (
        <View className="flex-row items-center">
          {value && (
            <Text variant="body" color="secondary" className="mr-1">
              {value}
            </Text>
          )}
          {shouldShowChevron && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.foreground.muted}
            />
          )}
        </View>
      )}
    </View>
  );

  const row = isPressable ? (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={handlePress} {...handlers}>
        {content}
      </Pressable>
    </Animated.View>
  ) : (
    content
  );

  return (
    <>
      {row}
      {!isLast && <View className="h-px bg-border ml-4" />}
    </>
  );
}

/**
 * SettingsGroup Component
 *
 * Groups multiple SettingsRow components with header and footer.
 */

export interface SettingsGroupProps {
  /**
   * Section header text
   */
  header?: string;

  /**
   * Section footer text
   */
  footer?: string;

  /**
   * Children (SettingsRow components)
   */
  children: React.ReactNode;

  /**
   * Additional className
   */
  className?: string;
}

export function SettingsGroup({
  header,
  footer,
  children,
  className,
}: SettingsGroupProps) {
  return (
    <View className={cn("mb-6", className)}>
      {header && (
        <Text
          variant="caption"
          color="secondary"
          className="px-4 pb-2 uppercase"
        >
          {header}
        </Text>
      )}
      <View className="rounded-xl overflow-hidden">{children}</View>
      {footer && (
        <Text variant="caption" color="muted" className="px-4 pt-2">
          {footer}
        </Text>
      )}
    </View>
  );
}

/**
 * SettingsProfile Component
 *
 * iOS-style profile row for Settings (Apple ID banner style).
 */

export interface SettingsProfileProps {
  /**
   * User name
   */
  name: string;

  /**
   * Subtitle (e.g., "Apple ID, iCloud, Media & Purchases")
   */
  subtitle?: string;

  /**
   * Avatar image URL
   */
  avatarUrl?: string;

  /**
   * Avatar initials (if no image)
   */
  avatarInitials?: string;

  /**
   * Press handler
   */
  onPress?: () => void;

  /**
   * Additional className
   */
  className?: string;
}

export function SettingsProfile({
  name,
  subtitle,
  avatarUrl,
  avatarInitials,
  onPress,
  className,
}: SettingsProfileProps) {
  const { colors } = useTheme();
  const haptics = useHaptics();
  const { animatedStyle, handlers } = useAnimatedPress({
    scaleTo: 0.98,
  });

  const handlePress = () => {
    haptics.light();
    onPress?.();
  };

  return (
    <Animated.View style={animatedStyle} className={className}>
      <Pressable onPress={handlePress} {...handlers}>
        <View className="flex-row items-center p-4 bg-surface rounded-xl">
          {/* Avatar */}
          <View
            className="w-16 h-16 rounded-full items-center justify-center mr-4"
            style={{ backgroundColor: colors.primary.container }}
          >
            {avatarUrl ? (
              <View
                className="w-full h-full rounded-full"
                style={{ backgroundColor: colors.surface.elevated }}
              />
            ) : (
              <Text variant="h3" style={{ color: colors.primary.DEFAULT }}>
                {avatarInitials || name.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>

          {/* Info */}
          <View className="flex-1">
            <Text variant="h5">{name}</Text>
            {subtitle && (
              <Text variant="bodySmall" color="secondary" className="mt-0.5">
                {subtitle}
              </Text>
            )}
          </View>

          {/* Chevron */}
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.foreground.muted}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

/**
 * SettingsSearch Component
 *
 * iOS-style search bar for Settings.
 */

import { useState } from "react";
import { TextInput } from "react-native";

export interface SettingsSearchProps {
  /**
   * Placeholder text
   * @default "Search"
   */
  placeholder?: string;

  /**
   * Search value
   */
  value?: string;

  /**
   * Change handler
   */
  onChangeText?: (text: string) => void;

  /**
   * Additional className
   */
  className?: string;
}

export function SettingsSearch({
  placeholder = "Search",
  value,
  onChangeText,
  className,
}: SettingsSearchProps) {
  const { colors, isDark } = useTheme();
  const backgroundColor = isDark ? colors.surface.elevated : "#E5E5EA";

  return (
    <View className={cn("px-4 pb-2", className)}>
      <View
        className="flex-row items-center rounded-xl px-3 py-2"
        style={{ backgroundColor }}
      >
        <Ionicons
          name="search"
          size={18}
          color={colors.foreground.muted}
          style={{ marginRight: 8 }}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.foreground.muted}
          style={{
            flex: 1,
            fontSize: 16,
            color: colors.foreground.DEFAULT,
            padding: 0,
          }}
        />
      </View>
    </View>
  );
}
