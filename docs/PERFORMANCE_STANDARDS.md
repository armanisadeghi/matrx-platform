# Performance Standards

This document outlines the mandatory performance standards for this mobile application. These are requirements, not suggestions.

## Performance Targets

### Mobile (React Native/Expo)
- App opens to cached content: **< 500ms**
- Screen transitions: **< 16ms** (60 FPS)
- First data render: **< 1 second**
- Images appear with blurhash: **< 100ms**

## 1. Local-First Data Architecture (MANDATORY)

### Use MMKV Instead of AsyncStorage

MMKV is up to 30x faster than AsyncStorage. Always use MMKV for all storage needs.

```typescript
import { AppStorage, CacheTTL, getData, smartFetch } from "@/lib/storage";

// Simple key-value storage
AppStorage.setString("user_token", token);
const token = AppStorage.getString("user_token");

// JSON storage for objects
AppStorage.setJSON("user_profile", userProfile);
const profile = AppStorage.getJSON<UserProfile>("user_profile");
```

### Cache-First Data Fetching (REQUIRED)

Always serve cached data first, then refresh in background:

```typescript
import { getData, smartFetch, CacheTTL } from "@/lib/storage";

// Basic cache-first pattern
const userData = await getData(
  "user_profile",
  () => fetchUserProfile(userId),
  CacheTTL.MEDIUM // 5 minutes
);

// With request deduplication (RECOMMENDED)
const userData = await smartFetch(
  "user_profile",
  () => fetchUserProfile(userId),
  CacheTTL.MEDIUM
);
```

### TTL Guidelines
- `CacheTTL.SHORT` (1 min): Frequently changing data
- `CacheTTL.MEDIUM` (5 min): User data, preferences
- `CacheTTL.LONG` (30 min): Semi-static content
- `CacheTTL.VERY_LONG` (1 hr): Static content
- `CacheTTL.DAY` (24 hr): Rarely changing content

## 2. Image Optimization (CRITICAL)

### Use the Optimized Image Component

NEVER use React Native's Image directly. Always use our optimized component:

```typescript
import { Image } from "@/components/ui";

// Basic usage - auto-optimizes Supabase URLs
<Image
  source="https://your-supabase-url.com/image.jpg"
  width={200}
  height={150}
/>

// With blurhash placeholder (RECOMMENDED)
<Image
  source={imageUrl}
  width={200}
  height={150}
  blurhash={item.blurhash}
/>

// Avatar
<Image
  source={userAvatar}
  width={100}
  height={100}
  borderRadius="full"
  fallbackIcon="person"
/>
```

### Supabase Image Transformations

NEVER serve full-resolution images. Always use transformations:

```typescript
import { getOptimizedSupabaseUrl, ImageSize, ImageQuality } from "@/lib/performance";

// Auto-transformation via Image component (RECOMMENDED)
<Image source={imageUrl} width={400} />

// Manual transformation for custom needs
const optimizedUrl = getOptimizedSupabaseUrl(imageUrl, {
  width: 400,
  quality: 80,
  format: "webp",
});
```

### Image Preloading

Preload images for next screens:

```typescript
import { preloadImages, preloadImage } from "@/lib/performance";

// Preload multiple images
await preloadImages([image1, image2, image3]);

// Preload single image with specific width
await preloadImage(imageUrl, 400);
```

### Blurhash Requirements

- Generate and store blurhash for ALL uploaded images
- Always provide blurhash to Image component when available
- Default blurhash is used if none provided

## 3. List Performance (MANDATORY)

### Use FlashList, NEVER ScrollView with .map()

```typescript
import { OptimizedList, ListSeparator } from "@/components/ui";

// REQUIRED pattern for all lists
const renderItem = useCallback(({ item }) => (
  <ItemComponent item={item} />
), []);

<OptimizedList
  data={items}
  renderItem={renderItem}
  estimatedItemSize={80} // REQUIRED
  keyExtractor={(item) => item.id}
  separatorComponent={<ListSeparator />}
/>
```

### Memoize List Items (REQUIRED)

```typescript
import { memo } from "react";
import { createMemoizedItem } from "@/components/ui";

// Option 1: React.memo with custom comparison
const ItemComponent = memo(
  ({ item }) => <View>...</View>,
  (prev, next) => prev.item.id === next.item.id
);

// Option 2: Use helper function
const ItemComponent = createMemoizedItem(
  ({ item }) => <View>...</View>,
  (prev, next) => prev.item.id === next.item.id
);
```

### Infinite Scroll

```typescript
import { useInfiniteList, OptimizedList } from "@/components/ui";

const { items, isLoading, loadMore, hasMore, refresh } = useInfiniteList(
  fetchItems,
  { pageSize: 20 }
);

<OptimizedList
  data={items}
  renderItem={renderItem}
  estimatedItemSize={80}
  onEndReached={loadMore}
  isLoadingMore={isLoading}
/>
```

## 4. React Performance (MANDATORY)

### useMemo for Expensive Operations

```typescript
// REQUIRED for ALL filter/sort/map operations
const filteredData = useMemo(
  () => data.filter(item => item.status === "active"),
  [data]
);

const sortedData = useMemo(
  () => [...data].sort((a, b) => a.name.localeCompare(b.name)),
  [data]
);
```

### useCallback for Functions

```typescript
// REQUIRED for functions passed to child components
const handlePress = useCallback(() => {
  doSomething(itemId);
}, [itemId]);
```

### useListData Hook

```typescript
import { useListData } from "@/components/ui";

const { filteredData, sortedData, isEmpty } = useListData(
  items,
  (item) => item.status === "active",
  (a, b) => a.name.localeCompare(b.name)
);
```

## 5. Performance Monitoring (REQUIRED)

### Screen Load Time

```typescript
import { useScreenPerformance } from "@/lib/performance";

function MyScreen() {
  const { markReady, loadTime } = useScreenPerformance("HomeScreen");

  useEffect(() => {
    if (data) markReady();
  }, [data, markReady]);

  return <View>...</View>;
}
```

### Data Fetch Timing

```typescript
import { useFetchPerformance } from "@/lib/performance";

function MyComponent() {
  const { measureFetch } = useFetchPerformance();

  const loadData = async () => {
    const data = await measureFetch("user_profile", () =>
      fetchUserProfile()
    );
  };
}
```

### Frame Rate Monitoring (Animations)

```typescript
import { useFrameRateMonitor } from "@/lib/performance";

function AnimatedComponent() {
  const { fps, start, stop } = useFrameRateMonitor();

  useEffect(() => {
    start();
    return () => stop();
  }, []);

  // Warning logged if FPS drops below 55
}
```

## 6. Database Query Optimization

### NEVER use select('*')

```typescript
// ❌ FORBIDDEN
const { data } = await supabase.from("table").select("*");

// ✅ REQUIRED - specify exact fields
const { data } = await supabase
  .from("table")
  .select("id, name, created_at, related_table(specific_fields)")
  .limit(20);
```

### Always Use .limit()

Default to 20 items, paginate for more.

## 7. Network Optimization

### Request Deduplication

```typescript
import { dedupedRequest, smartFetch } from "@/lib/storage";

// Prevents duplicate concurrent requests
const data = await dedupedRequest("user_profile", () =>
  fetchUserProfile()
);

// Or use smartFetch which combines caching + deduplication
const data = await smartFetch("user_profile", fetchUserProfile);
```

### Preload Data

```typescript
import { preloadCache } from "@/lib/storage";

// Preload next screen's data
preloadCache("next_screen_data", () => fetchNextScreenData());
```

## Implementation Checklist

### Week 1 (Critical Path)
- [ ] Replace ALL AsyncStorage usage with MMKV
- [ ] Replace ALL select('*') queries with specific fields
- [ ] Add Supabase image transformations to ALL image URLs
- [ ] Implement cache-first data pattern in 3 most-used screens

### Week 2 (High Priority)
- [ ] Replace Image with optimized Image component everywhere
- [ ] Add database indexes for ALL frequently queried columns
- [ ] Replace ScrollView + map with OptimizedList (FlashList)
- [ ] Add React.memo to ALL list item components

### Week 3 (Required Optimizations)
- [ ] Generate and store blurhash for ALL images
- [ ] Implement request deduplication
- [ ] Add performance monitoring to ALL screens

### Week 4 (Polish & Verification)
- [ ] Verify ALL apps meet performance targets
- [ ] Document performance metrics

## Quick Reference

```typescript
// Storage
import { AppStorage, getData, smartFetch, CacheTTL } from "@/lib/storage";

// Performance
import {
  getOptimizedSupabaseUrl,
  preloadImages,
  useScreenPerformance,
  useFetchPerformance,
} from "@/lib/performance";

// Components
import {
  Image,
  OptimizedList,
  ListSeparator,
  useListData,
  useInfiniteList,
} from "@/components/ui";
```

## Enforcement

- Code reviews will block PRs that violate these standards
- Performance regressions will be rejected
- Weekly performance reports required for all projects

**These are not suggestions. These are requirements.**
