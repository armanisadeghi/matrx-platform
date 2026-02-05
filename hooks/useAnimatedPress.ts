/**
 * useAnimatedPress hook
 *
 * Provides spring-based scale animation for pressable components.
 * Returns an animated style and press handlers to apply to Pressable/Animated.View.
 *
 * @example
 * ```tsx
 * const { animatedStyle, handlers } = useAnimatedPress({ scaleTo: 0.95 });
 *
 * <Animated.View style={animatedStyle}>
 *   <Pressable onPress={onPress} {...handlers}>
 *     {children}
 *   </Pressable>
 * </Animated.View>
 * ```
 */

import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface UseAnimatedPressConfig {
  /**
   * Scale factor when pressed (0-1). Lower = more visible bounce.
   * @default 0.95
   */
  scaleTo?: number;

  /**
   * Whether the animation is disabled (e.g., when button is disabled/loading)
   * @default false
   */
  disabled?: boolean;
}

export function useAnimatedPress({
  scaleTo = 0.95,
  disabled = false,
}: UseAnimatedPressConfig = {}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlers = {
    onPressIn: () => {
      if (!disabled) {
        scale.value = withSpring(scaleTo);
      }
    },
    onPressOut: () => {
      scale.value = withSpring(1);
    },
  };

  return { animatedStyle, handlers };
}
