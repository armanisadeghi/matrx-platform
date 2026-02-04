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

### Basic Setup

`app/(tabs)/_layout.tsx`:

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS } from 'react-native';

export default function TabLayout() {
  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"  // iOS 26 minimize on scroll
      labelStyle={{
        color: DynamicColorIOS({ dark: 'white', light: 'black' }),
      }}
      tintColor={DynamicColorIOS({ dark: 'white', light: 'black' })}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon 
          sf={{ default: 'house', selected: 'house.fill' }} 
          md="home" 
        />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon 
          sf={{ default: 'person', selected: 'person.fill' }} 
          md="person" 
        />
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf="gear" md="settings" />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

### iOS 26 Features

#### Search Tab Role

```tsx
<NativeTabs.Trigger name="search" role="search">
  <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
  <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
</NativeTabs.Trigger>
```

#### Bottom Accessory (Mini-Player)

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
<NativeTabs.Trigger name="messages">
  <NativeTabs.Trigger.Badge>9+</NativeTabs.Trigger.Badge>
  <NativeTabs.Trigger.Icon sf="message.fill" md="chat" />
  <NativeTabs.Trigger.Label>Messages</NativeTabs.Trigger.Label>
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

- [ ] Add ThemeProvider wrapper to prevent white flash on tab switch - `app/_layout.tsx` needs to import and wrap with `ThemeProvider` from `@react-navigation/native` using `DarkTheme`/`DefaultTheme`
- [ ] Update NativeTabs implementation to use proper `NativeTabs.Trigger` API instead of `Tabs.Screen` - `app/(tabs)/_layout.tsx` lines 61-98 use old API pattern
- [ ] Add `minimizeBehavior="onScrollDown"` to NativeTabs for iOS 26 scroll-to-minimize feature - `app/(tabs)/_layout.tsx`
- [ ] Use `DynamicColorIOS` for tab bar colors instead of theme colors for proper Liquid Glass adaptation - `app/(tabs)/_layout.tsx` lines 44-45, 97-98
- [ ] Use SF Symbols (`sf` prop) and Material icons (`md` prop) for tab icons instead of Ionicons - `app/(tabs)/_layout.tsx` lines 66-67, 75-76, 84-85, 93-94
- [ ] Create web-specific tab layout file for proper web support - create `app/(tabs)/_layout.web.tsx` using `Tabs, TabList, TabTrigger, TabSlot` from `expo-router/ui`
- [ ] Add modal route with proper Stack.Screen configuration - create `app/modal.tsx` and configure `presentation: 'modal'` in `app/_layout.tsx`
- [ ] Consider adding dynamic routes for user profiles or detail screens - no `[id].tsx` or `user/[userId]/` patterns currently exist

## TO DISCUSS

- **Current approach:** Conditional NativeTabs import with try/catch and `supportsLiquidGlass` check in `app/(tabs)/_layout.tsx` lines 13-24
- **Document suggests:** Direct import of `NativeTabs` from `expo-router/unstable-native-tabs`
- **Why current is better:** The current approach gracefully handles cases where NativeTabs may not be available (older SDKs, different platform versions) and falls back to standard Tabs. This is more defensive and production-ready than assuming the import will always succeed.

- **Current approach:** SplashScreen handling with `preventAutoHideAsync()` and `hideAsync()` in `app/_layout.tsx` lines 7, 12, 17-23
- **Document suggests:** No mention of splash screen handling
- **Why current is better:** The document omits important splash screen management that's essential for production apps. The current implementation properly prevents auto-hide and programmatically hides after initialization.

- **Current approach:** ModalLayout component in `components/layouts/ModalLayout.tsx` with multiple presentation types (sheet, dialog, fullscreen)
- **Document suggests:** Simple `modal.tsx` route file with Stack.Screen presentation
- **Why current is better:** The ModalLayout component is more flexible, offering sheet, dialog, and fullscreen variants with platform-appropriate styling and glass effects on iOS. However, a route-based modal entry point would still be useful for deep-linking purposes.
