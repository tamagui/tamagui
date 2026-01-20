module.exports = (api) => {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui', '@tamagui/sandbox-ui'],
          config: './src/tamagui.config.ts',
        },
      ],
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            'next/router': './next-router-shim',
          },
        },
      ],
    ],
  }
}
