module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    ],
    // Note: babel-preset-expo automatically manages the reanimated/worklets
    // Babel plugin. Do NOT manually add react-native-reanimated/plugin or
    // react-native-worklets/plugin here — it will cause duplicate plugin
    // conflicts. See: https://github.com/expo/fyi/blob/main/expo-54-reanimated.md
  };
};
