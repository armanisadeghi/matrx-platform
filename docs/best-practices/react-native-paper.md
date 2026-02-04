# React Native Paper Best Practices

> Production patterns for Material Design 3 components in React Native applications.

## Overview

React Native Paper is the official Material Design implementation for React Native. Version 5.x implements Material Design 3 (MD3) by default, providing consistent, accessible components across platforms.

## Setup

### Installation

```bash
npx expo install react-native-paper react-native-safe-area-context
```

### Provider Configuration

```tsx
// app/_layout.tsx
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useColorScheme } from 'nativewind';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
  
  return (
    <PaperProvider theme={theme}>
      <Stack />
    </PaperProvider>
  );
}
```

## Theme Customization

### Custom MD3 Theme

```typescript
// constants/paperTheme.ts
import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

const customColors = {
  // Primary
  primary: '#1E3A5F',
  onPrimary: '#FFFFFF',
  primaryContainer: '#D4E4F7',
  onPrimaryContainer: '#001D36',
  
  // Secondary
  secondary: '#525F70',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#D6E3F7',
  onSecondaryContainer: '#0F1D2A',
  
  // Tertiary
  tertiary: '#6A5778',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#F2DAFF',
  onTertiaryContainer: '#251431',
  
  // Error
  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',
  
  // Surface
  surface: '#FAFAFA',
  onSurface: '#1A1C1E',
  surfaceVariant: '#DFE2EB',
  onSurfaceVariant: '#43474E',
  
  // Background
  background: '#FFFFFF',
  onBackground: '#1A1C1E',
  
  // Outline
  outline: '#73777F',
  outlineVariant: '#C3C7CF',
  
  // Inverse
  inverseSurface: '#2F3033',
  inverseOnSurface: '#F1F0F4',
  inversePrimary: '#A5C8FF',
};

const darkCustomColors = {
  primary: '#A5C8FF',
  onPrimary: '#003059',
  primaryContainer: '#1E3A5F',
  onPrimaryContainer: '#D4E4F7',
  
  secondary: '#BAC8DB',
  onSecondary: '#243240',
  secondaryContainer: '#3B4857',
  onSecondaryContainer: '#D6E3F7',
  
  surface: '#121316',
  onSurface: '#E3E2E6',
  surfaceVariant: '#43474E',
  onSurfaceVariant: '#C3C7CF',
  
  background: '#0A0A0B',
  onBackground: '#E3E2E6',
  
  outline: '#8D9199',
  outlineVariant: '#43474E',
};

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...customColors,
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkCustomColors,
  },
};
```

### Accessing Theme in Components

```typescript
import { useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

function MyComponent() {
  const theme = useTheme<MD3Theme>();
  
  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.onSurface }}>
        Themed Content
      </Text>
    </View>
  );
}
```

## React Navigation Integration

### Adapting Themes

```typescript
import { adaptNavigationTheme } from 'react-native-paper';
import { 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
  materialLight: lightTheme,
  materialDark: darkTheme,
});

// Merge themes
export const CombinedLightTheme = {
  ...LightTheme,
  ...lightTheme,
  colors: {
    ...LightTheme.colors,
    ...lightTheme.colors,
  },
};

export const CombinedDarkTheme = {
  ...DarkTheme,
  ...darkTheme,
  colors: {
    ...DarkTheme.colors,
    ...darkTheme.colors,
  },
};
```

### Using Combined Theme

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';

function App() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;
  
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Stack />
      </NavigationContainer>
    </PaperProvider>
  );
}
```

## Component Usage Patterns

### Buttons

```tsx
import { Button } from 'react-native-paper';

// Primary action
<Button mode="contained" onPress={handleSubmit}>
  Submit
</Button>

// Secondary action
<Button mode="outlined" onPress={handleCancel}>
  Cancel
</Button>

// Text action
<Button mode="text" onPress={handleLearnMore}>
  Learn More
</Button>

// With icon
<Button mode="contained" icon="check" onPress={handleConfirm}>
  Confirm
</Button>

// Loading state
<Button mode="contained" loading disabled>
  Processing...
</Button>
```

### Text Input

```tsx
import { TextInput } from 'react-native-paper';

// Outlined (recommended for forms)
<TextInput
  mode="outlined"
  label="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
  error={!!emailError}
/>

// With helper text
<TextInput
  mode="outlined"
  label="Password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  right={<TextInput.Icon icon="eye" />}
/>
<HelperText type="error" visible={!!passwordError}>
  {passwordError}
</HelperText>
```

### Cards

```tsx
import { Card, Text } from 'react-native-paper';

<Card mode="elevated" onPress={handleCardPress}>
  <Card.Cover source={{ uri: imageUrl }} />
  <Card.Content>
    <Text variant="titleLarge">{title}</Text>
    <Text variant="bodyMedium">{description}</Text>
  </Card.Content>
  <Card.Actions>
    <Button onPress={handleCancel}>Cancel</Button>
    <Button mode="contained" onPress={handleOk}>Ok</Button>
  </Card.Actions>
</Card>
```

### Lists

```tsx
import { List, Divider } from 'react-native-paper';

<List.Section>
  <List.Subheader>Settings</List.Subheader>
  <List.Item
    title="Notifications"
    description="Manage notification preferences"
    left={props => <List.Icon {...props} icon="bell" />}
    right={props => <List.Icon {...props} icon="chevron-right" />}
    onPress={handleNotifications}
  />
  <Divider />
  <List.Item
    title="Privacy"
    description="Control your privacy settings"
    left={props => <List.Icon {...props} icon="shield" />}
    onPress={handlePrivacy}
  />
</List.Section>
```

### Dialogs

```tsx
import { Portal, Dialog, Button, Text } from 'react-native-paper';

function ConfirmDialog({ visible, onDismiss, onConfirm, title, message }) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={onConfirm}>Confirm</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
```

### FAB (Floating Action Button)

```tsx
import { FAB, Portal, FAB as FABGroup } from 'react-native-paper';

// Single FAB
<FAB
  icon="plus"
  onPress={handleAdd}
  style={{ position: 'absolute', right: 16, bottom: 16 }}
/>

// FAB Group
<Portal>
  <FABGroup
    open={open}
    visible
    icon={open ? 'close' : 'plus'}
    actions={[
      { icon: 'camera', label: 'Photo', onPress: handlePhoto },
      { icon: 'folder', label: 'File', onPress: handleFile },
    ]}
    onStateChange={({ open }) => setOpen(open)}
  />
</Portal>
```

## Typography

### MD3 Text Variants

```tsx
import { Text } from 'react-native-paper';

<Text variant="displayLarge">Display Large</Text>
<Text variant="displayMedium">Display Medium</Text>
<Text variant="displaySmall">Display Small</Text>

<Text variant="headlineLarge">Headline Large</Text>
<Text variant="headlineMedium">Headline Medium</Text>
<Text variant="headlineSmall">Headline Small</Text>

<Text variant="titleLarge">Title Large</Text>
<Text variant="titleMedium">Title Medium</Text>
<Text variant="titleSmall">Title Small</Text>

<Text variant="bodyLarge">Body Large</Text>
<Text variant="bodyMedium">Body Medium</Text>
<Text variant="bodySmall">Body Small</Text>

<Text variant="labelLarge">Label Large</Text>
<Text variant="labelMedium">Label Medium</Text>
<Text variant="labelSmall">Label Small</Text>
```

## Best Practices

### DO:

1. **Always wrap app with PaperProvider** - Components require theme context
2. **Use theme colors** - Access via `useTheme()`, never hardcode
3. **Use MD3 text variants** - Consistent typography across the app
4. **Wrap dialogs/modals in Portal** - Proper z-index handling
5. **Combine with React Navigation theme** - Prevent inconsistent styling

### DO NOT:

1. **Never mix custom buttons with Paper buttons** - Inconsistent feel
2. **Never skip mode prop** - Always be explicit (`mode="contained"`)
3. **Never hardcode spacing** - Use theme roundness/spacing values
4. **Never override Paper component styles inline** - Extend theme instead

## Customizing Components

### Extending Theme for Component Defaults

```typescript
const theme = {
  ...MD3LightTheme,
  roundness: 12,  // All components use this radius
  colors: {
    ...MD3LightTheme.colors,
    // Custom colors
  },
};
```

### Component-Specific Overrides

```tsx
// Override button ripple
<Button
  mode="contained"
  rippleColor="rgba(255,255,255,0.3)"
  buttonColor={theme.colors.primary}
  textColor={theme.colors.onPrimary}
>
  Custom Button
</Button>
```

## Performance Considerations

1. **Memoize theme objects** - Prevent unnecessary re-renders
2. **Use Portal sparingly** - Each Portal creates a new React root
3. **Lazy load dialogs** - Don't render hidden dialogs
4. **Avoid inline styles** - Theme mutations trigger re-renders

## Resources

- [React Native Paper Documentation](https://callstack.github.io/react-native-paper/)
- [Material Design 3 Guidelines](https://m3.material.io/)
- [Theming Guide](https://callstack.github.io/react-native-paper/docs/guides/theming/)
- [Component API Reference](https://callstack.github.io/react-native-paper/docs/components/ActivityIndicator)
