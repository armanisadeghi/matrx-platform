/**
 * MessageBubble Component
 *
 * iOS-style message bubbles for chat interfaces.
 * Includes sent/received styles, reactions, and timestamps.
 */

import { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Text, Avatar } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
import { useHaptics } from "@/hooks/useHaptics";
import { useTheme } from "@/hooks/useTheme";
import { isIOS } from "@/lib/platform";
import { cn } from "@/lib/utils";

export interface MessageBubbleProps {
  /**
   * Message content
   */
  message: string;

  /**
   * Whether the message is from the current user
   */
  isSent?: boolean;

  /**
   * Timestamp string
   */
  timestamp?: string;

  /**
   * Sender name (for received messages in groups)
   */
  senderName?: string;

  /**
   * Sender avatar URL
   */
  senderAvatar?: string;

  /**
   * Whether to show the avatar
   */
  showAvatar?: boolean;

  /**
   * Message status for sent messages
   */
  status?: "sending" | "sent" | "delivered" | "read";

  /**
   * Reactions on the message
   */
  reactions?: string[];

  /**
   * Whether this is the last message in a group
   */
  isLastInGroup?: boolean;

  /**
   * Whether this is the first message in a group
   */
  isFirstInGroup?: boolean;

  /**
   * Long press handler (for reactions, etc.)
   */
  onLongPress?: () => void;

  /**
   * Additional className
   */
  className?: string;
}

export function MessageBubble({
  message,
  isSent = false,
  timestamp,
  senderName,
  senderAvatar,
  showAvatar = true,
  status,
  reactions,
  isLastInGroup = true,
  isFirstInGroup = true,
  onLongPress,
  className,
}: MessageBubbleProps) {
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleLongPress = () => {
    haptics.medium();
    scale.value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15 });
    }, 100);
    onLongPress?.();
  };

  // iOS-style bubble colors
  const sentBubbleColor = "#007AFF"; // iOS blue
  const receivedBubbleColor = isDark ? "#3A3A3C" : "#E9E9EB";
  const sentTextColor = "#FFFFFF";
  const receivedTextColor = colors.foreground.DEFAULT;

  // Bubble border radius based on position in group
  const getBorderRadius = () => {
    const base = 18;
    const small = 4;

    if (isSent) {
      return {
        borderTopLeftRadius: base,
        borderTopRightRadius: isFirstInGroup ? base : small,
        borderBottomLeftRadius: base,
        borderBottomRightRadius: isLastInGroup ? base : small,
      };
    } else {
      return {
        borderTopLeftRadius: isFirstInGroup ? base : small,
        borderTopRightRadius: base,
        borderBottomLeftRadius: isLastInGroup ? base : small,
        borderBottomRightRadius: base,
      };
    }
  };

  const renderStatusIcon = () => {
    if (!isSent || !status) return null;

    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      sending: "time-outline",
      sent: "checkmark",
      delivered: "checkmark-done",
      read: "checkmark-done",
    };

    const iconColor = status === "read" ? "#007AFF" : colors.foreground.muted;

    return (
      <Ionicons
        name={iconMap[status]}
        size={14}
        color={iconColor}
        style={{ marginLeft: 4 }}
      />
    );
  };

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={animatedStyle}
      className={cn(
        "flex-row mb-0.5",
        isSent ? "justify-end" : "justify-start",
        isLastInGroup && "mb-2",
        className
      )}
    >
      {/* Avatar for received messages */}
      {!isSent && showAvatar && (
        <View className="w-8 mr-2">
          {isLastInGroup && (
            <Avatar
              name={senderName || "User"}
              source={senderAvatar}
              size="sm"
            />
          )}
        </View>
      )}

      <View className={cn("max-w-[75%]", isSent ? "items-end" : "items-start")}>
        {/* Sender name for first message in group */}
        {!isSent && isFirstInGroup && senderName && (
          <Text variant="caption" color="secondary" className="mb-1 ml-3">
            {senderName}
          </Text>
        )}

        <Pressable onLongPress={handleLongPress}>
          <View
            style={[
              {
                backgroundColor: isSent ? sentBubbleColor : receivedBubbleColor,
                paddingHorizontal: 12,
                paddingVertical: 8,
                maxWidth: "100%",
              },
              getBorderRadius(),
            ]}
          >
            <Text
              variant="body"
              style={{ color: isSent ? sentTextColor : receivedTextColor }}
            >
              {message}
            </Text>
          </View>
        </Pressable>

        {/* Reactions */}
        {reactions && reactions.length > 0 && (
          <View
            className={cn(
              "flex-row bg-surface-elevated rounded-full px-2 py-0.5 -mt-2 shadow-sm",
              isSent ? "mr-2" : "ml-2"
            )}
          >
            {reactions.map((reaction, index) => (
              <Text key={index} style={{ fontSize: 14 }}>
                {reaction}
              </Text>
            ))}
          </View>
        )}

        {/* Timestamp and status */}
        {isLastInGroup && (timestamp || status) && (
          <View className="flex-row items-center mt-1 px-1">
            {timestamp && (
              <Text variant="caption" color="muted">
                {timestamp}
              </Text>
            )}
            {renderStatusIcon()}
          </View>
        )}
      </View>
    </Animated.View>
  );
}

/**
 * MessageInput Component
 *
 * iOS-style message input bar with glass effect.
 */

export interface MessageInputProps {
  /**
   * Current input value
   */
  value: string;

  /**
   * Value change handler
   */
  onChangeText: (text: string) => void;

  /**
   * Send button handler
   */
  onSend: () => void;

  /**
   * Placeholder text
   * @default "Message"
   */
  placeholder?: string;

  /**
   * Whether to show attachment button
   * @default true
   */
  showAttachment?: boolean;

  /**
   * Attachment button handler
   */
  onAttachment?: () => void;

  /**
   * Whether to show camera button
   * @default true
   */
  showCamera?: boolean;

  /**
   * Camera button handler
   */
  onCamera?: () => void;

  /**
   * Additional className
   */
  className?: string;

  /**
   * Additional style
   */
  style?: ViewStyle;
}

export function MessageInput({
  value,
  onChangeText,
  onSend,
  placeholder = "Message",
  showAttachment = true,
  onAttachment,
  showCamera = true,
  onCamera,
  className,
  style,
}: MessageInputProps) {
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();
  const [isFocused, setIsFocused] = useState(false);

  const canSend = value.trim().length > 0;

  const handleSend = () => {
    if (canSend) {
      haptics.light();
      onSend();
    }
  };

  const inputBackground = isDark ? "#2C2C2E" : "#F2F2F7";

  const ActionButton = ({
    icon,
    onPress,
    color,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
    color?: string;
  }) => (
    <Pressable
      onPress={onPress}
      className="w-8 h-8 items-center justify-center"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons
        name={icon}
        size={24}
        color={color || colors.foreground.muted}
      />
    </Pressable>
  );

  return (
    <GlassContainer
      intensity="light"
      tint="surface"
      borderRadius="none"
      className={cn("px-3 py-2", className)}
      style={style}
    >
      <View className="flex-row items-end gap-2">
        {/* Left actions */}
        <View className="flex-row items-center">
          {showCamera && <ActionButton icon="camera" onPress={onCamera} />}
          {showAttachment && <ActionButton icon="add-circle" onPress={onAttachment} />}
        </View>

        {/* Input field */}
        <View
          className="flex-1 flex-row items-end rounded-2xl px-3 py-2"
          style={{ backgroundColor: inputBackground, minHeight: 36 }}
        >
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.foreground.muted}
            multiline
            maxLength={2000}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              flex: 1,
              fontSize: 16,
              lineHeight: 20,
              color: colors.foreground.DEFAULT,
              maxHeight: 100,
              paddingTop: 0,
              paddingBottom: 0,
            }}
          />
        </View>

        {/* Send button */}
        {canSend ? (
          <Pressable
            onPress={handleSend}
            className="w-8 h-8 rounded-full bg-primary items-center justify-center"
          >
            <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
          </Pressable>
        ) : (
          <ActionButton icon="mic" onPress={() => haptics.light()} />
        )}
      </View>
    </GlassContainer>
  );
}

/**
 * TypingIndicator Component
 *
 * iOS-style typing indicator with animated dots.
 */

export function TypingIndicator({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  const { colors, isDark } = useTheme();

  return (
    <View className={cn("flex-row items-center mb-2", className)}>
      <View className="w-8 mr-2">
        {name && <Avatar name={name} size="sm" />}
      </View>
      <View
        className="rounded-2xl px-4 py-3"
        style={{ backgroundColor: isDark ? "#3A3A3C" : "#E9E9EB" }}
      >
        <View className="flex-row gap-1">
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              className="w-2 h-2 rounded-full bg-foreground-muted"
            />
          ))}
        </View>
      </View>
    </View>
  );
}
