process.env.TAMAGUI_TARGET = 'web'

import { afterEach, describe, expect, test } from 'vitest'

import config from '../config-default'
import { createTamagui, getConfig, updateConfig } from '../web/src'

const pollutionKey = '__tamaguiPolluted'

describe('updateConfig', () => {
  afterEach(() => {
    delete Object.prototype[pollutionKey]
  })

  test('ignores inherited config keys', () => {
    createTamagui(config.getDefaultTamaguiConfig())

    updateConfig('__proto__', { [pollutionKey]: true })

    expect(Object.prototype).not.toHaveProperty(pollutionKey)
    expect({}).not.toHaveProperty(pollutionKey)
  })

  test('updates own config keys', () => {
    createTamagui(config.getDefaultTamaguiConfig())

    const conf = getConfig()
    const originalTheme = conf.themes.light

    updateConfig('themes', { __updateConfigTest: originalTheme })

    expect(getConfig().themes.__updateConfigTest).toBe(originalTheme)
    delete getConfig().themes.__updateConfigTest
  })
})
