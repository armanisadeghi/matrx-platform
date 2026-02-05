# TypeScript Patterns

## Config Requirements

```json
// tsconfig.json - DO NOT weaken these flags
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "paths": { "@/*": ["./*"] }
  }
}
```

## Component Props

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
}

export function Button({ variant = "primary", ...props }: ButtonProps) {
  // Implementation
}
```

## Generic Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

export function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <View>
      {items.map((item, i) => (
        <View key={keyExtractor(item)}>{renderItem(item, i)}</View>
      ))}
    </View>
  );
}
```

## Discriminated Unions (Async State)

```typescript
type AsyncState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

function render<T>(state: AsyncState<T>) {
  switch (state.status) {
    case "loading": return <Spinner />;
    case "success": return <DataView data={state.data} />;
    case "error": return <ErrorView error={state.error} />;
  }
}
```

## Route Params

```typescript
import { useLocalSearchParams } from "expo-router";

type UserParams = {
  id: string;
  tab?: "posts" | "followers";
};

function UserScreen() {
  const { id, tab = "posts" } = useLocalSearchParams<UserParams>();
}
```

## Typed Context

```typescript
interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
```

## Type Guards

```typescript
function isAdmin(user: User | Admin): user is Admin {
  return user.type === "admin";
}
```

## Constraints

| Rule | Reason |
|------|--------|
| Never use `any` | Use `unknown` + type guards |
| Never disable TS errors | Fix root cause |
| Always type function returns | Catches errors early |
| Use `as const` for literals | Preserves literal types |
| Prefer interfaces over types | Better error messages |
