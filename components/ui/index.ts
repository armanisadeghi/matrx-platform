/**
 * UI Components barrel export
 *
 * All components use centralized theming from global.css/colors.ts.
 * Components include spring animations (Reanimated 4) and haptic feedback.
 */

// =============================================================================
// CORE COMPONENTS
// =============================================================================

export { Text, type TextProps, type TextVariant, type TextColor } from "./Text";
export {
  Button,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from "./Button";
export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  type CardProps,
  type CardVariant,
} from "./Card";

// =============================================================================
// FORM INPUTS
// =============================================================================

export {
  Input,
  TextArea,
  type InputProps,
  type InputVariant,
} from "./Input";
export {
  Switch,
  Checkbox,
  Radio,
  RadioGroup,
  type SwitchProps,
  type CheckboxProps,
  type RadioProps,
  type RadioGroupProps,
} from "./Toggle";
export { SearchBar, type SearchBarProps } from "./SearchBar";
export { Select, type SelectProps, type SelectOption } from "./Select";

// =============================================================================
// DISPLAY COMPONENTS
// =============================================================================

export {
  Avatar,
  AvatarGroup,
  type AvatarProps,
  type AvatarGroupProps,
  type AvatarSize,
} from "./Avatar";
export {
  Badge,
  BadgeGroup,
  type BadgeProps,
  type BadgeGroupProps,
  type BadgeVariant,
  type BadgeSize,
} from "./Badge";
export { Divider, type DividerProps } from "./Divider";
export { Image, type ImageProps } from "./Image";
export { Icon, type IconProps, type IconName, type IconSize, type IconColor } from "./Icon";

// =============================================================================
// LOADING & PROGRESS
// =============================================================================

export {
  Skeleton,
  SkeletonGroup,
  type SkeletonProps,
  type SkeletonGroupProps,
} from "./Skeleton";
export {
  Spinner,
  LoadingOverlay,
  type SpinnerProps,
  type SpinnerSize,
  type LoadingOverlayProps,
} from "./Spinner";
export { ProgressBar, type ProgressBarProps } from "./ProgressBar";

// =============================================================================
// FEEDBACK & OVERLAYS
// =============================================================================

export {
  ToastProvider,
  useToast,
  type ToastConfig,
  type ToastVariant,
  type ToastPosition,
} from "./Toast";
export {
  Alert,
  type AlertProps,
  type AlertAction,
  type AlertVariant,
} from "./Alert";

// =============================================================================
// INTERACTIVE COMPONENTS
// =============================================================================

export {
  IconButton,
  type IconButtonProps,
  type IconButtonVariant,
  type IconButtonSize,
} from "./IconButton";
export {
  ListItem,
  ListSection,
  type ListItemProps,
  type ListSectionProps,
} from "./ListItem";
export { Pressable, type PressableProps } from "./Pressable";

// =============================================================================
// EMPTY STATES
// =============================================================================

export {
  EmptyState,
  NoSearchResults,
  NoData,
  NoConnection,
  NoNotifications,
  type EmptyStateProps,
} from "./EmptyState";

// =============================================================================
// LAYOUT UTILITIES
// =============================================================================

export { Spacer, type SpacerProps } from "./Spacer";
export { KeyboardAwareView, type KeyboardAwareViewProps } from "./KeyboardAwareView";
export { ScrollContainer, type ScrollContainerProps } from "./ScrollContainer";

// =============================================================================
// ERROR HANDLING
// =============================================================================

export { ErrorBoundary, type ErrorBoundaryProps } from "./ErrorBoundary";
