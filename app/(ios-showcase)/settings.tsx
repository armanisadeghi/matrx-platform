/**
 * iOS Settings Demo
 *
 * Replicates the iOS Settings app with:
 * - Profile section (Apple ID style)
 * - Grouped settings sections
 * - Toggle switches
 * - Navigation to sub-pages
 * - Search functionality
 */

import { useState } from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, Switch } from "@/components/ui";
import { HeaderLayout } from "@/components/layouts";
import {
  SettingsRow,
  SettingsGroup,
  SettingsProfile,
  SettingsSearch,
} from "@/components/ios";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";

// Sub-page component for demonstrating navigation
function SettingsSubPage({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <HeaderLayout
      header={{
        title,
        showBackButton: true,
        onBackPress: onBack,
      }}
      safeAreaEdges={["bottom"]}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="py-4">{children}</View>
      </ScrollView>
    </HeaderLayout>
  );
}

// Wi-Fi Settings Sub-page
function WiFiSettings({ onBack }: { onBack: () => void }) {
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const { colors } = useTheme();
  const haptics = useHaptics();

  const networks = [
    { name: "Home Network", connected: true, secured: true },
    { name: "Office WiFi", connected: false, secured: true },
    { name: "Coffee Shop", connected: false, secured: false },
    { name: "Guest Network", connected: false, secured: true },
  ];

  return (
    <SettingsSubPage title="Wi-Fi" onBack={onBack}>
      <SettingsGroup>
        <SettingsRow
          label="Wi-Fi"
          hasSwitch
          switchValue={wifiEnabled}
          onSwitchChange={(v) => {
            haptics.light();
            setWifiEnabled(v);
          }}
          isLast
        />
      </SettingsGroup>

      {wifiEnabled && (
        <>
          <SettingsGroup header="Networks">
            {networks.map((network, index) => (
              <SettingsRow
                key={network.name}
                label={network.name}
                icon={network.secured ? "lock-closed" : "wifi"}
                iconColor={colors.primary.DEFAULT}
                value={network.connected ? "Connected" : undefined}
                rightContent={
                  network.connected ? (
                    <View className="flex-row items-center">
                      <Text variant="body" color="secondary" className="mr-2">
                        Connected
                      </Text>
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={colors.primary.DEFAULT}
                      />
                    </View>
                  ) : undefined
                }
                showChevron={!network.connected}
                onPress={() => haptics.light()}
                isLast={index === networks.length - 1}
              />
            ))}
          </SettingsGroup>

          <SettingsGroup>
            <SettingsRow
              label="Ask to Join Networks"
              hasSwitch
              switchValue={true}
              onSwitchChange={() => haptics.light()}
              isLast
            />
          </SettingsGroup>
        </>
      )}
    </SettingsSubPage>
  );
}

// Display Settings Sub-page
function DisplaySettings({ onBack }: { onBack: () => void }) {
  const { isDark, toggleColorScheme } = useAppColorScheme();
  const [autoBrightness, setAutoBrightness] = useState(true);
  const [trueTone, setTrueTone] = useState(true);
  const haptics = useHaptics();

  return (
    <SettingsSubPage title="Display & Brightness" onBack={onBack}>
      <SettingsGroup header="Appearance">
        <View className="flex-row justify-center gap-8 py-4 bg-surface">
          <View
            className={`items-center p-4 rounded-xl ${!isDark ? "border-2 border-primary" : ""}`}
            onTouchEnd={() => {
              if (isDark) {
                haptics.light();
                toggleColorScheme();
              }
            }}
          >
            <View className="w-16 h-24 rounded-lg bg-white border border-border mb-2" />
            <Text variant="caption">Light</Text>
          </View>
          <View
            className={`items-center p-4 rounded-xl ${isDark ? "border-2 border-primary" : ""}`}
            onTouchEnd={() => {
              if (!isDark) {
                haptics.light();
                toggleColorScheme();
              }
            }}
          >
            <View className="w-16 h-24 rounded-lg bg-gray-800 border border-border mb-2" />
            <Text variant="caption">Dark</Text>
          </View>
        </View>
        <SettingsRow
          label="Automatic"
          hasSwitch
          switchValue={false}
          onSwitchChange={() => haptics.light()}
          isLast
        />
      </SettingsGroup>

      <SettingsGroup>
        <SettingsRow
          label="Auto-Brightness"
          hasSwitch
          switchValue={autoBrightness}
          onSwitchChange={(v) => {
            haptics.light();
            setAutoBrightness(v);
          }}
        />
        <SettingsRow
          label="True Tone"
          hasSwitch
          switchValue={trueTone}
          onSwitchChange={(v) => {
            haptics.light();
            setTrueTone(v);
          }}
          isLast
        />
      </SettingsGroup>

      <SettingsGroup header="Text Size">
        <SettingsRow
          label="Text Size"
          value="Default"
          onPress={() => haptics.light()}
        />
        <SettingsRow
          label="Bold Text"
          hasSwitch
          switchValue={false}
          onSwitchChange={() => haptics.light()}
          isLast
        />
      </SettingsGroup>
    </SettingsSubPage>
  );
}

// Notifications Settings Sub-page
function NotificationSettings({ onBack }: { onBack: () => void }) {
  const [showPreviews, setShowPreviews] = useState(true);
  const [scheduledSummary, setScheduledSummary] = useState(false);
  const haptics = useHaptics();
  const { colors } = useTheme();

  const apps = [
    { name: "Messages", icon: "chatbubble-ellipses", color: "#34C759", badges: 5 },
    { name: "Mail", icon: "mail", color: "#007AFF", badges: 12 },
    { name: "Calendar", icon: "calendar", color: "#FF3B30", badges: 0 },
    { name: "Photos", icon: "images", color: "#FFD60A", badges: 0 },
  ];

  return (
    <SettingsSubPage title="Notifications" onBack={onBack}>
      <SettingsGroup>
        <SettingsRow
          label="Show Previews"
          value="When Unlocked"
          onPress={() => haptics.light()}
        />
        <SettingsRow
          label="Scheduled Summary"
          hasSwitch
          switchValue={scheduledSummary}
          onSwitchChange={(v) => {
            haptics.light();
            setScheduledSummary(v);
          }}
          isLast
        />
      </SettingsGroup>

      <SettingsGroup
        header="Notification Style"
        footer="Choose how notifications appear on your Lock Screen."
      >
        {apps.map((app, index) => (
          <SettingsRow
            key={app.name}
            label={app.name}
            icon={app.icon as keyof typeof Ionicons.glyphMap}
            iconColor={app.color}
            rightContent={
              app.badges > 0 ? (
                <View className="flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-primary mr-2" />
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.foreground.muted}
                  />
                </View>
              ) : undefined
            }
            onPress={() => haptics.light()}
            isLast={index === apps.length - 1}
          />
        ))}
      </SettingsGroup>
    </SettingsSubPage>
  );
}

// Main Settings Page
export default function SettingsDemo() {
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();
  const { toggleColorScheme } = useAppColorScheme();
  const [currentPage, setCurrentPage] = useState<string | null>(null);

  // Settings state
  const [airplaneMode, setAirplaneMode] = useState(false);
  const [bluetooth, setBluetooth] = useState(true);
  const [cellular, setCellular] = useState(true);

  // Handle sub-page navigation
  if (currentPage === "wifi") {
    return <WiFiSettings onBack={() => setCurrentPage(null)} />;
  }
  if (currentPage === "display") {
    return <DisplaySettings onBack={() => setCurrentPage(null)} />;
  }
  if (currentPage === "notifications") {
    return <NotificationSettings onBack={() => setCurrentPage(null)} />;
  }

  return (
    <HeaderLayout
      header={{
        title: "Settings",
        showBackButton: true,
      }}
      safeAreaEdges={["bottom"]}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <SettingsSearch placeholder="Search" className="py-2" />

        {/* Profile Section */}
        <View className="px-4 pb-4">
          <SettingsProfile
            name="John Appleseed"
            subtitle="Apple ID, iCloud, Media & Purchases"
            avatarInitials="JA"
            onPress={() => haptics.light()}
          />
        </View>

        {/* Connectivity Section */}
        <SettingsGroup>
          <SettingsRow
            label="Airplane Mode"
            icon="airplane"
            iconColor="#FF9500"
            hasSwitch
            switchValue={airplaneMode}
            onSwitchChange={(v) => {
              haptics.light();
              setAirplaneMode(v);
            }}
          />
          <SettingsRow
            label="Wi-Fi"
            icon="wifi"
            iconColor="#007AFF"
            value="Home Network"
            onPress={() => {
              haptics.light();
              setCurrentPage("wifi");
            }}
          />
          <SettingsRow
            label="Bluetooth"
            icon="bluetooth"
            iconColor="#007AFF"
            value={bluetooth ? "On" : "Off"}
            onPress={() => haptics.light()}
          />
          <SettingsRow
            label="Cellular"
            icon="cellular"
            iconColor="#34C759"
            value={cellular ? "On" : "Off"}
            onPress={() => haptics.light()}
          />
          <SettingsRow
            label="Personal Hotspot"
            icon="link"
            iconColor="#34C759"
            value="Off"
            onPress={() => haptics.light()}
            isLast
          />
        </SettingsGroup>

        {/* Notifications & Sounds */}
        <SettingsGroup>
          <SettingsRow
            label="Notifications"
            icon="notifications"
            iconColor="#FF3B30"
            onPress={() => {
              haptics.light();
              setCurrentPage("notifications");
            }}
          />
          <SettingsRow
            label="Sounds & Haptics"
            icon="volume-high"
            iconColor="#FF2D55"
            onPress={() => haptics.light()}
          />
          <SettingsRow
            label="Focus"
            icon="moon"
            iconColor="#AF52DE"
            onPress={() => haptics.light()}
          />
          <SettingsRow
            label="Screen Time"
            icon="hourglass"
            iconColor="#AF52DE"
            onPress={() => haptics.light()}
            isLast
          />
        </SettingsGroup>

        {/* General Section */}
        <SettingsGroup>
          <SettingsRow
            label="General"
            icon="settings"
            iconColor="#8E8E93"
            onPress={() => haptics.light()}
          />
          <SettingsRow
            label="Control Center"
            icon="toggle"
            iconColor="#8E8E93"
            onPress={() => haptics.light()}
          />
          <SettingsRow
            label="Display & Brightness"
            icon="sunny"
            iconColor="#007AFF"
            onPress={() => {
              haptics.light();
              setCurrentPage("display");
            }}
          />
          <SettingsRow
            label="Home Screen"
            icon="apps"
            iconColor="#007AFF"
            onPress={() => haptics.light()}
          />
          <SettingsRow
            label="Accessibility"
            icon="accessibility"
            iconColor="#007AFF"
            onPress={() => haptics.light()}
            isLast
          />
        </SettingsGroup>

        {/* Privacy */}
        <SettingsGroup>
          <SettingsRow
            label="Privacy & Security"
            icon="hand-left"
            iconColor="#007AFF"
            onPress={() => haptics.light()}
            isLast
          />
        </SettingsGroup>

        {/* Apps */}
        <SettingsGroup header="Apps">
          <SettingsRow
            label="App Store"
            icon="apps"
            iconColor="#007AFF"
            onPress={() => haptics.light()}
          />
          <SettingsRow
            label="Wallet"
            icon="wallet"
            iconColor="#000000"
            onPress={() => haptics.light()}
            isLast
          />
        </SettingsGroup>

        {/* Developer */}
        <SettingsGroup header="Developer">
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
            isLast
          />
        </SettingsGroup>
      </ScrollView>
    </HeaderLayout>
  );
}
