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

- [x] Remove hardcoded hex colors in `Toggle.tsx` - use `colors.border.DEFAULT` and `colors.foreground.inverse` from useTheme instead of `#2A2A2E`, `#E2E8F0`, `#FFFFFF`, `#F8FAFC` - `components/ui/Toggle.tsx`
- [x] Remove hardcoded spinner colors in `Button.tsx` - use theme colors for `#1E3A5F` and `#FFFFFF` - `components/ui/Button.tsx`
- [x] Remove hardcoded white in `Spinner.tsx` - use `colors.foreground.inverse` instead of `#FFFFFF` - `components/ui/Spinner.tsx`
- [x] Remove hardcoded colors in `IconButton.tsx` - use theme colors for `#FFFFFF` and rgba values - `components/ui/IconButton.tsx`
- [x] Remove hardcoded colors in `GlassContainer.android.tsx` - use theme colors from `colors.primary.DEFAULT`, `colors.secondary.DEFAULT`, etc. - `components/glass/GlassContainer.android.tsx`
- [x] Remove hardcoded rgba colors in `GlassContainer.web.tsx` - use theme colors with opacity via `hexToRgba()` helper - `components/glass/GlassContainer.web.tsx`
- [x] Remove hardcoded icon colors in demo pages - use theme-aware colors - `app/(demo)/buttons.tsx` and `app/(demo)/index.tsx`
- [x] Remove hardcoded background colors in demo layout - use `colors.background.DEFAULT` from `useTheme()` - `app/(demo)/_layout.tsx`
- [x] Add React Navigation ThemeProvider integration to root layout to prevent white flash on navigation - `app/_layout.tsx`
- [x] `foreground.inverse` (white for light mode, dark for dark mode) already existed as a semantic token in `constants/colors.ts` - now used consistently across all components

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

---

## Implementation Notes: Hardcoded Color Elimination & ThemeProvider Integration

> Completed as part of the design system setup task. This section documents the research, decisions, and changes made.

### Research Summary

An extensive web research was conducted across NativeWind documentation, Expo docs, State of React Native 2024 survey results, Shopify engineering blog, and multiple styling benchmark repositories to determine the absolute best practice for managing colors, styles, and light/dark mode in a cross-platform React Native/Expo project (Web, iOS, Android).

**Key finding:** The project's existing architecture—NativeWind v4 with CSS variables in `global.css` as the single source of truth, Tailwind utility classes for 95% of styling, and `useTheme()` for programmatic access—is already the industry-recommended best practice. This was confirmed across:

- [NativeWind Themes Guide](https://www.nativewind.dev/docs/guides/themes)
- [NativeWind Dark Mode](https://www.nativewind.dev/docs/core-concepts/dark-mode)
- [Expo Color Themes Documentation](https://docs.expo.dev/develop/user-interface/color-themes/)
- [State of React Native 2024: Styling](https://results.stateofreactnative.com/en-US/styling/) (NativeWind +15% popularity)
- [Shopify: 5 Ways to Improve RN Styling Workflow](https://shopify.engineering/5-ways-to-improve-your-react-native-styling-workflow)

**Alternatives evaluated:**
- `react-native-unistyles v3` — Requires New Architecture only (no Expo Go), C++ Nitro Modules for performance, but web support has known limitations and smaller ecosystem
- `Uniwind` — Too new for production template use; positions itself as NativeWind replacement
- `styled-components` — Legacy choice with runtime overhead, declining in RN ecosystem
- Plain `StyleSheet.create` + Context — Viable but requires excessive boilerplate with no utility class system

**Decision:** Keep NativeWind v4 + CSS variables. Focus efforts on eliminating all hardcoded color violations and completing the ThemeProvider integration.

### What Was Changed

#### 1. Component Hardcoded Color Fixes

Every hardcoded hex color and rgba literal was removed from components and demo pages. The grep validation command `rg '#[0-9A-Fa-f]{6}' components/ app/` now returns **zero results**.

| File | Before | After |
|---|---|---|
| `Button.tsx` | `#1E3A5F`, `#FFFFFF` for spinner | `colors.primary.DEFAULT`, `colors.foreground.inverse` via `useTheme()` |
| `Toggle.tsx` | `#2A2A2E`, `#E2E8F0`, `#FFFFFF`, `#F8FAFC` for switch tracks/thumb | `colors.border.DEFAULT`, `colors.foreground.inverse` via `useTheme()` |
| `Spinner.tsx` | `#FFFFFF` for white variant | `colors.foreground.inverse` |
| `IconButton.tsx` | `#FFFFFF` for filled variant, `rgba(255,255,255,0.1)` / `rgba(0,0,0,0.05)` for pressed states | `colors.foreground.inverse`, theme-derived hex+alpha strings |
| `GlassContainer.android.tsx` | `#3B82F6`, `#1E3A5F`, `#94A3B8`, `#64748B`, `#141416`, `#FFFFFF`, `#14141680`, `#FFFFFF80` | `colors.primary.DEFAULT`, `colors.secondary.DEFAULT`, `colors.surface.DEFAULT` with alpha suffix |
| `GlassContainer.web.tsx` | Hardcoded `rgba(59, 130, 246, 0.1)` etc. | `hexToRgba()` helper function that converts theme hex values to rgba at runtime |
| `buttons.tsx` (demo) | `#FFFFFF`, `#1E3A5F` for icon colors | `colors.foreground.inverse`, `colors.foreground.DEFAULT` |
| `index.tsx` (demo) | `#FBBF24`, `#F59E0B` for sun/moon icon | `colors.warning.DEFAULT` |
| `_layout.tsx` (demo) | `#0A0A0B`, `#FFFFFF` for contentStyle background | `colors.background.DEFAULT` via `useTheme()` |

#### 2. React Navigation ThemeProvider

Added `ThemeProvider` from `@react-navigation/native` to `app/_layout.tsx`. The navigation theme is built from our design tokens using `useMemo` for performance:

```tsx
const navigationTheme: Theme = useMemo(
  () => ({
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary.DEFAULT,
      background: colors.background.DEFAULT,
      card: colors.surface.DEFAULT,
      text: colors.foreground.DEFAULT,
      border: colors.border.DEFAULT,
      notification: colors.error.DEFAULT,
    },
  }),
  [isDark, colors]
);
```

This prevents the white flash during navigation transitions in dark mode and ensures all React Navigation internal UI (headers, tab bars, modals) uses our design tokens.

#### 3. Semantic Token Usage Pattern

The `foreground.inverse` token (already defined in `constants/colors.ts`) is now consistently used across all components for text/icons on filled/colored backgrounds:
- Light mode: `#F8FAFC` (near-white)
- Dark mode: `#0F172A` (near-black)

This ensures proper contrast regardless of the active color scheme.

### Thought Process

1. **"Why not just use `dark:` prefix everywhere?"** — The CSS variable approach in `global.css` means a single class like `bg-primary` automatically resolves to the correct color in both modes. Using `dark:` prefixes would require every developer to remember dual declarations, doubling the maintenance surface and creating opportunities for missed updates.

2. **"Why use `useTheme()` for ActivityIndicator/Ionicons colors?"** — NativeWind's `className` prop works with React Native's layout/style system, but third-party components like `ActivityIndicator`, `Ionicons`, and `RNSwitch` accept explicit `color` string props. These must receive resolved hex values, which requires the programmatic `useTheme()` path.

3. **"Why `colors.foreground.inverse` instead of a literal white?"** — In dark mode, `foreground.inverse` resolves to a dark color, which is correct for text on a light-colored filled button. A hardcoded `#FFFFFF` would be wrong in any context where the background color adapts to the theme.

4. **"Why add `hexToRgba()` in GlassContainer.web.tsx?"** — Web glass effects require CSS `rgba()` values with specific opacity for the backdrop. Rather than hardcoding these, the helper converts theme hex values to rgba strings, keeping the single source of truth in `global.css` / `colors.ts`.

### Possible Next Steps

- **Theme preference persistence:** The current `useAppColorScheme` hook does not persist the user's light/dark choice across app restarts. Consider adding `AsyncStorage` or `expo-secure-store` to save the preference and restore it on launch.
- ~~**ESLint custom rule:** Add a lint rule or pre-commit hook that detects hardcoded hex codes.~~ **DONE** - See "Automated Enforcement" section below.
- **Auto-generation of `colors.ts`:** The `constants/colors.ts` file currently mirrors `global.css` manually. A build-time script could parse the CSS variables and generate the TypeScript file, eliminating the risk of them drifting out of sync.
- **Dynamic color with `DynamicColorIOS`:** For iOS 26 Liquid Glass contexts where system colors adapt to the glass tint, consider using `DynamicColorIOS` from React Native to provide truly native adaptive colors.
- **NativeWind v5 migration:** NativeWind v5 (in development) promises first-class CSS variable support with improved performance. Monitor its release for potential migration.
- **Shadow token theming:** The shadow definitions in `constants/spacing.ts` use `shadowColor: "#000"`. While black shadows work in both modes, a fully theme-aware shadow system would use a semantic shadow color token.

---

## Automated Enforcement: ESLint Rule & Validation Script

> Added to prevent future design system violations. Developers get immediate feedback in their editor and CI pipeline when rules are broken.

### ESLint Custom Rule: `design-system/no-hardcoded-colors`

A custom ESLint plugin at `eslint-plugins/no-hardcoded-colors.mjs` detects hardcoded color values in component and app files. It is integrated into `eslint.config.mjs` and scoped to `app/`, `components/`, and `hooks/` directories only — `constants/` and config files are excluded.

**What it catches:**
- Hex color literals: `#FFF`, `#FFFFFF`, `#FF000080`
- RGB/RGBA function calls: `rgb(255, 0, 0)`, `rgba(0, 0, 0, 0.5)`
- Both in string literals and template literals

**What it allows:**
- `transparent`, `inherit`, `currentColor`, `none`
- Colors in `constants/` files (not scoped by the ESLint config block)
- CSS variable references like `var(--color-primary)`

**Error message shown to developers:**
```
error  Hardcoded color "#FF0000" detected. Use a design token from useTheme()
       (e.g., colors.primary.DEFAULT) or a NativeWind class (e.g., bg-primary) instead.
       design-system/no-hardcoded-colors
```

**Running:**
```bash
npm run lint          # Full ESLint (includes the rule)
npm run lint:colors   # Only the hardcoded-colors rule on app/components/hooks
```

### Pre-Build Validation Script

A comprehensive validation script at `scripts/validate-design-system.mjs` performs 5 checks that go beyond what ESLint can catch:

| Check | What It Does | Severity |
|---|---|---|
| **Check 1** | Scans `app/`, `components/`, `hooks/` for hardcoded hex and rgb/rgba values | Error |
| **Check 2** | Verifies CSS variable groups in `global.css` have matching entries in `colors.ts` | Warning |
| **Check 3** | Verifies `tailwind.config.js` references all CSS variable groups | Error |
| **Check 4** | Detects hardcoded colors in inline style props (`backgroundColor`, `borderColor`, `shadowColor`, etc.) | Error |
| **Check 5** | Flags hardcoded shadow colors in `constants/spacing.ts` | Warning |

**Running:**
```bash
npm run validate      # Design system validation only
npm run check         # Full check: validate + lint + typecheck
```

**Exit behavior:**
- Exits with code 0 if only warnings (pipeline continues)
- Exits with code 1 if any errors found (pipeline fails)

### Additional Fix: ModalLayout.tsx

During validation testing, the script caught a hardcoded `shadowColor: "#000"` in `components/layouts/ModalLayout.tsx` that was missed in the initial audit. This was fixed by replacing it with `colors.foreground.DEFAULT` from `useTheme()`, making the shadow color theme-aware (dark text color in light mode casts shadows correctly, light text color in dark mode produces subtle shadows on dark surfaces).

### How It Fits Into Development Workflow

1. **Editor integration:** The ESLint rule fires in real-time in VS Code, Cursor, and other editors with ESLint extensions. Developers see red squiggles immediately when they type a hardcoded color.
2. **Pre-commit (optional):** Add `npm run lint` to a lint-staged or husky pre-commit hook to block commits with violations.
3. **CI pipeline:** Add `npm run check` as a CI step. It runs validation + lint + typecheck in sequence and fails if any step has errors.
4. **Pre-build:** Run `npm run validate` before `expo prebuild` to catch issues before native builds.

---

## Implementation Notes: cn() Utility, Strict TypeScript, and Component Refactoring

> Completed as part of the second pass through best practices. All recommendations were verified via web search before implementation.

### What Was Changed

#### 1. `cn()` Utility Function — `lib/utils.ts`

Created the industry-standard `cn()` utility combining `clsx` (conditional class composition) with `tailwind-merge` (conflict resolution). This is the same pattern used by shadcn/ui, Tamagui, and most modern React/RN design systems.

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Why this matters:**
- Template literal className concatenation (`\`base ${conditional} ${className}\``) cannot resolve Tailwind conflicts. If a component has `px-4` as a default and the consumer passes `px-6`, both stay in the string and the result is unpredictable.
- `cn()` ensures the last-specified utility wins: `cn("px-4", "px-6")` → `"px-6"`.
- `cn()` handles `undefined`, `false`, `null`, and empty strings cleanly, eliminating the need for `className = ""` default parameter values.

**Dependencies added:** `clsx@^2.1.1`, `tailwind-merge@^3.4.0`

#### 2. Removed `react-native-paper` Dependency

A thorough search confirmed zero imports of `react-native-paper` anywhere in the codebase. It was installed but never used — dead weight adding to bundle size and install time. Removed from `package.json`.

#### 3. TypeScript Strict Compiler Options

Added three recommended strict options to `tsconfig.json` (verified against TypeScript 5.9 documentation):

| Option | Purpose |
|---|---|
| `noImplicitOverride: true` | Requires explicit `override` keyword when overriding base class methods |
| `noImplicitReturns: true` | Errors when not all code paths return a value |
| `noFallthroughCasesInSwitch: true` | Errors on switch case fallthrough without explicit `break`/`return` |

All three options pass cleanly with no errors on the existing codebase.

#### 4. Safe Area `Math.max()` Pattern

Applied `Math.max(insets.bottom, 16)` in `ModalLayout.tsx` for both fullscreen and sheet presentations. This ensures a minimum 16px bottom padding on devices without a home indicator bar (where `insets.bottom` is 0), preventing content from touching the screen edge.

#### 5. Component cn() Refactoring

Refactored **every UI component and layout** to use `cn()` instead of template literal string concatenation for className assembly. This is the complete list of refactored files:

| Component | File |
|---|---|
| Text | `components/ui/Text.tsx` |
| Button | `components/ui/Button.tsx` |
| Card, CardHeader, CardContent, CardFooter | `components/ui/Card.tsx` |
| Input | `components/ui/Input.tsx` |
| IconButton | `components/ui/IconButton.tsx` |
| Switch, Checkbox, Radio, RadioGroup | `components/ui/Toggle.tsx` |
| Avatar, AvatarGroup | `components/ui/Avatar.tsx` |
| Badge, BadgeGroup | `components/ui/Badge.tsx` |
| Divider | `components/ui/Divider.tsx` |
| ListItem, ListSection | `components/ui/ListItem.tsx` |
| Spinner | `components/ui/Spinner.tsx` |
| Header | `components/layouts/Header.tsx` |
| ScreenLayout | `components/layouts/ScreenLayout.tsx` |
| HeaderLayout | `components/layouts/HeaderLayout.tsx` |
| ModalLayout | `components/layouts/ModalLayout.tsx` |
| GlassContainer (iOS) | `components/glass/GlassContainer.ios.tsx` |
| GlassContainer (Android) | `components/glass/GlassContainer.android.tsx` |
| GlassContainer (Web) | `components/glass/GlassContainer.web.tsx` |

**Pattern applied to each:**

```tsx
// BEFORE:
className={`base-classes ${condition ? "conditional" : ""} ${className}`}
// with: className = "" as default parameter

// AFTER:
className={cn("base-classes", condition && "conditional", className)}
// with: className (no default needed — cn() handles undefined)
```

### Verification

After all changes:
- `npm run typecheck` — 0 errors
- `npm run lint` — 0 errors
- `npm run validate` — 0 errors, 5 pre-existing shadow warnings in `constants/spacing.ts`
