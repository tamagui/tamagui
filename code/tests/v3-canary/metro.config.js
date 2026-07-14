const { getDefaultConfig } = require('expo/metro-config')
const { withTamagui } = require('@tamagui/metro-plugin')

module.exports = withTamagui(getDefaultConfig(__dirname), {
  components: ['tamagui', '@tamagui/select', '@tamagui/sheet'],
  config: './tamagui.config.ts',
})
