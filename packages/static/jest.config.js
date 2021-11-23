module.exports = {
  ...require('../../jest.config'),
  globalSetup: './tests/lib/preTest',

  moduleNameMapper: {
    '^react-native$': 'react-native-web',
  },
}
