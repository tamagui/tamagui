import { describe, expect, test } from 'bun:test'
import { createModifierRegistry } from '../src/grammar'
import {
  convertLegacyConditionProp,
  pseudoToModifier,
} from '../src/legacyConditions'

const { registry } = createModifierRegistry({
  mediaNames: ['sm', 'md'],
  themeNames: { dark: {}, light: {} },
})

const convert = (propName: string, value: unknown) =>
  convertLegacyConditionProp(propName, value, { registry })

describe('legacy condition names stay migration-only', () => {
  test.each(Object.entries(pseudoToModifier))('maps %s to %s', (propName, modifier) => {
    expect(convert(propName, { color: 'red' })).toEqual({
      contributions: [
        { prop: 'color', clause: { modifiers: [modifier], payload: 'red' } },
      ],
      errors: [],
    })
  })

  test('maps theme, platform, and media conditions through the registry', () => {
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

  test('maps named groups and their container sizes', () => {
    expect(convert('$group-card-hover', { color: 'red' })?.contributions[0].clause)
      .toEqual({ modifiers: ['group-hover/card'], payload: 'red' })
    expect(
      convert('$group-frame-sm-hover', { color: 'red' })?.contributions[0].clause
    ).toEqual({
      modifiers: ['@sm/frame', 'group-hover/frame'],
      payload: 'red',
    })
  })

  test('composes nested conditions outer to inner', () => {
    expect(
      convert('$platform-ios', {
        $sm: { hoverStyle: { padding: 4 } },
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
})

describe('legacy condition payloads', () => {
  test('strips token prefixes and adds property units', () => {
    expect(
      convert('hoverStyle', {
        color: '$red',
        width: 4,
        opacity: 0.5,
        rotate: 45,
      })?.contributions
    ).toEqual([
      { prop: 'color', clause: { modifiers: ['hover'], payload: 'red' } },
      { prop: 'width', clause: { modifiers: ['hover'], payload: '4px' } },
      { prop: 'opacity', clause: { modifiers: ['hover'], payload: '0.5' } },
      { prop: 'rotate', clause: { modifiers: ['hover'], payload: '45deg' } },
    ])
  })

  test('rejects dot-path names and transform parts outside the flat family', () => {
    expect(convert('hoverStyle', { color: '$color.red' })?.errors[0]).toMatchObject({
      code: 'legacy-token-dot-path',
      path: 'hoverStyle.color',
    })
    expect(convert('hoverStyle', { skewX: '10deg' })?.errors[0]).toMatchObject({
      code: 'legacy-transform-part',
      path: 'hoverStyle.skewX',
    })
  })

  test('rejects dynamic object-shaped payloads', () => {
    expect(convert('hoverStyle', { color: { value: 1 } })?.errors[0]).toMatchObject({
      code: 'unsupported-legacy-value',
      path: 'hoverStyle.color',
    })
  })
})
