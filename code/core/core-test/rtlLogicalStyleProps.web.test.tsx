process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { TamaguiProvider, View, createTamagui } from '@tamagui/core'

const conf = createTamagui(getDefaultTamaguiConfig())

/**
 * Regression for GitHub issue #3099.
 *
 * react-native spells its RTL-aware props the way an old CSS draft did —
 * padding-start, border-end-color, border-top-start-radius, start/end. No browser
 * implements those, so every rule generated for them was inert and the props did
 * nothing at all on web. They are renamed to the CSS logical properties instead.
 */

// react-native name -> the css declaration it has to end up as
const CASES: Array<[string, number | string, string]> = [
  ['paddingStart', 20, 'padding-inline-start: 20px'],
  ['paddingEnd', 5, 'padding-inline-end: 5px'],
  ['marginStart', 10, 'margin-inline-start: 10px'],
  ['marginEnd', 11, 'margin-inline-end: 11px'],
  ['borderStartWidth', 1, 'border-inline-start-width: 1px'],
  ['borderEndWidth', 2, 'border-inline-end-width: 2px'],
  ['borderStartColor', 'red', 'border-inline-start-color: red'],
  ['borderEndColor', 'blue', 'border-inline-end-color: blue'],
  ['borderTopStartRadius', 3, 'border-start-start-radius: 3px'],
  ['borderTopEndRadius', 4, 'border-start-end-radius: 4px'],
  ['borderBottomStartRadius', 5, 'border-end-start-radius: 5px'],
  ['borderBottomEndRadius', 6, 'border-end-end-radius: 6px'],
  ['start', 7, 'inset-inline-start: 7px'],
  ['end', 8, 'inset-inline-end: 8px'],
]

function cssText() {
  return Array.from(document.styleSheets)
    .flatMap((sheet) => {
      try {
        return Array.from(sheet.cssRules)
      } catch {
        return []
      }
    })
    .map((rule) => rule.cssText)
    .join('\n')
}

describe('react-native RTL style props on web', () => {
  for (const [prop, value, expected] of CASES) {
    test(`${prop} emits ${expected.split(':')[0]}`, () => {
      render(
        <TamaguiProvider config={conf} defaultTheme="light">
          <View {...{ [prop]: value }} />
        </TamaguiProvider>
      )
      expect(cssText()).toContain(expected)
    })
  }

  test('none of them emit the non-existent draft properties', () => {
    render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <View
          paddingStart={20}
          paddingEnd={5}
          marginStart={10}
          marginEnd={11}
          borderStartWidth={1}
          borderEndColor="blue"
          borderTopStartRadius={3}
          start={7}
        />
      </TamaguiProvider>
    )
    const css = cssText()
    for (const dead of [
      'padding-start:',
      'padding-end:',
      'margin-start:',
      'margin-end:',
      'border-start-width:',
      'border-end-color:',
      'border-top-start-radius:',
    ]) {
      expect(css).not.toContain(dead)
    }
    // `start: 7px` as its own declaration — guard against a bare `start` rule
    expect(css).not.toMatch(/[{;]\s*start:/)
  })

  test('the browser actually applies the renamed property', () => {
    const { container } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <View id="rtl-applied" paddingStart={20} />
      </TamaguiProvider>
    )
    const node = container.querySelector('#rtl-applied')!
    expect(getComputedStyle(node).paddingInlineStart).toBe('20px')
  })
})
