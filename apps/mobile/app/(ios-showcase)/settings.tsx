/**
 * iOS Settings Demo
 *
 * Replicates the iOS Settings app with:
 * - Large title header
 * - Profile section (Apple ID style)
 * - Grouped settings sections
 * - Toggle switches
 * - Navigation to sub-pages
 * - Floating search bar
 * - Hero cards, info rows, device rows
 */

import { useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, Switch } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
import {
  SettingsRow,
  SettingsGroup,
  SettingsProfile,
  SettingsLargeTitle,
  SettingsFloatingSearch,
  SettingsHeroCard,
  SettingsInfoRow,
  SettingsDeviceRow,
  SettingsProfileHeader,
  SettingsFamilyRow,
  SettingsSectionHeader,
} from "@/components/ios";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";

// Generic Sub-page wrapper component
function SettingsSubPage({
  title,
  onBack,
  children,
  showFloatingSearch = false,
  hasLargeTitle = false,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
  showFloatingSearch?: boolean;
  hasLargeTitle?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const haptics = useHaptics();

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <GlassContainer intensity="medium" tint="surface" borderRadius="none">
        <View style={{ paddingTop: insets.top }} className="px-4 pb-3">
          <View className="flex-row items-center justify-between h-11">
            <View
              className="flex-row items-center"
              onTouchEnd={() => {
                haptics.light();
                onBack();
              }}
            >
              <Ionicons name="chevron-back" size={28} color={colors.primary.DEFAULT} />
              <Text variant="body" style={{ color: colors.primary.DEFAULT }}>
                Back
              </Text>
            </View>
            {!hasLargeTitle && (
              <Text variant="label" style={{ fontWeight: "600" }}>
                {title}
              </Text>
            )}
            <View style={{ width: 60 }} />
          </View>
          {hasLargeTitle && (
            <Text variant="h1" style={{ fontSize: 34, fontWeight: "700" }} className="mt-2">
              {title}
            </Text>
          )}
        </View>
      </GlassContainer>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: showFloatingSearch ? 80 : 32 }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      {/* Floating Search (optional) */}
      {showFloatingSearch && <SettingsFloatingSearch />}
    </View>
  );
}

// Apple Account Sub-page
function AppleAccountPage({ onBack }: { onBack: () => void }) {
  const haptics = useHaptics();

  return (
    <SettingsSubPage title="Apple Account" onBack={onBack}>
      {/* Profile Header */}
      <SettingsProfileHeader
        name="John Appleseed"
        email="john.appleseed@icloud.com"
        onPress={() => haptics.light()}
      />

      {/* Account Settings */}
      <SettingsGroup>
        <SettingsRow
          label="Personal Information"
          icon="person"
          iconColor="#007AFF"
          onPress={() => haptics.light()}
        />
        <SettingsRow
          label="Sign-In & Security"
          icon="key"
          iconColor="#8E8E93"
          onPress={() => haptics.light()}
        />
        <SettingsRow
          label="Payment & Shipping"
          icon="card"
          iconColor="#8E8E93"
          onPress={() => haptics.light()}
          isLast
        />
      </SettingsGroup>

      {/* Family */}
      <SettingsGroup>
        <SettingsFamilyRow
          members={["Alice", "Bob", "Charlie"]}
          label="Family"
          onPress={() => haptics.light()}
          isLast
        />
      </SettingsGroup>

      {/* Subscriptions */}
      <SettingsGroup>
        <SettingsRow
          label="Subscriptions"
          icon="repeat"
          iconColor="#34C759"
          onPress={() => haptics.light()}
          isLast
        />
      </SettingsGroup>

      {/* iCloud */}
      <SettingsGroup header="iCloud">
        <SettingsRow
          label="iCloud"
          icon="cloud"
          iconColor="#007AFF"
          value="50 GB"
          onPress={() => haptics.light()}
        />
        <SettingsRow
          label="iCloud+"
          icon="sparkles"
          iconColor="#AF52DE"
          onPress={() => haptics.light()}
          isLast
        />
      </SettingsGroup>

      {/* Media & Purchases */}
      <SettingsGroup>
        <SettingsRow
          label="Media & Purchases"
          icon="play-circle"
          iconColor="#FF3B30"
          onPress={() => haptics.light()}
          isLast
        />
      </SettingsGroup>

      {/* Find My */}
      <SettingsGroup>
        <SettingsRow
          label="Find My"
          icon="location"
          iconColor="#34C759"
          onPress={() => haptics.light()}
          isLast
        />
      </SettingsGroup>

      {/* Sign Out */}
      <SettingsGroup>
        <SettingsRow
          label="Sign Out"
          destructive
          onPress={() => haptics.light()}
          showChevron={false}
          isLast
        />
      </SettingsGroup>
    </SettingsSubPage>
  );
}

// About Sub-page
function AboutPage({ onBack }: { onBack: () => void }) {
  const haptics = useHaptics();

  return (
    <SettingsSubPage title="About" onBack={onBack}>
      <View className="py-4">
        {/* Device Info */}
        <SettingsGroup>
          <SettingsInfoRow label="Name" value="iPhone 16 Pro" showChevron onPress={() => haptics.light()} />
          <SettingsInfoRow label="iOS Version" value="26.0" />
          <SettingsInfoRow label="Model Name" value="iPhone 16 Pro" />
          <SettingsInfoRow label="Model Number" value="MTQR3LL/A" />
          <SettingsInfoRow label="Serial Number" value="DNPW7XXXXXX" selectable isLast />
        </SettingsGroup>

        {/* Storage */}
        <SettingsGroup>
          <SettingsRow
            label="iPhone Storage"
            value="128 GB"
            onPress={() => haptics.light()}
            isLast
          />
        </SettingsGroup>

        {/* Network Info */}
        <SettingsGroup>
          <SettingsInfoRow label="Wi-Fi Address" value="2A:DB:7C:XX:XX:XX" selectable />
          <SettingsInfoRow label="Bluetooth" value="2A:DB:7C:XX:XX:XX" selectable isLast />
        </SettingsGroup>

        {/* Legal */}
        <SettingsGroup>
          <SettingsRow label="Certificate Trust Settings" onPress={() => haptics.light()} />
          <SettingsRow label="Legal & Regulatory" onPress={() => haptics.light()} isLast />
        </SettingsGroup>
      </View>
    </SettingsSubPage>
  );
}

// Bluetooth Sub-page
function BluetoothPage({ onBack }: { onBack: () => void }) {
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const haptics = useHaptics();
  const { colors } = useTheme();

  const myDevices = [
    { name: "AirPods Pro", icon: "🎧", status: "Connected" },
    { name: "Apple Watch", icon: "⌚", status: "Not Connected" },
    { name: "MacBook Pro", icon: "💻", status: "Not Connected" },
  ];

  const otherDevices = [
    { name: "Living Room TV", icon: "📺" },
    { name: "HomePod mini", icon: "🔊" },
    { name: "Keyboard", icon: "⌨️" },
  ];

  return (
    <SettingsSubPage title="Bluetooth" onBack={onBack} hasLargeTitle>
      <View className="py-2">
        {/* Hero Card */}
        <SettingsHeroCard
          icon="bluetooth"
          iconColor="#007AFF"
          title="Bluetooth"
          description="Bluetooth allows you to connect devices wirelessly, such as headphones, speakers, keyboards, and more."
          learnMoreText="Learn more..."
          onLearnMore={() => haptics.light()}
        >
          <View className="flex-row items-center justify-between">
            <Text variant="body">Bluetooth</Text>
            <Switch
              value={bluetoothEnabled}
              onValueChange={(v) => {
                haptics.light();
                setBluetoothEnabled(v);
              }}
            />
          </View>
        </SettingsHeroCard>

        {bluetoothEnabled && (
          <>
            {/* My Devices */}
            <SettingsSectionHeader title="My Devices" />
            <View className="mx-4 rounded-xl overflow-hidden">
              {myDevices.map((device, index) => (
                <SettingsDeviceRow
                  key={device.name}
                  name={device.name}
                  icon={device.icon}
                  status={device.status}
                  showInfo
                  onInfoPress={() => haptics.light()}
                  onPress={() => haptics.light()}
                  isLast={index === myDevices.length - 1}
                />
              ))}
            </View>

            {/* Other Devices */}
            <SettingsSectionHeader
              title="Other Devices"
              rightAccessory={<ActivityIndicator size="small" color={colors.foreground.muted} />}
            />
            <View className="mx-4 rounded-xl overflow-hidden">
              {otherDevices.map((device, index) => (
                <SettingsDeviceRow
                  key={device.name}
                  name={device.name}
                  icon={device.icon}
                  showInfo={false}
                  onPress={() => haptics.light()}
                  isLast={index === otherDevices.length - 1}
                />
              ))}
            </View>

            {/* Footer */}
            <Text variant="caption" color="muted" className="px-4 pt-3">
              Now discoverable as "John's iPhone". Other Bluetooth devices can find your iPhone when a Bluetooth settings screen is open.
            </Text>
          </>
        )}
      </View>
    </SettingsSubPage>
  );
}

// General Sub-page
function GeneralPage({ onBack }: { onBack: () => void }) {
  const haptics = useHaptics();

  return (
    <SettingsSubPage title="General" onBack={onBack} hasLargeTitle>
      <View className="py-2">
        {/* About */}
        <SettingsGroup>
          <SettingsRow
            label="About"
            onPress={() => haptics.light()}
            isLast
          />
        </SettingsGroup>

        {/* Software Update */}
        <SettingsGroup>
          <SettingsRow
            label="Software Update"
            onPress={() => haptics.light()}
            rightContent={
              <View className="flex-row items-center">
                <View className="w-5 h-5 rounded-full bg-error items-center justify-center mr-2">
                  <Text variant="caption" style={{ color: "#FFF", fontSize: 10, fontWeight: "700" }}>
                    1
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
              </View>
            }
            isLast
          />
        </SettingsGroup>

        {/* Storage & AirDrop */}
        <SettingsGroup>
          <SettingsRow
            label="iPhone Storage"
            onPress={() => haptics.light()}
          />
          <SettingsRow
            label="AirDrop"
            value="Contacts Only"
            onPress={() => haptics.light()}
            isLast
          />
        </SettingsGroup>

        {/* Keyboard & Language */}
        <SettingsGroup>
          <SettingsRow
            label="Keyboard"
            onPress={() => haptics.light()}
          />
          <SettingsRow
            label="Language & Region"
            onPress={() => haptics.light()}
          />
          <SettingsRow
            label="Dictionary"
            onPress={() => haptics.light()}
            isLast
          />
        </SettingsGroup>

        {/* VPN & Device Management */}
        <SettingsGroup>
          <SettingsRow
            label="VPN"
            value="Not Connected"
            onPress={() => haptics.light()}
          />
          <SettingsRow
            label="VPN & Device Management"
            onPress={() => haptics.light()}
            isLast
          />
        </SettingsGroup>

        {/* Background Refresh */}
        <SettingsGroup>
          <SettingsRow
            label="Background App Refresh"
            value="Wi-Fi"
            onPress={() => haptics.light()}
            isLast
          />
        </SettingsGroup>

        {/* Date & Time */}
        <SettingsGroup>
          <SettingsRow
            label="Date & Time"
            onPress={() => haptics.light()}
            isLast
          />
        </SettingsGroup>

        {/* Transfer or Reset */}
        <SettingsGroup>
          <SettingsRow
            label="Transfer or Reset iPhone"
            onPress={() => haptics.light()}
            isLast
          />
        </SettingsGroup>

        {/* Shut Down */}
        <SettingsGroup>
          <SettingsRow
            label="Shut Down"
            showChevron={false}
            onPress={() => haptics.light()}
            isLast
          />
        </SettingsGroup>
      </View>
    </SettingsSubPage>
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
    <SettingsSubPage title="Wi-Fi" onBack={onBack} hasLargeTitle>
      <View className="py-2">
        {/* Hero Card */}
        <SettingsHeroCard
          icon="wifi"
          iconColor="#007AFF"
          title="Wi-Fi"
          description="Connect to the internet using available wireless networks."
        >
          <View className="flex-row items-center justify-between">
            <Text variant="body">Wi-Fi</Text>
            <Switch
              value={wifiEnabled}
              onValueChange={(v) => {
                haptics.light();
                setWifiEnabled(v);
              }}
            />
          </View>
        </SettingsHeroCard>

        {wifiEnabled && (
          <>
            <SettingsSectionHeader title="Networks" />
            <View className="mx-4 rounded-xl overflow-hidden">
              {networks.map((network, index) => (
                <SettingsRow
                  key={network.name}
                  label={network.name}
                  icon={network.secured ? "lock-closed" : "wifi"}
                  iconColor={colors.primary.DEFAULT}
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
            </View>

            <SettingsGroup className="mt-4">
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
      </View>
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
    <SettingsSubPage title="Display & Brightness" onBack={onBack} hasLargeTitle>
      <View className="py-2">
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
          <SettingsRow label="Text Size" value="Default" onPress={() => haptics.light()} />
          <SettingsRow
            label="Bold Text"
            hasSwitch
            switchValue={false}
            onSwitchChange={() => haptics.light()}
            isLast
          />
        </SettingsGroup>
      </View>
    </SettingsSubPage>
  );
}

// Notifications Settings Sub-page
function NotificationSettings({ onBack }: { onBack: () => void }) {
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
    <SettingsSubPage title="Notifications" onBack={onBack} hasLargeTitle>
      <View className="py-2">
        <SettingsGroup>
          <SettingsRow label="Show Previews" value="When Unlocked" onPress={() => haptics.light()} />
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
                    <Ionicons name="chevron-forward" size={20} color={colors.foreground.muted} />
                  </View>
                ) : undefined
              }
              onPress={() => haptics.light()}
              isLast={index === apps.length - 1}
            />
          ))}
        </SettingsGroup>
      </View>
    </SettingsSubPage>
  );
}

// Main Settings Page
export default function SettingsDemo() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const haptics = useHaptics();
  const { toggleColorScheme } = useAppColorScheme();
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Settings state
  const [airplaneMode, setAirplaneMode] = useState(false);
  const [bluetooth, setBluetooth] = useState(true);
  const [cellular, setCellular] = useState(true);

  // Handle sub-page navigation
  if (currentPage === "apple-account") {
    return <AppleAccountPage onBack={() => setCurrentPage(null)} />;
  }
  if (currentPage === "wifi") {
    return <WiFiSettings onBack={() => setCurrentPage(null)} />;
  }
  if (currentPage === "bluetooth") {
    return <BluetoothPage onBack={() => setCurrentPage(null)} />;
  }
  if (currentPage === "general") {
    return <GeneralPage onBack={() => setCurrentPage(null)} />;
  }
  if (currentPage === "about") {
    return <AboutPage onBack={() => setCurrentPage(null)} />;
  }
  if (currentPage === "display") {
    return <DisplaySettings onBack={() => setCurrentPage(null)} />;
  }
  if (currentPage === "notifications") {
    return <NotificationSettings onBack={() => setCurrentPage(null)} />;
  }

  return (
    <View className="flex-1 bg-background">
      {/* Glass Header with Large Title */}
      <GlassContainer intensity="medium" tint="surface" borderRadius="none">
        <View style={{ paddingTop: insets.top }} className="px-4 pb-3">
          <View className="flex-row items-center justify-between h-11">
            <View
              className="flex-row items-center"
              onTouchEnd={() => {
                haptics.light();
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={28} color={colors.primary.DEFAULT} />
              <Text variant="body" style={{ color: colors.primary.DEFAULT }}>
                Back
              </Text>
            </View>
            <View style={{ width: 60 }} />
          </View>
          <SettingsLargeTitle title="Settings" className="px-0 pt-2 pb-0" />
        </View>
      </GlassContainer>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View className="px-4 py-4">
          <SettingsProfile
            name="John Appleseed"
            subtitle="Apple Account, iCloud, Media & Purchases"
            avatarInitials="JA"
            onPress={() => {
              haptics.light();
              setCurrentPage("apple-account");
            }}
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
            onPress={() => {
              haptics.light();
              setCurrentPage("bluetooth");
            }}
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
            onPress={() => {
              haptics.light();
              setCurrentPage("general");
            }}
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

      {/* Floating Search Bar */}
      <SettingsFloatingSearch
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search"
        showMic
        onMicPress={() => haptics.light()}
      />
    </View>
  );
}
