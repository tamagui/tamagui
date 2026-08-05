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

// Regression for #3952: the styled() `unstyled: false` variant emits
// `elevate: true`. Because SelectViewportFrame extends YStack (which has no
// `elevate` variant), that value used to leak to the DOM as elevate="true"
// (React "non-boolean attribute" warning) and the shadow was never applied.
describe('Select.Viewport elevate resolution (#3952)', () => {
  test('does not leak `elevate` to the DOM (styled default)', () => {
    const { viewProps } = simplifiedGetSplitStyles(
      SelectViewportFrame,
      { unstyled: false },
      { theme: lightTheme, themeName: 'light' }
    )
    expect(viewProps.elevate).toBeUndefined()
  })

  test('resolves `elevate` to a boxShadow style', () => {
    // SelectViewport always renders the frame with a `size` (size={itemContext.size}),
    // which getElevation uses to compute the shadow offset/radius. A shadowColor is
    // supplied so the offset/radius collapse into a concrete boxShadow rule on web
    // (the default test theme has no shadowColor of its own).
    const { rulesToInsert } = simplifiedGetSplitStyles(
      SelectViewportFrame,
      { unstyled: false, size: '$2', shadowColor: 'red' },
      { theme: lightTheme, themeName: 'light' }
    )
    // If elevate never resolved (the #3952 bug), there would be no boxShadow rule
    // at all. The geometry (0px 8px 16px) comes straight from getElevation('$2').
    const boxShadow = findRuleValue(rulesToInsert, 'boxShadow')
    expect(boxShadow).toBe('0px 8px 16px red')
  })

  test('does not leak `elevate` when unstyled', () => {
    const { viewProps } = simplifiedGetSplitStyles(
      SelectViewportFrame,
      { unstyled: true },
      { theme: lightTheme, themeName: 'light' }
    )
    expect(viewProps.elevate).toBeUndefined()
  })
})
