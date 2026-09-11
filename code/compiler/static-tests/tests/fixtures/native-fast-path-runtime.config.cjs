const { getDefaultTamaguiConfig } = require('@tamagui/config-default')
const { createTamagui } = require('@tamagui/style')

module.exports = createTamagui(getDefaultTamaguiConfig('native'))
