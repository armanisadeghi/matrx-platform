# Form Handling Patterns

> Production patterns for building accessible, user-friendly forms in React Native.

## Input Component Architecture

### Core Input Component

The Input component manages:
- Visual states (focus, error, disabled)
- Type-specific behavior (password, email, search)
- Icons and actions
- Accessibility

```typescript
interface InputProps extends Omit<TextInputProps, 'style'> {
  variant?: 'default' | 'filled' | 'outlined';
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  disabled?: boolean;
  type?: 'text' | 'password' | 'email' | 'search';
  className?: string;
}
```

## Visual State Management

### Focus State

```typescript
const [isFocused, setIsFocused] = useState(false);

<TextInput
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
  className={isFocused ? 'border-primary' : 'border-border'}
/>
```

### Error State

```typescript
const hasError = !!error;
const borderClass = hasError ? 'border-error' : isFocused ? 'border-primary' : '';
```

### State Priority

1. **Error** - Highest priority, always shows red border
2. **Focus** - Shows primary border when focused
3. **Default** - Standard border color

## Input Types

### Password Input

```typescript
const [showPassword, setShowPassword] = useState(false);
const isPassword = type === 'password';

<TextInput
  secureTextEntry={isPassword && !showPassword}
/>

{isPassword && (
  <Pressable onPress={() => setShowPassword(!showPassword)}>
    <Ionicons name={showPassword ? 'eye-off' : 'eye'} />
  </Pressable>
)}
```

### Email Input

```typescript
<TextInput
  keyboardType="email-address"
  autoCapitalize="none"
  autoComplete="email"
  textContentType="emailAddress"
/>
```

### Search Input

```typescript
<TextInput
  returnKeyType="search"
  autoCapitalize="none"
  autoCorrect={false}
/>
```

### Phone Input

```typescript
<TextInput
  keyboardType="phone-pad"
  autoComplete="tel"
  textContentType="telephoneNumber"
/>
```

## Form Validation

### Inline Validation Pattern

```typescript
interface FormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

function LoginForm() {
  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (field: keyof FormState, value: string): string | undefined => {
    switch (field) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email';
        break;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        break;
    }
    return undefined;
  };

  const handleChange = (field: keyof FormState) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors(prev => ({ ...prev, [field]: validate(field, value) }));
    }
  };

  const handleBlur = (field: keyof FormState) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({ ...prev, [field]: validate(field, form[field]) }));
  };

  return (
    <>
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChangeText={handleChange('email')}
        onBlur={handleBlur('email')}
        error={touched.email ? errors.email : undefined}
      />
      <Input
        label="Password"
        type="password"
        value={form.password}
        onChangeText={handleChange('password')}
        onBlur={handleBlur('password')}
        error={touched.password ? errors.password : undefined}
      />
    </>
  );
}
```

### Validation on Submit

```typescript
const validateAll = (): boolean => {
  const newErrors: FormErrors = {};
  let isValid = true;

  (Object.keys(form) as Array<keyof FormState>).forEach(field => {
    const error = validate(field, form[field]);
    if (error) {
      newErrors[field] = error;
      isValid = false;
    }
  });

  setErrors(newErrors);
  setTouched(Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
  
  return isValid;
};

const handleSubmit = () => {
  if (validateAll()) {
    // Submit form
  }
};
```

## Keyboard Handling

### Keyboard Avoiding

```typescript
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  className="flex-1"
>
  <ScrollView keyboardShouldPersistTaps="handled">
    <FormContent />
  </ScrollView>
</KeyboardAvoidingView>
```

### Keyboard Dismissal

```typescript
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  <View className="flex-1">
    <FormContent />
  </View>
</TouchableWithoutFeedback>
```

### Next Field Focus

```typescript
const emailRef = useRef<TextInput>(null);
const passwordRef = useRef<TextInput>(null);

<Input
  ref={emailRef}
  returnKeyType="next"
  onSubmitEditing={() => passwordRef.current?.focus()}
  blurOnSubmit={false}
/>
<Input
  ref={passwordRef}
  returnKeyType="done"
  onSubmitEditing={handleSubmit}
/>
```

## TextArea Component

```typescript
export function TextArea({
  numberOfLines = 4,
  ...props
}: InputProps & { numberOfLines?: number }) {
  return (
    <Input
      {...props}
      multiline
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      inputClassName="min-h-[100px] py-2"
    />
  );
}
```

## Toggle/Switch Input

```typescript
interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ value, onValueChange, label, disabled }: ToggleProps) {
  const { colors } = useTheme();
  
  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      className="flex-row items-center justify-between py-3"
      disabled={disabled}
    >
      {label && <Text className="flex-1">{label}</Text>}
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: colors.border.DEFAULT,
          true: colors.primary.DEFAULT,
        }}
        thumbColor={colors.surface.DEFAULT}
      />
    </Pressable>
  );
}
```

## Select/Picker Input

### Using Modal Picker

```typescript
interface SelectProps {
  value: string;
  options: Array<{ value: string; label: string }>;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function Select({ value, options, onValueChange, label, placeholder }: SelectProps) {
  const [modalVisible, setModalVisible] = useState(false);
  
  const selectedOption = options.find(opt => opt.value === value);
  
  return (
    <>
      <Pressable onPress={() => setModalVisible(true)}>
        <View className="flex-row items-center justify-between border border-border rounded-xl px-3 py-2.5">
          <Text className={selectedOption ? 'text-foreground' : 'text-foreground-muted'}>
            {selectedOption?.label || placeholder || 'Select...'}
          </Text>
          <Ionicons name="chevron-down" size={20} />
        </View>
      </Pressable>
      
      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable className="flex-1" onPress={() => setModalVisible(false)}>
          <View className="mt-auto bg-surface rounded-t-3xl">
            {options.map(option => (
              <Pressable
                key={option.value}
                onPress={() => {
                  onValueChange(option.value);
                  setModalVisible(false);
                }}
                className="px-4 py-3 border-b border-border"
              >
                <Text className={option.value === value ? 'text-primary font-semibold' : ''}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
```

## Accessibility

### Input Labels

```typescript
<View>
  <Text nativeID="email-label">Email</Text>
  <TextInput
    accessibilityLabelledBy="email-label"
    accessibilityHint="Enter your email address"
  />
</View>
```

### Error Announcements

```typescript
<TextInput
  accessibilityInvalid={!!error}
  accessibilityErrorMessage={error}
/>
{error && (
  <Text
    accessibilityRole="alert"
    accessibilityLiveRegion="polite"
  >
    {error}
  </Text>
)}
```

### Required Fields

```typescript
<Text>
  {label}
  {required && <Text className="text-error"> *</Text>}
</Text>
<TextInput
  accessibilityLabel={`${label}${required ? ', required' : ''}`}
/>
```

## Loading States

### Submit Button Loading

```typescript
const [isSubmitting, setIsSubmitting] = useState(false);

<Button
  loading={isSubmitting}
  disabled={isSubmitting || !isFormValid}
  onPress={handleSubmit}
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</Button>
```

### Form Overlay Loading

```typescript
{isSubmitting && (
  <View className="absolute inset-0 bg-background/50 items-center justify-center">
    <Spinner size="lg" />
  </View>
)}
```

## Form Layout Patterns

### Standard Form Layout

```tsx
<HeaderLayout header={{ title: 'Create Account' }}>
  <View className="px-4 py-6 gap-4">
    <Input label="Full Name" />
    <Input label="Email" type="email" />
    <Input label="Password" type="password" />
    <Input label="Confirm Password" type="password" />
    
    <View className="mt-4">
      <Button fullWidth onPress={handleSubmit}>
        Create Account
      </Button>
    </View>
  </View>
</HeaderLayout>
```

### Inline Form (Search)

```tsx
<View className="flex-row items-center gap-2 px-4 py-2">
  <Input
    type="search"
    placeholder="Search..."
    className="flex-1"
  />
  <Button size="sm" variant="ghost">
    Cancel
  </Button>
</View>
```

## Critical Rules

1. **Always show validation on blur first** - Don't validate on every keystroke initially
2. **Always provide error messages** - Never just highlight red without explaining
3. **Always handle keyboard** - Use KeyboardAvoidingView and proper dismissal
4. **Always support autofill** - Set textContentType and autoComplete
5. **Always focus management** - Enable tab/next navigation between fields
6. **Always test accessibility** - Screen readers must be able to navigate forms

## Resources

- [React Native TextInput](https://reactnative.dev/docs/textinput)
- [iOS Human Interface Guidelines - Text Fields](https://developer.apple.com/design/human-interface-guidelines/text-fields)
- [Material Design Text Fields](https://m3.material.io/components/text-fields)
- [WCAG Form Accessibility](https://www.w3.org/WAI/tutorials/forms/)
