/**
 * 404 Not Found Page
 */

import { View } from "react-native";
import { Link, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, Button } from "@/components/ui";
import { ScreenLayout } from "@/components/layouts";
import { useTheme } from "@/hooks/useTheme";

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenLayout>
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-24 h-24 rounded-full bg-surface-elevated items-center justify-center mb-6">
            <Ionicons
              name="alert-circle"
              size={48}
              color={colors.foreground.muted}
            />
          </View>
          <Text variant="h2" className="text-center mb-2">
            Page Not Found
          </Text>
          <Text variant="body" color="secondary" className="text-center mb-8">
            The page you're looking for doesn't exist or has been moved.
          </Text>
          <Link href="/" asChild>
            <Button>Go to Home</Button>
          </Link>
        </View>
      </ScreenLayout>
    </>
  );
}
