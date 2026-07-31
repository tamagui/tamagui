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

  test('a legacy group media segment becomes a container query on the group', () => {
    // v2 groups are containers; `$group-frame-sm` measured the frame group
    expect(convert('$group-frame-sm', { color: 'red' })?.contributions[0].clause).toEqual(
      {
        modifiers: ['@sm/frame'],
        payload: 'red',
      }
    )
    // media plus state splits into both conditions on one clause
    expect(
      convert('$group-frame-sm-hover', { color: 'red' })?.contributions[0].clause
    ).toEqual({
      modifiers: ['@sm/frame', 'group-hover/frame'],
      payload: 'red',
    })
    // the normalized unnamed group keeps its `true` name so the container
    // query matches the `t_group_true` container-name legacy CSS still sets
    expect(convert('$group-true-sm', { color: 'red' })?.contributions[0].clause).toEqual({
      modifiers: ['@sm/true'],
      payload: 'red',
    })
  })

  test('a group media key with no container form is an error, not a wrong query', () => {
    const result = convert('$group-frame-hoverNone', { color: 'red' })
    expect(result?.contributions).toEqual([])
    expect(result?.errors[0]?.code).toBe('unregistered-legacy-condition')
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

  test('composes nested platform chains outer to inner', () => {
    expect(
      convert('$platform-ios', {
        $sm: {
          hoverStyle: {
            padding: 4,
          },
        },
      })
    ).toEqual({
      contributions: [
        {
          prop: 'padding',
          clause: { modifiers: ['ios', 'sm', 'hover'], payload: '4px' },
        },
      ],
      errors: [],
    })
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
            'legacy token in "$color.red" uses dot-path naming; rename it to one configured flat token name before conversion',
        },
      ],
    })
  })

  test('converts the transform family, carrying each prop its unit', () => {
    // the family exists now, which is what unblocks the codemod's transform flags
    expect(convert('hoverStyle', { scale: 1 })).toEqual({
      contributions: [{ prop: 'scale', clause: { modifiers: ['hover'], payload: '1' } }],
      errors: [],
    })
    expect(convert('enterStyle', { scale: 0.9 }).contributions).toEqual([
      { prop: 'scale', clause: { modifiers: ['enter'], payload: '0.9' } },
    ])
    // x/y are lengths, rotate is an angle, scale is unitless
    expect(convert('enterStyle', { y: 10 }).contributions).toEqual([
      { prop: 'y', clause: { modifiers: ['enter'], payload: '10px' } },
    ])
    expect(convert('hoverStyle', { rotate: 45 }).contributions).toEqual([
      { prop: 'rotate', clause: { modifiers: ['hover'], payload: '45deg' } },
    ])
    expect(convert('enterStyle', { y: 0 }).contributions).toEqual([
      { prop: 'y', clause: { modifiers: ['enter'], payload: '0' } },
    ])
  })

  test('transform parts outside the family still reject', () => {
    const result = convert('hoverStyle', { skewX: '10deg' })
    expect(result.contributions).toEqual([])
    expect(result.errors[0]).toMatchObject({
      code: 'legacy-transform-part',
      path: 'hoverStyle.skewX',
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
