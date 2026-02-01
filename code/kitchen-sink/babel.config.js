module.exports = (api) => {
  api.cache(true)

  // enable inline RCT transformation for faster View/Text rendering
  const enableInlineRCT = process.env.TAMAGUI_INLINE_RCT === '1'

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
      // inline RCT transformation: <View> -> createElement('RCTView', ...)
      // ~30% faster than regular View by bypassing View.js overhead
      ...(enableInlineRCT
        ? [['@tamagui/native-style-registry/babel', { inlineRCT: true }]]
        : []),
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
