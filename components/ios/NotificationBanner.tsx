/**
 * NotificationBanner Component
 *
 * iOS-style in-app notification banner with glass effect.
 * Slides in from the top with spring animation.
 */

import { useEffect } from "react";
import { View, Pressable, Image, type ImageSourcePropType } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Avatar } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
import { useHaptics } from "@/hooks/useHaptics";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export interface NotificationBannerProps {
  /**
   * App name or title
   */
  title: string;

  /**
   * Notification message
   */
  message: string;

  /**
   * Timestamp or subtitle
   */
  subtitle?: string;

  /**
   * App icon (Ionicon name)
   */
  icon?: keyof typeof Ionicons.glyphMap;

  /**
   * App icon image source
   */
  iconImage?: ImageSourcePropType;

  /**
   * Icon background color
   */
  iconColor?: string;

  /**
   * Whether the notification is visible
   */
  visible: boolean;

  /**
   * Dismiss handler
   */
  onDismiss: () => void;

  /**
   * Press handler
   */
  onPress?: () => void;

  /**
   * Auto-dismiss duration in ms (0 to disable)
   * @default 5000
   */
  duration?: number;

  /**
   * Additional className
   */
  className?: string;
}

export function NotificationBanner({
  title,
  message,
  subtitle,
  icon,
  iconImage,
  iconColor,
  visible,
  onDismiss,
  onPress,
  duration = 5000,
  className,
}: NotificationBannerProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  // Auto-dismiss
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [visible, duration, onDismiss]);

  // Haptic feedback on show
  useEffect(() => {
    if (visible) {
      haptics.light();
    }
  }, [visible]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY < 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY < -50 || event.velocityY < -500) {
        translateY.value = withTiming(-200, { duration: 200 });
        runOnJS(onDismiss)();
      } else {
        translateY.value = withSpring(0, { damping: 15 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.98, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15 });
    }, 100);
    haptics.light();
    onPress?.();
  };

  if (!visible) return null;

  const resolvedIconColor = iconColor || colors.primary.DEFAULT;

  return (
    <View
      className={cn("absolute left-0 right-0 z-50 px-4", className)}
      style={{ top: insets.top + 8 }}
      pointerEvents="box-none"
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          entering={SlideInUp.springify().damping(15)}
          exiting={SlideOutUp.springify().damping(15)}
          style={animatedStyle}
        >
          <Pressable onPress={handlePress}>
            <GlassContainer
              intensity="strong"
              tint="surface"
              borderRadius="xl"
              className="shadow-lg"
            >
              <View className="flex-row items-center p-3">
                {/* Icon */}
                {(icon || iconImage) && (
                  <View
                    className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                    style={{ backgroundColor: resolvedIconColor }}
                  >
                    {iconImage ? (
                      <Image
                        source={iconImage}
                        style={{ width: 24, height: 24, borderRadius: 6 }}
                      />
                    ) : icon ? (
                      <Ionicons name={icon} size={24} color="#FFFFFF" />
                    ) : null}
                  </View>
                )}

                {/* Content */}
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text variant="label" numberOfLines={1} className="flex-1">
                      {title}
                    </Text>
                    {subtitle && (
                      <Text variant="caption" color="muted" className="ml-2">
                        {subtitle}
                      </Text>
                    )}
                  </View>
                  <Text
                    variant="bodySmall"
                    color="secondary"
                    numberOfLines={2}
                    className="mt-0.5"
                  >
                    {message}
                  </Text>
                </View>
              </View>
            </GlassContainer>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

/**
 * NotificationBannerProvider Hook
 *
 * Simple hook for managing notification state.
 */

import { useState, useCallback } from "react";

interface NotificationData {
  title: string;
  message: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconImage?: ImageSourcePropType;
  iconColor?: string;
  onPress?: () => void;
  duration?: number;
}

export function useNotificationBanner() {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [visible, setVisible] = useState(false);

  const show = useCallback((data: NotificationData) => {
    setNotification(data);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
    setTimeout(() => setNotification(null), 300);
  }, []);

  return {
    notification,
    visible,
    show,
    hide,
  };
}
