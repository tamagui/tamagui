import { describe, expect, test } from 'vitest'
import {
  migrateLegacyTransition,
  nativeTransitionCapabilities,
  parseTransition,
  parseTransitionLonghands,
  serializeTransition,
  validateNativeTransition,
} from '../tooling'

const presets = new Set(['quick', 'bouncy', '200ms', 'ease'])

describe('transition grammar', () => {
  test('fills CSS defaults and parses comma lists without splitting functions', () => {
    expect(parseTransition('200ms', presets)).toEqual({
      ok: true,
      value: {
        kind: 'transition',
        entries: [
          {
            property: 'all',
            timing: { type: 'css', duration: '200ms', timingFunction: 'ease' },
            delay: '0s',
            behavior: 'normal',
          },
        ],
      },
    })

    const parsed = parseTransition(
      'opacity 150ms ease-out, transform 250ms cubic-bezier(0.2, 0, 0, 1) 50ms'
    )
    expect(parsed).toMatchObject({
      ok: true,
      value: {
        entries: [
          {
            property: 'opacity',
            timing: { duration: '150ms', timingFunction: 'ease-out' },
            delay: '0s',
          },
          {
            property: 'transform',
            timing: {
              duration: '250ms',
              timingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
            },
            delay: '50ms',
          },
        ],
      },
    })
    if (parsed.ok) {
      expect(serializeTransition(parsed.value)).toBe(
        'opacity 150ms ease-out 0s normal, transform 250ms cubic-bezier(0.2, 0, 0, 1) 50ms normal'
      )
    }
  })

  test('uses exact config-first presets while reserving CSS syntax', () => {
    expect(parseTransition('quick', presets)).toMatchObject({
      ok: true,
      value: {
        entries: [{ timing: { type: 'preset', name: 'quick' } }],
      },
    })
    expect(parseTransition('200ms', presets)).toMatchObject({
      ok: true,
      value: {
        entries: [{ timing: { type: 'css', duration: '200ms' } }],
      },
    })
    expect(parseTransition('ease', presets)).toMatchObject({
      ok: true,
      value: {
        entries: [{ timing: { type: 'css', timingFunction: 'ease' } }],
      },
    })
    const preset = parseTransition('quick', presets)
    expect(preset.ok && serializeTransition(preset.value)).toBeNull()
  })

  test('normalizes longhands with CSS list repetition', () => {
    const parsed = parseTransitionLonghands({
      transitionProperty: 'opacity, transform',
      transitionDuration: '150ms, 250ms',
      transitionTimingFunction: 'ease-out, cubic-bezier(0.2, 0, 0, 1)',
      transitionDelay: '50ms',
    })
    expect(parsed).toMatchObject({
      ok: true,
      value: {
        entries: [
          { property: 'opacity', delay: '50ms' },
          { property: 'transform', delay: '50ms' },
        ],
      },
    })
    const none = parseTransitionLonghands({
      transitionProperty: 'none',
      transitionDuration: '150ms',
    })
    expect(none.ok && serializeTransition(none.value)).toBeNull()
  })

  test('diagnoses malformed CSS instead of passing it through', () => {
    expect(parseTransition('opacity -100ms')).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'transition-invalid-duration' }],
    })
    expect(parseTransition('opacity 100ms,')).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'transition-empty-item' }],
    })
    expect(parseTransition('none 100ms, opacity 200ms')).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'transition-invalid-list' }],
    })
    expect(parseTransition('none 100ms')).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'transition-invalid-list' }],
    })
    expect(parseTransition('inherit, opacity 100ms')).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'transition-invalid-list' }],
    })
    expect(parseTransition('opacity 100ms steps(1, jump-none)')).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'transition-invalid-token' }],
    })
    expect(
      parseTransitionLonghands({
        transitionProperty: 'inherit',
        transitionDuration: '100ms',
      })
    ).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'transition-invalid-list' }],
    })
  })
})

describe('legacy transition migration', () => {
  test('preserves default, per-property, lifecycle, delay, and spring config', () => {
    expect(
      migrateLegacyTransition(
        [
          'bouncy',
          {
            delay: 200,
            enter: 'quick',
            exit: 'quick',
            stiffness: 1000,
            opacity: { type: 'quick', overshootClamping: true },
          },
        ],
        presets
      )
    ).toMatchObject({
      ok: true,
      value: {
        kind: 'transition',
        enter: {
          property: 'all',
          timing: { type: 'preset', name: 'quick' },
          delay: '200ms',
        },
        exit: {
          property: 'all',
          timing: { type: 'preset', name: 'quick' },
          delay: '200ms',
        },
        config: { stiffness: 1000 },
        entries: [
          {
            property: 'all',
            timing: {
              type: 'preset',
              name: 'bouncy',
              config: { stiffness: 1000 },
            },
            delay: '200ms',
          },
          {
            property: 'opacity',
            timing: {
              type: 'preset',
              name: 'quick',
              config: { overshootClamping: true },
            },
            delay: '200ms',
          },
        ],
      },
    })
  })

  test('migrates duration-shaped legacy values with CSS semantics', () => {
    expect(
      migrateLegacyTransition(['quick', { opacity: '200ms', enter: '200ms' }], presets)
    ).toMatchObject({
      ok: true,
      value: {
        enter: {
          timing: { type: 'css', duration: '200ms', timingFunction: 'ease' },
        },
        entries: [
          { timing: { type: 'preset', name: 'quick' } },
          {
            property: 'opacity',
            timing: { type: 'css', duration: '200ms', timingFunction: 'ease' },
          },
        ],
      },
    })
  })

  test('requires a preset type for property-only configuration', () => {
    expect(
      migrateLegacyTransition({ opacity: { overshootClamping: true } }, presets)
    ).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'transition-invalid-token', token: 'opacity' }],
    })
  })
})

describe('native transition capabilities', () => {
  test('records only the sourced RN capability steps and interpolation behavior', () => {
    expect(
      nativeTransitionCapabilities.map(
        ({ minimumReactNativeMinor, interpolation }) =>
          `${minimumReactNativeMinor}:${interpolation}`
      )
    ).toEqual([
      '82:continuous',
      '84:continuous',
      '84:discrete',
      '84:discrete',
      '85:continuous',
    ])
    expect(
      nativeTransitionCapabilities.find(({ properties }) => properties.includes('cursor'))
        ?.platforms
    ).toEqual(['ios'])
  })

  test('accepts supported native timing and versioned properties', () => {
    const parsed = parseTransition(
      'opacity 150ms ease-out, width 250ms cubic-bezier(0.2, 0, 0, 1)'
    )
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(
      validateNativeTransition(parsed.value, {
        platform: 'ios',
        reactNativeMinor: 85,
      })
    ).toEqual({ ok: true })
    expect(
      validateNativeTransition(parsed.value, {
        platform: 'ios',
        reactNativeMinor: 84,
      })
    ).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'native-transition-property', property: 'width' }],
    })
  })

  test('diagnoses unsupported native behavior without approximation', () => {
    const parsed = parseTransition(
      'opacity 150ms steps(2, end) -50ms, display 0s allow-discrete'
    )
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(
      validateNativeTransition(parsed.value, {
        platform: 'android',
        reactNativeMinor: 86,
        androidApi: 35,
      })
    ).toMatchObject({
      ok: false,
      diagnostics: [
        { code: 'native-transition-timing', property: 'opacity' },
        { code: 'native-transition-delay', property: 'opacity' },
        { code: 'native-transition-behavior', property: 'display' },
        { code: 'native-transition-property', property: 'display' },
      ],
    })
  })

  test('validates migrated lifecycle timing against native capabilities', () => {
    const migrated = migrateLegacyTransition({ enter: '150ms steps(2, end)' }, presets)
    expect(migrated.ok).toBe(true)
    if (!migrated.ok) return
    expect(
      validateNativeTransition(
        migrated.value,
        { platform: 'ios', reactNativeMinor: 86 },
        { opacity: '1' }
      )
    ).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'native-transition-timing', property: 'all' }],
    })
  })

  test('requires concrete properties for all and rejects discrete properties', () => {
    const parsed = parseTransition('200ms')
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return

    expect(
      validateNativeTransition(parsed.value, {
        platform: 'ios',
        reactNativeMinor: 86,
      })
    ).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'native-transition-property', property: 'all' }],
    })
    expect(
      validateNativeTransition(
        parsed.value,
        { platform: 'ios', reactNativeMinor: 86 },
        { opacity: '1', pointerEvents: 'none' }
      )
    ).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'native-transition-property', property: 'pointerEvents' }],
    })
  })

  test('enforces platform filter limits', () => {
    const parsed = parseTransition('filter 200ms')
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(
      validateNativeTransition(
        parsed.value,
        { platform: 'ios', reactNativeMinor: 86 },
        { filter: 'blur(4px)' }
      )
    ).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'native-transition-filter' }],
    })
    expect(
      validateNativeTransition(
        parsed.value,
        { platform: 'ios', reactNativeMinor: 86 },
        { filter: 'brightness(0.8) opacity(0.5)' }
      )
    ).toEqual({ ok: true })
    expect(
      validateNativeTransition(
        parsed.value,
        { platform: 'android', reactNativeMinor: 82, androidApi: 35 },
        { filter: 'blur(4px)' }
      )
    ).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'native-transition-filter' }],
    })
    expect(
      validateNativeTransition(
        parsed.value,
        { platform: 'android', reactNativeMinor: 86, androidApi: 35 },
        { filter: 'sepia(0.5)' }
      )
    ).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'native-transition-filter' }],
    })
  })
})
