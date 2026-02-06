/**
 * Typography Demo Page
 *
 * Showcases text styles and variants.
 */

import { View } from "react-native";
import { Text, Card, Divider } from "@/components/ui";
import { HeaderLayout } from "@/components/layouts";

export default function TypographyDemo() {
  return (
    <HeaderLayout
      header={{
        title: "Typography",
        showBackButton: true,
      }}
    >
      <View className="px-4 py-4">
        <Text variant="body" color="secondary" className="mb-6">
          Typography variants provide consistent text styling throughout the
          app. Each variant has predefined font size, weight, and line height.
        </Text>

        {/* Headings */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-3">
            Headings
          </Text>
          <Text variant="h1" className="mb-2">
            Heading 1
          </Text>
          <Text variant="h2" className="mb-2">
            Heading 2
          </Text>
          <Text variant="h3" className="mb-2">
            Heading 3
          </Text>
          <Text variant="h4" className="mb-2">
            Heading 4
          </Text>
          <Text variant="h5" className="mb-2">
            Heading 5
          </Text>
          <Text variant="h6">Heading 6</Text>
        </Card>

        {/* Body Text */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-3">
            Body Text
          </Text>
          <Text variant="bodyLarge" className="mb-3">
            Body Large - Use for emphasized paragraphs and important content
            that needs to stand out.
          </Text>
          <Text variant="body" className="mb-3">
            Body - The default text style for most content. Use for paragraphs,
            descriptions, and general text.
          </Text>
          <Text variant="bodySmall">
            Body Small - Use for secondary content, disclaimers, and supporting
            text that doesn't need emphasis.
          </Text>
        </Card>

        {/* UI Text */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-3">
            UI Text
          </Text>
          <View className="mb-3">
            <Text variant="label">Label</Text>
            <Text variant="caption" color="muted">
              Use for form labels and field titles
            </Text>
          </View>
          <View className="mb-3">
            <Text variant="caption">Caption</Text>
            <Text variant="caption" color="muted">
              Use for hints, timestamps, and metadata
            </Text>
          </View>
          <View>
            <Text variant="overline">OVERLINE</Text>
            <Text variant="caption" color="muted">
              Use for section headers and categories
            </Text>
          </View>
        </Card>

        {/* Text Colors */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-3">
            Text Colors
          </Text>
          <Text color="default" className="mb-2">
            Default - Primary text color
          </Text>
          <Text color="secondary" className="mb-2">
            Secondary - Less prominent text
          </Text>
          <Text color="muted" className="mb-2">
            Muted - De-emphasized text
          </Text>
          <Text color="primary" className="mb-2">
            Primary - Brand color text
          </Text>
          <Text color="success" className="mb-2">
            Success - Positive feedback
          </Text>
          <Text color="warning" className="mb-2">
            Warning - Caution messages
          </Text>
          <Text color="error" className="mb-2">
            Error - Error messages
          </Text>
          <Text color="info">Info - Informational text</Text>
        </Card>

        <Divider spacing="lg" />

        <Text variant="caption" color="muted" className="text-center">
          All typography uses the centralized theme system
        </Text>
      </View>
    </HeaderLayout>
  );
}
