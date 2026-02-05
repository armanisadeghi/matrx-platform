/**
 * useHaptics - Web/fallback implementation
 *
 * No-op on web and unsupported platforms.
 * The native implementation is in useHaptics.native.ts.
 */

const noop = () => {};

export function useHaptics() {
  return {
    light: noop,
    medium: noop,
    heavy: noop,
    selection: noop,
    success: noop,
    warning: noop,
    error: noop,
  };
}
