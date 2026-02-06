import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import designSystemPlugin from "./eslint-plugins/no-hardcoded-colors.mjs";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // TypeScript strict rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      // React rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  // Design system enforcement: no hardcoded colors in components and app files
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "hooks/**/*.{ts,tsx}"],
    plugins: {
      "design-system": designSystemPlugin,
    },
    rules: {
      "design-system/no-hardcoded-colors": "error",
    },
  },
  {
    ignores: [
      "node_modules/",
      ".expo/",
      "dist/",
      "android/",
      "ios/",
      "web-build/",
      "*.config.js",
      "*.config.mjs",
      "babel.config.js",
      "metro.config.js",
      "eslint-plugins/",
      "scripts/",
    ],
  },
];
