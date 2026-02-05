/**
 * Alert component
 *
 * Modal dialog for confirmations, warnings, and important messages.
 * Cross-platform alternative to native Alert.alert().
 */

import { Modal, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/**
 * Alert variant types
 */
export type AlertVariant = "default" | "destructive" | "warning" | "success";

export interface AlertAction {
  /**
   * Button text
   */
  text: string;

  /**
   * Action handler
   */
  onPress?: () => void;

  /**
   * Button style
   * @default 'default'
   */
  style?: "default" | "cancel" | "destructive";
}

export interface AlertProps {
  /**
   * Whether the alert is visible
   */
  visible: boolean;

  /**
   * Close handler
   */
  onClose: () => void;

  /**
   * Alert title
   */
  title: string;

  /**
   * Alert message
   */
  message?: string;

  /**
   * Alert variant (affects icon and styling)
   * @default 'default'
   */
  variant?: AlertVariant;

  /**
   * Action buttons
   */
  actions?: AlertAction[];

  /**
   * Whether tapping backdrop closes alert
   * @default true
   */
  dismissable?: boolean;
}

/**
 * Variant configurations
 */
const variantConfig: Record<
  AlertVariant,
  { icon: keyof typeof Ionicons.glyphMap; iconBg: string; iconColor: string }
> = {
  default: {
    icon: "information-circle",
    iconBg: "bg-primary-container",
    iconColor: "primary",
  },
  destructive: {
    icon: "alert-circle",
    iconBg: "bg-error-light",
    iconColor: "error",
  },
  warning: {
    icon: "warning",
    iconBg: "bg-warning-light",
    iconColor: "warning",
  },
  success: {
    icon: "checkmark-circle",
    iconBg: "bg-success-light",
    iconColor: "success",
  },
};

/**
 * Alert component
 *
 * @example
 * ```tsx
 * // Confirmation dialog
 * <Alert
 *   visible={showAlert}
 *   onClose={() => setShowAlert(false)}
 *   title="Delete Item?"
 *   message="This action cannot be undone."
 *   variant="destructive"
 *   actions={[
 *     { text: 'Cancel', style: 'cancel', onPress: () => setShowAlert(false) },
 *     { text: 'Delete', style: 'destructive', onPress: handleDelete },
 *   ]}
 * />
 *
 * // Simple info alert
 * <Alert
 *   visible={showInfo}
 *   onClose={() => setShowInfo(false)}
 *   title="Welcome!"
 *   message="Thanks for joining us."
 *   actions={[{ text: 'Got it', onPress: () => setShowInfo(false) }]}
 * />
 * ```
 */
export function Alert({
  visible,
  onClose,
  title,
  message,
  variant = "default",
  actions = [{ text: "OK", onPress: onClose }],
  dismissable = true,
}: AlertProps) {
  const { colors } = useTheme();
  const config = variantConfig[variant];

  const getIconColor = (): string => {
    switch (config.iconColor) {
      case "primary":
        return colors.primary.DEFAULT;
      case "error":
        return colors.error.DEFAULT;
      case "warning":
        return colors.warning.DEFAULT;
      case "success":
        return colors.success.DEFAULT;
      default:
        return colors.foreground.DEFAULT;
    }
  };

  const handleBackdropPress = () => {
    if (dismissable) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <Pressable
          className="absolute inset-0"
          onPress={handleBackdropPress}
        />

        <View className="bg-surface rounded-2xl w-full max-w-sm overflow-hidden">
          {/* Content */}
          <View className="items-center pt-6 pb-4 px-6">
            {/* Icon */}
            <View
              className={cn(
                "w-14 h-14 rounded-full items-center justify-center mb-4",
                config.iconBg
              )}
            >
              <Ionicons name={config.icon} size={28} color={getIconColor()} />
            </View>

            {/* Title */}
            <Text variant="h3" className="text-center mb-2">
              {title}
            </Text>

            {/* Message */}
            {message && (
              <Text variant="body" color="secondary" className="text-center">
                {message}
              </Text>
            )}
          </View>

          {/* Actions */}
          <View
            className={cn(
              "flex-row border-t border-border",
              actions.length > 2 && "flex-col"
            )}
          >
            {actions.map((action, index) => {
              const isDestructive = action.style === "destructive";
              const isCancel = action.style === "cancel";

              // Vertical layout for 3+ actions
              if (actions.length > 2) {
                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                      action.onPress?.();
                    }}
                    className={cn(
                      "py-4 items-center",
                      index < actions.length - 1 && "border-b border-border"
                    )}
                  >
                    <Text
                      className={cn(
                        "font-medium",
                        isDestructive && "text-error",
                        isCancel && "text-foreground-secondary",
                        !isDestructive && !isCancel && "text-primary"
                      )}
                    >
                      {action.text}
                    </Text>
                  </Pressable>
                );
              }

              // Horizontal layout for 1-2 actions
              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    action.onPress?.();
                  }}
                  className={cn(
                    "flex-1 py-4 items-center",
                    index > 0 && "border-l border-border"
                  )}
                >
                  <Text
                    className={cn(
                      "font-medium",
                      isDestructive && "text-error",
                      isCancel && "text-foreground-secondary",
                      !isDestructive && !isCancel && "text-primary"
                    )}
                  >
                    {action.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

/**
 * Hook for imperative alert usage
 */
export interface UseAlertOptions {
  title: string;
  message?: string;
  variant?: AlertVariant;
  actions?: AlertAction[];
}

// Note: For imperative usage, create a global AlertProvider similar to ToastProvider
// This component provides the declarative API which is the recommended approach in React
