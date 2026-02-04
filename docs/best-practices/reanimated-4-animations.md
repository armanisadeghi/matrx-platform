# React Native Reanimated 4 Animation Best Practices

> Production patterns for fluid, 60+ FPS animations using Reanimated 4's CSS-style animation system.

## Overview

Reanimated 4 brings CSS-style animations to React Native, enabling declarative animations using familiar web syntax. Animations run natively on the UI thread, ensuring smooth performance even during intensive JavaScript operations.

## Core Concepts

### Two Animation Systems

1. **CSS Animations & Transitions** - Declarative, state-driven animations (recommended for most UI)
2. **Worklets** - Imperative, gesture-driven animations (for complex interactions)

Use CSS-style for 80% of use cases. Reserve worklets for gesture-driven interactions requiring frame-by-frame control.

## Setup

### Installation

```bash
npx expo install react-native-reanimated react-native-worklets
```

### Babel Configuration

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-worklets/plugin',  // MUST be last
    ],
  };
};
```

### Requirements

- React Native 0.76+ (New Architecture required)
- Fabric renderer enabled
- Hermes JavaScript engine

## CSS-Style Animations

### Basic Transitions

Apply transitions declaratively by toggling styles:

```tsx
import Animated from 'react-native-reanimated';

function ExpandableCard({ isExpanded }: { isExpanded: boolean }) {
  return (
    <Animated.View
      style={{
        height: isExpanded ? 200 : 80,
        opacity: isExpanded ? 1 : 0.7,
        transitionProperty: 'height, opacity',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
      }}
    >
      <Content />
    </Animated.View>
  );
}
```

### Keyframe Animations

```tsx
import Animated, { keyframes } from 'react-native-reanimated';

const fadeInUp = keyframes({
  from: {
    opacity: 0,
    transform: [{ translateY: 20 }],
  },
  to: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
});

function AnimatedCard() {
  return (
    <Animated.View
      style={{
        animation: fadeInUp,
        animationDuration: '400ms',
        animationTimingFunction: 'ease-out',
        animationFillMode: 'forwards',
      }}
    >
      <CardContent />
    </Animated.View>
  );
}
```

### Spring Animations

For physics-based motion:

```tsx
<Animated.View
  style={{
    transform: [{ scale: isPressed ? 0.95 : 1 }],
    transitionProperty: 'transform',
    transitionDuration: '200ms',
    transitionTimingFunction: 'spring(1, 100, 10, 0)',  // mass, stiffness, damping, velocity
  }}
/>
```

## Worklet-Based Animations

### Shared Values

For values that need imperative control:

```typescript
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

function DraggableCard() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));
  
  return <Animated.View style={animatedStyle} />;
}
```

### Gesture Integration

```typescript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';

function SwipeableCard({ onSwipe }: { onSwipe: () => void }) {
  const translateX = useSharedValue(0);
  
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > 150) {
        runOnJS(onSwipe)();
      }
      translateX.value = withSpring(0);
    });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        <CardContent />
      </Animated.View>
    </GestureDetector>
  );
}
```

## Animation Patterns

### Enter/Exit Animations

```tsx
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInRight, 
  SlideOutLeft 
} from 'react-native-reanimated';

function AnimatedListItem({ item }: Props) {
  return (
    <Animated.View
      entering={SlideInRight.duration(300)}
      exiting={SlideOutLeft.duration(200)}
    >
      <ListItemContent item={item} />
    </Animated.View>
  );
}
```

### Layout Animations

Animate layout changes automatically:

```tsx
import Animated, { LinearTransition } from 'react-native-reanimated';

function ReorderableList({ items }: Props) {
  return (
    <Animated.View layout={LinearTransition.springify()}>
      {items.map(item => (
        <Animated.View 
          key={item.id}
          layout={LinearTransition}
        >
          <Item {...item} />
        </Animated.View>
      ))}
    </Animated.View>
  );
}
```

### Scroll-Linked Animations

```typescript
import { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

function ParallaxHeader() {
  const scrollY = useSharedValue(0);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * 0.5 }],
    opacity: 1 - scrollY.value / 200,
  }));
  
  return (
    <>
      <Animated.View style={headerStyle}>
        <HeaderContent />
      </Animated.View>
      <Animated.ScrollView onScroll={scrollHandler}>
        <ScrollContent />
      </Animated.ScrollView>
    </>
  );
}
```

## Performance Rules

### DO:

1. **Use CSS transitions for simple state changes** - Less boilerplate, equally performant
2. **Derive animated values** - Use `useDerivedValue` for computed animations
3. **Minimize shared values** - Each creates native subscription overhead
4. **Use `withSpring` over `withTiming`** - More natural motion, interruptible

### DO NOT:

1. **Never read `.value` in render** - Always use `useAnimatedStyle`
2. **Never call hooks conditionally** - Violates React rules
3. **Never pass shared values to non-animated components** - Use `.value` in callbacks
4. **Never use `useMemo`/`useCallback`** - React Compiler handles this in RN 0.81+

## Debugging

### Worklet Logging

```typescript
import { runOnUI } from 'react-native-reanimated';

// Log from UI thread
runOnUI(() => {
  'worklet';
  console.log('Value:', someSharedValue.value);
})();
```

### Performance Monitoring

```typescript
import { enableLayoutAnimations } from 'react-native-reanimated';

// Disable in production if causing issues
enableLayoutAnimations(false);
```

## Migration from v3

### Breaking Changes

1. **Worklet imports changed**:
   ```typescript
   // Before (v3)
   import { runOnJS } from 'react-native-reanimated';
   
   // After (v4)
   import { runOnJS } from 'react-native-worklets';
   ```

2. **Babel plugin location**:
   ```javascript
   // Before
   'react-native-reanimated/plugin'
   
   // After
   'react-native-worklets/plugin'
   ```

3. **New Architecture required** - Legacy architecture support dropped

### Compatibility

Existing v2/v3 animation code remains compatible. CSS animations are additive, not replacement.

## NativeWind Integration

**Warning**: NativeWind 4.x requires Reanimated v3. CSS animations via NativeWind require v5.

For NativeWind 4 projects, use worklet-based animations for complex motion:

```tsx
// Combine NativeWind styles with Reanimated
<Animated.View 
  className="bg-surface rounded-lg p-4"
  style={animatedStyle}
/>
```

## Common Patterns

### Button Press Feedback

```tsx
function AnimatedButton({ onPress, children }: Props) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };
  
  return (
    <Pressable 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
```

### Skeleton Loading

```tsx
const shimmer = keyframes({
  '0%': { opacity: 0.3 },
  '50%': { opacity: 0.7 },
  '100%': { opacity: 0.3 },
});

function SkeletonLoader() {
  return (
    <Animated.View
      className="bg-gray-300 dark:bg-gray-700 rounded"
      style={{
        animation: shimmer,
        animationDuration: '1500ms',
        animationIterationCount: 'infinite',
      }}
    />
  );
}
```

## Resources

- [Reanimated 4 Documentation](https://docs.swmansion.com/react-native-reanimated/)
- [Migration Guide v3 → v4](https://docs.swmansion.com/react-native-reanimated/docs/guides/migration-from-3.x/)
- [Reanimated Cheat Sheet](https://docs.swmansion.com/react-native-reanimated/cheatsheet/)
- [Gesture Handler Documentation](https://docs.swmansion.com/react-native-gesture-handler/)
