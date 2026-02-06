/**
 * Feedback Demo Page
 *
 * Showcases badges, spinners, and other feedback components.
 */

import { useState } from "react";
import { View } from "react-native";
import {
  Text,
  Card,
  Button,
  Badge,
  BadgeGroup,
  Spinner,
  LoadingOverlay,
  Divider,
  IconButton,
} from "@/components/ui";
import { HeaderLayout } from "@/components/layouts";

export default function FeedbackDemo() {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <HeaderLayout
      header={{
        title: "Feedback",
        showBackButton: true,
      }}
    >
      <View className="px-4 py-4">
        <Text variant="body" color="secondary" className="mb-6">
          Feedback components for indicating status, progress, and notifications.
        </Text>

        {/* Badge Variants */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Badge Variants
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </View>
        </Card>

        {/* Badge Sizes */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Badge Sizes
          </Text>
          <View className="flex-row items-center gap-3">
            <Badge size="sm" variant="primary">
              Small
            </Badge>
            <Badge size="md" variant="primary">
              Medium
            </Badge>
            <Badge size="lg" variant="primary">
              Large
            </Badge>
          </View>
        </Card>

        {/* Count Badges */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Count Badges
          </Text>
          <View className="flex-row items-center gap-3">
            <Badge variant="error">{5}</Badge>
            <Badge variant="error">{42}</Badge>
            <Badge variant="error" maxCount={99}>
              {150}
            </Badge>
          </View>
          <Text variant="caption" color="muted" className="mt-2">
            maxCount limits display (default: 99)
          </Text>
        </Card>

        {/* Dot Badges */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Dot Badges
          </Text>
          <View className="flex-row items-center gap-4">
            <Badge variant="success" dot />
            <Badge variant="warning" dot />
            <Badge variant="error" dot />
            <Badge variant="info" dot />
          </View>
        </Card>

        {/* Badge Groups */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Badge Groups (with content)
          </Text>
          <View className="flex-row items-center gap-6">
            <BadgeGroup badge={3} badgeProps={{ variant: "error", size: "sm" }}>
              <IconButton icon="notifications" variant="tinted" />
            </BadgeGroup>
            <BadgeGroup badge={12} badgeProps={{ variant: "primary", size: "sm" }}>
              <IconButton icon="mail" variant="tinted" />
            </BadgeGroup>
            <BadgeGroup
              badge={undefined}
              badgeProps={{ variant: "success", dot: true }}
              position="bottom-right"
            >
              <IconButton icon="person" variant="tinted" />
            </BadgeGroup>
          </View>
        </Card>

        <Divider spacing="lg" />

        {/* Spinners */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Spinners
          </Text>
          <View className="flex-row items-center gap-6">
            <View className="items-center">
              <Spinner size="sm" />
              <Text variant="caption" color="muted" className="mt-2">
                Small
              </Text>
            </View>
            <View className="items-center">
              <Spinner size="md" />
              <Text variant="caption" color="muted" className="mt-2">
                Medium
              </Text>
            </View>
            <View className="items-center">
              <Spinner size="lg" />
              <Text variant="caption" color="muted" className="mt-2">
                Large
              </Text>
            </View>
          </View>
        </Card>

        {/* Spinner Colors */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Spinner Colors
          </Text>
          <View className="flex-row items-center gap-6">
            <Spinner color="primary" />
            <Spinner color="secondary" />
            <Spinner color="muted" />
            <View className="bg-primary p-2 rounded-lg">
              <Spinner color="white" />
            </View>
          </View>
        </Card>

        {/* Loading Overlay */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Loading Overlay
          </Text>
          <Button onPress={() => setShowOverlay(true)}>Show Loading Overlay</Button>
          <Text variant="caption" color="muted" className="mt-2">
            Tap to show a full-screen loading overlay
          </Text>
        </Card>

        <LoadingOverlay
          visible={showOverlay}
          message="Loading..."
          dismissible
          onDismiss={() => setShowOverlay(false)}
        />

        <Divider spacing="lg" />

        <Text variant="caption" color="muted" className="text-center">
          All feedback components use centralized theme colors
        </Text>
      </View>
    </HeaderLayout>
  );
}
