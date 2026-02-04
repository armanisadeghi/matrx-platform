import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to the demo route by default
  // This can be changed to redirect to (tabs) when building the actual app
  return <Redirect href="/(demo)" />;
}
