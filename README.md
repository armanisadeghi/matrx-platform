# Mobile Native Template

> **The starting point for all Matrx native applications.**

**Stack:** Expo SDK 54 · React Native 0.81 · iOS 26 · Android 16 · TypeScript Strict

---

## READ THIS FIRST (Developers & AI Agents)

Before writing ANY code in this repository, read these resources in order:

| Priority | Resource | What You'll Learn |
|----------|----------|-------------------|
| **1. Required** | This README | Core principles, critical rules, what NOT to do |
| **2. Required** | [Best Practices Index](./docs/best-practices/INDEX.md) | Quick reference for all patterns |
| **3. As Needed** | [docs/best-practices/](./docs/best-practices/) | Deep dives on specific topics |

**AI Agents:** The `.cursor/skills/mobile-native-standards/SKILL.md` file contains enforcement rules. Apply them on every change.

---

## Critical Rules (Violations Will Break the Build)

### 1. ZERO Hardcoded Colors

```typescript
// ❌ NEVER — Build will fail
<View style={{ backgroundColor: '#000000' }} />
<View className="bg-black" />
<Text style={{ color: 'white' }} />

// ✅ ALWAYS
import { useTheme } from '@/hooks';
const { colors } = useTheme();
<View style={{ backgroundColor: colors.background.primary }} />
```

All colors come from `constants/colors.ts` via the `useTheme()` hook.

### 2. NO Deprecated SafeAreaView

```typescript
// ❌ NEVER
import { SafeAreaView } from 'react-native';

// ✅ ALWAYS
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const insets = useSafeAreaInsets();
```

Or use layout components from `@/components/layouts`.

### 3. Reanimated 4 for ALL Animations

```typescript
// ❌ NEVER
import { Animated } from 'react-native';

// ✅ ALWAYS
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
```

### 4. NO `any` Types

```typescript
// ❌ NEVER
const data: any = fetchData();

// ✅ ALWAYS
interface User { id: string; name: string; }
const data: User = fetchData();
```

### 5. Use Provided Components

```typescript
// ❌ NEVER — Don't create your own
<TouchableOpacity><Text>Click</Text></TouchableOpacity>

// ✅ ALWAYS — Use the component library
import { Button } from '@/components/ui';
<Button onPress={handlePress}>Click</Button>
```

---

## Project Structure

```
mobile-native/
├── app/                      # Routes (Expo Router file-based)
│   ├── (tabs)/               # Tab navigation group
│   ├── (auth)/               # Auth flow group
│   └── _layout.tsx           # Root layout
├── components/
│   ├── ui/                   # ⭐ Reusable UI components (Button, Card, Input, etc.)
│   ├── glass/                # Glass effect components (iOS/Android/Web)
│   └── layouts/              # Screen layout templates
├── hooks/                    # Custom hooks (useTheme, useAnimatedPress, etc.)
├── constants/                # Theme tokens (colors, spacing, typography)
├── lib/                      # Utilities (cn, platform helpers)
├── docs/
│   └── best-practices/       # 📚 Detailed documentation
└── .cursor/
    └── skills/               # 🤖 AI agent enforcement rules
```

---

## Component Library

Import all UI components from a single location:

```typescript
import {
  // Interactive
  Button, Pressable, IconButton,
  // Display
  Text, Card, Badge, Avatar, Image,
  // Forms
  Input, Select, SearchBar,
  // Feedback
  Alert, Toast, Spinner, Skeleton, ProgressBar,
  // Layout
  ListItem, EmptyState, ScrollContainer,
  // Icons
  Icon,
} from '@/components/ui';
```

---

## Theming Quick Reference

```typescript
import { useTheme } from '@/hooks';

const { colors, colorScheme } = useTheme();

// Available color tokens:
colors.background.primary      // Main background
colors.background.secondary    // Card backgrounds
colors.background.elevated     // Elevated surfaces
colors.text.primary           // Main text
colors.text.secondary         // Muted text
colors.accent.primary         // Brand color
colors.accent.success         // Success states
colors.accent.error           // Error states
colors.border.default         // Standard borders
colors.surface.overlay        // Modal overlays
```

Full token list: `constants/colors.ts`

---

## Platform-Specific Code

```typescript
// For FULL component differences — use file extensions:
GlassContainer.ios.tsx        // iOS 26 Liquid Glass
GlassContainer.android.tsx    // Android 16 Material 3
GlassContainer.web.tsx        // Web fallback

// For SMALL differences — use Platform module:
import { Platform } from 'react-native';
const value = Platform.select({ ios: 10, android: 12, default: 8 });
```

---

## Documentation Index

| Topic | File | When to Read |
|-------|------|--------------|
| **Quick Reference** | [INDEX.md](./docs/best-practices/INDEX.md) | Always start here |
| **Theming** | [centralized-theming.md](./docs/best-practices/centralized-theming.md) | Styling any component |
| **Components** | [component-architecture.md](./docs/best-practices/component-architecture.md) | Creating new components |
| **Navigation** | [expo-router-navigation.md](./docs/best-practices/expo-router-navigation.md) | Adding screens/routes |
| **Layouts** | [layout-system.md](./docs/best-practices/layout-system.md) | Screen structure, safe areas |
| **Forms** | [form-handling.md](./docs/best-practices/form-handling.md) | Form inputs, validation |
| **Animations** | [reanimated-4-animations.md](./docs/best-practices/reanimated-4-animations.md) | Adding motion |
| **Icons** | [icons-and-graphics.md](./docs/best-practices/icons-and-graphics.md) | Using icons |
| **Platform Code** | [platform-specific-code.md](./docs/best-practices/platform-specific-code.md) | iOS/Android differences |
| **iOS 26** | [ios-26-liquid-glass.md](./docs/best-practices/ios-26-liquid-glass.md) | Liquid Glass specifics |
| **Android 16** | [android-16-material-3-expressive.md](./docs/best-practices/android-16-material-3-expressive.md) | M3 Expressive specifics |
| **TypeScript** | [typescript-patterns.md](./docs/best-practices/typescript-patterns.md) | Type patterns |
| **Project Structure** | [project-structure.md](./docs/best-practices/project-structure.md) | File organization |
| **Expo SDK** | [expo-sdk-54.md](./docs/best-practices/expo-sdk-54.md) | Expo configuration |
| **New Architecture** | [react-native-new-architecture.md](./docs/best-practices/react-native-new-architecture.md) | Fabric, TurboModules |

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Expo | 54.0.33 |
| Runtime | React Native | 0.81.5 |
| React | React | 19.1.0 |
| TypeScript | TypeScript | 5.9.2 |
| Styling | NativeWind | 4.2.1 |
| Navigation | Expo Router | 6.0.23 |
| Animation | Reanimated | 4.2.1 |
| iOS Design | Liquid Glass | expo-liquid-glass-native 1.3.0 |
| Android Design | Material 3 Expressive | expo-liquid-glass-native 1.3.0 |

**Targets:** iOS 26+ · Android 16+ · Web (ES2022+)

**Architecture:** React Native New Architecture (Fabric, TurboModules, Bridgeless, Hermes)

---

## Commands

```bash
pnpm install          # Install dependencies
pnpm start            # Start Expo dev server
pnpm ios              # Run on iOS simulator
pnpm android          # Run on Android emulator
pnpm web              # Run in browser
pnpm lint             # Run ESLint
pnpm typecheck        # Run TypeScript compiler
```

---

## Philosophy

**Native first.** iOS users get iOS 26 Liquid Glass. Android users get Material 3 Expressive. We build native apps that share business logic, not "cross-platform" compromises.

**No shortcuts.** If a component needs three platform implementations to feel native, we write three implementations.

**Single source of truth.** Every color, spacing value, and text style flows from centralized constants. Global changes are instant.

---

## For AI Agents

1. **Before ANY change:** Read this README and the [Best Practices Index](./docs/best-practices/INDEX.md)
2. **On every change:** Validate against `.cursor/skills/mobile-native-standards/SKILL.md`
3. **Creating components:** Follow the template in [component-architecture.md](./docs/best-practices/component-architecture.md)
4. **When in doubt:** Use `useTheme()` for colors, existing components from `@/components/ui`, and Reanimated 4 for animations

The ESLint configuration enforces these rules. Violations will fail CI.
