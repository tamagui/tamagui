const { withTamagui } = require('@tamagui/next-plugin')
const { config } = require('@tamagui/config/v3')
const { createTamagui } = require('tamagui')

const tamaguiConfig = createTamagui(config)

module.exports = function (name, { defaultConfig }) {
  let config = {
    ...defaultConfig,
    // ...your configuration
  }

  const tamaguiPlugin = withTamagui({
    config: tamaguiConfig,
    components: ['tamagui'],
    appDir: true,
  })

  return {
    ...config,
    ...tamaguiPlugin(config),
  }
}
