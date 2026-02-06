/**
 * useHaptics - Native (iOS + Android) implementation
 *
 * Provides haptic feedback using expo-haptics.
 * iOS: Full haptic engine support (Taptic Engine)
 * Android: Vibration-based approximation
 */

import { useCallback } from "react";
import * as Haptics from "expo-haptics";

export function useHaptics() {
  const light = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const medium = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const heavy = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, []);

  const selection = useCallback(() => {
    Haptics.selectionAsync();
  }, []);

  const success = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const warning = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, []);

  const error = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, []);

  return { light, medium, heavy, selection, success, warning, error };
}
