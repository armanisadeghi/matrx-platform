/**
 * Toast component
 *
 * Temporary notification messages that appear at the top or bottom of the screen.
 * Includes a ToastProvider and useToast hook for easy usage.
 */

import { createContext, useContext, useState, useCallback } from "react";
import { View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";

/**
 * Toast variant types
 */
export type ToastVariant = "default" | "success" | "warning" | "error" | "info";

/**
 * Toast position
 */
export type ToastPosition = "top" | "bottom";

export interface ToastConfig {
  /**
   * Toast message
   */
  message: string;

  /**
   * Optional title
   */
  title?: string;

  /**
   * Toast variant
   * @default 'default'
   */
  variant?: ToastVariant;

  /**
   * Duration in milliseconds
   * @default 3000
   */
  duration?: number;

  /**
   * Position on screen
   * @default 'top'
   */
  position?: ToastPosition;

  /**
   * Action button
   */
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastContextValue {
  show: (config: ToastConfig) => void;
  hide: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * useToast hook
 *
 * @example
 * ```tsx
 * const toast = useToast();
 *
 * toast.show({ message: 'Saved successfully', variant: 'success' });
 * toast.show({ message: 'Error occurred', variant: 'error', title: 'Oops!' });
 * ```
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

/**
 * Variant configurations
 */
const variantConfig: Record<
  ToastVariant,
  { bg: string; icon: keyof typeof Ionicons.glyphMap; iconColor: string }
> = {
  default: { bg: "bg-surface-elevated", icon: "information-circle", iconColor: "foreground" },
  success: { bg: "bg-success", icon: "checkmark-circle", iconColor: "white" },
  warning: { bg: "bg-warning", icon: "warning", iconColor: "white" },
  error: { bg: "bg-error", icon: "alert-circle", iconColor: "white" },
  info: { bg: "bg-info", icon: "information-circle", iconColor: "white" },
};

/**
 * Toast component (internal)
 */
function Toast({
  config,
  onHide,
}: {
  config: ToastConfig;
  onHide: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const haptics = useHaptics();

  const {
    message,
    title,
    variant = "default",
    duration = 3000,
    position = "top",
    action,
  } = config;

  const variantStyle = variantConfig[variant];
  const translateY = useSharedValue(position === "top" ? -100 : 100);
  const opacity = useSharedValue(0);

  // Animate in
  translateY.value = withTiming(0, { duration: 300 });
  opacity.value = withTiming(1, { duration: 300 });

  // Auto hide after duration
  translateY.value = withDelay(
    duration,
    withTiming(position === "top" ? -100 : 100, { duration: 300 }, () => {
      runOnJS(onHide)();
    })
  );
  opacity.value = withDelay(duration, withTiming(0, { duration: 300 }));

  // Haptic feedback based on variant
  if (variant === "error") {
    haptics.error();
  } else if (variant === "success") {
    haptics.success();
  } else if (variant === "warning") {
    haptics.warning();
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const iconColor =
    variantStyle.iconColor === "white"
      ? colors.foreground.inverse
      : colors.foreground.DEFAULT;

  return (
    <Animated.View
      className="absolute left-4 right-4 z-50"
      style={[
        animatedStyle,
        position === "top"
          ? { top: insets.top + 8 }
          : { bottom: insets.bottom + 8 },
      ]}
    >
      <View
        className={cn(
          "flex-row items-center rounded-xl p-4 shadow-lg",
          variantStyle.bg
        )}
      >
        <Ionicons
          name={variantStyle.icon}
          size={24}
          color={iconColor}
          style={{ marginRight: 12 }}
        />
        <View className="flex-1">
          {title && (
            <Text
              variant="label"
              className={cn(
                "font-semibold mb-0.5",
                variant !== "default" && "text-white"
              )}
            >
              {title}
            </Text>
          )}
          <Text
            variant="body"
            className={variant !== "default" ? "text-white" : undefined}
          >
            {message}
          </Text>
        </View>
        {action && (
          <Pressable onPress={action.onPress} className="ml-3">
            <Text
              variant="label"
              className={cn(
                "font-semibold",
                variant !== "default" ? "text-white" : "text-primary"
              )}
            >
              {action.label}
            </Text>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

/**
 * ToastProvider component
 *
 * Wrap your app with this provider to enable toast notifications.
 *
 * @example
 * ```tsx
 * // In _layout.tsx
 * <ToastProvider>
 *   <Stack />
 * </ToastProvider>
 *
 * // In any component
 * const toast = useToast();
 * toast.show({ message: 'Hello!', variant: 'success' });
 * ```
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [currentToast, setCurrentToast] = useState<ToastConfig | null>(null);

  const show = useCallback((config: ToastConfig) => {
    setCurrentToast(config);
  }, []);

  const hide = useCallback(() => {
    setCurrentToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}
      {currentToast && <Toast config={currentToast} onHide={hide} />}
    </ToastContext.Provider>
  );
}
