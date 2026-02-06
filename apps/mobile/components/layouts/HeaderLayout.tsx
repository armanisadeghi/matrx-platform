/**
 * HeaderLayout - Screen with configurable header
 *
 * Provides:
 * - Configurable header with back button, title, actions
 * - Scrollable or fixed content area
 * - Glass effect on iOS header
 * - Proper safe area handling
 */

import { View, ScrollView, StyleSheet, KeyboardAvoidingView } from "react-native";
import { isIOS } from "@/lib/platform";
import { ScreenLayout } from "./ScreenLayout";
import { Header } from "./Header";
import type { HeaderLayoutProps } from "./types";

/**
 * HeaderLayout component
 *
 * A screen layout with a customizable header and content area.
 *
 * @example
 * ```tsx
 * <HeaderLayout
 *   header={{
 *     title: "Settings",
 *     showBackButton: true,
 *     rightContent: <IconButton icon="cog" onPress={handleSettings} />
 *   }}
 * >
 *   <SettingsContent />
 * </HeaderLayout>
 * ```
 */
export function HeaderLayout({
  children,
  header,
  scrollable = true,
  bounces = true,
  keyboardDismissMode = "on-drag",
  safeAreaEdges = ["bottom"],
  background = "background",
  className,
  style,
  testID,
  ...props
}: HeaderLayoutProps) {
  const content = scrollable ? (
    <ScrollView
      className="flex-1"
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={bounces}
      keyboardDismissMode={keyboardDismissMode}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View className="flex-1">{children}</View>
  );

  return (
    <ScreenLayout
      safeAreaEdges={header?.transparent ? ["top", ...safeAreaEdges] : safeAreaEdges}
      background={background}
      className={className}
      style={style}
      testID={testID}
      {...props}
    >
      {header && <Header {...header} />}
      <KeyboardAvoidingView
        behavior={isIOS ? "padding" : "height"}
        className="flex-1"
      >
        {content}
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
});
