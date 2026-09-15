import { Text, View, createTamagui, getSplitStyles } from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig('native'))
})

function getStyleFor(props: Record<string, any>, Component = View) {
  const result = getSplitStyles(
    props,
    (Component as any).staticConfig,
    {} as any,
    '',
    {
      hover: false,
      press: false,
      pressIn: false,
      focus: false,
      focusVisible: false,
      disabled: false,
      unmounted: true,
    },
    {
      isAnimated: false,
      mediaState: undefined,
      noClassNames: false,
      resolveValues: 'auto',
    } as any,
    {},
    {
      animationDriver: {},
      groups: { state: {} },
    } as any,
    undefined,
    undefined,
    true
  )
  return (result as any)?.style
}

describe('direction maps to writingDirection on native', () => {
  test('direction rtl on View becomes writingDirection', () => {
    const style = getStyleFor({ direction: 'rtl' })
    expect(style?.writingDirection).toBe('rtl')
    expect(style?.direction).toBeUndefined()
  })

  test('direction ltr on View becomes writingDirection', () => {
    const style = getStyleFor({ direction: 'ltr' })
    expect(style?.writingDirection).toBe('ltr')
    expect(style?.direction).toBeUndefined()
  })

  test('direction on Text becomes writingDirection', () => {
    const style = getStyleFor({ direction: 'rtl' }, Text)
    expect(style?.writingDirection).toBe('rtl')
    expect(style?.direction).toBeUndefined()
  })
})

describe('verticalAlign maps to textAlignVertical on native', () => {
  test.each([
    ['top', 'top'],
    ['middle', 'center'],
    ['bottom', 'bottom'],
  ] as const)('verticalAlign %s becomes textAlignVertical %s', (input, expected) => {
    const style = getStyleFor({ verticalAlign: input }, Text)
    expect(style?.textAlignVertical).toBe(expected)
    expect(style?.verticalAlign).toBeUndefined()
  })

  test('unsupported verticalAlign values fall back to auto', () => {
    const style = getStyleFor({ verticalAlign: 'baseline' }, Text)
    expect(style?.textAlignVertical).toBe('auto')
  })
})

describe('multi-value shorthands expand on native', () => {
  test('margin with two values splits block and inline', () => {
    const style = getStyleFor({ margin: '10px 20px' })
    expect(style?.marginTop).toBe(10)
    expect(style?.marginBottom).toBe(10)
    expect(style?.marginRight).toBe(20)
    expect(style?.marginLeft).toBe(20)
    expect(style?.margin).toBeUndefined()
  })

  test('padding with four values maps top right bottom left', () => {
    const style = getStyleFor({ padding: '4px 8px 12px 16px' })
    expect(style?.paddingTop).toBe(4)
    expect(style?.paddingRight).toBe(8)
    expect(style?.paddingBottom).toBe(12)
    expect(style?.paddingLeft).toBe(16)
    expect(style?.padding).toBeUndefined()
  })

  test('gap with two values splits to rowGap and columnGap', () => {
    const style = getStyleFor({ gap: '10px 20px' })
    expect(style?.rowGap).toBe(10)
    expect(style?.columnGap).toBe(20)
    expect(style?.gap).toBeUndefined()
  })

  test('gap with one value stays on gap for Yoga to read', () => {
    const style = getStyleFor({ gap: 12 })
    expect(style?.gap).toBe(12)
    expect(style?.rowGap).toBeUndefined()
    expect(style?.columnGap).toBeUndefined()
  })
})
