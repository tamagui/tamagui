const { createTamagui } = require('@tamagui/core')

const conf = require('@tamagui/config/v3').config

// Add an invalid identifier color token (with hyphen) to test the fix for #3737
conf.tokens.color['invaild-identifier'] = conf.tokens.color.white

module.exports = createTamagui(conf)
