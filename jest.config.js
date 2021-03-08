module.exports = {
  testMatch: ['**/tests/*.[jt]s?(x)'],
  transform: {
    '^.+\\.[jt]sx?$': 'esbuild-jest',
  },
  bail: true,
  transformIgnorePatterns: ['node_modules/(?!@expo)/'],
  testTimeout: 20000,
  // verbose: true,
}
