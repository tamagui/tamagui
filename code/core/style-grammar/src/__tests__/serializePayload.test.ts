import { describe, expect, test } from 'vitest'
import {
  resolvePayload,
  serializePayloadNative,
  serializePayloadWeb,
  type ResolvedReference,
} from '..'

// One resolved payload, two targets. Web emits var() references so theme
// switches stay zero-re-render; native looks values up and alpha-composes at
// serialize time. The two must agree on what a color opacity suffix means.

const tokens: Record<string, ResolvedReference> = {
  accent: { name: 'accent', kind: 'color' },
  surface: { name: 'surface', kind: 'color' },
  translucent: { name: 'translucent', kind: 'color' },
  shortHex: { name: 'shortHex', kind: 'color' },
  hexAlpha: { name: 'hexAlpha', kind: 'color' },
  legacyRgb: { name: 'legacyRgb', kind: 'color' },
  legacyRgba: { name: 'legacyRgba', kind: 'color' },
  named: { name: 'named', kind: 'color' },
  glow: { name: 'glow', kind: 'other' },
  4: { name: '4', kind: 'length' },
  8: { name: '8', kind: 'length' },
}

const nativeValues: Record<string, string | number> = {
  accent: '#ff0000',
  surface: '#1e293b',
  translucent: 'rgba(0,0,0,0.5)',
  shortHex: '#f00',
  hexAlpha: '#0003',
  legacyRgb: 'rgb(1, 2, 3)',
  legacyRgba: 'rgba(1, 2, 3, 0.8)',
  named: 'cornflowerblue',
  glow: '0 0 20px #000',
  4: 16,
  8: 32,
}

const resolve = (payload: string, resolveNumbers = false) =>
  resolvePayload(payload, { lookup: (name) => tokens[name], resolveNumbers })

const toVar = (name: string) => `var(--${name})`
const get = (name: string) => nativeValues[name]

const web = (payload: string, resolveNumbers = false) =>
  serializePayloadWeb(resolve(payload, resolveNumbers), toVar)

const native = (
  payload: string,
  opts?: { unit?: 'px-to-number' },
  resolveNumbers = false
) => serializePayloadNative(resolve(payload, resolveNumbers), get, opts)

describe('web serialization', () => {
  test('references become var() and text is untouched', () => {
    expect(web('surface')).toBe('var(--surface)')
    expect(web('1px solid accent')).toBe('1px solid var(--accent)')
    expect(web('linear-gradient(135deg, accent, red)')).toBe(
      'linear-gradient(135deg, var(--accent), red)'
    )
  })

  test('a color opacity suffix becomes color-mix, matching the existing emitter', () => {
    expect(web('accent/50')).toBe(
      'color-mix(in srgb, var(--accent) 50%, transparent)'
    )
    expect(web('0 2px 8px accent/80')).toBe(
      '0 2px 8px color-mix(in srgb, var(--accent) 80%, transparent)'
    )
  })

  test('opacity 0 is emitted, opacity 100 is the identity', () => {
    expect(web('accent/0')).toBe('color-mix(in srgb, var(--accent) 0%, transparent)')
    expect(web('accent/100')).toBe('var(--accent)')
  })

  test('numeric references become var() too', () => {
    expect(web('4 8', true)).toBe('var(--4) var(--8)')
  })
})

describe('native serialization', () => {
  test('references become looked-up values', () => {
    expect(native('surface')).toBe('#1e293b')
    expect(native('1px solid accent')).toBe('1px solid #ff0000')
    expect(native('linear-gradient(135deg, accent, red)')).toBe(
      'linear-gradient(135deg, #ff0000, red)'
    )
  })

  test("opacity alpha-composes at lookup, scaling the color's own alpha", () => {
    expect(native('accent/50')).toBe('rgba(255,0,0,0.5)')
    expect(native('shortHex/50')).toBe('rgba(255,0,0,0.5)')
    expect(native('accent/0')).toBe('rgba(255,0,0,0)')
    // #0003 already carries alpha 0.2, so 50% of it is 0.1, the same as
    // color-mix(in srgb, #0003 50%, transparent) computes on web
    expect(native('hexAlpha/50')).toBe('rgba(0,0,0,0.1)')
    expect(native('translucent/50')).toBe('rgba(0,0,0,0.25)')
    expect(native('legacyRgb/50')).toBe('rgba(1,2,3,0.5)')
    expect(native('legacyRgba/50')).toBe('rgba(1,2,3,0.4)')
  })

  test('opacity 100 leaves the color text exactly as configured', () => {
    expect(native('accent/100')).toBe('#ff0000')
  })

  test('a color form that cannot be composed reports instead of guessing', () => {
    expect(() => native('named/50')).toThrow(
      /not a #hex, rgb\(\), or rgba\(\) color/
    )
    expect(() => native('named/50')).toThrow(/"named"/)
  })
})

describe('native numeric finalization', () => {
  test('a single plain number becomes a number', () => {
    expect(native('4', undefined, true)).toBe(16)
    expect(native('0.5')).toBe(0.5)
    expect(native('-4')).toBe(-4)
    expect(native('2')).toBe(2)
  })

  test('px finalizes only when the caller says the property is unitless', () => {
    expect(native('16px')).toBe('16px')
    expect(native('16px', { unit: 'px-to-number' })).toBe(16)
    expect(native('-2.5px', { unit: 'px-to-number' })).toBe(-2.5)
  })

  test('anything that is not one numeric component value stays a string', () => {
    expect(native('4 8', undefined, true)).toBe('16 32')
    expect(native('16px 4px', { unit: 'px-to-number' })).toBe('16px 4px')
    expect(native('50%')).toBe('50%')
    expect(native('1.2.3')).toBe('1.2.3')
    expect(native('calc(4px + 2px)', { unit: 'px-to-number' })).toBe('calc(4px + 2px)')
    expect(native('px', { unit: 'px-to-number' })).toBe('px')
  })

  test('a numeric token that resolves to a number comes back as a number', () => {
    expect(native('8', undefined, true)).toBe(32)
  })
})

describe('literal payloads round-trip byte for byte', () => {
  const nasty = [
    'url("http://x.com/a:b.png?q=1&r=2") no-repeat center / cover',
    'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, #fff 100%)',
    'calc(100% - var(--gutter, 4px))',
    "'a quoted, string; with #hash and url(x)'",
    '0 2px 8px #0003, inset 0 0 2px rgb(1 2 3)',
    'translate(-4px, 8px) scale(1.05) rotate(45deg)',
    'counter(item, decimal) ". "',
    'cornflowerblue',
  ]

  test('both serializers return the input when every lookup misses', () => {
    for (const payload of nasty) {
      const resolved = resolvePayload(payload, {
        lookup: () => undefined,
        resolveNumbers: true,
      })
      expect(serializePayloadWeb(resolved, toVar), payload).toBe(payload)
      expect(serializePayloadNative(resolved, get), payload).toBe(payload)
    }
  })

  test('references print back to their authored spelling when the target is identity', () => {
    for (const payload of [
      'accent surface',
      'linear-gradient(135deg, accent, red)',
      '0 2px 8px accent',
      'var(--accent, accent)',
    ]) {
      const resolved = resolve(payload)
      expect(serializePayloadWeb(resolved, (name) => name), payload).toBe(payload)
      expect(serializePayloadNative(resolved, (name) => name), payload).toBe(payload)
    }
  })
})
