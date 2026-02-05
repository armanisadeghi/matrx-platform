# Navigation (Expo Router)

## Route Structure

```
app/
├── _layout.tsx              # Root layout (providers)
├── index.tsx                # Home route (/)
├── (tabs)/
│   ├── _layout.tsx          # Tab navigator
│   ├── index.tsx            # First tab
│   ├── search.tsx           # /search
│   └── profile.tsx          # /profile
├── (auth)/
│   ├── _layout.tsx          # Auth stack
│   ├── login.tsx            # /login
│   └── register.tsx         # /register
└── [id].tsx                 # Dynamic route (/123)
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
