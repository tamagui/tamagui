const { getDefaultTamaguiConfig } = require('@tamagui/config-default')
const { createTamagui } = require('@tamagui/core')

module.exports = createTamagui(getDefaultTamaguiConfig('native'))
