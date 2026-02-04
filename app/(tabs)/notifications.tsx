/**
 * Notifications Tab
 *
 * Notification center screen.
 */

import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text, Card, Avatar, Badge, Button, Divider } from "@/components/ui";
import { HeaderLayout } from "@/components/layouts";
import { useTheme } from "@/hooks/useTheme";

interface NotificationItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
  unread?: boolean;
}

function NotificationItem({
  icon,
  iconColor,
  iconBg,
  title,
  description,
  time,
  unread = false,
}: NotificationItemProps) {
  return (
    <Card variant={unread ? "filled" : "outlined"} className="mb-3">
      <View className="flex-row">
        <View
          className={`w-10 h-10 rounded-full items-center justify-center mr-3`}
          style={{ backgroundColor: iconBg }}
        >
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text variant="label">{title}</Text>
            {unread && <Badge variant="primary" dot />}
          </View>
          <Text variant="bodySmall" color="secondary" className="mt-0.5">
            {description}
          </Text>
          <Text variant="caption" color="muted" className="mt-1">
            {time}
          </Text>
        </View>
      </View>
    </Card>
  );
}

export default function NotificationsTab() {
  const { colors } = useTheme();

  return (
    <HeaderLayout
      header={{
        title: "Notifications",
        rightContent: (
          <Button variant="ghost" size="sm">
            Mark all read
          </Button>
        ),
      }}
      safeAreaEdges={["bottom"]}
    >
      <View className="px-4 py-4">
        {/* Today */}
        <Text variant="overline" color="secondary" className="mb-3 ml-1">
          Today
        </Text>
        <NotificationItem
          icon="chatbubble"
          iconColor={colors.info.DEFAULT}
          iconBg={`${colors.info.DEFAULT}15`}
          title="New message"
          description="John Doe sent you a message"
          time="2 minutes ago"
          unread
        />
        <NotificationItem
          icon="heart"
          iconColor={colors.error.DEFAULT}
          iconBg={`${colors.error.DEFAULT}15`}
          title="New like"
          description="Jane Smith liked your post"
          time="1 hour ago"
          unread
        />
        <NotificationItem
          icon="person-add"
          iconColor={colors.success.DEFAULT}
          iconBg={`${colors.success.DEFAULT}15`}
          title="New follower"
          description="Bob Wilson started following you"
          time="3 hours ago"
        />

        {/* Yesterday */}
        <Text variant="overline" color="secondary" className="mb-3 ml-1 mt-4">
          Yesterday
        </Text>
        <NotificationItem
          icon="checkmark-circle"
          iconColor={colors.success.DEFAULT}
          iconBg={`${colors.success.DEFAULT}15`}
          title="Task completed"
          description="Project review was marked complete"
          time="Yesterday at 4:30 PM"
        />
        <NotificationItem
          icon="calendar"
          iconColor={colors.primary.DEFAULT}
          iconBg={`${colors.primary.DEFAULT}15`}
          title="Event reminder"
          description="Team meeting starts in 30 minutes"
          time="Yesterday at 2:00 PM"
        />

        {/* Older */}
        <Text variant="overline" color="secondary" className="mb-3 ml-1 mt-4">
          This Week
        </Text>
        <NotificationItem
          icon="star"
          iconColor={colors.warning.DEFAULT}
          iconBg={`${colors.warning.DEFAULT}15`}
          title="Achievement unlocked"
          description="You've completed 10 tasks!"
          time="3 days ago"
        />
        <NotificationItem
          icon="cloud-upload"
          iconColor={colors.secondary.DEFAULT}
          iconBg={`${colors.secondary.DEFAULT}15`}
          title="Backup complete"
          description="Your data has been backed up"
          time="5 days ago"
        />

        <Divider spacing="lg" />

        <Text variant="caption" color="muted" className="text-center">
          You're all caught up!
        </Text>
      </View>
    </HeaderLayout>
  );
}
