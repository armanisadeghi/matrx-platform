# Icons and Vector Graphics

> Production patterns for icons in React Native with @expo/vector-icons.

## Primary Icon Library

Use `@expo/vector-icons` which bundles popular icon sets:

```bash
# Already included with Expo - no installation needed
```

## Recommended Icon Sets

### Ionicons (Primary)

Use Ionicons as the primary icon set - it has consistent iOS and Android variants:

```typescript
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="home" size={24} color="#1E3A5F" />
```

### Other Available Sets

```typescript
import { 
  MaterialIcons,         // Material Design icons
  MaterialCommunityIcons, // Extended Material icons
  FontAwesome,           // FontAwesome 4
  FontAwesome5,          // FontAwesome 5
  Feather,               // Feather icons
  AntDesign,             // Ant Design icons
} from '@expo/vector-icons';
```

## Type-Safe Icon Names

### Creating Icon Props

```typescript
import { Ionicons } from '@expo/vector-icons';

type IconName = keyof typeof Ionicons.glyphMap;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

function Icon({ name, size = 24, color }: IconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}
```

### Using in Components

```typescript
interface ButtonProps {
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
}

export function Button({ leftIcon, rightIcon, children }: ButtonProps) {
  const { colors } = useTheme();
  
  return (
    <Pressable>
      {leftIcon && (
        <Ionicons name={leftIcon} size={20} color={colors.foreground.DEFAULT} />
      )}
      <Text>{children}</Text>
      {rightIcon && (
        <Ionicons name={rightIcon} size={20} color={colors.foreground.DEFAULT} />
      )}
    </Pressable>
  );
}
```

## Tab Bar Icons

### With Regular Tabs

```typescript
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

<Tabs.Screen
  name="home"
  options={{
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="home" size={size} color={color} />
    ),
  }}
/>
```

### With Native Tabs (iOS 26+)

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

<NativeTabs.Trigger name="home">
  <NativeTabs.Trigger.Icon 
    sf={{ default: 'house', selected: 'house.fill' }}  // SF Symbols
    md="home"  // Material Symbols
  />
  <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
</NativeTabs.Trigger>
```

### SF Symbols (iOS) vs Material Symbols (Android)

| Action | SF Symbol | Material Symbol |
|--------|-----------|-----------------|
| Home | `house` / `house.fill` | `home` |
| Search | `magnifyingglass` | `search` |
| Settings | `gear` | `settings` |
| Profile | `person` / `person.fill` | `person` |
| Notifications | `bell` / `bell.fill` | `notifications` |
| Add | `plus` | `add` |
| Close | `xmark` | `close` |
| Back | `chevron.left` | `arrow_back` |
| Menu | `line.3.horizontal` | `menu` |

## Icon Sizing Standards

### Size Scale

| Name | Size | Use Case |
|------|------|----------|
| xs | 12 | Inline with small text |
| sm | 16 | Inline with body text |
| md | 20 | Button icons |
| lg | 24 | Tab bar, navigation |
| xl | 32 | Feature icons |
| 2xl | 48 | Empty states |
| 3xl | 64 | Hero illustrations |

### Implementation

```typescript
const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

type IconSize = keyof typeof iconSizes;

interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: IconSize;
  color?: string;
}

function Icon({ name, size = 'lg', color }: IconProps) {
  return <Ionicons name={name} size={iconSizes[size]} color={color} />;
}
```

## Icon Color Theming

### Using Theme Colors

```typescript
import { useTheme } from '@/hooks/useTheme';

function ThemedIcon({ name }: { name: keyof typeof Ionicons.glyphMap }) {
  const { colors } = useTheme();
  
  return (
    <Ionicons 
      name={name} 
      size={24} 
      color={colors.foreground.DEFAULT}  // Uses theme color
    />
  );
}
```

### Semantic Icon Colors

```typescript
type IconSemantic = 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error';

function SemanticIcon({ 
  name, 
  semantic = 'default' 
}: { 
  name: keyof typeof Ionicons.glyphMap;
  semantic?: IconSemantic;
}) {
  const { colors } = useTheme();
  
  const colorMap: Record<IconSemantic, string> = {
    default: colors.foreground.DEFAULT,
    muted: colors.foreground.muted,
    primary: colors.primary.DEFAULT,
    success: colors.success.DEFAULT,
    warning: colors.warning.DEFAULT,
    error: colors.error.DEFAULT,
  };
  
  return <Ionicons name={name} size={24} color={colorMap[semantic]} />;
}
```

## Icon Button Component

```typescript
import { Pressable, type PressableProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

interface IconButtonProps extends Omit<PressableProps, 'children'> {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  variant?: 'default' | 'ghost' | 'outline';
}

export function IconButton({
  icon,
  size = 24,
  color,
  variant = 'default',
  disabled,
  ...props
}: IconButtonProps) {
  const { colors } = useTheme();
  const resolvedColor = color || colors.foreground.DEFAULT;
  
  const variantClasses = {
    default: 'bg-surface-elevated',
    ghost: 'bg-transparent',
    outline: 'bg-transparent border border-border',
  };
  
  return (
    <Pressable
      className={`
        rounded-full p-2 items-center justify-center
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50' : ''}
      `}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      {...props}
    >
      <Ionicons name={icon} size={size} color={resolvedColor} />
    </Pressable>
  );
}
```

## Custom SVG Icons

### When to Use Custom SVGs

- Brand icons not in icon libraries
- Complex illustrations
- Animated icons

### Using react-native-svg

```bash
npx expo install react-native-svg
```

```typescript
import Svg, { Path } from 'react-native-svg';

interface CustomIconProps {
  size?: number;
  color?: string;
}

export function CustomIcon({ size = 24, color = '#000' }: CustomIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L2 7l10 5 10-5-10-5z"
        fill={color}
      />
    </Svg>
  );
}
```

## Animated Icons

### With Reanimated

```typescript
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

function AnimatedHeartIcon({ filled }: { filled: boolean }) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePress = () => {
    scale.value = withSpring(1.2, {}, () => {
      scale.value = withSpring(1);
    });
  };
  
  return (
    <Pressable onPress={handlePress}>
      <AnimatedIonicons
        name={filled ? 'heart' : 'heart-outline'}
        size={24}
        color={filled ? '#EF4444' : '#6B7280'}
        style={animatedStyle}
      />
    </Pressable>
  );
}
```

## Accessibility

### Icon-Only Buttons

Always provide accessibility label for icon-only buttons:

```typescript
<Pressable
  onPress={handleClose}
  accessible={true}
  accessibilityLabel="Close"
  accessibilityRole="button"
>
  <Ionicons name="close" size={24} />
</Pressable>
```

### Decorative Icons

Mark decorative icons as not accessible:

```typescript
<View accessibilityElementsHidden={true}>
  <Ionicons name="checkmark" size={16} color="#22C55E" />
</View>
```

## Performance

### Preloading Icons

Icons are loaded on first use. For critical icons, preload:

```typescript
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });
  
  if (!fontsLoaded) {
    return <SplashScreen />;
  }
  
  return <MainApp />;
}
```

### Avoid

1. **Don't use images for icons** - Vector icons scale better
2. **Don't mix icon libraries** - Stick to Ionicons for consistency
3. **Don't use arbitrary sizes** - Follow the size scale

## Resources

- [@expo/vector-icons](https://docs.expo.dev/guides/icons/)
- [Ionicons](https://ionic.io/ionicons)
- [SF Symbols](https://developer.apple.com/sf-symbols/)
- [Material Symbols](https://fonts.google.com/icons)
- [react-native-svg](https://github.com/software-mansion/react-native-svg)
