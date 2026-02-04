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
