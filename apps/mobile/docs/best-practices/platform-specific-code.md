# Platform-Specific Code

## File Extensions

Metro resolves in order:
1. `.ios.tsx` / `.android.tsx` / `.web.tsx`
2. `.native.tsx` (iOS + Android)
3. `.tsx` (all platforms)

## When to Use

| Approach | When |
|----------|------|
| `.ios.tsx` + `.android.tsx` | Significantly different implementations |
| `.native.tsx` + `.tsx` | Native vs web split |
| `Platform.select()` | Small inline differences |
| `Platform.OS` | Conditional logic |

## Platform Files

```
hooks/
├── useHaptics.ts          # Web (no-op)
└── useHaptics.native.ts   # iOS + Android (expo-haptics)

components/glass/
├── GlassContainer.tsx     # Default/web fallback
├── GlassContainer.ios.tsx # iOS Liquid Glass
└── GlassContainer.android.tsx  # Android M3
```

### Shared Types

```tsx
// types.ts
export interface GlassContainerProps {
  intensity?: "light" | "medium" | "heavy";
  children: React.ReactNode;
}
```

### iOS Implementation

```tsx
// GlassContainer.ios.tsx
import { GlassView } from "expo-glass-effect";
import type { GlassContainerProps } from "./types";

export function GlassContainer({ intensity, children }: GlassContainerProps) {
  return <GlassView glassEffectStyle="regular">{children}</GlassView>;
}
```

### Android Implementation

```tsx
// GlassContainer.android.tsx
import { View } from "react-native";
import type { GlassContainerProps } from "./types";

export function GlassContainer({ children }: GlassContainerProps) {
  return <View className="bg-surface/80 rounded-xl">{children}</View>;
}
```

## Inline Platform Checks

```tsx
import { Platform } from "react-native";

// Conditional value
const padding = Platform.select({ ios: 20, android: 16, default: 16 });

// Conditional render
{Platform.OS === "ios" && <IOSOnlyComponent />}

// Version check
if (Platform.OS === "ios" && Platform.Version >= 26) {
  // iOS 26+ only
}
```

## Platform Constants

```tsx
import { platformVersion, isIOS, isAndroid, isWeb, supportsLiquidGlass } from "@/lib/platform";

if (supportsLiquidGlass) {
  // iOS 26+ Liquid Glass
}
```

## Don't

- Put platform logic in shared components — use platform files
- Create platform files for tiny differences — use `Platform.select()`
- Forget the shared types file — keeps implementations in sync
