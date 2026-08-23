import { describe, expect, test } from 'vitest'
import {
  createModifierRegistry,
  parseValue,
  splitGeometricShorthandValue,
  validatePayloadShape,
} from '../tooling'

describe('payload shape validation', () => {
  test('a multi-component payload on a single-value longhand diagnoses', () => {
    const diagnostic = validatePayloadShape('backgroundColor', 'green red', false)
    expect(diagnostic?.code).toBe('multi-component-single-value')
    // with no base in the program, the message names the likely cause
    expect(diagnostic?.message).toContain('before the first conditional')
  })

  test('with a base present the hint is omitted', () => {
    const diagnostic = validatePayloadShape('backgroundColor', 'green red', true)
    expect(diagnostic?.code).toBe('multi-component-single-value')
    expect(diagnostic?.message).not.toContain('before the first conditional')
  })

  test('single components never diagnose, including functions', () => {
    expect(validatePayloadShape('backgroundColor', 'red', false)).toBeNull()
    expect(
      validatePayloadShape('backgroundColor', 'color-mix(in srgb, red 50%, blue)', false)
    ).toBeNull()
    expect(validatePayloadShape('width', 'calc(100% - 2px)', false)).toBeNull()
    expect(
      validatePayloadShape('paddingTop', 'env(safe-area-inset-top)', true)
    ).toBeNull()
  })

  test('list-valued longhands accept multi-component payloads', () => {
    expect(validatePayloadShape('boxShadow', 'inset 0 2px 4px red', false)).toBeNull()
    expect(
      validatePayloadShape('transform', 'skewX(10deg) rotate(3deg)', false)
    ).toBeNull()
    expect(
      validatePayloadShape('fontFamily', '"Helvetica Neue", serif', false)
    ).toBeNull()
    expect(
      validatePayloadShape('textDecorationLine', 'underline overline', true)
    ).toBeNull()
  })
})

describe('geometric shorthand slot distribution', () => {
  const { registry } = createModifierRegistry({
    mediaNames: ['sm'],
    themeNames: { light: {}, dark: {} },
  })
  const parsedValue = (input: string) => {
    const result = parseValue(input, registry)
    if (!result.ok) throw new Error('parse failed')
    return result.value
  }

  test('two components alternate vertical/horizontal', () => {
    const split = splitGeometricShorthandValue('padding', parsedValue('4 8'))
    expect(split?.errors).toEqual([])
    expect(split?.entries).toEqual([
      { property: 'paddingTop', value: { base: '4', clauses: [] } },
      { property: 'paddingRight', value: { base: '8', clauses: [] } },
      { property: 'paddingBottom', value: { base: '4', clauses: [] } },
      { property: 'paddingLeft', value: { base: '8', clauses: [] } },
    ])
  })

  test('clauses distribute by their own component count', () => {
    const split = splitGeometricShorthandValue('padding', parsedValue('4 8 sm:6'))
    expect(split?.errors).toEqual([])
    expect(split?.entries?.[0]).toEqual({
      property: 'paddingTop',
      value: { base: '4', clauses: [{ modifiers: ['sm'], payload: '6' }] },
    })
    expect(split?.entries?.[1]).toEqual({
      property: 'paddingRight',
      value: { base: '8', clauses: [{ modifiers: ['sm'], payload: '6' }] },
    })
  })

  test('single-component values return null for the ordinary expansion', () => {
    expect(splitGeometricShorthandValue('padding', parsedValue('4'))).toBeNull()
    expect(splitGeometricShorthandValue('padding', parsedValue('4 sm:6'))).toBeNull()
  })

  test('slash syntax and oversized payloads refuse rather than misassign', () => {
    expect(
      splitGeometricShorthandValue('borderRadius', parsedValue('8px / 4px'))
    ).toBeNull()
    const oversized = splitGeometricShorthandValue('gap', parsedValue('1 2 3'))
    expect(oversized?.errors[0]?.code).toBe('unsupported-geometric-payload')
  })

  test('non-geometric props return null', () => {
    expect(splitGeometricShorthandValue('backgroundColor', parsedValue('red'))).toBeNull()
  })
})
