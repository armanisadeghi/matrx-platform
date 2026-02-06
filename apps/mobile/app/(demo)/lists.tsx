/**
 * Lists Demo Page
 *
 * Showcases list items and sections.
 */

import { useState } from "react";
import { View } from "react-native";
import {
  Text,
  ListItem,
  ListSection,
  Switch,
  Badge,
  Avatar,
  Divider,
} from "@/components/ui";
import { HeaderLayout } from "@/components/layouts";

export default function ListsDemo() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <HeaderLayout
      header={{
        title: "Lists",
        showBackButton: true,
      }}
      background="secondary"
    >
      <View className="px-4 py-4">
        <Text variant="body" color="secondary" className="mb-6">
          List items provide a consistent way to display content in lists, menus,
          and settings screens.
        </Text>

        {/* Basic List Items */}
        <ListSection title="Basic List Items" className="mb-6">
          <ListItem
            title="Simple List Item"
            onPress={() => {}}
          />
          <ListItem
            title="With Subtitle"
            subtitle="This is a subtitle"
            onPress={() => {}}
          />
          <ListItem
            title="With Description"
            subtitle="This is a subtitle"
            description="This is a longer description that provides more context"
            onPress={() => {}}
          />
          <ListItem
            title="No Chevron"
            subtitle="Static item without navigation"
            showChevron={false}
            showSeparator={false}
          />
        </ListSection>

        {/* List Items with Icons */}
        <ListSection title="With Icons" className="mb-6">
          <ListItem
            title="Profile"
            subtitle="View and edit your profile"
            leftIcon="person"
            onPress={() => {}}
          />
          <ListItem
            title="Notifications"
            subtitle="Manage notification settings"
            leftIcon="notifications"
            onPress={() => {}}
          />
          <ListItem
            title="Privacy"
            subtitle="Control your privacy settings"
            leftIcon="shield-checkmark"
            onPress={() => {}}
            showSeparator={false}
          />
        </ListSection>

        {/* List Items with Custom Content */}
        <ListSection title="With Custom Content" className="mb-6">
          <ListItem
            title="Notifications"
            subtitle="Receive push notifications"
            leftIcon="notifications"
            rightContent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
              />
            }
          />
          <ListItem
            title="Dark Mode"
            subtitle="Use dark theme"
            leftIcon="moon"
            rightContent={
              <Switch value={darkMode} onValueChange={setDarkMode} />
            }
          />
          <ListItem
            title="Messages"
            subtitle="You have new messages"
            leftIcon="mail"
            rightContent={<Badge variant="error">{5}</Badge>}
            onPress={() => {}}
            showSeparator={false}
          />
        </ListSection>

        {/* List Items with Avatars */}
        <ListSection title="With Avatars" className="mb-6">
          <ListItem
            title="John Doe"
            subtitle="Online"
            leftContent={
              <Avatar name="John Doe" size="md" showStatus status="online" />
            }
            onPress={() => {}}
          />
          <ListItem
            title="Jane Smith"
            subtitle="Away"
            leftContent={
              <Avatar name="Jane Smith" size="md" showStatus status="away" />
            }
            onPress={() => {}}
          />
          <ListItem
            title="Bob Wilson"
            subtitle="Offline"
            leftContent={
              <Avatar name="Bob Wilson" size="md" showStatus status="offline" />
            }
            onPress={() => {}}
            showSeparator={false}
          />
        </ListSection>

        {/* Settings-style List */}
        <ListSection
          title="Account"
          footer="Manage your account settings and preferences."
          className="mb-6"
        >
          <ListItem
            title="Email"
            subtitle="john.doe@example.com"
            leftIcon="mail"
            onPress={() => {}}
          />
          <ListItem
            title="Password"
            subtitle="Last changed 30 days ago"
            leftIcon="lock-closed"
            onPress={() => {}}
          />
          <ListItem
            title="Two-Factor Authentication"
            subtitle="Enabled"
            leftIcon="shield"
            rightContent={<Badge variant="success">On</Badge>}
            onPress={() => {}}
            showSeparator={false}
          />
        </ListSection>

        {/* Disabled Items */}
        <ListSection title="States" className="mb-6">
          <ListItem
            title="Disabled Item"
            subtitle="This item cannot be pressed"
            leftIcon="ban"
            disabled
            onPress={() => {}}
            showSeparator={false}
          />
        </ListSection>

        <Divider spacing="lg" />

        <Text variant="caption" color="muted" className="text-center">
          All list items use centralized theme styling
        </Text>
      </View>
    </HeaderLayout>
  );
}
