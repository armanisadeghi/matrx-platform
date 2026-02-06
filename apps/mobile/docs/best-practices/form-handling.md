# Form Handling

## Form Components

```tsx
import { Input, TextArea, Select, Switch, Checkbox, Radio, Button } from "@/components/ui";
```

## Basic Form

```tsx
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();

  return (
    <KeyboardAwareView className="gap-4 p-4">
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        error={error}
      />
      <Button onPress={handleSubmit} loading={isLoading}>
        Sign In
      </Button>
    </KeyboardAwareView>
  );
}
```

## Input Props

| Prop | Type | Purpose |
|------|------|---------|
| `label` | string | Field label |
| `error` | string | Error message (shows red state) |
| `helperText` | string | Hint text below input |
| `disabled` | boolean | Disables input |
| `autoComplete` | string | Autofill hint |
| `textContentType` | string | iOS autofill type |

## Input Types

```tsx
// Email
<Input keyboardType="email-address" autoComplete="email" textContentType="emailAddress" />

// Password
<Input secureTextEntry autoComplete="password" textContentType="password" />

// Phone
<Input keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" />

// Number
<Input keyboardType="numeric" />

// Search
<SearchBar value={search} onChangeText={setSearch} onSubmit={handleSearch} />
```

## Select

```tsx
<Select
  label="Country"
  value={country}
  onValueChange={setCountry}
  options={[
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
  ]}
  error={errors.country}
/>
```

## Toggles

```tsx
// Switch
<Switch value={enabled} onValueChange={setEnabled} />

// Checkbox
<Checkbox checked={agreed} onCheckedChange={setAgreed} label="I agree" />

// Radio Group
<RadioGroup value={plan} onValueChange={setPlan}>
  <Radio value="free" label="Free" />
  <Radio value="pro" label="Pro" />
</RadioGroup>
```

## Validation Pattern

```tsx
const validate = () => {
  const errors: Record<string, string> = {};

  if (!email) errors.email = "Required";
  else if (!email.includes("@")) errors.email = "Invalid email";

  if (!password) errors.password = "Required";
  else if (password.length < 8) errors.password = "Min 8 characters";

  setErrors(errors);
  return Object.keys(errors).length === 0;
};

const handleSubmit = () => {
  if (validate()) {
    // Submit
  }
};
```

## Loading State

```tsx
<Button loading={isSubmitting} disabled={isSubmitting}>
  {isSubmitting ? "Saving..." : "Save"}
</Button>
```
