import expo from "eslint-config-expo";

export default [
  ...expo,
  {
    ignores: [
      "node_modules/",
      ".expo/",
      "dist/",
      "android/",
      "ios/",
      "web-build/",
    ],
  },
  {
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
    },
  },
];
