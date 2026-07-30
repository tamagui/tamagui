import { describe, expect, test } from 'vitest'
import {
  convertLegacyConditionProp,
  createModifierRegistry,
  pseudoToModifier,
  unitlessNumberProperties,
} from '..'

const { registry } = createModifierRegistry({
  mediaNames: ['sm', 'md'],
  themeNames: { dark: {}, light: {} },
})

const convert = (propName: string, value: unknown) =>
  convertLegacyConditionProp(propName, value, { registry })

describe('legacy condition names', () => {
  test.each(Object.entries(pseudoToModifier))('maps %s to %s', (propName, modifier) => {
    expect(convert(propName, { color: 'red' })).toEqual({
      contributions: [
        {
          prop: 'color',
          clause: { modifiers: [modifier], payload: 'red' },
        },
      ],
      errors: [],
    })
  })

  test('maps theme, platform, and media props through the registry', () => {
    expect(convert('$theme-dark', { color: 'red' })?.contributions[0].clause).toEqual({
      modifiers: ['dark'],
      payload: 'red',
    })
    expect(convert('$platform-ios', { color: 'red' })?.contributions[0].clause).toEqual({
      modifiers: ['ios'],
      payload: 'red',
    })
    expect(convert('$sm', { color: 'red' })?.contributions[0].clause).toEqual({
      modifiers: ['sm'],
      payload: 'red',
    })
  })

  test('maps unnamed and named legacy groups', () => {
    expect(convert('$group-hover', { color: 'red' })?.contributions[0].clause).toEqual({
      modifiers: ['group-hover'],
      payload: 'red',
    })
    expect(
      convert('$group-card-hover', { color: 'red' })?.contributions[0].clause
    ).toEqual({
      modifiers: ['group-hover/card'],
      payload: 'red',
    })
  })

  test('uses the longest registered state suffix with dashed group names', () => {
    expect(
      convert('$group-menu-card-focus-visible', {
        color: 'red',
      })?.contributions[0].clause
    ).toEqual({
      modifiers: ['group-focus-visible/menu-card'],
      payload: 'red',
    })
  })

  test('unknown dollar and ordinary props fall through to normal handling', () => {
    expect(convert('$whatever', { color: 'red' })).toBeNull()
    expect(convert('color', 'red')).toBeNull()
  })
})

describe('legacy object traversal', () => {
  test('converts the plan theme and hover objects into independent clauses', () => {
    const hover = convert('hoverStyle', { bg: '$surfaceHover' })
    const theme = convert('$theme-dark', { bg: '$surfaceDark' })

    expect([...hover!.contributions, ...theme!.contributions]).toEqual([
      {
        prop: 'bg',
        clause: { modifiers: ['hover'], payload: 'surfaceHover' },
      },
      {
        prop: 'bg',
        clause: { modifiers: ['dark'], payload: 'surfaceDark' },
      },
    ])
  })

  test('composes nested media and pseudo modifiers outer to inner', () => {
    expect(
      convert('$sm', {
        hoverStyle: {
          bg: 'red',
        },
      })
    ).toEqual({
      contributions: [
        {
          prop: 'bg',
          clause: { modifiers: ['sm', 'hover'], payload: 'red' },
        },
      ],
      errors: [],
    })
  })

  test('keeps authored shorthand keys for downstream expansion', () => {
    expect(convert('hoverStyle', { p: 4 })?.contributions).toEqual([
      {
        prop: 'p',
        clause: { modifiers: ['hover'], payload: '4px' },
      },
    ])
  })
})

describe('legacy style values', () => {
  test('strips one token prefix and passes other strings through', () => {
    expect(
      convert('hoverStyle', {
        color: '$red',
        backgroundImage: 'linear-gradient(red, blue)',
      })?.contributions
    ).toEqual([
      {
        prop: 'color',
        clause: { modifiers: ['hover'], payload: 'red' },
      },
      {
        prop: 'backgroundImage',
        clause: {
          modifiers: ['hover'],
          payload: 'linear-gradient(red, blue)',
        },
      },
    ])
  })

  test('adds px except for mirrored unitless properties', () => {
    expect(unitlessNumberProperties.has('opacity')).toBe(true)
    expect(unitlessNumberProperties.has('zIndex')).toBe(true)
    expect(unitlessNumberProperties.has('flexGrow')).toBe(true)
    expect(
      convert('hoverStyle', {
        width: 4,
        opacity: 0.5,
        zIndex: 2,
        flexGrow: 1,
      })?.contributions
    ).toEqual([
      {
        prop: 'width',
        clause: { modifiers: ['hover'], payload: '4px' },
      },
      {
        prop: 'opacity',
        clause: { modifiers: ['hover'], payload: '0.5' },
      },
      {
        prop: 'zIndex',
        clause: { modifiers: ['hover'], payload: '2' },
      },
      {
        prop: 'flexGrow',
        clause: { modifiers: ['hover'], payload: '1' },
      },
    ])
  })

  test('rejects dot-path token names with a naming diagnostic', () => {
    expect(convert('hoverStyle', { color: '$color.red' })).toEqual({
      contributions: [],
      errors: [
        {
          code: 'legacy-token-dot-path',
          path: 'hoverStyle.color',
          message:
            'legacy token "$color.red" uses dot-path naming; rename it to one configured flat token name before conversion',
        },
      ],
    })
  })

  test('rejects transform parts with the required diagnostic code', () => {
    expect(convert('hoverStyle', { scale: 1 })).toEqual({
      contributions: [],
      errors: [
        {
          code: 'legacy-transform-part',
          path: 'hoverStyle.scale',
          message:
            'legacy transform part "scale" cannot be converted until the transform family is defined',
        },
      ],
    })
  })

  test.each([
    ['boolean', true],
    ['null', null],
    ['object', { value: 1 }],
    ['array', [1, 2]],
  ])('rejects a %s style value', (_label, value) => {
    expect(convert('hoverStyle', { color: value })).toMatchObject({
      contributions: [],
      errors: [
        {
          code: 'unsupported-legacy-value',
          path: 'hoverStyle.color',
        },
      ],
    })
  })
})
