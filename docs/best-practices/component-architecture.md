# Component Architecture Patterns

> Production patterns for building consistent, composable, and maintainable React Native components.

## Core Principles

1. **Single Responsibility** - Each component does one thing well
2. **Composition over Inheritance** - Build complex UIs from simple pieces
3. **Consistent API** - All components follow the same prop patterns
4. **Type Safety** - Full TypeScript with no `any` types
5. **Documentation** - JSDoc comments for every exported component

## Component File Structure

### Standard Component

```
components/
  ui/
    Button/
      Button.tsx          # Main implementation
      Button.ios.tsx      # iOS-specific (optional)
      Button.android.tsx  # Android-specific (optional)
      Button.web.tsx      # Web-specific (optional)
      index.ts            # Barrel export
      types.ts            # Shared types (optional)
```

### When to Split Platform Files

Split into platform files when:
- Native API differences require different implementations
- Platform design systems diverge significantly (Liquid Glass vs M3)
- Performance optimizations are platform-specific

Keep in single file when:
- Only styling differs (use NativeWind classes with Platform.select)
- Differences are minor (conditional imports or small branches)

## Variant Pattern

### Defining Variants

```typescript
/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';

/**
 * Button size types
 */
export type ButtonSize = 'sm' | 'md' | 'lg';
```

### Variant Style Maps

```typescript
/**
 * Variant styles using NativeWind classes
 */
const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary',
    text: 'text-white',
  },
  secondary: {
    container: 'bg-secondary',
    text: 'text-white',
  },
  ghost: {
    container: 'bg-transparent',
    text: 'text-primary',
  },
  destructive: {
    container: 'bg-error',
    text: 'text-white',
  },
  outline: {
    container: 'bg-transparent border border-border',
    text: 'text-foreground',
  },
};

const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  sm: { container: 'px-3 py-1.5 rounded-lg', text: 'text-sm' },
  md: { container: 'px-4 py-2.5 rounded-xl', text: 'text-base' },
  lg: { container: 'px-6 py-3 rounded-xl', text: 'text-lg' },
};
```

### Usage in Component

```tsx
export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  
  return (
    <Pressable
      className={`${sizeStyle.container} ${variantStyle.container} ${className}`}
      {...props}
    >
      <Text className={`${variantStyle.text} ${sizeStyle.text}`}>
        {children}
      </Text>
    </Pressable>
  );
}
```

## Props Interface Pattern

### Standard Props Structure

```typescript
export interface ButtonProps {
  /**
   * Button content
   */
  children: React.ReactNode;

  /**
   * Visual variant
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Size variant
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Press handler
   */
  onPress?: () => void;

  /**
   * Additional NativeWind classes
   */
  className?: string;

  /**
   * Test ID for testing
   */
  testID?: string;
}
```

### Required Props

- `children` or `title` - Content to render
- `onPress` - For interactive components

### Always Optional with Defaults

- `variant` - Always has a default
- `size` - Always has a default  
- `disabled` - Defaults to `false`
- `className` - Defaults to empty string `''`

## className Forwarding

**Every component MUST accept a `className` prop for composition:**

```typescript
interface ComponentProps {
  className?: string;
}

function Component({ className = '', ...props }: ComponentProps) {
  return (
    <View className={`base-classes ${className}`}>
      {/* content */}
    </View>
  );
}
```

### Why This Matters

```tsx
// Consumer can extend styling without modifying component
<Button className="mt-4 w-full">Submit</Button>
<Card className="border-2 border-primary">Featured</Card>
```

## Compound Components

### Pattern Definition

Compound components share implicit state through context or direct composition.

```typescript
// Card with compound children
export function Card({ children, ...props }: CardProps) {
  return <View {...props}>{children}</View>;
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <View className={`mb-3 ${className}`}>{children}</View>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <View className={className}>{children}</View>;
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={`mt-4 flex-row items-center justify-end gap-2 ${className}`}>
      {children}
    </View>
  );
}
```

### Usage

```tsx
<Card>
  <CardHeader>
    <Text variant="h4">Title</Text>
  </CardHeader>
  <CardContent>
    <Text>Card content goes here</Text>
  </CardContent>
  <CardFooter>
    <Button variant="ghost">Cancel</Button>
    <Button>Confirm</Button>
  </CardFooter>
</Card>
```

## JSDoc Documentation

**Every exported component MUST have JSDoc:**

```typescript
/**
 * Button component
 *
 * Styled button with variant support and platform adaptations.
 * Uses NativeWind for styling.
 *
 * @example
 * ```tsx
 * <Button onPress={handlePress}>Click me</Button>
 * <Button variant="secondary" size="sm">Small button</Button>
 * <Button variant="destructive" loading>Deleting...</Button>
 * ```
 */
export function Button({ ... }: ButtonProps) { ... }
```

### Required JSDoc Elements

1. **Description** - What the component does
2. **@example** - At least one usage example
3. **@param** - Only for non-obvious props (optional)

## State Management in Components

### Internal State Pattern

```typescript
export function Input({ error, ...props }: InputProps) {
  // Internal UI state
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Derived state
  const hasError = !!error;
  const borderClass = hasError ? 'border-error' : isFocused ? 'border-primary' : '';

  return (
    <TextInput
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={borderClass}
      {...props}
    />
  );
}
```

### Rules

1. **Minimal internal state** - Only for UI concerns (focus, hover, animations)
2. **Controlled by default** - Value/onChange pattern for form inputs
3. **Derived state over useState** - Calculate from props when possible

## Accessibility

### Required Accessibility Props

```typescript
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel={label || children}
  accessibilityState={{ disabled }}
  accessibilityHint={hint}
  onPress={onPress}
>
  {children}
</Pressable>
```

### Touch Targets

```typescript
// Minimum 44pt on iOS, 48dp on Android
const minTouchTarget = Platform.select({ ios: 44, android: 48, default: 44 });

<Pressable
  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
  style={{ minHeight: minTouchTarget, minWidth: minTouchTarget }}
/>
```

## Export Pattern

### index.ts Barrel Export

```typescript
// components/ui/index.ts
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './Button';
export { Card, CardHeader, CardContent, CardFooter, type CardProps } from './Card';
export { Input, TextArea, type InputProps } from './Input';
export { Text, type TextProps, type TextVariant, type TextColor } from './Text';
```

### Root Barrel

```typescript
// components/index.ts
export * from './glass';
export * from './layouts';
export * from './ui';
```

## Testing Pattern

### Component Test Structure

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button testID="button" onPress={onPress}>Press</Button>
    );
    fireEvent.press(getByTestId('button'));
    expect(onPress).toHaveBeenCalled();
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button testID="button" onPress={onPress} disabled>Press</Button>
    );
    fireEvent.press(getByTestId('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
```

## Critical Rules

1. **Never use inline styles for colors** - Always NativeWind classes
2. **Always forward className** - Enables composition
3. **Always provide defaults** - No undefined variant states
4. **Always use JSDoc** - Documentation is mandatory
5. **Always type props** - Full TypeScript, no `any`
6. **Always test accessibility** - Use testID and accessibility props

## Resources

- [React Native Component Patterns](https://reactnative.dev/docs/components-and-apis)
- [Compound Components in React](https://kentcdodds.com/blog/compound-components-with-react-hooks)
- [NativeWind Component Styling](https://www.nativewind.dev/)
