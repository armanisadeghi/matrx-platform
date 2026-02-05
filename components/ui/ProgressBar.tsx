/**
 * ProgressBar component
 *
 * Visual indicator for progress and loading states.
 * Supports determinate (percentage) and indeterminate modes.
 */

import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { Text } from "./Text";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  /**
   * Progress value (0-100)
   * If undefined, shows indeterminate animation
   */
  value?: number;

  /**
   * Height of the progress bar
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";

  /**
   * Color variant
   * @default 'primary'
   */
  variant?: "primary" | "success" | "warning" | "error";

  /**
   * Whether to show percentage label
   * @default false
   */
  showLabel?: boolean;

  /**
   * Label position
   * @default 'right'
   */
  labelPosition?: "right" | "top";

  /**
   * Whether progress is animated
   * @default true
   */
  animated?: boolean;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * Size configurations
 */
const sizeConfig = {
  sm: { height: 4, radius: 2 },
  md: { height: 8, radius: 4 },
  lg: { height: 12, radius: 6 },
};

/**
 * Variant colors
 */
const variantColors = {
  primary: { track: "bg-primary/20", fill: "bg-primary" },
  success: { track: "bg-success/20", fill: "bg-success" },
  warning: { track: "bg-warning/20", fill: "bg-warning" },
  error: { track: "bg-error/20", fill: "bg-error" },
};

/**
 * ProgressBar component
 *
 * @example
 * ```tsx
 * // Determinate progress
 * <ProgressBar value={75} showLabel />
 *
 * // Indeterminate loading
 * <ProgressBar />
 *
 * // With variant
 * <ProgressBar value={100} variant="success" />
 *
 * // Different sizes
 * <ProgressBar value={50} size="lg" />
 * ```
 */
export function ProgressBar({
  value,
  size = "md",
  variant = "primary",
  showLabel = false,
  labelPosition = "right",
  animated = true,
  className,
}: ProgressBarProps) {
  const config = sizeConfig[size];
  const colors = variantColors[variant];

  // Determinate progress
  const progress = useSharedValue(0);

  // Indeterminate animation
  const indeterminateX = useSharedValue(-100);

  useEffect(() => {
    if (value !== undefined) {
      // Clamp value between 0-100
      const clampedValue = Math.min(100, Math.max(0, value));
      progress.value = animated
        ? withTiming(clampedValue, { duration: 300 })
        : clampedValue;
    } else {
      // Indeterminate animation
      indeterminateX.value = withRepeat(
        withSequence(
          withTiming(100, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-100, { duration: 0 })
        ),
        -1,
        false
      );
    }
  }, [value, animated, progress, indeterminateX]);

  // Determinate style
  const determinateStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  // Indeterminate style
  const indeterminateStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indeterminateX.value }],
    width: "40%",
  }));

  const progressBar = (
    <View
      className={cn("overflow-hidden", colors.track)}
      style={{ height: config.height, borderRadius: config.radius }}
    >
      <Animated.View
        className={cn("h-full", colors.fill)}
        style={[
          { borderRadius: config.radius },
          value !== undefined ? determinateStyle : indeterminateStyle,
        ]}
      />
    </View>
  );

  // No label
  if (!showLabel || value === undefined) {
    return <View className={className}>{progressBar}</View>;
  }

  // With label
  if (labelPosition === "top") {
    return (
      <View className={className}>
        <View className="flex-row justify-between mb-1">
          <Text variant="caption" color="secondary">
            Progress
          </Text>
          <Text variant="caption" color="secondary">
            {Math.round(value)}%
          </Text>
        </View>
        {progressBar}
      </View>
    );
  }

  // Label on right
  return (
    <View className={cn("flex-row items-center", className)}>
      <View className="flex-1">{progressBar}</View>
      <Text variant="caption" color="secondary" className="ml-3 w-10 text-right">
        {Math.round(value)}%
      </Text>
    </View>
  );
}

/**
 * CircularProgress component
 *
 * Circular variant of progress indicator
 */
export interface CircularProgressProps {
  /**
   * Progress value (0-100)
   * If undefined, shows indeterminate animation
   */
  value?: number;

  /**
   * Size of the circle
   * @default 40
   */
  size?: number;

  /**
   * Stroke width
   * @default 4
   */
  strokeWidth?: number;

  /**
   * Color variant
   * @default 'primary'
   */
  variant?: "primary" | "success" | "warning" | "error";

  /**
   * Whether to show percentage in center
   * @default false
   */
  showValue?: boolean;
}

// Note: CircularProgress implementation would require react-native-svg
// For now, use Spinner for circular indeterminate progress
