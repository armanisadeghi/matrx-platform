/**
 * Button component
 *
 * Styled button with variant support and platform adaptations.
 * Uses NativeWind for styling.
 */

import { Pressable, View, ActivityIndicator } from "react-native";
import Animated from "react-native-reanimated";
import { Text } from "./Text";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { useAnimatedPress } from "@/hooks/useAnimatedPress";

/**
 * Button variant types
 */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "outline";

/**
 * Button size types
 */
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  /**
   * Button label text
   */
  children: React.ReactNode;

  /**
   * Button variant
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the button is in loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Icon to display before the label
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon to display after the label
   */
  rightIcon?: React.ReactNode;

  /**
   * Whether the button should take full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Press handler
   */
  onPress?: () => void;

  /**
   * Additional className for NativeWind styling
   */
  className?: string;

  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Variant styles
 */
const variantStyles: Record<
  ButtonVariant,
  { container: string; text: string; pressedContainer: string }
> = {
  primary: {
    container: "bg-primary",
    text: "text-white",
    pressedContainer: "bg-primary-dark",
  },
  secondary: {
    container: "bg-secondary",
    text: "text-white",
    pressedContainer: "bg-secondary-dark",
  },
  ghost: {
    container: "bg-transparent",
    text: "text-primary",
    pressedContainer: "bg-primary/10",
  },
  destructive: {
    container: "bg-error",
    text: "text-white",
    pressedContainer: "bg-error/90",
  },
  outline: {
    container: "bg-transparent border border-border",
    text: "text-foreground",
    pressedContainer: "bg-surface-elevated",
  },
};

/**
 * Size styles
 */
const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  sm: {
    container: "px-3 py-1.5 rounded-lg",
    text: "text-sm",
  },
  md: {
    container: "px-4 py-2.5 rounded-xl",
    text: "text-base",
  },
  lg: {
    container: "px-6 py-3 rounded-xl",
    text: "text-lg",
  },
};

/**
 * Button component
 *
 * @example
 * ```tsx
 * <Button onPress={handlePress}>Click me</Button>
 * <Button variant="secondary" size="sm">Small button</Button>
 * <Button variant="destructive" loading>Deleting...</Button>
 * ```
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  onPress,
  className,
  testID,
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const { animatedStyle, handlers } = useAnimatedPress({
    scaleTo: 0.97,
    disabled: isDisabled,
  });

  // Determine spinner color from theme based on variant
  const spinnerColor =
    variant === "ghost" || variant === "outline"
      ? colors.primary.DEFAULT
      : colors.foreground.inverse;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        testID={testID}
        className={cn(
          "flex-row items-center justify-center",
          sizeStyle.container,
          variantStyle.container,
          fullWidth && "w-full",
          isDisabled && "opacity-50",
          className
        )}
        {...handlers}
      >
        {loading ? (
          <ActivityIndicator size="small" color={spinnerColor} />
        ) : (
          <>
            {leftIcon && <View className="mr-2">{leftIcon}</View>}
            <Text
              variant="label"
              className={cn(variantStyle.text, sizeStyle.text, "font-semibold")}
            >
              {children}
            </Text>
            {rightIcon && <View className="ml-2">{rightIcon}</View>}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}
