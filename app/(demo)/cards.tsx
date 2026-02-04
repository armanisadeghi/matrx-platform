/**
 * Cards Demo Page
 *
 * Showcases card variants and compositions.
 */

import { View, Image } from "react-native";
import {
  Text,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Avatar,
  Badge,
  Divider,
} from "@/components/ui";
import { HeaderLayout } from "@/components/layouts";

export default function CardsDemo() {
  return (
    <HeaderLayout
      header={{
        title: "Cards",
        showBackButton: true,
      }}
    >
      <View className="px-4 py-4">
        <Text variant="body" color="secondary" className="mb-6">
          Cards are versatile containers for grouping related content. Multiple
          variants are available to suit different use cases.
        </Text>

        {/* Card Variants */}
        <Text variant="overline" color="secondary" className="mb-3 ml-1">
          Variants
        </Text>

        <Card variant="elevated" className="mb-3">
          <Text variant="label">Elevated Card</Text>
          <Text variant="caption" color="secondary">
            Has shadow for visual elevation
          </Text>
        </Card>

        <Card variant="outlined" className="mb-3">
          <Text variant="label">Outlined Card</Text>
          <Text variant="caption" color="secondary">
            Has border without shadow
          </Text>
        </Card>

        <Card variant="filled" className="mb-3">
          <Text variant="label">Filled Card</Text>
          <Text variant="caption" color="secondary">
            Has background fill
          </Text>
        </Card>

        <Card variant="glass" className="mb-6">
          <Text variant="label">Glass Card</Text>
          <Text variant="caption" color="secondary">
            Has glass effect (platform-native)
          </Text>
        </Card>

        {/* Pressable Cards */}
        <Text variant="overline" color="secondary" className="mb-3 ml-1">
          Pressable Cards
        </Text>

        <Card variant="outlined" pressable onPress={() => {}} className="mb-6">
          <View className="flex-row items-center">
            <Avatar name="John Doe" size="md" className="mr-3" />
            <View className="flex-1">
              <Text variant="label">John Doe</Text>
              <Text variant="caption" color="secondary">
                Tap to view profile
              </Text>
            </View>
            <Badge variant="primary">New</Badge>
          </View>
        </Card>

        {/* Card Compositions */}
        <Text variant="overline" color="secondary" className="mb-3 ml-1">
          Compositions
        </Text>

        <Card variant="outlined" className="mb-3">
          <CardHeader>
            <Text variant="h5">Card with Sections</Text>
            <Text variant="caption" color="secondary">
              Using CardHeader, CardContent, CardFooter
            </Text>
          </CardHeader>
          <CardContent>
            <Text variant="body" color="secondary">
              This card uses the composition components to structure content
              with consistent spacing.
            </Text>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
            <Button size="sm">Confirm</Button>
          </CardFooter>
        </Card>

        <Card variant="elevated" className="mb-3">
          <CardHeader>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Avatar name="Jane Smith" size="sm" className="mr-2" />
                <View>
                  <Text variant="label">Jane Smith</Text>
                  <Text variant="caption" color="muted">
                    2 hours ago
                  </Text>
                </View>
              </View>
              <Badge variant="success">Active</Badge>
            </View>
          </CardHeader>
          <CardContent>
            <Text variant="body">
              This is an example of a social card with avatar, timestamp, and
              status badge.
            </Text>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm">
              Like
            </Button>
            <Button variant="ghost" size="sm">
              Comment
            </Button>
            <Button variant="ghost" size="sm">
              Share
            </Button>
          </CardFooter>
        </Card>

        {/* Padding Options */}
        <Text variant="overline" color="secondary" className="mb-3 ml-1 mt-3">
          Padding Options
        </Text>

        <Card variant="outlined" padding="none" className="mb-3">
          <Text variant="caption" color="muted" className="p-4">
            padding="none"
          </Text>
        </Card>

        <Card variant="outlined" padding="sm" className="mb-3">
          <Text variant="caption" color="muted">
            padding="sm"
          </Text>
        </Card>

        <Card variant="outlined" padding="md" className="mb-3">
          <Text variant="caption" color="muted">
            padding="md" (default)
          </Text>
        </Card>

        <Card variant="outlined" padding="lg" className="mb-3">
          <Text variant="caption" color="muted">
            padding="lg"
          </Text>
        </Card>

        <Divider spacing="lg" />

        <Text variant="caption" color="muted" className="text-center">
          All cards use centralized theme styling
        </Text>
      </View>
    </HeaderLayout>
  );
}
