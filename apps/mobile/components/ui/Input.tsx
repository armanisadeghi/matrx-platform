/**
 * Input component
 *
 * Styled text input with variants and states.
 */

import { useState, forwardRef } from "react";
import {
  TextInput,
  View,
  Pressable,
  type TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { cn } from "@/lib/utils";
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
  type?: "text" | "password" | "email" | "search" | "phone";

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
 * Autofill configuration per input type.
 * Maps to iOS textContentType and Android autoComplete for proper autofill support.
 */
const autofillConfig: Record<
  NonNullable<InputProps["type"]>,
  { autoComplete?: TextInputProps["autoComplete"]; textContentType?: TextInputProps["textContentType"]; keyboardType?: TextInputProps["keyboardType"]; autoCapitalize?: TextInputProps["autoCapitalize"] }
> = {
  text: {},
  password: { autoComplete: "password", textContentType: "password" },
  email: { autoComplete: "email", textContentType: "emailAddress", keyboardType: "email-address", autoCapitalize: "none" },
  search: { autoCapitalize: "none" },
  phone: { autoComplete: "tel", textContentType: "telephoneNumber", keyboardType: "phone-pad" },
};

/**
 * Input component
 *
 * Supports ref forwarding for field-to-field navigation (e.g. pressing "Next"
 * on the keyboard to focus the next input).
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
 *
 * // Field-to-field navigation
 * const passwordRef = useRef<TextInput>(null);
 * <Input
 *   label="Email"
 *   type="email"
 *   returnKeyType="next"
 *   onSubmitEditing={() => passwordRef.current?.focus()}
 * />
 * <Input ref={passwordRef} label="Password" type="password" />
 * ```
 */
export const Input = forwardRef<TextInput, InputProps>(function Input({
  variant = "default",
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  disabled = false,
  type = "text",
  className,
  inputClassName,
  ...props
}, ref) {
  const { colors } = useTheme();
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
    <View className={cn("w-full", className)}>
      {/* Label */}
      {label && (
        <Text variant="label" className="mb-1.5">
          {label}
        </Text>
      )}

      {/* Input container */}
      <View
        className={cn(
          "flex-row items-center rounded-xl px-3 py-2.5",
          variantStyles[variant],
          borderClass,
          disabled && "opacity-50"
        )}
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
          ref={ref}
          className={cn("flex-1 text-foreground text-base", inputClassName)}
          placeholderTextColor={colors.foreground.muted}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          keyboardType={autofillConfig[type]?.keyboardType ?? "default"}
          autoCapitalize={autofillConfig[type]?.autoCapitalize ?? "sentences"}
          autoComplete={autofillConfig[type]?.autoComplete}
          textContentType={autofillConfig[type]?.textContentType}
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
});

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
