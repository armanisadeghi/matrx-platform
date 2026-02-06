/**
 * SINGLE POINT OF THEME ACCESS
 *
 * This hook provides typed access to all theme values.
 * Use NativeWind classes for styling whenever possible.
 * Use this hook for programmatic access to theme values.
 */

import { useMemo } from "react";
import { useAppColorScheme } from "./useAppColorScheme";
import {
  theme,
  getColors,
  type ColorScheme,
  type Colors,
  type Theme,
} from "@/constants/theme";

interface UseThemeReturn {
  /** Current color scheme */
  colorScheme: ColorScheme;
  /** Whether dark mode is active */
  isDark: boolean;
  /** Colors for the current color scheme */
  colors: Colors;
  /** Typography configuration */
  typography: Theme["typography"];
  /** Text style presets */
  textStyles: Theme["textStyles"];
  /** Spacing scale */
  spacing: Theme["spacing"];
  /** Component spacing presets */
  componentSpacing: Theme["componentSpacing"];
  /** Border radius scale */
  borderRadius: Theme["borderRadius"];
  /** Shadow definitions */
  shadows: Theme["shadows"];
  /** Toggle color scheme */
  toggleColorScheme: () => void;
  /** Set color scheme */
  setColorScheme: (scheme: ColorScheme | "system") => void;
}

/**
 * Hook to access theme values with color scheme awareness
 *
 * Provides memoized access to all design tokens.
 * Colors are automatically resolved based on the current color scheme.
 *
 * @example
 * ```tsx
 * const { colors, isDark, spacing } = useTheme();
 *
 * // For programmatic styling (prefer NativeWind classes)
 * const style = {
 *   backgroundColor: colors.background.DEFAULT,
 *   padding: spacing[4],
 * };
 *
 * // For conditional rendering
 * if (isDark) {
 *   // Dark mode specific logic
 * }
 * ```
 */
export function useTheme(): UseThemeReturn {
  const { colorScheme, isDark, toggleColorScheme, setColorScheme } =
    useAppColorScheme();

  // Memoize colors based on color scheme
  const colors = useMemo(() => getColors(colorScheme), [colorScheme]);

  return {
    colorScheme,
    isDark,
    colors,
    typography: theme.typography,
    textStyles: theme.textStyles,
    spacing: theme.spacing,
    componentSpacing: theme.componentSpacing,
    borderRadius: theme.borderRadius,
    shadows: theme.shadows,
    toggleColorScheme,
    setColorScheme,
  };
}
