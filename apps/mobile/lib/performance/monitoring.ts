/**
 * Performance Monitoring Utilities
 *
 * Track and measure performance metrics for the app.
 * Use these to ensure the app meets performance targets.
 *
 * TARGETS:
 * - App opens to cached content: < 500ms
 * - Screen transitions: < 16ms (60 FPS)
 * - First data render: < 1 second
 * - Images appear with blurhash: < 100ms
 */

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Performance marks for tracking
 */
export const PerformanceMarks = {
  APP_START: "app_start",
  APP_READY: "app_ready",
  SCREEN_LOAD_START: "screen_load_start",
  SCREEN_LOAD_END: "screen_load_end",
  DATA_FETCH_START: "data_fetch_start",
  DATA_FETCH_END: "data_fetch_end",
  FIRST_RENDER: "first_render",
  INTERACTIVE: "interactive",
} as const;

/**
 * Simple performance tracking (works on all platforms)
 */
class PerformanceTracker {
  private marks: Map<string, number> = new Map();
  private measures: Map<string, number> = new Map();
  private enabled: boolean = __DEV__;

  /**
   * Set a performance mark
   */
  mark(name: string): void {
    if (!this.enabled) return;
    this.marks.set(name, Date.now());
  }

  /**
   * Measure time between two marks
   */
  measure(name: string, startMark: string, endMark?: string): number | undefined {
    if (!this.enabled) return undefined;

    const start = this.marks.get(startMark);
    const end = endMark ? this.marks.get(endMark) : Date.now();

    if (start === undefined) {
      console.warn(`Performance mark "${startMark}" not found`);
      return undefined;
    }

    const duration = (end ?? Date.now()) - start;
    this.measures.set(name, duration);

    if (__DEV__) {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  /**
   * Get a specific measure
   */
  getMeasure(name: string): number | undefined {
    return this.measures.get(name);
  }

  /**
   * Get all measures
   */
  getAllMeasures(): Record<string, number> {
    return Object.fromEntries(this.measures);
  }

  /**
   * Clear all marks and measures
   */
  clear(): void {
    this.marks.clear();
    this.measures.clear();
  }

  /**
   * Enable/disable tracking
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

export const performanceTracker = new PerformanceTracker();

/**
 * Hook for measuring screen load time
 *
 * @example
 * ```tsx
 * function MyScreen() {
 *   const { markReady, loadTime } = useScreenPerformance('HomeScreen');
 *
 *   useEffect(() => {
 *     // Mark ready when initial data is loaded
 *     markReady();
 *   }, [data]);
 *
 *   return <View>...</View>;
 * }
 * ```
 */
export function useScreenPerformance(screenName: string) {
  const startTimeRef = useRef<number>(Date.now());
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const isReadyRef = useRef(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
    performanceTracker.mark(`${screenName}_start`);

    return () => {
      performanceTracker.mark(`${screenName}_unmount`);
    };
  }, [screenName]);

  const markReady = useCallback(() => {
    if (isReadyRef.current) return;
    isReadyRef.current = true;

    performanceTracker.mark(`${screenName}_ready`);
    const duration = performanceTracker.measure(
      `${screenName}_load`,
      `${screenName}_start`,
      `${screenName}_ready`
    );

    if (duration !== undefined) {
      setLoadTime(duration);

      // Warn if load time exceeds target
      if (duration > 1000 && __DEV__) {
        console.warn(
          `[Performance] Screen "${screenName}" took ${duration.toFixed(0)}ms to load. Target: <1000ms`
        );
      }
    }
  }, [screenName]);

  return {
    markReady,
    loadTime,
    startTime: startTimeRef.current,
  };
}

/**
 * Hook for measuring data fetch time
 *
 * @example
 * ```tsx
 * const { measureFetch } = useFetchPerformance();
 *
 * const data = await measureFetch('user_profile', async () => {
 *   return fetchUserProfile();
 * });
 * ```
 */
export function useFetchPerformance() {
  const measureFetch = useCallback(async <T>(
    name: string,
    fetchFn: () => Promise<T>
  ): Promise<T> => {
    performanceTracker.mark(`fetch_${name}_start`);
    try {
      const result = await fetchFn();
      performanceTracker.mark(`fetch_${name}_end`);
      performanceTracker.measure(
        `fetch_${name}`,
        `fetch_${name}_start`,
        `fetch_${name}_end`
      );
      return result;
    } catch (error) {
      performanceTracker.mark(`fetch_${name}_error`);
      performanceTracker.measure(
        `fetch_${name}_error`,
        `fetch_${name}_start`,
        `fetch_${name}_error`
      );
      throw error;
    }
  }, []);

  return { measureFetch };
}

/**
 * Hook for measuring render performance
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { renderCount, lastRenderTime } = useRenderPerformance('MyComponent');
 *   return <View>Rendered {renderCount} times</View>;
 * }
 * ```
 */
export function useRenderPerformance(componentName: string) {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef<number>(Date.now());
  const [, forceUpdate] = useState({});

  useEffect(() => {
    renderCountRef.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTimeRef.current;
    lastRenderTimeRef.current = now;

    if (__DEV__ && renderCountRef.current > 1) {
      console.log(
        `[Performance] ${componentName} re-rendered. ` +
        `Count: ${renderCountRef.current}, Time since last: ${timeSinceLastRender}ms`
      );
    }
  });

  return {
    renderCount: renderCountRef.current,
    lastRenderTime: lastRenderTimeRef.current,
  };
}

/**
 * Measure function execution time
 *
 * @example
 * ```ts
 * const result = await measureAsync('heavyOperation', async () => {
 *   return doSomethingHeavy();
 * });
 * ```
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    if (__DEV__) {
      console.log(`[Performance] ${name}: ${duration}ms`);
    }
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    if (__DEV__) {
      console.log(`[Performance] ${name} (error): ${duration}ms`);
    }
    throw error;
  }
}

/**
 * Measure synchronous function execution time
 */
export function measureSync<T>(name: string, fn: () => T): T {
  const start = Date.now();
  try {
    const result = fn();
    const duration = Date.now() - start;
    if (__DEV__) {
      console.log(`[Performance] ${name}: ${duration}ms`);
    }
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    if (__DEV__) {
      console.log(`[Performance] ${name} (error): ${duration}ms`);
    }
    throw error;
  }
}

/**
 * Frame rate monitor for animations
 *
 * @example
 * ```tsx
 * const { fps, start, stop } = useFrameRateMonitor();
 *
 * useEffect(() => {
 *   start();
 *   return () => stop();
 * }, []);
 * ```
 */
export function useFrameRateMonitor() {
  const [fps, setFps] = useState(60);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const animationFrameRef = useRef<number | undefined>(undefined);
  const isRunningRef = useRef(false);

  const measureFrame = useCallback(() => {
    if (!isRunningRef.current) return;

    frameCountRef.current += 1;
    const now = Date.now();
    const elapsed = now - lastTimeRef.current;

    if (elapsed >= 1000) {
      const currentFps = Math.round((frameCountRef.current * 1000) / elapsed);
      setFps(currentFps);

      if (__DEV__ && currentFps < 55) {
        console.warn(`[Performance] Low frame rate: ${currentFps} FPS`);
      }

      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    animationFrameRef.current = requestAnimationFrame(measureFrame);
  }, []);

  const start = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    frameCountRef.current = 0;
    lastTimeRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(measureFrame);
  }, [measureFrame]);

  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { fps, start, stop };
}
