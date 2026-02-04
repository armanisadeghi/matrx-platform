/**
 * SINGLE POINT OF COLOR SCHEME DETECTION
 *
 * This is the ONLY place where color scheme should be detected.
 * All components must use this hook to get the current color scheme.
 */

import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import type { ColorScheme } from "@/constants/colors";

interface UseAppColorSchemeReturn {
  /** Current color scheme ('light' or 'dark') */
  colorScheme: ColorScheme;
  /** Whether dark mode is active */
  isDark: boolean;
  /** Toggle between light and dark mode */
  toggleColorScheme: () => void;
  /** Set a specific color scheme */
  setColorScheme: (scheme: ColorScheme | "system") => void;
}

/**
 * Hook to access and control the app's color scheme
 *
 * This is the single source of truth for color scheme detection.
 * Components should NEVER use Appearance.getColorScheme() or
 * useColorScheme from react-native directly.
 *
 * @example
 * ```tsx
 * const { colorScheme, isDark, toggleColorScheme } = useAppColorScheme();
 *
 * return (
 *   <View className={isDark ? 'bg-background' : 'bg-background'}>
 *     <Button onPress={toggleColorScheme}>
 *       Toggle Theme
 *     </Button>
 *   </View>
 * );
 * ```
 */
export function useAppColorScheme(): UseAppColorSchemeReturn {
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();

  // Default to 'light' if undefined
  const resolvedScheme: ColorScheme = colorScheme === "dark" ? "dark" : "light";

  const toggleColorScheme = () => {
    setColorScheme(resolvedScheme === "dark" ? "light" : "dark");
  };

  const handleSetColorScheme = (scheme: ColorScheme | "system") => {
    setColorScheme(scheme);
  };

  return {
    colorScheme: resolvedScheme,
    isDark: resolvedScheme === "dark",
    toggleColorScheme,
    setColorScheme: handleSetColorScheme,
  };
}
