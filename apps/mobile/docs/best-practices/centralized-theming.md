# Theming & Styling

## Rule: Zero Hardcoded Colors

ESLint will block any hardcoded color. Use the theme system.

## Two Ways to Apply Colors

### 1. NativeWind Classes (Preferred)
```tsx
<View className="bg-primary">
  <Text className="text-foreground">Content</Text>
</View>

// Dark mode: automatic with dark: prefix
<View className="bg-surface dark:bg-surface-elevated" />
```

### 2. useTheme() Hook (When Needed)
```tsx
const { colors, isDark } = useTheme();

<View style={{ backgroundColor: colors.primary.DEFAULT }}>
  <Ionicons color={colors.foreground.DEFAULT} />
</View>
```

## Available Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `primary` | Deep blue | Bright blue | Actions, links |
| `secondary` | Slate | Light slate | Secondary actions |
| `background` | White | Near black | Screen backgrounds |
| `surface` | White | Dark gray | Cards, modals |
| `foreground` | Near black | Near white | Text |
| `border` | Light gray | Dark gray | Dividers |
| `success/warning/error/info` | Semantic | Semantic | Status |

### MD3 Container Variants
```tsx
// For proper contrast on colored backgrounds
className="bg-primary text-primary-on"
className="bg-primary-container text-primary-on-container"
```

## cn() Utility

Merge conditional classes:
```tsx
import { cn } from "@/lib/utils";

<View className={cn(
  "p-4 rounded-xl",
  variant === "primary" && "bg-primary",
  disabled && "opacity-50"
)} />
```

## Source Files

| File | Purpose |
|------|---------|
| `global.css` | CSS variables (source of truth) |
| `tailwind.config.js` | Maps CSS vars to Tailwind |
| `constants/colors.ts` | TypeScript mirror for useTheme() |
| `hooks/useTheme.ts` | Runtime theme access |

## Don't

```tsx
// ❌ Hardcoded color - ESLint error
style={{ color: '#1E3A5F' }}

// ❌ Hardcoded in className
className="text-[#1E3A5F]"

// ❌ Creating StyleSheet with colors
const styles = StyleSheet.create({
  text: { color: '#000' }  // ESLint error
});
```

## Do

```tsx
// ✅ NativeWind class
className="text-primary"

// ✅ Theme hook
const { colors } = useTheme();
style={{ color: colors.primary.DEFAULT }}
```
