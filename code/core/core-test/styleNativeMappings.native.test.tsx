import {
  Text,
  View,
  createStyledHOC,
  createStyledContext,
  createTamagui,
  getSplitStyles,
  styled,
  type StaticConfig,
} from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig('native'))
})

function getResultFor(
  props: Record<string, unknown>,
  Component: { staticConfig: StaticConfig } = View
) {
  const result = getSplitStyles(
    props,
    Component.staticConfig,
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
  return result
}

function getStyleFor(
  props: Record<string, unknown>,
  Component: Parameters<typeof getResultFor>[1] = View
) {
  return getResultFor(props, Component)?.style
}

describe('plain css properties are consumed without leaking into native hosts', () => {
  test.each(['color', 'textDecorationColor', 'textShadowColor'])(
    'text style %s is dropped on View and retained on Text',
    (key) => {
      for (const props of [{ [key]: 'red' }, { style: { [key]: 'red' } }]) {
        const view = getResultFor({ width: 123, ...props }, View)
        expect(view?.style).toEqual({ width: 123 })
        expect(view?.viewProps[key]).toBeUndefined()

        const text = getResultFor({ width: 123, ...props }, Text)
        expect(text?.style).toMatchObject({ width: 123, [key]: 'red' })
        expect(text?.viewProps[key]).toBeUndefined()
      }
    }
  )

  test.each([
    ['accentColor', 'red'],
    ['animationDelay', '100ms'],
    ['counterReset', 'section'],
    ['textWrapStyle', 'balance'],
    ['WebkitTextStrokeColor', 'red'],
    ['fillOpacity', 0.5],
    ['fontSizeAdjust', 0.5],
    ['animationIterationCount', 2],
    ['borderImageOutset', 2],
    ['borderImageSlice', 2],
    ['borderImageWidth', 2],
    ['columnCount', 2],
    ['order', 2],
    ['orphans', 2],
    ['tabSize', 2],
    ['widows', 2],
    ['zoom', 2],
    ['lineClamp', 2],
    ['WebkitLineClamp', 2],
    ['borderBlockStyle', 'dashed'],
    ['borderBlockEndStyle', 'dashed'],
    ['borderBlockStartStyle', 'dashed'],
    ['borderInlineStyle', 'dashed'],
    ['borderInlineEndStyle', 'dashed'],
    ['borderInlineStartStyle', 'dashed'],
    ['flexOrder', 2],
    ['flexPositive', 2],
    ['flexNegative', 2],
    ['scaleZ', 2],
    ['font', 'italic bold 16px/20px System'],
    ['textShadow', 'initial'],
    ['backgroundImage', 'initial'],
  ])('unsupported css %s is dropped from props and style objects', (key, value) => {
    for (const Component of [View, Text]) {
      for (const props of [
        { [key]: value },
        { style: { [key]: value } },
        { style: [{ width: 123 }, { [key]: value }] },
        { style: { [key]: { default: value, native: value } } },
      ]) {
        const result = getResultFor({ width: 123, ...props }, Component)
        expect(result?.style).toEqual({ width: 123 })
        expect(result?.style?.[key]).toBeUndefined()
        expect(result?.viewProps[key]).toBeUndefined()
      }
    }
  })

  test('the native global border style survives beside unsupported side styles', () => {
    for (const Component of [View, Text]) {
      for (const props of [
        { borderStyle: 'dashed', borderBlockEndStyle: 'dotted' },
        { style: { borderStyle: 'dashed', borderBlockEndStyle: 'dotted' } },
      ]) {
        const result = getResultFor({ width: 123, ...props }, Component)
        expect(result?.style).toEqual({ width: 123, borderStyle: 'dashed' })
      }
    }
  })

  test('css-named custom HOC props still reach their native receiver', () => {
    const CustomReceiver = createStyledHOC(
      View,
      (_props: { fillOpacity?: boolean }) => null
    )
    expect(CustomReceiver.staticConfig.isHOC).toBe(true)
    const result = getResultFor({ fillOpacity: true }, CustomReceiver)
    expect(result?.viewProps.fillOpacity).toBe(true)
    expect(result?.style?.fillOpacity).toBeUndefined()
  })

  test('explicit inline props retain their native component owner', () => {
    const CustomReceiver = styled(
      (_props: { fillOpacity?: boolean }) => null,
      {},
      {
        inlineProps: new Set(['fillOpacity']),
      }
    )
    expect(CustomReceiver.staticConfig.inlineProps?.has('fillOpacity')).toBe(true)
    const result = getResultFor({ fillOpacity: true }, CustomReceiver)
    expect(result?.viewProps.fillOpacity).toBe(true)
    expect(result?.style?.fillOpacity).toBeUndefined()
  })

  test('explicit native style declarations retain their component owner', () => {
    const CustomReceiver = styled(
      (_props: { style?: { accentColor?: string } }) => null,
      {},
      { validStyles: { accentColor: true } }
    )
    expect(CustomReceiver.staticConfig.validStyles?.accentColor).toBe(true)
    const result = getResultFor({ accentColor: 'red' }, CustomReceiver)
    expect(result?.style?.accentColor).toBe('red')
    expect(result?.viewProps.accentColor).toBeUndefined()
  })

  test('css-named context props retain their native context owner', () => {
    const StyleContext = createStyledContext({ fillOpacity: false })
    const ContextView = styled(View, { context: StyleContext })
    const result = getResultFor({ fillOpacity: true }, ContextView)
    expect(result?.overriddenContextProps?.fillOpacity).toBe(true)
    expect(result?.style?.fillOpacity).toBeUndefined()
  })

  test('a css-named variant still drives native styles', () => {
    const VariantView = styled(View, {
      variants: { accentColor: { true: { opacity: 0.4 } } },
    })
    const result = getResultFor({ accentColor: true }, VariantView)
    expect(result?.style?.opacity).toBe(0.4)
    expect(result?.viewProps.accentColor).toBeUndefined()
  })

  test('native styles and text mappings survive beside unsupported css', () => {
    const result = getResultFor(
      {
        accentColor: 'red',
        width: 123,
        fontSize: 24,
        opacity: 0.4,
        userSelect: 'none',
        textOverflow: 'ellipsis',
      },
      Text
    )
    expect(result?.style).toMatchObject({ width: 123, fontSize: 24, opacity: 0.4 })
    expect(result?.viewProps).toMatchObject({
      selectable: false,
      numberOfLines: 1,
      ellipsizeMode: 'tail',
    })
    expect(result?.viewProps.accentColor).toBeUndefined()
  })

  test.each(['none', 'text'] as const)(
    'userSelect %s maps only to the native Text receiver',
    (value) => {
      const view = getResultFor({ width: 123, userSelect: value }, View)
      expect(view?.style).toEqual({ width: 123 })
      expect(view?.viewProps.selectable).toBeUndefined()
      expect(view?.viewProps.userSelect).toBeUndefined()
      const text = getResultFor({ width: 123, userSelect: value }, Text)
      expect(text?.style).toEqual({ width: 123 })
      expect(text?.viewProps.selectable).toBe(value !== 'none')
      expect(text?.viewProps.userSelect).toBeUndefined()
    }
  )

  test.each([
    ['black', '#000'],
    ['#123456', '#123456'],
  ])(
    'native shadow color %s and gradients still lower to native fields',
    (color, nativeColor) => {
      expect(getStyleFor({ color }, Text)?.color).toBe(nativeColor)
      const result = getResultFor(
        {
          textShadow: `1px 2px 3px ${color}`,
          backgroundImage: 'linear-gradient(90deg, red, blue)',
        },
        Text
      )
      expect(result?.style).toMatchObject({
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 3,
        textShadowColor: nativeColor,
        experimental_backgroundImage: [
          {
            type: 'linear-gradient',
            direction: '90deg',
            colorStops: [{ color: 'red' }, { color: 'blue' }],
          },
        ],
      })
      expect(result?.style?.textShadow).toBeUndefined()
      expect(result?.style?.backgroundImage).toBeUndefined()
      expect(result?.viewProps.textShadow).toBeUndefined()
      expect(result?.viewProps.backgroundImage).toBeUndefined()
    }
  )
})

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
