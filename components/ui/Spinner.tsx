/**
 * Spinner component
 *
 * Loading indicator with size and color variants.
 */

import { ActivityIndicator, View, Modal } from "react-native";
import { Text } from "./Text";
import { useTheme } from "@/hooks/useTheme";

/**
 * Spinner size types
 */
export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps {
  /**
   * Spinner size
   * @default 'md'
   */
  size?: SpinnerSize;

  /**
   * Spinner color
   * @default 'primary'
   */
  color?: "primary" | "secondary" | "white" | "muted";

  /**
   * Additional className
   */
  className?: string;
}

/**
 * Size mapping
 */
const sizeMap: Record<SpinnerSize, "small" | "large"> = {
  sm: "small",
  md: "small",
  lg: "large",
};

/**
 * Spinner component
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner size="lg" color="white" />
 * ```
 */
export function Spinner({
  size = "md",
  color = "primary",
  className = "",
}: SpinnerProps) {
  const { colors } = useTheme();

  const colorMap = {
    primary: colors.primary.DEFAULT,
    secondary: colors.secondary.DEFAULT,
    white: "#FFFFFF",
    muted: colors.foreground.muted,
  };

  return (
    <View className={className}>
      <ActivityIndicator size={sizeMap[size]} color={colorMap[color]} />
    </View>
  );
}

/**
 * LoadingOverlay component
 *
 * Full-screen loading overlay with optional message.
 */
export interface LoadingOverlayProps {
  /**
   * Whether the overlay is visible
   */
  visible: boolean;

  /**
   * Loading message to display
   */
  message?: string;

  /**
   * Whether the overlay can be dismissed
   * @default false
   */
  dismissible?: boolean;

  /**
   * Handler for dismiss
   */
  onDismiss?: () => void;
}

export function LoadingOverlay({
  visible,
  message,
  dismissible = false,
  onDismiss,
}: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={dismissible ? onDismiss : undefined}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-surface rounded-2xl p-6 items-center min-w-[120px]">
          <Spinner size="lg" />
          {message && (
            <Text variant="body" className="mt-3 text-center">
              {message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}
