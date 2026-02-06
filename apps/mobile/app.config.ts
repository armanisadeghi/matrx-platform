import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "mobile-native",
  slug: "mobile-native",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  scheme: "mobile-native",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.matrx.mobilenative",
    infoPlist: {
      UIUserInterfaceStyle: "Automatic",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    package: "com.matrx.mobilenative",
  },
  web: {
    favicon: "./assets/favicon.png",
    bundler: "metro",
  },
  plugins: [
    "expo-dev-client",
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#ffffff",
        image: "./assets/splash-icon.png",
        dark: {
          backgroundColor: "#0A0A0B",
          image: "./assets/splash-icon.png",
        },
        imageWidth: 200,
      },
    ],
    "expo-font",
    [
      "expo-liquid-glass-native",
      {
        android: {
          compileSdkVersion: 36,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
