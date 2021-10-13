module.exports = {
  plugins: [
    '@tamagui/babel-plugin',
    [
      '@babel/plugin-syntax-typescript',
      {
        isTSX: true,
      },
    ],
  ],
}
