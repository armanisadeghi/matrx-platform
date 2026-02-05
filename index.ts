/**
 * App Entry Point
 *
 * This file is the root entry point for the app.
 * LogBox configuration must be set up BEFORE expo-router/entry is imported.
 */

import { LogBox } from "react-native";

// Suppress warnings from React Native internals that we cannot fix:
// - SafeAreaView deprecation: React Native's own LogBox UI uses the deprecated
//   SafeAreaView internally. This is a known issue in RN that will be fixed
//   when they update their internal components. Our app code correctly uses
//   react-native-safe-area-context.
LogBox.ignoreLogs([
  "SafeAreaView has been deprecated",
]);

import "./global.css";
import "expo-router/entry";
