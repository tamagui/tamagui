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

describe('direction keeps Yoga layout direction and maps writingDirection on native', () => {
  test('direction rtl on View keeps direction and sets writingDirection', () => {
    const style = getStyleFor({ direction: 'rtl' })
    expect(style?.direction).toBe('rtl')
    expect(style?.writingDirection).toBe('rtl')
  })

  test('direction ltr on View keeps direction and sets writingDirection', () => {
    const style = getStyleFor({ direction: 'ltr' })
    expect(style?.direction).toBe('ltr')
    expect(style?.writingDirection).toBe('ltr')
  })

  test('direction on Text keeps direction and sets writingDirection', () => {
    const style = getStyleFor({ direction: 'rtl' }, Text)
    expect(style?.direction).toBe('rtl')
    expect(style?.writingDirection).toBe('rtl')
  })

  test('direction inherit keeps Yoga inherit and maps writingDirection to auto', () => {
    const style = getStyleFor({ direction: 'inherit' })
    expect(style?.direction).toBe('inherit')
    expect(style?.writingDirection).toBe('auto')
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

describe('visibility lowers to opacity and pointerEvents on native', () => {
  test('visibility hidden emits opacity 0 plus pointerEvents none and no visibility key', () => {
    const style = getStyleFor({ visibility: 'hidden' })
    expect(style?.opacity).toBe(0)
    expect(style?.pointerEvents).toBe('none')
    expect(style?.visibility).toBeUndefined()
  })

  test('visibility visible emits none of the lowered props', () => {
    const style = getStyleFor({ visibility: 'visible' })
    expect(style?.opacity).toBeUndefined()
    expect(style?.pointerEvents).toBeUndefined()
    expect(style?.visibility).toBeUndefined()
  })
})

describe('border and outline shorthands expand to parsed longhands on native', () => {
  test('border width plus style splits to numeric side widths and borderStyle', () => {
    const style = getStyleFor({ border: '1px solid' })
    expect(style?.borderTopWidth).toBe(1)
    expect(style?.borderRightWidth).toBe(1)
    expect(style?.borderBottomWidth).toBe(1)
    expect(style?.borderLeftWidth).toBe(1)
    expect(style?.borderStyle).toBe('solid')
    expect(style?.border).toBeUndefined()
  })

  test('outline none drops Fabric-incompatible outline keys entirely', () => {
    const style = getStyleFor({ outline: 'none' })
    expect(style?.outlineWidth).toBeUndefined()
    expect(style?.outlineStyle).toBeUndefined()
    expect(style?.outlineColor).toBeUndefined()
    expect(style?.outline).toBeUndefined()
  })

  test('outline width plus style plus color splits to parsed outline longhands', () => {
    const style = getStyleFor({ outline: '2px solid red' })
    expect(style?.outlineWidth).toBe(2)
    expect(style?.outlineStyle).toBe('solid')
    expect(style?.outlineColor).toBe('red')
    expect(style?.outline).toBeUndefined()
  })
})
