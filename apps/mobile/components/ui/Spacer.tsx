/**
 * Spacer component
 *
 * Flexible spacing utility for layouts. Creates empty space
 * that can flex to fill available space or be a fixed size.
 */

import { View } from "react-native";

export interface SpacerProps {
  /**
   * Fixed size in pixels (overrides flex behavior)
   */
  size?: number;

  /**
   * Flex value for flexible spacing
   * @default 1
   */
  flex?: number;

  /**
   * Direction of the spacer
   * @default 'vertical'
   */
  direction?: "horizontal" | "vertical";
}

/**
 * Spacer component
 *
 * @example
 * ```tsx
 * // Flexible spacer (fills available space)
 * <View className="flex-row">
 *   <Text>Left</Text>
 *   <Spacer />
 *   <Text>Right</Text>
 * </View>
 *
 * // Fixed size spacer
 * <Spacer size={16} />
 *
 * // Horizontal spacer between items
 * <View className="flex-row">
 *   <Button>One</Button>
 *   <Spacer size={8} direction="horizontal" />
 *   <Button>Two</Button>
 * </View>
 * ```
 */
export function Spacer({
  size,
  flex = 1,
  direction = "vertical",
}: SpacerProps) {
  if (size !== undefined) {
    return (
      <View
        style={
          direction === "horizontal"
            ? { width: size }
            : { height: size }
        }
      />
    );
  }

  return <View style={{ flex }} />;
}
