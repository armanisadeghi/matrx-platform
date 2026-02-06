/**
 * Explore Tab
 *
 * Discovery and browsing screen.
 */

import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text, Card, Input, Badge, Avatar } from "@/components/ui";
import { HeaderLayout } from "@/components/layouts";
import { useTheme } from "@/hooks/useTheme";

export default function ExploreTab() {
  const { colors } = useTheme();

  return (
    <HeaderLayout
      header={{
        title: "Explore",
      }}
      safeAreaEdges={["bottom"]}
    >
      <View className="px-4 py-4">
        {/* Search */}
        <Input
          type="search"
          placeholder="Search..."
          variant="filled"
          className="mb-6"
        />

        {/* Categories */}
        <Text variant="overline" color="secondary" className="mb-3 ml-1">
          Categories
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          <Badge variant="primary">Design</Badge>
          <Badge variant="default">Development</Badge>
          <Badge variant="default">Marketing</Badge>
          <Badge variant="default">Finance</Badge>
          <Badge variant="default">Analytics</Badge>
        </View>

        {/* Featured */}
        <Text variant="overline" color="secondary" className="mb-3 ml-1">
          Featured
        </Text>
        <Card variant="elevated" className="mb-3">
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-xl bg-primary/10 items-center justify-center mr-4">
              <Ionicons name="rocket" size={32} color={colors.primary.DEFAULT} />
            </View>
            <View className="flex-1">
              <Text variant="h5">Getting Started</Text>
              <Text variant="bodySmall" color="secondary">
                Learn the basics of building with this template
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.foreground.muted} />
          </View>
        </Card>

        <Card variant="elevated" className="mb-3">
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-xl bg-info/10 items-center justify-center mr-4">
              <Ionicons name="book" size={32} color={colors.info.DEFAULT} />
            </View>
            <View className="flex-1">
              <Text variant="h5">Documentation</Text>
              <Text variant="bodySmall" color="secondary">
                Explore the component library and APIs
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.foreground.muted} />
          </View>
        </Card>

        {/* Popular */}
        <Text variant="overline" color="secondary" className="mb-3 ml-1 mt-3">
          Popular
        </Text>
        <Card variant="outlined" className="mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Avatar name="Project A" size="sm" className="mr-3" />
              <View>
                <Text variant="label">Project Alpha</Text>
                <Text variant="caption" color="muted">
                  1.2k views
                </Text>
              </View>
            </View>
            <Badge variant="success">Trending</Badge>
          </View>
        </Card>

        <Card variant="outlined" className="mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Avatar name="Project B" size="sm" backgroundColor="secondary" className="mr-3" />
              <View>
                <Text variant="label">Project Beta</Text>
                <Text variant="caption" color="muted">
                  856 views
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <Card variant="outlined">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Avatar name="Project G" size="sm" className="mr-3" />
              <View>
                <Text variant="label">Project Gamma</Text>
                <Text variant="caption" color="muted">
                  642 views
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </View>
    </HeaderLayout>
  );
}
