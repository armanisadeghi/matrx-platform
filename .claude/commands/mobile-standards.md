# Mobile Native Standards Enforcer

Validate and enforce mobile native template standards for the code at `$ARGUMENTS`.

Run this validation checklist against the target code:

```
Standards Validation:
- [ ] No hardcoded colors (hex codes or Tailwind color classes)
- [ ] Using theme system via useTheme() hook
- [ ] Safe areas handled with useSafeAreaInsets() or layout components
- [ ] Platform-specific code uses correct patterns
- [ ] TypeScript strict mode compliant (no 'any' types)
- [ ] Animations use Reanimated 4
- [ ] Component is production-grade (if new component)
```

---

## 1. Zero Hardcoded Colors

Every color must come from the theme system.

**Violations to find:**
- Hex codes: `#000000`, `#FFFFFF`, `#FF5733`
- RGB/RGBA: `rgb(0,0,0)`, `rgba(255,255,255,0.5)`
- Tailwind colors: `bg-black`, `text-blue-500`
- Named colors: `backgroundColor: 'red'`, `color: 'white'`

**Correct pattern:**
```typescript
import { useTheme } from '@/hooks';
const { colors } = useTheme();

<View style={{ backgroundColor: colors.background.primary }} />
<Text style={{ color: colors.text.primary }} />
<View style={{ borderColor: colors.border.default }} />
```

**Theme tokens** (see `constants/colors.ts`):
- `colors.background.*` — primary, secondary, tertiary, elevated
- `colors.text.*` — primary, secondary, tertiary, inverse
- `colors.border.*` — default, subtle, emphasis
- `colors.surface.*` — primary, secondary, overlay
- `colors.accent.*` — primary, secondary, success, warning, error, info

---

## 2. Safe Area Handling

Never use deprecated `SafeAreaView` from `react-native`.

```typescript
// ❌ WRONG
import { SafeAreaView } from 'react-native';

// ✅ Option A: Hook (preferred for animations)
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const insets = useSafeAreaInsets();
<View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>

// ✅ Option B: Layout component
import { ScreenLayout } from '@/components/layouts';
<ScreenLayout>{/* safe areas handled */}</ScreenLayout>
```

---

## 3. Platform-Specific Code

**Full component differences** — use file extensions:
```
Component.ios.tsx      // iOS 26 Liquid Glass
Component.android.tsx  // Android 16 Material 3
Component.web.tsx      // Web fallback
Component.tsx          // Base/shared logic
```

**Minor differences** — use Platform module:
```typescript
import { Platform } from 'react-native';

const hitSlop = Platform.select({
  ios: { top: 10, bottom: 10, left: 10, right: 10 },
  android: 20,
  default: 10
});
```

---

## 4. Animation Standards

All animations must use Reanimated 4.

**Violations:**
- `Animated` from `react-native` (deprecated)
- `LayoutAnimation` (unreliable)
- CSS transitions that don't work on native

**Correct:**
```typescript
import Animated, { 
  FadeIn, FadeOut, useAnimatedStyle, withTiming 
} from 'react-native-reanimated';

<Animated.View entering={FadeIn} exiting={FadeOut}>
  {/* content */}
</Animated.View>

const animatedStyle = useAnimatedStyle(() => ({
  opacity: withTiming(isVisible ? 1 : 0)
}));
```

---

## 5. TypeScript Strict Mode

No `any` types. Use proper generics and type inference.

```typescript
// ❌ WRONG
const data: any = fetchData();
function process(item: any) { }

// ✅ Use proper types
interface User { id: string; name: string; }
const data: User[] = fetchData();

// ✅ Use generics
function process<T>(item: T): T { return item; }

// ✅ Use unknown + narrow
const data: unknown = fetchData();
if (typeof data === 'object' && data !== null) { }
```

---

## 6. Spacing

No magic numbers. Use centralized spacing:

```typescript
// ❌ WRONG
<View style={{ padding: 16, margin: 8 }} />

// ✅ CORRECT
import { spacing } from '@/constants';
<View style={{ padding: spacing.md, margin: spacing.sm }} />
```

---

## Production Component Checklist

New components in `components/ui/` must meet ALL:

- [ ] Fully typed with TypeScript strict mode
- [ ] Props interface exported with JSDoc
- [ ] Supports light/dark via useTheme()
- [ ] Has variants (size, color, state) as needed
- [ ] Works on iOS, Android, and web
- [ ] Uses Reanimated 4 for animations
- [ ] Handles accessibility (accessibilityLabel, accessibilityRole)
- [ ] No hardcoded colors or spacing
- [ ] Uses centralized spacing from constants/spacing.ts
- [ ] Exported from components/ui/index.ts

---

## Quick Reference

```
Colors:    const { colors } = useTheme();
Safe Area: const insets = useSafeAreaInsets();
Spacing:   import { spacing } from '@/constants';
Platform:  import { Platform } from 'react-native';
Animation: import Animated, { FadeIn } from 'react-native-reanimated';
```

## Philosophy

- **Native first**: iOS 26 Liquid Glass + Android 16 Material 3 Expressive
- **No shortcuts**: Three platform implementations if needed
- **Design system discipline**: Single source of truth for all styles
