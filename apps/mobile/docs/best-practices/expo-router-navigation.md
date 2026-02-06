# Navigation (Expo Router)

## Critical Navigation Rule

**EVERY screen MUST have a reliable way to navigate back or exit.**

This is non-negotiable for good UX. Users should NEVER feel trapped on any screen.

### Required Navigation Patterns

| Screen Type | Navigation Required | Example |
|------------|-------------------|---------|
| **Stack screens** | Back button in header | Detail pages, forms, modals |
| **Tab root screens** | Tab bar navigation | Home, Explore, Profile tabs |
| **Modal screens** | Close button or dismiss gesture | Dialogs, overlays |
| **Error screens** | Button to home/safe location | 404, error boundaries |

### How to Implement

```tsx
// ✅ CORRECT: Stack screen with back button
import { HeaderLayout } from "@/components/layouts";

export default function DetailScreen() {
  return (
    <HeaderLayout
      header={{
        title: "Details",
        showBackButton: true,  // Essential for navigation
      }}
    >
      {/* content */}
    </HeaderLayout>
  );
}

// ❌ WRONG: No way to go back
import { ScreenLayout } from "@/components/layouts";

export default function DetailScreen() {
  return (
    <ScreenLayout>
      {/* content - user is trapped! */}
    </ScreenLayout>
  );
}
```

**Exception:** Root tab screens don't need back buttons because the tab bar provides navigation. All other screens MUST have back navigation.

## Route Structure

```
app/
├── _layout.tsx              # Root layout (providers)
├── index.tsx                # Home route (/)
├── (tabs)/
│   ├── _layout.tsx          # Tab navigator
│   ├── index.tsx            # First tab (no back button needed)
│   ├── search.tsx           # /search (no back button needed)
│   └── profile.tsx          # /profile (no back button needed)
├── (demo)/
│   ├── _layout.tsx          # Demo stack
│   ├── index.tsx            # Demo hub (NEEDS back button)
│   └── buttons.tsx          # Button demo (NEEDS back button)
├── (auth)/
│   ├── _layout.tsx          # Auth stack
│   ├── login.tsx            # /login
│   └── register.tsx         # /register
└── [id].tsx                 # Dynamic route (NEEDS back button)
```

## Root Layout

```tsx
// app/_layout.tsx
import { Stack } from "expo-router";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ui";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ToastProvider>
    </ThemeProvider>
  );
}
```

## Tab Layout (NativeTabs)

```tsx
// app/(tabs)/_layout.tsx
import { NativeTabs, Trigger, Icon, Label } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <Trigger name="index" asChild>
        <Icon sf={{ default: "house", selected: "house.fill" }} drawable="home" />
        <Label>Home</Label>
      </Trigger>
      <Trigger name="search" role="search" asChild>
        <Icon sf={{ default: "magnifyingglass" }} drawable="search" />
        <Label>Search</Label>
      </Trigger>
    </NativeTabs>
  );
}
```

## Navigation

```tsx
import { router } from "expo-router";

// Navigate
router.push("/profile");
router.push({ pathname: "/user/[id]", params: { id: "123" } });

// Replace (no back)
router.replace("/home");

// Go back
router.back();
```

## Route Groups

| Pattern | Purpose |
|---------|---------|
| `(tabs)/` | Tab navigator |
| `(auth)/` | Auth flow (no tabs) |
| `(modal)/` | Modal presentation |

Groups don't affect URL — `(tabs)/profile.tsx` → `/profile`

## Typed Routes

```tsx
import { Href } from "expo-router";

const route: Href = "/profile";  // Type-checked
```

## Screen Options

```tsx
// In route file
export const unstable_settings = {
  initialRouteName: "index",
};

// In Stack
<Stack.Screen
  name="modal"
  options={{ presentation: "modal" }}
/>
```

## Navigation Checklist

Before pushing ANY new screen to production, verify:

- [ ] User can navigate back or exit the screen
- [ ] Back button is visible and functional (if not a root tab)
- [ ] Navigation header shows appropriate title
- [ ] Screen doesn't hide the tab bar when it shouldn't
- [ ] Deep links work correctly
- [ ] Hardware back button works (Android)
- [ ] Swipe back gesture works (iOS)

## Common Pitfalls

### 1. Using ScreenLayout for Non-Root Screens

```tsx
// ❌ WRONG: Index pages in stack navigators
export default function DemoIndex() {
  return <ScreenLayout>...</ScreenLayout>;  // No back button!
}

// ✅ CORRECT: Always use HeaderLayout with back button
export default function DemoIndex() {
  return (
    <HeaderLayout header={{ title: "Demo", showBackButton: true }}>
      ...
    </HeaderLayout>
  );
}
```

### 2. Hiding Headers Without Alternative Navigation

```tsx
// ❌ WRONG: Hidden header with no alternative
export default function MyScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {/* User is trapped! */}
    </>
  );
}

// ✅ CORRECT: Custom header with back button
export default function MyScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HeaderLayout header={{ title: "My Screen", showBackButton: true }}>
        {/* content */}
      </HeaderLayout>
    </>
  );
}
```

### 3. Modal Screens Without Close Button

```tsx
// ❌ WRONG: Modal with no way to dismiss
export default function ModalScreen() {
  return <View>{/* content but no close button */}</View>;
}

// ✅ CORRECT: Modal with explicit close action
export default function ModalScreen() {
  const router = useRouter();
  
  return (
    <HeaderLayout
      header={{
        title: "Modal",
        leftContent: (
          <IconButton icon="close" onPress={() => router.back()} />
        ),
      }}
    >
      {/* content */}
    </HeaderLayout>
  );
}
```

## Best Practices

### Always Provide Context

Headers should tell users where they are:

```tsx
// Good examples:
<HeaderLayout header={{ title: "Edit Profile", showBackButton: true }} />
<HeaderLayout header={{ title: "Settings", showBackButton: true }} />
<HeaderLayout header={{ title: "Order #12345", showBackButton: true }} />

// Bad examples:
<HeaderLayout header={{ title: "Page", showBackButton: true }} />  // Too generic
<HeaderLayout header={{ title: "", showBackButton: true }} />      // No title
```

### Use Appropriate Header Actions

```tsx
// Right actions for common tasks
<HeaderLayout
  header={{
    title: "Edit Profile",
    showBackButton: true,
    rightContent: <Button onPress={handleSave}>Save</Button>,
  }}
/>

// Multiple actions if needed
<HeaderLayout
  header={{
    title: "Message",
    showBackButton: true,
    rightContent: (
      <View className="flex-row gap-2">
        <IconButton icon="videocam" />
        <IconButton icon="call" />
        <IconButton icon="ellipsis-vertical" />
      </View>
    ),
  }}
/>
```

### Platform-Specific Navigation

Respect platform conventions:

```tsx
import { Platform } from "react-native";

<HeaderLayout
  header={{
    title: "Details",
    showBackButton: true,
    // iOS uses "Done" for modals, Android uses back button
    leftContent: Platform.OS === "ios" && isModal ? (
      <Button variant="ghost" onPress={() => router.back()}>
        Done
      </Button>
    ) : undefined,
  }}
/>
```

## Testing Navigation

Always test:

1. **Back Navigation:** Tap back button → goes to previous screen
2. **Gesture Navigation (iOS):** Swipe from left edge → goes back
3. **Hardware Back (Android):** Press back button → goes back
4. **Deep Links:** Open link → correct screen → can navigate away
5. **Tab Persistence:** Switch tabs → return to tab → state preserved

## Accessibility

Navigation must be accessible:

```tsx
<HeaderLayout
  header={{
    title: "Settings",
    showBackButton: true,
    // Back button has built-in accessibility
    // Add labels for custom actions
    rightContent: (
      <IconButton
        icon="ellipsis-vertical"
        accessibilityLabel="More options"
        accessibilityRole="button"
      />
    ),
  }}
/>
```

## Summary

- **Never trap users** - every screen needs an exit
- **Use HeaderLayout** for non-root screens with `showBackButton: true`
- **Use ScreenLayout** only for root tab screens
- **Test all navigation paths** before shipping
- **Respect platform conventions** for navigation patterns
