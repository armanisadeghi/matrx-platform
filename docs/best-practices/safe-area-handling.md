# Safe Area Handling Best Practices

> Production patterns for handling device safe areas across iOS, Android, and web.

## The Golden Rule

**Always use `useSafeAreaInsets()` hook over `<SafeAreaView>` component.** The component causes animation flicker and inconsistent behavior with React Navigation.

## Setup

### Installation

```bash
npx expo install react-native-safe-area-context
```

### Provider Configuration

Wrap your app root:

```tsx
// app/_layout.tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack />
    </SafeAreaProvider>
  );
}
```

## Primary Pattern: useSafeAreaInsets

```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Screen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ 
      flex: 1,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }}>
      <Content />
    </View>
  );
}
```

### Common Patterns

#### Header with Safe Area

```tsx
function Header({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      className="bg-surface border-b border-border px-4 pb-3"
      style={{ paddingTop: insets.top + 12 }}
    >
      <Text className="text-xl font-bold text-text-primary">{title}</Text>
    </View>
  );
}
```

#### Bottom Content with Minimum Padding

```tsx
function BottomSheet() {
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      className="bg-surface rounded-t-3xl px-4 pt-4"
      style={{ paddingBottom: Math.max(insets.bottom, 20) }}
    >
      <SheetContent />
    </View>
  );
}
```

#### Scrollable Content

```tsx
function ScrollableScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <Content />
    </ScrollView>
  );
}
```

## Why Not SafeAreaView?

### Problems with SafeAreaView Component

1. **Animation Flicker**: Updates at different times than `useSafeAreaInsets`, causing visible layout shifts during transitions
2. **React Navigation Conflicts**: Double-insets when used with navigation headers
3. **Limited Control**: Cannot specify which edges to apply insets to (without separate imports)
4. **iOS-Only Legacy**: `react-native`'s built-in `SafeAreaView` only works on iOS 11+

### The Exception

Use `<SafeAreaView>` from `react-native-safe-area-context` (not `react-native`) only when you need a simple full-screen wrapper without animations:

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

// Only for static, full-screen layouts
<SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
  <StaticContent />
</SafeAreaView>
```

## Edge-to-Edge on Android

### Expo SDK 54 Default

Edge-to-edge is enabled by default in Expo SDK 54:

```typescript
// app.config.ts
android: {
  edgeToEdgeEnabled: true,
}
```

### Manual Handling

Android edge-to-edge means content renders behind system bars. Handle all four edges:

```tsx
function AndroidScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ flex: 1 }}>
      {/* Status bar area */}
      <View style={{ height: insets.top }} className="bg-primary" />
      
      {/* Content */}
      <View style={{ flex: 1 }}>
        <Content />
      </View>
      
      {/* Navigation bar area */}
      <View style={{ height: insets.bottom }} className="bg-surface" />
    </View>
  );
}
```

## Native Tabs Integration

### Automatic Bottom Insets

Native tabs (`expo-router/unstable-native-tabs`) automatically handle bottom safe area. Manual handling creates double padding.

#### Correct:

```tsx
function TabScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      {/* NO paddingBottom - native tabs handle it */}
      <Content />
    </View>
  );
}
```

#### Incorrect:

```tsx
function TabScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ 
      flex: 1, 
      paddingTop: insets.top,
      paddingBottom: insets.bottom, // WRONG - creates double padding
    }}>
      <Content />
    </View>
  );
}
```

### Disabling Auto Insets

When you need full control:

```tsx
<NativeTabs.Trigger name="custom" disableAutomaticContentInsets>
  <NativeTabs.Trigger.Label>Custom</NativeTabs.Trigger.Label>
</NativeTabs.Trigger>
```

Then handle manually:

```tsx
import { SafeAreaView } from 'react-native-screens/experimental';

function CustomTabScreen() {
  return (
    <SafeAreaView edges={{ bottom: true }} style={{ flex: 1 }}>
      <Content />
    </SafeAreaView>
  );
}
```

## Platform-Specific Patterns

### iOS Notch/Dynamic Island

```tsx
const insets = useSafeAreaInsets();

// insets.top accounts for:
// - Status bar (20pt on older iPhones)
// - Notch (44pt on iPhone X-14)
// - Dynamic Island (59pt on iPhone 14 Pro+)
```

### Android Gesture Navigation

```tsx
const insets = useSafeAreaInsets();

// insets.bottom accounts for:
// - 3-button navigation (48dp)
// - Gesture pill (varying heights)
// - Keyboard (not included - use KeyboardAvoidingView)
```

### Landscape Considerations

```tsx
const insets = useSafeAreaInsets();

// In landscape:
// - insets.left may be non-zero (notch side)
// - insets.right may be non-zero (opposite side on iPad)
```

## Keyboard Handling

Safe area insets do NOT include keyboard. Combine with keyboard handling:

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';

function FormScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <Form />
      </View>
      <View style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <SubmitButton />
      </View>
    </KeyboardAvoidingView>
  );
}
```

## Testing

### Insets Are Not Synchronous

Insets update asynchronously after orientation changes. Account for brief delay:

```tsx
function OrientationAwareComponent() {
  const insets = useSafeAreaInsets();
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Give time for insets to stabilize
    const timeout = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timeout);
  }, [insets]);
  
  if (!isReady) return <LoadingPlaceholder />;
  
  return <Content />;
}
```

### Testing on Simulators

- **iOS**: Use iPhone 14 Pro simulator for Dynamic Island testing
- **Android**: Enable gesture navigation in emulator settings
- **Web**: Safe areas return 0 - provide fallback padding

## Common Mistakes

### ❌ Using react-native SafeAreaView

```tsx
// WRONG - iOS only, inconsistent behavior
import { SafeAreaView } from 'react-native';
```

### ❌ Applying insets to wrong elements

```tsx
// WRONG - Insets on inner content, not outer container
<View>
  <Text style={{ paddingTop: insets.top }}>Title</Text>
</View>
```

### ❌ Ignoring landscape mode

```tsx
// WRONG - Only handles top/bottom
<View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
  {/* Content will be cut off by notch in landscape */}
</View>
```

### ✅ Correct full-edge handling

```tsx
<View style={{
  paddingTop: insets.top,
  paddingBottom: insets.bottom,
  paddingLeft: insets.left,
  paddingRight: insets.right,
}}>
  <Content />
</View>
```

## Resources

- [react-native-safe-area-context Documentation](https://github.com/th3rdwave/react-native-safe-area-context)
- [Expo Safe Area Context](https://docs.expo.dev/versions/latest/sdk/safe-area-context/)
- [React Navigation Safe Area Handling](https://reactnavigation.org/docs/handling-safe-area)
- [Apple Human Interface Guidelines - Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
