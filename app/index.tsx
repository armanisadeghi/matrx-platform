import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to the main tabs by default
  // Change to "/(demo)" to access the component showcase
  return <Redirect href="/(tabs)" />;
}
