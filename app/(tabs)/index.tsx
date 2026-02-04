/**
 * Home Tab
 *
 * Main landing screen for the app.
 */

import { View, ScrollView } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, Card, Button, Avatar, Badge } from "@/components/ui";
import { HeaderLayout } from "@/components/layouts";
import { useTheme } from "@/hooks/useTheme";

export default function HomeTab() {
  const { colors } = useTheme();

  return (
    <HeaderLayout
      header={{
        title: "Home",
        rightContent: (
          <Link href="/(demo)" asChild>
            <Badge variant="primary" className="px-3 py-1">
              Demo
            </Badge>
          </Link>
        ),
      }}
      safeAreaEdges={["bottom"]}
    >
      <View className="px-4 py-4">
        {/* Welcome Card */}
        <Card variant="glass" className="mb-6">
          <View className="flex-row items-center">
            <Avatar name="User" size="lg" showStatus status="online" />
            <View className="ml-4 flex-1">
              <Text variant="h4">Welcome back!</Text>
              <Text variant="body" color="secondary">
                Ready to explore the app?
              </Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <Text variant="overline" color="secondary" className="mb-3 ml-1">
          Quick Actions
        </Text>
        <View className="flex-row gap-3 mb-6">
          <Card variant="outlined" className="flex-1" pressable>
            <View className="items-center py-2">
              <Ionicons name="add-circle" size={32} color={colors.primary.DEFAULT} />
              <Text variant="label" className="mt-2">
                Create
              </Text>
            </View>
          </Card>
          <Card variant="outlined" className="flex-1" pressable>
            <View className="items-center py-2">
              <Ionicons name="search" size={32} color={colors.primary.DEFAULT} />
              <Text variant="label" className="mt-2">
                Search
              </Text>
            </View>
          </Card>
          <Card variant="outlined" className="flex-1" pressable>
            <View className="items-center py-2">
              <Ionicons name="settings" size={32} color={colors.primary.DEFAULT} />
              <Text variant="label" className="mt-2">
                Settings
              </Text>
            </View>
          </Card>
        </View>

        {/* Recent Activity */}
        <Text variant="overline" color="secondary" className="mb-3 ml-1">
          Recent Activity
        </Text>
        <Card variant="outlined" className="mb-3">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-success/10 items-center justify-center mr-3">
              <Ionicons name="checkmark-circle" size={20} color={colors.success.DEFAULT} />
            </View>
            <View className="flex-1">
              <Text variant="label">Project completed</Text>
              <Text variant="caption" color="muted">
                2 hours ago
              </Text>
            </View>
          </View>
        </Card>
        <Card variant="outlined" className="mb-3">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-info/10 items-center justify-center mr-3">
              <Ionicons name="chatbubble" size={20} color={colors.info.DEFAULT} />
            </View>
            <View className="flex-1">
              <Text variant="label">New message received</Text>
              <Text variant="caption" color="muted">
                5 hours ago
              </Text>
            </View>
          </View>
        </Card>
        <Card variant="outlined">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-warning/10 items-center justify-center mr-3">
              <Ionicons name="star" size={20} color={colors.warning.DEFAULT} />
            </View>
            <View className="flex-1">
              <Text variant="label">Achievement unlocked</Text>
              <Text variant="caption" color="muted">
                Yesterday
              </Text>
            </View>
          </View>
        </Card>

        {/* CTA */}
        <View className="mt-6">
          <Link href="/(demo)" asChild>
            <Button fullWidth>View Component Library</Button>
          </Link>
        </View>
      </View>
    </HeaderLayout>
  );
}
