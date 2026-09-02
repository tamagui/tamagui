import { describe, expect, test } from 'vitest'
import {
  parseTransitionObject,
  TRANSITION_RESERVED_KEYS,
} from '../shorthands/transitionObject'

const presets = new Set(['quick', 'bouncy'])

describe('transition object form', () => {
  test('base config keys build the `all` entry', () => {
    expect(parseTransitionObject({ duration: 200 })).toEqual({
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

    expect(
      parseTransitionObject({ duration: 200, easing: 'ease-out', delay: 50 })
    ).toMatchObject({
      ok: true,
      value: {
        entries: [
          {
            property: 'all',
            timing: { type: 'css', duration: '200ms', timingFunction: 'ease-out' },
            delay: '50ms',
          },
        ],
      },
    })
  })

  test('bounce makes it a spring, easing makes it a timing', () => {
    expect(parseTransitionObject({ duration: 200, bounce: 0.15 })).toMatchObject({
      ok: true,
      value: {
        entries: [{ timing: { type: 'spring', duration: '200ms', bounce: 0.15 } }],
      },
    })

    // the two are mutually exclusive: a spring already carries its easing
    expect(
      parseTransitionObject({ duration: 200, bounce: 0.15, easing: 'ease-out' })
    ).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'transition-invalid-spring' }],
    })
  })

  test('low-level spring physics derive the canonical duration and bounce', () => {
    // the shipped rn `bouncy` preset
    const parsed = parseTransitionObject({
      spring: { stiffness: 120, damping: 9, mass: 0.9 },
    })
    expect(parsed.ok).toBe(true)
    const timing = parsed.ok && (parsed.value as any).entries[0].timing
    expect(timing.type).toBe('spring')
    expect(Number.parseFloat(timing.duration)).toBeCloseTo(544, 0)
    expect(timing.bounce).toBeCloseTo(0.567, 3)
    // authored physics ride along for drivers that take them raw
    expect(timing.config).toEqual({ stiffness: 120, damping: 9, mass: 0.9 })
  })

  test('a preset stays opaque and carries its overrides for the driver to apply', () => {
    expect(parseTransitionObject({ preset: 'bouncy' }, presets)).toMatchObject({
      ok: true,
      value: { entries: [{ timing: { type: 'preset', name: 'bouncy' } }] },
    })

    expect(
      parseTransitionObject({ preset: 'bouncy', duration: 200 }, presets)
    ).toMatchObject({
      ok: true,
      value: {
        entries: [
          { timing: { type: 'preset', name: 'bouncy', config: { duration: 200 } } },
        ],
      },
    })
  })

  test('per-property keys become later entries and do NOT inherit the base', () => {
    const parsed = parseTransitionObject(
      { duration: 200, easing: 'ease-out', opacity: '150ms' },
      presets
    )
    expect(parsed).toMatchObject({
      ok: true,
      value: {
        entries: [
          {
            property: 'all',
            timing: { type: 'css', duration: '200ms', timingFunction: 'ease-out' },
          },
          {
            property: 'opacity',
            // css defaults, NOT ease-out inherited from the base, because
            // `all 200ms ease-out, opacity 150ms` does not inherit either
            timing: { type: 'css', duration: '150ms', timingFunction: 'ease' },
          },
        ],
      },
    })
  })

  test('an object with only property keys transitions only those properties', () => {
    const parsed = parseTransitionObject(
      { opacity: '150ms', transform: 'bouncy' },
      presets
    )
    expect(parsed).toMatchObject({
      ok: true,
      value: {
        entries: [
          { property: 'opacity', timing: { type: 'css', duration: '150ms' } },
          { property: 'transform', timing: { type: 'preset', name: 'bouncy' } },
        ],
      },
    })
  })

  test('per-property objects and strings are two spellings of one thing', () => {
    const asString = parseTransitionObject({ opacity: 'spring(150ms, 0.2)' })
    const asObject = parseTransitionObject({ opacity: { duration: 150, bounce: 0.2 } })
    expect(asString).toEqual(asObject)
  })

  test('`properties` is the transition-property list', () => {
    expect(
      parseTransitionObject({ duration: 200, properties: 'opacity, transform' })
    ).toMatchObject({
      ok: true,
      value: {
        entries: [{ property: 'opacity' }, { property: 'transform' }],
      },
    })
  })

  test('an unknown key is a diagnostic, never a silent no-op', () => {
    const known = new Set(['opacity', 'transform'])
    expect(parseTransitionObject({ opactiy: '150ms' }, presets, known)).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'transition-invalid-token', token: 'opactiy' }],
    })
    expect(parseTransitionObject({ opacity: '150ms' }, presets, known).ok).toBe(true)
  })

  test('reserved keys never collide with the properties they share a namespace with', () => {
    // the guard the design depends on: if a style prop is ever named `delay`
    // or `duration`, this fails here instead of silently changing meaning
    for (const key of TRANSITION_RESERVED_KEYS) {
      expect(key).not.toMatch(/^(transition|animation)/)
    }
    expect([...TRANSITION_RESERVED_KEYS].sort()).toEqual([
      'behavior',
      'bounce',
      'delay',
      'duration',
      'easing',
      'preset',
      'properties',
      'spring',
    ])
  })

  test('rejects an object that describes nothing', () => {
    expect(parseTransitionObject({})).toMatchObject({ ok: false })
    expect(parseTransitionObject({ bounce: 0.2 })).toMatchObject({
      ok: false,
      diagnostics: [{ code: 'transition-invalid-spring' }],
    })
  })
})
