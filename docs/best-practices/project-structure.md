# Project Structure and Module Organization

> Production patterns for organizing code in Expo/React Native applications.

## Directory Structure

```
mobile-native/
├── app/                    # Expo Router file-based routes
│   ├── _layout.tsx        # Root layout (providers, global setup)
│   ├── index.tsx          # Entry redirect
│   ├── +not-found.tsx     # 404 handler
│   ├── (tabs)/            # Tab navigator group
│   │   ├── _layout.tsx    # Tab bar configuration
│   │   └── [screens].tsx  # Tab screens
│   └── (auth)/            # Auth flow group (no tabs)
│       └── [screens].tsx
├── components/             # Reusable UI components
│   ├── glass/             # Platform-specific glass effects
│   ├── layouts/           # Layout components
│   ├── ui/                # Core UI primitives
│   └── index.ts           # Barrel export
├── constants/              # Design tokens and configuration
│   ├── colors.ts          # Color palette
│   ├── typography.ts      # Font scales
│   ├── spacing.ts         # Spacing scale
│   ├── theme.ts           # Aggregated theme
│   └── index.ts           # Barrel export
├── hooks/                  # Custom React hooks
│   ├── useTheme.ts
│   ├── useAppColorScheme.ts
│   └── index.ts
├── lib/                    # Utility functions
│   ├── platform.ts        # Platform detection
│   └── index.ts
├── assets/                 # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
├── app.config.ts          # Expo configuration
├── tailwind.config.js     # NativeWind/Tailwind config
├── global.css             # CSS variables and base styles
├── metro.config.js        # Metro bundler config
├── babel.config.js        # Babel configuration
└── tsconfig.json          # TypeScript configuration
```

## Barrel Export Pattern

### What is a Barrel?

A barrel is an `index.ts` file that re-exports modules from a directory, providing a clean import surface.

### Implementation

```typescript
// components/ui/index.ts
export { Button, type ButtonProps, type ButtonVariant } from './Button';
export { Card, CardHeader, CardContent, CardFooter, type CardProps } from './Card';
export { Input, TextArea, type InputProps } from './Input';
export { Text, type TextProps, type TextVariant } from './Text';
export { Avatar, type AvatarProps } from './Avatar';
export { Badge, type BadgeProps } from './Badge';
export { Divider } from './Divider';
export { IconButton, type IconButtonProps } from './IconButton';
export { ListItem, type ListItemProps } from './ListItem';
export { Spinner, type SpinnerProps } from './Spinner';
export { Toggle, type ToggleProps } from './Toggle';
```

```typescript
// components/index.ts
export * from './glass';
export * from './layouts';
export * from './ui';
```

### Import Usage

```typescript
// Clean imports via barrel
import { Button, Card, Text, Input } from '@/components';
import { useTheme, useAppColorScheme } from '@/hooks';
import { colors, spacing } from '@/constants';
import { isIOS, platformSelect } from '@/lib';

// NOT this:
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
```

## Path Aliases

### tsconfig.json Configuration

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Usage

```typescript
// With alias
import { Button } from '@/components';
import { useTheme } from '@/hooks';

// Without alias (avoid)
import { Button } from '../../components';
import { useTheme } from '../../../hooks';
```

## Route Groups

### Purpose of Route Groups

Route groups (directories in parentheses) organize routes without affecting URLs:

```
app/
├── (tabs)/          # Tab navigation group
│   ├── _layout.tsx  # Tab bar layout
│   ├── index.tsx    # / (home tab)
│   ├── explore.tsx  # /explore
│   └── profile.tsx  # /profile
├── (auth)/          # Auth flow group
│   ├── _layout.tsx  # Auth layout (no tabs)
│   ├── login.tsx    # /login
│   └── register.tsx # /register
└── (demo)/          # Demo/dev group (deletable)
    └── ...
```

### When to Use Route Groups

- **Tab navigation** - Group all tab screens together
- **Auth flows** - Separate login/register from main app
- **Feature modules** - Group related screens
- **Platform-specific routes** - When layouts differ significantly

## Component Organization

### Single File Components

For simple components without platform variations:

```
components/ui/
├── Divider.tsx      # Simple component in single file
├── Spinner.tsx
└── index.ts
```

### Multi-File Components

For components with types, platform variations, or subcomponents:

```
components/ui/
├── Button/
│   ├── Button.tsx           # Main implementation
│   ├── Button.ios.tsx       # iOS variant (optional)
│   ├── Button.android.tsx   # Android variant (optional)
│   ├── types.ts             # Shared types (optional)
│   └── index.ts             # Barrel export
```

### Glass Components (Platform-Heavy)

```
components/glass/
├── GlassContainer.tsx       # Default/web fallback
├── GlassContainer.ios.tsx   # iOS Liquid Glass
├── GlassContainer.android.tsx # Android Material glass
├── types.ts                 # Shared types
└── index.ts
```

## Constants Organization

### Single Source of Truth

```typescript
// constants/colors.ts - Raw palette
export const colors = { light: {...}, dark: {...} };

// constants/typography.ts - Font configuration
export const typography = { fontFamily: {...}, fontSize: {...} };

// constants/spacing.ts - Spacing scale
export const spacing = { 1: 4, 2: 8, ... };

// constants/theme.ts - Aggregated theme
export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';
export const theme = { colors, typography, spacing };
```

## Hooks Organization

### Naming Convention

- `use[Domain][Action]` - e.g., `useAppColorScheme`, `useTheme`
- Keep hooks focused on single responsibility

### Structure

```typescript
// hooks/useTheme.ts
export function useTheme() { ... }

// hooks/useAppColorScheme.ts  
export function useAppColorScheme() { ... }

// hooks/index.ts
export { useTheme } from './useTheme';
export { useAppColorScheme } from './useAppColorScheme';
```

## Lib Organization

### Utility Functions

```typescript
// lib/platform.ts
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';
export function platformSelect<T>(options: {...}): T { ... }

// lib/utils.ts (if needed)
export function cn(...inputs: ClassValue[]) { ... }
export function formatDate(date: Date): string { ... }

// lib/index.ts
export * from './platform';
export * from './utils';
```

## Assets Organization

```
assets/
├── images/
│   ├── logo.png
│   ├── logo@2x.png      # 2x resolution
│   └── logo@3x.png      # 3x resolution
├── fonts/
│   ├── Inter-Regular.ttf
│   ├── Inter-Medium.ttf
│   └── Inter-Bold.ttf
└── icons/               # Custom SVG icons (if any)
    └── custom-icon.svg
```

### Image Resolution Suffixes

React Native automatically picks the right resolution:

```typescript
// Automatically resolves to logo@2x.png or logo@3x.png based on device
<Image source={require('@/assets/images/logo.png')} />
```

## Feature-Based Organization (Alternative)

For larger apps, consider feature-based structure:

```
features/
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── screens/
│   └── index.ts
├── profile/
│   ├── components/
│   ├── hooks/
│   ├── screens/
│   └── index.ts
└── messages/
    └── ...
```

### When to Use Feature-Based

- App has 10+ distinct features
- Teams work on separate features
- Features have isolated state/logic

### When to Use Flat Structure

- Smaller apps (< 10 features)
- Components heavily shared across features
- Single developer or small team

## Import Order Convention

```typescript
// 1. React/React Native
import { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';

// 2. External packages
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// 3. Internal aliases (@/)
import { Button, Card } from '@/components';
import { useTheme } from '@/hooks';
import { colors } from '@/constants';

// 4. Relative imports (minimize these)
import { localHelper } from './utils';

// 5. Types (always last in each group)
import type { ButtonProps } from '@/components';
```

## Critical Rules

1. **Always use barrel exports** - Clean import surface
2. **Always use path aliases** - No relative path hell
3. **Never import from internal paths** - Use barrels
4. **Keep constants in constants/** - Single source of truth
5. **Keep hooks in hooks/** - Easy to find
6. **Group platform files together** - Metro resolves them
7. **Route groups for navigation structure** - Not for code organization

## Resources

- [Expo Router File-based Routing](https://docs.expo.dev/router/introduction/)
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [Metro Bundler Resolution](https://reactnative.dev/docs/metro)
