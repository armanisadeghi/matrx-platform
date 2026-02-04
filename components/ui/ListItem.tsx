/**
 * ListItem component
 *
 * Standardized list item for menus, settings, and data lists.
 */

import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { useTheme } from "@/hooks/useTheme";

export interface ListItemProps {
  /**
   * Primary text
   */
  title: string;

  /**
   * Secondary text
   */
  subtitle?: string;

  /**
   * Description text (third line)
   */
  description?: string;

  /**
   * Left icon name
   */
  leftIcon?: keyof typeof Ionicons.glyphMap;

  /**
   * Custom left content (overrides leftIcon)
   */
  leftContent?: React.ReactNode;

  /**
   * Right icon name (default: chevron-forward for pressable items)
   */
  rightIcon?: keyof typeof Ionicons.glyphMap;

  /**
   * Custom right content (overrides rightIcon)
   */
  rightContent?: React.ReactNode;

  /**
   * Whether to show chevron indicator
   * @default true when onPress is provided
   */
  showChevron?: boolean;

  /**
   * Press handler
   */
  onPress?: () => void;

  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether to show a separator below
   * @default true
   */
  showSeparator?: boolean;

  /**
   * Additional className
   */
  className?: string;

  /**
   * Test ID
   */
  testID?: string;
}

/**
 * ListItem component
 *
 * @example
 * ```tsx
 * <ListItem
 *   title="Profile"
 *   subtitle="View and edit your profile"
 *   leftIcon="person"
 *   onPress={handlePress}
 * />
 *
 * <ListItem
 *   title="Dark Mode"
 *   leftIcon="moon"
 *   rightContent={<Switch value={isDark} onValueChange={toggle} />}
 * />
 * ```
 */
export function ListItem({
  title,
  subtitle,
  description,
  leftIcon,
  leftContent,
  rightIcon,
  rightContent,
  showChevron,
  onPress,
  disabled = false,
  showSeparator = true,
  className = "",
  testID,
}: ListItemProps) {
  const { colors } = useTheme();

  const isPressable = !!onPress && !disabled;
  const shouldShowChevron = showChevron ?? (isPressable && !rightContent);

  const content = (
    <View
      className={`
        flex-row items-center py-3 px-4
        ${disabled ? "opacity-50" : ""}
        ${className}
      `}
    >
      {/* Left content */}
      {(leftIcon || leftContent) && (
        <View className="mr-3">
          {leftContent || (
            <View className="w-10 h-10 rounded-full bg-surface-elevated items-center justify-center">
              <Ionicons
                name={leftIcon!}
                size={20}
                color={colors.foreground.secondary}
              />
            </View>
          )}
        </View>
      )}

      {/* Text content */}
      <View className="flex-1">
        <Text variant="body">{title}</Text>
        {subtitle && (
          <Text variant="bodySmall" color="secondary" className="mt-0.5">
            {subtitle}
          </Text>
        )}
        {description && (
          <Text variant="caption" color="muted" className="mt-1">
            {description}
          </Text>
        )}
      </View>

      {/* Right content */}
      {(rightIcon || rightContent || shouldShowChevron) && (
        <View className="ml-3 flex-row items-center">
          {rightContent || (
            <Ionicons
              name={rightIcon || "chevron-forward"}
              size={20}
              color={colors.foreground.muted}
            />
          )}
        </View>
      )}
    </View>
  );

  const wrapper = isPressable ? (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.surface.elevated : "transparent",
      })}
    >
      {content}
    </Pressable>
  ) : (
    <View testID={testID}>{content}</View>
  );

  return (
    <>
      {wrapper}
      {showSeparator && <View className="h-px bg-border ml-4" />}
    </>
  );
}

/**
 * ListSection component for grouping list items
 */
export interface ListSectionProps {
  /**
   * Section title
   */
  title?: string;

  /**
   * Section footer text
   */
  footer?: string;

  /**
   * Children (ListItem components)
   */
  children: React.ReactNode;

  /**
   * Additional className
   */
  className?: string;
}

export function ListSection({
  title,
  footer,
  children,
  className = "",
}: ListSectionProps) {
  return (
    <View className={className}>
      {title && (
        <Text
          variant="overline"
          color="secondary"
          className="px-4 py-2 uppercase"
        >
          {title}
        </Text>
      )}
      <View className="bg-surface rounded-xl overflow-hidden">{children}</View>
      {footer && (
        <Text variant="caption" color="muted" className="px-4 py-2">
          {footer}
        </Text>
      )}
    </View>
  );
}
