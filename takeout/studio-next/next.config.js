const withTamagui = require('@tamagui/next-plugin').withTamagui

module.exports = function (name, { defaultConfig }) {
  let config = {
    ...defaultConfig,
    experimental: {
      appDir: true,
    },
  }

  const tamaguiPlugin = withTamagui({
    config: './tamagui.config.ts',
    components: ['tamagui'],
    disableExtraction: true,
  })

  return {
    ...config,
    ...tamaguiPlugin(config),
  }
}