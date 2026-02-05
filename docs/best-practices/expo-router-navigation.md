# Expo Router Navigation Best Practices

> File-based routing patterns for Expo Router v6 with native tabs and iOS 26 features.

## Overview

Expo Router is Expo's file-based routing library built on React Navigation. It transforms files in the `app` directory into routes with automatic deep linking, typed routes, and native tab support.

## Project Structure

### Recommended Layout

```
app/
  _layout.tsx          # Root layout with providers
  index.tsx            # Home screen (/)
  +not-found.tsx       # 404 handler
  
  (tabs)/              # Tab navigator group
    _layout.tsx        # Tab configuration
    index.tsx          # First tab
    profile.tsx        # Second tab
    settings.tsx       # Third tab
  
  (auth)/              # Auth flow group (no tabs)
    _layout.tsx
    login.tsx
    register.tsx
  
  modal.tsx            # Modal presentation
  
  [id].tsx             # Dynamic route (/123)
  user/
    [userId]/
      index.tsx        # /user/123
      posts.tsx        # /user/123/posts
```

### File Naming Rules

| Pattern | Description |
|---------|-------------|
| `_layout.tsx` | Layout wrapper for directory |
| `index.tsx` | Default route for directory |
| `+not-found.tsx` | 404 handler |
| `[param].tsx` | Dynamic segment |
| `[...rest].tsx` | Catch-all route |
| `(group)/` | Route group (no URL impact) |

## Root Layout Pattern

`app/_layout.tsx`:

```tsx
import { Stack } from 'expo-router';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

## Native Tabs (iOS 26 Liquid Glass)

> **SDK Version Note:** This project uses SDK 54 (expo-router@6.0.23). In SDK 54, `Icon`, `Label`, and `Badge` are **standalone exports** from the NativeTabs module, NOT compound sub-components like `NativeTabs.Trigger.Icon`. The `md` prop for Material icons is also SDK 55+ — use `drawable` for Android icons in SDK 54.

### Basic Setup

NativeTabs is **NOT** a drop-in replacement for `Tabs` — it uses a completely different API. We maintain separate rendering paths.

`app/(tabs)/_layout.tsx`:

```tsx
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

function NativeTabsLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: 'house', selected: 'house.fill' }} drawable="home" />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: 'person', selected: 'person.fill' }} drawable="person" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Icon sf="gear" drawable="settings" />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

### iOS 26 Features

#### Search Tab Role

```tsx
<NativeTabs.Trigger name="search" role="search">
  <Icon sf="magnifyingglass" drawable="search" />
  <Label>Search</Label>
</NativeTabs.Trigger>
```

#### Bottom Accessory (Mini-Player) — SDK 55+

> This API is NOT available in SDK 54. Documented here for future reference.

```tsx
const [isPlaying, setIsPlaying] = useState(false);

<NativeTabs>
  <NativeTabs.BottomAccessory>
    <MiniPlayer isPlaying={isPlaying} onToggle={() => setIsPlaying(!isPlaying)} />
  </NativeTabs.BottomAccessory>
  {/* Triggers */}
</NativeTabs>
```

**Critical**: State MUST be lifted to parent—two instances render for different placements.

#### Tab Badges

```tsx
import { NativeTabs, Icon, Label, Badge } from 'expo-router/unstable-native-tabs';

<NativeTabs.Trigger name="messages">
  <Badge>9+</Badge>
  <Icon sf="message.fill" drawable="chat" />
  <Label>Messages</Label>
</NativeTabs.Trigger>
```

## Platform-Specific Layouts

### Web Fallback for Native Tabs

Native tabs have no standard web equivalent. Provide custom web layout:

`app/(tabs)/_layout.tsx` (native):
```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return <NativeTabs>{/* triggers */}</NativeTabs>;
}
```

`app/(tabs)/_layout.web.tsx` (web):
```tsx
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';

export default function WebTabLayout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList className="flex-row justify-center gap-4 p-4 border-t">
        <TabTrigger name="index" href="/">Home</TabTrigger>
        <TabTrigger name="profile" href="/profile">Profile</TabTrigger>
      </TabList>
    </Tabs>
  );
}
```

## Navigation Patterns

### Programmatic Navigation

```typescript
import { router } from 'expo-router';

// Push to stack
router.push('/user/123');

// Replace current screen
router.replace('/home');

// Go back
router.back();

// Navigate with params
router.push({
  pathname: '/user/[id]',
  params: { id: '123' },
});
```

### Typed Routes

With `typedRoutes: true` in experiments:

```typescript
import { router, Href } from 'expo-router';

// Type-safe navigation
router.push('/user/123' as Href);

// Or use the generated types
router.push<'/user/[id]'>({ pathname: '/user/[id]', params: { id: '123' } });
```

### Reading Route Params

```typescript
import { useLocalSearchParams, useGlobalSearchParams } from 'expo-router';

function UserScreen() {
  // Current segment params only
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // All route params
  const globalParams = useGlobalSearchParams();
  
  return <Text>User ID: {id}</Text>;
}
```

## Stack Configuration

### Nested Stacks in Tabs

Each tab can contain its own stack:

```
app/(tabs)/
  _layout.tsx        # Tab navigator
  home/
    _layout.tsx      # Stack for home tab
    index.tsx        # /home
    details.tsx      # /home/details
```

`app/(tabs)/home/_layout.tsx`:
```tsx
import { Stack } from 'expo-router';

export default function HomeStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="details" options={{ title: 'Details' }} />
    </Stack>
  );
}
```

### Modal Presentation

```tsx
// In root _layout.tsx
<Stack.Screen 
  name="modal" 
  options={{ 
    presentation: 'modal',
    headerShown: true,
    title: 'Modal',
  }} 
/>

// Navigate to modal
router.push('/modal');
```

## Safe Area Handling

### Native Tabs Auto-Handling

Native tabs automatically handle bottom safe areas. For top areas:

```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top }}>
      <Content />
    </ScrollView>
  );
}
```

### Disable Auto Content Insets

When manual control is needed:

```tsx
<NativeTabs.Trigger name="index" disableAutomaticContentInsets>
  {/* ... */}
</NativeTabs.Trigger>
```

## Common Issues & Fixes

### White Flash on Tab Switch

Wrap layout in ThemeProvider:

```tsx
<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
  <NativeTabs>{/* ... */}</NativeTabs>
</ThemeProvider>
```

### Transparent Tab Bar on iOS 18

Use `disableTransparentOnScrollEdge`:

```tsx
<NativeTabs disableTransparentOnScrollEdge>
  {/* ... */}
</NativeTabs>
```

### ScrollView Issues

Ensure ScrollView is first child with `collapsable={false}` on wrapper:

```tsx
<View collapsable={false} style={{ flex: 1 }}>
  <ScrollView>
    {/* Content */}
  </ScrollView>
</View>
```

## Limitations

1. **Maximum 5 tabs on Android** - Platform constraint
2. **No nested native tabs** - Use JS tabs inside native tabs if needed
3. **FlatList has limited support** - Use disableTransparentOnScrollEdge
4. **No dynamic tab add/remove** - Define tabs statically

## Resources

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Native Tabs Guide](https://docs.expo.dev/router/advanced/native-tabs/)
- [File-Based Routing](https://docs.expo.dev/develop/file-based-routing/)
- [NativeTabs API Reference](https://docs.expo.dev/versions/latest/sdk/router-native-tabs/)

## TASKS

- [x] **Add ThemeProvider wrapper to prevent white flash on tab switch** - Already implemented in `app/_layout.tsx`: builds React Navigation theme from design tokens with `useMemo`.

- [x] **Update NativeTabs implementation to use proper Trigger API** - Fixed: NativeTabs path now uses `NativeTabs.Trigger` with standalone `Icon`/`Label` components (SDK 54 API). Regular `Tabs` path uses `Tabs.Screen` with Ionicons. Two separate rendering paths, not a drop-in swap.

- [x] **Add `minimizeBehavior="onScrollDown"` to NativeTabs** - Added to the NativeTabs rendering path for iOS 26 scroll-to-minimize.

- [x] **Use SF Symbols for NativeTabs icons** - NativeTabs path now uses `sf` prop (e.g., `{ default: 'house', selected: 'house.fill' }`) with `drawable` for Android. Regular Tabs path continues to use Ionicons.

- [ ] **Use `DynamicColorIOS` for tab bar colors** - Deprioritized: there is a known iOS 26 bug (expo/expo#39930) where DynamicColorIOS produces inverted icon tint behavior. Expo recommends `PlatformColor()` with system semantic colors instead. The Liquid Glass tab bar adapts colors automatically, so manual color overrides may be unnecessary.

- [ ] **Create web-specific tab layout file** - Consider creating `app/(tabs)/_layout.web.tsx` using `Tabs, TabList, TabTrigger, TabSlot` from `expo-router/ui` if web support is needed.

- [ ] **Add modal route with proper Stack.Screen configuration** - The existing `ModalLayout` component handles modals flexibly (sheet, dialog, fullscreen). A route-based modal entry point could be added for deep-linking.

- [ ] **Consider adding dynamic routes** - No `[id].tsx` or `user/[userId]/` patterns currently exist. These should be added as actual app features are built.

## RESOLVED DISCUSSIONS

- **NativeTabs import pattern** — RESOLVED: Keep the conditional try/catch import with `supportsLiquidGlass` guard. This is defensive and handles older SDK versions gracefully. Direct import would crash on platforms without NativeTabs support.

- **SplashScreen handling** — RESOLVED: The current `preventAutoHideAsync()` + `hideAsync()` pattern is correct and essential for production apps. The doc omitted this — it's already properly implemented in `app/_layout.tsx`.

- **Modal approach** — RESOLVED: Keep the flexible `ModalLayout` component for in-app modals. Route-based modals (`app/modal.tsx`) can be added later if deep-linking to modals is needed.

- **SDK 54 vs SDK 55 API** — RESOLVED: Several doc examples used SDK 55 compound API (`NativeTabs.Trigger.Icon`, `.Label`, `.Badge`, `md` prop, `BottomAccessory`). These have been corrected to SDK 54 standalone imports (`Icon`, `Label`, `Badge`, `drawable` prop). `BottomAccessory` is documented as SDK 55+ future reference.
