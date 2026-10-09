import { describe, expect, test } from 'vitest'
import {
  migrateLegacyTransition,
  nativeTransitionCapabilities,
  parseTransition,
  parseTransitionLonghands,
  parseTransitionObject,
  printMigratedTransition,
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
  test('materializes the inherited default and delay into every entry', () => {
    // v2 leaned on inheritance, v3 entries stand alone, so `bouncy` and the
    // 200ms delay have to be written into the lifecycle and property entries
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
    ).toEqual({
      ok: true,
      value: {
        preset: 'bouncy',
        delay: 200,
        spring: { stiffness: 1000 },
        enter: { preset: 'quick', delay: 200 },
        exit: { preset: 'quick', delay: 200 },
        opacity: { preset: 'quick', delay: 200, spring: { overshootClamping: true } },
      },
    })
  })

  test('leaves strings alone when there is no delay to push down', () => {
    expect(
      migrateLegacyTransition(['quick', { opacity: '200ms', enter: '200ms' }], presets)
    ).toEqual({
      ok: true,
      value: { preset: 'quick', enter: '200ms', opacity: '200ms' },
    })
    expect(migrateLegacyTransition('quick', presets)).toEqual({
      ok: true,
      value: 'quick',
    })
  })

  test('converts both origami spring parameterizations to stiffness and damping', () => {
    // the numbers are react-native's own fromOrigamiTensionAndFriction and
    // fromBouncinessAndSpeed, so a migrated spring keeps the motion it had
    expect(migrateLegacyTransition({ tension: 40, friction: 7 }, presets)).toEqual({
      ok: true,
      value: { spring: { stiffness: 230.2, damping: 22 } },
    })
    expect(migrateLegacyTransition({ bounciness: 8, speed: 12 }, presets)).toEqual({
      ok: true,
      value: { spring: { stiffness: 342.101, damping: 24.684 } },
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

  test('folds a v2 animateOnly list into the migrated value', () => {
    // v2 read the list as an exclusive filter over whatever the transition
    // named, which is what a css `transition-property` list already is
    expect(migrateLegacyTransition('quick', presets, ['transform', 'opacity'])).toEqual({
      ok: true,
      value: { preset: 'quick', properties: 'transform, opacity' },
    })
    // an entry the list leaves out was filtered out in v2, so it is dropped
    // rather than quietly surviving as a property the transition still names
    expect(
      migrateLegacyTransition(['quick', { opacity: { type: 'bouncy' } }], presets, [
        'transform',
      ])
    ).toEqual({
      ok: true,
      value: { preset: 'quick', properties: 'transform' },
    })
    // an empty list animated nothing at all
    expect(migrateLegacyTransition('quick', presets, [])).toEqual({
      ok: true,
      value: 'none',
    })
  })

  test('a list with no base timing narrows to the properties still named', () => {
    // no base entry exists for `properties` to apply to, so the answer is the
    // per-property entries the list keeps
    expect(
      migrateLegacyTransition(
        { opacity: { type: 'quick' }, transform: { type: 'bouncy' } },
        presets,
        ['transform']
      )
    ).toEqual({
      ok: true,
      value: { transform: { preset: 'bouncy' } },
    })
  })

  test('a list narrows enter and exit too, since they replace the base', () => {
    expect(
      migrateLegacyTransition(
        ['quick', { enter: 'bouncy', opacity: { type: 'quick' } }],
        presets,
        ['transform']
      )
    ).toEqual({
      ok: true,
      value: {
        preset: 'quick',
        properties: 'transform',
        enter: { preset: 'bouncy', properties: 'transform' },
      },
    })
  })

  test('prints a migrated value back as source the object parser accepts', () => {
    const migrated = migrateLegacyTransition(
      ['quick', { delay: 100, opacity: { type: 'bouncy' } }],
      presets
    )
    expect(migrated.ok).toBe(true)
    if (!migrated.ok) return
    expect(printMigratedTransition(migrated.value)).toBe(
      `{ preset: 'quick', delay: 100, opacity: { preset: 'bouncy', delay: 100 } }`
    )
    expect(parseTransitionObject(migrated.value, presets)).toMatchObject({
      ok: true,
      value: {
        entries: [
          { property: 'all', timing: { type: 'preset', name: 'quick' }, delay: '100ms' },
          {
            property: 'opacity',
            timing: { type: 'preset', name: 'bouncy' },
            delay: '100ms',
          },
        ],
      },
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
    const parsed = parseTransitionObject(migrated.value, presets)
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(
      validateNativeTransition(
        parsed.value,
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

describe('fused timing atoms (presets and springs)', () => {
  test('parses spring() with an optional bounce, defaulting to critically damped', () => {
    expect(parseTransition('spring(200ms)')).toMatchObject({
      ok: true,
      value: {
        entries: [
          {
            property: 'all',
            timing: { type: 'spring', duration: '200ms', bounce: 0 },
            delay: '0s',
          },
        ],
      },
    })

    expect(parseTransition('transform spring(300ms, 0.2) 50ms')).toMatchObject({
      ok: true,
      value: {
        entries: [
          {
            property: 'transform',
            timing: { type: 'spring', duration: '300ms', bounce: 0.2 },
            delay: '50ms',
          },
        ],
      },
    })
  })

  test('a fused atom owns the duration slot, so a lone time is the delay', () => {
    // the whole point of fusing: a preset already carries duration and easing,
    // so the only time value that can still mean anything is the delay. order
    // independent, like every other css shorthand component.
    for (const input of ['bouncy 100ms', '100ms bouncy']) {
      expect(parseTransition(input, presets)).toMatchObject({
        ok: true,
        value: {
          entries: [
            {
              property: 'all',
              timing: { type: 'preset', name: 'bouncy' },
              delay: '100ms',
            },
          ],
        },
      })
    }

    expect(parseTransition('opacity bouncy 50ms', presets)).toMatchObject({
      ok: true,
      value: {
        entries: [
          {
            property: 'opacity',
            timing: { type: 'preset', name: 'bouncy' },
            delay: '50ms',
          },
        ],
      },
    })
  })

  test('rejects composing a fused atom with easing, a second time, or another atom', () => {
    expect(parseTransition('spring(200ms) ease-out')).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'transition-invalid-list' }],
    })
    expect(parseTransition('bouncy ease-out', presets)).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'transition-invalid-list' }],
    })
    expect(parseTransition('spring(200ms) 50ms 100ms')).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'transition-duplicate-component' }],
    })
    expect(parseTransition('bouncy spring(200ms)', presets)).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'transition-duplicate-component' }],
    })
  })

  test('a spring-shaped token with bad arguments is a diagnostic, never a property', () => {
    for (const input of [
      'spring()',
      'spring(abc)',
      'spring(-200ms)',
      'spring(200ms, 2)',
      'spring(200ms, -1)',
      'spring(200ms, nope)',
      'spring(200ms, 0.2, 3)',
    ]) {
      expect(parseTransition(input)).toMatchObject({
        ok: false,
        diagnostics: [{ code: 'transition-invalid-spring' }],
      })
    }
  })

  test('springs have no css spelling, so they never serialize', () => {
    const parsed = parseTransition('opacity spring(200ms, 0.2)')
    expect(parsed.ok).toBe(true)
    expect(parsed.ok && serializeTransition(parsed.value)).toBe(null)
  })
})
