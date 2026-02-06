/**
 * Skeleton component
 *
 * Shimmer loading placeholder using Reanimated 4 CSS keyframe animations.
 */

import { View, type DimensionValue } from "react-native";
import Animated, { css } from "react-native-reanimated";
import { cn } from "@/lib/utils";

const pulseKeyframes = css.keyframes({
  "0%": { opacity: 1 },
  "50%": { opacity: 0.4 },
  "100%": { opacity: 1 },
});

export interface SkeletonProps {
  /**
   * Width of the skeleton (number for pixels, string for percentages)
   */
  width?: number | string;

  /**
   * Height of the skeleton
   * @default 16
   */
  height?: number;

  /**
   * Border radius variant
   * @default 'md'
   */
  radius?: "none" | "sm" | "md" | "lg" | "full";

  /**
   * Additional className
   */
  className?: string;
}

const radiusMap = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
};

/**
 * Skeleton loading placeholder
 *
 * @example
 * ```tsx
 * // Text placeholder
 * <Skeleton width="60%" height={16} />
 *
 * // Avatar placeholder
 * <Skeleton width={48} height={48} radius="full" />
 *
 * // Card placeholder
 * <Skeleton width="100%" height={120} radius="lg" />
 * ```
 */
export function Skeleton({
  width = "100%",
  height = 16,
  radius = "md",
  className,
}: SkeletonProps) {
  return (
    <Animated.View
      className={cn("bg-surface-elevated", className)}
      style={{
        width: width as DimensionValue,
        height,
        borderRadius: radiusMap[radius],
        animationName: pulseKeyframes,
        animationDuration: "1.5s",
        animationIterationCount: "infinite",
        animationTimingFunction: "ease-in-out",
      }}
    />
  );
}

/**
 * SkeletonGroup for common loading patterns
 */
export interface SkeletonGroupProps {
  /**
   * Number of rows
   * @default 3
   */
  rows?: number;

  /**
   * Whether to show an avatar circle
   * @default false
   */
  avatar?: boolean;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * Pre-composed skeleton group for list-style loading states
 *
 * @example
 * ```tsx
 * // Simple text block
 * <SkeletonGroup rows={4} />
 *
 * // With avatar
 * <SkeletonGroup avatar rows={2} />
 * ```
 */
export function SkeletonGroup({
  rows = 3,
  avatar = false,
  className,
}: SkeletonGroupProps) {
  return (
    <View className={cn("gap-3", className)}>
      {avatar && (
        <View className="flex-row items-center gap-3">
          <Skeleton width={48} height={48} radius="full" />
          <View className="flex-1 gap-2">
            <Skeleton width="50%" height={14} />
            <Skeleton width="30%" height={12} />
          </View>
        </View>
      )}
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === rows - 1 ? "60%" : "100%"}
          height={14}
        />
      ))}
    </View>
  );
}
