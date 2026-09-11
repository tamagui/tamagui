const { createTamagui } = require('@tamagui/style')
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
