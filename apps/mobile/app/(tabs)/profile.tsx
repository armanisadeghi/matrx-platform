/**
 * Profile Tab
 *
 * User profile and settings screen.
 */

import { View } from "react-native";
import { Link } from "expo-router";
import {
  Text,
  Card,
  Button,
  Avatar,
  Badge,
  Switch,
  ListItem,
  ListSection,
} from "@/components/ui";
import { HeaderLayout } from "@/components/layouts";
import { useTheme } from "@/hooks/useTheme";

export default function ProfileTab() {
  const { isDark, toggleColorScheme } = useTheme();

  return (
    <HeaderLayout
      header={{
        title: "Profile",
        rightContent: (
          <Link href="/(demo)" asChild>
            <Button variant="ghost" size="sm">
              Demo
            </Button>
          </Link>
        ),
      }}
      safeAreaEdges={["bottom"]}
      background="secondary"
    >
      <View className="px-4 py-4">
        {/* Profile Card */}
        <Card variant="elevated" className="mb-6">
          <View className="items-center py-4">
            <Avatar
              name="John Doe"
              size="2xl"
              showStatus
              status="online"
            />
            <Text variant="h4" className="mt-4">
              John Doe
            </Text>
            <Text variant="body" color="secondary">
              john.doe@example.com
            </Text>
            <View className="flex-row items-center mt-2">
              <Badge variant="primary">Pro Member</Badge>
            </View>
          </View>
        </Card>

        {/* Stats */}
        <Card variant="outlined" className="mb-6">
          <View className="flex-row justify-around py-2">
            <View className="items-center">
              <Text variant="h4">128</Text>
              <Text variant="caption" color="muted">
                Projects
              </Text>
            </View>
            <View className="w-px bg-border" />
            <View className="items-center">
              <Text variant="h4">1.2k</Text>
              <Text variant="caption" color="muted">
                Followers
              </Text>
            </View>
            <View className="w-px bg-border" />
            <View className="items-center">
              <Text variant="h4">847</Text>
              <Text variant="caption" color="muted">
                Following
              </Text>
            </View>
          </View>
        </Card>

        {/* Settings */}
        <ListSection title="Preferences" className="mb-6">
          <ListItem
            title="Dark Mode"
            subtitle={isDark ? "On" : "Off"}
            leftIcon="moon"
            rightContent={
              <Switch value={isDark} onValueChange={toggleColorScheme} />
            }
          />
          <ListItem
            title="Notifications"
            subtitle="Enabled"
            leftIcon="notifications"
            rightContent={<Switch value={true} onValueChange={() => {}} />}
          />
          <ListItem
            title="Language"
            subtitle="English"
            leftIcon="language"
            onPress={() => {}}
            showSeparator={false}
          />
        </ListSection>

        <ListSection title="Account" className="mb-6">
          <ListItem
            title="Edit Profile"
            leftIcon="person"
            onPress={() => {}}
          />
          <ListItem
            title="Security"
            leftIcon="shield-checkmark"
            onPress={() => {}}
          />
          <ListItem
            title="Privacy"
            leftIcon="lock-closed"
            onPress={() => {}}
            showSeparator={false}
          />
        </ListSection>

        <ListSection title="Support" className="mb-6">
          <ListItem
            title="Help Center"
            leftIcon="help-circle"
            onPress={() => {}}
          />
          <ListItem
            title="Report a Problem"
            leftIcon="bug"
            onPress={() => {}}
          />
          <ListItem
            title="Terms of Service"
            leftIcon="document-text"
            onPress={() => {}}
            showSeparator={false}
          />
        </ListSection>

        {/* Sign Out */}
        <Button variant="outline" fullWidth className="mb-4">
          Sign Out
        </Button>

        {/* Version */}
        <Text variant="caption" color="muted" className="text-center">
          Version 1.0.0 (Build 1)
        </Text>
      </View>
    </HeaderLayout>
  );
}
