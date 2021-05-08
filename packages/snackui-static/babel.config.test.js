module.exports = {
  plugins: [
    '@snackui/babel-plugin',
    [
      '@babel/plugin-syntax-typescript',
      {
        isTSX: true,
      },
    ],
  ],
}
