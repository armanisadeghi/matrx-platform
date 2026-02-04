# Mobile Native Best Practices Index

> Production-grade best practices for Expo 54 + React Native 0.81 applications targeting iOS 26 and Android 16.

## Overview

This documentation covers the bleeding-edge mobile development stack for 2025-2026, including:

- **Expo SDK 54** with React Native 0.81
- **iOS 26** Liquid Glass design system
- **Android 16** Material 3 Expressive design system
- **NativeWind 4** for Tailwind CSS styling
- **New Architecture** (Fabric + TurboModules + Bridgeless)

---

## Design Systems

### [iOS 26 Liquid Glass](./ios-26-liquid-glass.md)
Apple's revolutionary translucent design language introduced at WWDC 2025. Covers:
- Core visual properties (translucency, lensing, reflective dynamics)
- `expo-glass-effect` implementation
- `GlassView` and `GlassContainer` usage
- Native tab bars with Liquid Glass
- Fallback strategies for older iOS versions

### [Android 16 Material 3 Expressive](./android-16-material-3-expressive.md)
Google's emotion-driven design system launched with Android 16. Covers:
- Five pillars (color, shape, size, motion, containment)
- React Native Paper integration
- `expo-liquid-glass-native` for glass effects
- Haptic feedback patterns
- Dynamic color theming

---

## Theming & Styling

### [Centralized Light/Dark Mode Theming](./centralized-theming.md)
**The single most important document.** Establishes the golden rule: ZERO hardcoded colors. Covers:
- Single source of truth architecture
- CSS variables with NativeWind
- `useTheme()` hook pattern
- Automatic system preference detection
- React Navigation integration

### [NativeWind 4 Styling](./nativewind-styling.md)
Tailwind CSS for React Native. Covers:
- Configuration (tailwind.config.js, global.css, metro.config.js)
- Component patterns with `className` prop
- Dark mode with `useColorScheme()`
- `vars()` for runtime theme switching
- Platform-specific styling

---

## Core Frameworks

### [Expo SDK 54](./expo-sdk-54.md)
Latest Expo features and configuration. Covers:
- `app.config.ts` best practices
- New Architecture (mandatory in SDK 55)
- Precompiled iOS XCFrameworks
- Edge-to-edge Android layouts
- Reanimated v4 compatibility notes

### [Expo Router Navigation](./expo-router-navigation.md)
File-based routing with native tabs. Covers:
- Project structure patterns
- Native tabs with Liquid Glass (iOS 26)
- Platform-specific layouts
- Safe area handling
- Common issues and fixes

### [React Native New Architecture](./react-native-new-architecture.md)
Mandatory architecture for SDK 55+. Covers:
- Fabric, TurboModules, Bridgeless, JSI
- Migration requirements
- Hermes engine
- Performance patterns
- Third-party library compatibility

---

## Animation & Interaction

### [Reanimated 4 Animations](./reanimated-4-animations.md)
CSS-style animations with 60+ FPS performance. Covers:
- CSS transitions and keyframes (new in v4)
- Worklet-based animations for gestures
- Enter/exit animations
- Layout animations
- NativeWind integration notes

### [Safe Area Handling](./safe-area-handling.md)
Critical for edge-to-edge designs. Covers:
- `useSafeAreaInsets()` over `SafeAreaView`
- Native tabs automatic inset handling
- Android edge-to-edge patterns
- Keyboard handling integration

---

## Components & Patterns

### [React Native Paper](./react-native-paper.md)
Material Design 3 component library. Covers:
- Theme configuration (MD3 colors)
- React Navigation integration
- Component usage patterns (Buttons, Cards, Dialogs)
- Typography system

### [Platform-Specific Code](./platform-specific-code.md)
Writing truly native experiences. Covers:
- File extension resolution (.ios.tsx, .android.tsx, .web.tsx)
- Platform module API
- Tree shaking considerations
- Expo Router layout patterns

### [TypeScript Patterns](./typescript-patterns.md)
Type-safe React Native development. Covers:
- Strict tsconfig.json
- Component and hook patterns
- Generic components
- Discriminated unions
- Navigation types

---

## Quick Reference

| Topic | When to Use |
|-------|------------|
| iOS 26 Liquid Glass | Building iOS 26+ native UI |
| Android 16 M3E | Building Android 16+ native UI |
| Centralized Theming | **ALWAYS** - before writing any component |
| NativeWind | Styling any component |
| Expo SDK 54 | Project configuration |
| Expo Router | Navigation setup |
| New Architecture | Understanding runtime requirements |
| Reanimated 4 | Adding animations |
| Safe Areas | Any screen layout |
| Paper | Material Design components |
| Platform Code | Divergent platform behavior |
| TypeScript | **ALWAYS** - all code must be typed |

---

## Priority Reading Order

For developers new to this stack:

1. **[Centralized Theming](./centralized-theming.md)** - Foundation for everything
2. **[Expo SDK 54](./expo-sdk-54.md)** - Project configuration
3. **[NativeWind Styling](./nativewind-styling.md)** - How to style components
4. **[Safe Area Handling](./safe-area-handling.md)** - Layout fundamentals
5. **[Platform-Specific Code](./platform-specific-code.md)** - Native patterns
6. **[iOS 26 Liquid Glass](./ios-26-liquid-glass.md)** - iOS native design
7. **[Android 16 M3E](./android-16-material-3-expressive.md)** - Android native design
8. **[TypeScript Patterns](./typescript-patterns.md)** - Type safety

---

## External Resources

### Official Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design 3](https://m3.material.io/)

### WWDC & I/O Sessions
- [Meet Liquid Glass - WWDC 2025](https://developer.apple.com/videos/play/wwdc2025/219/)
- [Build a UIKit app with the new design](https://developer.apple.com/videos/play/wwdc2025/284/)

### Package Documentation
- [NativeWind](https://www.nativewind.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

---

## Version Information

| Dependency | Version | Notes |
|-----------|---------|-------|
| Expo SDK | 54 | Last legacy arch support |
| React Native | 0.81.5 | New Architecture default |
| TypeScript | 5.9 | Strict mode |
| NativeWind | 4.2.1 | Reanimated v3 required |
| Reanimated | 4.2.1 | CSS animations |
| expo-glass-effect | 0.1.8 | iOS 26+ only |
| expo-liquid-glass-native | 1.3.0 | Android glass effects |
| React Native Paper | 5.15.0 | MD3 default |

---

*Last updated: February 2026*
