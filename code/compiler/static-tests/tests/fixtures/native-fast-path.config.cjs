const { createTamagui } = require('@tamagui/core')
const { defaultConfig } = require('@tamagui/config/v6')

module.exports = createTamagui({
  ...defaultConfig,
  themes: {
    dark: {
      ...defaultConfig.themes.dark,
      optionalColor: '#123456',
    },
    light: defaultConfig.themes.light,
  },
})
