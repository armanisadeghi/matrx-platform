/**
 * ScrollContainer component
 *
 * Themed ScrollView with common configurations and refresh support.
 */

import {
  ScrollView,
  RefreshControl,
  type ScrollViewProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export interface ScrollContainerProps extends ScrollViewProps {
  /**
   * Children to render
   */
  children: React.ReactNode;

  /**
   * Whether pull-to-refresh is enabled
   * @default false
   */
  refreshable?: boolean;

  /**
   * Whether currently refreshing
   */
  refreshing?: boolean;

  /**
   * Callback when refresh is triggered
   */
  onRefresh?: () => void;

  /**
   * Safe area edges to respect
   * @default []
   */
  safeAreaEdges?: Array<"top" | "bottom" | "left" | "right">;

  /**
   * Minimum content height (useful for centering)
   */
  minHeight?: "full" | "auto";

  /**
   * Additional className
   */
  className?: string;

  /**
   * Content container className
   */
  contentClassName?: string;
}

/**
 * ScrollContainer component
 *
 * @example
 * ```tsx
 * // Basic scrollable content
 * <ScrollContainer>
 *   <Text>Scrollable content</Text>
 * </ScrollContainer>
 *
 * // With pull-to-refresh
 * <ScrollContainer
 *   refreshable
 *   refreshing={isLoading}
 *   onRefresh={handleRefresh}
 * >
 *   <FeedList />
 * </ScrollContainer>
 *
 * // With safe area padding
 * <ScrollContainer safeAreaEdges={['bottom']}>
 *   <SettingsList />
 * </ScrollContainer>
 * ```
 */
export function ScrollContainer({
  children,
  refreshable = false,
  refreshing = false,
  onRefresh,
  safeAreaEdges = [],
  minHeight = "auto",
  className,
  contentClassName,
  contentContainerStyle,
  ...props
}: ScrollContainerProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  // Calculate safe area padding
  const safeAreaPadding = {
    paddingTop: safeAreaEdges.includes("top") ? insets.top : 0,
    paddingBottom: safeAreaEdges.includes("bottom") ? Math.max(insets.bottom, 16) : 0,
    paddingLeft: safeAreaEdges.includes("left") ? insets.left : 0,
    paddingRight: safeAreaEdges.includes("right") ? insets.right : 0,
  };

  return (
    <ScrollView
      className={cn("flex-1 bg-background", className)}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        safeAreaPadding,
        minHeight === "full" && { flexGrow: 1 },
        contentContainerStyle,
      ]}
      contentContainerClassName={contentClassName}
      refreshControl={
        refreshable ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.DEFAULT}
            colors={[colors.primary.DEFAULT]}
          />
        ) : undefined
      }
      {...props}
    >
      {children}
    </ScrollView>
  );
}
