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
