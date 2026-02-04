/**
 * Avatar component
 *
 * Display user avatars with image, initials, or icon fallback.
 */

import { View, Image, type ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { useTheme } from "@/hooks/useTheme";

/**
 * Avatar size types
 */
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface AvatarProps {
  /**
   * Image source for the avatar
   */
  source?: ImageSourcePropType | string;

  /**
   * Name to generate initials from (used when no image)
   */
  name?: string;

  /**
   * Avatar size
   * @default 'md'
   */
  size?: AvatarSize;

  /**
   * Whether to show online status indicator
   * @default false
   */
  showStatus?: boolean;

  /**
   * Online status
   * @default 'offline'
   */
  status?: "online" | "offline" | "away" | "busy";

  /**
   * Background color for initials avatar
   * @default 'primary'
   */
  backgroundColor?: "primary" | "secondary" | "surface";

  /**
   * Additional className
   */
  className?: string;
}

/**
 * Size configurations
 */
const sizeConfig: Record<AvatarSize, { size: number; text: string; status: number }> = {
  xs: { size: 24, text: "text-xs", status: 6 },
  sm: { size: 32, text: "text-sm", status: 8 },
  md: { size: 40, text: "text-base", status: 10 },
  lg: { size: 48, text: "text-lg", status: 12 },
  xl: { size: 64, text: "text-xl", status: 14 },
  "2xl": { size: 80, text: "text-2xl", status: 16 },
};

/**
 * Status colors
 */
const statusColors = {
  online: "bg-success",
  offline: "bg-foreground-muted",
  away: "bg-warning",
  busy: "bg-error",
};

/**
 * Get initials from name
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0]?.charAt(0).toUpperCase() || "";
  }
  return (
    (parts[0]?.charAt(0) || "") + (parts[parts.length - 1]?.charAt(0) || "")
  ).toUpperCase();
}

/**
 * Avatar component
 *
 * @example
 * ```tsx
 * <Avatar source={{ uri: "https://example.com/avatar.jpg" }} />
 * <Avatar name="John Doe" />
 * <Avatar name="Jane" size="lg" showStatus status="online" />
 * ```
 */
export function Avatar({
  source,
  name,
  size = "md",
  showStatus = false,
  status = "offline",
  backgroundColor = "primary",
  className = "",
}: AvatarProps) {
  const { colors } = useTheme();
  const config = sizeConfig[size];

  const bgColorClass =
    backgroundColor === "primary"
      ? "bg-primary"
      : backgroundColor === "secondary"
      ? "bg-secondary"
      : "bg-surface-elevated";

  // Determine image source
  const imageSource =
    typeof source === "string" ? { uri: source } : source;

  const hasImage = !!imageSource;
  const initials = name ? getInitials(name) : "";

  return (
    <View className={`relative ${className}`}>
      {/* Avatar container */}
      <View
        className={`items-center justify-center rounded-full overflow-hidden ${
          !hasImage ? bgColorClass : "bg-surface-elevated"
        }`}
        style={{ width: config.size, height: config.size }}
      >
        {hasImage ? (
          <Image
            source={imageSource}
            style={{ width: config.size, height: config.size }}
            resizeMode="cover"
          />
        ) : initials ? (
          <Text
            className={`font-semibold text-white ${config.text}`}
          >
            {initials}
          </Text>
        ) : (
          <Ionicons
            name="person"
            size={config.size * 0.5}
            color={colors.foreground.muted}
          />
        )}
      </View>

      {/* Status indicator */}
      {showStatus && (
        <View
          className={`absolute bottom-0 right-0 rounded-full border-2 border-background ${statusColors[status]}`}
          style={{
            width: config.status,
            height: config.status,
          }}
        />
      )}
    </View>
  );
}

/**
 * AvatarGroup component for displaying multiple avatars
 */
export interface AvatarGroupProps {
  /**
   * Array of avatar data
   */
  avatars: Array<{
    source?: ImageSourcePropType | string;
    name?: string;
  }>;

  /**
   * Maximum number of avatars to show
   * @default 3
   */
  max?: number;

  /**
   * Avatar size
   * @default 'md'
   */
  size?: AvatarSize;

  /**
   * Additional className
   */
  className?: string;
}

export function AvatarGroup({
  avatars,
  max = 3,
  size = "md",
  className = "",
}: AvatarGroupProps) {
  const config = sizeConfig[size];
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;
  const overlap = config.size * 0.3;

  return (
    <View className={`flex-row ${className}`}>
      {visibleAvatars.map((avatar, index) => (
        <View
          key={index}
          style={{ marginLeft: index > 0 ? -overlap : 0, zIndex: max - index }}
        >
          <Avatar
            source={avatar.source}
            name={avatar.name}
            size={size}
            className="border-2 border-background"
          />
        </View>
      ))}
      {remainingCount > 0 && (
        <View
          className="items-center justify-center rounded-full bg-surface-elevated border-2 border-background"
          style={{
            width: config.size,
            height: config.size,
            marginLeft: -overlap,
          }}
        >
          <Text variant="caption" color="secondary">
            +{remainingCount}
          </Text>
        </View>
      )}
    </View>
  );
}
