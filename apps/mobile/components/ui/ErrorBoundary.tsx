/**
 * ErrorBoundary component
 *
 * Catches JavaScript errors in child component tree and displays
 * a fallback UI instead of crashing the app.
 */

import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { Button } from "./Button";
import { useTheme } from "@/hooks/useTheme";

export interface ErrorBoundaryProps {
  /**
   * Children to render
   */
  children: React.ReactNode;

  /**
   * Custom fallback component
   */
  fallback?: React.ReactNode;

  /**
   * Callback when error is caught
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;

  /**
   * Whether to show retry button
   * @default true
   */
  showRetry?: boolean;

  /**
   * Custom retry handler
   */
  onRetry?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Default error fallback UI
 */
function DefaultErrorFallback({
  error,
  onRetry,
  showRetry,
}: {
  error: Error | null;
  onRetry?: () => void;
  showRetry: boolean;
}) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-center p-6 bg-background">
      <View className="items-center max-w-sm">
        <View className="w-16 h-16 rounded-full bg-error-light items-center justify-center mb-4">
          <Ionicons name="alert-circle" size={32} color={colors.error.DEFAULT} />
        </View>

        <Text variant="h3" className="text-center mb-2">
          Something went wrong
        </Text>

        <Text variant="body" color="secondary" className="text-center mb-6">
          {error?.message || "An unexpected error occurred. Please try again."}
        </Text>

        {showRetry && onRetry && (
          <Button variant="primary" onPress={onRetry}>
            Try Again
          </Button>
        )}
      </View>
    </View>
  );
}

/**
 * ErrorBoundary component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // With custom fallback
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // With error logging
 * <ErrorBoundary onError={(error) => logError(error)}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  override render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          onRetry={this.handleRetry}
          showRetry={this.props.showRetry ?? true}
        />
      );
    }

    return this.props.children;
  }
}
