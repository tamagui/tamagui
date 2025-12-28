// Learn more https://docs.expo.io/guides/customizing-metro
/**
 * @type {import('expo/metro-config').MetroConfig}
 */
const { getDefaultConfig } = require('expo/metro-config')
const { withTamagui } = require('@tamagui/metro-plugin')

const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
})

config.resolver.sourceExts.push('mjs')

// withTamagui just ensures CSS is resolvable and loads your config
// For CSS, run `tamagui generate` which outputs to tamagui-web.css
module.exports = withTamagui(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts',
})
