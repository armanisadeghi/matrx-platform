# Android 16 Material 3 Expressive Design System

> The definitive guide for implementing Google's Material 3 Expressive design language in React Native/Expo applications.

## Overview

Material 3 Expressive (M3E) is Google's most significant design system update, launched with Android 16 in June 2025. It represents a fundamental shift toward **emotion-driven interfaces** backed by extensive research (46 studies, 18,000+ participants) while maintaining usability and accessibility standards.

## Core Design Principles

M3 Expressive emphasizes five pillars:

1. **Color** - Dynamic color theming with emotional resonance
2. **Shape** - Rounded rectangle containers with varied corner radii
3. **Size** - Emphasized typography and component scaling
4. **Motion** - Natural, springy animations with haptic feedback
5. **Containment** - Strategic use of blur and surface layering

## Implementation Stack

### Primary Packages

```bash
pnpm add react-native-paper expo-liquid-glass-native
```

### React Native Paper for M3

React Native Paper v5+ implements Material Design 3 by default:

```tsx
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <RootLayout />
    </PaperProvider>
  );
}
```

### expo-liquid-glass-native for Glass Effects

Android glass effects via Jetpack Compose:

```tsx
import { LiquidButton, BottomTabs } from 'expo-liquid-glass-native';

<LiquidButton
  tint="#1E3A5F"
  surfaceColor="rgba(255,255,255,0.1)"
  blurRadius={4}
  lensX={50}
  lensY={50}
  onPress={handlePress}
>
  <Text>Glass Button</Text>
</LiquidButton>
```

## Theme Configuration

### MD3 Color System

Material Design 3 uses a **role-based color system**. Define colors by their semantic purpose, not their visual appearance:

```typescript
const customTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Accent colors
    primary: '#1E3A5F',
    onPrimary: '#FFFFFF',
    primaryContainer: '#D4E4F7',
    onPrimaryContainer: '#001D36',
    
    secondary: '#525F70',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#D6E3F7',
    onSecondaryContainer: '#0F1D2A',
    
    tertiary: '#6A5778',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#F2DAFF',
    onTertiaryContainer: '#251431',
    
    // Surface colors
    surface: '#F8F9FA',
    onSurface: '#1A1C1E',
    surfaceVariant: '#DFE2EB',
    onSurfaceVariant: '#43474E',
    
    // Semantic colors
    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',
  },
};
```

### Dynamic Color Theming

M3 Expressive on Android 12+ supports dynamic colors extracted from wallpaper:

```typescript
import { useMaterial3Theme } from 'react-native-paper';

function App() {
  const { theme } = useMaterial3Theme();
  // theme contains system-extracted dynamic colors
}
```

## Animation Patterns

### Springy, Haptic Animations

M3 Expressive mandates natural motion. Use Reanimated 4 with spring physics:

```typescript
import { useAnimatedStyle, withSpring } from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: withSpring(pressed.value ? 0.95 : 1) }],
}));
```

### Haptic Feedback

Pair animations with haptics for M3E compliance:

```typescript
import * as Haptics from 'expo-haptics';

const handlePress = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  // Continue with action
};
```

## Key Interface Patterns

### Background Blur Effects

Apply blur to Quick Settings, Notifications, and Recents:

```tsx
import { BlurView } from 'expo-blur';

<BlurView intensity={80} tint="systemMaterial">
  <NotificationContent />
</BlurView>
```

### Edge-to-Edge Layout

Android 16 with Expo SDK 54 enables edge-to-edge by default:

```typescript
// app.config.ts
android: {
  edgeToEdgeEnabled: true,
}
```

Handle insets manually:

```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();
// Apply insets.top, insets.bottom to content
```

## Component Specifications

### Buttons

- Use `rounded-full` or large corner radii (12-16dp)
- Surface containers for secondary actions
- Glass effects for elevated primary actions

### Cards

- Elevated cards with subtle shadows
- Surface variant backgrounds
- 12-16dp corner radius

### Bottom Navigation

Maximum 5 tabs (Android platform limit). Use native tabs for M3 Expressive styling:

```tsx
<NativeTabs>
  <NativeTabs.Trigger name="home">
    <NativeTabs.Trigger.Icon md="home" sf="house.fill" />
    <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
  </NativeTabs.Trigger>
</NativeTabs>
```

## React Navigation Integration

Adapt Paper themes for React Navigation:

```typescript
import { adaptNavigationTheme } from 'react-native-paper';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

const { LightTheme, DarkTheme: NavDarkTheme } = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
  reactNavigationDark: DarkTheme,
});
```

## Critical Requirements

### DO:

1. **Use MD3 color roles** - Never use raw hex values in components
2. **Implement haptic feedback** - Essential for M3E motion system
3. **Apply blur strategically** - For depth and focus, not decoration
4. **Test dynamic colors** - On devices with wallpaper extraction

### DO NOT:

1. **Exceed 5 bottom tabs** - Android platform limitation
2. **Use sharp corners** - M3E mandates rounded forms
3. **Skip surface containers** - Components must have proper containment
4. **Ignore accessibility** - M3E research ensured WCAG compliance

## Resources

- [Material 3 Expressive Overview](https://m3.material.io/)
- [Material Design Blog - M3 Expressive](https://design.google/library/design-notes-material-3-expressive-liam-spradlin)
- [React Native Paper Documentation](https://callstack.github.io/react-native-paper/)
- [expo-liquid-glass-native](https://www.npmjs.com/package/expo-liquid-glass-native)
- [Android 16 Developer Preview](https://developer.android.com/about/versions/16)
