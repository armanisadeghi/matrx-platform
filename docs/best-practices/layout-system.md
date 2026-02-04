# Layout System Patterns

> Production patterns for the layout hierarchy in React Native applications.

## Layout Hierarchy

The layout system follows a strict hierarchy:

```
ScreenLayout (Foundation)
    └── HeaderLayout (Header + Content)
        └── ModalLayout (Sheet/Dialog presentations)
```

All screens MUST use one of these layouts. No screen should render without a layout wrapper.

## ScreenLayout - The Foundation

### Purpose

`ScreenLayout` is the base wrapper for ALL screens. It handles:
- Safe area insets
- Status bar configuration
- Background theming
- Edge-to-edge support

### Implementation

```typescript
interface ScreenLayoutProps {
  children: React.ReactNode;
  safeAreaEdges?: Array<'top' | 'bottom' | 'left' | 'right'>;
  background?: 'background' | 'secondary' | 'tertiary' | 'surface' | 'transparent';
  edgeToEdge?: boolean;
  className?: string;
  style?: ViewStyle;
  testID?: string;
}

export function ScreenLayout({
  children,
  safeAreaEdges = ['top', 'bottom'],
  background = 'background',
  edgeToEdge = true,
  className = '',
  style,
  testID,
}: ScreenLayoutProps) {
  const { isDark } = useAppColorScheme();
  const insets = useSafeAreaInsets();

  const safeAreaStyle = {
    paddingTop: safeAreaEdges.includes('top') ? insets.top : 0,
    paddingBottom: safeAreaEdges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: safeAreaEdges.includes('left') ? insets.left : 0,
    paddingRight: safeAreaEdges.includes('right') ? insets.right : 0,
  };

  return (
    <View className={`flex-1 bg-${background} ${className}`} style={[safeAreaStyle, style]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {children}
    </View>
  );
}
```

### Usage

```tsx
// Basic screen
<ScreenLayout>
  <Text>Screen content</Text>
</ScreenLayout>

// Custom safe areas
<ScreenLayout safeAreaEdges={['top']}>
  <Text>Only top safe area</Text>
</ScreenLayout>

// Different background
<ScreenLayout background="surface">
  <Text>Surface background</Text>
</ScreenLayout>
```

## HeaderLayout - Header + Content

### Purpose

`HeaderLayout` extends `ScreenLayout` with:
- Configurable header (title, back button, actions)
- Scrollable or fixed content area
- Keyboard avoiding behavior

### Implementation

```typescript
interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  transparent?: boolean;
  large?: boolean;
}

interface HeaderLayoutProps extends Omit<ScreenLayoutProps, 'safeAreaEdges'> {
  header?: HeaderProps;
  scrollable?: boolean;
  bounces?: boolean;
  keyboardDismissMode?: 'none' | 'on-drag' | 'interactive';
  safeAreaEdges?: Array<'bottom' | 'left' | 'right'>;
}
```

### Usage

```tsx
// Basic header
<HeaderLayout header={{ title: 'Settings' }}>
  <SettingsContent />
</HeaderLayout>

// With back button
<HeaderLayout
  header={{
    title: 'Profile',
    showBackButton: true,
  }}
>
  <ProfileContent />
</HeaderLayout>

// With actions
<HeaderLayout
  header={{
    title: 'Messages',
    rightContent: (
      <IconButton icon="add" onPress={handleNewMessage} />
    ),
  }}
>
  <MessageList />
</HeaderLayout>

// Non-scrollable
<HeaderLayout
  header={{ title: 'Dashboard' }}
  scrollable={false}
>
  <DashboardGrid />
</HeaderLayout>
```

## Header Component

### Purpose

The `Header` component renders the navigation header with:
- Back button (optional)
- Title and subtitle
- Custom left/right content
- Glass effect support on iOS 26+

### Implementation

```typescript
interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  transparent?: boolean;
  large?: boolean;
}

export function Header({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  leftContent,
  rightContent,
  transparent = false,
  large = false,
}: HeaderProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View
      className={`px-4 pb-2 ${transparent ? '' : 'bg-surface border-b border-border'}`}
      style={{ paddingTop: insets.top + 8 }}
    >
      <View className="flex-row items-center justify-between">
        {/* Left side */}
        <View className="flex-row items-center flex-1">
          {showBackButton && (
            <IconButton
              icon="chevron-back"
              onPress={handleBack}
              variant="ghost"
              className="mr-2"
            />
          )}
          {leftContent}
        </View>

        {/* Center title */}
        {title && !large && (
          <View className="absolute left-0 right-0 items-center pointer-events-none">
            <Text variant="h6" numberOfLines={1}>{title}</Text>
            {subtitle && (
              <Text variant="caption" color="muted">{subtitle}</Text>
            )}
          </View>
        )}

        {/* Right side */}
        <View className="flex-row items-center justify-end flex-1">
          {rightContent}
        </View>
      </View>

      {/* Large title */}
      {title && large && (
        <View className="mt-4">
          <Text variant="h2">{title}</Text>
          {subtitle && (
            <Text variant="body" color="secondary" className="mt-1">
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
```

## ModalLayout - Sheet/Dialog Presentations

### Purpose

`ModalLayout` handles modal presentations:
- Bottom sheet style on iOS
- Dialog style on Android
- Backdrop handling
- Dismiss gestures

### Implementation

```typescript
interface ModalLayoutProps {
  children: React.ReactNode;
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  variant?: 'sheet' | 'dialog' | 'fullscreen';
  showHandle?: boolean;
  dismissible?: boolean;
}

export function ModalLayout({
  children,
  visible,
  onDismiss,
  title,
  variant = 'sheet',
  showHandle = true,
  dismissible = true,
}: ModalLayoutProps) {
  const insets = useSafeAreaInsets();

  if (variant === 'fullscreen') {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
        <ScreenLayout>
          <Header
            title={title}
            rightContent={
              <IconButton icon="close" onPress={onDismiss} />
            }
          />
          {children}
        </ScreenLayout>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={dismissible ? onDismiss : undefined}
    >
      <Pressable
        className="flex-1 bg-black/50"
        onPress={dismissible ? onDismiss : undefined}
      >
        <Pressable
          className={`
            mt-auto bg-surface
            ${variant === 'sheet' ? 'rounded-t-3xl' : 'mx-4 mb-4 rounded-3xl'}
          `}
          style={{ paddingBottom: insets.bottom || 16 }}
          onPress={e => e.stopPropagation()}
        >
          {showHandle && variant === 'sheet' && (
            <View className="items-center pt-3 pb-2">
              <View className="w-10 h-1 bg-border rounded-full" />
            </View>
          )}

          {title && (
            <View className="px-4 py-3 border-b border-border">
              <Text variant="h5" className="text-center">{title}</Text>
            </View>
          )}

          <View className="px-4 py-4">{children}</View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
```

### Usage

```tsx
// Bottom sheet
<ModalLayout
  visible={sheetVisible}
  onDismiss={() => setSheetVisible(false)}
  title="Options"
>
  <OptionsList />
</ModalLayout>

// Dialog
<ModalLayout
  visible={dialogVisible}
  onDismiss={() => setDialogVisible(false)}
  variant="dialog"
  title="Confirm Action"
>
  <Text>Are you sure you want to continue?</Text>
  <View className="flex-row gap-2 mt-4">
    <Button variant="ghost" onPress={() => setDialogVisible(false)}>
      Cancel
    </Button>
    <Button onPress={handleConfirm}>Confirm</Button>
  </View>
</ModalLayout>

// Fullscreen
<ModalLayout
  visible={fullscreenVisible}
  onDismiss={() => setFullscreenVisible(false)}
  variant="fullscreen"
  title="New Item"
>
  <CreateItemForm />
</ModalLayout>
```

## Safe Area Rules by Layout

| Layout | Top | Bottom | Left | Right |
|--------|-----|--------|------|-------|
| ScreenLayout | ✅ (default) | ✅ (default) | ❌ | ❌ |
| HeaderLayout | Header handles | ✅ (default) | ❌ | ❌ |
| ModalLayout (sheet) | Handle | ✅ | ❌ | ❌ |
| ModalLayout (fullscreen) | Header handles | ✅ | ❌ | ❌ |
| Native Tabs | Screen handles | Tab bar handles | ❌ | ❌ |

## Tab Screen Layout

When using native tabs, the tab bar handles bottom safe area:

```tsx
// In tab screen - NO bottom safe area needed
<ScreenLayout safeAreaEdges={['top']}>
  <TabContent />
</ScreenLayout>

// Or with header
<HeaderLayout
  header={{ title: 'Home' }}
  safeAreaEdges={[]}  // Tab bar handles bottom
>
  <HomeContent />
</HeaderLayout>
```

## Keyboard Handling

`HeaderLayout` includes keyboard avoidance:

```typescript
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  className="flex-1"
>
  {scrollable ? (
    <ScrollView keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    children
  )}
</KeyboardAvoidingView>
```

## Content Spacing

### Standard Screen Padding

```tsx
<HeaderLayout header={{ title: 'Settings' }}>
  <View className="px-4 py-4 gap-4">
    {/* Content with consistent padding */}
  </View>
</HeaderLayout>
```

### Section Spacing

```tsx
<View className="gap-6">
  <Section title="Account">
    <SettingsList />
  </Section>
  
  <Section title="Preferences">
    <PreferencesList />
  </Section>
</View>
```

## Critical Rules

1. **Every screen MUST use a layout** - No bare View wrappers
2. **Never duplicate safe area handling** - Let layouts handle it
3. **Use HeaderLayout for scrollable content** - It includes KeyboardAvoidingView
4. **Use ScreenLayout for custom layouts** - When HeaderLayout doesn't fit
5. **Tab screens skip bottom safe area** - Native tabs handle it
6. **Modals handle their own safe areas** - Don't pass from parent

## Resources

- [React Native Safe Areas](https://reactnative.dev/docs/safeareaview)
- [iOS Human Interface Guidelines - Navigation](https://developer.apple.com/design/human-interface-guidelines/navigation)
- [Material Design Navigation](https://m3.material.io/foundations/layout/understanding-layout)
