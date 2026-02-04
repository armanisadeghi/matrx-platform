# Platform-Specific Code Patterns

> Production patterns for writing platform-native code that maximizes code sharing while respecting platform conventions.

## Overview

React Native's Metro bundler automatically resolves platform-specific file extensions. This enables true platform-native implementations while sharing business logic.

## File Extension Resolution

Metro resolves files in this order:
1. `.ios.tsx` / `.android.tsx` / `.web.tsx` (platform-specific)
2. `.native.tsx` (iOS + Android, not web)
3. `.tsx` (fallback for all platforms)

## Directory Structure Pattern

### Component with Platform Variants

```
components/
  ui/
    Button/
      Button.tsx          # Shared types and logic
      Button.ios.tsx      # iOS Liquid Glass implementation
      Button.android.tsx  # Material 3 Expressive implementation
      Button.web.tsx      # Web fallback
      index.ts            # Re-export
    GlassContainer/
      GlassContainer.tsx      # Default (web fallback)
      GlassContainer.ios.tsx  # expo-glass-effect
      GlassContainer.android.tsx  # expo-liquid-glass-native
      index.ts
```

### index.ts Pattern

```typescript
// components/ui/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

Metro automatically selects the correct `Button` file based on platform.

## Implementation Patterns

### Shared Types File

`Button.tsx` defines shared interface:

```typescript
// components/ui/Button/Button.tsx
import { Pressable, Text } from 'react-native';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
}

// Default implementation (also serves as web fallback)
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled,
  onPress,
  className,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        'rounded-lg items-center justify-center',
        sizeStyles[size],
        variantStyles[variant],
        disabled && 'opacity-50',
        className,
      )}
    >
      <Text className={textStyles[variant]}>{children}</Text>
    </Pressable>
  );
}
```

### iOS Implementation

`Button.ios.tsx` with Liquid Glass:

```typescript
// components/ui/Button/Button.ios.tsx
import { Pressable, Text } from 'react-native';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { ButtonProps } from './Button';

export function Button({ 
  children, 
  variant = 'primary',
  size = 'md',
  disabled,
  onPress,
  className,
}: ButtonProps) {
  // Use Liquid Glass for primary buttons on iOS 26+
  if (variant === 'primary' && isLiquidGlassAvailable()) {
    return (
      <GlassView
        style={[styles.button, sizeStyles[size]]}
        glassEffectStyle="regular"
        isInteractive
      >
        <Pressable onPress={onPress} disabled={disabled} style={styles.pressable}>
          <Text style={styles.primaryText}>{children}</Text>
        </Pressable>
      </GlassView>
    );
  }
  
  // Fallback for secondary/ghost or older iOS
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      <Text className={textStyles[variant]}>{children}</Text>
    </Pressable>
  );
}
```

### Android Implementation

`Button.android.tsx` with Material 3:

```typescript
// components/ui/Button/Button.android.tsx
import { Pressable, Text } from 'react-native';
import { LiquidButton } from 'expo-liquid-glass-native';
import * as Haptics from 'expo-haptics';
import type { ButtonProps } from './Button';

export function Button({ 
  children, 
  variant = 'primary',
  size = 'md',
  disabled,
  onPress,
  className,
}: ButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };
  
  if (variant === 'primary') {
    return (
      <LiquidButton
        tint="#1E3A5F"
        blurRadius={4}
        onPress={handlePress}
        disabled={disabled}
      >
        <Text className="text-white font-semibold">{children}</Text>
      </LiquidButton>
    );
  }
  
  // Secondary/ghost variants
  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      <Text className={textStyles[variant]}>{children}</Text>
    </Pressable>
  );
}
```

## Platform Module API

For inline platform checks:

```typescript
import { Platform } from 'react-native';

// Direct check
if (Platform.OS === 'ios') {
  // iOS-specific code
}

// Platform select
const padding = Platform.select({
  ios: 12,
  android: 16,
  web: 20,
  default: 16,
});

// Version checking
if (Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 26) {
  // iOS 26+ specific code
}

if (Platform.OS === 'android' && Platform.Version >= 36) {
  // Android 16+ specific code
}
```

## When to Use Each Approach

### Use File Extensions When:

- UI differs significantly between platforms
- Using platform-specific native modules
- Performance optimization requires different implementations
- Platform design systems diverge (Liquid Glass vs Material 3)

### Use Platform Module When:

- Small conditional differences (padding, fonts)
- Feature detection
- Quick style adjustments
- Same component with minor variations

### Use .native.tsx When:

- Sharing code between iOS and Android but not web
- Native-only features (haptics, native modules)

```
Component.tsx      # Web implementation
Component.native.tsx  # iOS + Android shared implementation
```

## Tree Shaking

### Automatic Platform Shaking

Expo CLI removes unused platform code in production builds:

```typescript
// This code is removed from iOS builds
if (Platform.OS === 'android') {
  // Android-only logic
}
```

### Critical Requirement

Platform shaking only works when `Platform` is imported directly:

```typescript
// ✅ Works - direct import
import { Platform } from 'react-native';
Platform.OS === 'ios'

// ❌ Broken - re-exported Platform
import { Platform } from '@/lib/utils';  // Re-export breaks tree shaking
Platform.OS === 'ios'
```

## Expo Router Layout Files

### Platform-Specific Layouts

```
app/
  (tabs)/
    _layout.tsx      # Native tabs for iOS/Android
    _layout.web.tsx  # Custom web tabs
```

`_layout.tsx`:
```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      {/* Native tabs configuration */}
    </NativeTabs>
  );
}
```

`_layout.web.tsx`:
```tsx
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';

export default function WebTabLayout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList>{/* Web tabs */}</TabList>
    </Tabs>
  );
}
```

## Testing Platform Code

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // Platform-specific test files
  testMatch: [
    '**/__tests__/**/*.(ios|android|web).test.[jt]s?(x)',
    '**/__tests__/**/*.test.[jt]s?(x)',
  ],
};
```

### Platform Mocking

```typescript
// __mocks__/react-native.ts
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Platform: {
    OS: 'ios',  // or 'android' for Android tests
    select: jest.fn((obj) => obj.ios),
  },
}));
```

## Common Patterns

### Platform-Specific Hooks

```typescript
// hooks/useHaptics.ts
export { useHaptics } from './useHaptics';

// hooks/useHaptics.native.ts
import * as Haptics from 'expo-haptics';

export function useHaptics() {
  return {
    light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  };
}

// hooks/useHaptics.ts (web)
export function useHaptics() {
  return {
    light: () => {},  // No-op on web
    medium: () => {},
    heavy: () => {},
  };
}
```

### Icon Resolution

```tsx
// Using platform-specific icons
<NativeTabs.Trigger.Icon 
  sf="house.fill"     // SF Symbols (iOS)
  md="home"           // Material Icons (Android)
  src={require('./home.png')}  // Fallback image
/>
```

## Critical Rules

1. **Always provide fallback** - Base `.tsx` file must exist for universal deep linking
2. **Keep props interface shared** - Define types in base file, import in platform files
3. **Import Platform directly** - Never re-export to preserve tree shaking
4. **Test all platforms** - Platform-specific bugs are common and subtle
5. **Match functionality** - Platform UIs may differ, but behavior should be consistent

## Resources

- [React Native Platform-Specific Code](https://reactnative.dev/docs/platform-specific-code)
- [Expo Router Platform Extensions](https://docs.expo.dev/router/advanced/platform-specific-modules/)
- [Metro File Resolution](https://reactnative.dev/docs/metro)
- [Expo Tree Shaking](https://docs.expo.dev/guides/tree-shaking/)
