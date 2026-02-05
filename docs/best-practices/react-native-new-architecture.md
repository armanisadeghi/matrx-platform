# React Native New Architecture

**Status:** Mandatory in SDK 55+. SDK 54 is the last bridge-compatible version.

## Core Components

| Component | Replaces | Benefit |
|-----------|----------|---------|
| Fabric | Old renderer | Synchronous layout, concurrent rendering |
| TurboModules | NativeModules | Lazy loading, type-safe bindings |
| Bridgeless Mode | Bridge | ~50% TTI improvement |
| JSI | Bridge calls | Direct native object access |

## Enable

```typescript
// app.config.ts
export default {
  newArchEnabled: true,  // Default in SDK 54+
};
```

## Verify

```typescript
import { TurboModuleRegistry } from "react-native";

const isNewArch = typeof TurboModuleRegistry !== "undefined";
const isHermes = () => !!global.HermesInternal;
```

## TurboModules vs NativeModules

```typescript
// Legacy (avoid)
import { NativeModules } from "react-native";
const { MyModule } = NativeModules;

// New Architecture (use this)
import { TurboModuleRegistry } from "react-native";
const MyModule = TurboModuleRegistry.get("MyModule");
```

## Concurrent Features

React 18 concurrent features work with Fabric:

```tsx
import { Suspense, startTransition } from "react";

function App() {
  const [tab, setTab] = useState("home");

  const handleChange = (newTab: string) => {
    startTransition(() => setTab(newTab));  // Low-priority
  };

  return (
    <Suspense fallback={<Spinner />}>
      <TabContent tab={tab} />
    </Suspense>
  );
}
```

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| NativeModule is null | Not TurboModule compatible | Update library or use alternative |
| findNodeHandle returns null | Fabric uses different refs | Use `ref.current` directly |
| Animations stutter | Worklet misconfiguration | Verify Reanimated 4 + plugin |
| Third-party crash | Legacy architecture | Check reactnative.directory |

## Custom Native Modules

Use Expo Modules API (auto-generates TurboModule specs):

```typescript
// modules/my-module/index.ts
import { NativeModulesProxy } from "expo-modules-core";
export const MyModule = NativeModulesProxy.MyModule;
```

## Library Compatibility

Check [reactnative.directory](https://reactnative.directory/) with "New Architecture" filter.

## Constraints

| Rule | Reason |
|------|--------|
| Never use `NativeModules` for new code | Use TurboModuleRegistry |
| Always verify library compatibility | Before adding dependencies |
| Test on both iOS and Android | Behavior may differ |
| Use Expo Modules API for custom native code | Auto New Architecture support |
