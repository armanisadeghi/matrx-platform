/**
 * MaterialFAB - Android Material 3 Floating Action Button
 *
 * Implements Material 3 FAB variants: standard, small, large, extended.
 */

import { View, Pressable, type ViewStyle, type StyleProp } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export type MaterialFABSize = "small" | "standard" | "large";
export type MaterialFABVariant = "primary" | "secondary" | "tertiary" | "surface";

export interface MaterialFABProps {
  /**
   * Icon name
   */
  icon: keyof typeof Ionicons.glyphMap;

  /**
   * Extended FAB label (optional)
   */
  label?: string;

  /**
   * FAB size
   * @default 'standard'
   */
  size?: MaterialFABSize;

  /**
   * FAB color variant
   * @default 'primary'
   */
  variant?: MaterialFABVariant;

  /**
   * Press handler
   */
  onPress: () => void;

  /**
   * Long press handler
   */
  onLongPress?: () => void;

  /**
   * Position the FAB
   * @default 'bottom-right'
   */
  position?: "bottom-right" | "bottom-left" | "bottom-center" | "none";

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Additional styles
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Additional className
   */
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * MaterialFAB - Material 3 Floating Action Button
 *
 * @example
 * ```tsx
 * // Standard FAB
 * <MaterialFAB
 *   icon="add"
 *   onPress={() => createNew()}
 * />
 *
 * // Extended FAB
 * <MaterialFAB
 *   icon="create"
 *   label="Compose"
 *   onPress={() => compose()}
 * />
 *
 * // Small secondary FAB
 * <MaterialFAB
 *   icon="camera"
 *   size="small"
 *   variant="secondary"
 *   onPress={() => openCamera()}
 * />
 * ```
 */
export function MaterialFAB({
  icon,
  label,
  size = "standard",
  variant = "primary",
  onPress,
  onLongPress,
  position = "bottom-right",
  disabled = false,
  style,
  className,
}: MaterialFABProps) {
  const { colors } = useTheme();
  const haptics = useHaptics();
  const scale = useSharedValue(1);

  // Size configurations
  const sizeConfig = {
    small: { size: 40, iconSize: 20, padding: 8 },
    standard: { size: 56, iconSize: 24, padding: 16 },
    large: { size: 96, iconSize: 36, padding: 30 },
  };

  // Variant colors
  const variantColors: Record<MaterialFABVariant, { bg: string; icon: string }> = {
    primary: { bg: colors.primary.DEFAULT, icon: colors.foreground.inverse },
    secondary: { bg: colors.secondary.DEFAULT, icon: colors.foreground.inverse },
    tertiary: { bg: colors.surface.elevated, icon: colors.primary.DEFAULT },
    surface: { bg: colors.surface.elevated, icon: colors.foreground.DEFAULT },
  };

  // Position styles
  const positionStyles: Record<string, ViewStyle> = {
    "bottom-right": { position: "absolute", bottom: 16, right: 16 },
    "bottom-left": { position: "absolute", bottom: 16, left: 16 },
    "bottom-center": { position: "absolute", bottom: 16, alignSelf: "center" },
    none: {},
  };

  const config = sizeConfig[size];
  const colorConfig = variantColors[variant];
  const isExtended = !!label;

  const handlePress = () => {
    if (!disabled) {
      haptics.medium();
      onPress();
    }
  };

  const handleLongPress = () => {
    if (!disabled && onLongPress) {
      haptics.heavy();
      onLongPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        positionStyles[position],
        animatedStyle,
        { opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      <View
        className={cn(
          "flex-row items-center justify-center rounded-2xl shadow-lg",
          className
        )}
        style={{
          backgroundColor: colorConfig.bg,
          minWidth: isExtended ? undefined : config.size,
          height: config.size,
          paddingHorizontal: isExtended ? 16 : config.padding,
        }}
      >
        <Ionicons
          name={icon}
          size={config.iconSize}
          color={colorConfig.icon}
        />
        {isExtended && (
          <Text
            variant="label"
            className="ml-2 font-medium"
            style={{ color: colorConfig.icon }}
          >
            {label}
          </Text>
        )}
      </View>
    </AnimatedPressable>
  );
}
