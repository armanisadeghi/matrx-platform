/**
 * Toggles Demo Page
 *
 * Showcases switch, checkbox, and radio components.
 */

import { useState } from "react";
import { View } from "react-native";
import {
  Text,
  Card,
  Switch,
  Checkbox,
  Radio,
  RadioGroup,
  Divider,
} from "@/components/ui";
import { HeaderLayout } from "@/components/layouts";

export default function TogglesDemo() {
  const [switchValue, setSwitchValue] = useState(false);
  const [switchWithLabel, setSwitchWithLabel] = useState(true);
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(true);
  const [checkbox3, setCheckbox3] = useState(false);
  const [radio, setRadio] = useState(false);
  const [radioGroup, setRadioGroup] = useState<"option1" | "option2" | "option3">(
    "option1"
  );

  return (
    <HeaderLayout
      header={{
        title: "Toggles",
        showBackButton: true,
      }}
    >
      <View className="px-4 py-4">
        <Text variant="body" color="secondary" className="mb-6">
          Toggle components for boolean and selection inputs.
        </Text>

        {/* Switch */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Switch
          </Text>
          <Switch
            value={switchValue}
            onValueChange={setSwitchValue}
            label="Basic Switch"
          />
          <Switch
            value={switchWithLabel}
            onValueChange={setSwitchWithLabel}
            label="Notifications"
            description="Receive push notifications for updates"
          />
          <Switch
            value={false}
            onValueChange={() => {}}
            label="Disabled Switch"
            disabled
          />
        </Card>

        {/* Checkbox */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Checkbox
          </Text>
          <Checkbox
            value={checkbox1}
            onValueChange={setCheckbox1}
            label="Accept terms and conditions"
          />
          <Checkbox
            value={checkbox2}
            onValueChange={setCheckbox2}
            label="Subscribe to newsletter"
            description="Get weekly updates about new features"
          />
          <Checkbox
            value={checkbox3}
            onValueChange={setCheckbox3}
            label="Disabled checkbox"
            disabled
          />
        </Card>

        {/* Checkbox Sizes */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Checkbox Sizes
          </Text>
          <View className="flex-row items-center gap-6">
            <Checkbox
              value={true}
              onValueChange={() => {}}
              size="sm"
              label="Small"
            />
            <Checkbox
              value={true}
              onValueChange={() => {}}
              size="md"
              label="Medium"
            />
            <Checkbox
              value={true}
              onValueChange={() => {}}
              size="lg"
              label="Large"
            />
          </View>
        </Card>

        {/* Radio */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Radio Button
          </Text>
          <Radio
            value={radio}
            onValueChange={setRadio}
            label="Single radio option"
            description="This is a standalone radio button"
          />
        </Card>

        {/* Radio Group */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Radio Group
          </Text>
          <RadioGroup
            value={radioGroup}
            onValueChange={setRadioGroup}
            options={[
              {
                value: "option1",
                label: "Option 1",
                description: "First option description",
              },
              {
                value: "option2",
                label: "Option 2",
                description: "Second option description",
              },
              {
                value: "option3",
                label: "Option 3",
                description: "Third option description",
              },
            ]}
          />
        </Card>

        {/* Radio Sizes */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Radio Sizes
          </Text>
          <View className="flex-row items-center gap-6">
            <Radio
              value={true}
              onValueChange={() => {}}
              size="sm"
              label="Small"
            />
            <Radio
              value={true}
              onValueChange={() => {}}
              size="md"
              label="Medium"
            />
            <Radio
              value={true}
              onValueChange={() => {}}
              size="lg"
              label="Large"
            />
          </View>
        </Card>

        <Divider spacing="lg" />

        <Text variant="caption" color="muted" className="text-center">
          All toggles use centralized theme colors
        </Text>
      </View>
    </HeaderLayout>
  );
}
