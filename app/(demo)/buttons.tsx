/**
 * Buttons Demo Page
 *
 * Showcases button variants and states.
 */

import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text, Button, Card, IconButton, Divider } from "@/components/ui";
import { HeaderLayout } from "@/components/layouts";

export default function ButtonsDemo() {
  return (
    <HeaderLayout
      header={{
        title: "Buttons",
        showBackButton: true,
      }}
    >
      <View className="px-4 py-4">
        <Text variant="body" color="secondary" className="mb-6">
          Buttons support multiple variants, sizes, and states. They adapt
          automatically to the current color scheme.
        </Text>

        {/* Button Variants */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Variants
          </Text>
          <View className="gap-3">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Destructive Button</Button>
          </View>
        </Card>

        {/* Button Sizes */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Sizes
          </Text>
          <View className="gap-3">
            <Button size="sm">Small Button</Button>
            <Button size="md">Medium Button</Button>
            <Button size="lg">Large Button</Button>
          </View>
        </Card>

        {/* Button States */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            States
          </Text>
          <View className="gap-3">
            <Button>Default</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </View>
        </Card>

        {/* Buttons with Icons */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            With Icons
          </Text>
          <View className="gap-3">
            <Button leftIcon={<Ionicons name="add" size={18} color="#FFFFFF" />}>
              Add Item
            </Button>
            <Button
              variant="outline"
              rightIcon={<Ionicons name="arrow-forward" size={18} color="#1E3A5F" />}
            >
              Continue
            </Button>
          </View>
        </Card>

        {/* Full Width */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Full Width
          </Text>
          <Button fullWidth>Full Width Button</Button>
        </Card>

        <Divider spacing="lg" />

        {/* Icon Buttons */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Icon Buttons
          </Text>
          <View className="flex-row gap-4 items-center flex-wrap">
            <IconButton icon="heart" />
            <IconButton icon="share" variant="tinted" />
            <IconButton icon="bookmark" variant="filled" />
            <IconButton icon="trash" color="error" />
            <IconButton icon="settings" variant="ghost" />
          </View>
          <Text variant="caption" color="muted" className="mt-3">
            Variants: default, tinted, filled, ghost
          </Text>
        </Card>

        {/* Icon Button Sizes */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Icon Button Sizes
          </Text>
          <View className="flex-row gap-4 items-center">
            <IconButton icon="star" size="sm" variant="tinted" />
            <IconButton icon="star" size="md" variant="tinted" />
            <IconButton icon="star" size="lg" variant="tinted" />
          </View>
        </Card>

        <Divider spacing="lg" />

        <Text variant="caption" color="muted" className="text-center">
          All buttons use centralized theme colors
        </Text>
      </View>
    </HeaderLayout>
  );
}
