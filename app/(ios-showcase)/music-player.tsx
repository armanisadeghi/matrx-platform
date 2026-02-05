/**
 * iOS Music Player Demo
 *
 * Full-screen music player with:
 * - Album artwork
 * - Playback controls
 * - Progress slider
 * - Glass effects
 * - Mini player collapse
 */

import { useState, useEffect } from "react";
import { View, Pressable, Dimensions, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  FadeIn,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Mock track data
const track = {
  title: "Blest",
  artist: "Yuno",
  album: "Moodie",
  duration: 210, // seconds
  artworkColor: "#4A6FA5",
};

export default function MusicPlayerDemo() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(150);
  const [volume, setVolume] = useState(0.7);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");

  // Animation values
  const artworkScale = useSharedValue(1);

  // Simulate playback
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= track.duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle play/pause
  const handlePlayPause = () => {
    haptics.light();
    setIsPlaying(!isPlaying);
    artworkScale.value = withSpring(isPlaying ? 0.95 : 1, { damping: 15 });
  };

  // Handle skip
  const handleSkip = (direction: "prev" | "next") => {
    haptics.medium();
    setCurrentTime(0);
  };

  // Toggle shuffle
  const handleShuffle = () => {
    haptics.selection();
    setIsShuffle(!isShuffle);
  };

  // Toggle repeat
  const handleRepeat = () => {
    haptics.selection();
    const modes: ("off" | "all" | "one")[] = ["off", "all", "one"];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    if (nextMode) {
      setRepeatMode(nextMode);
    }
  };

  const artworkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: artworkScale.value }],
  }));

  // Control button component
  const ControlButton = ({
    icon,
    size = 24,
    onPress,
    active,
    activeColor,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    size?: number;
    onPress: () => void;
    active?: boolean;
    activeColor?: string;
  }) => (
    <Pressable
      onPress={onPress}
      className="w-12 h-12 items-center justify-center"
    >
      <Ionicons
        name={icon}
        size={size}
        color={active ? activeColor || colors.primary.DEFAULT : colors.foreground.DEFAULT}
      />
    </Pressable>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? "#0a0a0b" : track.artworkColor }}>
      {/* Gradient Background */}
      <View className="absolute inset-0">
        <View
          className="absolute inset-0"
          style={{
            backgroundColor: isDark
              ? "rgba(0,0,0,0.7)"
              : "rgba(255,255,255,0.2)",
          }}
        />
      </View>

      {/* Header */}
      <GlassContainer
        intensity="light"
        tint="surface"
        borderRadius="none"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between px-4 py-3">
          <Pressable
            onPress={() => {
              haptics.light();
              router.back();
            }}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="chevron-down" size={28} color={colors.foreground.DEFAULT} />
          </Pressable>

          <View className="items-center">
            <Text variant="caption" color="secondary">
              PLAYING FROM ALBUM
            </Text>
            <Text variant="label">{track.album}</Text>
          </View>

          <Pressable
            onPress={() => haptics.light()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={colors.foreground.DEFAULT} />
          </Pressable>
        </View>
      </GlassContainer>

      {/* Content */}
      <View className="flex-1 px-8 justify-center">
        {/* Album Artwork */}
        <Animated.View
          entering={FadeIn}
          style={[
            artworkAnimatedStyle,
            {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.4,
              shadowRadius: 30,
            },
          ]}
          className="items-center mb-8"
        >
          <View
            className="rounded-2xl overflow-hidden"
            style={{
              width: SCREEN_WIDTH - 64,
              height: SCREEN_WIDTH - 64,
              backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
            }}
          >
            {/* Placeholder artwork with gradient */}
            <View
              className="w-full h-full items-center justify-center"
              style={{ backgroundColor: track.artworkColor }}
            >
              <Ionicons name="musical-notes" size={100} color="rgba(255,255,255,0.3)" />
            </View>
          </View>
        </Animated.View>

        {/* Track Info */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text variant="h4" numberOfLines={1}>
                {track.title}
              </Text>
              <Text variant="body" color="secondary" numberOfLines={1}>
                {track.artist}
              </Text>
            </View>
            <Pressable
              onPress={() => haptics.light()}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons name="ellipsis-horizontal-circle" size={28} color={colors.foreground.DEFAULT} />
            </Pressable>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="mb-4">
          <View className="h-1 bg-foreground-muted rounded-full overflow-hidden mb-2">
            <View 
              className="h-full bg-foreground" 
              style={{ width: `${(currentTime / track.duration) * 100}%` }}
            />
          </View>
          <View className="flex-row justify-between px-1">
            <Text variant="caption" color="muted">
              {formatTime(currentTime)}
            </Text>
            <Text variant="caption" color="muted">
              -{formatTime(track.duration - currentTime)}
            </Text>
          </View>
        </View>

        {/* Main Controls */}
        <View className="flex-row items-center justify-between px-4 mb-8">
          <ControlButton
            icon="shuffle"
            onPress={handleShuffle}
            active={isShuffle}
          />

          <Pressable
            onPress={() => handleSkip("prev")}
            className="w-16 h-16 items-center justify-center"
          >
            <Ionicons name="play-skip-back" size={35} color={colors.foreground.DEFAULT} />
          </Pressable>

          <Pressable
            onPress={handlePlayPause}
            className="w-20 h-20 rounded-full bg-foreground items-center justify-center"
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={40}
              color={colors.background.DEFAULT}
              style={{ marginLeft: isPlaying ? 0 : 4 }}
            />
          </Pressable>

          <Pressable
            onPress={() => handleSkip("next")}
            className="w-16 h-16 items-center justify-center"
          >
            <Ionicons name="play-skip-forward" size={35} color={colors.foreground.DEFAULT} />
          </Pressable>

          <ControlButton
            icon={repeatMode === "one" ? "repeat" : "repeat"}
            onPress={handleRepeat}
            active={repeatMode !== "off"}
          />
        </View>

        {/* Volume Control */}
        <View className="flex-row items-center px-2">
          <Ionicons name="volume-low" size={20} color={colors.foreground.muted} />
          <View className="flex-1 mx-3 h-1 bg-foreground-muted rounded-full overflow-hidden">
            <View 
              className="h-full bg-foreground" 
              style={{ width: `${volume * 100}%` }}
            />
          </View>
          <Ionicons name="volume-high" size={20} color={colors.foreground.muted} />
        </View>
      </View>

      {/* Bottom Actions */}
      <GlassContainer
        intensity="light"
        tint="surface"
        borderRadius="none"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <View className="flex-row items-center justify-around py-3">
          <Pressable
            onPress={() => haptics.light()}
            className="items-center"
          >
            <Ionicons name="text-outline" size={22} color={colors.foreground.DEFAULT} />
            <Text variant="caption" color="secondary" className="mt-1">
              Lyrics
            </Text>
          </Pressable>

          <Pressable
            onPress={() => haptics.light()}
            className="items-center"
          >
            <Ionicons name="radio-outline" size={22} color={colors.foreground.DEFAULT} />
            <Text variant="caption" color="secondary" className="mt-1">
              AirPlay
            </Text>
          </Pressable>

          <Pressable
            onPress={() => haptics.light()}
            className="items-center"
          >
            <Ionicons name="list-outline" size={22} color={colors.foreground.DEFAULT} />
            <Text variant="caption" color="secondary" className="mt-1">
              Queue
            </Text>
          </Pressable>
        </View>
      </GlassContainer>
    </View>
  );
}
