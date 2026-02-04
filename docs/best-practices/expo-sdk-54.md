# Expo SDK 54 Best Practices

> Production patterns for Expo SDK 54 with React Native 0.81 and the New Architecture.

## Overview

Expo SDK 54 (released September 2025) delivers React Native 0.81 with the New Architecture enabled by default, iOS 26 Liquid Glass support, and dramatically improved iOS build times through precompiled XCFrameworks.

## Critical Configuration

### app.config.ts Structure

Use TypeScript configuration for type safety:

```typescript
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'MyApp',
  slug: 'my-app',
  version: '1.0.0',
  orientation: 'portrait',
  
  // REQUIRED: Enable automatic light/dark mode
  userInterfaceStyle: 'automatic',
  
  // REQUIRED: Enable New Architecture
  newArchEnabled: true,
  
  // Deep linking scheme
  scheme: 'my-app',
  
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.company.myapp',
    infoPlist: {
      UIUserInterfaceStyle: 'Automatic',
    },
  },
  
  android: {
    package: 'com.company.myapp',
    // REQUIRED: Edge-to-edge enabled by default in SDK 54
    edgeToEdgeEnabled: true,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  
  web: {
    bundler: 'metro',
    favicon: './assets/favicon.png',
  },
  
  // Essential plugins
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#ffffff',
        image: './assets/splash-icon.png',
        dark: {
          backgroundColor: '#0A0A0B',
          image: './assets/splash-icon.png',
        },
      },
    ],
    'expo-font',
  ],
  
  experiments: {
    typedRoutes: true,
  },
});
```

## New Architecture (Mandatory)

### SDK 54 is the Last Bridge-Compatible Version

SDK 55+ requires New Architecture exclusively. Migrate now.

### What's Different

1. **TurboModules** replace legacy native modules
2. **Fabric** replaces the old renderer
3. **Bridgeless Mode** eliminates serialization overhead
4. **Hermes** is the default JavaScript engine

### Verifying New Architecture

```typescript
import { TurboModuleRegistry } from 'react-native';

// TurboModules are available when New Architecture is active
const isNewArch = TurboModuleRegistry !== undefined;
```

## iOS Optimizations

### Precompiled XCFrameworks

SDK 54 ships React Native as precompiled binaries, reducing clean build times from ~120s to ~10s on M4 Max.

**Exception**: If your Podfile uses `use_frameworks!`, builds fall back to source compilation.

### iOS 26 Support

- Liquid Glass icons via Icon Composer
- Native tab bars with `expo-router/unstable-native-tabs`
- `expo-glass-effect` for glass view components

## Android Optimizations

### Edge-to-Edge by Default

SDK 54 enables edge-to-edge layouts automatically. Handle system bars:

```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Screen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Content />
    </View>
  );
}
```

### Compile SDK Version

For `expo-liquid-glass-native`, set compile SDK to 36:

```typescript
plugins: [
  [
    'expo-liquid-glass-native',
    {
      android: {
        compileSdkVersion: 36,
      },
    },
  ],
],
```

## Package Installation

Always use `npx expo install` for SDK-compatible versions:

```bash
# Correct - installs SDK 54 compatible version
npx expo install expo-router expo-glass-effect

# Incorrect - may install incompatible version
pnpm add expo-router
```

## Development Workflow

### Starting Development

```bash
# Start Metro bundler
pnpm start

# Platform-specific
pnpm ios      # iOS Simulator
pnpm android  # Android Emulator
pnpm web      # Web browser
```

### Prebuild for Native Code

When using native modules not in Expo Go:

```bash
# Generate native projects
npx expo prebuild

# Clean regeneration
npx expo prebuild --clean
```

### Running Native Builds

```bash
# iOS (requires Xcode)
npx expo run:ios

# Android (requires Android Studio)
npx expo run:android
```

## Reanimated v4 Compatibility

### NativeWind Users: Stay on Reanimated v3

NativeWind 4.x is not fully compatible with Reanimated v4. Keep v3 until NativeWind v5 releases.

### Reanimated v4 Migration

For non-NativeWind projects upgrading:

1. **Install worklets package**:
   ```bash
   npx expo install react-native-worklets
   ```

2. **Update Babel config** (skip if using `babel-preset-expo`):
   ```javascript
   // babel.config.js
   module.exports = {
     presets: ['babel-preset-expo'],
     plugins: ['react-native-worklets/plugin'],  // Last plugin
   };
   ```

3. **Update imports**:
   ```typescript
   // Before (v3)
   import { runOnJS, worklet } from 'react-native-reanimated';
   
   // After (v4)
   import { runOnJS } from 'react-native-worklets';
   ```

## Environment Variables

### Expo-specific Variables

```bash
# .env.local
EXPO_PUBLIC_API_URL=https://api.example.com
```

Access in code:

```typescript
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

**Rule**: Only `EXPO_PUBLIC_*` variables are exposed to the client bundle.

## TypeScript Configuration

### Strict Mode Required

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "extends": "expo/tsconfig.base"
}
```

### Typed Routes

Enable in `app.config.ts`:

```typescript
experiments: {
  typedRoutes: true,
}
```

This generates `expo-router/types` with typed route names.

## Security Considerations

### Never in app.config.ts

- API keys
- Secrets
- Credentials

Use EAS Secrets or environment variables with server-side injection.

### Accessing Config at Runtime

```typescript
import Constants from 'expo-constants';

// Safe - filtered to public fields only
const appName = Constants.expoConfig?.name;
```

## Validation Commands

```bash
# Type checking
pnpm tsc --noEmit

# Linting
pnpm lint

# View public config (verify no secrets)
npx expo config --type public
```

## Resources

- [Expo SDK 54 Changelog](https://expo.dev/changelog/sdk-54)
- [SDK 54 Upgrade Guide](https://expo.dev/blog/expo-sdk-upgrade-guide)
- [New Architecture Guide](https://docs.expo.dev/guides/new-architecture/)
- [app.config.ts Reference](https://docs.expo.dev/versions/v54.0.0/config/app/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
