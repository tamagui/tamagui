module.exports = (api) => {
  api.cache(true);
  return {
    ignore: [
      // speeds up compile
      "**/@tamagui/**/dist/**",
    ],
    presets: [["babel-preset-expo", { jsxRuntime: "automatic" }]],
    plugins: [
      [
        "@tamagui/babel-plugin",
        {
          components: ["tamagui", "@tamagui/sandbox-ui"],
          config: "./src/tamagui.config.ts",
          // experimentalFlattenThemesOnNative: true,
          // disable: true,
          // disableExtraction: true,
        },
      ],
      "react-native-reanimated/plugin",
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "next/router": "./next-router-shim",
          },
        },
      ],
    ],
  };
};
