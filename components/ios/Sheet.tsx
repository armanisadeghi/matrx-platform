/**
 * Sheet Component
 *
 * iOS-style bottom sheet with glass effect.
 * Supports drag-to-dismiss and snap points.
 */

import { useEffect, useCallback } from "react";
import {
  View,
  Pressable,
  Modal,
  Dimensions,
  type ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GlassContainer } from "@/components/glass";
import { useHaptics } from "@/hooks/useHaptics";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface SheetProps {
  /**
   * Whether the sheet is visible
   */
  visible: boolean;

  /**
   * Close handler
   */
  onClose: () => void;

  /**
   * Sheet content
   */
  children: React.ReactNode;

  /**
   * Snap points as percentages of screen height
   * @default [0.5, 0.9]
   */
  snapPoints?: number[];

  /**
   * Initial snap point index
   * @default 0
   */
  initialSnapIndex?: number;

  /**
   * Whether the sheet can be dismissed by dragging down
   * @default true
   */
  enableDismiss?: boolean;

  /**
   * Whether to show backdrop
   * @default true
   */
  showBackdrop?: boolean;

  /**
   * Whether to use glass effect
   * @default true
   */
  useGlass?: boolean;

  /**
   * Whether to show handle indicator
   * @default true
   */
  showHandle?: boolean;

  /**
   * Title for the sheet header
   */
  title?: string;

  /**
   * Additional className
   */
  className?: string;

  /**
   * Additional style
   */
  style?: ViewStyle;
}

export function Sheet({
  visible,
  onClose,
  children,
  snapPoints = [0.5, 0.9],
  initialSnapIndex = 0,
  enableDismiss = true,
  showBackdrop = true,
  useGlass = true,
  showHandle = true,
  title,
  className,
  style,
}: SheetProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();

  // Calculate snap point heights
  const snapPointHeights = snapPoints.map((p) => SCREEN_HEIGHT * (1 - p));

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const currentSnapIndex = useSharedValue(initialSnapIndex);
  const backdropOpacity = useSharedValue(0);

  // Open sheet
  useEffect(() => {
    if (visible) {
      const targetHeight = snapPointHeights[initialSnapIndex] ?? snapPointHeights[0] ?? SCREEN_HEIGHT * 0.5;
      translateY.value = withSpring(targetHeight, {
        damping: 20,
        stiffness: 200,
      });
      backdropOpacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 });
      backdropOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, snapPointHeights, initialSnapIndex, translateY, backdropOpacity]);

  const closeSheet = useCallback(() => {
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 });
    backdropOpacity.value = withTiming(0, { duration: 200 });
    setTimeout(onClose, 200);
  }, [onClose, translateY, backdropOpacity]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const currentHeight = snapPointHeights[currentSnapIndex.value] ?? snapPointHeights[0] ?? 0;
      const minHeight = snapPointHeights[snapPointHeights.length - 1] ?? 0;
      const newY = currentHeight + event.translationY;
      translateY.value = Math.max(newY, minHeight);
    })
    .onEnd((event) => {
      // Find nearest snap point
      const currentY = translateY.value;

      // Check if should dismiss
      if (enableDismiss && event.velocityY > 500) {
        runOnJS(haptics.light)();
        runOnJS(closeSheet)();
        return;
      }

      // Find closest snap point
      let closestIndex = 0;
      let closestDistance = Math.abs(currentY - (snapPointHeights[0] ?? 0));

      for (let i = 1; i < snapPointHeights.length; i++) {
        const distance = Math.abs(currentY - (snapPointHeights[i] ?? 0));
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      }

      // Check if dragged below first snap point (dismiss)
      const firstSnapPoint = snapPointHeights[0] ?? 0;
      if (enableDismiss && currentY > firstSnapPoint + 100) {
        runOnJS(haptics.light)();
        runOnJS(closeSheet)();
        return;
      }

      currentSnapIndex.value = closestIndex;
      const targetHeight = snapPointHeights[closestIndex] ?? snapPointHeights[0] ?? 0;
      translateY.value = withSpring(targetHeight, {
        damping: 20,
        stiffness: 200,
      });
      runOnJS(haptics.selection)();
    });

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value * 0.5,
  }));

  if (!visible) return null;

  const sheetContent = (
    <View className="flex-1">
      {/* Handle */}
      {showHandle && (
        <View className="items-center pt-2 pb-2">
          <View
            className="w-9 h-1 rounded-full"
            style={{ backgroundColor: isDark ? "#5C5C5E" : "#D1D1D6" }}
          />
        </View>
      )}

      {/* Title */}
      {title && (
        <View className="px-4 py-2 border-b border-border">
          <Animated.Text
            className="text-center text-lg font-semibold"
            style={{ color: colors.foreground.DEFAULT }}
          >
            {title}
          </Animated.Text>
        </View>
      )}

      {/* Content */}
      <View className="flex-1" style={{ paddingBottom: insets.bottom }}>
        {children}
      </View>
    </View>
  );

  return (
    <Modal transparent visible={visible} animationType="none">
      <View className="flex-1">
        {/* Backdrop */}
        {showBackdrop && (
          <Animated.View
            className="absolute inset-0 bg-black"
            style={animatedBackdropStyle}
          >
            <Pressable className="flex-1" onPress={enableDismiss ? closeSheet : undefined} />
          </Animated.View>
        )}

        {/* Sheet */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            className={cn("absolute left-0 right-0", className)}
            style={[
              {
                top: 0,
                height: SCREEN_HEIGHT,
              },
              animatedSheetStyle,
              style,
            ]}
          >
            {useGlass ? (
              <GlassContainer
                intensity="strong"
                tint="surface"
                borderRadius="xl"
                className="flex-1 rounded-b-none"
                style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
              >
                {sheetContent}
              </GlassContainer>
            ) : (
              <View
                className="flex-1 bg-surface rounded-t-3xl"
                style={{
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                }}
              >
                {sheetContent}
              </View>
            )}
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

/**
 * ActionSheet Component
 *
 * iOS-style action sheet with options.
 */

export interface ActionSheetOption {
  /**
   * Option label
   */
  label: string;

  /**
   * Option icon
   */
  icon?: keyof (typeof import("@expo/vector-icons"))["Ionicons"]["glyphMap"];

  /**
   * Whether this is destructive
   */
  destructive?: boolean;

  /**
   * Whether this is the cancel button
   */
  isCancel?: boolean;

  /**
   * Press handler
   */
  onPress?: () => void;
}

export interface ActionSheetProps {
  /**
   * Whether the sheet is visible
   */
  visible: boolean;

  /**
   * Close handler
   */
  onClose: () => void;

  /**
   * Sheet title
   */
  title?: string;

  /**
   * Sheet message
   */
  message?: string;

  /**
   * Options to display
   */
  options: ActionSheetOption[];
}

import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui";

export function ActionSheet({
  visible,
  onClose,
  title,
  message,
  options,
}: ActionSheetProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();

  if (!visible) return null;

  const regularOptions = options.filter((o) => !o.isCancel);
  const cancelOption = options.find((o) => o.isCancel);

  const handleOptionPress = (option: ActionSheetOption) => {
    haptics.light();
    option.onPress?.();
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 justify-end">
        {/* Backdrop */}
        <Pressable
          className="absolute inset-0 bg-black/50"
          onPress={onClose}
        />

        {/* Content */}
        <Animated.View
          style={{ paddingBottom: Math.max(insets.bottom, 16), paddingHorizontal: 8 }}
        >
          {/* Options group */}
          <GlassContainer intensity="strong" tint="surface" borderRadius="xl">
            {/* Header */}
            {(title || message) && (
              <View className="px-4 py-3 border-b border-border/50">
                {title && (
                  <Text variant="caption" color="secondary" className="text-center">
                    {title}
                  </Text>
                )}
                {message && (
                  <Text variant="caption" color="muted" className="text-center mt-1">
                    {message}
                  </Text>
                )}
              </View>
            )}

            {/* Options */}
            {regularOptions.map((option, index) => (
              <View key={index}>
                <Pressable
                  onPress={() => handleOptionPress(option)}
                  className="px-4 py-4"
                >
                  <View className="flex-row items-center justify-center">
                    {option.icon && (
                      <Ionicons
                        name={option.icon}
                        size={20}
                        color={option.destructive ? colors.error.DEFAULT : colors.primary.DEFAULT}
                        style={{ marginRight: 8 }}
                      />
                    )}
                    <Text
                      variant="body"
                      style={{
                        color: option.destructive ? colors.error.DEFAULT : colors.primary.DEFAULT,
                        fontWeight: "400",
                        fontSize: 20,
                      }}
                    >
                      {option.label}
                    </Text>
                  </View>
                </Pressable>
                {index < regularOptions.length - 1 && (
                  <View className="h-px bg-border/50" />
                )}
              </View>
            ))}
          </GlassContainer>

          {/* Cancel button */}
          {cancelOption && (
            <GlassContainer
              intensity="strong"
              tint="surface"
              borderRadius="xl"
              className="mt-2"
            >
              <Pressable
                onPress={() => handleOptionPress(cancelOption)}
                className="px-4 py-4"
              >
                <Text
                  variant="body"
                  style={{
                    color: colors.primary.DEFAULT,
                    fontWeight: "600",
                    fontSize: 20,
                    textAlign: "center",
                  }}
                >
                  {cancelOption.label}
                </Text>
              </Pressable>
            </GlassContainer>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}
