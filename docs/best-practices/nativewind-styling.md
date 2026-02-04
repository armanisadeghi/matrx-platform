# NativeWind 4 Styling Best Practices

> Production patterns for styling React Native applications with Tailwind CSS via NativeWind.

## Overview

NativeWind brings Tailwind CSS to React Native, enabling utility-first styling with full dark mode support, CSS variables, and platform-specific patterns. Version 4.x is the current stable release compatible with Expo SDK 54.

## Configuration

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',  // NativeWind manages class switching
  theme: {
    extend: {
      colors: {
        // Use CSS variables for dynamic theming
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### global.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-background: 255 255 255;
    --color-surface: 248 249 250;
    --color-primary: 30 58 95;
    --color-text-primary: 17 24 39;
    --color-text-secondary: 107 114 128;
    --color-border: 229 231 235;
  }
  
  .dark {
    --color-background: 10 10 11;
    --color-surface: 20 20 22;
    --color-primary: 45 90 138;
    --color-text-primary: 249 250 251;
    --color-text-secondary: 156 163 175;
    --color-border: 42 42 46;
  }
}
```

### Metro Configuration

`metro.config.js`:

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
```

### Babel Configuration

`babel.config.js`:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
  };
};
```

## Component Patterns

### Basic Component

```tsx
import { View, Text, Pressable } from 'react-native';

export function Card({ title, onPress }: CardProps) {
  return (
    <Pressable 
      onPress={onPress}
      className="bg-surface rounded-xl p-4 border border-border active:opacity-80"
    >
      <Text className="text-text-primary text-lg font-semibold">{title}</Text>
    </Pressable>
  );
}
```

### Component with className Prop

Always forward className for composition:

```tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  onPress?: () => void;
}

export function Button({ children, variant = 'primary', className, onPress }: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg items-center justify-center';
  const variantStyles = {
    primary: 'bg-primary',
    secondary: 'bg-surface border border-border',
  };
  
  return (
    <Pressable 
      onPress={onPress}
      className={`${baseStyles} ${variantStyles[variant]} ${className ?? ''}`}
    >
      <Text className={variant === 'primary' ? 'text-white font-semibold' : 'text-text-primary'}>
        {children}
      </Text>
    </Pressable>
  );
}
```

### Using cn() for Conditional Classes

Install `clsx` and `tailwind-merge`:

```bash
pnpm add clsx tailwind-merge
```

Create utility:

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Usage:

```tsx
import { cn } from '@/lib/utils';

<View className={cn(
  'p-4 rounded-lg',
  isActive && 'bg-primary',
  isDisabled && 'opacity-50',
  className
)} />
```

## Dark Mode

### Automatic Detection

NativeWind detects system color scheme automatically. Access via hook:

```typescript
import { useColorScheme } from 'nativewind';

function ThemeToggle() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();
  
  return (
    <Pressable onPress={toggleColorScheme}>
      <Text className="text-text-primary">
        Current: {colorScheme}
      </Text>
    </Pressable>
  );
}
```

### Dark Mode Classes

Use `dark:` prefix for dark mode overrides:

```tsx
<View className="bg-white dark:bg-black">
  <Text className="text-gray-900 dark:text-gray-100">
    Adapts to color scheme
  </Text>
</View>
```

**Note**: With CSS variables, you rarely need `dark:` prefixes—variables handle the switching.

## CSS Variables with vars()

### Runtime Theme Switching

```typescript
import { vars } from 'nativewind';

const themes = {
  brand: vars({
    '--color-primary': '30 58 95',
    '--color-background': '255 255 255',
  }),
  holiday: vars({
    '--color-primary': '185 28 28',
    '--color-background': '254 242 242',
  }),
};

function App() {
  const [theme, setTheme] = useState<'brand' | 'holiday'>('brand');
  
  return (
    <View style={themes[theme]} className="flex-1 bg-background">
      <Content />
    </View>
  );
}
```

## Platform-Specific Styling

### Platform Select

```tsx
import { Platform } from 'react-native';

<View className={Platform.select({
  ios: 'pt-12',     // iOS notch
  android: 'pt-8',  // Android status bar
  default: 'pt-4',
})} />
```

### Platform Files

For complex platform differences, use file extensions:

```
components/
  Button/
    Button.tsx          # Shared logic
    Button.ios.tsx      # iOS-specific UI
    Button.android.tsx  # Android-specific UI
    Button.web.tsx      # Web fallback
    index.ts
```

## Safe Area Integration

### With useSafeAreaInsets

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Header() {
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      className="bg-surface border-b border-border px-4"
      style={{ paddingTop: insets.top + 12 }}
    >
      <Text className="text-text-primary text-xl font-bold">Title</Text>
    </View>
  );
}
```

### Mixing Style Objects and Classes

```tsx
<View 
  className="bg-background flex-1 px-4"
  style={{ paddingBottom: Math.max(insets.bottom, 16) }}
>
```

## Typography Scale

Define consistent typography in Tailwind config:

```javascript
theme: {
  extend: {
    fontSize: {
      'display': ['36px', { lineHeight: '44px', fontWeight: '700' }],
      'headline': ['28px', { lineHeight: '36px', fontWeight: '600' }],
      'title': ['22px', { lineHeight: '28px', fontWeight: '600' }],
      'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
      'caption': ['14px', { lineHeight: '20px', fontWeight: '400' }],
      'label': ['12px', { lineHeight: '16px', fontWeight: '500' }],
    },
  },
},
```

Usage:

```tsx
<Text className="text-headline text-text-primary">Heading</Text>
<Text className="text-body text-text-secondary">Body text</Text>
```

## Spacing Consistency

Use Tailwind's default spacing scale or customize:

```javascript
theme: {
  extend: {
    spacing: {
      'xs': '4px',
      'sm': '8px',
      'md': '16px',
      'lg': '24px',
      'xl': '32px',
      '2xl': '48px',
    },
  },
},
```

## Animations

### CSS Transitions (Reanimated 4)

NativeWind supports CSS-style transitions via Reanimated 4:

```tsx
<View 
  className={cn(
    'transition-all duration-300',
    isExpanded ? 'h-48' : 'h-16'
  )}
/>
```

**Note**: NativeWind 4.x requires Reanimated v3. Full CSS animation support comes in NativeWind v5.

## Performance Tips

1. **Avoid dynamic class generation**: Build classes statically when possible
2. **Use `className` prop**: Enables compile-time optimization
3. **Minimize inline styles**: Reserve for truly dynamic values (safe area insets)
4. **Leverage CSS variables**: Single point of update for theme changes

## Do Not

1. **Mix StyleSheet.create with NativeWind** - Pick one approach per component
2. **Use arbitrary values excessively** - Define tokens in config
3. **Hardcode colors** - Always use theme tokens
4. **Forget `flex-1`** - Required for full-height containers in RN

## Resources

- [NativeWind Documentation](https://www.nativewind.dev/)
- [NativeWind Dark Mode](https://nativewind.dev/docs/core-concepts/dark-mode)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [vars() API Reference](https://www.nativewind.dev/api/vars)
- [NativeWind Themes Guide](https://www.nativewind.dev/guides/themes)

---

## TASKS

- [ ] **Install `clsx` and `tailwind-merge` packages** - Run `pnpm add clsx tailwind-merge` to enable the `cn()` utility pattern
- [ ] **Create `cn()` utility function** - Add `lib/utils.ts` with the `cn()` helper for conditional class merging
- [ ] **Replace hardcoded colors with theme tokens** - Multiple files affected:
  - [ ] `components/ui/Button.tsx:164` - Replace `#1E3A5F` and `#FFFFFF` with theme colors
  - [ ] `components/ui/Toggle.tsx:87,90,91,141` - Replace `#2A2A2E`, `#E2E8F0`, `#FFFFFF`, `#F8FAFC` with theme colors
  - [ ] `components/ui/IconButton.tsx:125,177` - Replace `#FFFFFF` with theme color
  - [ ] `components/ui/Spinner.tsx:63` - Replace `#FFFFFF` with `colors.foreground.inverse`
  - [ ] `components/glass/GlassContainer.android.tsx:52-54,78` - Use theme colors from `useTheme()` hook
  - [ ] `components/glass/GlassContainer.web.tsx:32-38` - Use theme colors from `useTheme()` hook
  - [ ] `components/layouts/ModalLayout.tsx:168` - Replace `#000` in shadow with theme variable
- [ ] **Add custom typography scale to Tailwind config** - Add `fontSize` entries for `display`, `headline`, `title`, `body`, `caption`, `label` to `tailwind.config.js` theme.extend
- [ ] **Refactor redundant StyleSheet.create usage** - Replace with NativeWind classes where possible:
  - [ ] `components/layouts/ScreenLayout.tsx:86-89` - Remove `styles.container` (already using `flex-1` className)
  - [ ] `components/layouts/Header.tsx:128-137` - Convert flexDirection/alignItems/justifyContent to NativeWind classes
- [ ] **Consider adding CSS transition classes** - Evaluate using `transition-all duration-300` for interactive state changes in components like Toggle, Button (requires testing with Reanimated 4)

## TO DISCUSS

- **Current approach:** Color system uses nested objects with variants (`primary.DEFAULT`, `primary.light`, `primary.dark`) and comprehensive semantic tokens (`foreground`, `surface-elevated`, `border-subtle`)
- **Document suggests:** Simpler flat color tokens (`background`, `surface`, `primary`, `text-primary`, `text-secondary`)
- **Why current is better:** The expanded color system provides more granular control for a B2B enterprise design system. Having light/dark variants for primary colors, multiple elevation levels for surfaces, and semantic colors with light backgrounds (for badges, alerts) enables more sophisticated UI without reaching for arbitrary values.

---

- **Current approach:** Uses `foreground` naming for text colors (`text-foreground`, `text-foreground-secondary`, `text-foreground-muted`)
- **Document suggests:** Uses `text-primary` and `text-secondary` naming
- **Why current is better:** Using `foreground` avoids naming collision with `primary` brand color (e.g., `text-primary` could mean "primary brand color text" vs "primary importance text"). The `foreground` convention aligns with modern design systems like shadcn/ui and Radix Themes.

---

- **Current approach:** Some `StyleSheet.create` usage alongside NativeWind (e.g., `scrollContent` in `HeaderLayout.tsx`, shadow objects in `ModalLayout.tsx`)
- **Document suggests:** "Do not mix StyleSheet.create with NativeWind"
- **Why current is acceptable:** Certain patterns require `StyleSheet.create`: (1) `contentContainerStyle` for ScrollView needs a style object, not className, (2) React Native shadows require numeric objects that can't be expressed as Tailwind classes, (3) Dynamic calculations based on `Dimensions` or `insets`. The rule should be: prefer NativeWind, but use StyleSheet for values that can't be expressed as classes.

---

- **Current approach:** Comprehensive `constants/typography.ts` with programmatic access to font sizes, weights, and line heights
- **Document suggests:** Define typography only in `tailwind.config.js`
- **Why current is better:** Having both allows NativeWind classes for styling (`text-lg font-semibold`) while also providing numeric values for native APIs that require numbers (e.g., `fontSize` prop on native components, calculations for layout). Consider documenting this dual approach.

---

- **Current approach:** Platform-specific files already implemented for `GlassContainer` (`*.ios.tsx`, `*.android.tsx`, `*.web.tsx`, `index.ts`)
- **Document suggests:** This exact pattern
- **Status:** ✅ Codebase already follows best practice
