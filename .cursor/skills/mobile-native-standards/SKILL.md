---
name: mobile-native-standards
description: Enforces mobile native template principles including no hardcoded colors, proper safe area handling, platform-specific implementations, centralized theming, and TypeScript strict mode. Use when creating components, reviewing code, editing files, or when violations of template standards might occur.
---

# Mobile Native Standards Enforcer

This skill ensures all code adheres to the mobile native template's core principles. Apply these checks proactively when creating or modifying components, screens, or any UI code.

## Before Making Changes

Run this validation checklist mentally or explicitly:

```
Standards Validation:
- [ ] No hardcoded colors (hex codes or Tailwind color classes)
- [ ] Using theme system via useTheme() hook
- [ ] Safe areas handled with useSafeAreaInsets() or layout components
- [ ] Platform-specific code uses correct patterns
- [ ] TypeScript strict mode compliant (no 'any' types)
- [ ] Animations use Reanimated 4
- [ ] Component is production-grade (if creating new component)
```

## Core Principle Enforcement

### 1. Zero Hardcoded Colors

**Rule**: Every color must come from the theme system.

**Check for violations**:
- Hex codes: `#000000`, `#FFFFFF`, `#FF5733`, etc.
- RGB/RGBA values: `rgb(0,0,0)`, `rgba(255,255,255,0.5)`
- Tailwind color classes: `bg-black`, `text-blue-500`, `border-red-600`
- Named colors: `backgroundColor: 'red'`, `color: 'white'`

**Correct pattern**:
```typescript
import { useTheme } from '@/hooks';

const { colors } = useTheme();

// For View/TouchableOpacity/Pressable
<View style={{ backgroundColor: colors.background.primary }} />

// For Text
<Text style={{ color: colors.text.primary }} />

// For borders
<View style={{ borderColor: colors.border.default }} />
```

**Available theme colors** (check `constants/colors.ts` for complete list):
- `colors.background.*` - primary, secondary, tertiary, elevated
- `colors.text.*` - primary, secondary, tertiary, inverse
- `colors.border.*` - default, subtle, emphasis
- `colors.surface.*` - primary, secondary, overlay
- `colors.accent.*` - primary, secondary, success, warning, error, info

**If you see a violation**: Stop and refactor to use theme colors before proceeding.

### 2. Safe Area Handling

**Rule**: Never use deprecated `SafeAreaView` from `react-native`.

**Check for violations**:
```typescript
// ❌ WRONG - deprecated
import { SafeAreaView } from 'react-native';
```

**Correct patterns**:

**Option A**: Use the hook (preferred for animations)
```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();

<View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
  {/* content */}
</View>
```

**Option B**: Use layout components
```typescript
import { ScreenLayout } from '@/components/layouts';

<ScreenLayout>
  {/* content - safe areas handled automatically */}
</ScreenLayout>
```

### 3. Platform-Specific Code

**Rule**: Use correct patterns for platform differences.

**For full component differences**, use file extensions:
```
Component.ios.tsx      // iOS 26 Liquid Glass implementation
Component.android.tsx  // Android 16 Material 3 implementation  
Component.web.tsx      // Web fallback
Component.tsx          // Base/shared logic or type exports
```

**For minor differences**, use Platform module:
```typescript
import { Platform } from 'react-native';

const hitSlop = Platform.select({
  ios: { top: 10, bottom: 10, left: 10, right: 10 },
  android: 20,
  default: 10
});

// Or conditional logic
if (Platform.OS === 'ios') {
  // iOS-specific code
} else if (Platform.OS === 'android') {
  // Android-specific code
}
```

### 4. Animation Standards

**Rule**: All animations must use Reanimated 4.

**Check for violations**:
- Using `Animated` from `react-native` (deprecated)
- Using `LayoutAnimation` (unreliable)
- CSS transitions on web that don't work on native

**Correct pattern**:
```typescript
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInRight,
  useAnimatedStyle,
  withTiming 
} from 'react-native-reanimated';

// Entering/exiting animations
<Animated.View entering={FadeIn} exiting={FadeOut}>
  {/* content */}
</Animated.View>

// Custom animations
const animatedStyle = useAnimatedStyle(() => ({
  opacity: withTiming(isVisible ? 1 : 0)
}));
```

### 5. TypeScript Strict Mode

**Rule**: No `any` types. Use proper generics and type inference.

**Check for violations**:
```typescript
// ❌ WRONG
const data: any = fetchData();
function process(item: any) { }
```

**Correct patterns**:
```typescript
// ✅ Use proper types
interface User {
  id: string;
  name: string;
}

const data: User[] = fetchData();

// ✅ Use generics
function process<T>(item: T): T {
  return item;
}

// ✅ Use unknown for truly unknown types, then narrow
const data: unknown = fetchData();
if (typeof data === 'object' && data !== null) {
  // Now you can safely access properties
}
```

## Production-Grade Component Standards

When creating a new component in `components/ui/`, it must meet ALL criteria:

### Component Checklist

```
Production Component Requirements:
- [ ] Fully typed with TypeScript strict mode
- [ ] Props interface exported and documented with JSDoc
- [ ] Supports light/dark mode via useTheme()
- [ ] Has variants (size, color, state) as needed
- [ ] Works on iOS, Android, and web
- [ ] Uses Reanimated 4 for animations
- [ ] Handles accessibility (accessibilityLabel, accessibilityRole)
- [ ] No hardcoded colors or spacing
- [ ] Uses centralized spacing from constants/spacing.ts
- [ ] Exported from components/ui/index.ts
```

### Component Template

Use this structure for new components:

```typescript
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@/hooks';
import { spacing } from '@/constants';

/**
 * [Component description]
 * 
 * @example
 * ```tsx
 * <YourComponent variant="primary" size="medium">
 *   Content
 * </YourComponent>
 * ```
 */

interface YourComponentProps {
  /** Component children */
  children?: React.ReactNode;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Optional callback */
  onPress?: () => void;
}

export function YourComponent({
  children,
  variant = 'primary',
  size = 'medium',
  onPress,
}: YourComponentProps) {
  const { colors } = useTheme();
  
  // Calculate styles based on props
  const backgroundColor = variant === 'primary' 
    ? colors.accent.primary 
    : colors.background.secondary;
    
  const paddingSize = size === 'small' 
    ? spacing.sm 
    : size === 'large' 
    ? spacing.lg 
    : spacing.md;
  
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor,
        padding: paddingSize,
        borderRadius: spacing.xs,
      }}
      accessibilityRole="button"
    >
      <Text style={{ color: colors.text.primary }}>
        {children}
      </Text>
    </Pressable>
  );
}
```

## Common Violations and Fixes

### Violation: Hardcoded Black Background

```typescript
// ❌ WRONG
<View style={{ backgroundColor: '#000000' }} />
<View className="bg-black" />

// ✅ CORRECT
const { colors } = useTheme();
<View style={{ backgroundColor: colors.background.primary }} />
```

### Violation: Using SafeAreaView from React Native

```typescript
// ❌ WRONG
import { SafeAreaView } from 'react-native';

<SafeAreaView>
  <View>Content</View>
</SafeAreaView>

// ✅ CORRECT
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();

<View style={{ paddingTop: insets.top }}>
  <View>Content</View>
</View>
```

### Violation: Any Type Usage

```typescript
// ❌ WRONG
function handleData(data: any) {
  console.log(data.name);
}

// ✅ CORRECT
interface Data {
  name: string;
}

function handleData(data: Data) {
  console.log(data.name);
}
```

### Violation: Magic Numbers for Spacing

```typescript
// ❌ WRONG
<View style={{ padding: 16, margin: 8 }} />

// ✅ CORRECT
import { spacing } from '@/constants';

<View style={{ padding: spacing.md, margin: spacing.sm }} />
```

### Violation: Using Animated from react-native

```typescript
// ❌ WRONG
import { Animated } from 'react-native';

const fadeAnim = new Animated.Value(0);

// ✅ CORRECT
import Animated, { FadeIn } from 'react-native-reanimated';

<Animated.View entering={FadeIn}>
  {/* content */}
</Animated.View>
```

## Enforcement Workflow

When creating or modifying code:

1. **Before writing**: Review relevant standards above
2. **While writing**: Use theme system, proper imports, and types
3. **After writing**: Run the validation checklist
4. **If violations found**: Fix immediately before proceeding

## Quick Reference

**Colors**: `const { colors } = useTheme();`  
**Safe Areas**: `const insets = useSafeAreaInsets();`  
**Spacing**: `import { spacing } from '@/constants';`  
**Platform**: `import { Platform } from 'react-native';`  
**Animation**: `import Animated, { FadeIn } from 'react-native-reanimated';`

## Philosophy Reminder

This template prioritizes:
- **Native first**: iOS 26 Liquid Glass + Android 16 Material 3 Expressive
- **No shortcuts**: Three platform implementations if needed
- **Design system discipline**: Single source of truth for all styles

Enforce these principles in every change.
