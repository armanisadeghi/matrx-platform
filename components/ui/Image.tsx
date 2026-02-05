/**
 * Image component
 *
 * Enhanced Image with loading states, error handling, and fallback support.
 */

import { useState } from "react";
import {
  Image as RNImage,
  View,
  type ImageProps as RNImageProps,
  type ImageSourcePropType,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Skeleton } from "./Skeleton";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export interface ImageProps extends Omit<RNImageProps, "source" | "borderRadius" | "width" | "height"> {
  /**
   * Image source (URI string or require() source)
   */
  source: ImageSourcePropType | string;

  /**
   * Width of the image
   */
  width?: number | string;

  /**
   * Height of the image
   */
  height?: number | string;

  /**
   * Aspect ratio (alternative to explicit height)
   */
  aspectRatio?: number;

  /**
   * Border radius preset
   * @default 'none'
   */
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "full";

  /**
   * Fallback icon name when image fails to load
   * @default 'image-outline'
   */
  fallbackIcon?: keyof typeof Ionicons.glyphMap;

  /**
   * Whether to show loading skeleton
   * @default true
   */
  showLoading?: boolean;

  /**
   * Additional className
   */
  className?: string;
}

const radiusMap = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

/**
 * Image component with loading and error states
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Image source={{ uri: "https://example.com/image.jpg" }} width={200} height={150} />
 *
 * // With aspect ratio
 * <Image source={require('./photo.png')} width="100%" aspectRatio={16/9} />
 *
 * // Rounded with fallback
 * <Image
 *   source={userAvatar}
 *   width={100}
 *   height={100}
 *   borderRadius="full"
 *   fallbackIcon="person"
 * />
 * ```
 */
export function Image({
  source,
  width,
  height,
  aspectRatio,
  borderRadius = "none",
  fallbackIcon = "image-outline",
  showLoading = true,
  className,
  style,
  onLoad,
  onError,
  ...props
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { colors } = useTheme();

  // Normalize source
  const imageSource = typeof source === "string" ? { uri: source } : source;

  // Calculate radius
  const radius = radiusMap[borderRadius];

  // Compute dimensions with proper types
  const computedStyle: StyleProp<ViewStyle> = {
    width: width as DimensionValue,
    height: (aspectRatio && width ? undefined : height) as DimensionValue,
    aspectRatio,
    borderRadius: radius,
  };

  const handleLoad = (e: Parameters<NonNullable<RNImageProps["onLoad"]>>[0]) => {
    setIsLoading(false);
    onLoad?.(e);
  };

  const handleError = (e: Parameters<NonNullable<RNImageProps["onError"]>>[0]) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(e);
  };

  // Error state
  if (hasError) {
    return (
      <View
        className={cn("bg-surface-elevated items-center justify-center", className)}
        style={[computedStyle, style]}
      >
        <Ionicons
          name={fallbackIcon}
          size={Math.min(Number(width) || 40, Number(height) || 40) * 0.4}
          color={colors.foreground.muted}
        />
      </View>
    );
  }

  return (
    <View className={cn("overflow-hidden", className)} style={[computedStyle, style]}>
      {/* Loading skeleton */}
      {showLoading && isLoading && (
        <View className="absolute inset-0">
          <Skeleton width="100%" height={Number(height) || 100} radius="none" />
        </View>
      )}

      {/* Actual image */}
      <RNImage
        source={imageSource}
        style={[
          {
            width: "100%",
            height: "100%",
            borderRadius: radius,
          },
        ]}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </View>
  );
}
