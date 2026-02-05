# React Native Paper - Architectural Decision

> **Status: NOT USED** - This document explains why react-native-paper was evaluated and removed.

## Decision Summary

**react-native-paper** was removed from this codebase. The custom component library (`components/ui/*`) with NativeWind theming provides better alignment with project goals.

## Why We Chose Custom Components Over Paper

### 1. Single Styling System
All components use NativeWind classes exclusively. Mixing NativeWind with Paper's style system would create two competing styling approaches, violating the "single source of truth" principle.

### 2. Platform-Specific Glass Effects
Custom `components/glass/GlassContainer.tsx` provides:
- iOS Liquid Glass effects (iOS 26+)
- Android Material 3 Expressive styling
- Web fallbacks

Paper doesn't offer these platform-native visual treatments.

### 3. Full Design Control
Custom components allow precise control over appearance, animations (Reanimated 4), and haptic feedback without fighting Paper's opinions or overriding its styles.

### 4. True Single Source of Truth
Colors are defined once in `global.css` CSS variables, mirrored to TypeScript in `constants/theme.ts`. No duplication with a separate Paper theme system.

### 5. Lighter Bundle
Not loading unused Paper component code keeps the bundle smaller.

### 6. Platform Adaptations
Custom components use platform extensions (`.ios.tsx`, `.android.tsx`, `.web.tsx`) for truly native behavior on each platform.

## What We Have Instead

| Paper Component | Our Equivalent | Location |
|-----------------|----------------|----------|
| Button | Button | `components/ui/Button.tsx` |
| TextInput | Input | `components/ui/Input.tsx` |
| Card | Card | `components/ui/Card.tsx` |
| Text | Text | `components/ui/Text.tsx` |
| List.Item | ListItem | `components/ui/ListItem.tsx` |
| Switch | Switch | `components/ui/Toggle.tsx` |
| Checkbox | Checkbox | `components/ui/Toggle.tsx` |
| Dialog | ModalLayout | `components/layouts/ModalLayout.tsx` |
| IconButton | IconButton | `components/ui/IconButton.tsx` |

## Typography Mapping

Our custom Text variants follow a semantic naming pattern:

| Our Variant | Use Case |
|-------------|----------|
| h1 | Page titles |
| h2 | Section headers |
| h3 | Subsection headers |
| body | Body text |
| label | Form labels |
| caption | Helper text |

## Theming Approach

Instead of Paper's MD3 theme:

```typescript
// We use CSS variables in global.css
:root {
  --color-primary: 30 58 95;
  --color-background: 255 255 255;
  // ...
}

// Accessed via NativeWind classes
<View className="bg-primary" />
<Text className="text-foreground" />

// Or via useTheme() hook
const { colors } = useTheme();
<View style={{ backgroundColor: colors.primary.DEFAULT }} />
```

## When Paper Might Make Sense

Consider Paper for projects that:
- Need strict Material Design 3 compliance for Android certification
- Have limited design resources and benefit from pre-built accessible components
- Don't require platform-specific glass/blur effects
- Use Paper's navigation integration features

## Resources

- [React Native Paper](https://callstack.github.io/react-native-paper/) - Documentation if ever reconsidering
- [Material Design 3](https://m3.material.io/) - Design guidelines our custom components follow conceptually

---

## RESOLVED

- [x] **Evaluate component migration or removal** - RESOLVED: Removed react-native-paper. The custom component library provides better alignment with project goals: single styling system, platform-specific glass effects, full design control, and lighter bundle.

- [x] **All other tasks** - N/A: Since Paper is not used, tasks related to PaperProvider, Paper theme configuration, adaptNavigationTheme, Portal wrapper, and MD3 text variants are not applicable.
