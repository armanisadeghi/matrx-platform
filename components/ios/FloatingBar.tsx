/**
 * FloatingBar Component
 *
 * iOS-style floating action bar (like in Photos app).
 * Uses glass effect and appears at the bottom of the screen.
 */

import { View, Pressable, type ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
import { useHaptics } from "@/hooks/useHaptics";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export interface FloatingBarAction {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Icon name
   */
  icon: keyof typeof Ionicons.glyphMap;

  /**
   * Optional label (shown below icon)
   */
  label?: string;

  /**
   * Whether this action is destructive
   */
  destructive?: boolean;

  /**
   * Whether this action is disabled
   */
  disabled?: boolean;

  /**
   * Press handler
   */
  onPress?: () => void;
}

export interface FloatingBarProps {
  /**
   * Actions to display
   */
  actions: FloatingBarAction[];

  /**
   * Whether the bar is visible
   */
  visible?: boolean;

  /**
   * Layout mode
   * @default 'icon'
   */
  mode?: "icon" | "labeled";

  /**
   * Whether to use glass effect
   * @default true
   */
  useGlass?: boolean;

  /**
   * Additional className
   */
  className?: string;

  /**
   * Additional style
   */
  style?: ViewStyle;
}

function FloatingBarButton({
  action,
  mode,
}: {
  action: FloatingBarAction;
  mode: "icon" | "labeled";
}) {
  const { colors } = useTheme();
  const haptics = useHaptics();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.85, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    haptics.light();
    action.onPress?.();
  };

  const iconColor = action.destructive
    ? colors.error.DEFAULT
    : action.disabled
    ? colors.foreground.muted
    : colors.foreground.DEFAULT;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={action.disabled}
        className={cn(
          "items-center justify-center",
          mode === "icon" ? "px-4 py-3" : "px-5 py-2"
        )}
      >
        <Ionicons name={action.icon} size={24} color={iconColor} />
        {mode === "labeled" && action.label && (
          <Text
            variant="caption"
            style={{
              color: iconColor,
              marginTop: 2,
            }}
          >
            {action.label}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

export function FloatingBar({
  actions,
  visible = true,
  mode = "icon",
  useGlass = true,
  className,
  style,
}: FloatingBarProps) {
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  const content = (
    <View className="flex-row items-center justify-around">
      {actions.map((action) => (
        <FloatingBarButton key={action.id} action={action} mode={mode} />
      ))}
    </View>
  );

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(15)}
      exiting={SlideOutDown.springify().damping(15)}
      className={cn("absolute bottom-0 left-0 right-0 items-center", className)}
      style={[{ paddingBottom: Math.max(insets.bottom, 16), paddingHorizontal: 16 }, style]}
    >
      {useGlass ? (
        <GlassContainer intensity="medium" tint="surface" borderRadius="full">
          {content}
        </GlassContainer>
      ) : (
        <View className="bg-surface-elevated rounded-full shadow-lg">
          {content}
        </View>
      )}
    </Animated.View>
  );
}

/**
 * MiniPlayer Component
 *
 * iOS-style mini player bar (like Music app).
 */

export interface MiniPlayerProps {
  /**
   * Track title
   */
  title: string;

  /**
   * Artist name
   */
  artist: string;

  /**
   * Album art component or URL
   */
  albumArt?: React.ReactNode;

  /**
   * Whether the track is playing
   */
  isPlaying?: boolean;

  /**
   * Play/pause handler
   */
  onPlayPause?: () => void;

  /**
   * Next track handler
   */
  onNext?: () => void;

  /**
   * Press handler (opens full player)
   */
  onPress?: () => void;

  /**
   * Whether the player is visible
   */
  visible?: boolean;

  /**
   * Additional className
   */
  className?: string;
}

export function MiniPlayer({
  title,
  artist,
  albumArt,
  isPlaying = false,
  onPlayPause,
  onNext,
  onPress,
  visible = true,
  className,
}: MiniPlayerProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const haptics = useHaptics();

  if (!visible) return null;

  const handlePlayPause = () => {
    haptics.light();
    onPlayPause?.();
  };

  const handleNext = () => {
    haptics.light();
    onNext?.();
  };

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(15)}
      exiting={SlideOutDown.springify().damping(15)}
      className={cn("absolute bottom-0 left-0 right-0", className)}
      style={{ paddingBottom: insets.bottom }}
    >
      <GlassContainer intensity="medium" tint="surface" borderRadius="none">
        <Pressable onPress={onPress}>
          <View className="flex-row items-center p-3">
            {/* Album Art */}
            <View className="w-12 h-12 rounded-lg bg-surface-elevated items-center justify-center mr-3 overflow-hidden">
              {albumArt || (
                <Ionicons
                  name="musical-notes"
                  size={24}
                  color={colors.foreground.muted}
                />
              )}
            </View>

            {/* Track Info */}
            <View className="flex-1">
              <Text variant="label" numberOfLines={1}>
                {title}
              </Text>
              <Text variant="caption" color="secondary" numberOfLines={1}>
                {artist}
              </Text>
            </View>

            {/* Controls */}
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={handlePlayPause}
                className="w-10 h-10 items-center justify-center"
              >
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={28}
                  color={colors.foreground.DEFAULT}
                />
              </Pressable>
              <Pressable
                onPress={handleNext}
                className="w-10 h-10 items-center justify-center"
              >
                <Ionicons
                  name="play-forward"
                  size={24}
                  color={colors.foreground.DEFAULT}
                />
              </Pressable>
            </View>
          </View>
        </Pressable>
      </GlassContainer>
    </Animated.View>
  );
}
