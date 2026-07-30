import { beforeAll, expect, test } from 'vitest'

import config from '../config-default'
import { View, createTamagui, getSplitStyles } from '../web/src'

beforeAll(() => {
  const defaultConfig = config.getDefaultTamaguiConfig('native')
  createTamagui({
    ...defaultConfig,
    settings: {
      ...defaultConfig.settings,
      legacyConditionObjects: true,
    },
  } as any)
})

const split = (state: Record<string, any>) =>
  getSplitStyles(
    {
      backgroundColor: 'red',
      hoverStyle: { backgroundColor: 'blue' },
    },
    View.staticConfig,
    undefined as any,
    'light',
    { unmounted: false, ...state } as any,
    { isAnimated: false, noClass: true, resolveValues: 'auto' } as any
  )

test('converted hover object evaluates through native program state', () => {
  const pressed = split({ press: true })
  expect(pressed.style?.backgroundColor).toBe('red')
  expect(pressed.programStates?.has('hover')).toBe(true)

  const hovered = split({ hover: true })
  expect(hovered.style?.backgroundColor).toBe('blue')
})
