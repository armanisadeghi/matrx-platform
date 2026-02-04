# React Native New Architecture Best Practices

> Production patterns for the mandatory New Architecture in React Native 0.81+.

## Overview

The New Architecture is now **mandatory** starting with SDK 55 and React Native 0.82. SDK 54 with React Native 0.81 is the last version supporting the legacy architecture. All new development MUST target the New Architecture.

## Core Components

### 1. Fabric (New Renderer)

- Synchronous layout with C++ core
- Concurrent rendering support
- Improved gesture handling
- No JavaScript bridge for rendering

### 2. TurboModules

- Lazy loading native modules
- Type-safe bindings via CodeGen
- Direct JavaScript ↔ Native communication

### 3. Bridgeless Mode

- No serialization/deserialization overhead
- ~50% reduction in Time-To-Interactive (TTI)
- Enabled by default when New Architecture is active

### 4. JSI (JavaScript Interface)

- Direct native object access from JavaScript
- No bridge required for native calls
- Enables Hermes optimizations

## Enabling New Architecture

### Expo SDK 54 (app.config.ts)

```typescript
export default {
  newArchEnabled: true,  // Default in SDK 54+
  // ...
};
```

### Verification

```typescript
import { TurboModuleRegistry } from 'react-native';

const isNewArch = typeof TurboModuleRegistry !== 'undefined';
console.log('New Architecture:', isNewArch);
```

## Migration Requirements

### Native Module Updates

All native modules must support TurboModules:

```typescript
// Old (Legacy)
import { NativeModules } from 'react-native';
const { MyModule } = NativeModules;

// New (TurboModules)
import { TurboModuleRegistry } from 'react-native';
const MyModule = TurboModuleRegistry.get('MyModule');
```

### Expo Modules

All Expo SDK packages support New Architecture by default. No action required.

### Third-Party Libraries

Check compatibility at [React Native Directory](https://reactnative.directory/):
- Filter by "New Architecture" support
- Most popular libraries are now compatible

## Hermes Engine

Hermes is the default JavaScript engine with significant benefits:

### Benefits

- Faster startup time
- Reduced memory usage
- Improved TTI
- Better debugger support

### Verification

```typescript
const isHermes = () => !!global.HermesInternal;
console.log('Hermes:', isHermes());
```

### Debugging with Hermes

Use Chrome DevTools or Flipper:

```bash
# Chrome DevTools
npx react-native start
# Open chrome://inspect

# Flipper (recommended)
# Download from fbflipper.com
```

## Performance Patterns

### Synchronous Layout

Fabric enables synchronous measurements:

```typescript
import { measure } from 'react-native';

// New Architecture allows sync measurement
const measurements = measure(viewRef);
console.log('Width:', measurements.width);
```

### Concurrent Features

React 18 concurrent features work with Fabric:

```tsx
import { Suspense, startTransition } from 'react';

function App() {
  const [tab, setTab] = useState('home');
  
  const handleTabChange = (newTab) => {
    // Low-priority update
    startTransition(() => {
      setTab(newTab);
    });
  };
  
  return (
    <Suspense fallback={<Loading />}>
      <TabContent tab={tab} />
    </Suspense>
  );
}
```

## Worklet Integration

Reanimated 4 leverages JSI for UI thread execution:

```typescript
import { runOnUI } from 'react-native-worklets';

// Executes directly on UI thread via JSI
runOnUI(() => {
  'worklet';
  // Native UI manipulation
})();
```

## Common Migration Issues

### Issue: NativeModule is null

**Cause**: Module not registered as TurboModule

**Solution**: Update to TurboModule-compatible version or check native code registration

### Issue: findNodeHandle returns null

**Cause**: Fabric uses different node references

**Solution**: Use `ref.current` directly or `measure()` API

### Issue: Animations stutter

**Cause**: Incorrect worklet configuration

**Solution**: Ensure Reanimated 4 with `react-native-worklets/plugin`

### Issue: Third-party library crashes

**Cause**: Legacy architecture dependency

**Solution**: 
1. Check for updates
2. Find alternative library
3. Contribute New Architecture support

## Expo Modules API

Building new native modules? Use Expo Modules API:

```typescript
// modules/my-module/index.ts
import { NativeModulesProxy } from 'expo-modules-core';

export const MyModule = NativeModulesProxy.MyModule;

// Automatically supports New Architecture
```

Benefits:
- TypeScript-first
- Auto-generates TurboModule specs
- Cross-platform (iOS/Android)
- No manual linking

## Testing New Architecture

### Development

```bash
# iOS - force New Architecture
npx expo run:ios --configuration Debug

# Android - force New Architecture
npx expo run:android --variant debug
```

### CI/CD

```yaml
# EAS Build
# eas.json
{
  "build": {
    "production": {
      "env": {
        "EX_DEV_CLIENT_NETWORK_INSPECTOR": "false"
      }
    }
  }
}
```

## Performance Monitoring

### Measure Bridge Calls

With New Architecture, monitor for remaining bridge usage:

```typescript
import { PerformanceObserver } from 'react-native';

const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name.includes('bridge')) {
      console.warn('Bridge call detected:', entry);
    }
  }
});
observer.observe({ entryTypes: ['measure'] });
```

### Memory Profiling

```bash
# Hermes heap snapshot
npx react-native profile-hermes
```

## Critical Rules

1. **Never use legacy NativeModules** for new code - Always use TurboModuleRegistry
2. **Always verify library compatibility** before adding dependencies
3. **Test on both iOS and Android** - Behavior may differ during migration
4. **Monitor for bridge calls** - They indicate legacy code paths
5. **Use Expo Modules API** for custom native code

## SDK 55+ Considerations

Starting SDK 55:
- New Architecture cannot be disabled
- Legacy architecture code will not compile
- All native modules must be TurboModule-compatible

Prepare now by:
1. Auditing all native dependencies
2. Replacing incompatible libraries
3. Testing thoroughly on SDK 54 with New Architecture enabled

## Resources

- [React Native New Architecture](https://reactnative.dev/docs/new-architecture-intro)
- [Expo New Architecture Guide](https://docs.expo.dev/guides/new-architecture/)
- [TurboModules Documentation](https://reactnative.dev/docs/turbo-native-modules-introduction)
- [Fabric Overview](https://reactnative.dev/docs/fabric-renderer)
- [Expo Modules API](https://docs.expo.dev/modules/overview/)
- [React Native Directory](https://reactnative.directory/)

---

## TASKS

- [ ] Add `eas.json` configuration file for CI/CD builds - `eas.json` (new file at project root)
- [ ] Consider adding runtime New Architecture verification utility - `lib/debug.ts` or `hooks/useNewArchVerification.ts`
- [ ] Consider using React 18+ concurrent features (`Suspense`, `startTransition`) for improved UX in data-heavy screens - `app/(tabs)/*.tsx`

✅ Core New Architecture requirements are met:
- `newArchEnabled: true` is set in `app.config.ts:11`
- Using Expo SDK 54 (`expo: "~54.0.33"`) with React Native 0.81.5
- `react-native-reanimated/plugin` configured in `babel.config.js:8`
- All dependencies are New Architecture compatible Expo packages
- No legacy `NativeModules` usage in application code
- No deprecated `findNodeHandle` usage
- Proper `GestureHandlerRootView` wrapper in `app/_layout.tsx:26`

## TO DISCUSS

- **Current approach:** `babel.config.js` uses only `react-native-reanimated/plugin`
- **Document suggests:** Adding separate `react-native-worklets/plugin` (line 184)
- **Why current is better:** Reanimated 4 (v4.2.1 installed) includes worklets functionality and its plugin handles all worklet transformations. The separate `react-native-worklets/plugin` is only needed if using worklets independently of Reanimated. The lock file shows `react-native-worklets@0.7.2` is already installed as a peer dependency.

---

- **Current approach:** No Flipper dependency
- **Document suggests:** Using Flipper for debugging (line 109-110)
- **Why current is better:** Flipper has been deprecated by Meta in favor of the new React Native DevTools. The document should be updated to recommend Chrome DevTools or the built-in Expo dev tools instead.

---

- **Current approach:** Using `runOnUI` from `react-native-reanimated` (implicit)
- **Document suggests:** `import { runOnUI } from 'react-native-worklets'` (line 157)
- **Why current is better:** Reanimated 4 re-exports worklet functions directly. The modern pattern is `import { runOnUI } from 'react-native-reanimated'`, not from the separate worklets package.

---

- **Document issue (line 119-125):** The `measure` API shown (`import { measure } from 'react-native'`) is not a standard React Native export. Synchronous measurement in Fabric is done via the `measure()` method on refs, not a standalone import. Consider updating this example.

---

- **Document issue (line 249-258):** The `PerformanceObserver` API shown (`import { PerformanceObserver } from 'react-native'`) is not a standard React Native export. Performance monitoring should reference actual APIs like the React DevTools Profiler or Expo's performance monitoring tools.
