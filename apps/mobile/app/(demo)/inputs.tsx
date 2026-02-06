/**
 * Inputs Demo Page
 *
 * Showcases input components and form fields.
 */

import { useState } from "react";
import { View } from "react-native";
import { Text, Card, Input, TextArea, Divider } from "@/components/ui";
import { HeaderLayout } from "@/components/layouts";

export default function InputsDemo() {
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [search, setSearch] = useState("");
  const [bio, setBio] = useState("");

  return (
    <HeaderLayout
      header={{
        title: "Inputs",
        showBackButton: true,
      }}
    >
      <View className="px-4 py-4">
        <Text variant="body" color="secondary" className="mb-6">
          Input components with different types, variants, and validation
          states.
        </Text>

        {/* Basic Inputs */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Basic Inputs
          </Text>
          <View className="gap-4">
            <Input
              label="Text Input"
              placeholder="Enter some text"
              value={text}
              onChangeText={setText}
            />
            <Input
              label="Email"
              placeholder="you@example.com"
              type="email"
              leftIcon="mail"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              label="Password"
              placeholder="Enter password"
              type="password"
              leftIcon="lock-closed"
              value={password}
              onChangeText={setPassword}
            />
            <Input
              label="Search"
              placeholder="Search..."
              type="search"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </Card>

        {/* Input Variants */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Variants
          </Text>
          <View className="gap-4">
            <Input
              variant="default"
              label="Default"
              placeholder="Default variant"
            />
            <Input
              variant="filled"
              label="Filled"
              placeholder="Filled variant"
            />
            <Input
              variant="outlined"
              label="Outlined"
              placeholder="Outlined variant"
            />
          </View>
        </Card>

        {/* Input States */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            States
          </Text>
          <View className="gap-4">
            <Input
              label="With Helper Text"
              placeholder="Enter value"
              helperText="This is helpful information"
            />
            <Input
              label="With Error"
              placeholder="Enter email"
              type="email"
              value="invalid-email"
              error="Please enter a valid email address"
            />
            <Input
              label="Disabled"
              placeholder="Cannot edit"
              disabled
              value="Disabled input"
            />
          </View>
        </Card>

        {/* TextArea */}
        <Card variant="outlined" className="mb-4">
          <Text variant="overline" color="secondary" className="mb-4">
            Text Area
          </Text>
          <TextArea
            label="Bio"
            placeholder="Tell us about yourself..."
            value={bio}
            onChangeText={setBio}
            numberOfLines={4}
            helperText="Maximum 500 characters"
          />
        </Card>

        <Divider spacing="lg" />

        <Text variant="caption" color="muted" className="text-center">
          All inputs use centralized theme styling
        </Text>
      </View>
    </HeaderLayout>
  );
}
