# iOS 26 Liquid Glass

## GlassContainer Component

```tsx
import { GlassContainer } from "@/components/glass";

<GlassContainer intensity="medium" borderRadius="lg">
  <Content />
</GlassContainer>
```

Automatically uses `expo-glass-effect` on iOS 26+, falls back to styled View on older versions.

## Properties

| Prop | Values | Default |
|------|--------|---------|
| `intensity` | `light`, `medium`, `heavy` | `medium` |
| `tint` | `surface`, `primary` | `surface` |
| `borderRadius` | `none`, `sm`, `md`, `lg`, `xl`, `full` | `lg` |
| `interactive` | `boolean` | `false` |

## Native Tabs

iOS 26 native tab bar with Liquid Glass:

```tsx
import { NativeTabs, Trigger, Icon, Label } from "expo-router/unstable-native-tabs";

<NativeTabs minimizeBehavior="onScrollDown">
  <Trigger name="home" asChild>
    <Icon sf={{ default: "house", selected: "house.fill" }} />
    <Label>Home</Label>
  </Trigger>
  <Trigger name="search" role="search" asChild>
    <Icon sf={{ default: "magnifyingglass" }} />
    <Label>Search</Label>
  </Trigger>
</NativeTabs>
```

### Tab Features

| Feature | Usage |
|---------|-------|
| SF Symbols | `sf={{ default: "house", selected: "house.fill" }}` |
| Search tab | `role="search"` (elevated position) |
| Minimize | `minimizeBehavior="onScrollDown"` |

## Accessibility

GlassContainer automatically checks `AccessibilityInfo.isReduceTransparencyEnabled()` and provides solid fallback when enabled.

## Constraints

- Don't set `opacity < 1` on GlassView or parents — causes rendering artifacts
- Don't dynamically change `interactive` — remount with new `key` instead
- Don't nest glass effects without GlassContainer grouping

## Fallback

On iOS < 26 or when Reduce Transparency is enabled:
```tsx
<View className="bg-surface/90 rounded-xl">
  {children}
</View>
```
