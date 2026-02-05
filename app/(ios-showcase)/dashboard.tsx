/**
 * iOS Dashboard Demo
 *
 * Replicates the iOS 26 home screen with:
 * - App icon grid layout
 * - Interactive widgets
 * - Liquid Glass dock
 * - Wallpaper-style background
 */

import { useState } from "react";
import { View, ScrollView, Dimensions, ImageBackground } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, Badge } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
import {
  AppIcon,
  Widget,
  WeatherWidget,
  CalendarWidget,
  MusicWidget,
  GlassDock,
  type DockItem,
} from "@/components/ios";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ICON_SIZE = (SCREEN_WIDTH - 48) / 4;

export default function DashboardDemo() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();
  const [currentDate] = useState(new Date());

  // Dock items
  const dockItems: DockItem[] = [
    {
      id: "phone",
      icon: "call",
      color: "#34C759",
      badgeCount: 2,
      onPress: () => haptics.light(),
    },
    {
      id: "safari",
      icon: "compass",
      color: "#007AFF",
      onPress: () => haptics.light(),
    },
    {
      id: "messages",
      icon: "chatbubble-ellipses",
      color: "#34C759",
      badgeCount: 5,
      onPress: () => router.push("/(ios-showcase)/messages"),
    },
    {
      id: "music",
      icon: "musical-notes",
      color: "#FF2D55",
      onPress: () => router.push("/(ios-showcase)/music-player"),
    },
  ];

  // Sample app data
  const apps = [
    { id: "facetime", label: "FaceTime", icon: "videocam" as const, color: "#34C759" },
    { id: "calendar", label: "Calendar", icon: "calendar" as const, color: "#FF3B30" },
    { id: "photos", label: "Photos", icon: "images" as const, color: "#FFD60A" },
    { id: "camera", label: "Camera", icon: "camera" as const, color: "#8E8E93" },
    { id: "mail", label: "Mail", icon: "mail" as const, color: "#007AFF", badge: 12 },
    { id: "notes", label: "Notes", icon: "document-text" as const, color: "#FFD60A" },
    { id: "reminders", label: "Reminders", icon: "list" as const, color: "#007AFF" },
    { id: "clock", label: "Clock", icon: "time" as const, color: "#000000" },
    { id: "news", label: "News", icon: "newspaper" as const, color: "#FF3B30" },
    { id: "tv", label: "TV", icon: "tv" as const, color: "#000000" },
    { id: "podcasts", label: "Podcasts", icon: "mic" as const, color: "#AF52DE" },
    { id: "appstore", label: "App Store", icon: "apps" as const, color: "#007AFF" },
    { id: "maps", label: "Maps", icon: "map" as const, color: "#34C759" },
    { id: "health", label: "Health", icon: "heart" as const, color: "#FF2D55" },
    { id: "wallet", label: "Wallet", icon: "wallet" as const, color: "#000000" },
    { id: "settings", label: "Settings", icon: "settings" as const, color: "#8E8E93" },
  ];

  const formatDate = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${days[currentDate.getDay()]}, ${months[currentDate.getMonth()]} ${currentDate.getDate()}`;
  };

  // Background gradient colors
  const gradientColors = isDark
    ? ["#1a1a2e", "#16213e", "#0f3460"]
    : ["#667eea", "#764ba2", "#f093fb"];

  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? "#0a0a0b" : "#667eea" }}>
      {/* Wallpaper Background */}
      <View
        className="absolute inset-0"
        style={{
          backgroundColor: isDark ? "#1a1a2e" : "#667eea",
        }}
      >
        {/* Gradient overlay */}
        <View
          className="absolute inset-0"
          style={{
            backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.1)",
          }}
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Date/Time Header */}
        <View className="items-center mb-4">
          <Text
            variant="h4"
            style={{ color: "#FFFFFF", textShadowColor: "rgba(0,0,0,0.3)", textShadowRadius: 4 }}
          >
            {formatDate()}
          </Text>
        </View>

        {/* Widgets Row */}
        <View className="px-4 mb-4">
          <View className="flex-row gap-2">
            {/* Weather Widget */}
            <WeatherWidget
              temperature="53°"
              condition="Partly Cloudy"
              location="San Francisco"
              high="56°"
              low="50°"
              onPress={() => haptics.light()}
            />

            {/* Calendar Widget */}
            <CalendarWidget
              day={currentDate.getDate().toString()}
              dayOfWeek={["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][currentDate.getDay()]}
              month={["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][currentDate.getMonth()]}
              onPress={() => haptics.light()}
            />
          </View>
        </View>

        {/* Music Widget (Large) */}
        <View className="px-4 mb-4">
          <MusicWidget
            title="Blest"
            artist="Yuno"
            isPlaying={true}
            onPress={() => router.push("/(ios-showcase)/music-player")}
          />
        </View>

        {/* App Grid */}
        <View className="px-4">
          <View className="flex-row flex-wrap">
            {apps.map((app) => (
              <View
                key={app.id}
                style={{ width: ICON_SIZE, marginBottom: 16 }}
                className="items-center"
              >
                <AppIcon
                  label={app.label}
                  icon={app.icon}
                  color={app.color}
                  badgeCount={app.badge}
                  size="md"
                  onPress={() => {
                    haptics.light();
                    if (app.id === "settings") {
                      router.push("/(ios-showcase)/settings");
                    } else if (app.id === "mail") {
                      router.push("/(ios-showcase)/messages");
                    }
                  }}
                  onLongPress={() => haptics.medium()}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Search Bar */}
        <View className="px-4 mt-4">
          <GlassContainer intensity="light" tint="surface" borderRadius="full">
            <View className="flex-row items-center px-4 py-2.5">
              <Ionicons name="search" size={18} color="rgba(255,255,255,0.7)" />
              <Text
                variant="body"
                style={{ color: "rgba(255,255,255,0.7)", marginLeft: 8 }}
              >
                Search
              </Text>
            </View>
          </GlassContainer>
        </View>
      </ScrollView>

      {/* Glass Dock */}
      <GlassDock items={dockItems} />

      {/* Back Button */}
      <View
        className="absolute left-4"
        style={{ top: insets.top + 8 }}
      >
        <GlassContainer intensity="medium" tint="surface" borderRadius="full">
          <View
            className="w-10 h-10 items-center justify-center"
            onTouchEnd={() => {
              haptics.light();
              router.back();
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </View>
        </GlassContainer>
      </View>
    </View>
  );
}
