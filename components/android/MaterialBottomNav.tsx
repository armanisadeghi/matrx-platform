/**
 * MaterialBottomNav - Android Material 3 Bottom Navigation
 *
 * Implements Material 3 bottom navigation bar with proper
 * animations and indicator styles.
 */

import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";

export interface MaterialNavItem {
  /**
   * Unique key for the item
   */
  key: string;

  /**
   * Item label
   */
  label: string;

  /**
   * Icon when not selected
   */
  icon: keyof typeof Ionicons.glyphMap;

  /**
   * Icon when selected (defaults to icon)
   */
  iconSelected?: keyof typeof Ionicons.glyphMap;

  /**
   * Badge count (optional)
   */
  badge?: number;
}

export interface MaterialBottomNavProps {
  /**
   * Navigation items (3-5 recommended)
   */
  items: MaterialNavItem[];

  /**
   * Currently selected item key
   */
  selectedKey: string;

  /**
   * Selection change handler
   */
  onSelect: (key: string) => void;

  /**
   * Show labels
   * @default true
   */
  showLabels?: boolean;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * MaterialBottomNav - Material 3 bottom navigation bar
 *
 * @example
 * ```tsx
 * const [selected, setSelected] = useState('home');
 *
 * <MaterialBottomNav
 *   items={[
 *     { key: 'home', label: 'Home', icon: 'home-outline', iconSelected: 'home' },
 *     { key: 'search', label: 'Search', icon: 'search-outline', iconSelected: 'search' },
 *     { key: 'profile', label: 'Profile', icon: 'person-outline', iconSelected: 'person' },
 *   ]}
 *   selectedKey={selected}
 *   onSelect={setSelected}
 * />
 * ```
 */
export function MaterialBottomNav({
  items,
  selectedKey,
  onSelect,
  showLabels = true,
  className,
}: MaterialBottomNavProps) {
  const { colors } = useTheme();
  const haptics = useHaptics();
  const insets = useSafeAreaInsets();

  const handleSelect = (key: string) => {
    haptics.light();
    onSelect(key);
  };

  return (
    <View
      className={cn(
        "flex-row items-center justify-around bg-surface-elevated border-t border-border",
        className
      )}
      style={{
        paddingBottom: insets.bottom || 8,
        paddingTop: 12,
      }}
    >
      {items.map((item) => (
        <NavItem
          key={item.key}
          item={item}
          isSelected={selectedKey === item.key}
          onPress={() => handleSelect(item.key)}
          showLabel={showLabels}
          colors={colors}
        />
      ))}
    </View>
  );
}

interface NavItemProps {
  item: MaterialNavItem;
  isSelected: boolean;
  onPress: () => void;
  showLabel: boolean;
  colors: ReturnType<typeof useTheme>["colors"];
}

function NavItem({ item, isSelected, onPress, showLabel, colors }: NavItemProps) {
  const scale = useSharedValue(1);
  const indicatorWidth = useSharedValue(0);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    width: withSpring(isSelected ? 64 : 0, { damping: 15 }),
    opacity: withSpring(isSelected ? 1 : 0, { damping: 15 }),
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isSelected ? 1 : 0.9, { damping: 15 }) }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const iconName = isSelected
    ? (item.iconSelected || item.icon)
    : item.icon;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="items-center justify-center flex-1 py-1"
    >
      {/* Active indicator pill */}
      <View className="relative items-center justify-center h-8 w-16">
        <Animated.View
          className="absolute rounded-full bg-primary/20"
          style={[
            { height: 32 },
            animatedIndicatorStyle,
          ]}
        />
        <Animated.View style={animatedIconStyle}>
          <Ionicons
            name={iconName}
            size={24}
            color={isSelected ? colors.primary.DEFAULT : colors.foreground.muted}
          />
        </Animated.View>

        {/* Badge */}
        {item.badge !== undefined && item.badge > 0 && (
          <View
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-error items-center justify-center px-1"
          >
            <Text
              variant="caption"
              className="text-[10px] font-bold"
              style={{ color: "#FFF" }}
            >
              {item.badge > 99 ? "99+" : item.badge}
            </Text>
          </View>
        )}
      </View>

      {/* Label */}
      {showLabel && (
        <Text
          variant="caption"
          color={isSelected ? "primary" : "muted"}
          className={cn("mt-1", isSelected && "font-medium")}
        >
          {item.label}
        </Text>
      )}
    </Pressable>
  );
}
