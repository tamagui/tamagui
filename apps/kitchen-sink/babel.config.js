module.exports = (api) => {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          platform: 'native',
          components: ['tamagui', '@tamagui/sandbox-ui'],
          config: './src/tamagui.config.ts',
          experimentalFlattenThemesOnNative: true,
          // disable: true,
          // disableExtraction: true,
        },
      ],
      'react-native-reanimated/plugin',
    ],
  }
}
