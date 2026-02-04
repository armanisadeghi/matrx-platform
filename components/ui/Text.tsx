/**
 * Text component
 *
 * Styled text component with variant support.
 * Uses theme typography and colors.
 */

import { Text as RNText, type TextProps as RNTextProps } from "react-native";

/**
 * Text variant types
 */
export type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body"
  | "bodyLarge"
  | "bodySmall"
  | "label"
  | "caption"
  | "overline";

/**
 * Text color types
 */
export type TextColor =
  | "default"
  | "secondary"
  | "muted"
  | "inverse"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info";

export interface TextProps extends RNTextProps {
  /**
   * Text variant for typography styling
   * @default 'body'
   */
  variant?: TextVariant;

  /**
   * Text color
   * @default 'default'
   */
  color?: TextColor;

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
 * Map variants to NativeWind classes
 */
const variantClasses: Record<TextVariant, string> = {
  h1: "text-4xl font-bold tracking-tight",
  h2: "text-3xl font-bold tracking-tight",
  h3: "text-2xl font-semibold",
  h4: "text-xl font-semibold",
  h5: "text-lg font-medium",
  h6: "text-base font-medium",
  body: "text-base",
  bodyLarge: "text-lg",
  bodySmall: "text-sm",
  label: "text-sm font-medium",
  caption: "text-xs",
  overline: "text-xs font-semibold tracking-wider uppercase",
};

/**
 * Map colors to NativeWind classes
 */
const colorClasses: Record<TextColor, string> = {
  default: "text-foreground",
  secondary: "text-foreground-secondary",
  muted: "text-foreground-muted",
  inverse: "text-foreground-inverse",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
  info: "text-info",
};

/**
 * Text component
 *
 * @example
 * ```tsx
 * <Text variant="h1">Heading</Text>
 * <Text variant="body" color="secondary">Body text</Text>
 * <Text variant="caption" color="muted">Caption</Text>
 * ```
 */
export function Text({
  variant = "body",
  color = "default",
  className = "",
  children,
  ...props
}: TextProps) {
  const variantClass = variantClasses[variant];
  const colorClass = colorClasses[color];

  return (
    <RNText
      className={`${variantClass} ${colorClass} ${className}`}
      {...props}
    >
      {children}
    </RNText>
  );
}
