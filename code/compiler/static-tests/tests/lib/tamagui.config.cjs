const { createTamagui, createTokens } = require('@tamagui/core')
const merge = require('lodash.merge')

const conf = require('@tamagui/config/v3').config

const tokens = createTokens({
  color: {
    'invaild-identifier': '#fff',
  },
})

module.exports = createTamagui(merge(conf, { tokens }))
