# Mobile Native Template

**Stack:** Expo SDK 54 · React Native 0.81 · iOS 26 · Android 16 · TypeScript Strict

## Quick Reference

| Need to... | See |
|------------|-----|
| Style a component | [Theming](./centralized-theming.md) |
| Build a component | [Components](./component-architecture.md) |
| Add a screen/route | [Navigation](./expo-router-navigation.md) |
| Handle forms | [Forms](./form-handling.md) |
| Add animations | [Animations](./reanimated-4-animations.md) |
| Use icons | [Icons](./icons-and-graphics.md) |
| Platform-specific code | [Platform Code](./platform-specific-code.md) |
| Understand layouts | [Layouts](./layout-system.md) |

## Golden Rules

1. **Zero hardcoded colors** — Use `className="bg-primary"` or `colors.primary.DEFAULT` from `useTheme()`
2. **Use provided components** — Import from `@/components/ui`, don't create your own
3. **Spring animations + haptics** — Use `useAnimatedPress()` hook for interactive elements
4. **Platform files** — Use `.ios.tsx` / `.android.tsx` for platform-specific implementations

## Component Import

```tsx
import {
  Button, Card, Input, Text, Avatar, Badge,
  ListItem, Select, SearchBar, Toast, Alert,
  Spinner, Skeleton, ProgressBar, EmptyState,
  Icon, Image, Pressable, ScrollContainer,
} from "@/components/ui";
```

## File Structure

```
app/                 # Routes (file-based)
├── (tabs)/          # Tab navigation group
├── (auth)/          # Auth flow group
└── _layout.tsx      # Root layout

components/
├── ui/              # Reusable UI components
├── glass/           # Glass effect components
└── layouts/         # Screen layouts

hooks/               # Custom hooks
constants/           # Theme, colors, spacing
lib/                 # Utilities
```
