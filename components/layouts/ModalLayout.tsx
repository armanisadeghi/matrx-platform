/**
 * ModalLayout - Modal presentation layout
 *
 * Provides:
 * - Sheet, dialog, and fullscreen presentations
 * - Platform-appropriate styling
 * - Dismissible behavior
 * - Header support
 */

import { View, Pressable, StyleSheet, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { isIOS, platformConstants } from "@/lib/platform";
import { GlassContainer } from "@/components/glass";
import { Header } from "./Header";
import type { ModalLayoutProps } from "./types";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/**
 * ModalLayout component
 *
 * A layout for modal presentations with platform-appropriate styling.
 *
 * @example
 * ```tsx
 * <ModalLayout
 *   presentation="sheet"
 *   header={{ title: "Select Option" }}
 *   onDismiss={handleClose}
 * >
 *   <OptionsList />
 * </ModalLayout>
 * ```
 */
export function ModalLayout({
  children,
  presentation = "sheet",
  header,
  dismissible = true,
  onDismiss,
  maxHeight = 90,
  safeAreaEdges = ["bottom"],
  background: _background = "surface",
  className = "",
  style,
  testID,
  ...props
}: ModalLayoutProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const handleBackdropPress = () => {
    if (dismissible && onDismiss) {
      onDismiss();
    }
  };

  // Fullscreen modal
  if (presentation === "fullscreen") {
    return (
      <View
        className={`flex-1 bg-background ${className}`}
        style={style}
        testID={testID}
        {...props}
      >
        {header && <Header {...header} />}
        <View
          className="flex-1"
          style={{
            paddingBottom: safeAreaEdges.includes("bottom") ? insets.bottom : 0,
          }}
        >
          {children}
        </View>
      </View>
    );
  }

  // Dialog modal
  if (presentation === "dialog") {
    return (
      <View className="flex-1 justify-center items-center" testID={testID}>
        {/* Backdrop */}
        <Pressable
          className="absolute inset-0 bg-black/50"
          onPress={handleBackdropPress}
        />
        {/* Dialog content */}
        <View
          className={`bg-surface rounded-2xl overflow-hidden mx-6 max-w-md w-full ${className}`}
          style={[
            {
              maxHeight: SCREEN_HEIGHT * 0.8,
              shadowColor: colors.foreground.DEFAULT,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 16,
            },
            style,
          ]}
          {...props}
        >
          {header && <Header {...header} size="compact" useGlassEffect={false} />}
          <View className="px-6 py-4">{children}</View>
        </View>
      </View>
    );
  }

  // Sheet modal (default)
  const sheetHeight = SCREEN_HEIGHT * (maxHeight / 100);
  const borderRadius = platformConstants.modalRadius;

  const sheetContent = (
    <View
      className={`bg-surface ${className}`}
      style={[
        styles.sheet,
        {
          maxHeight: sheetHeight,
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
          paddingBottom: safeAreaEdges.includes("bottom") ? insets.bottom : 0,
        },
        style,
      ]}
      {...props}
    >
      {/* Handle indicator */}
      <View className="items-center pt-2 pb-1">
        <View className="w-10 h-1 rounded-full bg-border" />
      </View>
      {header && <Header {...header} size="compact" useGlassEffect={false} />}
      <View className="flex-1">{children}</View>
    </View>
  );

  return (
    <View className="flex-1 justify-end" testID={testID}>
      {/* Backdrop */}
      <Pressable
        className="absolute inset-0 bg-black/50"
        onPress={handleBackdropPress}
      />
      {/* Sheet content - use glass on iOS */}
      {isIOS ? (
        <GlassContainer
          intensity="medium"
          tint="surface"
          borderRadius="none"
          style={{
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
          }}
        >
          {sheetContent}
        </GlassContainer>
      ) : (
        sheetContent
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    overflow: "hidden",
  },
});
