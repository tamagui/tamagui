module.exports = (api) => {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          platform: 'native',
          components: ['tamagui'],
          config: './src/tamagui.config.ts',
          // disable: true,
          // disableExtraction: true,
        },
      ],
      'react-native-reanimated/plugin',
    ],
  }
}
