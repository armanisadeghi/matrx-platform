/**
 * MaterialChip - Android Material 3 Chip Component
 *
 * Implements Material 3 chip variants: assist, filter, input, suggestion.
 */

import { View, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";

export type MaterialChipVariant = "assist" | "filter" | "input" | "suggestion";

export interface MaterialChipProps {
  /**
   * Chip label text
   */
  label: string;

  /**
   * Chip variant
   * @default 'assist'
   */
  variant?: MaterialChipVariant;

  /**
   * Whether chip is selected (for filter chips)
   */
  selected?: boolean;

  /**
   * Leading icon name
   */
  icon?: keyof typeof Ionicons.glyphMap;

  /**
   * Show close/remove button (for input chips)
   */
  showClose?: boolean;

  /**
   * Press handler
   */
  onPress?: () => void;

  /**
   * Close button handler
   */
  onClose?: () => void;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * MaterialChip - Material 3 chip component
 *
 * @example
 * ```tsx
 * // Assist chip
 * <MaterialChip
 *   label="Add to calendar"
 *   icon="calendar"
 *   onPress={() => {}}
 * />
 *
 * // Filter chip
 * <MaterialChip
 *   variant="filter"
 *   label="Running"
 *   selected={isSelected}
 *   onPress={() => setSelected(!isSelected)}
 * />
 *
 * // Input chip
 * <MaterialChip
 *   variant="input"
 *   label="John Doe"
 *   showClose
 *   onClose={() => removeRecipient()}
 * />
 * ```
 */
export function MaterialChip({
  label,
  variant = "assist",
  selected = false,
  icon,
  showClose = false,
  onPress,
  onClose,
  disabled = false,
  className,
}: MaterialChipProps) {
  const { colors } = useTheme();
  const haptics = useHaptics();

  const handlePress = () => {
    if (!disabled && onPress) {
      haptics.light();
      onPress();
    }
  };

  const handleClose = () => {
    if (!disabled && onClose) {
      haptics.light();
      onClose();
    }
  };

  // Determine chip styling based on variant and state
  const getChipStyles = () => {
    if (disabled) {
      return "bg-surface-elevated/50 border-border/50";
    }

    if (variant === "filter" && selected) {
      return "bg-primary/20 border-primary";
    }

    switch (variant) {
      case "filter":
        return "bg-surface border-border";
      case "input":
        return "bg-surface-elevated border-border";
      case "suggestion":
        return "bg-surface border-border";
      case "assist":
      default:
        return "bg-surface border-border";
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : disabled ? 0.5 : 1,
      })}
    >
      <View
        className={cn(
          "flex-row items-center px-3 py-1.5 rounded-lg border",
          getChipStyles(),
          className
        )}
      >
        {/* Leading icon or checkmark for selected filter */}
        {variant === "filter" && selected ? (
          <Ionicons
            name="checkmark"
            size={18}
            color={colors.primary.DEFAULT}
            style={{ marginRight: 4 }}
          />
        ) : icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={disabled ? colors.foreground.muted : colors.foreground.DEFAULT}
            style={{ marginRight: 4 }}
          />
        ) : null}

        {/* Label */}
        <Text
          variant="label"
          color={disabled ? "muted" : selected ? "primary" : "default"}
          className="font-medium"
        >
          {label}
        </Text>

        {/* Close button for input chips */}
        {showClose && (
          <Pressable
            onPress={handleClose}
            hitSlop={8}
            style={{ marginLeft: 4 }}
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.foreground.muted}
            />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

/**
 * MaterialChipGroup - Horizontal scrolling chip container
 */
export interface MaterialChipGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function MaterialChipGroup({ children, className }: MaterialChipGroupProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
      className={className}
    >
      {children}
    </ScrollView>
  );
}
