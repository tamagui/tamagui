const { getDefaultConfig } = require('expo/metro-config')
const { withTamagui } = require('@tamagui/metro-plugin')

const config = getDefaultConfig(__dirname)

// rn 0.87 publishes polyfills through its package instead of rn-get-polyfills.
config.serializer.getPolyfills = ({ platform }) =>
  platform ? require('@react-native/js-polyfills')() : []

module.exports = withTamagui(config, {
  components: ['tamagui', '@tamagui/select', '@tamagui/sheet', '@tamagui/tailwind'],
  config: './tamagui.config.ts',
})
