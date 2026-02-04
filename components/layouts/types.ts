import type { ReactNode } from "react";
import type { ViewProps, StyleProp, ViewStyle } from "react-native";

/**
 * Safe area edges that can be applied
 */
export type SafeAreaEdge = "top" | "bottom" | "left" | "right";

/**
 * Base layout props shared by all layouts
 */
export interface BaseLayoutProps extends ViewProps {
  /**
   * Content to render inside the layout
   */
  children?: ReactNode;

  /**
   * Which safe area edges to apply
   * @default ['top', 'bottom']
   */
  safeAreaEdges?: SafeAreaEdge[];

  /**
   * Background color variant
   * @default 'background'
   */
  background?: "background" | "secondary" | "tertiary" | "transparent";

  /**
   * Additional className for NativeWind styling
   */
  className?: string;

  /**
   * Additional styles
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Header configuration
 */
export interface HeaderConfig {
  /**
   * Title displayed in the header
   */
  title?: string;

  /**
   * Subtitle displayed below the title
   */
  subtitle?: string;

  /**
   * Whether to show a back button
   * @default false
   */
  showBackButton?: boolean;

  /**
   * Custom back button handler
   * If not provided, uses router.back()
   */
  onBackPress?: () => void;

  /**
   * Content to render on the left side of the header
   */
  leftContent?: ReactNode;

  /**
   * Content to render on the right side of the header
   */
  rightContent?: ReactNode;

  /**
   * Whether to use glass effect on iOS header
   * @default true
   */
  useGlassEffect?: boolean;

  /**
   * Whether header is transparent (content scrolls behind)
   * @default false
   */
  transparent?: boolean;

  /**
   * Header height variant
   * @default 'default'
   */
  size?: "compact" | "default" | "large";
}

/**
 * Screen layout props
 */
export interface ScreenLayoutProps extends BaseLayoutProps {
  /**
   * Whether to use edge-to-edge layout
   * @default true
   */
  edgeToEdge?: boolean;
}

/**
 * Header layout props
 */
export interface HeaderLayoutProps extends BaseLayoutProps {
  /**
   * Header configuration
   */
  header?: HeaderConfig;

  /**
   * Whether content should scroll
   * @default true
   */
  scrollable?: boolean;

  /**
   * Whether to bounce when scrolling
   * @default true
   */
  bounces?: boolean;

  /**
   * Keyboard dismiss mode for scrollable content
   * @default 'on-drag'
   */
  keyboardDismissMode?: "none" | "on-drag" | "interactive";
}

/**
 * Modal layout props
 */
export interface ModalLayoutProps extends BaseLayoutProps {
  /**
   * Modal presentation style
   * @default 'sheet'
   */
  presentation?: "sheet" | "dialog" | "fullscreen";

  /**
   * Header configuration for the modal
   */
  header?: HeaderConfig;

  /**
   * Whether the modal can be dismissed by tapping outside or swiping
   * @default true
   */
  dismissible?: boolean;

  /**
   * Callback when modal is dismissed
   */
  onDismiss?: () => void;

  /**
   * Maximum height for sheet presentation (percentage)
   * @default 90
   */
  maxHeight?: number;
}

/**
 * Header height values
 */
export const headerHeights = {
  compact: 44,
  default: 56,
  large: 96,
} as const;
