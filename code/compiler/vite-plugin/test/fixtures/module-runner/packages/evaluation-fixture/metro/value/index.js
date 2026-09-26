globalThis.__tamaguiFixtureMetroFallbackUsed = true

throw new Error('Tamagui package import used the TS-path Metro fallback')

Object.assign(module.exports, require('../../../cjs/value.cjs'))
