/**
 * Profile Tab — iOS native style
 *
 * Uses the same layout patterns as the iOS Settings showcase:
 * - GlassContainer header with title
 * - SettingsProfile for the Apple Account-style profile card
 * - SettingsGroup/SettingsRow for all settings sections
 * - Exact same bg-background/bg-surface pattern
 */

import { View, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text, Switch } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
import {
    SettingsRow,
    SettingsGroup,
    SettingsProfile,
    SettingsLargeTitle,
    SettingsInfoRow,
} from "@/components/ios";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";

export default function ProfileTab() {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const haptics = useHaptics();
    const router = useRouter();
    const { isDark, toggleColorScheme } = useAppColorScheme();

    return (
        <View className="flex-1 bg-background">
            {/* Glass Header with Large Title */}
            <GlassContainer intensity="medium" tint="surface" borderRadius="none">
                <View style={{ paddingTop: insets.top }} className="px-4 pb-3">
                    <View className="flex-row items-center justify-between h-11">
                        <View style={{ width: 60 }} />
                        <View style={{ width: 60 }} className="items-end">
                            <Link href="/(demo)" asChild>
                                <Text variant="body" style={{ color: colors.primary.DEFAULT }}>
                                    Edit
                                </Text>
                            </Link>
                        </View>
                    </View>
                    <SettingsLargeTitle title="Profile" className="px-0 pt-2 pb-0" />
                </View>
            </GlassContainer>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Card */}
                <View className="px-4 py-4">
                    <SettingsProfile
                        name="John Appleseed"
                        subtitle="john.appleseed@example.com"
                        avatarInitials="JA"
                        onPress={() => haptics.light()}
                    />
                </View>

                {/* Account Info */}
                <SettingsGroup>
                    <SettingsInfoRow label="Member Since" value="January 2024" />
                    <SettingsInfoRow label="Plan" value="Pro" valueColor="primary" />
                    <SettingsInfoRow label="Projects" value="128" />
                    <SettingsInfoRow label="Storage" value="4.2 GB of 10 GB" isLast />
                </SettingsGroup>

                {/* Preferences */}
                <SettingsGroup header="Preferences">
                    <SettingsRow
                        label="Dark Mode"
                        icon="moon"
                        iconColor="#5856D6"
                        hasSwitch
                        switchValue={isDark}
                        onSwitchChange={() => {
                            haptics.light();
                            toggleColorScheme();
                        }}
                    />
                    <SettingsRow
                        label="Notifications"
                        icon="notifications"
                        iconColor="#FF3B30"
                        value="Enabled"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Language"
                        icon="language"
                        iconColor="#007AFF"
                        value="English"
                        onPress={() => haptics.light()}
                        isLast
                    />
                </SettingsGroup>

                {/* Account */}
                <SettingsGroup header="Account">
                    <SettingsRow
                        label="Edit Profile"
                        icon="person"
                        iconColor="#007AFF"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Security"
                        icon="shield-checkmark"
                        iconColor="#34C759"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Privacy"
                        icon="lock-closed"
                        iconColor="#FF9500"
                        onPress={() => haptics.light()}
                        isLast
                    />
                </SettingsGroup>

                {/* Support */}
                <SettingsGroup header="Support">
                    <SettingsRow
                        label="Help Center"
                        icon="help-circle"
                        iconColor="#34C759"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Report a Problem"
                        icon="bug"
                        iconColor="#FF3B30"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Terms of Service"
                        icon="document-text"
                        iconColor="#8E8E93"
                        onPress={() => haptics.light()}
                        isLast
                    />
                </SettingsGroup>

                {/* Sign Out */}
                <SettingsGroup>
                    <SettingsRow
                        label="Sign Out"
                        destructive
                        showChevron={false}
                        onPress={() => haptics.light()}
                        isLast
                    />
                </SettingsGroup>

                {/* Version */}
                <Text variant="caption" color="muted" className="text-center px-4 mt-2">
                    Version 1.0.0 (Build 1)
                </Text>
            </ScrollView>
        </View>
    );
}
