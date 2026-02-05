/**
 * Settings Components
 *
 * iOS-style settings components matching iOS 26 Settings app.
 * Includes rows, groups, hero cards, profiles, and more.
 */

import { useState } from "react";
import { View, Pressable, TextInput, ScrollView, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Switch, Avatar } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
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

/**
 * SettingsHeroCard Component
 *
 * iOS-style hero card for settings pages (like General, Bluetooth).
 * Shows icon, title, and optional description.
 */

export interface SettingsHeroCardProps {
  /**
   * Icon name
   */
  icon: keyof typeof Ionicons.glyphMap;

  /**
   * Icon background color
   */
  iconColor: string;

  /**
   * Card title
   */
  title: string;

  /**
   * Card description
   */
  description?: string;

  /**
   * Learn more link text
   */
  learnMoreText?: string;

  /**
   * Learn more press handler
   */
  onLearnMore?: () => void;

  /**
   * Children content (e.g., toggle row)
   */
  children?: React.ReactNode;

  /**
   * Additional className
   */
  className?: string;
}

export function SettingsHeroCard({
  icon,
  iconColor,
  title,
  description,
  learnMoreText,
  onLearnMore,
  children,
  className,
}: SettingsHeroCardProps) {
  const { colors } = useTheme();
  const haptics = useHaptics();

  return (
    <View className={cn("mx-4 mb-4", className)}>
      <View className="bg-surface rounded-2xl p-4">
        {/* Icon */}
        <View
          className="w-14 h-14 rounded-xl items-center justify-center mb-3"
          style={{ backgroundColor: iconColor }}
        >
          <Ionicons name={icon} size={32} color="#FFFFFF" />
        </View>

        {/* Title */}
        <Text variant="h4" className="mb-1">
          {title}
        </Text>

        {/* Description */}
        {description && (
          <Text variant="body" color="secondary" className="leading-5">
            {description}
            {learnMoreText && (
              <Text
                variant="body"
                style={{ color: colors.primary.DEFAULT }}
                onPress={() => {
                  haptics.light();
                  onLearnMore?.();
                }}
              >
                {" "}
                {learnMoreText}
              </Text>
            )}
          </Text>
        )}

        {/* Children (e.g., toggle row) */}
        {children && (
          <>
            <View className="h-px bg-border my-3" />
            {children}
          </>
        )}
      </View>
    </View>
  );
}

/**
 * SettingsInfoRow Component
 *
 * Simple label/value row without icon (like in About page).
 */

export interface SettingsInfoRowProps {
  /**
   * Row label
   */
  label: string;

  /**
   * Row value
   */
  value: string;

  /**
   * Whether the value is selectable/copyable
   */
  selectable?: boolean;

  /**
   * Whether to show chevron (for editable values)
   */
  showChevron?: boolean;

  /**
   * Press handler
   */
  onPress?: () => void;

  /**
   * Whether this is the last item (no separator)
   */
  isLast?: boolean;

  /**
   * Value color
   */
  valueColor?: "default" | "secondary" | "muted" | "primary";
}

export function SettingsInfoRow({
  label,
  value,
  selectable,
  showChevron,
  onPress,
  isLast,
  valueColor = "secondary",
}: SettingsInfoRowProps) {
  const { colors } = useTheme();
  const haptics = useHaptics();

  const handlePress = () => {
    haptics.light();
    onPress?.();
  };

  const content = (
    <View className="flex-row items-center justify-between py-3 px-4 bg-surface">
      <Text variant="body">{label}</Text>
      <View className="flex-row items-center">
        <Text
          variant="body"
          color={valueColor}
          selectable={selectable}
          className="mr-1"
        >
          {value}
        </Text>
        {showChevron && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.foreground.muted}
          />
        )}
      </View>
    </View>
  );

  return (
    <>
      {onPress ? (
        <Pressable onPress={handlePress}>{content}</Pressable>
      ) : (
        content
      )}
      {!isLast && <View className="h-px bg-border ml-4" />}
    </>
  );
}

/**
 * SettingsDeviceRow Component
 *
 * Row for paired devices (like in Bluetooth settings).
 */

export interface SettingsDeviceRowProps {
  /**
   * Device name
   */
  name: string;

  /**
   * Device status
   */
  status?: string;

  /**
   * Device icon or emoji
   */
  icon?: string | keyof typeof Ionicons.glyphMap;

  /**
   * Whether to show info button
   */
  showInfo?: boolean;

  /**
   * Info button press handler
   */
  onInfoPress?: () => void;

  /**
   * Row press handler
   */
  onPress?: () => void;

  /**
   * Whether this is the last item
   */
  isLast?: boolean;
}

export function SettingsDeviceRow({
  name,
  status,
  icon,
  showInfo = true,
  onInfoPress,
  onPress,
  isLast,
}: SettingsDeviceRowProps) {
  const { colors } = useTheme();
  const haptics = useHaptics();

  const handlePress = () => {
    haptics.light();
    onPress?.();
  };

  const handleInfoPress = () => {
    haptics.light();
    onInfoPress?.();
  };

  // Check if icon is an emoji (not an Ionicon name)
  const isEmoji = icon && icon.length <= 2;

  const content = (
    <View className="flex-row items-center justify-between py-3 px-4 bg-surface">
      <View className="flex-row items-center flex-1">
        {icon && (
          <View className="mr-3">
            {isEmoji ? (
              <Text style={{ fontSize: 20 }}>{icon}</Text>
            ) : (
              <Ionicons
                name={icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color={colors.foreground.DEFAULT}
              />
            )}
          </View>
        )}
        <Text variant="body" numberOfLines={1} className="flex-1">
          {name}
        </Text>
      </View>
      <View className="flex-row items-center">
        {status && (
          <Text variant="body" color="secondary" className="mr-2">
            {status}
          </Text>
        )}
        {showInfo && (
          <Pressable
            onPress={handleInfoPress}
            className="w-6 h-6 rounded-full border items-center justify-center"
            style={{ borderColor: colors.primary.DEFAULT }}
          >
            <Ionicons
              name="information"
              size={16}
              color={colors.primary.DEFAULT}
            />
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <>
      {onPress ? (
        <Pressable onPress={handlePress}>{content}</Pressable>
      ) : (
        content
      )}
      {!isLast && <View className="h-px bg-border ml-4" />}
    </>
  );
}

/**
 * SettingsProfileHeader Component
 *
 * Large centered profile header (like Apple Account page).
 */

export interface SettingsProfileHeaderProps {
  /**
   * User name
   */
  name: string;

  /**
   * Email or subtitle
   */
  email?: string;

  /**
   * Avatar URL
   */
  avatarUrl?: string;

  /**
   * Press handler
   */
  onPress?: () => void;

  /**
   * Additional className
   */
  className?: string;
}

export function SettingsProfileHeader({
  name,
  email,
  avatarUrl,
  onPress,
  className,
}: SettingsProfileHeaderProps) {
  const { colors } = useTheme();
  const haptics = useHaptics();

  const handlePress = () => {
    haptics.light();
    onPress?.();
  };

  const content = (
    <View className={cn("items-center py-6", className)}>
      {/* Large Avatar */}
      <View className="mb-4">
        <Avatar name={name} size="xl" />
      </View>

      {/* Name */}
      <Text variant="h3" className="mb-1">
        {name}
      </Text>

      {/* Email */}
      {email && (
        <Text variant="body" color="secondary">
          {email}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={handlePress}>{content}</Pressable>;
  }

  return content;
}

/**
 * SettingsFamilyRow Component
 *
 * Row with stacked family member avatars.
 */

export interface SettingsFamilyRowProps {
  /**
   * Family member names (for avatar generation)
   */
  members: string[];

  /**
   * Row label
   */
  label?: string;

  /**
   * Press handler
   */
  onPress?: () => void;

  /**
   * Whether this is the last item
   */
  isLast?: boolean;
}

export function SettingsFamilyRow({
  members,
  label = "Family",
  onPress,
  isLast,
}: SettingsFamilyRowProps) {
  const { colors } = useTheme();
  const haptics = useHaptics();

  const handlePress = () => {
    haptics.light();
    onPress?.();
  };

  const displayMembers = members.slice(0, 3);

  const content = (
    <View className="flex-row items-center justify-between py-3 px-4 bg-surface">
      <View className="flex-row items-center">
        {/* Stacked Avatars */}
        <View className="flex-row mr-3" style={{ width: 60 }}>
          {displayMembers.map((member, index) => (
            <View
              key={member}
              style={{
                marginLeft: index > 0 ? -12 : 0,
                zIndex: displayMembers.length - index,
              }}
            >
              <View className="border-2 border-surface rounded-full">
                <Avatar name={member} size="sm" />
              </View>
            </View>
          ))}
        </View>

        <Text variant="body">{label}</Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.foreground.muted}
      />
    </View>
  );

  return (
    <>
      {onPress ? (
        <Pressable onPress={handlePress}>{content}</Pressable>
      ) : (
        content
      )}
      {!isLast && <View className="h-px bg-border ml-4" />}
    </>
  );
}

/**
 * SettingsLargeTitle Component
 *
 * iOS-style large title header for main settings page.
 */

export interface SettingsLargeTitleProps {
  /**
   * Title text
   */
  title: string;

  /**
   * Additional className
   */
  className?: string;
}

export function SettingsLargeTitle({ title, className }: SettingsLargeTitleProps) {
  return (
    <View className={cn("px-4 pt-4 pb-2", className)}>
      <Text variant="h1" style={{ fontSize: 34, fontWeight: "700" }}>
        {title}
      </Text>
    </View>
  );
}

/**
 * SettingsFloatingSearch Component
 *
 * iOS-style floating search bar at bottom of Settings.
 */

export interface SettingsFloatingSearchProps {
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
   * Whether to show microphone button
   * @default true
   */
  showMic?: boolean;

  /**
   * Mic button press handler
   */
  onMicPress?: () => void;

  /**
   * Additional className
   */
  className?: string;
}

export function SettingsFloatingSearch({
  placeholder = "Search",
  value,
  onChangeText,
  showMic = true,
  onMicPress,
  className,
}: SettingsFloatingSearchProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();

  return (
    <View
      className={cn("absolute bottom-0 left-0 right-0", className)}
      style={{ paddingBottom: insets.bottom }}
    >
      <GlassContainer intensity="medium" tint="surface" borderRadius="none">
        <View className="flex-row items-center px-4 py-2 gap-3">
          {/* Search Input */}
          <View
            className="flex-1 flex-row items-center rounded-xl px-3 py-2"
            style={{ backgroundColor: isDark ? colors.surface.elevated : "#E5E5EA" }}
          >
            <Ionicons
              name="search"
              size={18}
              color={colors.foreground.muted}
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
                marginLeft: 8,
                padding: 0,
              }}
            />
          </View>

          {/* Microphone */}
          {showMic && (
            <Pressable
              onPress={() => {
                haptics.light();
                onMicPress?.();
              }}
            >
              <Ionicons
                name="mic-outline"
                size={24}
                color={colors.foreground.DEFAULT}
              />
            </Pressable>
          )}
        </View>
      </GlassContainer>
    </View>
  );
}

/**
 * SettingsSectionHeader Component
 *
 * Section header text (like "My Devices" in Bluetooth).
 */

export interface SettingsSectionHeaderProps {
  /**
   * Header text
   */
  title: string;

  /**
   * Right accessory (e.g., loading spinner)
   */
  rightAccessory?: React.ReactNode;

  /**
   * Additional className
   */
  className?: string;
}

export function SettingsSectionHeader({
  title,
  rightAccessory,
  className,
}: SettingsSectionHeaderProps) {
  return (
    <View className={cn("flex-row items-center justify-between px-4 pt-6 pb-2", className)}>
      <Text variant="h5" style={{ fontWeight: "600" }}>
        {title}
      </Text>
      {rightAccessory}
    </View>
  );
}
