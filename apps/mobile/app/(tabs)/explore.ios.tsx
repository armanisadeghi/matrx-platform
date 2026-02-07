/**
 * Explore Tab — iOS native style
 *
 * Uses the same layout patterns as the iOS Settings showcase:
 * - GlassContainer header with large title + search
 * - SettingsGroup/SettingsRow for categories and items
 * - Proper spacing and safe areas
 */

import { useState } from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
import {
    SettingsRow,
    SettingsGroup,
    SettingsSearch,
    SettingsLargeTitle,
    SettingsSectionHeader,
} from "@/components/ios";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";

export default function ExploreTab() {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const haptics = useHaptics();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <View className="flex-1 bg-background">
            {/* Glass Header with Large Title */}
            <GlassContainer intensity="medium" tint="surface" borderRadius="none">
                <View style={{ paddingTop: insets.top }} className="px-4 pb-3">
                    <View className="flex-row items-center justify-between h-11">
                        <View style={{ width: 60 }} />
                        <View style={{ width: 60 }} />
                    </View>
                    <SettingsLargeTitle title="Explore" className="px-0 pt-2 pb-0" />
                </View>
            </GlassContainer>

            {/* Search */}
            <View className="px-4 py-2">
                <SettingsSearch
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Featured */}
                <SettingsGroup header="Featured">
                    <SettingsRow
                        label="Getting Started"
                        icon="rocket"
                        iconColor="#007AFF"
                        value="Guide"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Documentation"
                        icon="book"
                        iconColor="#5856D6"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="API Reference"
                        icon="code-slash"
                        iconColor="#FF9500"
                        onPress={() => haptics.light()}
                        isLast
                    />
                </SettingsGroup>

                {/* Categories */}
                <SettingsGroup header="Categories">
                    <SettingsRow
                        label="Design"
                        icon="color-palette"
                        iconColor="#FF2D55"
                        value="24 articles"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Development"
                        icon="code-slash"
                        iconColor="#5856D6"
                        value="42 articles"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Marketing"
                        icon="megaphone"
                        iconColor="#FF9500"
                        value="18 articles"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Analytics"
                        icon="bar-chart"
                        iconColor="#34C759"
                        value="31 articles"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Finance"
                        icon="cash"
                        iconColor="#007AFF"
                        value="15 articles"
                        onPress={() => haptics.light()}
                        isLast
                    />
                </SettingsGroup>

                {/* Popular */}
                <SettingsGroup header="Trending">
                    <SettingsRow
                        label="Project Alpha"
                        icon="trending-up"
                        iconColor="#FF2D55"
                        value="1.2k views"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Project Beta"
                        icon="flash"
                        iconColor="#FF9500"
                        value="856 views"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Project Gamma"
                        icon="star"
                        iconColor="#FFD60A"
                        value="642 views"
                        onPress={() => haptics.light()}
                        isLast
                    />
                </SettingsGroup>

                {/* Resources */}
                <SettingsGroup header="Resources">
                    <SettingsRow
                        label="Video Tutorials"
                        icon="play-circle"
                        iconColor="#FF3B30"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Community Forum"
                        icon="people"
                        iconColor="#34C759"
                        onPress={() => haptics.light()}
                    />
                    <SettingsRow
                        label="Release Notes"
                        icon="document-text"
                        iconColor="#8E8E93"
                        onPress={() => haptics.light()}
                        isLast
                    />
                </SettingsGroup>
            </ScrollView>
        </View>
    );
}
