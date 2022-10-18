module.exports = {
  plugins: [
    [
      '@tamagui/babel-plugin',
      {
        components: ['tamagui', '@tamagui/test-design-system'],
        config: './tests/lib/tamagui.config.js',
        forceExtractStyleDefinitions: true,
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
