/**
 * Badge component
 *
 * Status badges and notification indicators.
 */

import { View } from "react-native";
import { Text } from "./Text";
import { cn } from "@/lib/utils";

/**
 * Badge variant types
 */
export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";

/**
 * Badge size types
 */
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  /**
   * Badge content (text or number)
   */
  children?: React.ReactNode;

  /**
   * Badge variant
   * @default 'default'
   */
  variant?: BadgeVariant;

  /**
   * Badge size
   * @default 'md'
   */
  size?: BadgeSize;

  /**
   * Whether to show as a dot (no content)
   * @default false
   */
  dot?: boolean;

  /**
   * Maximum count to display (shows "99+" if exceeded)
   */
  maxCount?: number;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * Variant styles
 */
const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: "bg-surface-elevated", text: "text-foreground" },
  primary: { bg: "bg-primary", text: "text-foreground-inverse" },
  secondary: { bg: "bg-secondary", text: "text-foreground-inverse" },
  success: { bg: "bg-success", text: "text-foreground-inverse" },
  warning: { bg: "bg-warning", text: "text-foreground-inverse" },
  error: { bg: "bg-error", text: "text-foreground-inverse" },
  info: { bg: "bg-info", text: "text-foreground-inverse" },
};

/**
 * Size styles
 */
const sizeStyles: Record<BadgeSize, { padding: string; text: string; dot: number }> = {
  sm: { padding: "px-1.5 py-0.5", text: "text-2xs", dot: 6 },
  md: { padding: "px-2 py-0.5", text: "text-xs", dot: 8 },
  lg: { padding: "px-2.5 py-1", text: "text-sm", dot: 10 },
};

/**
 * Badge component
 *
 * @example
 * ```tsx
 * <Badge>New</Badge>
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" dot />
 * <Badge variant="primary">{notificationCount}</Badge>
 * ```
 */
export function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  maxCount = 99,
  className,
}: BadgeProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  // Format count if it's a number
  const formattedContent =
    typeof children === "number" && maxCount && children > maxCount
      ? `${maxCount}+`
      : children;

  // Dot badge
  if (dot) {
    return (
      <View
        className={cn("rounded-full", variantStyle.bg, className)}
        style={{ width: sizeStyle.dot, height: sizeStyle.dot }}
      />
    );
  }

  return (
    <View
      className={cn("rounded-full", sizeStyle.padding, variantStyle.bg, className)}
    >
      <Text
        className={cn("font-medium", sizeStyle.text, variantStyle.text)}
      >
        {formattedContent}
      </Text>
    </View>
  );
}

/**
 * BadgeGroup component for displaying badge with content
 */
export interface BadgeGroupProps {
  /**
   * Content to wrap with badge
   */
  children: React.ReactNode;

  /**
   * Badge content
   */
  badge?: React.ReactNode;

  /**
   * Badge position
   * @default 'top-right'
   */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";

  /**
   * Badge props
   */
  badgeProps?: Omit<BadgeProps, "children">;

  /**
   * Additional className
   */
  className?: string;
}

const positionStyles = {
  "top-right": "top-0 right-0 -translate-x-1/4 -translate-y-1/4",
  "top-left": "top-0 left-0 translate-x-1/4 -translate-y-1/4",
  "bottom-right": "bottom-0 right-0 -translate-x-1/4 translate-y-1/4",
  "bottom-left": "bottom-0 left-0 translate-x-1/4 translate-y-1/4",
};

export function BadgeGroup({
  children,
  badge,
  position = "top-right",
  badgeProps,
  className,
}: BadgeGroupProps) {
  return (
    <View className={cn("relative", className)}>
      {children}
      {badge !== undefined && (
        <View className={`absolute ${positionStyles[position]}`}>
          <Badge {...badgeProps}>{badge}</Badge>
        </View>
      )}
    </View>
  );
}
