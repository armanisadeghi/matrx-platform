/**
 * Pressable component
 *
 * Enhanced Pressable with spring animation and haptic feedback built-in.
 * Use this instead of React Native's Pressable for consistent interaction patterns.
 */

import { Pressable as RNPressable, type PressableProps as RNPressableProps } from "react-native";
import Animated from "react-native-reanimated";
import { useAnimatedPress, type UseAnimatedPressConfig } from "@/hooks/useAnimatedPress";
import { cn } from "@/lib/utils";

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

export interface PressableProps extends Omit<RNPressableProps, "style"> {
  /**
   * Children to render
   */
  children: React.ReactNode;

  /**
   * Scale factor when pressed (0-1). Lower = more visible bounce.
   * @default 0.98
   */
  scaleTo?: UseAnimatedPressConfig["scaleTo"];

  /**
   * Haptic feedback intensity. Set to false to disable.
   * @default 'light'
   */
  hapticFeedback?: UseAnimatedPressConfig["hapticFeedback"];

  /**
   * Whether animation/haptics are disabled
   * @default false
   */
  animationDisabled?: boolean;

  /**
   * Additional className for the pressable
   */
  className?: string;

  /**
   * Style object (use className for NativeWind styles)
   */
  style?: RNPressableProps["style"];
}

/**
 * Pressable component with built-in animation and haptics
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Pressable onPress={handlePress}>
 *   <Text>Press me</Text>
 * </Pressable>
 *
 * // Custom animation
 * <Pressable scaleTo={0.95} hapticFeedback="medium" onPress={handlePress}>
 *   <Card>...</Card>
 * </Pressable>
 *
 * // Disabled haptics
 * <Pressable hapticFeedback={false} onPress={handlePress}>
 *   <Text>Silent press</Text>
 * </Pressable>
 * ```
 */
export function Pressable({
  children,
  scaleTo = 0.98,
  hapticFeedback = "light",
  animationDisabled = false,
  disabled,
  className,
  style,
  onPressIn,
  onPressOut,
  ...props
}: PressableProps) {
  const { animatedStyle, handlers } = useAnimatedPress({
    scaleTo,
    hapticFeedback,
    disabled: disabled || animationDisabled,
  });

  return (
    <AnimatedPressable
      className={cn(className)}
      style={[animatedStyle, style]}
      disabled={disabled}
      onPressIn={(e) => {
        handlers.onPressIn();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        handlers.onPressOut();
        onPressOut?.(e);
      }}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}
