/**
 * MaterialSnackbar - Android Material 3 Snackbar
 *
 * Implements Material 3 snackbar for brief messages with optional action.
 */

import { useState, useCallback, useRef, useEffect, createContext, useContext } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";

export interface MaterialSnackbarProps {
  /**
   * Snackbar message
   */
  message: string;

  /**
   * Action button label
   */
  actionLabel?: string;

  /**
   * Action button handler
   */
  onAction?: () => void;

  /**
   * Duration in ms before auto-dismiss
   * @default 4000
   */
  duration?: number;

  /**
   * Whether snackbar is visible
   */
  visible: boolean;

  /**
   * Dismiss handler
   */
  onDismiss: () => void;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * MaterialSnackbar - Material 3 snackbar component
 *
 * @example
 * ```tsx
 * const [visible, setVisible] = useState(false);
 *
 * <MaterialSnackbar
 *   message="Item deleted"
 *   actionLabel="Undo"
 *   onAction={() => undoDelete()}
 *   visible={visible}
 *   onDismiss={() => setVisible(false)}
 * />
 * ```
 */
export function MaterialSnackbar({
  message,
  actionLabel,
  onAction,
  duration = 4000,
  visible,
  onDismiss,
  className,
}: MaterialSnackbarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 15 });
      opacity.value = withTiming(1, { duration: 200 });

      // Auto-dismiss
      if (duration > 0) {
        timeoutRef.current = setTimeout(() => {
          onDismiss();
        }, duration);
      }
    } else {
      translateY.value = withSpring(100, { damping: 15 });
      opacity.value = withTiming(0, { duration: 150 });
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, duration, onDismiss, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const handleAction = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onAction?.();
    onDismiss();
  };

  if (!visible && opacity.value === 0) {
    return null;
  }

  return (
    <Animated.View
      className={cn(
        "absolute left-4 right-4 rounded-lg bg-foreground shadow-lg",
        className
      )}
      style={[
        {
          bottom: insets.bottom + 16,
        },
        animatedStyle,
      ]}
    >
      <View className="flex-row items-center justify-between px-4 py-3 min-h-[48px]">
        <Text
          variant="body"
          className="flex-1 mr-2"
          style={{ color: colors.background.DEFAULT }}
          numberOfLines={2}
        >
          {message}
        </Text>

        {actionLabel && (
          <Pressable
            onPress={handleAction}
            hitSlop={8}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Text
              variant="label"
              className="font-medium"
              style={{ color: colors.primary.light }}
            >
              {actionLabel}
            </Text>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

// Snackbar Context for imperative API
interface SnackbarConfig {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface SnackbarContextValue {
  show: (config: SnackbarConfig) => void;
  hide: () => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

/**
 * Hook for showing snackbars imperatively
 *
 * @example
 * ```tsx
 * const snackbar = useMaterialSnackbar();
 *
 * const handleDelete = () => {
 *   deleteItem();
 *   snackbar.show({
 *     message: 'Item deleted',
 *     actionLabel: 'Undo',
 *     onAction: () => undoDelete(),
 *   });
 * };
 * ```
 */
export function useMaterialSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useMaterialSnackbar must be used within MaterialSnackbarProvider");
  }
  return context;
}

/**
 * Provider component for snackbar functionality
 */
export function MaterialSnackbarProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SnackbarConfig | null>(null);
  const [visible, setVisible] = useState(false);

  const show = useCallback((newConfig: SnackbarConfig) => {
    setConfig(newConfig);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <SnackbarContext.Provider value={{ show, hide }}>
      {children}
      {config && (
        <MaterialSnackbar
          message={config.message}
          actionLabel={config.actionLabel}
          onAction={config.onAction}
          duration={config.duration}
          visible={visible}
          onDismiss={hide}
        />
      )}
    </SnackbarContext.Provider>
  );
}
