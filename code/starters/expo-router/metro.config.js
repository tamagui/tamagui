// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')
const { withTamagui } = require('@tamagui/metro-plugin')

const config = getDefaultConfig(__dirname)

// withTamagui loads your tamagui config and watches for changes in dev
module.exports = withTamagui(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts',
})
