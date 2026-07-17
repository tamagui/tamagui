const fakeReactNative = require('@tamagui/fake-react-native')

const Platform = {
  ...fakeReactNative.Platform,
  OS: 'ios',
  select: (values) => values.ios ?? values.native ?? values.default,
}

module.exports = fakeReactNative
module.exports.Platform = Platform
module.exports.Dimensions = fakeReactNative.Dimensions
module.exports.PanResponder = {
  create: () => ({ panHandlers: {} }),
}
module.exports.useColorScheme = () => 'light'
