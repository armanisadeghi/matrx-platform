# Animations (Reanimated 4)

## Interactive Components

Use `useAnimatedPress` — includes spring animation + haptic feedback:

```tsx
import { useAnimatedPress } from "@/hooks/useAnimatedPress";
import Animated from "react-native-reanimated";

function MyButton({ onPress, children }) {
  const { animatedStyle, handlers } = useAnimatedPress();

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={onPress} {...handlers}>
        {children}
      </Pressable>
    </Animated.View>
  );
}
```

### Options

```tsx
useAnimatedPress({
  scaleTo: 0.95,              // Scale factor (default: 0.95)
  disabled: false,            // Disable animation
  hapticFeedback: "light",    // "light" | "medium" | "heavy" | false
});
```

## Spring Animations

```tsx
import { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

function AnimatedCard() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(1.1);
    setTimeout(() => { scale.value = withSpring(1); }, 200);
  };

  return <Animated.View style={animatedStyle} />;
}
```

## CSS Keyframes

```tsx
import Animated, { css } from "react-native-reanimated";

const pulse = css.keyframes({
  "0%": { opacity: 1 },
  "50%": { opacity: 0.5 },
  "100%": { opacity: 1 },
});

<Animated.View
  style={{
    animationName: pulse,
    animationDuration: "1.5s",
    animationIterationCount: "infinite",
  }}
/>
```

## Enter/Exit Animations

```tsx
import Animated, { FadeIn, FadeOut, SlideInRight } from "react-native-reanimated";

<Animated.View entering={FadeIn} exiting={FadeOut}>
  <Content />
</Animated.View>

<Animated.View entering={SlideInRight.duration(300)}>
  <ListItem />
</Animated.View>
```

## Layout Animations

```tsx
import Animated, { LinearTransition } from "react-native-reanimated";

// Animate layout changes (reordering, resizing)
<Animated.View layout={LinearTransition}>
  {items.map(item => <Item key={item.id} />)}
</Animated.View>
```

## Haptic Feedback

```tsx
import { useHaptics } from "@/hooks/useHaptics";

const haptics = useHaptics();

haptics.light();      // Light tap
haptics.medium();     // Medium impact
haptics.heavy();      // Strong impact
haptics.selection();  // Selection change
haptics.success();    // Success notification
haptics.warning();    // Warning notification
haptics.error();      // Error notification
```

## Don't

- Use raw `Pressable` without animation — use `useAnimatedPress` or `<Pressable>` from ui
- Create custom spring logic — use the hook
- Forget haptics — they're built into `useAnimatedPress`
