import { describe, expect, test } from 'vitest'
import { validatePayloadShape } from '..'

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
