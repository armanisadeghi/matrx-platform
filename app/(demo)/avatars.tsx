/**
 * Avatars Demo Page
 *
 * Showcases avatar components and groups.
 */

import { View } from "react-native";
import { Text, Card, Avatar, AvatarGroup, Divider } from "@/components/ui";
import { HeaderLayout } from "@/components/layouts";

export default function AvatarsDemo() {
  const sampleAvatars = [
    { name: "John Doe" },
    { name: "Jane Smith" },
    { name: "Bob Wilson" },
    { name: "Alice Brown" },
    { name: "Charlie Davis" },
  ];

  return (
    <HeaderLayout
      header={{
        title: "Avatars",
        showBackButton: true,
      }}
    >
      <View className="px-4 py-4">
        <Text variant="body" color="secondary" className="mb-6">
          Avatar components display user images, initials, or icons with
          optional status indicators.
        </Text>

        {/* Avatar Sizes */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Sizes
          </Text>
          <View className="flex-row items-end gap-4">
            <View className="items-center">
              <Avatar name="XS" size="xs" />
              <Text variant="caption" color="muted" className="mt-2">
                xs
              </Text>
            </View>
            <View className="items-center">
              <Avatar name="SM" size="sm" />
              <Text variant="caption" color="muted" className="mt-2">
                sm
              </Text>
            </View>
            <View className="items-center">
              <Avatar name="MD" size="md" />
              <Text variant="caption" color="muted" className="mt-2">
                md
              </Text>
            </View>
            <View className="items-center">
              <Avatar name="LG" size="lg" />
              <Text variant="caption" color="muted" className="mt-2">
                lg
              </Text>
            </View>
            <View className="items-center">
              <Avatar name="XL" size="xl" />
              <Text variant="caption" color="muted" className="mt-2">
                xl
              </Text>
            </View>
            <View className="items-center">
              <Avatar name="2X" size="2xl" />
              <Text variant="caption" color="muted" className="mt-2">
                2xl
              </Text>
            </View>
          </View>
        </Card>

        {/* Avatar Types */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Types
          </Text>
          <View className="flex-row items-center gap-4">
            <View className="items-center">
              <Avatar
                source="https://i.pravatar.cc/150?img=1"
                size="lg"
              />
              <Text variant="caption" color="muted" className="mt-2">
                Image
              </Text>
            </View>
            <View className="items-center">
              <Avatar name="John Doe" size="lg" />
              <Text variant="caption" color="muted" className="mt-2">
                Initials
              </Text>
            </View>
            <View className="items-center">
              <Avatar size="lg" />
              <Text variant="caption" color="muted" className="mt-2">
                Fallback
              </Text>
            </View>
          </View>
        </Card>

        {/* Status Indicators */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Status Indicators
          </Text>
          <View className="flex-row items-center gap-4">
            <View className="items-center">
              <Avatar name="Online" size="lg" showStatus status="online" />
              <Text variant="caption" color="muted" className="mt-2">
                Online
              </Text>
            </View>
            <View className="items-center">
              <Avatar name="Away" size="lg" showStatus status="away" />
              <Text variant="caption" color="muted" className="mt-2">
                Away
              </Text>
            </View>
            <View className="items-center">
              <Avatar name="Busy" size="lg" showStatus status="busy" />
              <Text variant="caption" color="muted" className="mt-2">
                Busy
              </Text>
            </View>
            <View className="items-center">
              <Avatar name="Offline" size="lg" showStatus status="offline" />
              <Text variant="caption" color="muted" className="mt-2">
                Offline
              </Text>
            </View>
          </View>
        </Card>

        {/* Background Colors */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Background Colors
          </Text>
          <View className="flex-row items-center gap-4">
            <View className="items-center">
              <Avatar name="Primary" size="lg" backgroundColor="primary" />
              <Text variant="caption" color="muted" className="mt-2">
                Primary
              </Text>
            </View>
            <View className="items-center">
              <Avatar name="Secondary" size="lg" backgroundColor="secondary" />
              <Text variant="caption" color="muted" className="mt-2">
                Secondary
              </Text>
            </View>
            <View className="items-center">
              <Avatar name="Surface" size="lg" backgroundColor="surface" />
              <Text variant="caption" color="muted" className="mt-2">
                Surface
              </Text>
            </View>
          </View>
        </Card>

        {/* Avatar Groups */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Avatar Groups
          </Text>
          <View className="gap-4">
            <View>
              <AvatarGroup avatars={sampleAvatars} max={3} size="md" />
              <Text variant="caption" color="muted" className="mt-2">
                max=3
              </Text>
            </View>
            <View>
              <AvatarGroup avatars={sampleAvatars} max={4} size="md" />
              <Text variant="caption" color="muted" className="mt-2">
                max=4
              </Text>
            </View>
            <View>
              <AvatarGroup avatars={sampleAvatars} max={5} size="sm" />
              <Text variant="caption" color="muted" className="mt-2">
                max=5, size=sm
              </Text>
            </View>
          </View>
        </Card>

        {/* Initials Generation */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Initials Generation
          </Text>
          <View className="flex-row items-center gap-4 flex-wrap">
            <View className="items-center">
              <Avatar name="John" size="md" />
              <Text variant="caption" color="muted" className="mt-1">
                John
              </Text>
            </View>
            <View className="items-center">
              <Avatar name="John Doe" size="md" />
              <Text variant="caption" color="muted" className="mt-1">
                John Doe
              </Text>
            </View>
            <View className="items-center">
              <Avatar name="John Michael Doe" size="md" />
              <Text variant="caption" color="muted" className="mt-1">
                J.M. Doe
              </Text>
            </View>
          </View>
          <Text variant="caption" color="muted" className="mt-3">
            First letter + last name's first letter
          </Text>
        </Card>

        <Divider spacing="lg" />

        <Text variant="caption" color="muted" className="text-center">
          All avatars use centralized theme colors
        </Text>
      </View>
    </HeaderLayout>
  );
}
