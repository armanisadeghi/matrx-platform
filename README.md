# Mobile Native Template

> **Bleeding-edge native mobile template for iOS 26+, Android 16+, and web. Zero compromises. Production-ready.**

---

## What This Is

This is **the** starting point for all Matrx native applications. It's a fully-configured Expo 54 template with:

- **Latest stable versions** of every dependency — no deprecated APIs
- **Truly native** iOS 26 Liquid Glass and Android 16 Material 3 Expressive implementations
- **Centralized theming** with zero hardcoded colors — single source of truth for all styles
- **Cross-platform** web, iOS, and Android from a single codebase
- **Production-grade** component library ready to use

This template eliminates setup time and ensures every new app starts with modern, native-feeling UI components that look and behave exactly as platform users expect.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Expo | 54.0.33 |
| **Runtime** | React Native | 0.81.5 |
| **React** | React | 19.1.0 |
| **TypeScript** | TypeScript | 5.9.2 |
| **Styling** | NativeWind (Tailwind) | 4.2.1 |
| **Navigation** | Expo Router | 6.0.23 |
| **Animation** | Reanimated | 4.2.1 |
| **iOS Design** | Liquid Glass (expo-liquid-glass-native) | 1.3.0 |
| **Android Design** | Material 3 Expressive (expo-liquid-glass-native) | 1.3.0 |
| **Glass Effects** | expo-glass-effect | 0.1.8 |

### Target Platforms

- **iOS:** 26+
- **Android:** 16+
- **Web:** Modern browsers (ES2022+)

### Architecture

- **React Native New Architecture** — Fabric, TurboModules, Bridgeless (mandatory in SDK 55)
- **Hermes Engine** — Optimized JavaScript runtime
- **Edge-to-Edge UI** — Full screen layouts with safe area handling

---

## Core Principles

### 1. Bleeding Edge, Stable Only

Every package is the **latest stable release**. No beta/alpha dependencies in production (except explicitly noted like native tabs). If a newer stable version exists, we upgrade immediately.

### 2. Fully Native

- iOS components use **iOS 26 Liquid Glass** design patterns
- Android components use **Android 16 Material 3 Expressive** design patterns
- Custom components have **separate iOS/Android/Web implementations** when necessary
- No "good enough" cross-platform compromises

### 3. Single Source of Truth

- **Zero hardcoded colors** — all colors come from `constants/colors.ts`
- **One theme system** — light/dark mode detected once in `useAppColorScheme()`
- **Centralized spacing** — all margins/padding from `constants/spacing.ts`
- **Typography system** — all text styles from `constants/typography.ts`
- **Layout templates** — reusable screen layouts in `components/layouts/`

### 4. Production-Grade Components

Every component in `components/ui/` is:
- Fully typed with TypeScript strict mode
- Supports light/dark mode automatically
- Has variants (sizes, colors, states)
- Works on iOS, Android, and web
- Documented with JSDoc comments
- Accessible by default
- Add components as core reusable components, as needed.

## Key Rules

### Colors

```typescript
// ❌ NEVER
<View style={{ backgroundColor: '#000000' }} />
<View className="bg-black" />

// ✅ ALWAYS
import { useTheme } from '@/hooks';
const { colors } = useTheme();
<View style={{ backgroundColor: colors.background.primary }} />
```

All colors must reference the theme system. We enforce this with a custom ESLint rule.

### Safe Areas

```typescript
// ❌ NEVER (deprecated, will be removed)
import { SafeAreaView } from 'react-native';

// ✅ ALWAYS
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const insets = useSafeAreaInsets();
```

Or use the provided layout components that handle safe areas automatically.

### Platform-Specific Code

```typescript
// Use file extensions for full component differences
GlassContainer.ios.tsx       // iOS 26 implementation
GlassContainer.android.tsx   // Android 16 implementation
GlassContainer.web.tsx       // Web fallback

// Or Platform module for small differences
import { Platform } from 'react-native';
if (Platform.OS === 'ios') { /* iOS-specific */ }
```

### Animations

```typescript
// ✅ Use Reanimated 4 for everything
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

<Animated.View entering={FadeIn} exiting={FadeOut}>
  {/* content */}
</Animated.View>
```

### TypeScript

- Strict mode enabled — no `any` types
- All components fully typed with proper generics
- No runtime type checking — TypeScript does it at compile time

## Philosophy

**Native first.** Users on iOS expect iOS 26 Liquid Glass. Users on Android expect Material 3 Expressive. We don't build "React Native" apps — we build **iOS apps** and **Android apps** that happen to share business logic.

**No shortcuts.** If a component needs three platform-specific implementations to feel native, we write three implementations.

**Design system discipline.** Every color, spacing value, and text style flows from a single source. This makes global changes instant and eliminates inconsistency.

This template embodies those principles so you don't have to think about them.