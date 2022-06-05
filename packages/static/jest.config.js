module.exports = {
  ...require('../../jest.config'),
  globalSetup: './tests/lib/preTest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/__mocks__/styleMock.js',
    '^react-native$': 'react-native-web',
    '^react-native-reanimated$': '@tamagui/proxy-worm',
    '^react-native-gesture-handler$': '@tamagui/proxy-worm',
    '^react-native-safe-area-context$': '@tamagui/fake-react-native',
    '^@gorhom/bottom-sheet$': '@tamagui/proxy-worm',
  },
}
