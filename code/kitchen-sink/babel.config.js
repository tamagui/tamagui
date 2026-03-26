module.exports = (api) => {
  api.cache(true)

  const plugins = []

  // skip tamagui compiler for faster builds (e.g. detox test runs)
  if (!process.env.DISABLE_COMPILER) {
    plugins.push([
      '@tamagui/babel-plugin',
      {
        components: ['tamagui', '@tamagui/sandbox-ui'],
        config: './src/tamagui.config.ts',
      },
    ])
  }

  plugins.push('react-native-reanimated/plugin', [
    'module-resolver',
    {
      root: ['./'],
      alias: {
        'next/router': './next-router-shim',
      },
    },
  ])

  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins,
  }
}
