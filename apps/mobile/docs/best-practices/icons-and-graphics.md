# Icons

## Use the Icon Component

```tsx
import { Icon, IconButton } from "@/components/ui";

<Icon name="home" size="md" color="primary" />
<IconButton name="settings" onPress={handleSettings} />
```

## Icon Sizes

| Size | Pixels | Usage |
|------|--------|-------|
| `xs` | 12 | Badges, indicators |
| `sm` | 16 | Inline with text |
| `md` | 20 | Default |
| `lg` | 24 | Primary actions |
| `xl` | 32 | Feature icons |
| `2xl` | 40 | Hero icons |

## Icon Colors

```tsx
// Semantic colors (auto light/dark)
<Icon name="checkmark-circle" color="success" />
<Icon name="alert-circle" color="error" />
<Icon name="information-circle" color="info" />

// Theme colors
<Icon name="heart" color="primary" />
<Icon name="person" color="muted" />
```

## Tab Bar Icons

NativeTabs use platform-specific icons:

```tsx
<Trigger name="home" asChild>
  <Icon
    sf={{ default: "house", selected: "house.fill" }}  // iOS SF Symbols
    drawable="home"                                      // Android drawable
  />
  <Label>Home</Label>
</Trigger>
```

## Icon Names

Ionicons library — browse at [icons.expo.fyi](https://icons.expo.fyi)

Common icons:
```
home, home-outline
search, search-outline
person, person-outline
settings, settings-outline
chevron-forward, chevron-back
checkmark, checkmark-circle
close, close-circle
add, add-circle
trash, trash-outline
heart, heart-outline
star, star-outline
```

## IconButton

```tsx
// Variants
<IconButton name="trash" variant="ghost" />
<IconButton name="edit" variant="secondary" />
<IconButton name="send" variant="primary" />

// Sizes
<IconButton name="close" size="sm" />
<IconButton name="menu" size="lg" />
```

## Direct Ionicons (Escape Hatch)

When you need direct access:

```tsx
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

const { colors } = useTheme();
<Ionicons name="star" size={24} color={colors.warning.DEFAULT} />
```
