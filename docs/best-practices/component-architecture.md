# Component Architecture

## Use Existing Components

Import from `@/components/ui` — don't create your own versions.

```tsx
import { Button, Card, Input, Text, ListItem } from "@/components/ui";
```

## Creating New Components

### File Structure
```
components/ui/MyComponent.tsx           # Single file
components/ui/MyComponent/
  ├── MyComponent.tsx                   # Main component
  ├── MyComponent.ios.tsx               # iOS-specific (if needed)
  ├── MyComponent.android.tsx           # Android-specific (if needed)
  └── index.ts                          # Barrel export
```

### Component Template

```tsx
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useAnimatedPress } from "@/hooks/useAnimatedPress";
import { cn } from "@/lib/utils";

export interface MyComponentProps {
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function MyComponent({
  variant = "primary",
  disabled = false,
  className,
  children,
}: MyComponentProps) {
  const { animatedStyle, handlers } = useAnimatedPress({ disabled });

  return (
    <Animated.View
      className={cn(
        "p-4 rounded-xl",
        variant === "primary" && "bg-primary",
        variant === "secondary" && "bg-secondary",
        disabled && "opacity-50",
        className
      )}
      style={animatedStyle}
      {...handlers}
    >
      {children}
    </Animated.View>
  );
}
```

## Required Patterns

| Pattern | Implementation |
|---------|----------------|
| **Variants** | Use `cn()` with conditional classes |
| **Animation** | Use `useAnimatedPress()` for interactive elements |
| **Haptics** | Built into `useAnimatedPress()` |
| **className** | Always accept and spread with `cn()` |
| **Disabled** | Pass to `useAnimatedPress({ disabled })` |

## Compound Components

```tsx
// Card with sub-components
<Card>
  <CardHeader>
    <Text variant="h3">Title</Text>
  </CardHeader>
  <CardContent>
    <Text>Content</Text>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## Export Pattern

```tsx
// components/ui/index.ts
export { MyComponent, type MyComponentProps } from "./MyComponent";
```

## Don't

- Create custom Button, Card, Input, Text — use existing
- Use `StyleSheet.create` for colors — use NativeWind
- Skip `className` prop — always accept it
- Use raw `Pressable` — use `@/components/ui/Pressable` or `useAnimatedPress`
