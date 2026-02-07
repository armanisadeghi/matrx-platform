/**
 * Home Tab — iOS native style
 *
 * Uses the same layout patterns as the iOS Settings showcase:
 * - GlassContainer header with safe area insets
 * - SettingsGroup/SettingsRow for grouped sections
 * - bg-background base, bg-surface rows
 * - Proper ScrollView padding for tab bar
 */

import { View, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text, Switch, Avatar } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
import {
    SettingsRow,
    SettingsGroup,
    SettingsProfile,
    SettingsLargeTitle,
} from "@/components/ios";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";

export default function HomeTab() {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const haptics = useHaptics();
    const router = useRouter();
    const { isDark, toggleColorScheme } = useAppColorScheme();

    return (
        <View className="flex-1 bg-background">
            {/* Glass Header */}
            <GlassContainer intensity="medium" tint="surface" borderRadius="none">
                <View style={{ paddingTop: insets.top }} className="px-4 pb-3">
                    <View className="flex-row items-center justify-between h-11">
                        <View style={{ width: 60 }} />
                        <Text variant="label" style={{ fontWeight: "600" }}>
                            Home
                        </Text>
                        <View style={{ width: 60 }} className="items-end">
                            <Link href="/(demo)" asChild>
                                <View className="flex-row items-center">
                                    <Text variant="body" style={{ color: colors.primary.DEFAULT }}>
                                        Demo
                                    </Text>
                                </View>
                            </Link>
                        </View>
                    </View>
                </View>
            </GlassContainer>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile */}
                <View className="px-4 py-4">
                    <SettingsProfile
                        name="John Appleseed"
                        subtitle="Apple Account, iCloud, Media & Purchases"
                        avatarInitials="JA"
                        onPress={() => haptics.light()}
                    />
                </View>

                {/* iOS 26 Showcase */}
                <SettingsGroup>
                    <SettingsRow
                        label="iOS 26 Showcase"
                        icon="phone-portrait"
                        iconColor="#007AFF"
                        onPress={() => {
                            haptics.light();
                            router.push("/(ios-showcase)/" as any);
                        }}
                    />
                    <SettingsRow
                        label="Component Demo"
                        icon="cube"
                        iconColor="#AF52DE"
                        onPress={() => {
                            haptics.light();
                            router.push("/(demo)" as any);
                        }}
                        isLast
                    />
                </SettingsGroup>

                {/* Quick Actions */}
                <SettingsGroup header="Quick Actions">
                    <SettingsRow
                        label="Create New"
                        icon="add-circle"
                        iconColor="#34C759"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Favorites"
                        icon="star"
                        iconColor="#FF9500"
                        value="12 items"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Downloads"
                        icon="cloud-download"
                        iconColor="#007AFF"
                        value="3 pending"
                        onPress={() => haptics.light()}
                        isLast
                    />
                </SettingsGroup>

                {/* Recent Activity */}
                <SettingsGroup header="Recent Activity">
                    <SettingsRow
                        label="Project completed"
                        icon="checkmark-circle"
                        iconColor="#34C759"
                        value="2h ago"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="New message"
                        icon="chatbubble"
                        iconColor="#007AFF"
                        value="5h ago"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Achievement unlocked"
                        icon="star"
                        iconColor="#FF9500"
                        value="Yesterday"
                        onPress={() => haptics.light()}
                        isLast
                    />
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
                        onPress={() => haptics.light()}
                        value="On"
                    />
                    <SettingsRow
                        label="General"
                        icon="settings"
                        iconColor="#8E8E93"
                        onPress={() => haptics.light()}
                        isLast
                    />
                </SettingsGroup>

                {/* About */}
                <SettingsGroup>
                    <SettingsRow
                        label="About"
                        icon="information-circle"
                        iconColor="#007AFF"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Help & Support"
                        icon="help-circle"
                        iconColor="#34C759"
                        onPress={() => haptics.light()}
                        isLast
                    />
                </SettingsGroup>
            </ScrollView>
        </View>
    );
}
