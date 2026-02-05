# Layout System

## Layout Components

```tsx
import { ScreenLayout, HeaderLayout, ModalLayout } from "@/components/layouts";
```

| Layout | Use For |
|--------|---------|
| `ScreenLayout` | Base screen with safe areas |
| `HeaderLayout` | Screen with header + scrollable content |
| `ModalLayout` | Sheets, dialogs, fullscreen modals |

## ScreenLayout

```tsx
<ScreenLayout safeAreaEdges={["top", "bottom"]}>
  <Content />
</ScreenLayout>
```

## HeaderLayout

```tsx
<HeaderLayout
  header={{
    title: "Settings",
    showBack: true,
    rightSlot: <IconButton name="ellipsis-horizontal" />,
  }}
>
  <ScrollContent />
</HeaderLayout>
```

## ModalLayout

```tsx
// Bottom sheet
<ModalLayout
  presentation="sheet"
  header={{ title: "Select Option" }}
  onDismiss={handleClose}
>
  <OptionsList />
</ModalLayout>

// Dialog
<ModalLayout presentation="dialog" dismissible>
  <ConfirmationContent />
</ModalLayout>
```

## Safe Area Handling

**Rule:** Use `useSafeAreaInsets()` hook, not `<SafeAreaView>` component.

```tsx
import { useSafeAreaInsets } from "react-native-safe-area-context";

function MyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }}>
      <Content />
      {/* Minimum 16px bottom padding on devices without home indicator */}
      <View style={{ paddingBottom: Math.max(insets.bottom, 16) }} />
    </View>
  );
}
```

## Safe Area by Screen Type

| Screen Type | Top | Bottom |
|-------------|-----|--------|
| Tab screen | Handled by tabs | Handled by tabs |
| Stack screen | Apply `insets.top` | Apply `Math.max(insets.bottom, 16)` |
| Modal sheet | None (has handle) | Apply bottom inset |
| Fullscreen modal | Apply top | Apply bottom |

## Keyboard Handling

```tsx
import { KeyboardAwareView } from "@/components/ui";

<KeyboardAwareView>
  <Input label="Email" />
  <Input label="Password" />
  <Button>Submit</Button>
</KeyboardAwareView>
```

## ScrollContainer

```tsx
import { ScrollContainer } from "@/components/ui";

<ScrollContainer
  refreshable
  refreshing={isLoading}
  onRefresh={handleRefresh}
  safeAreaEdges={["bottom"]}
>
  <FeedContent />
</ScrollContainer>
```

## Don't

- Use `<SafeAreaView>` component — causes animation flicker
- Forget bottom padding on non-tab screens
- Hardcode inset values — always use the hook
