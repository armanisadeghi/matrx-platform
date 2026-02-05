# Project Structure

## Directory Layout

```
mobile-native/
├── app/                    # Expo Router routes
│   ├── _layout.tsx        # Root layout (providers)
│   ├── (tabs)/            # Tab navigator group
│   └── (auth)/            # Auth flow (no tabs)
├── components/
│   ├── glass/             # Platform-specific glass
│   ├── layouts/           # Layout components
│   └── ui/                # Core UI primitives
├── constants/             # Design tokens
├── hooks/                 # Custom hooks
├── lib/                   # Utilities
└── assets/                # Static assets
```

## Barrel Exports

```typescript
// components/ui/index.ts
export { Button, type ButtonProps } from "./Button";
export { Card, CardHeader, CardContent } from "./Card";
export { Text, type TextProps } from "./Text";
```

```typescript
// Usage - ALWAYS import from barrels
import { Button, Card, Text } from "@/components";

// NEVER import from internal paths
import { Button } from "@/components/ui/Button"; // Wrong
```

## Route Groups

| Directory | Purpose | URL Impact |
|-----------|---------|------------|
| `(tabs)/` | Tab navigation | None |
| `(auth)/` | Auth flow (no tabs) | None |
| `(demo)/` | Dev screens (deletable) | None |

Groups organize navigation without affecting URLs.

## Platform Files

```
components/glass/
├── GlassContainer.tsx       # Default/fallback
├── GlassContainer.ios.tsx   # iOS Liquid Glass
├── GlassContainer.android.tsx
└── index.ts
```

Metro auto-resolves `.ios.tsx` / `.android.tsx` extensions.

## Import Order

```typescript
// 1. React/React Native
import { useState } from "react";
import { View, Pressable } from "react-native";

// 2. External packages
import { useRouter } from "expo-router";

// 3. Internal (@/)
import { Button, Card } from "@/components";
import { useTheme } from "@/hooks";

// 4. Types (last)
import type { ButtonProps } from "@/components";
```

## Asset Resolution

```typescript
// React Native auto-picks @2x/@3x based on device
<Image source={require("@/assets/images/logo.png")} />
```

## Constraints

| Rule | Reason |
|------|--------|
| Always use barrel exports | Clean import surface |
| Always use `@/` aliases | No relative path hell |
| Never import internal paths | Use barrels |
| Group platform files together | Metro resolves them |
