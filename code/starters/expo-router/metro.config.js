// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')
const { withTamagui } = require('@tamagui/metro-plugin')

module.exports = withTamagui(getDefaultConfig(__dirname), {
  components: ['tamagui'],
  config: './tamagui.config.ts',
})
