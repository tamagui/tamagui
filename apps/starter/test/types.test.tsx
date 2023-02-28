import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { Variable, createTamagui } from '@tamagui/core'
import { assertType, describe, test } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

describe('Types', () => {
  test(`config.themes`, () => {
    // not working?
    assertType<Variable<any>>(conf.themes.dark.background)
    assertType<boolean>(conf.themes.dark.background)
    assertType<boolean>('string')
  })
})
