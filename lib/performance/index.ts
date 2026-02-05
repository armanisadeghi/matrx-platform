/**
 * Performance Module
 *
 * Utilities for optimizing app performance.
 *
 * Key areas:
 * - Image optimization (expo-image with transformations)
 * - Performance monitoring and measurement
 */

export {
  // Image optimization
  ImageQuality,
  ImageSize,
  type ImageFormat,
  type OptimizedImageOptions,
  getOptimizedSupabaseUrl,
  getResponsiveImageUrl,
  preloadImages,
  preloadImage,
  clearImageCache,
  getBlurhashPlaceholder,
  DEFAULT_BLURHASH,
  getOptimizedImageProps,
} from "./images";

export {
  // Performance tracking
  PerformanceMarks,
  performanceTracker,
  // Hooks
  useScreenPerformance,
  useFetchPerformance,
  useRenderPerformance,
  useFrameRateMonitor,
  // Utilities
  measureAsync,
  measureSync,
} from "./monitoring";
