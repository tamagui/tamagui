import type { GetStyleResult } from '@tamagui/web'
import { View, createTamagui, getSplitStyles } from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig('native'))
})

describe('shorthand variables - native', () => {
  // on native, boxShadow/backgroundImage are parsed to RN object format
  // filter stays as string (no RN object equivalent)

  test('boxShadow with $variable resolves token to object format', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px $white',
    })

    expect(style?.boxShadow).toEqual([
      { offsetX: 0, offsetY: 0, blurRadius: 10, color: '#fff' },
    ])
  })

  test('boxShadow with multiple tokens resolves all to objects', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px $white, 0 0 20px $black',
    })

    expect(style?.boxShadow).toEqual([
      { offsetX: 0, offsetY: 0, blurRadius: 10, color: '#fff' },
      { offsetX: 0, offsetY: 0, blurRadius: 20, color: '#000' },
    ])
  })

  test('boxShadow without variables passed through as object', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px red',
    })

    expect(style?.boxShadow).toEqual([
      { offsetX: 0, offsetY: 0, blurRadius: 10, color: 'red' },
    ])
  })

  test('boxShadow with unresolvable $variable keeps token string in object', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px $nonexistent',
    })

    expect(style?.boxShadow).toEqual([
      { offsetX: 0, offsetY: 0, blurRadius: 10, color: '$nonexistent' },
    ])
  })

  test('filter with $variable resolves space token', () => {
    const { style } = getSplitStylesFor({
      filter: 'blur($2)',
    })

    // $2 in space = 7 (size 28 * 0.333 rounded)
    expect(style?.filter).toBe('blur(7)')
  })

  test('filter without variables passed through unchanged', () => {
    const { style } = getSplitStylesFor({
      filter: 'brightness(1.2)',
    })

    expect(style?.filter).toBe('brightness(1.2)')
  })

  // backgroundImage - RN 0.76+ uses experimental_backgroundImage
  // on native, parsed to object array format
  test('backgroundImage with $variable resolves tokens to object format', () => {
    const { style } = getSplitStylesFor({
      backgroundImage: 'linear-gradient(to bottom, $white, $black)',
    })

    expect((style as any)?.experimental_backgroundImage).toEqual([
      {
        type: 'linearGradient',
        direction: 'to bottom',
        colorStops: [{ color: '#fff' }, { color: '#000' }],
      },
    ])
  })

  test('backgroundImage with angle and multiple color stops', () => {
    const { style } = getSplitStylesFor({
      backgroundImage: 'linear-gradient(45deg, $black 0%, $white 50%, $black 100%)',
    })

    expect((style as any)?.experimental_backgroundImage).toEqual([
      {
        type: 'linearGradient',
        direction: '45deg',
        colorStops: [
          { color: '#000', positions: ['0%'] },
          { color: '#fff', positions: ['50%'] },
          { color: '#000', positions: ['100%'] },
        ],
      },
    ])
  })

  test('backgroundImage without variables passed through as object', () => {
    const { style } = getSplitStylesFor({
      backgroundImage: 'linear-gradient(to bottom, red, blue)',
    })

    expect((style as any)?.experimental_backgroundImage).toEqual([
      {
        type: 'linearGradient',
        direction: 'to bottom',
        colorStops: [{ color: 'red' }, { color: 'blue' }],
      },
    ])
  })

  test('backgroundImage with unresolvable $variable keeps token in object', () => {
    const { style } = getSplitStylesFor({
      backgroundImage: 'linear-gradient($nonexistent, $white)',
    })

    // $nonexistent is not a valid direction, so parsed as color stop
    expect((style as any)?.experimental_backgroundImage).toEqual([
      {
        type: 'linearGradient',
        colorStops: [{ color: '$nonexistent' }, { color: '#fff' }],
      },
    ])
  })
})

describe('border shorthand - native', () => {
  // border shorthand expands to borderWidth/borderStyle/borderColor on native

  test('border with width, style and color', () => {
    const { style } = getSplitStylesFor({
      border: '1px solid red',
    })

    // border expands to borderWidth/borderStyle/borderColor which then expand further
    expect(style?.borderTopWidth).toBe(1)
    expect(style?.borderRightWidth).toBe(1)
    expect(style?.borderBottomWidth).toBe(1)
    expect(style?.borderLeftWidth).toBe(1)
    expect(style?.borderStyle).toBe('solid')
    expect(style?.borderTopColor).toBe('red')
    expect(style?.borderRightColor).toBe('red')
    expect(style?.borderBottomColor).toBe('red')
    expect(style?.borderLeftColor).toBe('red')
  })

  test('border with $variable color resolves token', () => {
    const { style } = getSplitStylesFor({
      border: '2px dashed $white',
    })

    expect(style?.borderTopWidth).toBe(2)
    expect(style?.borderStyle).toBe('dashed')
    expect(style?.borderTopColor).toBe('#fff')
  })

  test('border with just width and style', () => {
    const { style } = getSplitStylesFor({
      border: '1px solid',
    })

    expect(style?.borderTopWidth).toBe(1)
    expect(style?.borderStyle).toBe('solid')
  })

  test('border "none" expands to borderWidth: 0', () => {
    const { style } = getSplitStylesFor({
      border: 'none',
    })

    expect(style?.borderTopWidth).toBe(0)
  })

  test('border with different order (color first)', () => {
    const { style } = getSplitStylesFor({
      border: 'blue 2px dotted',
    })

    expect(style?.borderTopWidth).toBe(2)
    expect(style?.borderStyle).toBe('dotted')
    expect(style?.borderTopColor).toBe('blue')
  })
})

describe('outline shorthand - native', () => {
  // outline shorthand expands to outlineWidth/outlineStyle/outlineColor on native

  test('outline with width, style and color', () => {
    const { style } = getSplitStylesFor({
      outline: '2px solid red',
    })

    expect(style?.outlineWidth).toBe(2)
    expect(style?.outlineStyle).toBe('solid')
    expect(style?.outlineColor).toBe('red')
  })

  test('outline with $variable color resolves token', () => {
    const { style } = getSplitStylesFor({
      outline: '2px dashed $white',
    })

    expect(style?.outlineWidth).toBe(2)
    expect(style?.outlineStyle).toBe('dashed')
    expect(style?.outlineColor).toBe('#fff')
  })

  test('outline "none" sets outlineWidth to 0', () => {
    const { style } = getSplitStylesFor({
      outline: 'none',
    })

    expect(style?.outlineWidth).toBe(0)
    expect(style?.outlineStyle).toBe('none')
  })

  test('outline with just width and style', () => {
    const { style } = getSplitStylesFor({
      outline: '1px solid',
    })

    expect(style?.outlineWidth).toBe(1)
    expect(style?.outlineStyle).toBe('solid')
  })
})

describe('border shorthand with media queries - native', () => {
  test('border in $sm applies when media state sm is true', () => {
    const { style } = getSplitStylesFor({ $sm: { border: '2px solid green' } }, View, {
      mediaState: { sm: true },
    })

    expect(style?.borderTopWidth).toBe(2)
    expect(style?.borderStyle).toBe('solid')
    expect(style?.borderTopColor).toBe('green')
  })

  test('border in $sm does not apply when media state sm is false', () => {
    const { style } = getSplitStylesFor({ $sm: { border: '2px solid green' } }, View, {
      mediaState: { sm: false },
    })

    expect(style?.borderTopWidth).toBeUndefined()
    expect(style?.borderStyle).toBeUndefined()
    expect(style?.borderTopColor).toBeUndefined()
  })

  test('border in $sm with token resolves when media matches', () => {
    const { style } = getSplitStylesFor({ $sm: { border: '1px dashed $white' } }, View, {
      mediaState: { sm: true },
    })

    expect(style?.borderTopWidth).toBe(1)
    expect(style?.borderStyle).toBe('dashed')
    expect(style?.borderTopColor).toBe('#fff')
  })
})

function getSplitStylesFor(
  props: Record<string, unknown>,
  Component: { staticConfig: Parameters<typeof getSplitStyles>[1] } = View,
  options?: { mediaState?: Record<string, boolean> }
): GetStyleResult {
  return getSplitStyles(
    props,
    Component.staticConfig,
    {} as any,
    '',
    {
      hover: false,
      press: false,
      pressIn: false,
      focus: false,
      unmounted: true,
      disabled: false,
      focusVisible: false,
    },
    {
      isAnimated: false,
      resolveValues: 'value',
      mediaState: options?.mediaState,
    },
    undefined,
    undefined,
    undefined,
    undefined
  )!
}
