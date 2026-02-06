/**
 * List Components using FlashList
 *
 * CRITICAL: Never use ScrollView with .map() for lists.
 * Always use FlashList for optimal performance.
 *
 * FlashList provides:
 * - Virtualization (only renders visible items)
 * - Recycling (reuses item views)
 * - Optimized memory usage
 * - 60 FPS scrolling
 */

import React, { useCallback, useMemo } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import {
  FlashList,
  type FlashListProps,
  type ListRenderItem,
} from "@shopify/flash-list";
import { Text } from "./Text";
import { Spinner } from "./Spinner";
import { cn } from "@/lib/utils";

/**
 * Optimized List component using FlashList
 *
 * REQUIRED: Use this instead of ScrollView + map for all lists.
 */
export interface OptimizedListProps<T> extends Omit<FlashListProps<T>, "renderItem"> {
  /**
   * Data array to render
   */
  data: T[];

  /**
   * Render function for each item
   * IMPORTANT: This should be memoized or stable
   */
  renderItem: ListRenderItem<T>;

  /**
   * Key extractor function
   */
  keyExtractor?: (item: T, index: number) => string;

  /**
   * Show loading indicator at bottom
   */
  isLoadingMore?: boolean;

  /**
   * Callback when end of list is reached
   */
  onEndReached?: () => void;

  /**
   * Threshold for onEndReached (0-1)
   * @default 0.5
   */
  onEndReachedThreshold?: number;

  /**
   * Empty state component
   */
  emptyComponent?: React.ReactNode;

  /**
   * Header component
   */
  headerComponent?: React.ReactNode;

  /**
   * Footer component
   */
  footerComponent?: React.ReactNode;

  /**
   * Item separator component
   */
  separatorComponent?: React.ReactNode;

  /**
   * Additional container className
   */
  className?: string;

  /**
   * Content container style
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
}

/**
 * Optimized List using FlashList
 *
 * @example
 * ```tsx
 * const renderItem = useCallback(({ item }) => (
 *   <ItemComponent item={item} />
 * ), []);
 *
 * <OptimizedList
 *   data={items}
 *   renderItem={renderItem}
 *   keyExtractor={(item) => item.id}
 * />
 * ```
 */
export function OptimizedList<T>({
  data,
  renderItem,
  keyExtractor,
  isLoadingMore = false,
  onEndReached,
  onEndReachedThreshold = 0.5,
  emptyComponent,
  headerComponent,
  footerComponent,
  separatorComponent,
  className,
  contentContainerStyle,
  ...props
}: OptimizedListProps<T>) {
  // Memoize list footer with loading indicator
  const ListFooter = useMemo(() => {
    if (isLoadingMore) {
      return (
        <View className="py-4 items-center">
          <Spinner size="md" />
        </View>
      );
    }
    return footerComponent ? <>{footerComponent}</> : null;
  }, [isLoadingMore, footerComponent]);

  // Memoize empty component
  const ListEmpty = useMemo(() => {
    if (emptyComponent) return <>{emptyComponent}</>;
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Text variant="body" color="muted">
          No items to display
        </Text>
      </View>
    );
  }, [emptyComponent]);

  return (
    <View className={cn("flex-1", className)}>
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        ListHeaderComponent={headerComponent ? () => <>{headerComponent}</> : undefined}
        ListFooterComponent={() => ListFooter}
        ListEmptyComponent={() => ListEmpty}
        ItemSeparatorComponent={
          separatorComponent ? () => <>{separatorComponent}</> : undefined
        }
        contentContainerStyle={contentContainerStyle}
        // Performance optimizations
        removeClippedSubviews={true}
        {...props}
      />
    </View>
  );
}

/**
 * Default item separator
 */
export function ListSeparator() {
  return <View className="h-px bg-border mx-4" />;
}

/**
 * Inset item separator (with left margin for icon-based lists)
 */
export function ListSeparatorInset() {
  return <View className="h-px bg-border ml-16" />;
}

/**
 * Section header for grouped lists
 */
export interface ListSectionHeaderProps {
  title: string;
  className?: string;
}

export function ListSectionHeader({ title, className }: ListSectionHeaderProps) {
  return (
    <View className={cn("px-4 py-2 bg-background", className)}>
      <Text variant="overline" color="secondary" className="uppercase">
        {title}
      </Text>
    </View>
  );
}

/**
 * Memoized list item wrapper
 *
 * REQUIRED: Wrap all list items with React.memo for optimal performance.
 *
 * @example
 * ```tsx
 * const MyListItem = memo(({ item }: { item: ItemType }) => {
 *   return <View>...</View>;
 * }, (prev, next) => prev.item.id === next.item.id);
 * ```
 */
export function createMemoizedItem<T>(
  Component: React.ComponentType<{ item: T; index: number }>,
  areEqual?: (prevProps: { item: T; index: number }, nextProps: { item: T; index: number }) => boolean
) {
  return React.memo(Component, areEqual);
}

/**
 * Hook for optimized list data
 *
 * Provides memoized data transformations for lists.
 *
 * @example
 * ```tsx
 * const { filteredData, sortedData } = useListData(
 *   items,
 *   (item) => item.status === 'active',
 *   (a, b) => a.name.localeCompare(b.name)
 * );
 * ```
 */
export function useListData<T>(
  data: T[],
  filterFn?: (item: T) => boolean,
  sortFn?: (a: T, b: T) => number
) {
  const filteredData = useMemo(() => {
    if (!filterFn) return data;
    return data.filter(filterFn);
  }, [data, filterFn]);

  const sortedData = useMemo(() => {
    if (!sortFn) return filteredData;
    return [...filteredData].sort(sortFn);
  }, [filteredData, sortFn]);

  return {
    originalData: data,
    filteredData,
    sortedData,
    count: sortedData.length,
    isEmpty: sortedData.length === 0,
  };
}

/**
 * Hook for infinite scroll pagination
 *
 * @example
 * ```tsx
 * const { items, isLoading, loadMore, hasMore } = useInfiniteList(
 *   fetchItems,
 *   { pageSize: 20 }
 * );
 * ```
 */
export function useInfiniteList<T>(
  fetchFn: (page: number, pageSize: number) => Promise<T[]>,
  options: { pageSize?: number; initialPage?: number } = {}
) {
  const { pageSize = 20, initialPage = 0 } = options;
  const [items, setItems] = React.useState<T[]>([]);
  const [page, setPage] = React.useState(initialPage);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newItems = await fetchFn(page, pageSize);
      if (newItems.length < pageSize) {
        setHasMore(false);
      }
      setItems((prev) => [...prev, ...newItems]);
      setPage((p) => p + 1);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, page, pageSize, isLoading, hasMore]);

  const refresh = useCallback(async () => {
    setPage(initialPage);
    setHasMore(true);
    setIsLoading(true);
    try {
      const newItems = await fetchFn(initialPage, pageSize);
      if (newItems.length < pageSize) {
        setHasMore(false);
      }
      setItems(newItems);
      setPage(initialPage + 1);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, initialPage, pageSize]);

  return {
    items,
    isLoading,
    hasMore,
    loadMore,
    refresh,
  };
}
