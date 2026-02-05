/**
 * KeyboardAwareView component
 *
 * Wrapper that handles keyboard avoidance across platforms.
 * Automatically adjusts content when keyboard appears.
 */

import {
  KeyboardAvoidingView,
  Platform,
  type KeyboardAvoidingViewProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";

export interface KeyboardAwareViewProps
  extends Omit<KeyboardAvoidingViewProps, "behavior"> {
  /**
   * Children to render
   */
  children: React.ReactNode;

  /**
   * Behavior override (auto-detected by platform if not specified)
   */
  behavior?: KeyboardAvoidingViewProps["behavior"];

  /**
   * Additional offset to add to keyboard height
   * @default 0
   */
  extraOffset?: number;

  /**
   * Whether to account for safe area top inset
   * @default true
   */
  useSafeArea?: boolean;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * KeyboardAwareView component
 *
 * @example
 * ```tsx
 * // Basic form usage
 * <KeyboardAwareView className="flex-1">
 *   <Input label="Email" />
 *   <Input label="Password" />
 *   <Button>Submit</Button>
 * </KeyboardAwareView>
 *
 * // With extra offset for custom header
 * <KeyboardAwareView extraOffset={60}>
 *   <ChatInput />
 * </KeyboardAwareView>
 * ```
 */
export function KeyboardAwareView({
  children,
  behavior,
  extraOffset = 0,
  useSafeArea = true,
  className,
  style,
  ...props
}: KeyboardAwareViewProps) {
  const insets = useSafeAreaInsets();

  // Platform-specific behavior
  const platformBehavior = behavior ?? (Platform.OS === "ios" ? "padding" : "height");

  // Calculate keyboard offset
  const keyboardOffset = useSafeArea ? insets.top + extraOffset : extraOffset;

  return (
    <KeyboardAvoidingView
      className={cn("flex-1", className)}
      behavior={platformBehavior}
      keyboardVerticalOffset={keyboardOffset}
      style={style}
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
