process.env.TAMAGUI_TARGET = 'web'

import { SelectViewportFrame } from '../../ui/select/src/SelectViewport'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import {
  StyleObjectProperty,
  StyleObjectValue,
  createTamagui,
  getConfig,
} from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

let lightTheme: any

beforeAll(() => {
  // @ts-ignore
  createTamagui(config.getDefaultTamaguiConfig())
  lightTheme = getConfig().themes.light
})

function findRuleValue(rulesToInsert: Record<string, any>, property: string): any {
  for (const rule of Object.values(rulesToInsert)) {
    if (rule[StyleObjectProperty] === property) {
      return rule[StyleObjectValue]
    }
  }
  return undefined
}

describe('Select.Viewport neutral behavior frame', () => {
  test('does not supply framework-owned elevation', () => {
    const { viewProps } = simplifiedGetSplitStyles(
      SelectViewportFrame,
      {},
      { theme: lightTheme, themeName: 'light' }
    )
    expect(viewProps.elevation).toBeUndefined()
  })

  test('retains an explicit caller-owned box shadow', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(
      SelectViewportFrame,
      { boxShadow: '0 4px 8px red' },
      { theme: lightTheme, themeName: 'light' }
    )
    const boxShadow = findRuleValue(rulesToInsert, 'boxShadow')
    expect(boxShadow).toBe('0 4px 8px red')
  })
})
