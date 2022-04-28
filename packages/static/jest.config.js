module.exports = {
  ...require('../../jest.config'),
  globalSetup: './tests/lib/preTest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/__mocks__/styleMock.js',
    '^react-native$': 'react-native-web',
    '^@gorhom/bottom-sheet$': '@tamagui/proxy-worm',
  },
}
