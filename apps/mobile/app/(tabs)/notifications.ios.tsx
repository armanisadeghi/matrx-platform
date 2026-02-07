/**
 * Notifications Tab — iOS native style
 *
 * Uses the same layout patterns as the iOS Settings showcase:
 * - GlassContainer header with title
 * - SettingsGroup/SettingsRow for notification sections
 * - Proper grouped inset list style
 */

import { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text, Switch } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
import {
    SettingsRow,
    SettingsGroup,
    SettingsLargeTitle,
    SettingsSectionHeader,
} from "@/components/ios";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";

export default function NotificationsTab() {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const haptics = useHaptics();

    return (
        <View className="flex-1 bg-background">
            {/* Glass Header */}
            <GlassContainer intensity="medium" tint="surface" borderRadius="none">
                <View style={{ paddingTop: insets.top }} className="px-4 pb-3">
                    <View className="flex-row items-center justify-between h-11">
                        <View style={{ width: 60 }} />
                        <Text variant="label" style={{ fontWeight: "600" }}>
                            Notifications
                        </Text>
                        <View style={{ width: 60 }} className="items-end">
                            <Pressable onPress={() => haptics.light()}>
                                <Text variant="body" style={{ color: colors.primary.DEFAULT }}>
                                    Edit
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </GlassContainer>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Today */}
                <SettingsGroup header="Today">
                    <SettingsRow
                        label="New message from John"
                        icon="chatbubble-ellipses"
                        iconColor="#34C759"
                        value="2m ago"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Jane liked your post"
                        icon="heart"
                        iconColor="#FF2D55"
                        value="1h ago"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Bob started following you"
                        icon="person-add"
                        iconColor="#007AFF"
                        value="3h ago"
                        onPress={() => haptics.light()}
                        isLast
                    />
                </SettingsGroup>

                {/* Yesterday */}
                <SettingsGroup header="Yesterday">
                    <SettingsRow
                        label="Project review completed"
                        icon="checkmark-circle"
                        iconColor="#34C759"
                        value="4:30 PM"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Team meeting reminder"
                        icon="calendar"
                        iconColor="#FF3B30"
                        value="2:00 PM"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="System update available"
                        icon="cloud-download"
                        iconColor="#007AFF"
                        value="11:00 AM"
                        onPress={() => haptics.light()}
                        isLast
                    />
                </SettingsGroup>

                {/* This Week */}
                <SettingsGroup header="This Week">
                    <SettingsRow
                        label="10 tasks completed!"
                        icon="star"
                        iconColor="#FF9500"
                        value="3 days ago"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Data backed up"
                        icon="cloud-upload"
                        iconColor="#5856D6"
                        value="5 days ago"
                        onPress={() => haptics.light()}
                        isLast
                    />
                </SettingsGroup>

                {/* Notification Settings */}
                <SettingsGroup header="Settings">
                    <SettingsRow
                        label="Show Previews"
                        icon="eye"
                        iconColor="#8E8E93"
                        value="When Unlocked"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Notification Grouping"
                        icon="layers"
                        iconColor="#5856D6"
                        value="Automatic"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Scheduled Summary"
                        icon="time"
                        iconColor="#FF9500"
                        hasSwitch
                        switchValue={false}
                        onSwitchChange={() => haptics.light()}
                        isLast
                    />
                </SettingsGroup>

                {/* Footer */}
                <Text variant="caption" color="muted" className="text-center px-4 mt-2">
                    Notifications are grouped by app and time.
                </Text>
            </ScrollView>
        </View>
    );
}
