# TypeScript Patterns for React Native

> Production TypeScript patterns for type-safe React Native applications.

## Configuration

### tsconfig.json

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "exactOptionalPropertyTypes": true,
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ESNext",
    "lib": ["ESNext"],
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### Strict Mode is Mandatory

Never disable these flags:
- `strict: true`
- `noUncheckedIndexedAccess: true`

## Component Patterns

### Functional Component with Props

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onPress,
  className,
}: ButtonProps) {
  // Implementation
}
```

### Generic Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

export function List<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = 'No items',
}: ListProps<T>) {
  if (items.length === 0) {
    return <Text>{emptyMessage}</Text>;
  }
  
  return (
    <View>
      {items.map((item, index) => (
        <View key={keyExtractor(item)}>
          {renderItem(item, index)}
        </View>
      ))}
    </View>
  );
}

// Usage
<List
  items={users}
  renderItem={(user) => <UserCard user={user} />}
  keyExtractor={(user) => user.id}
/>
```

### Polymorphic Components

```typescript
type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

interface TextProps {
  variant?: 'body' | 'heading' | 'caption';
}

export function Text<C extends React.ElementType = typeof RNText>({
  as,
  variant = 'body',
  children,
  ...props
}: PolymorphicComponentProps<C, TextProps>) {
  const Component = as || RNText;
  return <Component {...props}>{children}</Component>;
}
```

## Hook Patterns

### Custom Hook with Return Type

```typescript
interface UseToggleReturn {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
}

export function useToggle(initialValue = false): UseToggleReturn {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return { value, toggle, setTrue, setFalse };
}
```

### Hook with Generic State

```typescript
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const nextValue = value instanceof Function ? value(prev) : value;
      localStorage.setItem(key, JSON.stringify(nextValue));
      return nextValue;
    });
  }, [key]);
  
  return [storedValue, setValue];
}
```

## Type Utilities

### Extracting Props

```typescript
// Extract props from a component
type ButtonProps = React.ComponentProps<typeof Button>;

// Extract props excluding specific keys
type CustomButtonProps = Omit<ButtonProps, 'variant'> & {
  customVariant: 'special' | 'unique';
};
```

### Discriminated Unions

```typescript
type LoadingState = { status: 'loading' };
type SuccessState<T> = { status: 'success'; data: T };
type ErrorState = { status: 'error'; error: Error };

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function renderState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'loading':
      return <Spinner />;
    case 'success':
      return <DataView data={state.data} />;  // TypeScript knows data exists
    case 'error':
      return <ErrorView error={state.error} />;  // TypeScript knows error exists
  }
}
```

### Branded Types

```typescript
// Prevent mixing up similar types
type UserId = string & { readonly brand: unique symbol };
type PostId = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function createPostId(id: string): PostId {
  return id as PostId;
}

function fetchUser(userId: UserId) {
  // ...
}

const userId = createUserId('123');
const postId = createPostId('456');

fetchUser(userId);  // ✅ OK
fetchUser(postId);  // ❌ Type error
```

## Navigation Types

### Expo Router Typed Routes

```typescript
// With typedRoutes: true in app.config.ts
import { router, Href } from 'expo-router';

// Type-safe navigation
router.push('/user/123' as Href);

// With params
router.push({
  pathname: '/user/[id]',
  params: { id: '123' },
});
```

### Route Params

```typescript
import { useLocalSearchParams } from 'expo-router';

// Define param types
type UserRouteParams = {
  id: string;
  tab?: 'posts' | 'followers' | 'following';
};

function UserScreen() {
  const { id, tab = 'posts' } = useLocalSearchParams<UserRouteParams>();
  
  return <UserProfile userId={id} initialTab={tab} />;
}
```

## API Response Types

### Response Wrapper

```typescript
interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    requestId: string;
  };
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

async function fetchUsers(): Promise<PaginatedResponse<User>> {
  const response = await fetch('/api/users');
  return response.json();
}
```

### Type Guards

```typescript
interface User {
  type: 'user';
  id: string;
  email: string;
}

interface Admin extends User {
  type: 'admin';
  permissions: string[];
}

function isAdmin(user: User | Admin): user is Admin {
  return user.type === 'admin';
}

function renderUser(user: User | Admin) {
  if (isAdmin(user)) {
    return <AdminDashboard permissions={user.permissions} />;
  }
  return <UserProfile user={user} />;
}
```

## Context Patterns

### Typed Context

```typescript
interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Context with Reducer

```typescript
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: Error }
  | { type: 'LOGOUT' };

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, isLoading: false, user: action.payload };
    case 'LOGIN_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
}
```

## Style Types

### StyleSheet with TypeScript

```typescript
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  image: ImageStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
  },
});
```

### Dynamic Styles

```typescript
function getButtonStyles(variant: 'primary' | 'secondary'): ViewStyle {
  const base: ViewStyle = {
    padding: 16,
    borderRadius: 8,
  };
  
  const variants: Record<typeof variant, ViewStyle> = {
    primary: { backgroundColor: '#1E3A5F' },
    secondary: { backgroundColor: '#E5E7EB' },
  };
  
  return { ...base, ...variants[variant] };
}
```

## Utility Functions

### Type-Safe Event Handlers

```typescript
type InputChangeHandler = (text: string) => void;
type PressHandler = () => void;

interface FormHandlers {
  onEmailChange: InputChangeHandler;
  onPasswordChange: InputChangeHandler;
  onSubmit: PressHandler;
}

function useFormHandlers(): FormHandlers {
  const onEmailChange: InputChangeHandler = useCallback((text) => {
    // Handle email change
  }, []);
  
  const onPasswordChange: InputChangeHandler = useCallback((text) => {
    // Handle password change
  }, []);
  
  const onSubmit: PressHandler = useCallback(() => {
    // Handle submit
  }, []);
  
  return { onEmailChange, onPasswordChange, onSubmit };
}
```

## Critical Rules

1. **Never use `any`** - Use `unknown` and narrow with type guards
2. **Never disable TypeScript errors** - Fix the root cause
3. **Always type function returns** - Explicit return types catch errors early
4. **Use const assertions** - `as const` for literal types
5. **Prefer interfaces for objects** - Better error messages and extension

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Expo TypeScript Guide](https://docs.expo.dev/guides/typescript/)
- [Total TypeScript](https://www.totaltypescript.com/)

## TASKS

- [ ] Add missing strict compiler options to `tsconfig.json`:
  - `noImplicitOverride: true`
  - `noPropertyAccessFromIndexSignature: true`
  - `exactOptionalPropertyTypes: true`
  - File: `tsconfig.json`

- [ ] Add explicit return types to all component functions - Files affected:
  - `components/ui/Button.tsx` (Button)
  - `components/ui/Text.tsx` (Text)
  - `components/ui/Input.tsx` (Input, TextArea)
  - `components/ui/Card.tsx` (Card, CardHeader, CardContent, CardFooter)
  - `components/ui/Toggle.tsx` (Switch, Checkbox, Radio, RadioGroup)
  - `components/ui/Avatar.tsx` (Avatar, AvatarGroup, getInitials)
  - `components/ui/ListItem.tsx` (ListItem, ListSection)
  - `components/ui/Badge.tsx` (Badge, BadgeGroup)
  - `components/ui/Spinner.tsx` (Spinner, LoadingOverlay)
  - `components/ui/Divider.tsx` (Divider)
  - `components/ui/IconButton.tsx` (IconButton)
  - `components/layouts/Header.tsx` (Header)
  - `components/layouts/HeaderLayout.tsx` (HeaderLayout)
  - `components/layouts/ScreenLayout.tsx` (ScreenLayout)
  - `components/layouts/ModalLayout.tsx` (ModalLayout)
  - `components/glass/GlassContainer.*.tsx` (all platform variants)

- [ ] Add `exclude: ["node_modules"]` to `tsconfig.json` for explicit exclusion - File: `tsconfig.json`

- [ ] Consider adding discriminated union pattern for async state management when implementing data fetching - Future files in `hooks/` or `lib/`

- [ ] Consider adding branded types for entity IDs (UserId, PostId, etc.) when implementing data models - Future files in `types/` or `lib/`

- [ ] Consider adding type guards for user roles/permissions when implementing auth - Future files in `hooks/` or `lib/`

## TO DISCUSS

- **Current approach:** Path aliases are granularly defined (`@/components/*`, `@/constants/*`, `@/hooks/*`, `@/lib/*`, `@/assets/*`)
- **Document suggests:** Single catch-all alias (`@/*`)
- **Why current is better:** Granular aliases provide better IDE autocomplete, clearer import organization, and can help with tree-shaking in some bundler configurations. They make the project structure more explicit.

- **Current approach:** Uses NativeWind classes for all styling instead of `StyleSheet.create<Styles>` pattern
- **Document suggests:** Type-safe `StyleSheet.create<Styles>` with interface definitions
- **Why current is better:** This project uses NativeWind as its styling system. Using NativeWind classes is the correct approach here since it provides Tailwind-like utility classes with dark mode support via CSS variables. The document's StyleSheet pattern would be appropriate for projects not using NativeWind.

- **Current approach:** `Colors` interface is explicitly defined in `constants/colors.ts` (lines 138-149)
- **Document suggests:** Extract types from values using `typeof`
- **Why current is better:** Explicitly defining the interface makes the type contract clearer, easier to document, and more maintainable. It also allows the interface to be more permissive (using `string` for color values) while the implementation uses literal types via `as const`.

- **Current approach:** One legitimate `@ts-expect-error` in `components/glass/GlassContainer.web.tsx` (line 49) for web-specific CSS properties (`backdropFilter`, `WebkitBackdropFilter`)
- **Document suggests:** Never disable TypeScript errors
- **Why current is acceptable:** This is a platform-specific file that uses CSS properties not in React Native's type definitions. The comment clearly documents why the suppression is needed, and it only applies to web builds.
