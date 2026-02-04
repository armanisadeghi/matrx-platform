/**
 * Colors Demo Page
 *
 * Showcases the color palette and semantic colors.
 */

import { View, ScrollView } from "react-native";
import { Text, Card, Divider } from "@/components/ui";
import { HeaderLayout } from "@/components/layouts";
import { colors } from "@/constants/colors";

interface ColorSwatchProps {
  name: string;
  value: string;
  textLight?: boolean;
}

function ColorSwatch({ name, value, textLight = false }: ColorSwatchProps) {
  return (
    <View className="flex-row items-center mb-2">
      <View
        className="w-12 h-12 rounded-lg mr-3 border border-border"
        style={{ backgroundColor: value }}
      />
      <View className="flex-1">
        <Text variant="label">{name}</Text>
        <Text variant="caption" color="muted">
          {value}
        </Text>
      </View>
    </View>
  );
}

interface ColorGroupProps {
  title: string;
  colors: Record<string, string>;
}

function ColorGroup({ title, colors: colorGroup }: ColorGroupProps) {
  return (
    <Card variant="outlined" className="mb-4">
      <Text variant="h5" className="mb-3">
        {title}
      </Text>
      {Object.entries(colorGroup).map(([name, value]) => (
        <ColorSwatch key={name} name={name} value={value} />
      ))}
    </Card>
  );
}

export default function ColorsDemo() {
  return (
    <HeaderLayout
      header={{
        title: "Colors",
        showBackButton: true,
      }}
    >
      <View className="px-4 py-4">
        <Text variant="body" color="secondary" className="mb-6">
          The color palette is centralized in the theme system. All components
          use these colors through NativeWind classes. Light and dark variants
          are automatically applied based on the system color scheme.
        </Text>

        {/* Primary Colors */}
        <ColorGroup
          title="Primary"
          colors={{
            "Primary Default": colors.light.primary.DEFAULT,
            "Primary Light": colors.light.primary.light,
            "Primary Dark": colors.light.primary.dark,
          }}
        />

        {/* Secondary Colors */}
        <ColorGroup
          title="Secondary"
          colors={{
            "Secondary Default": colors.light.secondary.DEFAULT,
            "Secondary Light": colors.light.secondary.light,
            "Secondary Dark": colors.light.secondary.dark,
          }}
        />

        {/* Background Colors */}
        <ColorGroup
          title="Background"
          colors={{
            "Background": colors.light.background.DEFAULT,
            "Background Secondary": colors.light.background.secondary,
            "Background Tertiary": colors.light.background.tertiary,
          }}
        />

        {/* Semantic Colors */}
        <ColorGroup
          title="Semantic"
          colors={{
            "Success": colors.light.success.DEFAULT,
            "Warning": colors.light.warning.DEFAULT,
            "Error": colors.light.error.DEFAULT,
            "Info": colors.light.info.DEFAULT,
          }}
        />

        {/* Text Colors */}
        <ColorGroup
          title="Text / Foreground"
          colors={{
            "Foreground": colors.light.foreground.DEFAULT,
            "Foreground Secondary": colors.light.foreground.secondary,
            "Foreground Muted": colors.light.foreground.muted,
          }}
        />

        <Divider spacing="lg" />

        <Text variant="caption" color="muted" className="text-center">
          Toggle dark mode on the index page to see dark variants
        </Text>
      </View>
    </HeaderLayout>
  );
}
