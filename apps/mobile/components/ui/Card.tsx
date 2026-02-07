/**
 * Card component
 *
 * Container component with elevated, outlined, and glass variants.
 */

import { View, Pressable, type ViewProps } from "react-native";
import Animated from "react-native-reanimated";
import { GlassContainer } from "@/components/glass";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { useAnimatedPress } from "@/hooks/useAnimatedPress";
import { isIOS } from "@/lib/platform";

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
 * Corner radius — larger on iOS 26 for Liquid Glass aesthetic
 */
const cardRadius = isIOS ? "rounded-3xl" : "rounded-2xl";

/**
 * Resolve variant: on iOS, auto-promote elevated/outlined to glass
 * for the frosted glass aesthetic
 */
function resolveVariant(variant: CardVariant): CardVariant {
  if (isIOS && (variant === "elevated" || variant === "outlined")) {
    return "glass";
  }
  return variant;
}

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
  className,
  children,
  style,
  ...props
}: CardProps) {
  const { shadows } = useTheme();
  const isPressable = pressable && !!onPress;
  const { animatedStyle, handlers } = useAnimatedPress({
    scaleTo: 0.98,
    disabled: !isPressable,
  });

  const resolvedVariant = resolveVariant(variant);
  const paddingClass = paddingStyles[padding];

  // Glass variant uses GlassContainer
  if (resolvedVariant === "glass") {
    const content = (
      <GlassContainer
        intensity="light"
        tint="surface"
        borderRadius="xl"
        className={cn(paddingClass, className)}
        style={style}
        {...props}
      >
        {children}
      </GlassContainer>
    );

    if (isPressable) {
      return (
        <Animated.View style={animatedStyle}>
          <Pressable onPress={onPress} {...handlers}>
            {content}
          </Pressable>
        </Animated.View>
      );
    }

    return content;
  }

  // Regular variants
  const shadowStyle = resolvedVariant === "elevated" ? shadows.md : undefined;

  const content = (
    <View
      className={cn(
        cardRadius,
        "overflow-hidden",
        paddingClass,
        variantStyles[resolvedVariant],
        className
      )}
      style={[shadowStyle, style]}
      {...props}
    >
      {children}
    </View>
  );

  if (isPressable) {
    return (
      <Animated.View style={animatedStyle}>
        <Pressable onPress={onPress} {...handlers}>
          {content}
        </Pressable>
      </Animated.View>
    );
  }

  return content;
}

/**
 * CardHeader component for consistent card headers
 */
export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <View className={cn("mb-3", className)}>{children}</View>;
}

/**
 * CardContent component for consistent card content
 */
export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <View className={cn(className)}>{children}</View>;
}

/**
 * CardFooter component for consistent card footers
 */
export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View className={cn("mt-4 flex-row items-center justify-end gap-2", className)}>
      {children}
    </View>
  );
}
