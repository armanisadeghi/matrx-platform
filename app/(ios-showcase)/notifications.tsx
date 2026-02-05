/**
 * iOS Notifications Demo
 *
 * Demonstrates iOS notification patterns:
 * - In-app notification banners
 * - Badge counts on icons
 * - Bottom sheets with glass effect
 * - Action sheets
 * - Floating action bars
 */

import { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text, Card, Button, Badge, Avatar } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
import { HeaderLayout } from "@/components/layouts";
import {
  NotificationBanner,
  Sheet,
  ActionSheet,
  FloatingBar,
  AppIcon,
} from "@/components/ios";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";

export default function NotificationsDemo() {
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();

  // State for various demos
  const [showSheet, setShowSheet] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [badgeCounts, setBadgeCounts] = useState({
    messages: 5,
    mail: 12,
    notifications: 3,
  });

  // Demo notification triggers
  const triggerMessageNotification = () => {
    haptics.light();
    setShowNotificationBanner(true);
  };

  const triggerMailNotification = () => {
    haptics.light();
    setShowNotificationBanner(true);
  };

  const triggerCalendarNotification = () => {
    haptics.light();
    setShowNotificationBanner(true);
  };

  // Increment badge count
  const incrementBadge = (key: keyof typeof badgeCounts) => {
    haptics.light();
    setBadgeCounts((prev) => ({
      ...prev,
      [key]: prev[key] + 1,
    }));
  };

  // Clear badge count
  const clearBadge = (key: keyof typeof badgeCounts) => {
    haptics.light();
    setBadgeCounts((prev) => ({
      ...prev,
      [key]: 0,
    }));
  };

  return (
    <View className="flex-1 bg-background">
      <HeaderLayout
        header={{
          title: "Notifications Demo",
          showBackButton: true,
        }}
        safeAreaEdges={["bottom"]}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 py-4">
            {/* In-App Notifications Section */}
            <Text variant="overline" color="secondary" className="mb-3 ml-1">
              In-App Notifications
            </Text>

            <Card variant="outlined" className="mb-4">
              <Text variant="label" className="mb-3">
                Trigger Notification Banners
              </Text>
              <View className="gap-2">
                <Button
                  variant="primary"
                  onPress={triggerMessageNotification}
                  leftIcon={<Ionicons name="chatbubble-ellipses" size={18} color="#FFFFFF" />}
                >
                  Message Notification
                </Button>
                <Button
                  variant="secondary"
                  onPress={triggerMailNotification}
                  leftIcon={<Ionicons name="mail" size={18} color={colors.foreground.DEFAULT} />}
                >
                  Mail Notification
                </Button>
                <Button
                  variant="outline"
                  onPress={triggerCalendarNotification}
                  leftIcon={<Ionicons name="calendar" size={18} color={colors.primary.DEFAULT} />}
                >
                  Calendar Reminder
                </Button>
              </View>
            </Card>

            {/* Badge Counts Section */}
            <Text variant="overline" color="secondary" className="mb-3 ml-1 mt-4">
              Badge Counts
            </Text>

            <Card variant="glass" className="mb-4">
              <Text variant="label" className="mb-4">
                App Icons with Badges
              </Text>
              <View className="flex-row justify-around mb-4">
                <AppIcon
                  label="Messages"
                  icon="chatbubble-ellipses"
                  color="#34C759"
                  badgeCount={badgeCounts.messages}
                  onPress={() => clearBadge("messages")}
                />
                <AppIcon
                  label="Mail"
                  icon="mail"
                  color="#007AFF"
                  badgeCount={badgeCounts.mail}
                  onPress={() => clearBadge("mail")}
                />
                <AppIcon
                  label="Alerts"
                  icon="notifications"
                  color="#FF3B30"
                  badgeCount={badgeCounts.notifications}
                  onPress={() => clearBadge("notifications")}
                />
              </View>
              <Text variant="caption" color="muted" className="text-center mb-3">
                Tap icons to clear badges
              </Text>
              <View className="flex-row gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onPress={() => incrementBadge("messages")}
                >
                  +Message
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onPress={() => incrementBadge("mail")}
                >
                  +Mail
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onPress={() => incrementBadge("notifications")}
                >
                  +Alert
                </Button>
              </View>
            </Card>

            {/* Sheets Section */}
            <Text variant="overline" color="secondary" className="mb-3 ml-1 mt-4">
              Sheets & Action Sheets
            </Text>

            <Card variant="outlined" className="mb-4">
              <View className="gap-2">
                <Button
                  variant="primary"
                  onPress={() => {
                    haptics.light();
                    setShowSheet(true);
                  }}
                  leftIcon={<Ionicons name="layers" size={18} color="#FFFFFF" />}
                >
                  Show Bottom Sheet
                </Button>
                <Button
                  variant="secondary"
                  onPress={() => {
                    haptics.light();
                    setShowActionSheet(true);
                  }}
                  leftIcon={<Ionicons name="list" size={18} color={colors.foreground.DEFAULT} />}
                >
                  Show Action Sheet
                </Button>
              </View>
            </Card>

            {/* Floating Controls Section */}
            <Text variant="overline" color="secondary" className="mb-3 ml-1 mt-4">
              Floating Controls
            </Text>

            <Card variant="outlined" className="mb-4">
              <View className="gap-2">
                <Button
                  variant={showFloatingBar ? "destructive" : "primary"}
                  onPress={() => {
                    haptics.light();
                    setShowFloatingBar(!showFloatingBar);
                  }}
                  leftIcon={
                    <Ionicons
                      name={showFloatingBar ? "close" : "menu"}
                      size={18}
                      color="#FFFFFF"
                    />
                  }
                >
                  {showFloatingBar ? "Hide Floating Bar" : "Show Floating Bar"}
                </Button>
              </View>
            </Card>

            {/* Badge Variants */}
            <Text variant="overline" color="secondary" className="mb-3 ml-1 mt-4">
              Badge Variants
            </Text>

            <Card variant="outlined" className="mb-4">
              <Text variant="label" className="mb-3">
                Badge Styles
              </Text>
              <View className="flex-row flex-wrap gap-3">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="primary" count={5} />
                <Badge variant="error" count={99} />
                <Badge variant="primary" count={150} maxCount={99} />
              </View>
            </Card>

            {/* Status Indicators */}
            <Text variant="overline" color="secondary" className="mb-3 ml-1 mt-4">
              Status Indicators
            </Text>

            <Card variant="outlined">
              <Text variant="label" className="mb-3">
                Avatar Status
              </Text>
              <View className="flex-row gap-4">
                <View className="items-center">
                  <Avatar name="John" showStatus status="online" size="lg" />
                  <Text variant="caption" color="muted" className="mt-1">
                    Online
                  </Text>
                </View>
                <View className="items-center">
                  <Avatar name="Sarah" showStatus status="away" size="lg" />
                  <Text variant="caption" color="muted" className="mt-1">
                    Away
                  </Text>
                </View>
                <View className="items-center">
                  <Avatar name="Mike" showStatus status="busy" size="lg" />
                  <Text variant="caption" color="muted" className="mt-1">
                    Busy
                  </Text>
                </View>
                <View className="items-center">
                  <Avatar name="Lisa" showStatus status="offline" size="lg" />
                  <Text variant="caption" color="muted" className="mt-1">
                    Offline
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>
      </HeaderLayout>

      {/* Notification Banner */}
      <NotificationBanner
        visible={showNotificationBanner}
        onDismiss={() => setShowNotificationBanner(false)}
        title="Messages"
        message="John Appleseed: Hey! Are you free for a call?"
        subtitle="now"
        icon="chatbubble-ellipses"
        iconColor="#34C759"
      />

      {/* Bottom Sheet */}
      <Sheet
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        title="Share"
        snapPoints={[0.4, 0.7]}
      >
        <View className="px-4 py-4">
          {/* Share targets */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <View className="flex-row gap-4">
              {["AirDrop", "Messages", "Mail", "Notes", "Copy"].map((action) => (
                <View key={action} className="items-center">
                  <View className="w-14 h-14 rounded-full bg-surface-elevated items-center justify-center mb-1">
                    <Ionicons
                      name={
                        action === "AirDrop"
                          ? "share"
                          : action === "Messages"
                          ? "chatbubble-ellipses"
                          : action === "Mail"
                          ? "mail"
                          : action === "Notes"
                          ? "document-text"
                          : "copy"
                      }
                      size={28}
                      color={colors.primary.DEFAULT}
                    />
                  </View>
                  <Text variant="caption">{action}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Actions */}
          <View className="gap-2">
            {["Add to Reading List", "Add Bookmark", "Add to Favorites", "Find on Page"].map(
              (action, index) => (
                <Pressable
                  key={action}
                  onPress={() => {
                    haptics.light();
                    setShowSheet(false);
                  }}
                  className="flex-row items-center py-3 px-4 bg-surface-elevated rounded-xl"
                >
                  <Ionicons
                    name={
                      index === 0
                        ? "glasses"
                        : index === 1
                        ? "bookmark"
                        : index === 2
                        ? "star"
                        : "search"
                    }
                    size={20}
                    color={colors.foreground.DEFAULT}
                  />
                  <Text variant="body" className="ml-3">
                    {action}
                  </Text>
                </Pressable>
              )
            )}
          </View>
        </View>
      </Sheet>

      {/* Action Sheet */}
      <ActionSheet
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        title="Photo Options"
        message="Choose what you'd like to do with this photo"
        options={[
          {
            label: "Save to Photos",
            icon: "images",
            onPress: () => haptics.success(),
          },
          {
            label: "Copy Photo",
            icon: "copy",
            onPress: () => haptics.light(),
          },
          {
            label: "Share...",
            icon: "share",
            onPress: () => haptics.light(),
          },
          {
            label: "Delete Photo",
            icon: "trash",
            destructive: true,
            onPress: () => haptics.warning(),
          },
          {
            label: "Cancel",
            isCancel: true,
          },
        ]}
      />

      {/* Floating Bar */}
      <FloatingBar
        visible={showFloatingBar}
        actions={[
          {
            id: "delete",
            icon: "trash-outline",
            destructive: true,
            onPress: () => haptics.warning(),
          },
          {
            id: "folder",
            icon: "folder-outline",
            onPress: () => haptics.light(),
          },
          {
            id: "share",
            icon: "share-outline",
            onPress: () => haptics.light(),
          },
        ]}
      />

    </View>
  );
}
