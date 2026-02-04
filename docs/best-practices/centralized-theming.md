# Centralized Light/Dark Mode Theming

> The single source of truth pattern for React Native theming that eliminates hardcoded colors and automates light/dark switching.

## The Golden Rule

**ZERO hardcoded colors in components.** Every color reference flows from the centralized theme system. Violations are unacceptable and create maintenance nightmares.

## Architecture Overview

```
constants/
  colors.ts       # Raw color palette definitions
  theme.ts        # Semantic token mapping (light/dark)
  typography.ts   # Font scales
  spacing.ts      # Spacing scale
  index.ts        # Unified export

hooks/
  useTheme.ts     # Theme consumption hook
  useAppColorScheme.ts  # Color scheme detection

global.css        # CSS variables for NativeWind
tailwind.config.js # Tailwind theme extension
```

## Step 1: Define Raw Color Palette

`constants/colors.ts` contains the raw palette—no semantic meaning:

```typescript
export const palette = {
  // Primary
  blue900: '#0F1F33',
  blue700: '#1E3A5F',
  blue500: '#2D5A8A',
  blue300: '#5B8CC5',
  
  // Neutrals
  white: '#FFFFFF',
  gray50: '#F8F9FA',
  gray100: '#F1F3F5',
  gray200: '#E5E7EB',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  black: '#0A0A0B',
  
  // Semantic
  green600: '#059669',
  amber600: '#D97706',
  red600: '#DC2626',
  blue600: '#2563EB',
} as const;
```

## Step 2: Create Semantic Theme Tokens

`constants/theme.ts` maps raw colors to semantic tokens with light/dark variants:

```typescript
import { palette } from './colors';

export const lightTheme = {
  colors: {
    // Backgrounds
    background: palette.white,
    surface: palette.gray50,
    surfaceElevated: palette.white,
    
    // Text
    textPrimary: palette.gray900,
    textSecondary: palette.gray700,
    textMuted: palette.gray500,
    textInverse: palette.white,
    
    // Brand
    primary: palette.blue700,
    primaryLight: palette.blue500,
    primaryDark: palette.blue900,
    
    // Borders
    border: palette.gray200,
    borderFocused: palette.blue500,
    
    // Semantic
    success: palette.green600,
    warning: palette.amber600,
    error: palette.red600,
    info: palette.blue600,
    
    // Interactive
    buttonPrimary: palette.blue700,
    buttonPrimaryText: palette.white,
    buttonSecondary: palette.gray100,
    buttonSecondaryText: palette.gray900,
  },
} as const;

export const darkTheme = {
  colors: {
    // Backgrounds
    background: palette.black,
    surface: '#141416',
    surfaceElevated: '#1C1C1E',
    
    // Text
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
    textInverse: palette.gray900,
    
    // Brand
    primary: palette.blue500,
    primaryLight: palette.blue300,
    primaryDark: palette.blue700,
    
    // Borders
    border: '#2A2A2E',
    borderFocused: palette.blue500,
    
    // Semantic (same in dark mode for consistency)
    success: palette.green600,
    warning: palette.amber600,
    error: palette.red600,
    info: palette.blue600,
    
    // Interactive
    buttonPrimary: palette.blue500,
    buttonPrimaryText: palette.white,
    buttonSecondary: '#2A2A2E',
    buttonSecondaryText: '#F9FAFB',
  },
} as const;

export type ThemeColors = typeof lightTheme.colors;
```

## Step 3: Configure CSS Variables

`global.css` defines CSS variables consumed by NativeWind:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Backgrounds */
    --color-background: 255 255 255;
    --color-surface: 248 249 250;
    --color-surface-elevated: 255 255 255;
    
    /* Text */
    --color-text-primary: 17 24 39;
    --color-text-secondary: 107 114 128;
    
    /* Brand */
    --color-primary: 30 58 95;
    
    /* Borders */
    --color-border: 229 231 235;
    
    /* Semantic */
    --color-success: 5 150 105;
    --color-warning: 217 119 6;
    --color-error: 220 38 38;
  }
  
  .dark {
    /* Backgrounds */
    --color-background: 10 10 11;
    --color-surface: 20 20 22;
    --color-surface-elevated: 28 28 30;
    
    /* Text */
    --color-text-primary: 249 250 251;
    --color-text-secondary: 156 163 175;
    
    /* Brand */
    --color-primary: 45 90 138;
    
    /* Borders */
    --color-border: 42 42 46;
    
    /* Semantic - unchanged */
    --color-success: 5 150 105;
    --color-warning: 217 119 6;
    --color-error: 220 38 38;
  }
}
```

## Step 4: Extend Tailwind Config

`tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-elevated': 'rgb(var(--color-surface-elevated) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
```

## Step 5: Create Theme Hook

`hooks/useTheme.ts`:

```typescript
import { useColorScheme } from 'nativewind';
import { lightTheme, darkTheme, ThemeColors } from '@/constants/theme';

export function useTheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();
  
  const isDark = colorScheme === 'dark';
  const colors: ThemeColors = isDark ? darkTheme.colors : lightTheme.colors;
  
  return {
    colorScheme,
    setColorScheme,
    toggleColorScheme,
    isDark,
    colors,
  };
}
```

## Step 6: Configure App for Automatic Switching

`app.config.ts`:

```typescript
export default {
  // ...
  userInterfaceStyle: 'automatic',  // Follows system preference
  ios: {
    infoPlist: {
      UIUserInterfaceStyle: 'Automatic',
    },
  },
  plugins: [
    [
      'expo-splash-screen',
      {
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#0A0A0B',
        },
      },
    ],
  ],
};
```

## Usage in Components

### NativeWind Classes (Preferred)

```tsx
// Automatic light/dark switching
<View className="bg-background">
  <Text className="text-text-primary">Hello World</Text>
  <View className="border border-border rounded-lg bg-surface p-4">
    <Text className="text-text-secondary">Secondary content</Text>
  </View>
</View>
```

### JavaScript Access (When Needed)

```tsx
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { colors, isDark } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.textPrimary }}>Content</Text>
    </View>
  );
}
```

## Dynamic Theme Switching with vars()

For runtime theme changes beyond light/dark:

```typescript
import { vars } from 'nativewind';

const brandThemes = {
  default: vars({
    '--color-primary': '30 58 95',
  }),
  holiday: vars({
    '--color-primary': '185 28 28',  // Red for holidays
  }),
};

// Apply at root
<View style={brandThemes.holiday}>
  <App />
</View>
```

## React Navigation Integration

Prevent white flash on tab switches:

```tsx
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack />
    </ThemeProvider>
  );
}
```

## Validation Checklist

Run this grep to find violations:

```bash
# Find hardcoded colors (should return 0 results outside constants/)
rg '#[0-9A-Fa-f]{6}' --type tsx --type ts -g '!constants/*'

# Find rgb/rgba literals
rg 'rgba?\(' --type tsx --type ts -g '!constants/*' -g '!global.css'
```

## Critical Rules

1. **Never import colors directly** in components—always use `useTheme()` or Tailwind classes
2. **Never use inline color values** (`#FF0000`, `rgb(255,0,0)`)
3. **Always define both light and dark variants** for new tokens
4. **Test both modes** before shipping any UI changes
5. **Use semantic token names** (`textPrimary`, not `gray900`)

## Resources

- [NativeWind Theming Guide](https://www.nativewind.dev/guides/themes)
- [NativeWind Dark Mode](https://nativewind.dev/docs/core-concepts/dark-mode)
- [NativeWind vars() API](https://www.nativewind.dev/api/vars)
- [Tailwind CSS Custom Properties](https://tailwindcss.com/docs/customizing-colors#using-css-variables)

## TASKS

- [ ] Remove hardcoded hex colors in `Toggle.tsx` - use `colors.border.DEFAULT` and `colors.foreground.inverse` from useTheme instead of `#2A2A2E`, `#E2E8F0`, `#FFFFFF`, `#F8FAFC` - `components/ui/Toggle.tsx:87,90,91,141`
- [ ] Remove hardcoded spinner colors in `Button.tsx` - use theme colors for `#1E3A5F` and `#FFFFFF` - `components/ui/Button.tsx:164`
- [ ] Remove hardcoded white in `Spinner.tsx` - use `colors.foreground.inverse` instead of `#FFFFFF` - `components/ui/Spinner.tsx:63`
- [ ] Remove hardcoded colors in `IconButton.tsx` - use theme colors for `#FFFFFF` and rgba values - `components/ui/IconButton.tsx:125,169-170,177`
- [ ] Remove hardcoded colors in `GlassContainer.android.tsx` - use theme colors from `colors.primary.DEFAULT`, `colors.secondary.DEFAULT`, etc. - `components/glass/GlassContainer.android.tsx:52-54,78`
- [ ] Remove hardcoded rgba colors in `GlassContainer.web.tsx` - use theme colors with opacity - `components/glass/GlassContainer.web.tsx:32,35,38`
- [ ] Remove hardcoded icon colors in demo pages - use theme-aware colors - `app/(demo)/buttons.tsx:70,75` and `app/(demo)/index.tsx:87`
- [ ] Remove hardcoded background colors in demo layout - use NativeWind classes (`bg-background`) instead of inline styles - `app/(demo)/_layout.tsx:18`
- [ ] Add React Navigation ThemeProvider integration to root layout to prevent white flash on navigation - `app/_layout.tsx` (as documented in Step 6)
- [ ] Add `foreground.inverse` (white for light mode, dark for dark mode) as a standard semantic token to use for icon/text colors on filled buttons/elements - `constants/colors.ts`

## TO DISCUSS

- **Current approach:** Colors are structured as nested `light`/`dark` objects in `colors.ts` with semantic groupings (primary.DEFAULT, primary.light, primary.dark)
- **Document suggests:** Flat `palette` object with raw colors, separate `lightTheme`/`darkTheme` objects in `theme.ts`
- **Why current is better:** The nested structure with DEFAULT/light/dark variants maps directly to Tailwind's color system (e.g., `bg-primary`, `bg-primary-light`), reducing cognitive overhead and enabling consistent usage patterns across NativeWind classes and programmatic access.

---

- **Current approach:** Uses `foreground` for text colors (`foreground.DEFAULT`, `foreground.secondary`, `foreground.muted`)
- **Document suggests:** Uses `textPrimary`, `textSecondary`, `textMuted` naming
- **Why current is better:** The `foreground` naming convention aligns with modern design systems (shadcn/ui, Radix) and complements `background` semantically. It also works better with Tailwind's class system (`text-foreground` vs `text-text-primary`).

---

- **Current approach:** Semantic colors (success, warning, error, info) have different values in dark mode for better contrast
- **Document suggests:** "Semantic (same in dark mode for consistency)"
- **Why current is better:** Adjusting semantic colors for dark mode improves accessibility and visual comfort. For example, `#DC2626` (red-600) is appropriate on white but `#F87171` (red-400) provides better readability on dark backgrounds without being harsh.

---

- **Current approach:** `useTheme` hook provides access to typography, spacing, componentSpacing, borderRadius, and shadows in addition to colors
- **Document suggests:** Only shows colors in the `useTheme` return value
- **Why current is better:** Providing comprehensive access to all design tokens through a single hook creates a unified API and eliminates the need to import multiple constants files when doing programmatic styling.

---

- **Current approach:** CSS variables in `global.css` include hex color comments (e.g., `/* #1E3A5F */`)
- **Document suggests:** No comments on CSS variable definitions
- **Why current is better:** The hex comments provide immediate visual reference when inspecting the CSS, making it easier to understand and debug theme values without needing to convert RGB values mentally.
