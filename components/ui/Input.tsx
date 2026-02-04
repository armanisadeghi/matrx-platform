/**
 * Input component
 *
 * Styled text input with variants and states.
 */

import { useState } from "react";
import {
  TextInput,
  View,
  Pressable,
  type TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { useTheme } from "@/hooks/useTheme";

/**
 * Input variant types
 */
export type InputVariant = "default" | "filled" | "outlined";

export interface InputProps extends Omit<TextInputProps, "style"> {
  /**
   * Input variant
   * @default 'default'
   */
  variant?: InputVariant;

  /**
   * Label text
   */
  label?: string;

  /**
   * Helper text shown below input
   */
  helperText?: string;

  /**
   * Error message (shows error state when provided)
   */
  error?: string;

  /**
   * Left icon name (Ionicons)
   */
  leftIcon?: keyof typeof Ionicons.glyphMap;

  /**
   * Right icon name (Ionicons)
   */
  rightIcon?: keyof typeof Ionicons.glyphMap;

  /**
   * Handler for right icon press
   */
  onRightIconPress?: () => void;

  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Input type for specialized inputs
   * @default 'text'
   */
  type?: "text" | "password" | "email" | "search";

  /**
   * Additional className for container
   */
  className?: string;

  /**
   * Additional className for input
   */
  inputClassName?: string;
}

/**
 * Variant styles
 */
const variantStyles: Record<InputVariant, string> = {
  default: "bg-background border border-border",
  filled: "bg-surface-elevated border border-transparent",
  outlined: "bg-transparent border-2 border-border",
};

/**
 * Input component
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   placeholder="Enter your email"
 *   type="email"
 *   leftIcon="mail"
 * />
 *
 * <Input
 *   label="Password"
 *   type="password"
 *   error="Password is required"
 * />
 * ```
 */
export function Input({
  variant = "default",
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  disabled = false,
  type = "text",
  className = "",
  inputClassName = "",
  ...props
}: InputProps) {
  const { colors, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = !!error;
  const isPassword = type === "password";
  const isSearch = type === "search";

  // Determine secure text entry
  const secureTextEntry = isPassword && !showPassword;

  // Determine right icon
  const resolvedRightIcon = isPassword
    ? showPassword
      ? "eye-off"
      : "eye"
    : isSearch
    ? "search"
    : rightIcon;

  // Handle right icon press
  const handleRightIconPress = () => {
    if (isPassword) {
      setShowPassword(!showPassword);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  // Border color based on state
  const borderClass = hasError
    ? "border-error"
    : isFocused
    ? "border-primary"
    : "";

  return (
    <View className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <Text variant="label" className="mb-1.5">
          {label}
        </Text>
      )}

      {/* Input container */}
      <View
        className={`
          flex-row items-center rounded-xl px-3 py-2.5
          ${variantStyles[variant]}
          ${borderClass}
          ${disabled ? "opacity-50" : ""}
        `}
      >
        {/* Left icon */}
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={colors.foreground.muted}
            style={{ marginRight: 8 }}
          />
        )}

        {/* Text input */}
        <TextInput
          className={`flex-1 text-foreground text-base ${inputClassName}`}
          placeholderTextColor={colors.foreground.muted}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          keyboardType={type === "email" ? "email-address" : "default"}
          autoCapitalize={type === "email" ? "none" : "sentences"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Right icon */}
        {resolvedRightIcon && (
          <Pressable
            onPress={handleRightIconPress}
            disabled={!isPassword && !onRightIconPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={resolvedRightIcon}
              size={20}
              color={colors.foreground.muted}
              style={{ marginLeft: 8 }}
            />
          </Pressable>
        )}
      </View>

      {/* Helper text / Error */}
      {(helperText || error) && (
        <Text
          variant="caption"
          color={hasError ? "error" : "muted"}
          className="mt-1.5 ml-1"
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

/**
 * TextArea component for multiline input
 */
export function TextArea({
  numberOfLines = 4,
  ...props
}: InputProps & { numberOfLines?: number }) {
  return (
    <Input
      {...props}
      multiline
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      inputClassName="min-h-[100px] py-2"
    />
  );
}
