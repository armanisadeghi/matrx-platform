/**
 * Toggle components
 *
 * Switch, Checkbox, and Radio button components.
 */

import { Pressable, View, Switch as RNSwitch } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";

/**
 * Base toggle props
 */
interface BaseToggleProps {
  /**
   * Whether the toggle is checked/on
   */
  value: boolean;

  /**
   * Handler for value change
   */
  onValueChange: (value: boolean) => void;

  /**
   * Label text
   */
  label?: string;

  /**
   * Description text
   */
  description?: string;

  /**
   * Whether the toggle is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * Switch component
 */
export type SwitchProps = BaseToggleProps;

export function Switch({
  value,
  onValueChange,
  label,
  description,
  disabled = false,
  className,
}: SwitchProps) {
  const { colors } = useTheme();
  const haptics = useHaptics();

  const handlePress = () => {
    if (!disabled) {
      haptics.selection();
      onValueChange(!value);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className={cn(
        "flex-row items-center justify-between py-2",
        disabled && "opacity-50",
        className
      )}
    >
      {(label || description) && (
        <View className="flex-1 mr-3">
          {label && <Text variant="body">{label}</Text>}
          {description && (
            <Text variant="caption" color="secondary" className="mt-0.5">
              {description}
            </Text>
          )}
        </View>
      )}
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: colors.border.DEFAULT,
          true: colors.primary.DEFAULT,
        }}
        thumbColor={colors.foreground.inverse}
        ios_backgroundColor={colors.border.DEFAULT}
      />
    </Pressable>
  );
}

/**
 * Checkbox component
 */
export interface CheckboxProps extends BaseToggleProps {
  /**
   * Size of the checkbox
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
}

const checkboxSizes = {
  sm: { box: 18, icon: 14 },
  md: { box: 22, icon: 16 },
  lg: { box: 26, icon: 20 },
};

export function Checkbox({
  value,
  onValueChange,
  label,
  description,
  disabled = false,
  size = "md",
  className,
}: CheckboxProps) {
  const { colors } = useTheme();
  const haptics = useHaptics();
  const sizeConfig = checkboxSizes[size];

  const handlePress = () => {
    if (!disabled) {
      haptics.selection();
      onValueChange(!value);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className={cn(
        "flex-row items-center py-2",
        disabled && "opacity-50",
        className
      )}
    >
      <View
        className={cn(
          "items-center justify-center rounded-md",
          value ? "bg-primary" : "bg-transparent border-2 border-border"
        )}
        style={{ width: sizeConfig.box, height: sizeConfig.box }}
      >
        {value && (
          <Animated.View entering={ZoomIn.duration(200)} exiting={ZoomOut.duration(150)}>
            <Ionicons name="checkmark" size={sizeConfig.icon} color={colors.foreground.inverse} />
          </Animated.View>
        )}
      </View>
      {(label || description) && (
        <View className="flex-1 ml-3">
          {label && <Text variant="body">{label}</Text>}
          {description && (
            <Text variant="caption" color="secondary" className="mt-0.5">
              {description}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

/**
 * Radio component
 */
export interface RadioProps extends BaseToggleProps {
  /**
   * Size of the radio button
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
}

const radioSizes = {
  sm: { outer: 18, inner: 8 },
  md: { outer: 22, inner: 10 },
  lg: { outer: 26, inner: 12 },
};

export function Radio({
  value,
  onValueChange,
  label,
  description,
  disabled = false,
  size = "md",
  className,
}: RadioProps) {
  const haptics = useHaptics();
  const sizeConfig = radioSizes[size];

  const handlePress = () => {
    if (!disabled) {
      haptics.selection();
      onValueChange(!value);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className={cn(
        "flex-row items-center py-2",
        disabled && "opacity-50",
        className
      )}
    >
      <View
        className={cn(
          "items-center justify-center rounded-full border-2",
          value ? "border-primary" : "border-border"
        )}
        style={{ width: sizeConfig.outer, height: sizeConfig.outer }}
      >
        {value && (
          <Animated.View
            entering={ZoomIn.duration(200)}
            exiting={ZoomOut.duration(150)}
            className="rounded-full bg-primary"
            style={{ width: sizeConfig.inner, height: sizeConfig.inner }}
          />
        )}
      </View>
      {(label || description) && (
        <View className="flex-1 ml-3">
          {label && <Text variant="body">{label}</Text>}
          {description && (
            <Text variant="caption" color="secondary" className="mt-0.5">
              {description}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

/**
 * RadioGroup component for managing radio selections
 */
export interface RadioGroupProps<T extends string> {
  /**
   * Currently selected value
   */
  value: T;

  /**
   * Handler for value change
   */
  onValueChange: (value: T) => void;

  /**
   * Radio options
   */
  options: Array<{
    value: T;
    label: string;
    description?: string;
  }>;

  /**
   * Whether the group is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional className
   */
  className?: string;
}

export function RadioGroup<T extends string>({
  value,
  onValueChange,
  options,
  disabled = false,
  className,
}: RadioGroupProps<T>) {
  return (
    <View className={className}>
      {options.map((option) => (
        <Radio
          key={option.value}
          value={value === option.value}
          onValueChange={() => onValueChange(option.value)}
          label={option.label}
          description={option.description}
          disabled={disabled}
        />
      ))}
    </View>
  );
}
