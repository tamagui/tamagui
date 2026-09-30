const { createTamagui } = require('@tamagui/core')

const { defaultConfig } = require('@tamagui/config/v6')
const { animations } = require('@tamagui/config/animations-css')

module.exports = createTamagui({
  ...defaultConfig,
  animations,
  tokens: {
    ...defaultConfig.tokens,
    // an invalid identifier color token (with hyphen) covers the fix for #3737
    'color-invalid-identifier': 'rgba(255,255,255,0)',
  },
})
