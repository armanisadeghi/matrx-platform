/**
 * EmptyState component
 *
 * Placeholder for empty lists, search results, or initial states.
 * Provides visual feedback and optional action button.
 */

import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { Button } from "./Button";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  /**
   * Icon name from Ionicons
   * @default 'folder-open-outline'
   */
  icon?: keyof typeof Ionicons.glyphMap;

  /**
   * Title text
   */
  title: string;

  /**
   * Description text
   */
  description?: string;

  /**
   * Primary action button
   */
  action?: {
    label: string;
    onPress: () => void;
  };

  /**
   * Secondary action button
   */
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };

  /**
   * Size variant
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";

  /**
   * Whether to center in available space
   * @default true
   */
  centered?: boolean;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * Size configurations
 */
const sizeConfig = {
  sm: {
    iconSize: 40,
    iconContainer: 64,
    titleClass: "text-base",
    descClass: "text-sm",
    gap: "gap-2",
  },
  md: {
    iconSize: 48,
    iconContainer: 80,
    titleClass: "text-lg",
    descClass: "text-base",
    gap: "gap-3",
  },
  lg: {
    iconSize: 64,
    iconContainer: 104,
    titleClass: "text-xl",
    descClass: "text-base",
    gap: "gap-4",
  },
};

/**
 * EmptyState component
 *
 * @example
 * ```tsx
 * // Basic empty state
 * <EmptyState
 *   title="No items yet"
 *   description="Add your first item to get started"
 * />
 *
 * // With action
 * <EmptyState
 *   icon="cart-outline"
 *   title="Your cart is empty"
 *   description="Browse our products and add items to your cart"
 *   action={{ label: "Start Shopping", onPress: navigateToProducts }}
 * />
 *
 * // Search no results
 * <EmptyState
 *   icon="search-outline"
 *   title="No results found"
 *   description="Try adjusting your search or filters"
 *   action={{ label: "Clear Filters", onPress: clearFilters }}
 * />
 *
 * // Compact size
 * <EmptyState
 *   size="sm"
 *   title="No notifications"
 *   description="You're all caught up!"
 * />
 * ```
 */
export function EmptyState({
  icon = "folder-open-outline",
  title,
  description,
  action,
  secondaryAction,
  size = "md",
  centered = true,
  className,
}: EmptyStateProps) {
  const { colors } = useTheme();
  const config = sizeConfig[size];

  return (
    <View
      className={cn(
        "items-center px-6",
        centered && "flex-1 justify-center",
        config.gap,
        className
      )}
    >
      {/* Icon container */}
      <View
        className="rounded-full bg-surface-elevated items-center justify-center mb-2"
        style={{
          width: config.iconContainer,
          height: config.iconContainer,
        }}
      >
        <Ionicons
          name={icon}
          size={config.iconSize}
          color={colors.foreground.muted}
        />
      </View>

      {/* Title */}
      <Text
        className={cn("font-semibold text-center", config.titleClass)}
      >
        {title}
      </Text>

      {/* Description */}
      {description && (
        <Text
          color="secondary"
          className={cn("text-center max-w-xs", config.descClass)}
        >
          {description}
        </Text>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <View className="flex-row items-center gap-3 mt-4">
          {secondaryAction && (
            <Button
              variant="secondary"
              size={size === "lg" ? "md" : "sm"}
              onPress={secondaryAction.onPress}
            >
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button
              variant="primary"
              size={size === "lg" ? "md" : "sm"}
              onPress={action.onPress}
            >
              {action.label}
            </Button>
          )}
        </View>
      )}
    </View>
  );
}

/**
 * Preset empty states for common scenarios
 */

export function NoSearchResults({
  searchTerm,
  onClear,
}: {
  searchTerm?: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      icon="search-outline"
      title="No results found"
      description={
        searchTerm
          ? `We couldn't find anything matching "${searchTerm}"`
          : "Try adjusting your search or filters"
      }
      action={onClear ? { label: "Clear Search", onPress: onClear } : undefined}
    />
  );
}

export function NoData({
  type = "items",
  onAdd,
}: {
  type?: string;
  onAdd?: () => void;
}) {
  return (
    <EmptyState
      icon="folder-open-outline"
      title={`No ${type} yet`}
      description={`Get started by adding your first ${type.replace(/s$/, "")}`}
      action={onAdd ? { label: `Add ${type.replace(/s$/, "")}`, onPress: onAdd } : undefined}
    />
  );
}

export function NoConnection({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon="cloud-offline-outline"
      title="No connection"
      description="Check your internet connection and try again"
      action={onRetry ? { label: "Retry", onPress: onRetry } : undefined}
    />
  );
}

export function NoNotifications() {
  return (
    <EmptyState
      icon="notifications-outline"
      title="No notifications"
      description="You're all caught up!"
      size="sm"
    />
  );
}
