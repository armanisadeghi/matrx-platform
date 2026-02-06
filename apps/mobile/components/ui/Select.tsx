/**
 * Select component
 *
 * Modal-based dropdown selector for mobile.
 * Shows a bottom sheet with selectable options.
 */

import { useState } from "react";
import {
  View,
  Modal,
  Pressable,
  FlatList,
  type ListRenderItem,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { Divider } from "./Divider";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";

export interface SelectOption<T = string> {
  /**
   * Option value
   */
  value: T;

  /**
   * Display label
   */
  label: string;

  /**
   * Optional icon
   */
  icon?: keyof typeof Ionicons.glyphMap;

  /**
   * Whether option is disabled
   */
  disabled?: boolean;
}

export interface SelectProps<T = string> {
  /**
   * Currently selected value
   */
  value?: T;

  /**
   * Selection change handler
   */
  onValueChange: (value: T) => void;

  /**
   * Available options
   */
  options: SelectOption<T>[];

  /**
   * Placeholder when no value selected
   * @default 'Select...'
   */
  placeholder?: string;

  /**
   * Label text
   */
  label?: string;

  /**
   * Helper text below the input
   */
  helperText?: string;

  /**
   * Error message
   */
  error?: string;

  /**
   * Whether the select is disabled
   */
  disabled?: boolean;

  /**
   * Modal title
   */
  title?: string;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * Select component
 *
 * @example
 * ```tsx
 * const [country, setCountry] = useState<string>();
 *
 * <Select
 *   label="Country"
 *   value={country}
 *   onValueChange={setCountry}
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'uk', label: 'United Kingdom' },
 *     { value: 'ca', label: 'Canada' },
 *   ]}
 * />
 * ```
 */
export function Select<T = string>({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  label,
  helperText,
  error,
  disabled = false,
  title,
  className,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();

  // Find selected option
  const selectedOption = options.find((opt) => opt.value === value);

  const handleOpen = () => {
    if (!disabled) {
      haptics.light();
      setIsOpen(true);
    }
  };

  const handleSelect = (option: SelectOption<T>) => {
    if (!option.disabled) {
      haptics.selection();
      onValueChange(option.value);
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const renderOption: ListRenderItem<SelectOption<T>> = ({ item }) => {
    const isSelected = item.value === value;

    return (
      <Pressable
        onPress={() => handleSelect(item)}
        disabled={item.disabled}
        className={cn(
          "flex-row items-center px-4 py-3",
          item.disabled && "opacity-50"
        )}
      >
        {item.icon && (
          <Ionicons
            name={item.icon}
            size={20}
            color={isSelected ? colors.primary.DEFAULT : colors.foreground.DEFAULT}
            style={{ marginRight: 12 }}
          />
        )}
        <Text
          className={cn(
            "flex-1",
            isSelected && "text-primary font-medium"
          )}
        >
          {item.label}
        </Text>
        {isSelected && (
          <Ionicons
            name="checkmark"
            size={20}
            color={colors.primary.DEFAULT}
          />
        )}
      </Pressable>
    );
  };

  return (
    <View className={className}>
      {/* Label */}
      {label && (
        <Text variant="label" className="mb-1.5">
          {label}
        </Text>
      )}

      {/* Select trigger */}
      <Pressable
        onPress={handleOpen}
        disabled={disabled}
        className={cn(
          "flex-row items-center justify-between px-4 py-3 rounded-xl border",
          error ? "border-error" : "border-border",
          disabled && "opacity-50",
          isDark ? "bg-surface" : "bg-background"
        )}
      >
        <Text
          color={selectedOption ? "default" : "muted"}
          className="flex-1"
        >
          {selectedOption?.label || placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={colors.foreground.muted}
        />
      </Pressable>

      {/* Helper text or error */}
      {(helperText || error) && (
        <Text
          variant="caption"
          color={error ? "error" : "muted"}
          className="mt-1.5"
        >
          {error || helperText}
        </Text>
      )}

      {/* Options modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <Pressable
          className="flex-1 bg-backdrop/50"
          onPress={handleClose}
        >
          <View className="flex-1" />
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-surface rounded-t-3xl max-h-[60%]"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          >
            {/* Handle */}
            <View className="items-center pt-2 pb-1">
              <View className="w-10 h-1 rounded-full bg-border" />
            </View>

            {/* Title */}
            {(title || label) && (
              <>
                <View className="px-4 py-3">
                  <Text variant="h3" className="text-center">
                    {title || label}
                  </Text>
                </View>
                <Divider spacing="none" />
              </>
            )}

            {/* Options list */}
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => String(item.value)}
              ItemSeparatorComponent={() => <Divider spacing="none" />}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
