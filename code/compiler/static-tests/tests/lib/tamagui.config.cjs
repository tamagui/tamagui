const { createTamagui } = require('@tamagui/core')

const { defaultConfig } = require('@tamagui/config/v5')
const { animations } = require('@tamagui/config/v5-css')

module.exports = createTamagui({
  ...defaultConfig,
  animations,
  tokens: {
    ...defaultConfig.tokens,
    color: {
      // an invalid identifier color token (with hyphen) covers the fix for #3737
      'invalid-identifier': 'rgba(255,255,255,0)',
    },
  },
})
