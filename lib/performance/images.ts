/**
 * Image Optimization Utilities
 *
 * CRITICAL: Never serve full-resolution images.
 * Always use optimized URLs with proper sizing and format.
 *
 * For Supabase Storage, use transformation parameters.
 * For other CDNs, adapt the URL patterns accordingly.
 */

import { Dimensions, PixelRatio } from "react-native";
import { Image } from "expo-image";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PIXEL_RATIO = PixelRatio.get();

/**
 * Image quality presets
 */
export const ImageQuality = {
  LOW: 60,
  MEDIUM: 75,
  HIGH: 85,
  MAXIMUM: 95,
} as const;

/**
 * Image size presets (in logical pixels)
 */
export const ImageSize = {
  THUMBNAIL: 100,
  SMALL: 200,
  MEDIUM: 400,
  LARGE: 800,
  FULL_WIDTH: SCREEN_WIDTH,
} as const;

/**
 * Image format options
 */
export type ImageFormat = "webp" | "jpeg" | "png" | "avif";

/**
 * Options for optimized image URL
 */
export interface OptimizedImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: ImageFormat;
  /** Whether to account for device pixel ratio */
  scaleForDevice?: boolean;
}

/**
 * Generate optimized Supabase Storage URL
 *
 * REQUIRED: Use this for ALL Supabase image URLs.
 *
 * @example
 * ```ts
 * const url = getOptimizedSupabaseUrl(imageUrl, {
 *   width: 400,
 *   quality: 80,
 *   format: 'webp'
 * });
 * ```
 */
export function getOptimizedSupabaseUrl(
  url: string,
  options: OptimizedImageOptions = {}
): string {
  const {
    width,
    height,
    quality = ImageQuality.MEDIUM,
    format = "webp",
    scaleForDevice = true,
  } = options;

  // Skip optimization for local assets
  if (!url.startsWith("http")) {
    return url;
  }

  // Calculate actual pixel dimensions
  const pixelWidth = width
    ? Math.round(width * (scaleForDevice ? PIXEL_RATIO : 1))
    : undefined;
  const pixelHeight = height
    ? Math.round(height * (scaleForDevice ? PIXEL_RATIO : 1))
    : undefined;

  // Build query parameters
  const params = new URLSearchParams();
  if (pixelWidth) params.set("width", pixelWidth.toString());
  if (pixelHeight) params.set("height", pixelHeight.toString());
  params.set("quality", quality.toString());
  params.set("format", format);

  // Check if URL already has query params
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${params.toString()}`;
}

/**
 * Get responsive image URL based on container size
 *
 * @example
 * ```ts
 * const url = getResponsiveImageUrl(imageUrl, containerWidth);
 * ```
 */
export function getResponsiveImageUrl(
  url: string,
  containerWidth: number,
  options: Omit<OptimizedImageOptions, "width"> = {}
): string {
  // Determine optimal width breakpoint
  let width: number;
  if (containerWidth <= 150) {
    width = ImageSize.THUMBNAIL;
  } else if (containerWidth <= 300) {
    width = ImageSize.SMALL;
  } else if (containerWidth <= 500) {
    width = ImageSize.MEDIUM;
  } else {
    width = ImageSize.LARGE;
  }

  return getOptimizedSupabaseUrl(url, { ...options, width });
}

/**
 * Preload images for instant display
 *
 * REQUIRED: Preload images for next screens/pages.
 *
 * @example
 * ```ts
 * // Preload images when user is likely to navigate
 * await preloadImages([image1, image2, image3]);
 * ```
 */
export async function preloadImages(urls: string[]): Promise<void> {
  const optimizedUrls = urls.map((url) =>
    getOptimizedSupabaseUrl(url, { width: ImageSize.MEDIUM })
  );
  await Image.prefetch(optimizedUrls);
}

/**
 * Preload a single image
 */
export async function preloadImage(url: string, width?: number): Promise<void> {
  const optimizedUrl = getOptimizedSupabaseUrl(url, {
    width: width || ImageSize.MEDIUM,
  });
  await Image.prefetch([optimizedUrl]);
}

/**
 * Clear image cache
 */
export async function clearImageCache(): Promise<void> {
  await Image.clearMemoryCache();
  await Image.clearDiskCache();
}

/**
 * Generate blurhash placeholder URL
 * Note: This assumes your backend stores blurhash strings
 *
 * @example
 * ```ts
 * // In your image component
 * <Image
 *   source={{ uri: imageUrl }}
 *   placeholder={item.blurhash}
 * />
 * ```
 */
export function getBlurhashPlaceholder(blurhash: string | undefined): string | undefined {
  if (!blurhash) return undefined;
  return blurhash;
}

/**
 * Default blurhash for images without one
 * A simple gray gradient that works well as a universal placeholder
 */
export const DEFAULT_BLURHASH = "L6PZfSi_.AyE_3t7t7R**0o#DgR4";

/**
 * Image props helper for consistent optimization
 *
 * @example
 * ```ts
 * <Image
 *   {...getOptimizedImageProps(imageUrl, 200, blurhash)}
 * />
 * ```
 */
export function getOptimizedImageProps(
  url: string,
  width: number,
  blurhash?: string
) {
  return {
    source: { uri: getOptimizedSupabaseUrl(url, { width }) },
    placeholder: blurhash || DEFAULT_BLURHASH,
    contentFit: "cover" as const,
    cachePolicy: "memory-disk" as const,
    transition: 200,
  };
}
