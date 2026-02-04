/**
 * Card component
 *
 * Container component with elevated, outlined, and glass variants.
 */

import { View, Pressable, type ViewProps } from "react-native";
import { GlassContainer } from "@/components/glass";
import { useTheme } from "@/hooks/useTheme";

/**
 * Card variant types
 */
export type CardVariant = "elevated" | "outlined" | "filled" | "glass";

export interface CardProps extends ViewProps {
  /**
   * Card variant
   * @default 'elevated'
   */
  variant?: CardVariant;

  /**
   * Whether the card is pressable
   * @default false
   */
  pressable?: boolean;

  /**
   * Press handler (only used when pressable is true)
   */
  onPress?: () => void;

  /**
   * Padding size
   * @default 'md'
   */
  padding?: "none" | "sm" | "md" | "lg";

  /**
   * Additional className for NativeWind styling
   */
  className?: string;

  /**
   * Children content
   */
  children?: React.ReactNode;
}

/**
 * Variant styles
 */
const variantStyles: Record<CardVariant, string> = {
  elevated: "bg-surface shadow-md",
  outlined: "bg-surface border border-border",
  filled: "bg-surface-elevated",
  glass: "", // Handled separately
};

/**
 * Padding styles
 */
const paddingStyles: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

/**
 * Card component
 *
 * @example
 * ```tsx
 * <Card>
 *   <Text variant="h4">Card Title</Text>
 *   <Text>Card content</Text>
 * </Card>
 *
 * <Card variant="glass" pressable onPress={handlePress}>
 *   <Text>Pressable glass card</Text>
 * </Card>
 * ```
 */
export function Card({
  variant = "elevated",
  pressable = false,
  onPress,
  padding = "md",
  className = "",
  children,
  style,
  ...props
}: CardProps) {
  const { shadows } = useTheme();

  const paddingClass = paddingStyles[padding];
  const baseClass = `rounded-2xl overflow-hidden ${paddingClass}`;

  // Glass variant uses GlassContainer
  if (variant === "glass") {
    const content = (
      <GlassContainer
        intensity="light"
        tint="surface"
        borderRadius="xl"
        className={`${paddingClass} ${className}`}
        style={style}
        {...props}
      >
        {children}
      </GlassContainer>
    );

    if (pressable && onPress) {
      return (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
        >
          {content}
        </Pressable>
      );
    }

    return content;
  }

  // Regular variants
  const variantClass = variantStyles[variant];
  const shadowStyle = variant === "elevated" ? shadows.md : undefined;

  const content = (
    <View
      className={`${baseClass} ${variantClass} ${className}`}
      style={[shadowStyle, style]}
      {...props}
    >
      {children}
    </View>
  );

  if (pressable && onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

/**
 * CardHeader component for consistent card headers
 */
export function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <View className={`mb-3 ${className}`}>{children}</View>;
}

/**
 * CardContent component for consistent card content
 */
export function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <View className={className}>{children}</View>;
}

/**
 * CardFooter component for consistent card footers
 */
export function CardFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View className={`mt-4 flex-row items-center justify-end gap-2 ${className}`}>
      {children}
    </View>
  );
}
