/**
 * Image component
 *
 * Enhanced Image using expo-image for optimal performance.
 *
 * CRITICAL: Always use this component instead of React Native's Image.
 * expo-image provides:
 * - Memory and disk caching
 * - Blurhash placeholders
 * - Smooth transitions
 * - WebP support
 * - Better memory management
 */

import { useState } from "react";
import { View, type DimensionValue, type StyleProp, type ViewStyle } from "react-native";
import { Image as ExpoImage, type ImageProps as ExpoImageProps } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Skeleton } from "./Skeleton";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import {
  getOptimizedSupabaseUrl,
  DEFAULT_BLURHASH,
  type OptimizedImageOptions,
} from "@/lib/performance/images";

export interface ImageProps extends Omit<ExpoImageProps, "source" | "placeholder"> {
  /**
   * Image source (URI string or require() source)
   */
  source: string | number | { uri: string };

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
   * Blurhash placeholder string
   * If not provided, uses default placeholder
   */
  blurhash?: string;

  /**
   * Fallback icon name when image fails to load
   * @default 'image-outline'
   */
  fallbackIcon?: keyof typeof Ionicons.glyphMap;

  /**
   * Whether to show loading skeleton (only if no blurhash)
   * @default false (blurhash provides better UX)
   */
  showLoading?: boolean;

  /**
   * Whether to optimize the image URL (Supabase)
   * @default true for string URLs
   */
  optimize?: boolean;

  /**
   * Optimization options
   */
  optimizeOptions?: OptimizedImageOptions;

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
 * Optimized Image component using expo-image
 *
 * @example
 * ```tsx
 * // Basic usage with auto-optimization
 * <Image
 *   source="https://example.com/image.jpg"
 *   width={200}
 *   height={150}
 * />
 *
 * // With blurhash placeholder
 * <Image
 *   source={imageUrl}
 *   width={200}
 *   height={150}
 *   blurhash={item.blurhash}
 * />
 *
 * // Avatar with fallback
 * <Image
 *   source={userAvatar}
 *   width={100}
 *   height={100}
 *   borderRadius="full"
 *   fallbackIcon="person"
 * />
 *
 * // With custom optimization
 * <Image
 *   source={imageUrl}
 *   width={400}
 *   optimize
 *   optimizeOptions={{ quality: 90, format: 'webp' }}
 * />
 * ```
 */
export function Image({
  source,
  width,
  height,
  aspectRatio,
  borderRadius = "none",
  blurhash,
  fallbackIcon = "image-outline",
  showLoading = false,
  optimize = true,
  optimizeOptions,
  className,
  style,
  onLoad,
  onError,
  contentFit = "cover",
  cachePolicy = "memory-disk",
  transition = 200,
  ...props
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { colors } = useTheme();

  // Normalize and optimize source
  const getImageSource = (): ExpoImageProps["source"] => {
    // Local require() source
    if (typeof source === "number") {
      return source;
    }

    // Object with uri
    if (typeof source === "object" && "uri" in source) {
      if (optimize && source.uri.startsWith("http")) {
        return {
          uri: getOptimizedSupabaseUrl(source.uri, {
            width: typeof width === "number" ? width : undefined,
            ...optimizeOptions,
          }),
        };
      }
      return source;
    }

    // String URL
    if (typeof source === "string") {
      if (optimize && source.startsWith("http")) {
        return {
          uri: getOptimizedSupabaseUrl(source, {
            width: typeof width === "number" ? width : undefined,
            ...optimizeOptions,
          }),
        };
      }
      return { uri: source };
    }

    return source;
  };

  // Calculate radius
  const radius = radiusMap[borderRadius];

  // Compute dimensions
  const computedStyle: StyleProp<ViewStyle> = {
    width: width as DimensionValue,
    height: (aspectRatio && width ? undefined : height) as DimensionValue,
    aspectRatio,
    borderRadius: radius,
    overflow: "hidden",
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
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

  // Use blurhash as placeholder by default
  const placeholder = blurhash || DEFAULT_BLURHASH;

  return (
    <View className={cn("overflow-hidden", className)} style={[computedStyle, style]}>
      {/* Loading skeleton (only if no blurhash and showLoading is true) */}
      {showLoading && !blurhash && isLoading && (
        <View className="absolute inset-0">
          <Skeleton width="100%" height={Number(height) || 100} radius="none" />
        </View>
      )}

      {/* expo-image with optimal settings */}
      <ExpoImage
        source={getImageSource()}
        placeholder={placeholder}
        contentFit={contentFit}
        cachePolicy={cachePolicy}
        transition={transition}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: radius,
        }}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </View>
  );
}

/**
 * Avatar convenience component
 */
export interface AvatarImageProps extends Omit<ImageProps, "borderRadius" | "fallbackIcon"> {
  size?: number;
}

export function AvatarImage({ size = 40, width, height, ...props }: AvatarImageProps) {
  return (
    <Image
      width={size}
      height={size}
      borderRadius="full"
      fallbackIcon="person"
      {...props}
    />
  );
}
