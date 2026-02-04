# iOS 26 Liquid Glass Design System

> The definitive guide for implementing Apple's Liquid Glass design paradigm in React Native/Expo applications.

## Overview

Liquid Glass is Apple's revolutionary design language introduced at WWDC 2025—the most significant visual update since iOS 7 in 2013. It is not a recreation of physical glass but a **digital meta-material** that dynamically bends and shapes light, behaving organically like a lightweight liquid that responds to touch and app dynamics.

## Core Visual Properties

### Mandatory Characteristics

1. **Translucency**: All Liquid Glass elements MUST allow light and color to filter through. Opaque glass elements violate the design system.

2. **Lensing Effect**: The primary visual characteristic—transparent objects warp and bend light to communicate presence and motion. This is non-negotiable.

3. **Reflective Dynamics**: Light MUST subtly reflect off glass surfaces using real-time rendering that dynamically reacts to device movement.

4. **Rounded Forms**: All Liquid Glass elements use rounded, floating forms that relate to the natural geometry of fingers for touch interaction.

## Implementation in Expo

### expo-glass-effect Package

```typescript
import { GlassView, GlassContainer, isLiquidGlassAvailable } from 'expo-glass-effect';
```

### GlassView Component

The primary component for iOS Liquid Glass effects. It wraps `UIVisualEffectView` natively.

```tsx
<GlassView
  style={styles.glassElement}
  glassEffectStyle="regular"  // "regular" | "clear"
  tintColor="#1E3A5F"
  isInteractive={true}
/>
```

### GlassContainer for Grouped Elements

When multiple glass elements need to blend together:

```tsx
<GlassContainer spacing={10}>
  <GlassView style={styles.glass1} isInteractive />
  <GlassView style={styles.glass2} />
  <GlassView style={styles.glass3} />
</GlassContainer>
```

### Availability Checks

ALWAYS check availability before rendering:

```typescript
import { isLiquidGlassAvailable, isGlassEffectAPIAvailable } from 'expo-glass-effect';

// Check system/compiler support
if (isLiquidGlassAvailable()) {
  // Render Liquid Glass UI
}

// Check runtime API availability (critical for iOS 26 beta compatibility)
if (isGlassEffectAPIAvailable()) {
  // Safe to use GlassView
}
```

## Critical Constraints

### DO NOT:

1. **Use opacity < 1** on `GlassView` or parent views. This causes rendering artifacts per Apple's `UIVisualEffectView` documentation.

2. **Dynamically change `isInteractive`** after mount. Remount the component with a new `key` instead.

3. **Nest glass effects** without `GlassContainer`. Uncontained glass elements do not blend correctly.

4. **Skip fallbacks** for iOS < 26. Always provide graceful degradation.

### ALWAYS:

1. **Use `useSafeAreaInsets`** with glass navigation elements for proper edge handling.

2. **Test with `reduceTransparency`** accessibility setting enabled via `AccessibilityInfo.isReduceTransparencyEnabled()`.

3. **Provide platform-specific implementations** using `.ios.tsx` files.

## iOS 26 Native Tab Bar

For native Liquid Glass tab bars, use expo-router's native tabs:

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="home" role="search">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

### iOS 26 Tab Features

- **Separate search tab**: Use `role="search"` for elevated search tabs
- **Minimize behavior**: `minimizeBehavior="onScrollDown"` for collapsing tabs
- **Bottom accessory**: `NativeTabs.BottomAccessory` for persistent controls (mini-players, etc.)

## Design System Integration

### Color Handling with DynamicColorIOS

Liquid Glass automatically adapts to background luminance. Use `DynamicColorIOS` for tint colors:

```typescript
import { DynamicColorIOS } from 'react-native';

const dynamicTint = DynamicColorIOS({
  dark: 'white',
  light: 'black',
});
```

### App Icons

iOS 26 introduces layered Liquid Glass app icons with depth. Create using Apple's Icon Composer and reference in `app.config.ts`:

```typescript
ios: {
  icon: './assets/ios26-icon.png',  // Created with Icon Composer
}
```

## Fallback Strategy

For iOS < 26, provide CSS `backdrop-filter` equivalents:

```tsx
// GlassContainer.tsx (web/fallback)
<View style={[
  styles.fallbackGlass,
  {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
  }
]} />
```

## Resources

- [Meet Liquid Glass - WWDC 2025](https://developer.apple.com/videos/play/wwdc2025/219/)
- [Build a UIKit app with the new design](https://developer.apple.com/videos/play/wwdc2025/284/)
- [Expo Glass Effect Documentation](https://docs.expo.dev/versions/latest/sdk/glass-effect/)
- [Apple Human Interface Guidelines - Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [New Design Gallery](https://developer.apple.com/design/new-design-gallery/)
