/**
 * GlassDock Component
 *
 * iOS-style dock with liquid glass effect.
 * Matches the iOS 26 home screen dock aesthetic.
 */

import { View, Pressable, type ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
import { useHaptics } from "@/hooks/useHaptics";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export interface DockItem {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Ionicon name
   */
  icon: keyof typeof Ionicons.glyphMap;

  /**
   * Icon color
   */
  color?: string;

  /**
   * Badge count
   */
  badgeCount?: number;

  /**
   * Whether this item is active/selected
   */
  isActive?: boolean;

  /**
   * Press handler
   */
  onPress?: () => void;
}

export interface GlassDockProps {
  /**
   * Dock items
   */
  items: DockItem[];

  /**
   * Whether to show the dock
   * @default true
   */
  visible?: boolean;

  /**
   * Additional className
   */
  className?: string;

  /**
   * Additional style
   */
  style?: ViewStyle;
}

function DockItemComponent({ item }: { item: DockItem }) {
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
    item.onPress?.();
  };

  const iconColor = item.color || colors.foreground.DEFAULT;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        className="relative p-2"
      >
        <View
          className={cn(
            "w-14 h-14 rounded-2xl items-center justify-center",
            item.isActive ? "bg-primary/20" : "bg-surface-elevated/60"
          )}
        >
          <Ionicons
            name={item.icon}
            size={28}
            color={item.isActive ? colors.primary.DEFAULT : iconColor}
          />
        </View>
        {item.badgeCount !== undefined && item.badgeCount > 0 && (
          <View className="absolute top-0 right-0">
            <Badge variant="error" size="sm" count={item.badgeCount} maxCount={99} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

export function GlassDock({
  items,
  visible = true,
  className,
  style,
}: GlassDockProps) {
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <View
      className={cn("absolute bottom-0 left-0 right-0 items-center", className)}
      style={[{ paddingBottom: Math.max(insets.bottom, 8) }, style]}
    >
      <GlassContainer
        intensity="medium"
        tint="surface"
        borderRadius="full"
        className="mx-4"
      >
        <View className="flex-row items-center px-2 py-2">
          {items.map((item) => (
            <DockItemComponent key={item.id} item={item} />
          ))}
        </View>
      </GlassContainer>
    </View>
  );
}

/**
 * FloatingTabBar - Tab bar variant with glass effect
 *
 * Similar to GlassDock but designed for bottom tab navigation.
 */

export interface TabBarItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFilled?: keyof typeof Ionicons.glyphMap;
  label: string;
  badgeCount?: number;
  isActive?: boolean;
  onPress?: () => void;
}

export interface FloatingTabBarProps {
  items: TabBarItem[];
  className?: string;
  style?: ViewStyle;
}

function TabBarItemComponent({ item }: { item: TabBarItem }) {
  const { colors } = useTheme();
  const haptics = useHaptics();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    haptics.selection();
    item.onPress?.();
  };

  const iconName = item.isActive && item.iconFilled ? item.iconFilled : item.icon;
  const iconColor = item.isActive ? colors.primary.DEFAULT : colors.foreground.muted;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        className={cn(
          "items-center px-4 py-2 rounded-full",
          item.isActive && "bg-primary/10"
        )}
      >
        <View className="relative">
          <Ionicons name={iconName} size={24} color={iconColor} />
          {item.badgeCount !== undefined && item.badgeCount > 0 && (
            <View className="absolute -top-1 -right-2">
              <Badge variant="error" size="sm" count={item.badgeCount} maxCount={9} />
            </View>
          )}
        </View>
        <View className="mt-1">
          <Animated.Text
            style={{
              fontSize: 10,
              fontWeight: item.isActive ? "600" : "400",
              color: iconColor,
            }}
          >
            {item.label}
          </Animated.Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function FloatingTabBar({ items, className, style }: FloatingTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={cn("absolute bottom-0 left-0 right-0 items-center", className)}
      style={[{ paddingBottom: Math.max(insets.bottom, 8) }, style]}
    >
      <GlassContainer
        intensity="medium"
        tint="surface"
        borderRadius="full"
        className="mx-4"
      >
        <View className="flex-row items-center px-1 py-1">
          {items.map((item) => (
            <TabBarItemComponent key={item.id} item={item} />
          ))}
        </View>
      </GlassContainer>
    </View>
  );
}
