# Expo SDK 54

**Stack:** Expo SDK 54 + React Native 0.81 + New Architecture (mandatory)

## Required Config

```typescript
// app.config.ts
export default {
  newArchEnabled: true,           // REQUIRED
  userInterfaceStyle: "automatic", // REQUIRED for dark mode
  scheme: "my-app",

  ios: {
    bundleIdentifier: "com.company.app",
    infoPlist: { UIUserInterfaceStyle: "Automatic" },
  },

  android: {
    package: "com.company.app",
    edgeToEdgeEnabled: true,      // Default in SDK 54
  },

  experiments: {
    typedRoutes: true,
  },
};
```

## Package Installation

```bash
# ALWAYS use expo install for SDK compatibility
npx expo install expo-router expo-glass-effect

# NEVER use pnpm/npm directly for Expo packages
pnpm add expo-router  # Wrong - may install incompatible version
```

## Edge-to-Edge (Android)

Enabled by default. Handle with safe areas:

```typescript
import { useSafeAreaInsets } from "react-native-safe-area-context";

function Screen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {children}
    </View>
  );
}
```

## iOS Build Times

SDK 54 ships precompiled XCFrameworks. Clean builds: ~120s → ~10s.

**Exception:** `use_frameworks!` in Podfile triggers source compilation.

## Environment Variables

```bash
# .env.local
EXPO_PUBLIC_API_URL=https://api.example.com
```

```typescript
// Only EXPO_PUBLIC_* exposed to client
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

## Typed Routes

Enable in config, then use:

```typescript
import { router, Href } from "expo-router";

router.push("/user/123" as Href);
router.push({ pathname: "/user/[id]", params: { id: "123" } });
```

## Development Commands

| Command | Action |
|---------|--------|
| `pnpm start` | Start Metro |
| `pnpm ios` | iOS Simulator |
| `pnpm android` | Android Emulator |
| `npx expo prebuild` | Generate native projects |
| `npx expo prebuild --clean` | Clean regeneration |

## Validation

```bash
pnpm tsc --noEmit          # Type check
pnpm lint                  # Lint
npx expo config --type public  # Verify no secrets exposed
```

## Constraints

| Rule | Reason |
|------|--------|
| Never put secrets in app.config.ts | Exposed in bundle |
| Always use `npx expo install` | SDK version compatibility |
| Always use `useSafeAreaInsets()` | Not SafeAreaView |
| New Architecture is mandatory | SDK 55+ requires it |
