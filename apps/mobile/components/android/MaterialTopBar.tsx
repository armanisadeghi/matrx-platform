/**
 * MaterialTopBar - Android Material 3 Top App Bar
 *
 * Implements Material 3 top app bar variants: center-aligned, small, medium, large.
 */

import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";

export type MaterialTopBarVariant = "center" | "small" | "medium" | "large";

export interface MaterialTopBarProps {
  /**
   * Title text
   */
  title: string;

  /**
   * Top bar variant
   * @default 'small'
   */
  variant?: MaterialTopBarVariant;

  /**
   * Show back/navigation button
   */
  showBack?: boolean;

  /**
   * Back button handler
   */
  onBack?: () => void;

  /**
   * Custom navigation icon
   */
  navigationIcon?: keyof typeof Ionicons.glyphMap;

  /**
   * Action buttons (max 3 recommended)
   */
  actions?: Array<{
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    label?: string;
  }>;

  /**
   * Background is transparent (for scrolling content)
   */
  transparent?: boolean;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * MaterialTopBar - Material 3 top app bar
 *
 * @example
 * ```tsx
 * // Small top bar with back button
 * <MaterialTopBar
 *   title="Settings"
 *   showBack
 *   onBack={() => router.back()}
 * />
 *
 * // Large top bar with actions
 * <MaterialTopBar
 *   title="Messages"
 *   variant="large"
 *   actions={[
 *     { icon: 'search', onPress: () => openSearch() },
 *     { icon: 'ellipsis-vertical', onPress: () => openMenu() },
 *   ]}
 * />
 * ```
 */
export function MaterialTopBar({
  title,
  variant = "small",
  showBack = false,
  onBack,
  navigationIcon = "arrow-back",
  actions = [],
  transparent = false,
  className,
}: MaterialTopBarProps) {
  const { colors } = useTheme();
  const haptics = useHaptics();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    haptics.light();
    onBack?.();
  };

  const handleAction = (action: () => void) => {
    haptics.light();
    action();
  };

  // Variant configurations
  const isLargeVariant = variant === "medium" || variant === "large";
  const isCenterVariant = variant === "center";

  const titleSizes = {
    center: "text-lg",
    small: "text-lg",
    medium: "text-2xl",
    large: "text-3xl",
  };

  return (
    <View
      className={cn(
        !transparent && "bg-surface-elevated",
        className
      )}
      style={{ paddingTop: insets.top }}
    >
      {/* Main bar row */}
      <View className="flex-row items-center h-16 px-1">
        {/* Navigation icon */}
        {showBack && (
          <Pressable
            onPress={handleBack}
            className="w-12 h-12 items-center justify-center rounded-full"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Ionicons
              name={navigationIcon}
              size={24}
              color={colors.foreground.DEFAULT}
            />
          </Pressable>
        )}

        {/* Title (for small/center variants) */}
        {!isLargeVariant && (
          <Text
            variant="h3"
            className={cn(
              "flex-1 font-medium",
              titleSizes[variant],
              isCenterVariant && "text-center",
              showBack ? "ml-1" : "ml-4"
            )}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}

        {/* Spacer for large variants */}
        {isLargeVariant && <View className="flex-1" />}

        {/* Action buttons */}
        <View className="flex-row">
          {actions.slice(0, 3).map((action, index) => (
            <Pressable
              key={index}
              onPress={() => handleAction(action.onPress)}
              className="w-12 h-12 items-center justify-center rounded-full"
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Ionicons
                name={action.icon}
                size={24}
                color={colors.foreground.DEFAULT}
              />
            </Pressable>
          ))}
        </View>
      </View>

      {/* Large title (for medium/large variants) */}
      {isLargeVariant && (
        <View className={cn("px-4", variant === "large" ? "pb-6" : "pb-4")}>
          <Text
            variant="h1"
            className={cn("font-medium", titleSizes[variant])}
          >
            {title}
          </Text>
        </View>
      )}
    </View>
  );
}
