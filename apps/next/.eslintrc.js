module.exports = {
  extends: ['next', 'custom'],
  overrides: [
    {
      files: ['next.config.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
}
