module.exports = {
  plugins: [
    [
      '@tamagui/babel-plugin',
      {
        components: ['tamagui', '@tamagui/test-design-system'],
        platform: 'native',
        config: './tests/lib/tamagui.config.cjs',
        forceExtractStyleDefinitions: true,
        experimentalFlattenThemesOnNative: true,
      },
    ],
    [
      '@babel/plugin-syntax-typescript',
      {
        isTSX: true,
      },
    ],
  ],
}
