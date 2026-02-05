/**
 * MaterialCard - Android Material 3 Card Component
 *
 * Implements Material 3 Expressive card variants with proper
 * elevation, rounded corners, and optional glass effect.
 */

import { View, Pressable, type ViewStyle, type StyleProp } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";

export type MaterialCardVariant = "elevated" | "filled" | "outlined";

export interface MaterialCardProps {
  /**
   * Card variant following Material 3 spec
   * @default 'elevated'
   */
  variant?: MaterialCardVariant;

  /**
   * Card content
   */
  children: React.ReactNode;

  /**
   * Press handler (makes card interactive)
   */
  onPress?: () => void;

  /**
   * Long press handler
   */
  onLongPress?: () => void;

  /**
   * Disable interaction
   */
  disabled?: boolean;

  /**
   * Additional styles
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * MaterialCard - Material 3 card component
 *
 * @example
 * ```tsx
 * <MaterialCard variant="elevated" onPress={() => navigate()}>
 *   <Text>Card content</Text>
 * </MaterialCard>
 *
 * <MaterialCard variant="outlined">
 *   <Text>Non-interactive card</Text>
 * </MaterialCard>
 * ```
 */
export function MaterialCard({
  variant = "elevated",
  children,
  onPress,
  onLongPress,
  disabled = false,
  style,
  className,
}: MaterialCardProps) {
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();

  const isInteractive = !!(onPress || onLongPress) && !disabled;

  // Material 3 variant styles
  const variantStyles: Record<MaterialCardVariant, string> = {
    elevated: isDark
      ? "bg-surface-elevated shadow-lg"
      : "bg-surface shadow-md",
    filled: "bg-surface-elevated",
    outlined: "bg-surface border border-border",
  };

  const handlePress = () => {
    if (onPress) {
      haptics.light();
      onPress();
    }
  };

  const handleLongPress = () => {
    if (onLongPress) {
      haptics.medium();
      onLongPress();
    }
  };

  const cardContent = (
    <View
      className={cn(
        "rounded-xl overflow-hidden",
        variantStyles[variant],
        className
      )}
      style={style}
    >
      {children}
    </View>
  );

  if (isInteractive) {
    return (
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        disabled={disabled}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
}
