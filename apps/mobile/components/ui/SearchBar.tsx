/**
 * SearchBar component
 *
 * Search input with icon, clear button, and optional cancel button.
 */

import { useState, useRef } from "react";
import {
  View,
  TextInput,
  Pressable,
  type TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Text } from "./Text";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";

export interface SearchBarProps extends Omit<TextInputProps, "style"> {
  /**
   * Search value
   */
  value: string;

  /**
   * Value change handler
   */
  onChangeText: (text: string) => void;

  /**
   * Placeholder text
   * @default 'Search...'
   */
  placeholder?: string;

  /**
   * Whether to show cancel button when focused
   * @default true
   */
  showCancelButton?: boolean;

  /**
   * Cancel button text
   * @default 'Cancel'
   */
  cancelText?: string;

  /**
   * Callback when cancel is pressed
   */
  onCancel?: () => void;

  /**
   * Callback when search is submitted
   */
  onSubmit?: (value: string) => void;

  /**
   * Whether search is loading
   * @default false
   */
  loading?: boolean;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * SearchBar component
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [search, setSearch] = useState('');
 * <SearchBar value={search} onChangeText={setSearch} />
 *
 * // With submit handler
 * <SearchBar
 *   value={search}
 *   onChangeText={setSearch}
 *   onSubmit={(query) => performSearch(query)}
 * />
 *
 * // Without cancel button
 * <SearchBar
 *   value={search}
 *   onChangeText={setSearch}
 *   showCancelButton={false}
 * />
 * ```
 */
export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
  showCancelButton = true,
  cancelText = "Cancel",
  onCancel,
  onSubmit,
  loading = false,
  className,
  ...props
}: SearchBarProps) {
  const [_isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();

  // Animation for cancel button
  const cancelWidth = useSharedValue(0);
  const cancelOpacity = useSharedValue(0);

  const cancelStyle = useAnimatedStyle(() => ({
    width: cancelWidth.value,
    opacity: cancelOpacity.value,
    overflow: "hidden",
  }));

  const handleFocus = () => {
    setIsFocused(true);
    if (showCancelButton) {
      cancelWidth.value = withTiming(70);
      cancelOpacity.value = withTiming(1);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (showCancelButton && !value) {
      cancelWidth.value = withTiming(0);
      cancelOpacity.value = withTiming(0);
    }
  };

  const handleClear = () => {
    haptics.light();
    onChangeText("");
    inputRef.current?.focus();
  };

  const handleCancel = () => {
    haptics.light();
    onChangeText("");
    inputRef.current?.blur();
    cancelWidth.value = withTiming(0);
    cancelOpacity.value = withTiming(0);
    onCancel?.();
  };

  const handleSubmit = () => {
    onSubmit?.(value);
  };

  return (
    <View className={cn("flex-row items-center", className)}>
      {/* Search input container */}
      <View
        className={cn(
          "flex-1 flex-row items-center rounded-xl px-3 py-2",
          isDark ? "bg-surface-elevated" : "bg-background-tertiary"
        )}
      >
        {/* Search icon */}
        <Ionicons
          name="search"
          size={18}
          color={colors.foreground.muted}
          style={{ marginRight: 8 }}
        />

        {/* Text input */}
        <TextInput
          ref={inputRef}
          className="flex-1 text-base text-foreground"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.foreground.muted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />

        {/* Loading or clear button */}
        {loading ? (
          <Ionicons
            name="sync"
            size={18}
            color={colors.foreground.muted}
          />
        ) : value.length > 0 ? (
          <Pressable onPress={handleClear} hitSlop={8}>
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.foreground.muted}
            />
          </Pressable>
        ) : null}
      </View>

      {/* Cancel button */}
      {showCancelButton && (
        <Animated.View style={cancelStyle}>
          <Pressable onPress={handleCancel} className="pl-3">
            <Text color="primary" className="font-medium">
              {cancelText}
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}
