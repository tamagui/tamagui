module.exports = (api) => {
  api.cache(true)
  return {
    ignore: [/lucide-icons|\/dist\/cjs\//],
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          platform: 'native',
          components: ['tamagui', '@tamagui/sandbox-ui'],
          config: './src/tamagui.config.ts',
          // disable: true,
          // disableExtraction: true,
        },
      ],
      'react-native-reanimated/plugin',
    ],
  }
}
