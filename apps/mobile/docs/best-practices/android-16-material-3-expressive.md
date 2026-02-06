# Android 16 Material 3 Expressive

## Already Implemented

All M3E requirements are built into the component library:

| Requirement | Implementation |
|-------------|----------------|
| **Spring animations** | `useAnimatedPress` hook on all interactive components |
| **Haptic feedback** | Built into `useAnimatedPress`, auto-fires on press |
| **MD3 color roles** | Full token set in `global.css` and `colors.ts` |
| **Rounded forms** | All components use `rounded-xl` (12px) or larger |

## MD3 Color Tokens

```tsx
// Primary with container variants
className="bg-primary text-primary-on"
className="bg-primary-container text-primary-on-container"

// Secondary with container variants
className="bg-secondary text-secondary-on"
className="bg-secondary-container text-secondary-on-container"

// Surface variants
className="bg-surface-variant text-surface-on-variant"

// Outline for borders
className="border-outline"
className="border-outline-variant"
```

## Native Tabs

Android uses Material drawables:

```tsx
<NativeTabs>
  <Trigger name="home" asChild>
    <Icon drawable="home" sf={{ default: "house" }} />
    <Label>Home</Label>
  </Trigger>
</NativeTabs>
```

## Interactive Components

All already include M3E motion:

```tsx
// Button — spring + haptics built-in
<Button variant="primary" onPress={handlePress}>
  Action
</Button>

// Card — press animation built-in
<Card variant="elevated" onPress={handleCardPress}>
  <CardContent>...</CardContent>
</Card>

// ListItem — press animation built-in
<ListItem title="Settings" onPress={handleSettings} />
```

## Edge-to-Edge

Enabled by default in Expo SDK 54:

```typescript
// app.config.ts
android: {
  edgeToEdgeEnabled: true,
}
```

Handle insets with `useSafeAreaInsets()`.

## Constraints

- Max 5 bottom tabs (Android platform limit)
- Use rounded corners (12-16dp) — no sharp corners
- Include haptics on all interactive elements (already done via hooks)
