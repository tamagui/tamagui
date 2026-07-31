import { Text, View, createTamagui, getSplitStyles } from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig('native'))
})

function getSplitStylesFor(props: Record<string, any>, Component = View) {
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
}

describe('RN 0.76+ Style Alignment - Native', () => {
  // boxShadow is parsed to RN object format on native
  describe('boxShadow', () => {
    test('boxShadow parsed to object format', () => {
      const { style } = getSplitStylesFor({
        boxShadow: '5px 5px 10px red',
      })
      expect(style?.boxShadow).toEqual([
        { offsetX: 5, offsetY: 5, blurRadius: 10, color: 'red' },
      ])
    })

    test('boxShadow with tokens resolves them', () => {
      const { style } = getSplitStylesFor({
        boxShadow: '0 0 10px $white',
      })
      expect(style?.boxShadow).toBeDefined()
      expect(style?.boxShadow).toEqual([
        { offsetX: 0, offsetY: 0, blurRadius: 10, color: '#fff' },
      ])
    })

    test('boxShadow with multiple shadows', () => {
      const { style } = getSplitStylesFor({
        boxShadow: '0 0 10px red, 0 0 20px blue',
      })
      expect(style?.boxShadow).toEqual([
        { offsetX: 0, offsetY: 0, blurRadius: 10, color: 'red' },
        { offsetX: 0, offsetY: 0, blurRadius: 20, color: 'blue' },
      ])
    })

    test('boxShadow inset syntax', () => {
      const { style } = getSplitStylesFor({
        boxShadow: 'inset 0 2px 4px black',
      })
      // config-first resolution reaches the shadow path since the program
      // engine owns native boxShadow strings (0b3b28cde9): `black` is a
      // configured color token and resolves to its native value, matching
      // the item-11 pins for every other value position
      expect(style?.boxShadow).toEqual([
        { inset: true, offsetX: 0, offsetY: 2, blurRadius: 4, color: '#000' },
      ])
    })
  })

  describe('filter', () => {
    test('filter string passed through directly', () => {
      const { style } = getSplitStylesFor({
        filter: 'brightness(1.2)',
      })
      expect(style?.filter).toBe('brightness(1.2)')
    })

    test('filter with tokens resolves them', () => {
      const { style } = getSplitStylesFor({
        filter: 'blur($2)',
      })
      expect(style?.filter).toBeDefined()
      expect(style?.filter).not.toContain('$2')
    })

    test('filter multiple functions', () => {
      const { style } = getSplitStylesFor({
        filter: 'blur(10px) brightness(1.2)',
      })
      expect(style?.filter).toBe('blur(10px) brightness(1.2)')
    })

    test('filter drop-shadow', () => {
      const { style } = getSplitStylesFor({
        filter: 'drop-shadow(5px 5px 10px red)',
      })
      expect(style?.filter).toBe('drop-shadow(5px 5px 10px red)')
    })
  })

  describe('mixBlendMode', () => {
    test('mixBlendMode passes through', () => {
      const { style } = getSplitStylesFor({
        mixBlendMode: 'multiply',
      })
      expect(style?.mixBlendMode).toBe('multiply')
    })
  })

  describe('isolation', () => {
    test('isolation passes through', () => {
      const { style } = getSplitStylesFor({
        isolation: 'isolate',
      })
      expect(style?.isolation).toBe('isolate')
    })
  })

  describe('boxSizing', () => {
    test('boxSizing passes through', () => {
      const { style } = getSplitStylesFor({
        boxSizing: 'content-box',
      })
      expect(style?.boxSizing).toBe('content-box')
    })
  })

  describe('outline props', () => {
    test('outlineColor with token resolves', () => {
      const { style } = getSplitStylesFor({
        outlineColor: '$white',
      })
      expect(style?.outlineColor).toBeDefined()
      expect(style?.outlineColor).not.toContain('$')
    })

    test('outlineWidth passes through', () => {
      const { style } = getSplitStylesFor({
        outlineWidth: 2,
      })
      expect(style?.outlineWidth).toBe(2)
    })

    test('outlineStyle passes through', () => {
      const { style } = getSplitStylesFor({
        outlineStyle: 'dashed',
      })
      expect(style?.outlineStyle).toBe('dashed')
    })

    test('outlineOffset passes through', () => {
      const { style } = getSplitStylesFor({
        outlineOffset: 4,
      })
      expect(style?.outlineOffset).toBe(4)
    })
  })

  describe('display contents', () => {
    test('display contents passes through', () => {
      const { style } = getSplitStylesFor({
        display: 'contents',
      })
      expect(style?.display).toBe('contents')
    })
  })
})

describe('conditional (program) values reach the same RN formats', () => {
  // review Phase-6-item-2 gaps: the program evaluator's generic fallback
  // bypassed the renames/parses the unconditional path performs
  test('a backgroundImage program parses and renames like the unconditional path', () => {
    const value = 'linear-gradient(to right, red, blue)'
    const unconditional = getSplitStylesFor({ backgroundImage: value })
    const conditional = getSplitStylesFor({
      backgroundImage: `${value} hover:linear-gradient(to left, red, blue)`,
    })
    expect((unconditional.style as any)?.experimental_backgroundImage).toBeDefined()
    expect((conditional.style as any)?.experimental_backgroundImage).toEqual(
      (unconditional.style as any)?.experimental_backgroundImage
    )
    expect((conditional.style as any)?.backgroundImage).toBeUndefined()
  })

  test('a fontVariant program produces the RN array, not a CSS list string', () => {
    const conditional = getSplitStylesFor(
      { fontVariant: 'small-caps tabular-nums hover:oldstyle-nums' },
      Text
    )
    expect((conditional.style as any)?.fontVariant).toEqual([
      'small-caps',
      'tabular-nums',
    ])
  })
})

describe('gradient position grammar', () => {
  test('px positions normalize to numeric points, percents stay strings', () => {
    // sourced from RN's own getPositionFromCSSValue (processBackgroundImage.js):
    // px -> parseFloat number; % -> string; anything else invalidates the
    // gradient. RN's object path accepts numbers or %-strings only
    const result = getSplitStylesFor({
      backgroundImage: 'linear-gradient(to bottom, red 100px, blue 50%)',
    })
    const gradient = (result.style as any)?.experimental_backgroundImage?.[0]
    expect(gradient?.colorStops).toEqual([
      { color: 'red', positions: [100] },
      { color: 'blue', positions: ['50%'] },
    ])
  })

  test('a position unit RN cannot read declines the parse into RN\'s hands', () => {
    const result = getSplitStylesFor({
      backgroundImage: 'linear-gradient(to bottom, red 2em, blue)',
    })
    // no half-parsed object: the string passes through untouched for RN's own
    // parser to reject, never a shape RN reads wrong
    expect((result.style as any)?.experimental_backgroundImage).toBeUndefined()
  })
})

describe('gradient direction grammar', () => {
  test('gradient directions accept the forms RN 0.83 accepts', () => {
    // sourced from react-native/Libraries/StyleSheet/processBackgroundImage.js:
    // LINEAR_GRADIENT_ANGLE_UNIT_REGEX = /^([+-]?\d*\.?\d+)(deg|grad|rad|turn)$/i
    // LINEAR_GRADIENT_DIRECTION_REGEX = /^to\s+(top|bottom|left|right).../i
    for (const direction of ['-45deg', '+45deg', '.5turn', 'TO BOTTOM', 'to Right']) {
      const result = getSplitStylesFor({
        backgroundImage: `linear-gradient(${direction}, red, blue)`,
      })
      const gradient = (result.style as any)?.experimental_backgroundImage?.[0]
      expect(gradient?.direction, direction).toBe(direction)
      expect(gradient?.colorStops, direction).toEqual([
        { color: 'red' },
        { color: 'blue' },
      ])
    }
  })
})
